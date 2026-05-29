// Domain Registrar API — Edge Function
// Single entry point for all registrar operations. Dispatches to the
// active provider's driver. Currently only the `mock` driver exists;
// future drivers (HostNeed, Namecheap, etc.) plug into the `drivers` map.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ---------- Mock driver ----------
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

const mockDriver = {
  async checkAvailability(payload: { domain: string }, admin: any) {
    const pricing = await fetchPricing(admin);
    const base = payload.domain.toLowerCase().replace(/\..*$/, "").trim();
    if (!base) throw new Error("Invalid domain");
    const tlds = payload.domain.includes(".") ? [`.${payload.domain.split(".").slice(1).join(".")}`] : POPULAR_TLDS;
    return tlds.map((tld) => {
      const full = `${base}${tld}`;
      const seed = hashString(full);
      const available = (seed % 10) > 3; // ~60% available
      return {
        domain: full,
        tld,
        available,
        premium: false,
        price: pricing[tld] ?? 1500,
        currency: "BDT",
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
      domain: payload.domain,
      registered: true,
      registrar: "Mock Registrar Inc.",
      created: "2020-01-15",
      expires: "2026-01-15",
      nameservers: ["ns1.mock.com", "ns2.mock.com"],
      status: ["clientTransferProhibited"],
    };
  },

  async registerDomain(payload: { domain: string; years: number }, admin: any, userId: string, providerId: string) {
    const tld = `.${payload.domain.split(".").slice(1).join(".")}`;
    const { data: priceRow } = await admin.from("tld_pricing").select("register_price").eq("tld", tld).maybeSingle();
    const price = Number(priceRow?.register_price ?? 1500) * payload.years;

    const { data: order, error } = await admin.from("domain_orders").insert({
      user_id: userId,
      provider_id: providerId,
      order_type: "register",
      domain_name: payload.domain,
      years: payload.years,
      amount: price,
      currency: "BDT",
      status: "pending",
      notes: "Awaiting payment confirmation (mock)",
    }).select().single();
    if (error) throw error;

    await admin.from("registrar_activity_logs").insert({
      user_id: userId, action: "domain.register.requested",
      entity_type: "domain_order", entity_id: order.id,
      details: { domain: payload.domain, years: payload.years, amount: price },
    });
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

  async releaseDomain(payload: { domain_id: string }, admin: any, userId: string) {
    await admin.from("registrar_activity_logs").insert({
      user_id: userId, action: "domain.release.requested",
      entity_type: "domain", entity_id: payload.domain_id, details: {},
    });
    return { ok: true };
  },

  async requestDelete(payload: { domain_id: string }, admin: any, userId: string) {
    await admin.from("registrar_activity_logs").insert({
      user_id: userId, action: "domain.delete.requested",
      entity_type: "domain", entity_id: payload.domain_id, details: {},
    });
    return { ok: true };
  },

  async syncDomain(payload: { domain_id: string }, admin: any) {
    const { data } = await admin.from("registrar_domains").select("*").eq("id", payload.domain_id).maybeSingle();
    return data;
  },

  async getEPPCode(_payload: { domain_id: string }) {
    return { code: "MOCK-EPP-" + Math.random().toString(36).slice(2, 10).toUpperCase() };
  },

  async toggleIDProtection(payload: { domain_id: string; enabled: boolean }, admin: any) {
    await admin.from("registrar_domains").update({ id_protection: payload.enabled }).eq("id", payload.domain_id);
    return { ok: true };
  },
};

const drivers: Record<string, typeof mockDriver> = {
  hostneed: mockDriver, // mock until real wiring
  mock: mockDriver,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Resolve active provider
    const { data: provider } = await admin
      .from("registrar_providers")
      .select("*")
      .eq("is_enabled", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!provider) throw new Error("No registrar provider configured");

    const driver = drivers[provider.is_mock ? "mock" : provider.provider_type] ?? mockDriver;

    const body = await req.json();
    const { action, payload = {} } = body ?? {};
    const fn = (driver as any)[action];
    if (typeof fn !== "function") {
      return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await fn(payload, admin, userId, provider.id);
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("registrar-api error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
