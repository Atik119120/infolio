import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = Deno.env.get("APP_URL") ?? "https://alphaportfolio0.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // = user_id

  if (!code || !state) {
    return Response.redirect(`${APP_URL}/dashboard/deploy?error=missing_code`, 302);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: Deno.env.get("GITHUB_OAUTH_CLIENT_ID"),
        client_secret: Deno.env.get("GITHUB_OAUTH_CLIENT_SECRET"),
        code,
      }),
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) throw new Error(tokenJson.error_description || "No token");

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "Infolio" },
    });
    const ghUser = await userRes.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("user_integrations").upsert({
      user_id: state,
      provider: "github",
      access_token: accessToken,
      account_login: ghUser.login,
      metadata: { avatar_url: ghUser.avatar_url, scope: tokenJson.scope },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,provider" });

    return Response.redirect(`${APP_URL}/dashboard/deploy?connected=github`, 302);
  } catch (e) {
    console.error("github-oauth", e);
    return Response.redirect(`${APP_URL}/dashboard/deploy?error=${encodeURIComponent(String(e))}`, 302);
  }
});
