import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Github, Rocket, ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const GITHUB_CLIENT_ID = "Ov23liINFOLIO_PLACEHOLDER"; // not used in code, kept inline
// We use edge-function-derived client IDs by reading from a public endpoint?
// Simpler: hardcode via env at build time isn't available — fetch via a tiny helper isn't worth it.
// Instead: embed the GITHUB_OAUTH_CLIENT_ID and VERCEL_CLIENT_ID through a public site_settings row.

interface Integration {
  provider: "github" | "vercel";
  account_login: string | null;
  metadata: any;
}

interface Deployment {
  id: string;
  deploy_url: string | null;
  repo_full_name: string | null;
  status: string;
  created_at: string;
}

export default function DashboardDeploy() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [oauthIds, setOauthIds] = useState<{ github?: string; vercel?: string }>({});

  useEffect(() => {
    if (!user) return;
    load();
    // Read public OAuth client IDs from site_settings
    supabase.from("site_settings").select("key,value")
      .in("key", ["github_oauth_client_id", "vercel_client_id"])
      .then(({ data }) => {
        const map: any = {};
        data?.forEach((r: any) => {
          if (r.key === "github_oauth_client_id") map.github = r.value?.id || r.value;
          if (r.key === "vercel_client_id") map.vercel = r.value?.id || r.value;
        });
        setOauthIds(map);
      });
  }, [user]);

  useEffect(() => {
    const c = params.get("connected");
    const e = params.get("error");
    if (c) { toast.success(`${c} connected!`); setParams({}); load(); }
    if (e) { toast.error(`Error: ${e}`); setParams({}); }
  }, [params]);

  const load = async () => {
    setLoading(true);
    const [i, d] = await Promise.all([
      supabase.from("user_integrations").select("provider,account_login,metadata").eq("user_id", user!.id),
      supabase.from("deployments").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10),
    ]);
    setIntegrations((i.data as any) || []);
    setDeployments((d.data as any) || []);
    setLoading(false);
  };

  const gh = integrations.find((x) => x.provider === "github");
  const vc = integrations.find((x) => x.provider === "vercel");

  const connectGithub = () => {
    if (!oauthIds.github) return toast.error("GitHub OAuth not configured by admin");
    const redirect = `${SUPABASE_URL}/functions/v1/github-oauth-callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${oauthIds.github}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo&state=${user!.id}`;
    window.location.href = url;
  };

  const connectVercel = () => {
    if (!oauthIds.vercel) return toast.error("Vercel OAuth not configured by admin");
    const redirect = `${SUPABASE_URL}/functions/v1/vercel-oauth-callback`;
    const url = `https://vercel.com/integrations/${oauthIds.vercel}/new?state=${user!.id}&redirect_uri=${encodeURIComponent(redirect)}`;
    window.location.href = url;
  };

  const disconnect = async (provider: "github" | "vercel") => {
    const { error } = await supabase.functions.invoke("disconnect-integration", { body: { provider } });
    if (error) return toast.error(error.message);
    toast.success(`${provider} disconnected`);
    load();
  };

  const deploy = async () => {
    setDeploying(true);
    const { data, error } = await supabase.functions.invoke("deploy-portfolio");
    setDeploying(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error!.message);
      return;
    }
    toast.success("Deploy started! Live URL will appear shortly.");
    load();
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Deploy — Infolio</title><meta name="robots" content="noindex,nofollow" /></Helmet>

      <div>
        <h1 className="text-2xl font-bold">One-Click Deploy</h1>
        <p className="text-sm text-muted-foreground">Push your portfolio to your own GitHub & Vercel account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Github className="w-5 h-5" /> GitHub
              {gh ? <Badge className="ml-auto bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>
                  : <Badge variant="secondary" className="ml-auto"><XCircle className="w-3 h-3 mr-1" />Not connected</Badge>}
            </CardTitle>
            <CardDescription>{gh ? `@${gh.account_login}` : "Authorize so we can create a repo for your portfolio."}</CardDescription>
          </CardHeader>
          <CardContent>
            {gh
              ? <Button variant="outline" onClick={() => disconnect("github")}>Disconnect</Button>
              : <Button onClick={connectGithub}><Github className="w-4 h-4 mr-2" />Connect GitHub</Button>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5" /> Vercel
              {vc ? <Badge className="ml-auto bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>
                  : <Badge variant="secondary" className="ml-auto"><XCircle className="w-3 h-3 mr-1" />Not connected</Badge>}
            </CardTitle>
            <CardDescription>{vc ? `@${vc.account_login}` : "Authorize Vercel to deploy your repo."}</CardDescription>
          </CardHeader>
          <CardContent>
            {vc
              ? <Button variant="outline" onClick={() => disconnect("vercel")}>Disconnect</Button>
              : <Button onClick={connectVercel}><Rocket className="w-4 h-4 mr-2" />Connect Vercel</Button>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deploy</CardTitle>
          <CardDescription>Creates a repo on your GitHub from the Infolio template, links it to Vercel, and triggers a production build.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" disabled={!gh || !vc || deploying} onClick={deploy}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
            {deploying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deploying…</> : <><Rocket className="w-4 h-4 mr-2" />Deploy to Vercel</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Deployments</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" />
            : deployments.length === 0 ? <p className="text-sm text-muted-foreground">No deployments yet.</p>
            : <ul className="space-y-2">
                {deployments.map((d) => (
                  <li key={d.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.repo_full_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()} · {d.status}</p>
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
