import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Palette, Image as ImageIcon, Code2, Type } from "lucide-react";

type Site = {
  brand_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  accent_color: string | null;
  browser_title: string | null;
  footer_text: string | null;
  header_html: string | null;
  custom_css: string | null;
  custom_js: string | null;
  custom_head_html: string | null;
};

const EMPTY: Site = {
  brand_name: "", logo_url: "", favicon_url: "", primary_color: "#3B82F6",
  accent_color: "#F59E0B", browser_title: "", footer_text: "", header_html: "",
  custom_css: "", custom_js: "", custom_head_html: "",
};

export default function DashboardSiteSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<Site>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: p } = await supabase
        .from("portfolios")
        .select("brand_name,logo_url,favicon_url,primary_color,accent_color,browser_title,footer_text,header_html,custom_css,custom_js,custom_head_html")
        .eq("user_id", user.id).maybeSingle();
      if (p) setData({ ...EMPTY, ...(p as any) });
      setLoading(false);
    })();
  }, [user]);

  const set = <K extends keyof Site>(k: K, v: Site[K]) => setData(d => ({ ...d, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("portfolios").update(data as any).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ variant: "destructive", title: "Save failed", description: error.message });
    else toast({ title: "Site settings saved" });
  };

  if (loading) return <div className="h-40 bg-muted animate-pulse rounded-lg" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-sm text-muted-foreground">Branding, header/footer, brand colors & custom code for your site.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding"><ImageIcon className="w-4 h-4 mr-1.5" />Branding</TabsTrigger>
          <TabsTrigger value="colors"><Palette className="w-4 h-4 mr-1.5" />Colors</TabsTrigger>
          <TabsTrigger value="layout"><Type className="w-4 h-4 mr-1.5" />Header/Footer</TabsTrigger>
          <TabsTrigger value="code"><Code2 className="w-4 h-4 mr-1.5" />Custom Code</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Logo, favicon, and brand name.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Brand Name" v={data.brand_name} onChange={v => set("brand_name", v)} />
              <Field label="Browser Tab Title" v={data.browser_title} onChange={v => set("browser_title", v)} />
              <Field label="Logo URL" v={data.logo_url} onChange={v => set("logo_url", v)} placeholder="https://..." />
              <Field label="Favicon URL" v={data.favicon_url} onChange={v => set("favicon_url", v)} placeholder="https://..." />
              {data.logo_url && <img src={data.logo_url} alt="logo" className="h-12 mt-2 border rounded p-1" />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader><CardTitle>Brand Colors</CardTitle><CardDescription>Primary & accent applied across themes.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <ColorField label="Primary Color" v={data.primary_color} onChange={v => set("primary_color", v)} />
              <ColorField label="Accent Color" v={data.accent_color} onChange={v => set("accent_color", v)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader><CardTitle>Header & Footer</CardTitle><CardDescription>Custom HTML for site header and footer.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <AreaField label="Header HTML" v={data.header_html} onChange={v => set("header_html", v)} mono />
              <AreaField label="Footer Text / HTML" v={data.footer_text} onChange={v => set("footer_text", v)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader><CardTitle>Custom Code</CardTitle><CardDescription>Injected into your live site. Be careful.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <AreaField label="Custom <head> HTML" v={data.custom_head_html} onChange={v => set("custom_head_html", v)} mono />
              <AreaField label="Custom CSS" v={data.custom_css} onChange={v => set("custom_css", v)} mono />
              <AreaField label="Custom JS" v={data.custom_js} onChange={v => set("custom_js", v)} mono />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, v, onChange, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={v ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
function ColorField({ label, v, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input type="color" value={v || "#000000"} onChange={e => onChange(e.target.value)} className="w-12 h-10 border rounded cursor-pointer" />
        <Input value={v ?? ""} onChange={e => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  );
}
function AreaField({ label, v, onChange, mono }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea value={v ?? ""} onChange={e => onChange(e.target.value)} rows={6} className={mono ? "font-mono text-sm" : ""} />
    </div>
  );
}
