import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { RegistrarProvider } from "@/lib/registrar/types";
import { testConnection, getProviderStatus } from "@/lib/registrar/api";
import { Server, CheckCircle2, AlertTriangle, Plug, Loader2 } from "lucide-react";

export default function AdminRegistrarProviders() {
  const [providers, setProviders] = useState<RegistrarProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [credsPresent, setCredsPresent] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("registrar_providers").select("*").order("created_at");
    setProviders((data as RegistrarProvider[]) ?? []);
    try {
      const s = await getProviderStatus();
      setCredsPresent(s.hostneed_credentials_present);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateField = async (p: RegistrarProvider, patch: Partial<RegistrarProvider>, msg: string) => {
    const { error } = await supabase.from("registrar_providers").update(patch as any).eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success(msg); load(); }
  };

  const makeDefault = async (p: RegistrarProvider) => {
    await supabase.from("registrar_providers").update({ is_default: false }).neq("id", p.id);
    await updateField(p, { is_default: true }, `${p.name} set as default`);
  };

  const runTest = async () => {
  const runTest = async () => {
    setTesting(true);
    try {
      const r: any = await testConnection();
      console.log("[testConnection] full response", r);
      if (r.ok && !r.using_mock_fallback) toast.success(`✓ ${r.provider}: ${r.message}`);
      else if (r.using_mock_fallback) toast.warning(`Using Mock fallback: ${r.message}`);
      else {
        const detail = [r.kind, r.message, r.http_status ? `HTTP ${r.http_status}` : null]
          .filter(Boolean).join(" — ");
        toast.error(`✗ ${r.provider}: ${detail}`, { duration: 12000, description: r.endpoint });
      }
    } catch (e: any) {
      console.error("[testConnection] threw", e);
      toast.error(e?.message ?? "Test failed", { duration: 12000 });
    }
    finally { setTesting(false); }
  };


  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">API Providers</h1>
          <p className="text-sm text-slate-400 mt-1">Registrar API integrations & driver switching</p>
        </div>
        <Button onClick={runTest} disabled={testing} className="bg-orange-500 hover:bg-orange-600">
          {testing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plug className="w-4 h-4 mr-1" />}
          Test Active Provider
        </Button>
      </div>

      <Card className={`p-4 border ${credsPresent ? "bg-green-500/5 border-green-500/30" : "bg-yellow-500/5 border-yellow-500/30"}`}>
        <div className="flex items-start gap-3">
          {credsPresent
            ? <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
            : <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />}
          <div>
            <p className="text-sm text-white font-medium">
              HostNeed Credentials: {credsPresent ? "Configured" : "Missing"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {credsPresent
                ? "All 3 secrets present (HOSTNEED_API_URL, HOSTNEED_USERNAME, HOSTNEED_API_SECRET). HostNeed driver will run when enabled & non-mock."
                : "Add secrets to enable real driver. System auto-falls back to Mock driver until credentials are present."}
            </p>
          </div>
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="grid gap-3">
          {providers.map((p) => (
            <Card key={p.id} className="p-5 bg-slate-900/50 border-slate-800">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <Server className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-white">{p.name}</h3>
                      {p.is_default && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Default</Badge>}
                      {p.is_mock
                        ? <Badge variant="outline" className="border-yellow-500/40 text-yellow-400">Mock Mode</Badge>
                        : <Badge variant="outline" className="border-green-500/40 text-green-400">Live</Badge>}
                      <Badge variant="outline" className="border-slate-600 text-slate-400 capitalize">{p.provider_type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 break-all">{p.api_endpoint || "—"}</p>
                    {p.notes && <p className="text-xs text-slate-400 mt-2 max-w-md">{p.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Enabled</span>
                    <Switch checked={p.is_enabled} onCheckedChange={(v) => updateField(p, { is_enabled: v }, `${p.name} ${v ? "enabled" : "disabled"}`)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Mock Mode</span>
                    <Switch checked={p.is_mock} onCheckedChange={(v) => updateField(p, { is_mock: v }, `Mock mode ${v ? "on" : "off"}`)} />
                  </div>
                  {!p.is_default && (
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => makeDefault(p)}>
                      Set Default
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
