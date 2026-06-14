import { useState, useRef } from "react";
import { usePlan } from "@/hooks/usePlan";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, X, Loader2, Upload, Star, Image as ImageIcon, Eye, EyeOff, Trash2, GripVertical, ArrowUp, ArrowDown, Type, Heading2, Image as ImgIcon } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";
import { PROJECT_TYPES, slugify, type ProjectType, type GalleryImage, type SectionBlock, type ExternalLinks, type FullProject, layoutOf, getCategoryLabel } from "@/lib/projectTypes";

interface Props {
  projects: FullProject[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const empty = (): Omit<FullProject, "id" | "user_id" | "display_order" | "created_at"> => ({
  title: "",
  description: "",
  tech_stack: [],
  live_url: "",
  github_url: "",
  image_url: "",
  cover_image: "",
  featured: false,
  project_type: "freelancer",
  custom_category: "",
  gallery: [],
  sections: [],
  tools: [],
  tags: [],
  client_name: "",
  project_date: "",
  external_links: {},
  is_visible: true,
  slug: "",
});

export function ProjectsForm({ projects, userId, onUpdate, onSuccess, onError }: Props) {
  const { perFileLimitBytes } = usePlan();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FullProject | null>(null);
  const [form, setForm] = useState(empty());
  const [tab, setTab] = useState("basic");
  const [techInput, setTechInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setEditing(null);
    setForm(empty());
    setTab("basic");
    setDialogOpen(true);
  };

  const openEdit = (p: FullProject) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      description: p.description || "",
      tech_stack: p.tech_stack || [],
      live_url: p.live_url || "",
      github_url: p.github_url || "",
      image_url: p.image_url || "",
      cover_image: p.cover_image || p.image_url || "",
      featured: p.featured || false,
      project_type: p.project_type || "freelancer",
      custom_category: p.custom_category || "",
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      sections: Array.isArray(p.sections) ? p.sections : [],
      tools: p.tools || [],
      tags: p.tags || [],
      client_name: p.client_name || "",
      project_date: p.project_date || "",
      external_links: p.external_links || {},
      is_visible: p.is_visible ?? true,
      slug: p.slug || "",
    });
    setTab("basic");
    setDialogOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return null;
    }
    if (file.size > perFileLimitBytes) {
      onError(`Image must be under ${Math.round(perFileLimitBytes / 1024 / 1024)}MB`);
      return null;
    }
    const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.82, maxSizeKB: 350 });
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error } = await supabase.storage.from("projects").upload(path, compressed);
    if (error) {
      onError("Upload failed");
      return null;
    }
    return supabase.storage.from("projects").getPublicUrl(path).data.publicUrl;
  };

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy("cover");
    const url = await uploadImage(f);
    if (url) setForm({ ...form, cover_image: url, image_url: url });
    setBusy(null);
  };

  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy("gallery");
    const next: GalleryImage[] = [...form.gallery];
    for (const f of files) {
      const url = await uploadImage(f);
      if (url) next.push({ url });
    }
    setForm({ ...form, gallery: next });
    setBusy(null);
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const removeGallery = (i: number) => setForm({ ...form, gallery: form.gallery.filter((_, idx) => idx !== i) });
  const moveGallery = (i: number, dir: -1 | 1) => {
    const arr = [...form.gallery];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setForm({ ...form, gallery: arr });
  };

  const addSection = (type: SectionBlock["type"]) => {
    const block: SectionBlock =
      type === "image"
        ? { type: "image", image_url: "", caption: "" }
        : { type, content: "" };
    setForm({ ...form, sections: [...form.sections, block] });
  };
  const updateSection = (i: number, patch: Partial<SectionBlock>) => {
    const arr = [...form.sections];
    arr[i] = { ...arr[i], ...patch } as SectionBlock;
    setForm({ ...form, sections: arr });
  };
  const removeSection = (i: number) => setForm({ ...form, sections: form.sections.filter((_, idx) => idx !== i) });
  const moveSection = (i: number, dir: -1 | 1) => {
    const arr = [...form.sections];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setForm({ ...form, sections: arr });
  };
  const uploadSectionImage = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(`sec-${i}`);
    const url = await uploadImage(f);
    if (url) updateSection(i, { image_url: url } as any);
    setBusy(null);
  };

  const addChip = (key: "tech_stack" | "tools" | "tags", value: string, setInput: (s: string) => void) => {
    const v = value.trim();
    if (!v) return;
    const cur = (form[key] || []) as string[];
    if (cur.includes(v)) return;
    setForm({ ...form, [key]: [...cur, v] } as any);
    setInput("");
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      onError("Title required");
      return;
    }
    setSaving(true);
    const baseSlug = form.slug?.trim() || slugify(form.title);
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      tech_stack: form.tech_stack,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      image_url: form.cover_image || form.image_url || null,
      cover_image: form.cover_image || null,
      featured: form.featured,
      project_type: form.project_type,
      custom_category: form.project_type === "custom" ? form.custom_category : null,
      gallery: form.gallery as any,
      sections: form.sections as any,
      tools: form.tools,
      tags: form.tags,
      client_name: form.client_name || null,
      project_date: form.project_date || null,
      external_links: form.external_links as any,
      is_visible: form.is_visible,
      slug: baseSlug,
    };
    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      setSaving(false);
      if (error) onError(error.message.includes("duplicate") ? "Slug already used — change title or slug" : "Update failed");
      else {
        onSuccess("Project updated");
        setDialogOpen(false);
        onUpdate();
      }
    } else {
      const { error } = await supabase.from("projects").insert({ ...payload, user_id: userId, display_order: projects.length });
      setSaving(false);
      if (error) onError(error.message.includes("duplicate") ? "Slug already used — change title" : "Add failed");
      else {
        onSuccess("Project added");
        setDialogOpen(false);
        onUpdate();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setDeletingId(id);
    const p = projects.find((x) => x.id === id);
    await supabase.from("projects").delete().eq("id", id);
    // cleanup storage
    const urls = [p?.cover_image, p?.image_url, ...((p?.gallery || []).map((g) => g.url))].filter(Boolean) as string[];
    for (const u of urls) {
      const m = u.match(/\/projects\/(.+?)(\?|$)/);
      if (m) await supabase.storage.from("projects").remove([decodeURIComponent(m[1])]).catch(() => {});
    }
    setDeletingId(null);
    onSuccess("Deleted");
    onUpdate();
  };

  const toggleFeatured = async (p: FullProject) => {
    await supabase.from("projects").update({ featured: !p.featured }).eq("id", p.id);
    onUpdate();
  };
  const toggleVisible = async (p: FullProject) => {
    await supabase.from("projects").update({ is_visible: !p.is_visible }).eq("id", p.id);
    onUpdate();
  };
  const reorder = async (p: FullProject, dir: -1 | 1) => {
    const sorted = [...projects].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const i = sorted.findIndex((x) => x.id === p.id);
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const a = sorted[i], b = sorted[j];
    await Promise.all([
      supabase.from("projects").update({ display_order: b.display_order ?? 0 }).eq("id", a.id),
      supabase.from("projects").update({ display_order: a.display_order ?? 0 }).eq("id", b.id),
    ]);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-muted-foreground text-sm">Add work as Photographer, Designer, Marketer & more — layout adapts automatically</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>

            <Tabs value={tab} onValueChange={setTab} className="mt-2">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="meta">Meta & Links</TabsTrigger>
              </TabsList>

              {/* BASIC */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Type *</Label>
                    <Select value={form.project_type} onValueChange={(v) => setForm({ ...form, project_type: v as ProjectType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PROJECT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {form.project_type === "custom" && (
                    <div className="space-y-2">
                      <Label>Custom Category</Label>
                      <Input value={form.custom_category || ""} onChange={(e) => setForm({ ...form, custom_category: e.target.value })} placeholder="e.g. Illustration" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} placeholder="Project name" />
                </div>

                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="auto-from-title" />
                  <p className="text-xs text-muted-foreground">Detail page: /u/username/project/{form.slug || "slug"}</p>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Quick summary shown on the card" />
                </div>

                <div className="space-y-2">
                  <Label>Cover Image *</Label>
                  <div onClick={() => coverRef.current?.click()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    {form.cover_image ? (
                      <img src={form.cover_image} alt="cover" className="max-h-56 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        {busy === "cover" ? <Loader2 className="w-8 h-8 animate-spin" /> : <><ImageIcon className="w-8 h-8 mb-2" /><span>Click to upload cover</span></>}
                      </div>
                    )}
                  </div>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={!!form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                    <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4" /> Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
                    <span className="text-sm">Visible publicly</span>
                  </label>
                </div>
              </TabsContent>

              {/* GALLERY */}
              <TabsContent value="gallery" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gallery Images</Label>
                    <p className="text-xs text-muted-foreground">Upload multiple. Used in photographer grid, case studies, lightbox.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => galleryRef.current?.click()} disabled={busy === "gallery"}>
                    {busy === "gallery" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />} Add Images
                  </Button>
                  <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
                </div>
                {form.gallery.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">No images yet</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {form.gallery.map((g, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border">
                        <img src={g.url} alt="" className="w-full aspect-square object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                          <div className="flex gap-1">
                            <button type="button" onClick={() => moveGallery(i, -1)} className="p-1 hover:bg-white/20 rounded"><ArrowUp className="w-3 h-3" /></button>
                            <button type="button" onClick={() => moveGallery(i, 1)} className="p-1 hover:bg-white/20 rounded"><ArrowDown className="w-3 h-3" /></button>
                          </div>
                          <button type="button" onClick={() => removeGallery(i)} className="p-1 hover:bg-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                        </div>
                        <Input value={g.caption || ""} onChange={(e) => {
                          const arr = [...form.gallery];
                          arr[i] = { ...arr[i], caption: e.target.value };
                          setForm({ ...form, gallery: arr });
                        }} placeholder="Caption (optional)" className="h-7 text-xs rounded-none border-0 border-t" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* SECTIONS */}
              <TabsContent value="sections" className="space-y-3 mt-4">
                <p className="text-xs text-muted-foreground">Case-study blocks shown on the project detail page (great for Graphic / UI-UX / Web projects)</p>
                <div className="flex gap-2 flex-wrap">
                  <Button type="button" size="sm" variant="outline" onClick={() => addSection("heading")}><Heading2 className="w-4 h-4 mr-1" /> Heading</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => addSection("text")}><Type className="w-4 h-4 mr-1" /> Text</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => addSection("image")}><ImgIcon className="w-4 h-4 mr-1" /> Image</Button>
                </div>
                {form.sections.length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">No sections — add blocks above</div>
                ) : form.sections.map((sec, i) => (
                  <Card key={i}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">{sec.type}</Badge>
                        <div className="flex gap-1">
                          <Button type="button" size="icon" variant="ghost" onClick={() => moveSection(i, -1)}><ArrowUp className="w-4 h-4" /></Button>
                          <Button type="button" size="icon" variant="ghost" onClick={() => moveSection(i, 1)}><ArrowDown className="w-4 h-4" /></Button>
                          <Button type="button" size="icon" variant="ghost" onClick={() => removeSection(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </div>
                      {sec.type === "heading" && (
                        <Input value={sec.content} onChange={(e) => updateSection(i, { content: e.target.value })} placeholder="Section heading" />
                      )}
                      {sec.type === "text" && (
                        <Textarea rows={4} value={sec.content} onChange={(e) => updateSection(i, { content: e.target.value })} placeholder="Paragraph content..." />
                      )}
                      {sec.type === "image" && (
                        <div className="space-y-2">
                          {sec.image_url ? (
                            <img src={sec.image_url} className="max-h-48 rounded" />
                          ) : (
                            <div className="text-xs text-muted-foreground">No image</div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => uploadSectionImage(i, e)} disabled={busy === `sec-${i}`} />
                          <Input value={(sec as any).caption || ""} onChange={(e) => updateSection(i, { caption: e.target.value } as any)} placeholder="Caption (optional)" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* META */}
              <TabsContent value="meta" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    <Input value={form.client_name || ""} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Date</Label>
                    <Input type="date" value={form.project_date || ""} onChange={(e) => setForm({ ...form, project_date: e.target.value })} />
                  </div>
                </div>

                <ChipField label="Tools / Software" value={toolInput} setValue={setToolInput} items={form.tools || []} onAdd={() => addChip("tools", toolInput, setToolInput)} onRemove={(t) => setForm({ ...form, tools: (form.tools || []).filter((x) => x !== t) })} placeholder="Photoshop, Figma..." />
                <ChipField label="Tech Stack" value={techInput} setValue={setTechInput} items={form.tech_stack || []} onAdd={() => addChip("tech_stack", techInput, setTechInput)} onRemove={(t) => setForm({ ...form, tech_stack: (form.tech_stack || []).filter((x) => x !== t) })} placeholder="React, Node..." />
                <ChipField label="Tags" value={tagInput} setValue={setTagInput} items={form.tags || []} onAdd={() => addChip("tags", tagInput, setTagInput)} onRemove={(t) => setForm({ ...form, tags: (form.tags || []).filter((x) => x !== t) })} placeholder="branding, modern..." />

                <div className="space-y-3 pt-2 border-t">
                  <Label>External Links</Label>
                  {(["live", "website", "behance", "dribbble", "facebook"] as const).map((k) => (
                    <div key={k} className="grid grid-cols-[100px_1fr] gap-2 items-center">
                      <span className="text-sm capitalize text-muted-foreground">{k}</span>
                      <Input
                        placeholder={`https://${k === "live" ? "yourproject.com" : k + ".com/..."}`}
                        value={(form.external_links as any)[k] || ""}
                        onChange={(e) => setForm({ ...form, external_links: { ...form.external_links, [k]: e.target.value } as ExternalLinks })}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                    <span className="text-sm text-muted-foreground">GitHub</span>
                    <Input placeholder="https://github.com/..." value={form.github_url || ""} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-5 mt-4 border-t">
              <Button onClick={handleSave} disabled={saving} className="gradient-primary flex-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Project"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LIST */}
      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add work — layout adapts to project type</p>
            <Button onClick={openNew} className="gradient-primary"><Plus className="w-4 h-4 mr-2" /> Add Your First Project</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[...projects].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).map((p) => {
            const cover = p.cover_image || p.image_url;
            return (
              <Card key={p.id} className={`overflow-hidden ${!p.is_visible ? "opacity-60" : ""}`}>
                <div className="flex">
                  <div className="w-32 shrink-0 bg-muted">
                    {cover ? <img src={cover} alt={p.title} className="w-full h-full object-cover aspect-square" /> : <div className="w-full aspect-square flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>}
                  </div>
                  <CardContent className="p-3 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-semibold truncate">{p.title}</h3>
                          {p.featured && <Star className="w-3.5 h-3.5 fill-warning text-warning" />}
                        </div>
                        <Badge variant="secondary" className="text-[10px] mt-1">{getCategoryLabel(p)}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => reorder(p, -1)}><ArrowUp className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => reorder(p, 1)}><ArrowDown className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleFeatured(p)} title="Featured"><Star className={`w-3.5 h-3.5 ${p.featured ? "fill-warning text-warning" : ""}`} /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleVisible(p)} title="Visibility">{p.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}>
                        {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChipField({ label, value, setValue, items, onAdd, onRemove, placeholder }: { label: string; value: string; setValue: (s: string) => void; items: string[]; onAdd: () => void; onRemove: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }} />
        <Button type="button" variant="outline" onClick={onAdd}>Add</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">{t}<X className="w-3 h-3 cursor-pointer" onClick={() => onRemove(t)} /></Badge>
          ))}
        </div>
      )}
    </div>
  );
}
