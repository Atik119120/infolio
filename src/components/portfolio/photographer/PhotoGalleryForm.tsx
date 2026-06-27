import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/imageCompression";
import { usePlan } from "@/hooks/usePlan";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Upload, X, Images } from "lucide-react";
import { ProjectsForm } from "@/components/portfolio/ProjectsForm";
import type { Portfolio } from "@/pages/PortfolioEdit";

interface Album {
  id: string;
  title: string;
  cover: string;
  photos: string[];
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

export function PhotoGalleryForm({ portfolio, projects, userId, onUpdate, onSuccess, onError }: Props) {
  const { perFileLimitBytes, isPro } = usePlan();
  const [albums, setAlbums] = useState<Album[]>(() => {
    const a = (portfolio as any)?.albums;
    return Array.isArray(a) ? a : [];
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingAlbum, setUploadingAlbum] = useState<string | null>(null);
  const initial = useRef(JSON.stringify(albums));

  // Autosave albums
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

  const uploadFile = async (file: File): Promise<string | null> => {
    if (file.size > perFileLimitBytes) {
      onError(`Image must be < ${Math.round(perFileLimitBytes/1024/1024)}MB${isPro?"":" (upgrade to Pro)"}`);
      return null;
    }
    const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82, maxSizeKB: 400 });
    const path = `${userId}/albums/${Date.now()}-${Math.random().toString(36).slice(2,8)}.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, compressed);
    if (error) { onError("Upload failed"); return null; }
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const addAlbum = () => {
    setAlbums([...albums, { id: crypto.randomUUID(), title: "New Album", cover: "", photos: [] }]);
  };

  const updateAlbum = (id: string, patch: Partial<Album>) => {
    setAlbums(albums.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const removeAlbum = (id: string) => {
    if (!confirm("Delete this album?")) return;
    setAlbums(albums.filter(a => a.id !== id));
  };

  const handleCover = async (id: string, file: File) => {
    setSavingId(id);
    const url = await uploadFile(file);
    setSavingId(null);
    if (url) updateAlbum(id, { cover: url });
  };

  const handleAddPhotos = async (id: string, files: FileList) => {
    setUploadingAlbum(id);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const u = await uploadFile(f);
      if (u) urls.push(u);
    }
    setUploadingAlbum(null);
    if (urls.length) {
      const target = albums.find(a => a.id === id);
      const photos = [...(target?.photos || []), ...urls];
      updateAlbum(id, { photos, cover: target?.cover || urls[0] });
    }
  };

  const removePhoto = (id: string, photo: string) => {
    const target = albums.find(a => a.id === id);
    if (!target) return;
    updateAlbum(id, { photos: target.photos.filter(p => p !== photo) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
        <CardDescription>Manage your bento gallery photos and full album collections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="photos">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="photos">Photos (Bento)</TabsTrigger>
            <TabsTrigger value="albums">Albums ({albums.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              These appear in the interactive bento gallery. Add 6–8 standout photos.
            </p>
            <ProjectsForm projects={projects} userId={userId} onUpdate={onUpdate} onSuccess={onSuccess} onError={onError} />
          </TabsContent>

          <TabsContent value="albums" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Albums group 15–16 photos under one cover. Visitors click the cover to view all.
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
                  <label className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border bg-muted cursor-pointer group">
                    {al.cover ? (
                      <img src={al.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground"><Upload className="w-5 h-5" /></div>
                    )}
                    {savingId === al.id && (
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

                  <div className="flex-1 space-y-2">
                    <div>
                      <Label className="text-xs">Album Title</Label>
                      <Input value={al.title} onChange={(e) => updateAlbum(al.id, { title: e.target.value })} placeholder="Wedding · Sara & Adib" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{al.photos.length} photo{al.photos.length === 1 ? "" : "s"}</p>
                      <Button size="sm" variant="ghost" onClick={() => removeAlbum(al.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Photo grid */}
                <div>
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
