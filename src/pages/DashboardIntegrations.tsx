import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, MessageCircle, Send, Mail, Webhook, Github, CheckCircle2 } from "lucide-react";

type Provider = "whatsapp" | "telegram" | "smtp" | "webhook";

interface IntegrationDef {
  id: Provider;
  name: string;
  icon: any;
  desc: string;
  fields: { key: string; label: string; type?: string; placeholder?: string }[];
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    desc: "Show a WhatsApp chat button and receive contact form notifications.",
    fields: [
      { key: "phone_number", label: "Phone Number (with country code)", placeholder: "+8801XXXXXXXXX" },
      { key: "default_message", label: "Default Message", placeholder: "Hi! I found you on..." },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: Send,
    desc: "Get instant notifications in Telegram (orders, leads, messages).",
    fields: [
      { key: "bot_token", label: "Bot Token", type: "password", placeholder: "123456:ABC-DEF..." },
      { key: "chat_id", label: "Chat ID", placeholder: "-1001234567890" },
    ],
  },
  {
    id: "smtp",
    name: "SMTP (Email)",
    icon: Mail,
    desc: "Send transactional emails from your own domain.",
    fields: [
      { key: "host", label: "SMTP Host", placeholder: "smtp.gmail.com" },
      { key: "port", label: "Port", placeholder: "587" },
      { key: "username", label: "Username", placeholder: "you@example.com" },
      { key: "password", label: "Password / App Password", type: "password" },
      { key: "from_email", label: "From Email" },
      { key: "from_name", label: "From Name" },
    ],
  },
  {
    id: "webhook",
    name: "Webhooks",
    icon: Webhook,
    desc: "POST events (orders, messages, signups) to your endpoint.",
    fields: [
      { key: "url", label: "Webhook URL", placeholder: "https://your-app.com/webhook" },
      { key: "secret", label: "Signing Secret", type: "password" },
    ],
  },
];

type Row = { provider: Provider; config: Record<string, string>; enabled: boolean };

export default function DashboardIntegrations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Record<Provider, Row>>({} as any);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Provider | null>(null);
  const [githubLogin, setGithubLogin] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const [{ data: list }, { data: gh }] = await Promise.all([
        (supabase as any).from("user_integrations_config").select("*").eq("user_id", user.id),
        supabase.from("user_integrations").select("account_login").eq("user_id", user.id).eq("provider", "github").maybeSingle(),
      ]);
      const map = {} as Record<Provider, Row>;
      INTEGRATIONS.forEach(i => {
        const existing = (list || []).find((r: any) => r.provider === i.id);
        map[i.id] = existing
          ? { provider: i.id, config: existing.config || {}, enabled: existing.enabled }
          : { provider: i.id, config: {}, enabled: false };
      });
      setRows(map);
      setGithubLogin((gh as any)?.account_login ?? null);
      setLoading(false);
    })();
  }, [user]);

  const setField = (p: Provider, k: string, v: string) =>
    setRows(r => ({ ...r, [p]: { ...r[p], config: { ...r[p].config, [k]: v } } }));
  const setEnabled = (p: Provider, v: boolean) =>
    setRows(r => ({ ...r, [p]: { ...r[p], enabled: v } }));

  const save = async (p: Provider) => {
    if (!user) return;
    setSaving(p);
    const r = rows[p];
    const { error } = await (supabase as any)
      .from("user_integrations_config")
      .upsert({ user_id: user.id, provider: p, config: r.config, enabled: r.enabled }, { onConflict: "user_id,provider" });
    setSaving(null);
    if (error) toast({ variant: "destructive", title: "Save failed", description: error.message });
    else toast({ title: `${p} saved` });
  };

  if (loading) return <div className="h-40 bg-muted animate-pulse rounded-lg" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-sm text-muted-foreground">Connect your favourite tools to extend your site.</p>
      </div>

      {/* GitHub (managed via OAuth in Deploy page) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5" />
            <div>
              <CardTitle className="text-base">GitHub</CardTitle>
              <CardDescription>Used by Deployments. Manage in Deploy page.</CardDescription>
            </div>
          </div>
          {githubLogin ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 mr-1" /> @{githubLogin}
            </Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={() => (window.location.href = "/dashboard/deploy")}>
              Connect
            </Button>
          )}
        </CardHeader>
      </Card>

      {INTEGRATIONS.map(integ => {
        const r = rows[integ.id];
        const Icon = integ.icon;
        return (
          <Card key={integ.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {integ.name}
                    {r.enabled && <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">Enabled</Badge>}
                  </CardTitle>
                  <CardDescription>{integ.desc}</CardDescription>
                </div>
              </div>
              <Switch checked={r.enabled} onCheckedChange={v => setEnabled(integ.id, v)} />
            </CardHeader>
            <CardContent className="space-y-3">
              {integ.fields.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  <Input
                    type={f.type || "text"}
                    value={r.config[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={e => setField(integ.id, f.key, e.target.value)}
                  />
                </div>
              ))}
              <Button size="sm" onClick={() => save(integ.id)} disabled={saving === integ.id}>
                {saving === integ.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save {integ.name}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
