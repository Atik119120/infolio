import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, Code2 } from "lucide-react";
import { ProGate } from "@/components/billing/ProGate";

interface SeoSettingsFormProps {
  portfolio: {
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    og_image_url?: string | null;
    google_verification?: string | null;
    custom_head_html?: string | null;
    ga_measurement_id?: string | null;
    gtm_id?: string | null;
  } | null;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

export function SeoSettingsForm({ portfolio, userId, onUpdate, onSuccess, onError }: SeoSettingsFormProps) {
  return (
    <ProGate
      title="SEO & Search Console"
      description="Add meta tags, Open Graph image, Google verification, and custom <head> HTML for sitemaps."
      icon={<Search className="w-5 h-5 text-amber-500" />}
    >
      <Inner portfolio={portfolio} userId={userId} onUpdate={onUpdate} onSuccess={onSuccess} onError={onError} />
    </ProGate>
  );
}

function Inner({ portfolio, userId, onUpdate, onSuccess, onError }: SeoSettingsFormProps) {
  const p: any = portfolio || {};
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    meta_title: p.meta_title || "",
    meta_description: p.meta_description || "",
    meta_keywords: p.meta_keywords || "",
    og_image_url: p.og_image_url || "",
    google_verification: p.google_verification || "",
    custom_head_html: p.custom_head_html || "",
    ga_measurement_id: p.ga_measurement_id || "",
    gtm_id: p.gtm_id || "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Allow user to paste full <meta name="google-site-verification" content="XYZ" /> tag — extract content
  const normalizeVerification = (val: string) => {
    const trimmed = val.trim();
    const match = trimmed.match(/content\s*=\s*["']([^"']+)["']/i);
    return match ? match[1] : trimmed;
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      meta_keywords: form.meta_keywords.trim() || null,
      og_image_url: form.og_image_url.trim() || null,
      google_verification: form.google_verification ? normalizeVerification(form.google_verification) : null,
      custom_head_html: form.custom_head_html.trim() || null,
      ga_measurement_id: form.ga_measurement_id.trim() || null,
      gtm_id: form.gtm_id.trim() || null,
    };
    const { error } = await supabase.from("portfolios").update(payload).eq("user_id", userId);
    setSaving(false);
    if (error) {
      onError(error.message);
    } else {
      onSuccess("SEO settings saved");
      onUpdate();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> SEO Meta Tags
          </CardTitle>
          <CardDescription>How your portfolio appears in Google and social shares.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" name="meta_title" value={form.meta_title} onChange={onChange} maxLength={70} placeholder="John Doe — Photographer in Dhaka" />
            <p className="text-xs text-muted-foreground">{form.meta_title.length}/70 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea id="meta_description" name="meta_description" value={form.meta_description} onChange={onChange} maxLength={170} rows={3} placeholder="Award-winning wedding & event photographer based in Dhaka." />
            <p className="text-xs text-muted-foreground">{form.meta_description.length}/170 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Keywords (comma separated)</Label>
            <Input id="meta_keywords" name="meta_keywords" value={form.meta_keywords} onChange={onChange} placeholder="photographer, dhaka, wedding, portrait" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="og_image_url">Social Share Image URL (Open Graph)</Label>
            <Input id="og_image_url" name="og_image_url" value={form.og_image_url} onChange={onChange} placeholder="https://...jpg (1200×630 recommended)" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" /> Google Search Console Verification
          </CardTitle>
          <CardDescription>
            Paste the full <code>&lt;meta&gt;</code> tag from Google Search Console — we'll extract the content automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_verification">Verification Tag or Content</Label>
            <Textarea
              id="google_verification"
              name="google_verification"
              value={form.google_verification}
              onChange={onChange}
              rows={2}
              placeholder='<meta name="google-site-verification" content="abc123..." />'
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Paste the meta tag from Search Console → URL prefix → HTML tag method.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" /> Custom &lt;head&gt; HTML
          </CardTitle>
          <CardDescription>
            Add sitemap link, analytics, or any other tags. Injected into your portfolio's &lt;head&gt;.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            name="custom_head_html"
            value={form.custom_head_html}
            onChange={onChange}
            rows={6}
            placeholder={`<link rel="sitemap" type="application/xml" href="/sitemap.xml" />\n<meta name="robots" content="index, follow" />`}
            className="font-mono text-xs"
          />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠ Only paste code from sources you trust. Invalid HTML can break your page.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" /> Google Analytics & Tag Manager
          </CardTitle>
          <CardDescription>
            Track your portfolio visitors. IDs are auto-injected on your published site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ga_measurement_id">GA4 Measurement ID</Label>
            <Input id="ga_measurement_id" name="ga_measurement_id" value={form.ga_measurement_id} onChange={onChange} placeholder="G-XXXXXXXXXX" />
            <p className="text-xs text-muted-foreground">Find it in Google Analytics → Admin → Data Streams.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gtm_id">Google Tag Manager ID</Label>
            <Input id="gtm_id" name="gtm_id" value={form.gtm_id} onChange={onChange} placeholder="GTM-XXXXXXX" />
            <p className="text-xs text-muted-foreground">Optional — only if you use GTM instead of (or alongside) GA4.</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving</> : "Save SEO settings"}
      </Button>
    </div>
  );
}
