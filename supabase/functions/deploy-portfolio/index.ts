import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { data: integrations } = await admin
      .from("user_integrations")
      .select("*")
      .eq("user_id", userId);

    const gh = integrations?.find((i) => i.provider === "github");
    const vc = integrations?.find((i) => i.provider === "vercel");
    if (!gh || !vc) throw new Error("Connect GitHub and Vercel first");

    const { data: profile } = await admin
      .from("profiles").select("username").eq("user_id", userId).single();
    if (!profile) throw new Error("Profile not found");

    const templateRepo = Deno.env.get("DEPLOY_TEMPLATE_REPO"); // "owner/repo"
    if (!templateRepo) throw new Error("DEPLOY_TEMPLATE_REPO not set");
    const [tplOwner, tplName] = templateRepo.split("/");

    const repoName = `infolio-${profile.username}`;

    // 1. Create repo from template on user's GitHub
    const ghHeaders = {
      Authorization: `Bearer ${gh.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Infolio-Deploy",
    };

    let repoFullName = `${gh.account_login}/${repoName}`;
    const checkRepo = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers: ghHeaders });
    if (checkRepo.status === 404) {
      const createRepo = await fetch(
        `https://api.github.com/repos/${tplOwner}/${tplName}/generate`,
        {
          method: "POST",
          headers: { ...ghHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ name: repoName, private: false, include_all_branches: false }),
        }
      );
      if (!createRepo.ok) {
        const err = await createRepo.text();
        throw new Error(`GitHub repo create failed: ${err}`);
      }
      const repoJson = await createRepo.json();
      repoFullName = repoJson.full_name;
    }

    // 2. Commit/update .env.production with portfolio username
    const envContent = `VITE_SUPABASE_URL=${Deno.env.get("SUPABASE_URL")}
VITE_SUPABASE_PUBLISHABLE_KEY=${Deno.env.get("SUPABASE_ANON_KEY")}
VITE_PORTFOLIO_USERNAME=${profile.username}
`;
    const encodedEnv = btoa(envContent);

    // get existing file SHA if exists
    let existingSha: string | undefined;
    const existing = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/.env.production`,
      { headers: ghHeaders }
    );
    if (existing.ok) {
      const j = await existing.json();
      existingSha = j.sha;
    }

    // GitHub template generation is async — wait briefly
    await new Promise((r) => setTimeout(r, 2000));

    const putRes = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/.env.production`,
      {
        method: "PUT",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "chore: configure portfolio env",
          content: encodedEnv,
          sha: existingSha,
        }),
      }
    );
    if (!putRes.ok) {
      console.warn("env commit failed (non-fatal):", await putRes.text());
    }

    // 3. Vercel project setup
    const vcHeaders = {
      Authorization: `Bearer ${vc.access_token}`,
      "Content-Type": "application/json",
    };
    const teamQ = vc.metadata?.team_id ? `?teamId=${vc.metadata.team_id}` : "";

    let projectId = (vc.metadata as any)?.[`project_${profile.username}`];
    if (!projectId) {
      // Vercel needs a GitHub repo ID
      const repoMeta = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers: ghHeaders }).then(r => r.json());
      const projRes = await fetch(`https://api.vercel.com/v9/projects${teamQ}`, {
        method: "POST",
        headers: vcHeaders,
        body: JSON.stringify({
          name: repoName.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 100),
          framework: "vite",
          gitRepository: { type: "github", repo: repoFullName },
          environmentVariables: [
            { key: "VITE_SUPABASE_URL", value: Deno.env.get("SUPABASE_URL"), target: ["production","preview","development"], type: "plain" },
            { key: "VITE_SUPABASE_PUBLISHABLE_KEY", value: Deno.env.get("SUPABASE_ANON_KEY"), target: ["production","preview","development"], type: "plain" },
            { key: "VITE_PORTFOLIO_USERNAME", value: profile.username, target: ["production","preview","development"], type: "plain" },
          ],
        }),
      });
      const projJson = await projRes.json();
      if (!projRes.ok) throw new Error(`Vercel project create: ${JSON.stringify(projJson)}`);
      projectId = projJson.id;
    }

    // 4. Trigger deployment
    const depRes = await fetch(`https://api.vercel.com/v13/deployments${teamQ}`, {
      method: "POST",
      headers: vcHeaders,
      body: JSON.stringify({
        name: repoName,
        project: projectId,
        target: "production",
        gitSource: {
          type: "github",
          repo: repoFullName.split("/")[1],
          org: repoFullName.split("/")[0],
          ref: "main",
        },
      }),
    });
    const depJson = await depRes.json();
    if (!depRes.ok) throw new Error(`Vercel deploy: ${JSON.stringify(depJson)}`);

    const deployUrl = depJson.url ? `https://${depJson.url}` : null;

    // Save deployment record
    await admin.from("deployments").insert({
      user_id: userId,
      vercel_project_id: projectId,
      vercel_deployment_id: depJson.id,
      repo_full_name: repoFullName,
      deploy_url: deployUrl,
      status: depJson.readyState || "QUEUED",
    });

    // Save back project_id so we don't recreate
    await admin.from("user_integrations").update({
      metadata: { ...(vc.metadata as any), [`project_${profile.username}`]: projectId },
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId).eq("provider", "vercel");

    return new Response(JSON.stringify({
      success: true, deployUrl, repo: repoFullName, projectId, deploymentId: depJson.id,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("deploy-portfolio", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
