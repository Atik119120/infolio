import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, ImagePlus, Upload } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";
import { slugify, type FullProject } from "@/lib/projectTypes";

interface Props {
  projects: FullProject[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const PER_FILE = 4 * 1024 * 1024;

const empty = { title: "", description: "", cover_image: "" };

export function SimpleProjectsForm({ projects, userId, onUpdate, onSuccess, onError }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FullProject | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (p: FullProject) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      description: p.description || "",
      cover_image: p.cover_image || p.image_url || "",
    });
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return onError("Please upload an image file");
    if (f.size > PER_FILE) return onError("Image must be under 4MB");
    setUploading(true);
    try {
      const compressed = await compressImage(f, { maxWidth: 1600, maxHeight: 1200, quality: 0.82, maxSizeKB: 350 });
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error } = await supabase.storage.from("projects").upload(path, compressed);
      if (error) return onError("Upload failed");
      const url = supabase.storage.from("projects").getPublicUrl(path).data.publicUrl;
      setForm((p) => ({ ...p, cover_image: url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return onError("Title required");
    if (!form.cover_image) return onError("Image required");
    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      description: form.description || null,
      cover_image: form.cover_image,
      image_url: form.cover_image,
      slug: slugify(form.title) + "-" + Math.random().toString(36).slice(2, 6),
      project_type: "freelancer",
      is_visible: true,
      featured: false,
    };
    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      setSaving(false);
      if (error) return onError("Update failed");
      onSuccess("Project updated");
    } else {
      const { error } = await supabase.from("projects").insert({ ...payload, user_id: userId, display_order: projects.length });
      setSaving(false);
      if (error) return onError("Add failed");
      onSuccess("Project added");
    }
    setOpen(false);
    onUpdate();
  };

  const handleDelete = async (p: FullProject) => {
    if (!confirm("Delete this project?")) return;
    setDeletingId(p.id);
    await supabase.from("projects").delete().eq("id", p.id);
    const url = p.cover_image || p.image_url;
    if (url) {
      const m = url.match(/\/projects\/(.+?)(\?|$)/);
      if (m) await supabase.storage.from("projects").remove([decodeURIComponent(m[1])]).catch(() => {});
    }
    setDeletingId(null);
    onSuccess("Deleted");
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-muted-foreground text-sm">Upload your work — image, title and a short description.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Cover Image *</Label>
                {form.cover_image ? (
                  <div className="relative group">
                    <img src={form.cover_image} alt="" className="w-full h-48 object-cover rounded-lg border" />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                      <span className="text-white text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Replace
                      </span>
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40 transition">
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <ImagePlus className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                      </>
                    )}
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Project name"
                  maxLength={80}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown on the card"
                  rows={3}
                  maxLength={300}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || uploading} className="gradient-primary">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No projects yet. Click "Add Project" to get started.
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {projects.map((p) => (
            <Card key={p.id} className="overflow-hidden group">
              <div className="aspect-[4/3] bg-muted relative">
                {(p.cover_image || p.image_url) && (
                  <img src={p.cover_image || p.image_url || ""} alt={p.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p)} disabled={deletingId === p.id}>
                    {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <div className="font-medium text-sm truncate">{p.title}</div>
                {p.description && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.description}</div>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
