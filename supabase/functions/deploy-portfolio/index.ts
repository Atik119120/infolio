import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ROOT_DOMAIN = Deno.env.get("DEPLOY_ROOT_DOMAIN") ?? "infolio.online";
const VERCEL_TOKEN = Deno.env.get("VERCEL_API_TOKEN") ?? "";
const VERCEL_TEAM = (Deno.env.get("VERCEL_TEAM_ID") ?? "").trim();

type StepStatus = "pending" | "running" | "success" | "error";
type DeployStep = "github" | "project" | "deploy" | "domain" | "complete";
type LogEntry = { step: DeployStep; status: StepStatus; message: string; at: string; details?: unknown };
type DeploymentFile = { file: string; data: string; encoding: "base64" };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeSubdomain(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

function getVercelUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`https://api.vercel.com${cleanPath}`);
  if (VERCEL_TEAM) url.searchParams.set("teamId", VERCEL_TEAM);
  return url.toString();
}

async function parseApiError(res: Response, label: string) {
  const text = await res.text();
  let parsed: any = null;
  try { parsed = JSON.parse(text); } catch (_) { parsed = null; }
  const message = parsed?.error?.message || parsed?.message || text || `${label} failed`;
  const code = parsed?.error?.code || parsed?.code || res.status;
  const err = new Error(`${label}: ${message}`) as Error & { details?: unknown; status?: number; code?: string };
  err.details = parsed || text;
  err.status = res.status;
  err.code = String(code);
  return err;
}

async function vercelFetch(path: string, init: RequestInit = {}, label = "Vercel request") {
  const res = await fetch(getVercelUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw await parseApiError(res, label);
  return res.json();
}

async function githubFetch(url: string, headers: Record<string, string>, label: string) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw await parseApiError(res, label);
  return res.json();
}

function shouldSkipFile(path: string, size = 0) {
  const blocked = ["node_modules/", ".git/", "dist/", "build/", ".next/", "coverage/", ".vercel/", "bun.lockb"];
  return blocked.some((p) => path === p.replace("/", "") || path.includes(p)) || size > 1_000_000;
}

