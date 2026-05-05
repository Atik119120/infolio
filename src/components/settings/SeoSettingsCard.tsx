import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";
import { ProGate } from "@/components/billing/ProGate";

export function SeoSettingsCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    google_verification: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase
        .from("portfolios")
        .select("meta_title, meta_description, meta_keywords, google_verification")
        .eq("user_id", user.id)
        .maybeSingle();
      if (p) setData({
        meta_title: p.meta_title ?? "",
        meta_description: p.meta_description ?? "",
        meta_keywords: p.meta_keywords ?? "",
        google_verification: p.google_verification ?? "",
      });
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("portfolios")
      .update(data)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ variant: "destructive", title: "Failed", description: error.message });
    else toast({ title: "SEO settings saved" });
  };

  return (
    <ProGate
      title="SEO & Search"
      description="Edit meta tags, add Google verification, and improve discoverability."
      icon={<Search className="w-5 h-5 text-amber-500" />}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> SEO Settings</CardTitle>
          <CardDescription>Tell search engines about your portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta title</Label>
                <Input id="meta_title" maxLength={60} value={data.meta_title} onChange={(e) => setData({ ...data, meta_title: e.target.value })} placeholder="John Doe — Photographer" />
                <p className="text-xs text-muted-foreground">{data.meta_title.length}/60</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta description</Label>
                <Textarea id="meta_description" maxLength={160} rows={3} value={data.meta_description} onChange={(e) => setData({ ...data, meta_description: e.target.value })} placeholder="Award-winning portrait photographer based in Dhaka." />
                <p className="text-xs text-muted-foreground">{data.meta_description.length}/160</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Keywords (comma separated)</Label>
                <Input id="meta_keywords" value={data.meta_keywords} onChange={(e) => setData({ ...data, meta_keywords: e.target.value })} placeholder="photographer, dhaka, portrait" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_verification">Google Search Console verification code</Label>
                <Input id="google_verification" value={data.google_verification} onChange={(e) => setData({ ...data, google_verification: e.target.value })} placeholder="abc123…" />
                <p className="text-xs text-muted-foreground">From the HTML tag method in Search Console — paste only the content value.</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <strong>Sitemap URL:</strong> <code className="text-xs">/u/your-username/sitemap.xml</code> (auto-generated)
              </div>
              <Button onClick={save} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving</> : "Save SEO settings"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </ProGate>
  );
}
