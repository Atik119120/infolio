import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/imageCompression";
import { usePlan } from "@/hooks/usePlan";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Upload, X, Images, Camera } from "lucide-react";
import type { Portfolio } from "@/pages/PortfolioEdit";

interface Album {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover: string;
  photos: string[];
}

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  cover_image: string | null;
  slug: string;
  display_order: number;
}

interface Props {
  portfolio: Portfolio | null;
  projects: any[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const BUCKET = "projects";
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "photo";

export function PhotoGalleryForm({ portfolio, projects, userId, onUpdate, onSuccess, onError }: Props) {
  const { perFileLimitBytes, isPro } = usePlan();

  // -------- ALBUMS --------
  const [albums, setAlbums] = useState<Album[]>(() => {
    const a = (portfolio as any)?.albums;
    return Array.isArray(a) ? a : [];
  });
  const [savingCoverId, setSavingCoverId] = useState<string | null>(null);
  const [uploadingAlbum, setUploadingAlbum] = useState<string | null>(null);
  const initial = useRef(JSON.stringify(albums));

  useEffect(() => {
    const json = JSON.stringify(albums);
    if (json === initial.current) return;
    const t = setTimeout(async () => {
      const { error } = await supabase.from("portfolios").update({ albums } as any).eq("user_id", userId);
      if (error) onError("Failed to save albums");
      else { initial.current = json; onUpdate(); }
    }, 600);
    return () => clearTimeout(t);
  }, [albums]);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (file.size > perFileLimitBytes) {
      onError(`Image must be < ${Math.round(perFileLimitBytes / 1024 / 1024)}MB${isPro ? "" : " (upgrade to Pro)"}`);
      return null;
    }
    const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82, maxSizeKB: 400 });
    const path = `${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, compressed);
    if (error) { onError("Upload failed"); return null; }
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const addAlbum = () => {
    setAlbums([...albums, { id: crypto.randomUUID(), title: "New Album", subtitle: "", description: "", cover: "", photos: [] }]);
  };
  const updateAlbum = (id: string, patch: Partial<Album>) => {
    setAlbums((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };
  const removeAlbum = (id: string) => {
    if (!confirm("Delete this album?")) return;
    setAlbums(albums.filter((a) => a.id !== id));
  };
  const handleCover = async (id: string, file: File) => {
    setSavingCoverId(id);
    const url = await uploadFile(file, "albums");
    setSavingCoverId(null);
    if (url) updateAlbum(id, { cover: url });
  };
  const handleAddPhotos = async (id: string, files: FileList) => {
    setUploadingAlbum(id);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const u = await uploadFile(f, "albums");
      if (u) urls.push(u);
    }
    setUploadingAlbum(null);
    if (urls.length) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, photos: [...a.photos, ...urls], cover: a.cover || urls[0] }
            : a
        )
      );
    }
  };
  const removePhoto = (id: string, photo: string) => {
    setAlbums((prev) => prev.map((a) => (a.id === id ? { ...a, photos: a.photos.filter((p) => p !== photo) } : a)));
  };

  // -------- PHOTOS (Bento - stored in projects table) --------
  const photos: Photo[] = (projects || []).map((p: any) => ({
    id: p.id,
    title: p.title || "",
    description: p.description || "",
    image_url: p.image_url || p.cover_image || null,
    cover_image: p.cover_image || p.image_url || null,
    slug: p.slug || "",
    display_order: p.display_order ?? 0,
  }));
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleAddPhoto = async () => {
    setAdding(true);
    const title = "Untitled Photo";
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const { error } = await supabase.from("projects").insert({
      user_id: userId,
      title,
      description: "",
      slug,
      display_order: photos.length,
      project_type: "photographer",
    } as any);
    setAdding(false);
    if (error) onError("Failed to add photo");
    else { onSuccess("Photo added"); onUpdate(); }
  };

  const patchPhoto = async (id: string, patch: Partial<Photo>) => {
    const { error } = await supabase.from("projects").update(patch as any).eq("id", id);
    if (error) onError("Save failed"); else onUpdate();
  };

  // debounced text editing local state
  const [localPhotos, setLocalPhotos] = useState<Record<string, { title: string; description: string }>>({});
  useEffect(() => {
    const next: Record<string, { title: string; description: string }> = {};
    photos.forEach((p) => { next[p.id] = { title: p.title, description: p.description }; });
    setLocalPhotos((prev) => ({ ...next, ...Object.fromEntries(Object.entries(prev).filter(([k]) => next[k])) }));
  }, [projects.length]);

  const photoTextTimers = useRef<Record<string, any>>({});
  const onPhotoText = (id: string, field: "title" | "description", value: string) => {
    setLocalPhotos((prev) => ({ ...prev, [id]: { ...(prev[id] || { title: "", description: "" }), [field]: value } }));
    clearTimeout(photoTextTimers.current[id + field]);
    photoTextTimers.current[id + field] = setTimeout(() => patchPhoto(id, { [field]: value } as any), 600);
  };

  const handlePhotoImage = async (id: string, file: File) => {
    setBusyPhotoId(id);
    const url = await uploadFile(file, "photos");
    if (url) await patchPhoto(id, { image_url: url, cover_image: url } as any);
    setBusyPhotoId(null);
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) onError("Delete failed"); else { onSuccess("Deleted"); onUpdate(); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work</CardTitle>
        <CardDescription>Manage your bento photos and full album collections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="photos">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
            <TabsTrigger value="albums">Albums ({albums.length})</TabsTrigger>
          </TabsList>

          {/* ============== PHOTOS TAB ============== */}
          <TabsContent value="photos" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Each photo shows in the bento gallery with its title & subtitle on hover.
              </p>
              <Button size="sm" onClick={handleAddPhoto} disabled={adding}>
                {adding ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />} Add Photo
              </Button>
            </div>

            {photos.length === 0 && (
              <div className="border border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No photos yet. Add 6–8 standout shots for the bento gallery.
              </div>
            )}

            {photos.map((p) => {
              const local = localPhotos[p.id] || { title: p.title, description: p.description };
              return (
                <div key={p.id} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <label className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border bg-muted cursor-pointer group">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-[10px] text-muted-foreground gap-1">
                          <Upload className="w-5 h-5" /> Upload
                        </div>
                      )}
                      {busyPhotoId === p.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                        </div>
                      )}
                      <input
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoImage(p.id, f); }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                    </label>
                    <div className="flex-1 min-w-0 text-xs text-muted-foreground">
                      Tap image to upload. Add a title & subtitle below — they appear on hover in the bento gallery.
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deletePhoto(p.id)} className="text-destructive self-start shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input value={local.title} onChange={(e) => onPhotoText(p.id, "title", e.target.value)} placeholder="Golden Hour" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Subtitle</Label>
                      <Input value={local.description} onChange={(e) => onPhotoText(p.id, "description", e.target.value)} placeholder="Cox's Bazar · 2024" />
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* ============== ALBUMS TAB ============== */}
          <TabsContent value="albums" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Albums group multiple photos under one cover with a title, subtitle & description.
              </p>
              <Button size="sm" onClick={addAlbum}><Plus className="w-4 h-4 mr-1" /> Add Album</Button>
            </div>

            {albums.length === 0 && (
              <div className="border border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
                <Images className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No albums yet. Add one to organise a full shoot.
              </div>
            )}

            {albums.map((al) => (
              <div key={al.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex gap-3">
                  {/* Cover */}
                  <label className="relative w-28 h-28 shrink-0 rounded-md overflow-hidden border bg-muted cursor-pointer group">
                    {al.cover ? (
                      <img src={al.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-[10px] text-muted-foreground gap-1">
                        <Upload className="w-5 h-5" /> Cover
                      </div>
                    )}
                    {savingCoverId === al.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      </div>
                    )}
                    <input
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCover(al.id, f); }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                  </label>

                  <div className="flex-1 space-y-2 min-w-0">
                    <div>
                      <Label className="text-xs">Album Title</Label>
                      <Input value={al.title} onChange={(e) => updateAlbum(al.id, { title: e.target.value })} placeholder="Wedding · Sara & Adib" />
                    </div>
                    <div>
                      <Label className="text-xs">Subtitle</Label>
                      <Input value={al.subtitle || ""} onChange={(e) => updateAlbum(al.id, { subtitle: e.target.value })} placeholder="Dhaka · Feb 2024" />
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeAlbum(al.id)} className="text-destructive self-start">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    rows={2}
                    value={al.description || ""}
                    onChange={(e) => updateAlbum(al.id, { description: e.target.value })}
                    placeholder="A short story about this shoot..."
                  />
                </div>

                {/* Photo grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Album Photos ({al.photos.length})</Label>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {al.photos.map((p) => (
                      <div key={p} className="relative aspect-square rounded overflow-hidden group">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePhoto(al.id, p)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded border-2 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground cursor-pointer hover:bg-muted/50">
                      {uploadingAlbum === al.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mb-1" />
                          Add
                        </>
                      )}
                      <input
                        type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => { if (e.target.files?.length) handleAddPhotos(al.id, e.target.files); }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
