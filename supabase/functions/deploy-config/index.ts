const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return new Response(JSON.stringify({
    github_client_id: Deno.env.get("GITHUB_OAUTH_CLIENT_ID") ?? null,
    root_domain: Deno.env.get("DEPLOY_ROOT_DOMAIN") ?? "infolio.site",
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
