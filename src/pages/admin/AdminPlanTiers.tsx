import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, CreditCard } from "lucide-react";

interface PlanRow {
  id: string;
  key: string;
  name: string;
  description: string | null;
  price_bdt: number;
  max_projects: number;
  max_websites: number;
  storage_mb: number;
  allow_custom_domain: boolean;
  allow_seo: boolean;
  premium_theme_access: string;
  included_premium_themes: number;
  extra_theme_price_bdt: number;
  allow_branding_toggle: boolean;
  allow_dev_features: boolean;
  sort_order: number;
  is_active: boolean;
}

export default function AdminPlanTiers() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>("manual");
  const [savingProvider, setSavingProvider] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: planRows }, { data: setting }] = await Promise.all([
      supabase.from("plans" as any).select("*").order("sort_order"),
      supabase.from("site_settings").select("value").eq("key", "active_payment_provider").maybeSingle(),
    ]);
    setPlans((planRows as any) ?? []);
    const raw = (setting as any)?.value;
    setProvider(typeof raw === "string" ? raw : "manual");
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<PlanRow>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const save = async (p: PlanRow) => {
    setSavingId(p.id);
    const { error } = await supabase
      .from("plans" as any)
      .update({
        name: p.name,
        description: p.description,
        price_bdt: p.price_bdt,
        max_projects: p.max_projects,
        max_websites: p.max_websites,
        storage_mb: p.storage_mb,
        allow_custom_domain: p.allow_custom_domain,
        allow_seo: p.allow_seo,
        premium_theme_access: p.premium_theme_access,
        included_premium_themes: p.included_premium_themes,
        extra_theme_price_bdt: p.extra_theme_price_bdt,
        allow_branding_toggle: p.allow_branding_toggle,
        allow_dev_features: p.allow_dev_features,
        sort_order: p.sort_order,
        is_active: p.is_active,
      })
      .eq("id", p.id);
    setSavingId(null);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
    else toast({ title: "Saved", description: `${p.name} plan updated.` });
  };

  const saveProvider = async (next: string) => {
    setSavingProvider(true);
    setProvider(next);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "active_payment_provider", value: next as any }, { onConflict: "key" });
    setSavingProvider(false);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
    else toast({ title: "Provider switched", description: `Active provider: ${next}` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Plan Tiers</h1>
        <p className="text-slate-400">Edit limits, prices, and feature flags for every plan. Changes apply instantly — no redeploy required.</p>
      </div>

      {/* Active payment provider */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Active Payment Provider
          </CardTitle>
          <CardDescription>Switch between manual (WhatsApp/admin approval) and future automated gateways.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={provider} onValueChange={saveProvider} disabled={savingProvider}>
            <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual (bKash / Nagad / WhatsApp)</SelectItem>
              <SelectItem value="company_gateway">Company Gateway (coming soon)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {plans.map((p) => (
        <Card key={p.id} className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{p.name} <span className="text-xs ml-2 px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{p.key}</span></span>
              <Button size="sm" onClick={() => save(p)} disabled={savingId === p.id}>
                {savingId === p.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </CardTitle>
            <CardDescription>{p.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Display name"><Input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} /></Field>
            <Field label="Description"><Input value={p.description || ""} onChange={(e) => update(p.id, { description: e.target.value })} /></Field>
            <Field label="Price (৳)"><Input type="number" value={p.price_bdt} onChange={(e) => update(p.id, { price_bdt: +e.target.value })} /></Field>
            <Field label="Max projects"><Input type="number" value={p.max_projects} onChange={(e) => update(p.id, { max_projects: +e.target.value })} /></Field>
            <Field label="Max websites"><Input type="number" value={p.max_websites} onChange={(e) => update(p.id, { max_websites: +e.target.value })} /></Field>
            <Field label="Storage (MB)"><Input type="number" value={p.storage_mb} onChange={(e) => update(p.id, { storage_mb: +e.target.value })} /></Field>
            <Field label="Premium theme access">
              <Select value={p.premium_theme_access} onValueChange={(v) => update(p.id, { premium_theme_access: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="limited">Limited (included count)</SelectItem>
                  <SelectItem value="all">All themes</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Included premium themes"><Input type="number" value={p.included_premium_themes} onChange={(e) => update(p.id, { included_premium_themes: +e.target.value })} /></Field>
            <Field label="Extra theme price (৳)"><Input type="number" value={p.extra_theme_price_bdt} onChange={(e) => update(p.id, { extra_theme_price_bdt: +e.target.value })} /></Field>

            <Toggle label="Allow custom domain" checked={p.allow_custom_domain} onChange={(v) => update(p.id, { allow_custom_domain: v })} />
            <Toggle label="Allow SEO controls" checked={p.allow_seo} onChange={(v) => update(p.id, { allow_seo: v })} />
            <Toggle label="Allow branding toggle (hide 'Built with Infolio')" checked={p.allow_branding_toggle} onChange={(v) => update(p.id, { allow_branding_toggle: v })} />
            <Toggle label="Allow developer features (Deploy, custom code)" checked={p.allow_dev_features} onChange={(v) => update(p.id, { allow_dev_features: v })} />
            <Toggle label="Active" checked={p.is_active} onChange={(v) => update(p.id, { is_active: v })} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/40">
      <span className="text-sm text-slate-300">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
