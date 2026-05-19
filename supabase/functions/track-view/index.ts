import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function parseUA(ua: string) {
  const u = ua.toLowerCase();
  let device = "desktop";
  if (/mobile|iphone|android.*mobile/.test(u)) device = "mobile";
  else if (/ipad|tablet/.test(u)) device = "tablet";
  let browser = "other";
  if (u.includes("edg/")) browser = "Edge";
  else if (u.includes("chrome/") && !u.includes("edg/")) browser = "Chrome";
  else if (u.includes("safari/") && !u.includes("chrome/")) browser = "Safari";
  else if (u.includes("firefox/")) browser = "Firefox";
  let os = "other";
  if (u.includes("windows")) os = "Windows";
  else if (u.includes("mac os")) os = "macOS";
  else if (u.includes("android")) os = "Android";
  else if (u.includes("iphone") || u.includes("ipad")) os = "iOS";
  else if (u.includes("linux")) os = "Linux";
  return { device, browser, os };
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const { owner_id, page_type, slug, path, referrer, utm_source, utm_medium, utm_campaign } = body || {};
    if (!owner_id || !page_type || !["portfolio", "builder"].includes(page_type)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const ua = req.headers.get("user-agent") || "";
    const { device, browser, os } = parseUA(ua);
    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || null;
    const today = new Date().toISOString().slice(0, 10);
    const visitor_hash = (await sha256(`${ip}|${ua}|${owner_id}|${today}`)).slice(0, 32);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { error } = await supabase.from("page_views").insert({
      owner_id, page_type, slug, path, referrer, utm_source, utm_medium, utm_campaign,
      visitor_hash, country, device, browser, os,
    });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
