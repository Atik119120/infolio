import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = Deno.env.get("APP_URL") ?? "https://alphaportfolio0.lovable.app";
const REDIRECT_URI = `${Deno.env.get("SUPABASE_URL")}/functions/v1/vercel-oauth-callback`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  // Vercel may pass `state` or `s` depending on install URL
  const state = url.searchParams.get("state") || url.searchParams.get("s");

  if (!code || !state) {
    return Response.redirect(`${APP_URL}/dashboard/deploy?error=missing_code`, 302);
  }

  try {
    const body = new URLSearchParams({
      client_id: Deno.env.get("VERCEL_CLIENT_ID")!,
      client_secret: Deno.env.get("VERCEL_CLIENT_SECRET")!,
      code,
      redirect_uri: REDIRECT_URI,
    });
    const tokenRes = await fetch("https://api.vercel.com/v2/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) throw new Error(JSON.stringify(tokenJson));

    // Get user info
    const userRes = await fetch("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userJson = await userRes.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("user_integrations").upsert({
      user_id: state,
      provider: "vercel",
      access_token: accessToken,
      account_login: userJson.user?.username || userJson.user?.name,
      metadata: {
        team_id: tokenJson.team_id ?? null,
        installation_id: tokenJson.installation_id ?? null,
        user_id_vercel: tokenJson.user_id ?? userJson.user?.id,
      },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,provider" });

    return Response.redirect(`${APP_URL}/dashboard/deploy?connected=vercel`, 302);
  } catch (e) {
    console.error("vercel-oauth", e);
    return Response.redirect(`${APP_URL}/dashboard/deploy?error=${encodeURIComponent(String(e))}`, 302);
  }
});
