import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Github, Rocket, ExternalLink, Loader2, CheckCircle2, XCircle, Globe, Sparkles,
  FolderGit2, AlertCircle, Copy, RefreshCw, Trash2, MoreHorizontal, Clock, Zap, History,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { DeployDomainDialog } from "@/components/deploy/DeployDomainDialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface Repo { id: number; full_name: string; name: string; private: boolean; default_branch: string; updated_at: string; }
interface Deployment {
  id: string; deploy_url: string | null; deployment_url?: string | null;
  error?: string | null; logs?: Array<{ step: string; status: string; message: string; at: string }> | null;
  project_name?: string | null; subdomain: string | null; assigned_subdomain?: string | null;
  repo_full_name: string | null; status: string; source: string | null;
  active_theme_template?: string | null; created_at: string; ready_at?: string | null;
  is_active: boolean;
}

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

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
  const [domainDialog, setDomainDialog] = useState<{ open: boolean; subdomain: string | null }>({ open: false, subdomain: null });
  const [deleteTarget, setDeleteTarget] = useState<Deployment | null>(null);

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
    const c = params.get("connected"); const e = params.get("error");
    if (c) { toast.success("GitHub connected!"); setParams({}); load(); }
    if (e) { toast.error(`Error: ${e}`); setParams({}); }
  }, [params]);

  const load = async () => {
    setLoading(true);
    const [i, d] = await Promise.all([
      supabase.from("user_integrations").select("account_login").eq("user_id", user!.id).eq("provider", "github").maybeSingle(),
      supabase.from("deployments").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(20),
    ]);
    setGithubLogin((i.data as any)?.account_login ?? null);
    setDeployments((d.data as any) || []);
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
    if (error || (data as any)?.error) { toast.error((data as any)?.error || error!.message); return; }
    setRepos((data as any).repos || []);
  };

  useEffect(() => { if (tab === "import" && githubLogin && repos.length === 0) loadRepos(); }, [tab, githubLogin]);

  const connectGithub = () => {
    if (!githubClientId) return toast.error("GitHub integration not configured");
    const redirect = `${SUPABASE_URL}/functions/v1/github-oauth-callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo&state=${user!.id}`;
  };

  const disconnectGithub = async () => {
    const { error } = await supabase.functions.invoke("disconnect-integration", { body: { provider: "github" } });
    if (error) return toast.error(error.message);
    toast.success("Disconnected"); setRepos([]); load();
  };

  const cleanSub = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

  const deploy = async (overrideSubdomain?: string, overrideRepo?: string) => {
    const sub = cleanSub(overrideSubdomain || subdomain);
    if (!sub) return toast.error("Enter a subdomain");
    const useTab = overrideRepo ? "import" : tab;
    if (useTab === "import" && !(overrideRepo || selectedRepo)) return toast.error("Pick a repository");

    setDeployError(null);
    setDeployLogs([{ step: "github", status: "running", message: "Preparing repository", at: new Date().toISOString() }]);
    setDeploying(true);
    const { data, error } = await supabase.functions.invoke("deploy-portfolio", {
      body: { source: useTab, subdomain: sub, repo_full_name: useTab === "import" ? (overrideRepo || selectedRepo) : undefined },
    });
    setDeploying(false);
    if (error || (data as any)?.error) {
      const message = (data as any)?.error || error!.message || "Deployment failed";
      setDeployError(message); setDeployLogs((data as any)?.logs || []); toast.error(message); return;
    }
    setDeployLogs((data as any)?.logs || []);
    toast.success("Deployment complete");
    await load();
  };

  const redeploy = async (d: Deployment) => {
    const sub = d.assigned_subdomain || d.subdomain || "";
    toast.message(`Redeploying ${sub}.${rootDomain}…`);
    await deploy(sub, d.repo_full_name || undefined);
  };

  const archive = async (d: Deployment) => {
    const { error } = await supabase.from("deployments").update({ is_active: false }).eq("id", d.id);
    if (error) return toast.error(error.message);
    toast.success("Deployment removed");
    load();
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };

  const steps = [
    { key: "github", label: "Cloning repository" },
    { key: "project", label: "Preparing project" },
    { key: "domain", label: "Assigning subdomain" },
    { key: "deploy", label: "Building website" },
    { key: "complete", label: "Live URL ready" },
  ];
  const getStepStatus = (key: string) => {
    const m = deployLogs?.filter((l) => l.step === key) || [];
    return m.length ? m[m.length - 1].status : undefined;
  };

  const activeDeployments = deployments.filter((d) => d.is_active);
  const productionDeployment = activeDeployments.find((d) => d.status === "READY" || d.status === "ready") || activeDeployments[0];
  const history = deployments.filter((d) => d.id !== productionDeployment?.id);

  const statusConfig = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "READY") return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-500", label: "Live" };
    if (s === "BUILDING" || s === "QUEUED" || s === "INITIALIZING" || s === "PENDING") return { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500", label: "Building" };
    if (s === "ERROR" || s === "FAILED" || s === "CANCELED") return { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/30", dot: "bg-rose-500", label: "Failed" };
    return { color: "text-muted-foreground", bg: "bg-muted/40", border: "border-border", dot: "bg-muted-foreground", label: status || "Unknown" };
  };

  return (
    <div className="space-y-8">
      <Helmet><title>Deploy — Infolio</title><meta name="robots" content="noindex,nofollow" /></Helmet>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span className="relative inline-flex">
              <Rocket className="w-7 h-7 text-violet-500" />
              <span className="absolute inset-0 blur-xl bg-violet-500/40 rounded-full" />
            </span>
            Deployments
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Ship your portfolio to the web. Free <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">.{rootDomain}</code> subdomain included.
          </p>
        </div>
      </div>

      {/* Production callout */}
      {!loading && productionDeployment && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ProductionCard d={productionDeployment} rootDomain={rootDomain} statusConfig={statusConfig} onCopy={copy} onRedeploy={redeploy} onEditDomain={() => setDomainDialog({ open: true, subdomain: productionDeployment.assigned_subdomain || productionDeployment.subdomain })} onArchive={(d) => setDeleteTarget(d)} />
        </motion.div>
      )}

      {/* GitHub status — compact */}
      <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
        <CardContent className="py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${githubLogin ? "bg-emerald-500/10" : "bg-muted"}`}>
              <Github className={`w-4 h-4 ${githubLogin ? "text-emerald-500" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-medium">GitHub {githubLogin ? "Connected" : "Not Connected"}</p>
              <p className="text-xs text-muted-foreground">{githubLogin ? `@${githubLogin}` : "Required to deploy"}</p>
            </div>
          </div>
          {githubLogin
            ? <Button variant="ghost" size="sm" onClick={disconnectGithub}>Disconnect</Button>
            : <Button size="sm" onClick={connectGithub}><Github className="w-4 h-4 mr-2" />Connect</Button>}
        </CardContent>
      </Card>

      {/* New deployment */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> New Deployment</CardTitle>
          <CardDescription>Start from a template or import a GitHub repo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subdomain</Label>
            <div className="flex items-center mt-1.5 group">
              <Input value={subdomain} onChange={(e) => setSubdomain(cleanSub(e.target.value))} placeholder="your-name" className="rounded-r-none font-mono" disabled={!githubLogin} />
              <div className="h-10 px-3 flex items-center border border-l-0 rounded-r-md bg-muted/60 text-sm text-muted-foreground whitespace-nowrap font-mono">.{rootDomain}</div>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="template"><Sparkles className="w-4 h-4 mr-1.5" />Infolio Template</TabsTrigger>
              <TabsTrigger value="import"><FolderGit2 className="w-4 h-4 mr-1.5" />Import Repo</TabsTrigger>
            </TabsList>
            <TabsContent value="template" className="mt-4">
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">Auto-creates an Infolio portfolio repo on your GitHub and deploys it.</div>
            </TabsContent>
            <TabsContent value="import" className="mt-4 space-y-3">
              {!githubLogin ? <p className="text-sm text-muted-foreground">Connect GitHub first.</p>
                : reposLoading ? <Loader2 className="w-5 h-5 animate-spin" />
                : <div className="border rounded-lg max-h-72 overflow-y-auto divide-y">
                    {repos.length === 0 && <p className="p-4 text-sm text-muted-foreground">No repos found.</p>}
                    {repos.map((r) => (
                      <button key={r.id} onClick={() => setSelectedRepo(r.full_name)}
                        className={`w-full text-left p-3 hover:bg-muted/50 flex items-center justify-between gap-2 transition-colors ${selectedRepo === r.full_name ? "bg-primary/10" : ""}`}>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{r.full_name}</p>
                          <p className="text-xs text-muted-foreground">{r.private ? "Private" : "Public"} · {new Date(r.updated_at).toLocaleDateString()}</p>
                        </div>
                        {selectedRepo === r.full_name && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>}
              {githubLogin && <Button size="sm" variant="ghost" onClick={loadRepos}>Refresh</Button>}
            </TabsContent>
          </Tabs>

          <Button size="lg" disabled={!githubLogin || deploying || !subdomain} onClick={() => deploy()} className="gradient-primary w-full sm:w-auto shadow-lg shadow-primary/20">
            {deploying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing…</> : <><Rocket className="w-4 h-4 mr-2" />Publish Website</>}
          </Button>

          <AnimatePresence>
            {(deployLogs?.length || deployError) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border bg-muted/30 p-4 space-y-3 overflow-hidden">
                {deployError && (
                  <div className="flex items-start gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{deployError}</span>
                  </div>
                )}
                <div className="grid gap-2 sm:grid-cols-5">
                  {steps.map((s) => {
                    const status = getStepStatus(s.key);
                    const isRunning = status === "running" || (!status && deploying && s.key === "github");
                    const isSuccess = status === "success"; const isError = status === "error";
                    return (
                      <div key={s.key} className={`rounded-md border p-3 text-xs transition-colors ${isSuccess ? "bg-emerald-500/5 border-emerald-500/20" : isError ? "bg-rose-500/5 border-rose-500/20" : isRunning ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
                        <div className="flex items-center gap-2">
                          {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                            : isSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            : isError ? <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            : <span className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />}
                          <span className="font-medium leading-tight">{s.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Deployment History</h2>
          <Badge variant="secondary" className="ml-1">{deployments.length}</Badge>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[0,1,2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : deployments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Rocket className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium">No deployments yet</p>
              <p className="text-xs text-muted-foreground mt-1">Publish your first website to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {history.map((d) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <HistoryRow d={d} rootDomain={rootDomain} statusConfig={statusConfig} onCopy={copy} onRedeploy={redeploy} onArchive={(x) => setDeleteTarget(x)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <DeployDomainDialog open={domainDialog.open} onOpenChange={(o) => setDomainDialog((s) => ({ ...s, open: o }))} subdomain={domainDialog.subdomain} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this deployment?</AlertDialogTitle>
            <AlertDialogDescription>
              The deployment will be archived and removed from your list. The live URL will stop serving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (deleteTarget) archive(deleteTarget); setDeleteTarget(null); }}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ============ Production Card ============ */
function ProductionCard({ d, rootDomain, statusConfig, onCopy, onRedeploy, onEditDomain, onArchive }: {
  d: Deployment; rootDomain: string; statusConfig: (s: string) => any;
  onCopy: (t: string) => void; onRedeploy: (d: Deployment) => void; onEditDomain: () => void; onArchive: (d: Deployment) => void;
}) {
  const cfg = statusConfig(d.status);
  const sub = d.assigned_subdomain || d.subdomain;
  const url = d.deployment_url || d.deploy_url;
  const fullUrl = sub ? `https://${sub}.${rootDomain}` : url;
  const isLive = cfg.label === "Live";

  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card backdrop-blur-sm">
      {isLive && <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />}
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {isLive && (
                <motion.div className="relative" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Badge className="bg-emerald-500 text-white border-0 px-2.5 py-0.5 font-semibold tracking-wide shadow-lg shadow-emerald-500/40">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    LIVE
                  </Badge>
                </motion.div>
              )}
              {!isLive && (
                <Badge className={`${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5`} />{cfg.label}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Deployed {timeAgo(d.created_at)}</span>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Production URL</p>
              <div className="flex items-center gap-2 flex-wrap">
                <a href={fullUrl || "#"} target="_blank" rel="noreferrer"
                  className="font-mono text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hover:from-primary hover:to-primary/70 transition-all">
                  {sub}<span className="text-muted-foreground">.{rootDomain}</span>
                </a>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => fullUrl && onCopy(fullUrl)}><Copy className="w-3.5 h-3.5" /></Button>
                {fullUrl && (
                  <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                    <a href={fullUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
              {d.repo_full_name && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{d.repo_full_name}</span>}
              {(d.active_theme_template || d.source) && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{d.active_theme_template || d.source}</span>}
              {d.ready_at && <span>Ready {timeAgo(d.ready_at)}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={onEditDomain}><Globe className="w-4 h-4 mr-1.5" />Edit Domain</Button>
            <Button variant="outline" size="sm" onClick={() => onRedeploy(d)}><RefreshCw className="w-4 h-4 mr-1.5" />Redeploy</Button>
            {fullUrl && <Button size="sm" asChild className="gradient-primary"><a href={fullUrl} target="_blank" rel="noreferrer"><Zap className="w-4 h-4 mr-1.5" />Open Site</a></Button>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => fullUrl && onCopy(fullUrl)}><Copy className="w-4 h-4 mr-2" />Copy URL</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onArchive(d)}><Trash2 className="w-4 h-4 mr-2" />Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {d.error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-rose-500 bg-rose-500/5 border border-rose-500/20 rounded p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{d.error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ============ History Row ============ */
function HistoryRow({ d, rootDomain, statusConfig, onCopy, onRedeploy, onArchive }: {
  d: Deployment; rootDomain: string; statusConfig: (s: string) => any;
  onCopy: (t: string) => void; onRedeploy: (d: Deployment) => void; onArchive: (d: Deployment) => void;
}) {
  const cfg = statusConfig(d.status);
  const sub = d.assigned_subdomain || d.subdomain;
  const url = d.deployment_url || d.deploy_url;
  const fullUrl = sub ? `https://${sub}.${rootDomain}` : url;

  return (
    <div className="group border border-border/60 rounded-lg p-3 sm:p-4 bg-card/40 hover:bg-card/80 hover:border-border transition-all flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm truncate">{sub || d.repo_full_name}<span className="text-muted-foreground">.{rootDomain}</span></span>
            <Badge variant="outline" className={`${cfg.color} ${cfg.border} text-[10px] px-1.5 py-0`}>{cfg.label}</Badge>
            {!d.is_active && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Archived</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {timeAgo(d.created_at)} · {d.active_theme_template || d.source || "template"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
        {fullUrl && <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onCopy(fullUrl)}><Copy className="w-3.5 h-3.5" /></Button>}
        {fullUrl && <Button size="icon" variant="ghost" className="h-8 w-8" asChild><a href={fullUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a></Button>}
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onRedeploy(d)}><RefreshCw className="w-3.5 h-3.5" /></Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onArchive(d)}><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    </div>
  );
}