async function collectGithubFiles(repoFullName: string, branch: string, ghHeaders: Record<string, string>) {
  const [owner, repo] = repoFullName.split("/");
  const tree = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    ghHeaders,
    "GitHub source files"
  );
  const blobs = (tree.tree || []).filter((item: any) => item.type === "blob" && !shouldSkipFile(item.path, item.size));
  if (!blobs.length) throw new Error("No deployable source files found in this repository");
  if (blobs.length > 500) throw new Error("Repository is too large for instant deployment. Please use a smaller Vite/React project.");

  const files: DeploymentFile[] = [];
  let totalSize = 0;
  for (const item of blobs) {
    totalSize += item.size || 0;
    if (totalSize > 10_000_000) throw new Error("Repository source is too large for instant deployment. Please remove large files and try again.");
    const blob = await githubFetch(item.url, ghHeaders, `GitHub file ${item.path}`);
    files.push({ file: item.path, data: String(blob.content || "").replace(/\n/g, ""), encoding: "base64" });
  }
  return files;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: claims } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
  if (!claims?.claims) return json({ error: "Unauthorized" }, 401);

  const userId = claims.claims.sub;
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const logs: LogEntry[] = [];
  let deploymentRowId: string | null = null;

  const addLog = async (step: DeployStep, status: StepStatus, message: string, details?: unknown) => {
    logs.push({ step, status, message, at: new Date().toISOString(), details });
    if (deploymentRowId) {
      await admin.from("deployments").update({ logs, status: status === "error" ? "FAILED" : step }).eq("id", deploymentRowId);
    }
  };

  try {
    if (!VERCEL_TOKEN) throw new Error("Platform deployment token is missing");

    const body = await req.json().catch(() => ({}));
    const source: "template" | "import" = body.source === "import" ? "import" : "template";
    const requestedSub = sanitizeSubdomain(body.subdomain || "");
    let repoFullName: string | undefined = body.repo_full_name;

    const { data: integ } = await admin.from("user_integrations").select("*").eq("user_id", userId).eq("provider", "github").maybeSingle();
    if (!integ) throw new Error("Connect GitHub first");

    const { data: profile } = await admin.from("profiles").select("username").eq("user_id", userId).single();
    if (!profile) throw new Error("Profile not found");

    const subdomain = requestedSub || sanitizeSubdomain(profile.username);
    if (!subdomain) throw new Error("Enter a valid subdomain");
    if (["www", "app", "api", "admin", "mail", "infolio"].includes(subdomain)) throw new Error("This subdomain is reserved");

    const { data: clash } = await admin.from("deployments").select("user_id").eq("subdomain", subdomain).maybeSingle();
    if (clash && clash.user_id !== userId) throw new Error(`Subdomain ${subdomain}.${ROOT_DOMAIN} is already taken`);

    const projectSlug = `infolio-${subdomain}`.replace(/[^a-z0-9-]/g, "-").slice(0, 100);
    const { data: inserted, error: insertError } = await admin.from("deployments").insert({
      user_id: userId,
      repo_full_name: repoFullName || null,
      deploy_url: `https://${subdomain}.${ROOT_DOMAIN}`,
      subdomain,
      source,
      project_name: projectSlug,
      status: "QUEUED",
      logs,
    }).select("id").single();
    if (insertError) throw new Error(insertError.message);
    deploymentRowId = inserted.id;

    await addLog("github", "running", source === "template" ? "Creating Infolio starter repository" : "Preparing selected GitHub repository");
    const ghHeaders = { Authorization: `Bearer ${integ.access_token}`, Accept: "application/vnd.github+json", "User-Agent": "Infolio-Deploy" };
    let defaultBranch = "main";

    if (source === "template") {
      const tpl = Deno.env.get("DEPLOY_TEMPLATE_REPO");
      if (!tpl) throw new Error("Infolio starter template is not configured");
      const [tplOwner, tplName] = tpl.split("/");
      const repoName = `infolio-${subdomain}`;
      repoFullName = `${integ.account_login}/${repoName}`;

      const check = await fetch(`https://api.github.com/repos/${repoFullName}`, { headers: ghHeaders });
      if (check.status === 404) {
        const create = await fetch(`https://api.github.com/repos/${tplOwner}/${tplName}/generate`, {
          method: "POST",
          headers: { ...ghHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ name: repoName, private: false, include_all_branches: false }),
        });
        if (!create.ok) throw await parseApiError(create, "GitHub template import");
        await new Promise((r) => setTimeout(r, 2500));
      } else if (!check.ok) {
        throw await parseApiError(check, "GitHub repository check");
      }

      const envContent = `VITE_SUPABASE_URL=${Deno.env.get("SUPABASE_URL")}\nVITE_SUPABASE_PUBLISHABLE_KEY=${Deno.env.get("SUPABASE_ANON_KEY")}\nVITE_PORTFOLIO_USERNAME=${profile.username}\n`;
      let sha: string | undefined;
      const ex = await fetch(`https://api.github.com/repos/${repoFullName}/contents/.env.production`, { headers: ghHeaders });
      if (ex.ok) sha = (await ex.json()).sha;
      const putEnv = await fetch(`https://api.github.com/repos/${repoFullName}/contents/.env.production`, {
        method: "PUT",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "chore: configure Infolio deployment", content: btoa(envContent), sha }),
      });
      if (!putEnv.ok) throw await parseApiError(putEnv, "GitHub environment setup");
    }

    if (!repoFullName || !repoFullName.includes("/")) throw new Error("Repository not selected");
    const repoInfo = await githubFetch(`https://api.github.com/repos/${repoFullName}`, ghHeaders, "GitHub repository access");
    defaultBranch = repoInfo.default_branch || "main";
    await addLog("github", "success", `Repository ready: ${repoFullName}`);
    await admin.from("deployments").update({ repo_full_name: repoFullName }).eq("id", deploymentRowId);

    await addLog("project", "running", "Creating or updating Infolio deployment project");
    let project: any;
    try {
      project = await vercelFetch(`/v9/projects/${projectSlug}`, {}, "Project lookup");
    } catch (e: any) {
      if (e.status !== 404) throw e;
      project = await vercelFetch("/v9/projects", {
        method: "POST",
        body: JSON.stringify({
          name: projectSlug,
          framework: "vite",
          gitRepository: { type: "github", repo: repoFullName },
          buildCommand: null,
          outputDirectory: null,
          installCommand: null,
        }),
      }, "Project creation");
    }

    const projectId = project.id;
    await admin.from("deployments").update({ vercel_project_id: projectId }).eq("id", deploymentRowId);
    await addLog("project", "success", "Deployment project is ready");

    const fqdn = `${subdomain}.${ROOT_DOMAIN}`;
    await addLog("domain", "running", `Assigning ${fqdn}`);
    const domainPayload = { name: fqdn, gitBranch: defaultBranch };
    try {
      await vercelFetch(`/v10/projects/${projectId}/domains`, { method: "POST", body: JSON.stringify(domainPayload) }, "Domain assignment");
    } catch (e: any) {
      const msg = String(e.message || "");
      if (!msg.includes("already") && !msg.includes("in use")) throw e;
    }
    await addLog("domain", "success", `${fqdn} assigned`);

    await addLog("deploy", "running", "Collecting source files and publishing production website");
    const files = await collectGithubFiles(repoFullName, defaultBranch, ghHeaders);
    const envContent = `VITE_SUPABASE_URL=${Deno.env.get("SUPABASE_URL")}\nVITE_SUPABASE_PUBLISHABLE_KEY=${Deno.env.get("SUPABASE_ANON_KEY")}\nVITE_PORTFOLIO_USERNAME=${profile.username}\n`;
    const envFile = { file: ".env.production", data: btoa(envContent), encoding: "base64" as const };
    const deployFiles = [envFile, ...files.filter((f) => f.file !== ".env.production")];
    const deployment = await vercelFetch("/v13/deployments", {
      method: "POST",
      body: JSON.stringify({
        name: projectSlug,
        project: projectId,
        target: "production",
        files: deployFiles,
        projectSettings: { framework: "vite" },
        meta: { infolioUserId: userId, infolioSubdomain: subdomain },
      }),
    }, "Production deployment");

    await admin.from("deployments").update({
      vercel_deployment_id: deployment.id,
      status: deployment.readyState || "BUILDING",
      deploy_url: `https://${fqdn}`,
      error: null,
      logs,
    }).eq("id", deploymentRowId);
    await addLog("complete", "success", "Deployment started successfully. The live URL will be ready after the build finishes.");

    return json({ success: true, deploymentId: deploymentRowId, deployUrl: `https://${fqdn}`, subdomain, repo: repoFullName, logs });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await addLog("complete", "error", message, (e as any)?.details);
    if (deploymentRowId) await admin.from("deployments").update({ status: "FAILED", error: message, logs }).eq("id", deploymentRowId);
    console.error("deploy-portfolio", message, (e as any)?.details || "");
    return json({ error: message, details: (e as any)?.details || null, logs }, 500);
  }
});