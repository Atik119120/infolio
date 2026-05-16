import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ROOT_DOMAIN = Deno.env.get("DEPLOY_ROOT_DOMAIN") ?? "infolio.site";
const VERCEL_TOKEN = Deno.env.get("VERCEL_API_TOKEN")!;
const VERCEL_TEAM = Deno.env.get("VERCEL_TEAM_ID") ?? "";
const teamQ = VERCEL_TEAM ? `?teamId=${VERCEL_TEAM}` : "";
const teamQAmp = VERCEL_TEAM ? `&teamId=${VERCEL_TEAM}` : "";

const vcHeaders = {
  Authorization: `Bearer ${VERCEL_TOKEN}`,
  "Content-Type": "application/json",
};

function sanitizeSubdomain(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: claims } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
  if (!claims?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userId = claims.claims.sub;

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (!VERCEL_TOKEN) throw new Error("Platform Vercel token missing");

    const body = await req.json().catch(() => ({}));
    const source: "template" | "import" = body.source ?? "template";
    const requestedSub = sanitizeSubdomain(body.subdomain || "");
    let importRepo: string | undefined = body.repo_full_name;

    const { data: integ } = await admin
      .from("user_integrations").select("*")
      .eq("user_id", userId).eq("provider", "github").maybeSingle();
    if (!integ) throw new Error("Connect GitHub first");

    const { data: profile } = await admin
      .from("profiles").select("username").eq("user_id", userId).single();
    if (!profile) throw new Error("Profile not found");

    const subdomain = requestedSub || sanitizeSubdomain(profile.username);
    if (!subdomain) throw new Error("Invalid subdomain");

    // Uniqueness check
    const { data: clash } = await admin
      .from("deployments").select("user_id").eq("subdomain", subdomain).maybeSingle();
    if (clash && clash.user_id !== userId) throw new Error(`Subdomain ${subdomain} is taken`);

    const ghHeaders = {
      Authorization: `Bearer ${integ.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Infolio-Deploy",
    };

    let repoFullName = importRepo;

    if (source === "template") {
      const tpl = Deno.env.get("DEPLOY_TEMPLATE_REPO");
      if (!tpl) throw new Error("Template repo not configured");
      const [tplOwner, tplName] = tpl.split("/");
      const repoName = `infolio-${subdomain}`;
      repoFullName = `${integ.account_login}/${repoName}`;

      const check = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers: ghHeaders });
      if (check.status === 404) {
        const create = await fetch(
          `https://api.github.com/repos/${tplOwner}/${tplName}/generate`,
          {
            method: "POST",
            headers: { ...ghHeaders, "Content-Type": "application/json" },
            body: JSON.stringify({ name: repoName, private: false }),
          }
        );
        if (!create.ok) throw new Error(`GitHub repo create failed: ${await create.text()}`);
        await new Promise((r) => setTimeout(r, 2500));
      }

      // env file
      const envContent = `VITE_SUPABASE_URL=${Deno.env.get("SUPABASE_URL")}
VITE_SUPABASE_PUBLISHABLE_KEY=${Deno.env.get("SUPABASE_ANON_KEY")}
VITE_PORTFOLIO_USERNAME=${profile.username}
`;
      let sha: string | undefined;
      const ex = await fetch(`https://api.github.com/repos/${repoFullName}/contents/.env.production`, { headers: ghHeaders });
      if (ex.ok) sha = (await ex.json()).sha;
      await fetch(`https://api.github.com/repos/${repoFullName}/contents/.env.production`, {
        method: "PUT",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "chore: env", content: btoa(envContent), sha }),
      });
    }

    if (!repoFullName) throw new Error("Repository not selected");

    // ----- Vercel project (platform-owned) -----
    const projectSlug = `infolio-${subdomain}`.slice(0, 100);
    let projectId: string | null = null;

    const exProj = await fetch(`https://api.vercel.com/v9/projects/${projectSlug}${teamQ}`, { headers: vcHeaders });
    if (exProj.ok) {
      projectId = (await exProj.json()).id;
    } else {
      const createProj = await fetch(`https://api.vercel.com/v9/projects${teamQ}`, {
        method: "POST",
        headers: vcHeaders,
        body: JSON.stringify({
          name: projectSlug,
          framework: "vite",
          gitRepository: { type: "github", repo: repoFullName },
          environmentVariables: [
            { key: "VITE_SUPABASE_URL", value: Deno.env.get("SUPABASE_URL"), target: ["production","preview","development"], type: "plain" },
            { key: "VITE_SUPABASE_PUBLISHABLE_KEY", value: Deno.env.get("SUPABASE_ANON_KEY"), target: ["production","preview","development"], type: "plain" },
            { key: "VITE_PORTFOLIO_USERNAME", value: profile.username, target: ["production","preview","development"], type: "plain" },
          ],
        }),
      });
      const pj = await createProj.json();
      if (!createProj.ok) throw new Error(`Vercel project: ${JSON.stringify(pj)}`);
      projectId = pj.id;
    }

    // Attach subdomain alias (idempotent)
    const fqdn = `${subdomain}.${ROOT_DOMAIN}`;
    const addDomain = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains${teamQ}`, {
      method: "POST",
      headers: vcHeaders,
      body: JSON.stringify({ name: fqdn }),
    });
    if (!addDomain.ok) {
      const t = await addDomain.text();
      if (!t.includes("domain_already_in_use") && !t.includes("already exists")) {
        console.warn("alias attach:", t);
      }
    }

    // Trigger deployment
    const [org, repoOnly] = repoFullName.split("/");
    const depRes = await fetch(`https://api.vercel.com/v13/deployments${teamQ}`, {
      method: "POST",
      headers: vcHeaders,
      body: JSON.stringify({
        name: projectSlug,
        project: projectId,
        target: "production",
        gitSource: { type: "github", repo: repoOnly, org, ref: "main" },
      }),
    });
    const dep = await depRes.json();
    if (!depRes.ok) throw new Error(`Vercel deploy: ${JSON.stringify(dep)}`);

    const deployUrl = `https://${fqdn}`;

    await admin.from("deployments").insert({
      user_id: userId,
      vercel_project_id: projectId,
      vercel_deployment_id: dep.id,
      repo_full_name: repoFullName,
      deploy_url: deployUrl,
      subdomain,
      source,
      status: dep.readyState || "QUEUED",
    });

    return new Response(JSON.stringify({
      success: true, deployUrl, subdomain, repo: repoFullName,
      projectId, deploymentId: dep.id,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("deploy-portfolio", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
