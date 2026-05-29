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

const HN_URL = Deno.env.get("HOSTNEED_API_URL");
const HN_USER = Deno.env.get("HOSTNEED_USERNAME");
const HN_SECRET = Deno.env.get("HOSTNEED_API_SECRET");

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
// HostNeed signing + transport
// ============================================================
// token = base64( hmac_sha256( HOSTNEED_API_SECRET, `${USERNAME}:${gmdate('y-m-d H')}` ) )
// gmdate('y-m-d H') -> 2-digit year, e.g. 26-05-29 04
function gmHourStamp(d = new Date()): string {
  const yy = String(d.getUTCFullYear()).slice(-2);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}`;
}

async function hmacSha256Hex(key: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const ck = await crypto.subtle.importKey(
    "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", ck, enc.encode(msg));
  // PHP hash_hmac returns hex string by default; we base64-encode the hex (matches the sample)
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64(str: string): string {
  return btoa(str);
}

async function buildHostneedHeaders(): Promise<Record<string, string>> {
  if (!HN_URL || !HN_USER || !HN_SECRET) {
    throw new Error("HostNeed credentials are not configured");
  }
  const stamp = gmHourStamp();
  const hex = await hmacSha256Hex(HN_SECRET, `${HN_USER}:${stamp}`);
  const token = b64(hex);
  return { username: HN_USER, token, "Content-Type": "application/x-www-form-urlencoded" };
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

type HnMethod = "GET" | "POST";
type HnRoute = { method: HnMethod; path: string; description: string };
const HOSTNEED_ROUTES = {
  connectionTest: { method: "GET", path: "/billing/credits", description: "Connection/auth test" },
  checkAvailability: { method: "POST", path: "/domains/lookup", description: "Domain availability lookup" },
  registerDomain: { method: "POST", path: "/order/domains/register", description: "Register domain" },
  transferDomain: { method: "POST", path: "/order/domains/transfer", description: "Transfer domain" },
  renewDomain: { method: "POST", path: "/order/domains/renew", description: "Renew domain" },
  releaseDomain: { method: "POST", path: "/domains/{domain}/release", description: "Release domain" },
  getEPPCode: { method: "GET", path: "/domains/{domain}/eppcode", description: "Get EPP code" },
  getContactDetails: { method: "GET", path: "/domains/{domain}/contact", description: "Get contact details" },
  saveContactDetails: { method: "POST", path: "/domains/{domain}/contact", description: "Save contact details" },
  getRegistrarLock: { method: "GET", path: "/domains/{domain}/lock", description: "Get registrar lock" },
  toggleDomainLock: { method: "POST", path: "/domains/{domain}/lock", description: "Set registrar lock" },
  getDNSRecords: { method: "GET", path: "/domains/{domain}/dns", description: "Get DNS records" },
  saveDNSRecords: { method: "POST", path: "/domains/{domain}/dns", description: "Save DNS records" },
  requestDelete: { method: "POST", path: "/domains/{domain}/delete", description: "Request domain deletion" },
  syncTransfer: { method: "POST", path: "/domains/{domain}/transfersync", description: "Sync transfer status" },
  syncDomain: { method: "POST", path: "/domains/{domain}/sync", description: "Sync domain status" },
  getEmailForwarding: { method: "GET", path: "/domains/{domain}/email", description: "Get email forwarding" },
  saveEmailForwarding: { method: "POST", path: "/domains/{domain}/email", description: "Save email forwarding" },
  toggleWhoisPrivacy: { method: "POST", path: "/domains/{domain}/protectid", description: "Toggle ID protection" },
  getNameservers: { method: "GET", path: "/domains/{domain}/nameservers", description: "Get nameservers" },
  saveNameservers: { method: "POST", path: "/domains/{domain}/nameservers", description: "Save nameservers" },
  registerNameserver: { method: "POST", path: "/domains/{domain}/nameservers/register", description: "Register nameserver" },
  modifyNameserver: { method: "POST", path: "/domains/{domain}/nameservers/modify", description: "Modify nameserver" },
  deleteNameserver: { method: "POST", path: "/domains/{domain}/nameservers/delete", description: "Delete nameserver" },
  getPricingRegister: { method: "GET", path: "/order/pricing/domains/register", description: "Registration pricing" },
  getPricingRenew: { method: "GET", path: "/order/pricing/domains/renew", description: "Renewal pricing" },
  getPricingTransfer: { method: "GET", path: "/order/pricing/domains/transfer", description: "Transfer pricing" },
  getTlds: { method: "GET", path: "/tlds", description: "Available TLDs" },
  getVersion: { method: "GET", path: "/version", description: "API version" },
} as const satisfies Record<string, HnRoute>;
type HnRouteName = keyof typeof HOSTNEED_ROUTES;

function buildHostneedRoute(routeName: HnRouteName, pathParams: Record<string, string> = {}) {
  const route = HOSTNEED_ROUTES[routeName];
  const base = (HN_URL ?? "").replace(/\/+$/, "");
  const generatedPath = route.path.replace(/\{(\w+)\}/g, (_, key) => encodeURIComponent(pathParams[key] ?? ""));
  return { actionName: routeName, method: route.method, generatedPath, fullUrl: `${base}${generatedPath}` };
}

// In-memory debug capture for the admin debug panel.
// Keeps last N request/response pairs (per worker instance — best-effort, not persistent).
interface HnDebugEntry {
  at: string;
  action: string;
  action_name: string;
  method: HnMethod;
  base_endpoint: string;
  generated_path: string;
  url: string;
  request_payload: Record<string, any>;
  request_body: string;
  request_headers_safe: Record<string, string>;
  http_status: number;
  response_body: string;
  duration_ms: number;
  ok: boolean;
  error_kind?: string;
  error_message?: string;
}
const HN_DEBUG: HnDebugEntry[] = [];
function pushDebug(e: HnDebugEntry) {
  HN_DEBUG.unshift(e);
  if (HN_DEBUG.length > 20) HN_DEBUG.length = 20;
}

async function hnCall(
  routeName: HnRouteName,
  params: Record<string, any> = {},
  pathParams: Record<string, string> = {},
  attempt = 1,
): Promise<any> {
  // Validate creds presence with explicit kind
  if (!HN_URL) throw new HostneedError("Invalid endpoint", "HOSTNEED_API_URL is not set", "", 0, "");
  if (!HN_USER) throw new HostneedError("Invalid username", "HOSTNEED_USERNAME is not set", HN_URL, 0, "");
  if (!HN_SECRET) throw new HostneedError("Invalid API secret", "HOSTNEED_API_SECRET is not set", HN_URL, 0, "");

  let headers: Record<string, string>;
  try {
    headers = await buildHostneedHeaders();
  } catch (e) {
    throw new HostneedError("Invalid token generation", (e as Error).message, HN_URL, 0, "");
  }

  const route = buildHostneedRoute(routeName, pathParams);
  const body = formEncode(params);
  const url = route.method === "GET" && body ? `${route.fullUrl}?${body}` : route.fullUrl;
  const safeHeaders = { ...headers, token: headers.token ? `${headers.token.slice(0, 6)}…(${headers.token.length})` : "" };
  console.log(`[hostneed.route] action=${route.actionName} path=${route.generatedPath} url=${url}`);
  console.log(`[hostneed] -> ${route.method} ${url} (attempt ${attempt}) body=${body.slice(0, 200)}`);

  const started = Date.now();
  let res: Response;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    const requestInit: RequestInit = { method: route.method, headers, signal: ctrl.signal };
    if (route.method === "POST") requestInit.body = body;
    res = await fetch(url, requestInit);
    clearTimeout(timer);
  } catch (e) {
    const msg = (e as Error).message || String(e);
    const kind = msg.toLowerCase().includes("abort") || msg.toLowerCase().includes("timeout")
      ? "Timeout" : "Network error";
    console.error(`[hostneed] ${kind}: ${msg}`);
    pushDebug({
      at: new Date().toISOString(), action: route.generatedPath, action_name: route.actionName,
      method: route.method, base_endpoint: HN_URL, generated_path: route.generatedPath,
      url, request_payload: params, request_body: body,
      request_headers_safe: safeHeaders, http_status: 0, response_body: "",
      duration_ms: Date.now() - started, ok: false, error_kind: kind, error_message: msg,
    });
    if (attempt < 2) return hnCall(routeName, params, pathParams, attempt + 1);
    throw new HostneedError(kind, msg, url, 0, "");
  }

  const text = await res.text();
  console.log(`[hostneed] <- HTTP ${res.status} ${url} bodyLen=${text.length}`);
  console.log(`[hostneed] body: ${text.slice(0, 500)}`);

  let json: any = null;
  try { json = JSON.parse(text); } catch { /* not json */ }

  const baseDebug = {
    at: new Date().toISOString(), action: route.generatedPath, action_name: route.actionName,
    method: route.method, base_endpoint: HN_URL, generated_path: route.generatedPath,
    url, request_payload: params, request_body: body,
    request_headers_safe: safeHeaders, http_status: res.status,
    response_body: text.slice(0, 2000), duration_ms: Date.now() - started,
  };

  if (!res.ok) {
    if (res.status >= 500 && attempt < 2) return hnCall(routeName, params, pathParams, attempt + 1);
    const apiMsg = json?.message ?? json?.error ?? text.slice(0, 300) ?? `HTTP ${res.status}`;
    let kind = res.status === 401 || res.status === 403 ? "Authentication failure" : "HostNeed API rejection";
    if (res.status === 404 || /action not found/i.test(text)) kind = "Invalid action path";
    pushDebug({ ...baseDebug, ok: false, error_kind: kind, error_message: apiMsg });
    throw new HostneedError(kind, `${kind} (HTTP ${res.status}): ${apiMsg}`, url, res.status, text);
  }

  if (json?.result === "error" || json?.status === "error") {
    const apiMsg = json.message ?? json.error ?? "Unknown error";
    pushDebug({ ...baseDebug, ok: false, error_kind: "HostNeed API rejection", error_message: apiMsg });
    throw new HostneedError("HostNeed API rejection", `HostNeed ${route.generatedPath}: ${apiMsg}`, url, res.status, text);
  }

  pushDebug({ ...baseDebug, ok: true });
  return json ?? { raw: text };
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
    const diag = {
      env: {
        HOSTNEED_API_URL: !!HN_URL,
        HOSTNEED_USERNAME: !!HN_USER,
        HOSTNEED_API_SECRET: !!HN_SECRET,
      },
      base_endpoint: HN_URL,
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

    const route = buildHostneedRoute("connectionTest");
    const attempts: Array<{ action: string; generated_path: string; ok: boolean; http_status: number; message: string; endpoint: string }> = [];
    try {
      const r = await hnCall("connectionTest");
      attempts.push({ action: "connectionTest", generated_path: route.generatedPath, ok: true, http_status: 200, message: "OK", endpoint: route.fullUrl });
      return {
        ok: true,
        provider: "hostneed",
        message: `Connected via ${route.generatedPath}`,
        endpoint: route.fullUrl,
        action_name: "connectionTest",
        generated_path: route.generatedPath,
        data: r,
        attempts,
        diag,
      };
    } catch (e) {
      const he = e as HostneedError;
      attempts.push({
        action: "connectionTest",
        generated_path: route.generatedPath,
        ok: false,
        http_status: he.status ?? 0,
        message: he.message,
        endpoint: he.endpoint ?? route.fullUrl,
      });
    }

    const last = attempts[0];
    return {
      ok: false,
      provider: "hostneed",
      kind: last?.http_status === 404 ? "Invalid action path"
        : last?.http_status === 401 || last?.http_status === 403 ? "Authentication failure"
        : "HostNeed API rejection",
      message: last?.message ?? "All candidate actions failed",
      http_status: last?.http_status ?? 0,
      endpoint: last?.endpoint,
      attempts,
      diag,
    };
  },


  async checkAvailability(payload: { domain: string }) {
    const base = payload.domain.toLowerCase().replace(/\..*$/, "").trim();
    const tlds = payload.domain.includes(".") ? [`.${payload.domain.split(".").slice(1).join(".")}`] : POPULAR_TLDS;
    const r = await hnCall("checkAvailability", {
      searchTerm: base,
      punyCodeSearchTerm: base,
      tldsToInclude: tlds.map((tld) => tld.replace(/^\./, "")),
      isIdnDomain: false,
      premiumEnabled: true,
    });
    const list = Array.isArray(r?.results) ? r.results : Array.isArray(r?.domains) ? r.domains : Array.isArray(r) ? r : [];
    if (!list.length) {
      return tlds.map((tld) => ({ domain: `${base}${tld}`, tld, available: false, premium: false, price: 0, currency: "BDT", info: r?.message ?? "No lookup result" }));
    }
    return list.map((d: any) => {
      const domain = d.domain ?? d.name ?? `${base}.${String(d.tld ?? "").replace(/^\./, "")}`;
      return {
        domain,
        tld: d.tld ? `.${String(d.tld).replace(/^\./, "")}` : `.${String(domain).split(".").slice(1).join(".")}`,
        available: String(d.status ?? d.availability ?? d.available ?? "").toLowerCase().includes("available") || d.available === true,
        premium: !!d.premium,
        price: Number(d.price ?? d.register ?? 0),
        currency: d.currency ?? "BDT",
        info: d.message ?? d.status ?? "Lookup result",
      };
    });
  },

  async getDomainSuggestions(payload: { keyword: string }) {
    try {
      return await hostneedDriver.checkAvailability({ domain: payload.keyword });
    } catch { return []; }
  },

  async getDomainInfo(payload: { domain: string }) {
    return await hnCall("syncDomain", {}, { domain: payload.domain });
  },

  async registerDomain(payload: { domain: string; years: number }, admin: any, userId: string, providerId: string) {
    const r = await hnCall("registerDomain", {
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
    const r = await hnCall("transferDomain", { domain: payload.domain, eppcode: payload.auth_code, regperiod: "1" });
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
    const r = await hnCall("renewDomain", {
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
    const r = await hnCall("getNameservers", {}, { domain: dom.domain_name });
    const nameservers = [r?.ns1, r?.ns2, r?.ns3, r?.ns4, r?.ns5].filter(Boolean);
    return { nameservers };
  },

  async saveNameservers(p: { domain_id: string; nameservers: string[] }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const params: any = {};
    p.nameservers.slice(0, 5).forEach((n, i) => params[`ns${i + 1}`] = n);
    await hnCall("saveNameservers", params, { domain: dom.domain_name });
    const { data } = await admin.from("registrar_domains").update({ nameservers: p.nameservers }).eq("id", p.domain_id).select().single();
    return data;
  },

  async updateNameservers(p: { domain_id: string; nameservers: string[] }, admin: any) {
    return hostneedDriver.saveNameservers(p, admin);
  },

  async getDNSRecords(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const r = await hnCall("getDNSRecords", {}, { domain: dom.domain_name });
    return r?.records ?? r ?? [];
  },

  async saveDNSRecords(p: { domain_id: string; records: any[] }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall("saveDNSRecords", { dnsrecords: p.records }, { domain: dom.domain_name });
    return { ok: true };
  },

  async getContactDetails(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall("getContactDetails", {}, { domain: dom.domain_name });
  },

  async saveContactDetails(p: { domain_id: string; contacts: any }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall("saveContactDetails", { contactdetails: p.contacts }, { domain: dom.domain_name });
  },

  async getEPPCode(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    const r = await hnCall("getEPPCode", {}, { domain: dom.domain_name });
    return { code: r?.eppcode ?? r?.code ?? "" };
  },

  async toggleDomainLock(p: { domain_id: string; enabled: boolean }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall("toggleDomainLock", { lockstatus: p.enabled ? 1 : 0 }, { domain: dom.domain_name });
    await admin.from("registrar_domains").update({ registrar_lock: p.enabled }).eq("id", p.domain_id);
    return { ok: true };
  },

  async toggleWhoisPrivacy(p: { domain_id: string; enabled: boolean }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall("toggleWhoisPrivacy", { status: p.enabled ? 1 : 0 }, { domain: dom.domain_name });
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
    return await hnCall("/domains/getemailforwarding", { domain: dom.domain_name });
  },

  async saveEmailForwarding(p: { domain_id: string; forwarders: any[] }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    return await hnCall("/domains/saveemailforwarding", { domain: dom.domain_name, forwarders: p.forwarders });
  },

  async releaseDomain(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall("/domains/release", { domain: dom.domain_name });
    return { ok: true };
  },

  async requestDelete(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("domain_name").eq("id", p.domain_id).maybeSingle();
    await hnCall("/domains/requestdelete", { domain: dom.domain_name });
    return { ok: true };
  },

  async syncDomain(p: { domain_id: string }, admin: any) {
    const { data: dom } = await admin.from("registrar_domains").select("*").eq("id", p.domain_id).maybeSingle();
    if (!dom) throw new Error("Domain not found");
    const r = await hnCall("/domains/getinfo", { domain: dom.domain_name });
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
    const r = await hnCall("/domains/transfersync", { domain: dom?.domain_name });
    return r;
  },

  async getTldPricing(_p: {}, admin: any) {
    const r = await hnCall("/domains/getpricing", {});
    return r;
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
      return json({
        result: {
          hostneed_credentials_present: hostneedReady(),
          hostneed_endpoint: HN_URL ?? null,
          hostneed_username_preview: HN_USER ? `${HN_USER.slice(0, 3)}***` : null,
          active_provider: activeProv ?? null,
          using_mock: !activeProv || activeProv.is_mock || (activeProv.provider_type === "hostneed" && !hostneedReady()),
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
