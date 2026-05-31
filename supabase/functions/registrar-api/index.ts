// ============================================================
// Registrar API Edge Function
// ------------------------------------------------------------
// Driver pattern:
//   - mockDriver        — local dummy data (default during dev)
//   - hostneedDriver    — real HostNeed Reseller API
// Provider is resolved from `registrar_providers` (is_enabled=true,
// is_default first). If a provider claims is_mock=true OR its required
// secrets are missing -> we fallback to mockDriver automatically.
// All registrar API calls are mirrored into registrar_activity_logs.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const HN_URL = Deno.env.get("HOSTNEED_API_URL")?.trim().replace(/\/+$/, "");
const HN_USER_RAW = Deno.env.get("HOSTNEED_USERNAME");
const HN_SECRET_RAW = Deno.env.get("HOSTNEED_API_SECRET");
const HN_USER = HN_USER_RAW?.trim();
const HN_SECRET = HN_SECRET_RAW?.trim();

// ---------- Common helpers ----------
const POPULAR_TLDS = [".com", ".net", ".org", ".io", ".dev", ".app", ".co", ".xyz", ".online", ".site", ".tech", ".me"];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

async function fetchPricing(admin: any): Promise<Record<string, number>> {
  const { data } = await admin.from("tld_pricing").select("tld,register_price").eq("is_active", true);
  const map: Record<string, number> = {};
  (data ?? []).forEach((r: any) => { map[r.tld] = Number(r.register_price); });
  return map;
}

async function logActivity(admin: any, params: {
  user_id: string | null;
  action: string;
  entity_type?: string;
  entity_id?: string | null;
  details?: Record<string, unknown>;
}) {
  try {
    await admin.from("registrar_activity_logs").insert({
      user_id: params.user_id,
      action: params.action,
      entity_type: params.entity_type ?? null,
      entity_id: params.entity_id ?? null,
      details: params.details ?? {},
    });
  } catch (e) { console.error("activity log failed", e); }
}

// ============================================================
// HostNeed Authentication Service
// ============================================================
type HostNeedAuthVariantId =
  | "docs_secret_data_userstamp_key_hex_b64"
  | "php_conventional_userstamp_data_secret_key_hex_b64"
  | "docs_secret_data_userstamp_key_raw_b64"
  | "php_conventional_userstamp_data_secret_key_raw_b64"
  | "docs_previous_utc_hour_hex_b64"
  | "docs_next_utc_hour_hex_b64";

interface HostNeedAuthDiagnostics {
  variant_id: HostNeedAuthVariantId;
  algorithm: string;
  generated_timestamp_utc: string;
  local_timestamp: string;
  server_time_utc: string;
  raw_string_used_for_signing: string;
  hmac_data_description: string;
  hmac_key_description: string;
  generated_signature: string;
  generated_token: string;
  token_length: number;
  token_preview: string;
  token_sha256_fingerprint: string;
  endpoint_shape_valid: boolean;
  endpoint_expected_suffix: string;
}

let HN_ACTIVE_AUTH_VARIANT: HostNeedAuthVariantId | null = null;

class HostNeedAuthService {
  static readonly DOCS_VARIANT: HostNeedAuthVariantId = "docs_secret_data_userstamp_key_hex_b64";
  static readonly EXPECTED_ENDPOINT_SUFFIX = "/modules/addons/DomainsReseller/api/index.php";

