import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Code2, Eye, ExternalLink } from "lucide-react";

interface AdminTheme {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  html: string;
  css: string;
  js: string;
  preview_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

const TOKEN_HELP = `Available tokens (auto-replaced with the user's data):
{{name}} {{headline}} {{bio}} {{email}} {{phone}} {{location}}
{{website}} {{logo_url}} {{avatar_url}} {{brand_name}}

Tip: paste a complete <html>...</html> document, OR just paste the body markup —
in that case the CSS and JS fields will be wrapped automatically.`;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

interface FormState {
  id?: string;
  slug: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  preview_image_url: string;
  is_active: boolean;
}

const emptyForm: FormState = {
  slug: "", name: "", description: "",
  html: "", css: "", js: "",
  preview_image_url: "", is_active: true,
};

export default function AdminCustomThemes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [themes, setThemes] = useState<AdminTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  const fetchThemes = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("admin_themes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setThemes(data as AdminTheme[]);
    setLoading(false);
  };

  useEffect(() => { fetchThemes(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (t: AdminTheme) => {
    setForm({
      id: t.id, slug: t.slug, name: t.name,
      description: t.description || "",
      html: t.html, css: t.css, js: t.js,
      preview_image_url: t.preview_image_url || "",
      is_active: t.is_active,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.html.trim()) {
      toast({ variant: "destructive", title: "Missing fields", description: "Name and HTML are required." });
      return;
    }
    const slug = (form.slug || slugify(form.name));
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast({ variant: "destructive", title: "Invalid slug", description: "Use only lowercase letters, numbers and dashes." });
      return;
    }

    setSaving(true);
    const payload: any = {
      slug, name: form.name.trim(),
      description: form.description.trim() || null,
      html: form.html, css: form.css, js: form.js,
      preview_image_url: form.preview_image_url.trim() || null,
      is_active: form.is_active,
    };

    let error;
    if (form.id) {
      ({ error } = await (supabase as any).from("admin_themes").update(payload).eq("id", form.id));
    } else {
      payload.created_by = user?.id;
      ({ error } = await (supabase as any).from("admin_themes").insert(payload));
    }
    setSaving(false);

    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    toast({ title: form.id ? "Theme updated" : "Theme created", description: `Users can now select "${form.name}".` });
    setOpen(false);
    fetchThemes();
  };

  const handleDelete = async (t: AdminTheme) => {
    if (!confirm(`Delete theme "${t.name}"? Users currently using it will fall back to the default theme.`)) return;
    const { error } = await (supabase as any).from("admin_themes").delete().eq("id", t.id);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return;
    }
    toast({ title: "Theme deleted" });
    fetchThemes();
  };

  const toggleActive = async (t: AdminTheme) => {
    await (supabase as any).from("admin_themes").update({ is_active: !t.is_active }).eq("id", t.id);
    fetchThemes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Custom Themes</h2>
          <p className="text-slate-400">
            Upload HTML/CSS/JS themes. They appear automatically in every user's theme picker.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Theme
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-orange-400" /> Uploaded Themes
          </CardTitle>
          <CardDescription className="text-slate-400">
            Token reference: <code className="text-orange-300">{`{{name}} {{headline}} {{bio}} {{email}} {{logo_url}} {{avatar_url}}`}</code> + more
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading…</p>
          ) : themes.length === 0 ? (
            <p className="text-slate-400 text-sm">No custom themes yet. Click "Add Theme" to upload one.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((t) => (
                <div key={t.id} className="rounded-lg border border-slate-800 bg-slate-950/40 overflow-hidden">
                  {t.preview_image_url ? (
                    <img src={t.preview_image_url} alt={t.name} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-orange-500/30 to-pink-500/30 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-white/70" />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{t.name}</h3>
                        <p className="text-xs text-slate-500">slug: <span className="text-slate-400">admin:{t.slug}</span></p>
                      </div>
                      <Badge variant={t.is_active ? "default" : "secondary"} className={t.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-700 text-slate-300"}>
                        {t.is_active ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    {t.description && <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch checked={t.is_active} onCheckedChange={() => toggleActive(t)} />
                        <span className="text-xs text-slate-400">Visible</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={() => setPreviewSlug(t.slug)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={() => openEdit(t)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(t)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Theme" : "Add Custom Theme"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })}
                placeholder="e.g. Cyberpunk Hacker"
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL-safe) *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder="cyberpunk-hacker"
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description shown to users"
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Preview image URL (optional)</Label>
              <Input
                value={form.preview_image_url}
                onChange={(e) => setForm({ ...form, preview_image_url: e.target.value })}
                placeholder="https://..."
                className="bg-slate-950 border-slate-700"
              />
            </div>
          </div>

          <Tabs defaultValue="html" className="mt-2">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="html">HTML *</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
              <TabsTrigger value="help">Tokens / Help</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <Textarea
                value={form.html}
                onChange={(e) => setForm({ ...form, html: e.target.value })}
                placeholder="Paste full <html>...</html> document, or just <body> markup."
                className="font-mono text-xs bg-slate-950 border-slate-700 min-h-[280px]"
              />
            </TabsContent>
            <TabsContent value="css">
              <Textarea
                value={form.css}
                onChange={(e) => setForm({ ...form, css: e.target.value })}
                placeholder="Optional CSS (auto-injected if HTML is partial)"
                className="font-mono text-xs bg-slate-950 border-slate-700 min-h-[280px]"
              />
            </TabsContent>
            <TabsContent value="js">
              <Textarea
                value={form.js}
                onChange={(e) => setForm({ ...form, js: e.target.value })}
                placeholder="Optional JS (runs sandboxed inside the theme iframe)"
                className="font-mono text-xs bg-slate-950 border-slate-700 min-h-[280px]"
              />
            </TabsContent>
            <TabsContent value="help">
              <pre className="text-xs whitespace-pre-wrap text-slate-300 bg-slate-950 p-4 rounded border border-slate-800">{TOKEN_HELP}</pre>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label className="text-sm text-slate-300">Visible to users</Label>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-300">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
                {saving ? "Saving…" : form.id ? "Save changes" : "Create theme"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live preview dialog */}
      <Dialog open={!!previewSlug} onOpenChange={(o) => !o && setPreviewSlug(null)}>
        <DialogContent className="max-w-5xl bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Preview: {previewSlug}
              {previewSlug && (
                <a
                  href={`/?_preview=admin:${previewSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-orange-400 inline-flex items-center gap-1"
                >
                  open <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </DialogTitle>
          </DialogHeader>
          {previewSlug && (
            <iframe
              title="theme preview"
              srcDoc={(() => {
                const t = themes.find((x) => x.slug === previewSlug);
                if (!t) return "";
                const css = t.css || "";
                const js = t.js || "";
                const isFull = /<html[\s>]/i.test(t.html);
                if (isFull) {
                  let doc = t.html;
                  if (css) doc = doc.replace(/<\/head>/i, `<style>${css}</style></head>`);
                  if (js) doc = doc.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
                  return doc;
                }
                return `<!doctype html><html><head><meta charset="utf-8"/><style>${css}</style></head><body>${t.html}${js ? `<script>${js}<\/script>` : ""}</body></html>`;
              })()}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-[70vh] bg-white rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
