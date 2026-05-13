import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Image as ImageIcon, Search, BarChart3, Code2, Key, Mail } from "lucide-react";

type Settings = Record<string, Record<string, any>>;

const KEYS = ["branding", "seo", "analytics", "code_injection", "otp", "smtp"] as const;

export default function AdminSiteSettings() {
  const [data, setData] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: rows, error } = await (supabase as any)
        .from("site_settings")
        .select("key,value")
        .in("key", KEYS as unknown as string[]);
      if (error) {
        toast({ variant: "destructive", title: "Failed to load settings", description: error.message });
      }
      const map: Settings = {};
      (rows || []).forEach((r: any) => { map[r.key] = r.value || {}; });
      KEYS.forEach((k) => { if (!map[k]) map[k] = {}; });
      setData(map);
      setLoading(false);
    })();
  }, [toast]);

  const set = (key: string, field: string, value: any) =>
    setData((d) => ({ ...d, [key]: { ...d[key], [field]: value } }));

  const save = async (key: string) => {
    setSavingKey(key);
    const { error } = await (supabase as any)
      .from("site_settings")
      .update({ value: data[key] })
      .eq("key", key);
    setSavingKey(null);
    if (error) toast({ variant: "destructive", title: "Save failed", description: error.message });
    else toast({ title: "Saved", description: `${key} settings updated` });
  };

  if (loading) return <div className="h-40 bg-muted animate-pulse rounded-lg" />;

  const SaveBtn = ({ k }: { k: string }) => (
    <Button onClick={() => save(k)} disabled={savingKey === k} size="sm">
      {savingKey === k ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
      Save
    </Button>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Global branding, SEO, analytics, code injection, OTP and email settings.</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="branding"><ImageIcon className="w-4 h-4 mr-1.5" />Branding</TabsTrigger>
          <TabsTrigger value="seo"><Search className="w-4 h-4 mr-1.5" />SEO</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-1.5" />Analytics</TabsTrigger>
          <TabsTrigger value="code_injection"><Code2 className="w-4 h-4 mr-1.5" />Custom Code</TabsTrigger>
          <TabsTrigger value="otp"><Key className="w-4 h-4 mr-1.5" />OTP</TabsTrigger>
          <TabsTrigger value="smtp"><Mail className="w-4 h-4 mr-1.5" />Email/SMTP</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Main logo, favicon, footer logo URLs (use uploaded image URLs).</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Main Logo URL" v={data.branding.main_logo_url} onChange={(v) => set("branding", "main_logo_url", v)} />
              <Field label="Favicon URL" v={data.branding.favicon_url} onChange={(v) => set("branding", "favicon_url", v)} />
              <Field label="Footer Logo URL" v={data.branding.footer_logo_url} onChange={(v) => set("branding", "footer_logo_url", v)} />
              <SaveBtn k="branding" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>Default SEO</CardTitle><CardDescription>Defaults for pages without custom meta.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Default Title" v={data.seo.default_title} onChange={(v) => set("seo", "default_title", v)} />
              <AreaField label="Default Description" v={data.seo.default_description} onChange={(v) => set("seo", "default_description", v)} />
              <Field label="Default OG Image URL" v={data.seo.default_og_image} onChange={(v) => set("seo", "default_og_image", v)} />
              <SaveBtn k="seo" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>Analytics</CardTitle><CardDescription>Tracking IDs and head scripts.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Google Analytics ID" v={data.analytics.google_analytics_id} onChange={(v) => set("analytics", "google_analytics_id", v)} placeholder="G-XXXXXXX" />
              <Field label="Facebook Pixel ID" v={data.analytics.facebook_pixel_id} onChange={(v) => set("analytics", "facebook_pixel_id", v)} />
              <AreaField label="Custom <head> HTML" v={data.analytics.custom_head} onChange={(v) => set("analytics", "custom_head", v)} mono />
              <SaveBtn k="analytics" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code_injection">
          <Card>
            <CardHeader><CardTitle>Header / Footer Code</CardTitle><CardDescription>Injected on all public portfolio pages.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <AreaField label="Header HTML" v={data.code_injection.header_html} onChange={(v) => set("code_injection", "header_html", v)} mono />
              <AreaField label="Footer HTML" v={data.code_injection.footer_html} onChange={(v) => set("code_injection", "footer_html", v)} mono />
              <SaveBtn k="code_injection" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="otp">
          <Card>
            <CardHeader><CardTitle>OTP Settings</CardTitle><CardDescription>Verification code length, expiry and rate limit.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Code Length" type="number" v={data.otp.length} onChange={(v) => set("otp", "length", Number(v))} />
              <Field label="Expiry (minutes)" type="number" v={data.otp.expiry_minutes} onChange={(v) => set("otp", "expiry_minutes", Number(v))} />
              <Field label="Rate Limit / hour" type="number" v={data.otp.rate_limit_per_hour} onChange={(v) => set("otp", "rate_limit_per_hour", Number(v))} />
              <SaveBtn k="otp" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp">
          <Card>
            <CardHeader><CardTitle>Email / SMTP</CardTitle><CardDescription>Sender identity used by transactional emails.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Field label="From Email" v={data.smtp.from_email} onChange={(v) => set("smtp", "from_email", v)} />
              <Field label="From Name" v={data.smtp.from_name} onChange={(v) => set("smtp", "from_name", v)} />
              <Field label="Reply-To" v={data.smtp.reply_to} onChange={(v) => set("smtp", "reply_to", v)} />
              <SaveBtn k="smtp" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, v, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={v ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function AreaField({ label, v, onChange, mono }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea value={v ?? ""} onChange={(e) => onChange(e.target.value)} rows={5} className={mono ? "font-mono text-sm" : ""} />
    </div>
  );
}