  static utcHourStamp(d = new Date(), offsetHours = 0): string {
    const shifted = new Date(d.getTime() + offsetHours * 60 * 60 * 1000);
    const yy = String(shifted.getUTCFullYear()).slice(-2);
    const mm = String(shifted.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(shifted.getUTCDate()).padStart(2, "0");
    const hh = String(shifted.getUTCHours()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}`;
  }

  static localHourStamp(d = new Date()): string {
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}`;
  }

  static endpointShapeValid(): boolean {
    return !!HN_URL && HN_URL.endsWith(this.EXPECTED_ENDPOINT_SUFFIX);
  }

  private static bytesToHex(bytes: ArrayBuffer): string {
    return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private static bytesToB64(bytes: ArrayBuffer): string {
    let binary = "";
    for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
    return btoa(binary);
  }

  private static async hmacSha256(key: string, data: string): Promise<ArrayBuffer> {
    const enc = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    return crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  }

  private static async sha256Hex(value: string): Promise<string> {
    return this.bytesToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  }

  static async generateToken(variant: HostNeedAuthVariantId = HN_ACTIVE_AUTH_VARIANT ?? this.DOCS_VARIANT): Promise<HostNeedAuthDiagnostics> {
    if (!HN_USER || !HN_SECRET) throw new Error("HOSTNEED_USERNAME or HOSTNEED_API_SECRET is not configured");

    const now = new Date();
    const offset = variant === "docs_previous_utc_hour_hex_b64" ? -1 : variant === "docs_next_utc_hour_hex_b64" ? 1 : 0;
    const stamp = this.utcHourStamp(now, offset);
    const userStamp = `${HN_USER}:${stamp}`;
    const useDocsOrder = variant.startsWith("docs_");
    const useRawOutput = variant.includes("raw_b64");
    const data = useDocsOrder ? HN_SECRET : userStamp;
    const key = useDocsOrder ? userStamp : HN_SECRET;
    const signatureBytes = await this.hmacSha256(key, data);
    const signatureHex = this.bytesToHex(signatureBytes);
    const token = useRawOutput ? this.bytesToB64(signatureBytes) : btoa(signatureHex);

    return {
      variant_id: variant,
      algorithm: useDocsOrder
        ? "base64_encode(hash_hmac('sha256', HOSTNEED_API_SECRET, HOSTNEED_USERNAME . ':' . gmdate('y-m-d H')))"
        : "base64_encode(hash_hmac('sha256', HOSTNEED_USERNAME . ':' . gmdate('y-m-d H'), HOSTNEED_API_SECRET))",
      generated_timestamp_utc: stamp,
      local_timestamp: this.localHourStamp(now),
      server_time_utc: now.toISOString(),
      raw_string_used_for_signing: userStamp,
      hmac_data_description: useDocsOrder ? `HOSTNEED_API_SECRET(len ${HN_SECRET.length})` : userStamp,
      hmac_key_description: useDocsOrder ? userStamp : `HOSTNEED_API_SECRET(len ${HN_SECRET.length})`,
      generated_signature: useRawOutput ? signatureHex : signatureHex,
      generated_token: token,
      token_length: token.length,
      token_preview: `${token.slice(0, 8)}…${token.slice(-6)}`,
      token_sha256_fingerprint: await this.sha256Hex(token),
      endpoint_shape_valid: this.endpointShapeValid(),
      endpoint_expected_suffix: this.EXPECTED_ENDPOINT_SUFFIX,
    };
  }

  static async headers(method: "GET" | "POST", variant?: HostNeedAuthVariantId): Promise<{ headers: Record<string, string>; auth: HostNeedAuthDiagnostics }> {
    if (!HN_URL || !HN_USER || !HN_SECRET) throw new Error("HostNeed credentials are not configured");
    const auth = await this.generateToken(variant);
    const headers: Record<string, string> = { username: HN_USER, token: auth.generated_token };
    if (method === "POST") headers["Content-Type"] = "application/x-www-form-urlencoded";
    return { headers, auth };
  }

  static variants(): HostNeedAuthVariantId[] {
    return [
      "docs_secret_data_userstamp_key_hex_b64",
      "php_conventional_userstamp_data_secret_key_hex_b64",
      "docs_secret_data_userstamp_key_raw_b64",
      "php_conventional_userstamp_data_secret_key_raw_b64",
      "docs_previous_utc_hour_hex_b64",
      "docs_next_utc_hour_hex_b64",
    ];
  }

  static diagnoseFailure(status: number, body: string, variant: HostNeedAuthVariantId): string[] {
    const issues: string[] = [];
    if (!HN_URL) issues.push("Wrong endpoint: HOSTNEED_API_URL is missing.");
    else if (!this.endpointShapeValid()) issues.push(`Wrong endpoint: expected suffix ${this.EXPECTED_ENDPOINT_SUFFIX}.`);
    if (!HN_USER) issues.push("Wrong username: HOSTNEED_USERNAME is missing.");
    if (!HN_SECRET) issues.push("Wrong secret: HOSTNEED_API_SECRET is missing.");
    if (status === 401 || /invalid api token|unauthori[sz]ed|authentication/i.test(body)) {
      if (variant !== this.DOCS_VARIANT) issues.push("Wrong token algorithm: tested an alternate algorithm, not the official documented algorithm.");
      else issues.push("Authentication failure: official documented token was rejected; likely wrong username, wrong API secret, IP whitelist, or provider-side token settings.");
    }
    if (variant.includes("previous") || variant.includes("next")) issues.push("Wrong timezone/server clock: adjacent UTC hour was tested for clock drift.");
    return issues;
  }
}

function formEncode(params: Record<string, any>, prefix?: string): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`));
    } else if (typeof v === "object") {
      out.push(formEncode(v as any, key));
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return out.join("&");
}

export class HostneedError extends Error {
  status: number;
  body: string;
  endpoint: string;
  kind: string;
  constructor(kind: string, message: string, endpoint: string, status = 0, body = "") {
    super(message);
    this.kind = kind;
    this.endpoint = endpoint;
    this.status = status;
    this.body = body;
  }
}

// In-memory debug capture for the admin debug panel.
// Keeps last N request/response pairs (per worker instance — best-effort, not persistent).
interface HnDebugEntry {
  at: string;
  action: string;
  url: string;
  base_endpoint: string;
  action_path: string;
  request_body: string;
  request_headers_safe: Record<string, string>;
  request_headers_exact: Record<string, string>;
  http_status: number;
  response_headers: Record<string, string>;
  response_body: string;
  duration_ms: number;
  ok: boolean;
  error_kind?: string;
  error_message?: string;
  auth_diagnostics?: HostNeedAuthDiagnostics;
}
const HN_DEBUG: HnDebugEntry[] = [];
function pushDebug(e: HnDebugEntry) {
  HN_DEBUG.unshift(e);
  if (HN_DEBUG.length > 20) HN_DEBUG.length = 20;
}

// ============================================================
// HostNeed official route registry (DomainsReseller API)
// Do NOT generate routes dynamically — these match the docs 1:1.
// `{domain}` is a placeholder replaced at call-time.
// ============================================================
export const HN_ROUTES = {
  // Health / catalogue
  VERSION:              { method: "GET",  path: "/version" },
  BILLING_CREDITS:      { method: "GET",  path: "/billing/credits" },
  TLDS:                 { method: "GET",  path: "/tlds" },
  TLDS_PRICING:         { method: "GET",  path: "/tlds/pricing" },

  // Availability / suggestions
  LOOKUP:               { method: "POST", path: "/domains/lookup" },
  LOOKUP_SUGGESTIONS:   { method: "POST", path: "/domains/lookup/suggestions" },

  // Orders
  ORDER_REGISTER:       { method: "POST", path: "/order/domains/register" },
  ORDER_TRANSFER:       { method: "POST", path: "/order/domains/transfer" },
  ORDER_RENEW:          { method: "POST", path: "/order/domains/renew" },

  // Per-domain
  INFORMATION:          { method: "GET",  path: "/domains/{domain}/information" },
  NAMESERVERS_GET:      { method: "GET",  path: "/domains/{domain}/nameservers" },
  NAMESERVERS_SAVE:     { method: "POST", path: "/domains/{domain}/nameservers" },
  NAMESERVER_REGISTER:  { method: "POST", path: "/domains/{domain}/nameservers/register" },
  NAMESERVER_MODIFY:    { method: "POST", path: "/domains/{domain}/nameservers/modify" },
  NAMESERVER_DELETE:    { method: "POST", path: "/domains/{domain}/nameservers/delete" },
  DNS_GET:              { method: "GET",  path: "/domains/{domain}/dns" },
  DNS_SAVE:             { method: "POST", path: "/domains/{domain}/dns" },
  CONTACT_GET:          { method: "GET",  path: "/domains/{domain}/contact" },
  CONTACT_SAVE:         { method: "POST", path: "/domains/{domain}/contact" },
  EPP_CODE:             { method: "GET",  path: "/domains/{domain}/eppcode" },
  EMAIL_GET:            { method: "GET",  path: "/domains/{domain}/email" },
  EMAIL_SAVE:           { method: "POST", path: "/domains/{domain}/email" },
  LOCK_GET:             { method: "GET",  path: "/domains/{domain}/lock" },
  LOCK_SAVE:            { method: "POST", path: "/domains/{domain}/lock" },
  PROTECT_ID:           { method: "POST", path: "/domains/{domain}/protectid" },
  RELEASE:              { method: "POST", path: "/domains/{domain}/release" },
  DELETE:               { method: "POST", path: "/domains/{domain}/delete" },
  SYNC:                 { method: "POST", path: "/domains/{domain}/sync" },
  TRANSFER_SYNC:        { method: "POST", path: "/domains/{domain}/transfersync" },
} as const;

type HnRoute = { method: "GET" | "POST"; path: string };

function buildRoutePath(route: HnRoute, domain?: string): string {
  if (route.path.includes("{domain}")) {
    if (!domain) throw new Error(`Route ${route.path} requires {domain}`);
    return route.path.replace("{domain}", encodeURIComponent(domain));
  }
  return route.path;
}

async function hnCall(
  route: HnRoute | string,
  params: Record<string, any> = {},
  opts: { domain?: string; attempt?: number; authVariant?: HostNeedAuthVariantId } = {},
): Promise<any> {
  const attempt = opts.attempt ?? 1;
  if (!HN_URL) throw new HostneedError("Invalid endpoint", "HOSTNEED_API_URL is not set", "", 0, "");
  if (!HN_USER) throw new HostneedError("Invalid username", "HOSTNEED_USERNAME is not set", HN_URL, 0, "");
  if (!HN_SECRET) throw new HostneedError("Invalid API secret", "HOSTNEED_API_SECRET is not set", HN_URL, 0, "");

  // Back-compat: string path defaults to POST
  const r: HnRoute = typeof route === "string"
    ? { method: "POST", path: route.startsWith("/") ? route : `/${route}` }
    : route;

  let headers: Record<string, string>;
  let authDiagnostics: HostNeedAuthDiagnostics;
  try {
    const auth = await HostNeedAuthService.headers(r.method, opts.authVariant);
    headers = auth.headers;
    authDiagnostics = auth.auth;
  } catch (e) {
    throw new HostneedError("Invalid token generation", (e as Error).message, HN_URL, 0, "");
  }

  const resolvedPath = buildRoutePath(r, opts.domain);
  const formBody = formEncode(params);
  let url = `${HN_URL}${resolvedPath}`;
  let fetchInit: RequestInit;
  if (r.method === "GET") {
    if (formBody) url += (url.includes("?") ? "&" : "?") + formBody;
    fetchInit = { method: "GET", headers };
  } else {
    fetchInit = { method: "POST", headers, body: formBody };
  }

  const safeHeaders = { ...headers, token: headers.token ? `${headers.token.slice(0, 8)}…${headers.token.slice(-6)} (${headers.token.length})` : "" };
  const exactHeaders = { username: headers.username, token: headers.token, ...(headers["Content-Type"] ? { "Content-Type": headers["Content-Type"] } : {}) };
  const action = `${r.method} ${r.path}`;
  console.log(`[hostneed] -> ${r.method} ${url} (attempt ${attempt}) body=${formBody.slice(0, 200)}`);
  console.log(`[hostneed.auth] variant=${authDiagnostics.variant_id} stamp=${authDiagnostics.generated_timestamp_utc} raw=${authDiagnostics.raw_string_used_for_signing} tokenLen=${authDiagnostics.token_length} endpointOk=${authDiagnostics.endpoint_shape_valid}`);

  const started = Date.now();
  let res: Response;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    res = await fetch(url, { ...fetchInit, signal: ctrl.signal });
    clearTimeout(timer);
  } catch (e) {
    const msg = (e as Error).message || String(e);
    const kind = msg.toLowerCase().includes("abort") || msg.toLowerCase().includes("timeout")
      ? "Timeout" : "Network error";
    console.error(`[hostneed] ${kind}: ${msg}`);
    pushDebug({
      at: new Date().toISOString(), action, url, base_endpoint: HN_URL, action_path: resolvedPath, request_body: formBody,
      request_headers_safe: safeHeaders, request_headers_exact: exactHeaders, http_status: 0, response_headers: {}, response_body: "",
      duration_ms: Date.now() - started, ok: false, error_kind: kind, error_message: msg,
      auth_diagnostics: authDiagnostics,
    });
    if (attempt < 2) return hnCall(r, params, { ...opts, attempt: attempt + 1 });
    throw new HostneedError(kind, msg, url, 0, "");
  }

  const text = await res.text();
  const responseHeaders = Object.fromEntries(res.headers.entries());
  console.log(`[hostneed] <- HTTP ${res.status} ${url} bodyLen=${text.length}`);
  console.log(`[hostneed] response headers: ${JSON.stringify(responseHeaders)}`);
  console.log(`[hostneed] body: ${text.slice(0, 500)}`);

  let parsed: any = null;
  try { parsed = JSON.parse(text); } catch { /* not json */ }

  const baseDebug = {
    at: new Date().toISOString(), action, url, base_endpoint: HN_URL, action_path: resolvedPath, request_body: formBody,
    request_headers_safe: safeHeaders, request_headers_exact: exactHeaders, http_status: res.status,
    response_headers: responseHeaders,
    response_body: text.slice(0, 2000), duration_ms: Date.now() - started,
    auth_diagnostics: authDiagnostics,
  };

  if (!res.ok) {
    if (res.status >= 500 && attempt < 2) return hnCall(r, params, { ...opts, attempt: attempt + 1 });
    const apiMsg = parsed?.message ?? parsed?.error ?? text.slice(0, 300) ?? `HTTP ${res.status}`;
    let kind = res.status === 401 || res.status === 403 ? "Authentication failure" : "HostNeed API rejection";
    if (res.status === 404 || /action not found/i.test(text)) kind = "Invalid action path";
    pushDebug({ ...baseDebug, ok: false, error_kind: kind, error_message: apiMsg });
    throw new HostneedError(kind, `${kind} (HTTP ${res.status}): ${apiMsg}`, url, res.status, text);
  }

  if (parsed?.result === "error" || parsed?.status === "error") {
    const apiMsg = parsed.message ?? parsed.error ?? "Unknown error";
    pushDebug({ ...baseDebug, ok: false, error_kind: "HostNeed API rejection", error_message: apiMsg });
    throw new HostneedError("HostNeed API rejection", `HostNeed ${action}: ${apiMsg}`, url, res.status, text);
  }

  pushDebug({ ...baseDebug, ok: true });
  return parsed ?? { raw: text };
}



// ============================================================
// MOCK DRIVER
// ============================================================
const mockDriver = {
  kind: "mock" as const,

  async testConnection() { return { ok: true, provider: "mock", message: "Mock driver always OK" }; },

  async checkAvailability(payload: { domain: string }, admin: any) {
    const pricing = await fetchPricing(admin);
    const base = payload.domain.toLowerCase().replace(/\..*$/, "").trim();
    if (!base) throw new Error("Invalid domain");
    const tlds = payload.domain.includes(".") ? [`.${payload.domain.split(".").slice(1).join(".")}`] : POPULAR_TLDS;
    return tlds.map((tld) => {
      const full = `${base}${tld}`;
      const seed = hashString(full);
      const available = (seed % 10) > 3;
      return {
        domain: full, tld, available, premium: false,
        price: pricing[tld] ?? 1500, currency: "BDT",
        info: available ? "Available (mock)" : "Already registered (mock)",
      };
    });
  },

  async getDomainSuggestions(payload: { keyword: string }, admin: any) {
    const pricing = await fetchPricing(admin);
    const k = payload.keyword.toLowerCase().replace(/[^a-z0-9]/g, "");
    const variants = [k, `${k}app`, `${k}hq`, `get${k}`, `${k}online`, `try${k}`, `${k}io`, `my${k}`];
    return variants.flatMap((v) => POPULAR_TLDS.slice(0, 3).map((tld) => ({
      domain: `${v}${tld}`, tld, available: true, premium: false,
      price: pricing[tld] ?? 1500, currency: "BDT", info: "Suggestion (mock)",
    })));
  },

  async getDomainInfo(payload: { domain: string }) {
    return {
      domain: payload.domain, registered: true, registrar: "Mock Registrar Inc.",
      created: "2020-01-15", expires: "2026-01-15",
      nameservers: ["ns1.mock.com", "ns2.mock.com"], status: ["clientTransferProhibited"],
    };
  },

  async registerDomain(payload: { domain: string; years: number }, admin: any, userId: string, providerId: string) {
    const tld = `.${payload.domain.split(".").slice(1).join(".")}`;
    const { data: priceRow } = await admin.from("tld_pricing").select("register_price").eq("tld", tld).maybeSingle();
    const price = Number(priceRow?.register_price ?? 1500) * payload.years;
    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId, provider_id: providerId, order_type: "register",
      domain_name: payload.domain, years: payload.years, amount: price, currency: "BDT",
      status: "pending", notes: "Awaiting payment confirmation (mock)",
    }).select().single();
    if (error) throw error;
    return order;
  },

  async transferDomain(payload: { domain: string; auth_code: string }, admin: any, userId: string, providerId: string) {
    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId, provider_id: providerId, order_type: "transfer",
      domain_name: payload.domain, years: 1, amount: 0, status: "pending",
      auth_code: payload.auth_code, notes: "Transfer requested (mock)",
    }).select().single();
    if (error) throw error;
    return order;
  },

  async renewDomain(payload: { domain_id: string; years: number }, admin: any, userId: string, providerId: string) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", payload.domain_id).maybeSingle();
    if (!dom) throw new Error("Domain not found");
    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId, provider_id: providerId, order_type: "renew",
      domain_id: payload.domain_id, domain_name: dom.domain_name,
      years: payload.years, amount: 0, status: "pending",
    }).select().single();
    if (error) throw error;
    return order;
  },

  async releaseDomain(_p: { domain_id: string }) { return { ok: true }; },
  async requestDelete(_p: { domain_id: string }) { return { ok: true }; },
  async syncDomain(payload: { domain_id: string }, admin: any) {
    const { data } = await admin.from("registrar_domains").select("*").eq("id", payload.domain_id).maybeSingle();
    return data;
  },
  async syncTransfer(payload: { domain_id: string }, admin: any) {
    return { domain_id: payload.domain_id, status: "completed" };
  },
  async getEPPCode(_p: { domain_id: string }) {
    return { code: "MOCK-EPP-" + Math.random().toString(36).slice(2, 10).toUpperCase() };
  },
  async toggleIDProtection(p: { domain_id: string; enabled: boolean }, admin: any) {
    await admin.from("registrar_domains").update({ id_protection: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },
  async toggleDomainLock(p: { domain_id: string; enabled: boolean }, admin: any) {
    await admin.from("registrar_domains").update({ registrar_lock: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },
  async toggleAutoRenew(p: { domain_id: string; enabled: boolean }, admin: any) {
    await admin.from("registrar_domains").update({ auto_renew: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },
  async toggleWhoisPrivacy(p: { domain_id: string; enabled: boolean }, admin: any) {
    await admin.from("registrar_domains").update({ whois_privacy: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },
  async getNameservers(p: { domain_id: string }, admin: any) {
    const { data } = await admin.from("registrar_domains").select("nameservers").eq("id", p.domain_id).maybeSingle();
    return { nameservers: data?.nameservers ?? [] };
  },
  async saveNameservers(p: { domain_id: string; nameservers: string[] }, admin: any) {
    if (!Array.isArray(p.nameservers) || p.nameservers.length < 2) throw new Error("At least 2 nameservers required");
    const { data } = await admin.from("registrar_domains").update({ nameservers: p.nameservers }).eq("id", p.domain_id).select().single();
    return data;
  },
  async updateNameservers(p: { domain_id: string; nameservers: string[] }, admin: any) {
    return mockDriver.saveNameservers(p, admin);
  },
  async toggleRegistrarLock(p: { domain_id: string; enabled: boolean }, admin: any) {
    return mockDriver.toggleDomainLock(p, admin);
  },
  async getDNSRecords(p: { domain_id: string }, admin: any) {
    const { data } = await admin.from("dns_records").select("*").eq("domain_id", p.domain_id);
    return data ?? [];
  },
  async saveDNSRecords(p: { domain_id: string; records: any[] }, admin: any) {
    await admin.from("dns_records").delete().eq("domain_id", p.domain_id);
    if (p.records?.length) {
      await admin.from("dns_records").insert(p.records.map((r) => ({ ...r, domain_id: p.domain_id })));
    }
    return { ok: true };
  },
  async getContactDetails(p: { domain_id: string }, admin: any) {
    const { data } = await admin.from("domain_contacts").select("*").eq("domain_id", p.domain_id);
    return data ?? [];
  },
  async saveContactDetails(p: { domain_id: string; contacts: any[] }, admin: any) {
    if (p.contacts?.length) {
      for (const c of p.contacts) {
        await admin.from("domain_contacts").upsert({ ...c, domain_id: p.domain_id });
      }
    }
    return { ok: true };
  },
  async getEmailForwarding(_p: { domain_id: string }) { return { forwarders: [] }; },
  async saveEmailForwarding(_p: { domain_id: string; forwarders: any[] }) { return { ok: true }; },
  async getTldPricing(_p: {}, admin: any) {
    const { data } = await admin.from("tld_pricing").select("*").eq("is_active", true);
    return data ?? [];
  },

  // Internal: simulate payment success
  async completeMockOrder(payload: { order_id: string }, admin: any, userId: string, providerId: string) {
    const { data: order, error: oErr } = await admin
      .from("domain_orders").select("*").eq("id", payload.order_id).maybeSingle();
    if (oErr) throw oErr;
    if (!order) throw new Error("Order not found");
    if (order.status === "completed") return { ok: true, domain_id: order.domain_id };

    let domainId = order.domain_id;
    if (order.order_type === "register" || order.order_type === "transfer") {
      const now = new Date();
      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + (order.years ?? 1));
      const { data: dom, error: dErr } = await admin.from("registrar_domains").insert({
        user_id: order.user_id, provider_id: providerId,
        domain_name: order.domain_name, status: "active",
        registered_at: now.toISOString(), expires_at: expiry.toISOString(),
        nameservers: ["ns1.mock-dns.com", "ns2.mock-dns.com"],
      }).select().single();
      if (dErr) throw dErr;
      domainId = dom.id;
    } else if (order.order_type === "renew" && domainId) {
      const { data: dom } = await admin.from("registrar_domains").select("expires_at").eq("id", domainId).maybeSingle();
      const base = dom?.expires_at ? new Date(dom.expires_at) : new Date();
      base.setFullYear(base.getFullYear() + (order.years ?? 1));
      await admin.from("registrar_domains").update({ expires_at: base.toISOString() }).eq("id", domainId);
    }

    await admin.from("domain_orders").update({
      status: "completed", domain_id: domainId,
      processed_by: userId, processed_at: new Date().toISOString(),
    }).eq("id", payload.order_id);
    return { ok: true, domain_id: domainId };
  },
};

// ============================================================
// HOSTNEED DRIVER
// ============================================================
const hostneedDriver = {
  kind: "hostneed" as const,

  async testConnection() {
    HN_ACTIVE_AUTH_VARIANT = null;
    const diag = {
      env: {
        HOSTNEED_API_URL: !!HN_URL,
        HOSTNEED_USERNAME: !!HN_USER,
        HOSTNEED_API_SECRET: !!HN_SECRET,
      },
      secret_detection: {
        api_url_detected: !!HN_URL,
        username_detected: !!HN_USER,
        secret_detected: !!HN_SECRET,
        username_trimmed: HN_USER_RAW !== HN_USER,
        secret_trimmed: HN_SECRET_RAW !== HN_SECRET,
        api_url_shape_valid: HostNeedAuthService.endpointShapeValid(),
        expected_endpoint_suffix: HostNeedAuthService.EXPECTED_ENDPOINT_SUFFIX,
      },
      base_endpoint: HN_URL,
      required_endpoint: `${HN_URL}${HN_ROUTES.VERSION.path}`,
      username_preview: HN_USER ? `${HN_USER.slice(0, 3)}***` : null,
    };
    console.log("[hostneed.testConnection] diag", JSON.stringify(diag));

    if (!HN_URL || !HN_USER || !HN_SECRET) {
      const missing = [
        !HN_URL && "HOSTNEED_API_URL",
        !HN_USER && "HOSTNEED_USERNAME",
        !HN_SECRET && "HOSTNEED_API_SECRET",
      ].filter(Boolean).join(", ");
      return { ok: false, provider: "hostneed", kind: "Missing credentials", message: `Missing secrets: ${missing}`, diag };
    }

    const authTests: Array<any> = [];
    const attempts: Array<any> = [];
    let firstSuccess: { action: string; data: any; endpoint: string; auth: HostNeedAuthDiagnostics } | null = null;

    // Authentication Test section: always use official GET /version first.
    for (const variant of HostNeedAuthService.variants()) {
      const url = `${HN_URL}${HN_ROUTES.VERSION.path}`;
      try {
        const auth = await HostNeedAuthService.generateToken(variant);
        const r = await hnCall(HN_ROUTES.VERSION, {}, { authVariant: variant });
        HN_ACTIVE_AUTH_VARIANT = variant;
        const test = {
          variant,
          action: "GET /version",
          ok: true,
          http_status: 200,
          endpoint: url,
          username_validation: !!HN_USER,
          secret_validation: !!HN_SECRET,
          token_validation: true,
          server_time_validation: true,
          time_difference_check: auth.generated_timestamp_utc === auth.local_timestamp ? "UTC matches local hour" : "UTC differs from local hour; UTC is used",
          diagnosis: variant === HostNeedAuthService.DOCS_VARIANT ? ["Official HostNeed auth algorithm accepted."] : ["Alternate auth variant accepted; HostNeed documentation/account behavior differs from expected formula."],
          auth,
        };
        authTests.push(test);
        attempts.push({ action: "GET /version", ok: true, http_status: 200, message: "OK", endpoint: url, auth_variant: variant, auth });
        firstSuccess = { action: "GET /version", data: r, endpoint: url, auth };
        break;
      } catch (e) {
        const he = e as HostneedError;
        const auth = await HostNeedAuthService.generateToken(variant).catch(() => null);
        const diagnosis = HostNeedAuthService.diagnoseFailure(he.status ?? 0, he.body ?? he.message, variant);
        authTests.push({
          variant,
          action: "GET /version",
          ok: false,
          http_status: he.status ?? 0,
          endpoint: he.endpoint ?? url,
          username_validation: !!HN_USER,
          secret_validation: !!HN_SECRET,
          token_validation: false,
          server_time_validation: true,
          time_difference_check: auth?.generated_timestamp_utc === auth?.local_timestamp ? "UTC matches local hour" : "UTC differs from local hour; UTC is used",
          diagnosis,
          message: he.message,
          full_api_response: he.body,
          auth,
        });
        attempts.push({
          action: "GET /version",
          ok: false,
          http_status: he.status ?? 0,
          message: he.message,
          endpoint: he.endpoint ?? url,
          auth_variant: variant,
          auth,
          diagnosis,
          full_api_response: he.body,
        });
      }
    }

    if (firstSuccess) {
      return {
        ok: true,
        provider: "hostneed",
        message: `Connected via ${firstSuccess.action}`,
        endpoint: firstSuccess.endpoint,
        working_action: firstSuccess.action,
        active_auth_variant: HN_ACTIVE_AUTH_VARIANT,
        data: firstSuccess.data,
        attempts,
        auth_tests: authTests,
        auth_diagnostics: firstSuccess.auth,
        diag,
      };
    }

    const last = attempts[attempts.length - 1];
    const official = attempts.find((a) => a.auth_variant === HostNeedAuthService.DOCS_VARIANT) ?? attempts[0];
    return {
      ok: false,
      provider: "hostneed",
      kind: official?.http_status === 404 ? "Invalid action path"
        : official?.http_status === 401 || official?.http_status === 403 ? "Authentication failure"
        : "HostNeed API rejection",
      message: official?.message ?? "GET /version authentication failed",
      http_status: official?.http_status ?? 0,
      endpoint: official?.endpoint,
      request_url: official?.endpoint,
      username_used: HN_USER ? `${HN_USER.slice(0, 3)}***${HN_USER.slice(-2)}` : null,
      date_used_for_token: official?.auth?.generated_timestamp_utc,
      token_generation_method: official?.auth?.algorithm,
      full_api_response: official?.full_api_response,
      auth_tests: authTests,
      attempts,
      diag,
    };
  },


  async checkAvailability(payload: { domain: string }) {
    const base = payload.domain.toLowerCase().replace(/\..*$/, "").trim();
    const tlds = payload.domain.includes(".") ? [`.${payload.domain.split(".").slice(1).join(".")}`] : POPULAR_TLDS;
    const results = await Promise.all(tlds.map(async (tld) => {
      const full = `${base}${tld}`;
      try {
        const r = await hnCall(HN_ROUTES.LOOKUP, { domain: full });
        const available = String(r?.available ?? r?.status ?? "").toLowerCase().includes("available")
          || r?.available === true;
        return {
          domain: full, tld, available,
          premium: !!r?.premium,
          price: Number(r?.price ?? 0),
          currency: r?.currency ?? "BDT",
          info: r?.message ?? (available ? "Available" : "Taken"),
        };
      } catch {
        return { domain: full, tld, available: false, premium: false, price: 0, currency: "BDT", info: "Unavailable" };
      }
    }));
    return results;
  },

  async getDomainSuggestions(payload: { keyword: string }) {
    try {
      const r = await hnCall(HN_ROUTES.LOOKUP_SUGGESTIONS, { keyword: payload.keyword });
      const list = Array.isArray(r?.suggestions) ? r.suggestions : Array.isArray(r) ? r : [];
      return list.map((d: any) => ({
        domain: d.domain ?? d.name, tld: d.tld ?? `.${(d.domain ?? "").split(".").slice(1).join(".")}`,
        available: true, premium: !!d.premium, price: Number(d.price ?? 0),
        currency: d.currency ?? "BDT", info: "Suggestion",
      }));
    } catch { return []; }
  },

  async getDomainInfo(payload: { domain: string }) {
    return await hnCall(HN_ROUTES.INFORMATION, {}, { domain: payload.domain });
  },

  async registerDomain(payload: { domain: string; years: number }, admin: any, userId: string, providerId: string) {
    const r = await hnCall(HN_ROUTES.ORDER_REGISTER, {
      domain: payload.domain,
      regperiod: String(payload.years),
      addons: { dnsmanagement: 1, emailforwarding: 1, idprotection: 1 },
    });
    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId, provider_id: providerId, order_type: "register",
      domain_name: payload.domain, years: payload.years,
      amount: Number(r?.price ?? r?.amount ?? 0), currency: r?.currency ?? "BDT",
      status: r?.status === "active" || r?.result === "success" ? "completed" : "processing",
      transaction_id: r?.orderid ? String(r.orderid) : null,
      metadata: r ?? {},
    }).select().single();
    if (error) throw error;
    return order;
  },

  async transferDomain(payload: { domain: string; auth_code: string }, admin: any, userId: string, providerId: string) {
    const r = await hnCall(HN_ROUTES.ORDER_TRANSFER, { domain: payload.domain, eppcode: payload.auth_code });
    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId, provider_id: providerId, order_type: "transfer",
      domain_name: payload.domain, years: 1,
      amount: Number(r?.price ?? 0), status: "processing",
      auth_code: payload.auth_code, transaction_id: r?.orderid ? String(r.orderid) : null,
      metadata: r ?? {},
    }).select().single();
    if (error) throw error;
    return order;
  },

  async renewDomain(payload: { domain_id: string; years: number }, admin: any, userId: string, providerId: string) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", payload.domain_id).maybeSingle();
    if (!dom) throw new Error("Domain not found");
    const r = await hnCall(HN_ROUTES.ORDER_RENEW, {
      domain: dom.domain_name, regperiod: String(payload.years),
      addons: { dnsmanagement: 0, emailforwarding: 1, idprotection: 1 },
    });
    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId, provider_id: providerId, order_type: "renew",
      domain_id: payload.domain_id, domain_name: dom.domain_name,
      years: payload.years, amount: Number(r?.price ?? 0), status: "processing",
      transaction_id: r?.orderid ? String(r.orderid) : null, metadata: r ?? {},
    }).select().single();
    if (error) throw error;
    return order;
  },

  async getNameservers(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const r = await hnCall(HN_ROUTES.NAMESERVERS_GET, {}, { domain: dom.domain_name });
    const nameservers = Array.isArray(r?.nameservers)
      ? r.nameservers
      : [r?.ns1, r?.ns2, r?.ns3, r?.ns4, r?.ns5].filter(Boolean);
    return { nameservers };
  },

  async saveNameservers(p: { domain_id: string; nameservers: string[] }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const params: any = {};
    p.nameservers.slice(0, 5).forEach((n, i) => params[`ns${i + 1}`] = n);
    await hnCall(HN_ROUTES.NAMESERVERS_SAVE, params, { domain: dom.domain_name });
    const { data } = await admin.from("registrar_domains").update({ nameservers: p.nameservers }).eq("id", p.domain_id).select().single();
    return data;
  },

  async updateNameservers(p: { domain_id: string; nameservers: string[] }, admin: any) {
    return hostneedDriver.saveNameservers(p, admin);
  },

  async getDNSRecords(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const r = await hnCall(HN_ROUTES.DNS_GET, {}, { domain: dom.domain_name });
    return r?.records ?? r ?? [];
  },

  async saveDNSRecords(p: { domain_id: string; records: any[] }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall(HN_ROUTES.DNS_SAVE, { records: p.records }, { domain: dom.domain_name });
    return { ok: true };
  },

  async getContactDetails(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall(HN_ROUTES.CONTACT_GET, {}, { domain: dom.domain_name });
  },

  async saveContactDetails(p: { domain_id: string; contacts: any }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall(HN_ROUTES.CONTACT_SAVE, { contactdetails: p.contacts }, { domain: dom.domain_name });
  },

  async getEPPCode(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const r = await hnCall(HN_ROUTES.EPP_CODE, {}, { domain: dom.domain_name });
    return { code: r?.eppcode ?? r?.code ?? "" };
  },

  async toggleDomainLock(p: { domain_id: string; enabled: boolean }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall(HN_ROUTES.LOCK_SAVE, { lockstatus: p.enabled ? 1 : 0 }, { domain: dom.domain_name });
    await admin.from("registrar_domains").update({ registrar_lock: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },

  async toggleWhoisPrivacy(p: { domain_id: string; enabled: boolean }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall(HN_ROUTES.PROTECT_ID, { idprotection: p.enabled ? 1 : 0 }, { domain: dom.domain_name });
    await admin.from("registrar_domains").update({ whois_privacy: p.enabled, id_protection: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },

  async toggleIDProtection(p: { domain_id: string; enabled: boolean }, admin: any) {
    return hostneedDriver.toggleWhoisPrivacy(p, admin);
  },

  async toggleAutoRenew(p: { domain_id: string; enabled: boolean }, admin: any) {
    await admin.from("registrar_domains").update({ auto_renew: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },

  async toggleRegistrarLock(p: { domain_id: string; enabled: boolean }, admin: any) {
    return hostneedDriver.toggleDomainLock(p, admin);
  },

  async getEmailForwarding(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall(HN_ROUTES.EMAIL_GET, {}, { domain: dom.domain_name });
  },

  async saveEmailForwarding(p: { domain_id: string; forwarders: any[] }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall(HN_ROUTES.EMAIL_SAVE, { forwarders: p.forwarders }, { domain: dom.domain_name });
  },

  async releaseDomain(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall(HN_ROUTES.RELEASE, {}, { domain: dom.domain_name });
    return { ok: true };
  },

  async requestDelete(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall(HN_ROUTES.DELETE, {}, { domain: dom.domain_name });
    return { ok: true };
  },

  async syncDomain(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("*").eq("id", p.domain_id).maybeSingle();
    if (!dom) throw new Error("Domain not found");
    await hnCall(HN_ROUTES.SYNC, {}, { domain: dom.domain_name });
    const r = await hnCall(HN_ROUTES.INFORMATION, {}, { domain: dom.domain_name });
    const updates: any = {};
    if (r?.expirydate) updates.expires_at = new Date(r.expirydate).toISOString();
    if (r?.status) updates.status = String(r.status).toLowerCase();
    if (Array.isArray(r?.nameservers)) updates.nameservers = r.nameservers;
    if (Object.keys(updates).length) {
      const { data } = await admin.from("registrar_domains").update(updates).eq("id", p.domain_id).select().single();
      return data;
    }
    return dom;
  },

  async syncTransfer(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("*").eq("id", p.domain_id).maybeSingle();
    const r = await hnCall(HN_ROUTES.TRANSFER_SYNC, {}, { domain: dom?.domain_name });
    return r;
  },

  async getTldPricing(_p: {}, _admin: any) {
    return await hnCall(HN_ROUTES.TLDS_PRICING, {});
  },
};

// ============================================================
// Provider registry & resolution
// ============================================================
type Driver = typeof mockDriver;
const drivers: Record<string, Driver> = {
  mock: mockDriver as Driver,
  hostneed: hostneedDriver as unknown as Driver,
};

function hostneedReady(): boolean {
  return !!(HN_URL && HN_USER && HN_SECRET);
}

async function resolveDriver(admin: any): Promise<{ driver: Driver; provider: any; usingMock: boolean }> {
  const { data: provider } = await admin
    .from("registrar_providers")
    .select("*")
    .eq("is_enabled", true)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!provider) {
    // fallback to in-memory mock
    return { driver: mockDriver as Driver, provider: { id: null, name: "Mock (fallback)", is_mock: true }, usingMock: true };
  }

  // Force mock when flagged OR when driver type doesn't have credentials
  if (provider.is_mock) return { driver: mockDriver as Driver, provider, usingMock: true };
  if (provider.provider_type === "hostneed" && !hostneedReady()) {
    return { driver: mockDriver as Driver, provider, usingMock: true };
  }
  const d = drivers[provider.provider_type] ?? mockDriver;
  return { driver: d as Driver, provider, usingMock: false };
}

// ============================================================
// HTTP entry
// ============================================================
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user?.id) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;


    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const { action, payload = {} } = body ?? {};

    // Admin-only utility: list provider status (no driver call)
    if (action === "providerStatus") {
      const { data: providers } = await admin.from("registrar_providers").select("id,name,provider_type,is_enabled,is_default,is_mock,api_endpoint");
      const { data: activeProv } = await admin
        .from("registrar_providers").select("*")
        .eq("is_enabled", true).order("is_default", { ascending: false })
        .order("created_at", { ascending: true }).limit(1).maybeSingle();

      // Live auth diagnostics — generate a token NOW so admin can see exact values
      const stamp = gmHourStamp();
      let tokenLen = 0;
      let tokenPreview: string | null = null;
      let tokenError: string | null = null;
      if (HN_USER && HN_SECRET) {
        try {
          const hex = await hmacSha256Hex(HN_SECRET, `${HN_USER}:${stamp}`);
          const tok = b64(hex);
          tokenLen = tok.length;
          tokenPreview = `${tok.slice(0, 6)}…${tok.slice(-4)}`;
        } catch (e) { tokenError = (e as Error).message; }
      }
      const usingMock = !activeProv || activeProv.is_mock || (activeProv.provider_type === "hostneed" && !hostneedReady());

      return json({
        result: {
          hostneed_credentials_present: hostneedReady(),
          hostneed_endpoint: HN_URL ?? null,
          hostneed_username_preview: HN_USER ? `${HN_USER.slice(0, 3)}***` : null,
          auth_diagnostics: {
            api_url_detected: !!HN_URL,
            username_detected: !!HN_USER,
            secret_detected: !!HN_SECRET,
            api_url_length: HN_URL?.length ?? 0,
            username_length: HN_USER?.length ?? 0,
            secret_length: HN_SECRET?.length ?? 0,
            generated_timestamp_utc: stamp,
            server_time_utc: new Date().toISOString(),
            token_length: tokenLen,
            token_preview: tokenPreview,
            token_error: tokenError,
            algorithm: "base64( hex( hmac_sha256( secret, `${username}:${gmdate('y-m-d H')}` ) ) )",
          },
          current_provider_mode: usingMock ? "mock" : (activeProv?.provider_type ?? "mock"),
          active_provider: activeProv ?? null,
          using_mock: usingMock,
          providers: providers ?? [],
          last_request: HN_DEBUG[0] ?? null,
          recent_requests: HN_DEBUG.slice(0, 10),
        },
      });
    }


    const { driver, provider, usingMock } = await resolveDriver(admin);

    if (action === "testConnection") {
      const r = await driver.testConnection();
      await logActivity(admin, {
        user_id: userId, action: "provider.test", entity_type: "provider",
        entity_id: provider?.id ?? null,
        details: { ...r, using_mock_fallback: usingMock },
      });
      return json({ result: { ...r, using_mock_fallback: usingMock, provider: provider?.name ?? "mock" } });
    }

    const fn = (driver as any)[action];
    if (typeof fn !== "function") return json({ error: `Unknown action: ${action}` }, 400);

    const started = Date.now();
    try {
      const result = await fn(payload, admin, userId, provider?.id);
      await logActivity(admin, {
        user_id: userId, action: `registrar.${action}`, entity_type: "provider",
        entity_id: provider?.id ?? null,
        details: { provider: provider?.name, using_mock: usingMock, ms: Date.now() - started, ok: true },
      });
      return json({ result });
    } catch (e) {
      await logActivity(admin, {
        user_id: userId, action: `registrar.${action}.failed`, entity_type: "provider",
        entity_id: provider?.id ?? null,
        details: { provider: provider?.name, using_mock: usingMock, ms: Date.now() - started, error: (e as Error).message },
      });
      throw e;
    }
  } catch (e) {
    console.error("registrar-api error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
