const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return new Response(JSON.stringify({
    github_client_id: Deno.env.get("GITHUB_OAUTH_CLIENT_ID") ?? null,
    vercel_client_id: Deno.env.get("VERCEL_CLIENT_ID") ?? null,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
