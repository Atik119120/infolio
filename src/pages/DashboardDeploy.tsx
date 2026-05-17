import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Github, Rocket, ExternalLink, Loader2, CheckCircle2, XCircle, Globe, Sparkles, FolderGit2, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface Repo {
  id: number;
  full_name: string;
  name: string;
  private: boolean;
  default_branch: string;
  updated_at: string;
}

interface Deployment {
  id: string;
  deploy_url: string | null;
  error?: string | null;
  logs?: Array<{ step: string; status: string; message: string; at: string }> | null;
  project_name?: string | null;
  subdomain: string | null;
  repo_full_name: string | null;
  status: string;
  source: string | null;
  created_at: string;
}

export default function DashboardDeploy() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [githubLogin, setGithubLogin] = useState<string | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<Deployment["logs"]>([]);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [githubClientId, setGithubClientId] = useState<string | null>(null);
  const [rootDomain, setRootDomain] = useState("infolio.online");

  const [tab, setTab] = useState<"template" | "import">("template");
  const [subdomain, setSubdomain] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    load();
    supabase.functions.invoke("deploy-config").then(({ data }) => {
      if (data) {
        setGithubClientId((data as any).github_client_id);
        setRootDomain((data as any).root_domain || "infolio.online");
      }
    });
  }, [user]);

  useEffect(() => {
    const c = params.get("connected");
    const e = params.get("error");
    if (c) { toast.success("GitHub connected!"); setParams({}); load(); }
    if (e) { toast.error(`Error: ${e}`); setParams({}); }
  }, [params]);

  const load = async () => {
    setLoading(true);
    const [i, d] = await Promise.all([
      supabase.from("user_integrations").select("account_login").eq("user_id", user!.id).eq("provider", "github").maybeSingle(),
      supabase.from("deployments").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10),
    ]);
    setGithubLogin((i.data as any)?.account_login ?? null);
    setDeployments((d.data as any) || []);
    // Default subdomain from username
    if (!subdomain) {
      const { data: p } = await supabase.from("profiles").select("username").eq("user_id", user!.id).single();
      if (p?.username) setSubdomain(String(p.username).toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    }
    setLoading(false);
  };

  const loadRepos = async () => {
    setReposLoading(true);
    const { data, error } = await supabase.functions.invoke("list-github-repos");
    setReposLoading(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error!.message);
      return;
    }
    setRepos((data as any).repos || []);
  };

  useEffect(() => {
    if (tab === "import" && githubLogin && repos.length === 0) loadRepos();
  }, [tab, githubLogin]);

  const connectGithub = () => {
    if (!githubClientId) return toast.error("GitHub integration not configured");
    const redirect = `${SUPABASE_URL}/functions/v1/github-oauth-callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo&state=${user!.id}`;
  };

  const disconnectGithub = async () => {
    const { error } = await supabase.functions.invoke("disconnect-integration", { body: { provider: "github" } });
    if (error) return toast.error(error.message);
    toast.success("Disconnected");
    setRepos([]);
    load();
  };

  const cleanSub = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

  const deploy = async () => {
    const sub = cleanSub(subdomain);
    if (!sub) return toast.error("Enter a subdomain");
    if (tab === "import" && !selectedRepo) return toast.error("Pick a repository");

    setDeployError(null);
    setDeployLogs([
      { step: "github", status: "running", message: "Preparing GitHub repository", at: new Date().toISOString() },
    ]);
    setDeploying(true);
    const { data, error } = await supabase.functions.invoke("deploy-portfolio", {
      body: { source: tab, subdomain: sub, repo_full_name: tab === "import" ? selectedRepo : undefined },
    });
    setDeploying(false);
    if (error || (data as any)?.error) {
      const message = (data as any)?.error || error!.message || "Deployment failed";
      setDeployError(message);
      setDeployLogs((data as any)?.logs || []);
      toast.error(message);
      return;
    }
    setDeployLogs((data as any)?.logs || []);
    toast.success("Deployment started. Your live URL is being prepared.");
    load();
  };

  const steps = [
    { key: "github", label: "Cloning repository" },
    { key: "project", label: "Preparing project" },
    { key: "domain", label: "Assigning subdomain" },
    { key: "deploy", label: "Building website" },
    { key: "complete", label: "Live URL generated" },
  ];

  const getStepStatus = (key: string) => deployLogs?.filter((l) => l.step === key).at(-1)?.status;

  return (
    <div className="space-y-6">
      <Helmet><title>Deploy — Infolio</title><meta name="robots" content="noindex,nofollow" /></Helmet>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6 text-violet-500" /> Publish your website
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect GitHub, choose a project, and go live on a free <code>.{rootDomain}</code> subdomain.
          </p>
        </div>
      </div>

      {/* GitHub */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" /> GitHub Account
            {githubLogin
              ? <Badge className="ml-auto bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />@{githubLogin}</Badge>
              : <Badge variant="secondary" className="ml-auto"><XCircle className="w-3 h-3 mr-1" />Not connected</Badge>}
          </CardTitle>
          <CardDescription>
            We use GitHub to host your project's source code. Hosting and deployment are handled by Infolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {githubLogin
            ? <Button variant="outline" onClick={disconnectGithub}>Disconnect</Button>
            : <Button onClick={connectGithub}>
                <Github className="w-4 h-4 mr-2" />Connect GitHub
              </Button>}
        </CardContent>
      </Card>

      {/* Project source + subdomain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> New deployment</CardTitle>
          <CardDescription>Pick a starting point and your URL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subdomain</Label>
            <div className="flex items-center mt-1.5">
              <Input
                value={subdomain}
                onChange={(e) => setSubdomain(cleanSub(e.target.value))}
                placeholder="your-name"
                className="rounded-r-none"
                disabled={!githubLogin}
              />
              <div className="h-10 px-3 flex items-center border border-l-0 rounded-r-md bg-muted text-sm text-muted-foreground whitespace-nowrap">
                .{rootDomain}
              </div>
            </div>
            {subdomain && (
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> https://{subdomain}.{rootDomain}
              </p>
            )}
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="template"><Sparkles className="w-4 h-4 mr-1.5" />Infolio Template</TabsTrigger>
              <TabsTrigger value="import"><FolderGit2 className="w-4 h-4 mr-1.5" />Import Repo</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="mt-4">
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                Auto-creates an Infolio portfolio repo on your GitHub and deploys it. Perfect for beginners.
              </div>
            </TabsContent>

            <TabsContent value="import" className="mt-4 space-y-3">
              {!githubLogin
                ? <p className="text-sm text-muted-foreground">Connect GitHub first.</p>
                : reposLoading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : (
                    <div className="border rounded-lg max-h-72 overflow-y-auto divide-y">
                      {repos.length === 0 && <p className="p-4 text-sm text-muted-foreground">No repos found.</p>}
                      {repos.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRepo(r.full_name)}
                          className={`w-full text-left p-3 hover:bg-muted/50 flex items-center justify-between gap-2 ${selectedRepo === r.full_name ? "bg-primary/10" : ""}`}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{r.full_name}</p>
                            <p className="text-xs text-muted-foreground">{r.private ? "Private" : "Public"} · updated {new Date(r.updated_at).toLocaleDateString()}</p>
                          </div>
                          {selectedRepo === r.full_name && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
              {githubLogin && <Button size="sm" variant="ghost" onClick={loadRepos}>Refresh list</Button>}
            </TabsContent>
          </Tabs>

          <Button
            size="lg"
            disabled={!githubLogin || deploying || !subdomain}
            onClick={deploy}
            className="gradient-primary w-full sm:w-auto"
          >
            {deploying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing…</> : <><Rocket className="w-4 h-4 mr-2" />Publish Website</>}
          </Button>

          {(deployLogs?.length || deployError) && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              {deployError && (
                <div className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{deployError}</span>
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-5">
                {steps.map((s) => {
                  const status = getStepStatus(s.key);
                  const isRunning = status === "running" || (!status && deploying && s.key === "github");
                  const isSuccess = status === "success";
                  const isError = status === "error";
                  return (
                    <div key={s.key} className="rounded-md border bg-card p-3 text-xs">
                      <div className="flex items-center gap-2">
                        {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          : isSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          : isError ? <XCircle className="w-3.5 h-3.5 text-destructive" />
                          : <span className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />}
                        <span className="font-medium leading-tight">{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="max-h-36 overflow-y-auto rounded-md bg-background/70 p-2 text-xs text-muted-foreground space-y-1">
                {deployLogs?.map((log, i) => <p key={`${log.step}-${i}`}>{log.message}</p>)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent deployments</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" />
            : deployments.length === 0 ? <p className="text-sm text-muted-foreground">No deployments yet.</p>
            : <ul className="space-y-2">
                {deployments.map((d) => (
                  <li key={d.id} className="flex items-center justify-between border rounded-lg p-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {d.subdomain ? `${d.subdomain}.${rootDomain}` : d.repo_full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {new Date(d.created_at).toLocaleString()} · {d.status} · {d.source || "template"}
                      </p>
                      {d.error && <p className="text-xs text-destructive truncate mt-1">{d.error}</p>}
                    </div>
                    {d.deploy_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={d.deploy_url} target="_blank" rel="noreferrer">
                          Open <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>}
        </CardContent>
      </Card>
    </div>
  );
}
