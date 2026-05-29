import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { RegistrarProvider } from "@/lib/registrar/types";
import { Server } from "lucide-react";

export default function AdminRegistrarProviders() {
  const [providers, setProviders] = useState<RegistrarProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("registrar_providers").select("*").order("created_at");
    setProviders((data as RegistrarProvider[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleEnabled = async (p: RegistrarProvider, enabled: boolean) => {
    const { error } = await supabase.from("registrar_providers").update({ is_enabled: enabled }).eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success(`${p.name} ${enabled ? "enabled" : "disabled"}`); load(); }
  };

  const makeDefault = async (p: RegistrarProvider) => {
    await supabase.from("registrar_providers").update({ is_default: false }).neq("id", p.id);
    const { error } = await supabase.from("registrar_providers").update({ is_default: true }).eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success(`${p.name} set as default`); load(); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">API Providers</h1>
          <p className="text-sm text-slate-400 mt-1">Registrar API integrations</p>
        </div>
        <Button disabled className="bg-orange-500/30 text-white/60 cursor-not-allowed">Add Provider (Phase 2)</Button>
      </div>

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
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{p.name}</h3>
                      {p.is_default && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Default</Badge>}
                      {p.is_mock && <Badge variant="outline" className="border-yellow-500/40 text-yellow-400">Mock</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{p.provider_type} · {p.api_endpoint || "—"}</p>
                    {p.notes && <p className="text-xs text-slate-400 mt-2 max-w-md">{p.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Enabled</span>
                    <Switch checked={p.is_enabled} onCheckedChange={(v) => toggleEnabled(p, v)} />
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
