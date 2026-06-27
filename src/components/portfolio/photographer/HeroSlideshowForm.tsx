import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlan } from "@/hooks/usePlan";
import { compressImage } from "@/lib/imageCompression";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Trash2, Images, Sparkles, GripVertical } from "lucide-react";

interface Props {
  portfolio: any;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

const MAX_SLIDES = 10;

export function HeroSlideshowForm({ portfolio, userId, onUpdate, onSuccess, onError }: Props) {
  const { perFileLimitBytes } = usePlan();
  const [images, setImages] = useState<string[]>(
    Array.isArray(portfolio?.hero_images) ? portfolio.hero_images.filter((x: any) => typeof x === "string") : []
  );
  const [headline, setHeadline] = useState<string>(portfolio?.hero_headline || "");
  const [subheadline, setSubheadline] = useState<string>(portfolio?.hero_subheadline || "");
  const [ctaText, setCtaText] = useState<string>(portfolio?.hero_cta_text || "");
  const [ctaLink, setCtaLink] = useState<string>(portfolio?.hero_cta_link || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync local state if parent reloads
  useEffect(() => {
    setImages(Array.isArray(portfolio?.hero_images) ? portfolio.hero_images.filter((x: any) => typeof x === "string") : []);
    setHeadline(portfolio?.hero_headline || "");
    setSubheadline(portfolio?.hero_subheadline || "");
    setCtaText(portfolio?.hero_cta_text || "");
    setCtaLink(portfolio?.hero_cta_link || "");
  }, [portfolio?.id]);

  const persistImages = async (next: string[]) => {
    setImages(next);
    const { error } = await supabase
      .from("portfolios")
      .update({ hero_images: next as any } as any)
      .eq("user_id", userId);
    if (error) onError("Failed to save slideshow");
    else onUpdate();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const remaining = MAX_SLIDES - images.length;
    if (remaining <= 0) {
      onError(`Maximum ${MAX_SLIDES} slideshow images allowed`);
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      onError(`Only ${remaining} more allowed (max ${MAX_SLIDES} total)`);
    }
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of toProcess) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > perFileLimitBytes) {
          onError(`${file.name} too large (max ${Math.round(perFileLimitBytes / 1024 / 1024)}MB)`);
          continue;
        }
        const compressed = await compressImage(file, { maxWidth: 1920, maxHeight: 1920, quality: 0.82, maxSizeKB: 500 });
        const fileName = `${userId}/hero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(fileName, compressed, { upsert: true });
        if (upErr) throw upErr;
        const { data: u } = supabase.storage.from("avatars").getPublicUrl(fileName);
        uploaded.push(u.publicUrl);
      }
      if (uploaded.length) {
        await persistImages([...images, ...uploaded]);
        onSuccess(`${uploaded.length} image(s) added to slideshow`);
      }
    } catch (e) {
      console.error(e);
      onError("Failed to upload image(s)");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = async (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    await persistImages(next);
    onSuccess("Image removed");
  };

  const moveImage = async (idx: number, dir: -1 | 1) => {
    const next = [...images];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    await persistImages(next);
  };

  // Auto-save text fields
  const initialText = useRef({ headline, subheadline, ctaText, ctaLink });
  useEffect(() => {
    const changed =
      headline !== initialText.current.headline ||
      subheadline !== initialText.current.subheadline ||
      ctaText !== initialText.current.ctaText ||
      ctaLink !== initialText.current.ctaLink;
    if (!changed) return;
    const t = setTimeout(async () => {
      const { error } = await supabase
        .from("portfolios")
        .update({
          hero_headline: headline || null,
          hero_subheadline: subheadline || null,
          hero_cta_text: ctaText || null,
          hero_cta_link: ctaLink || null,
        } as any)
        .eq("user_id", userId);
      if (!error) {
        initialText.current = { headline, subheadline, ctaText, ctaLink };
        onUpdate();
      }
    }, 700);
    return () => clearTimeout(t);
  }, [headline, subheadline, ctaText, ctaLink]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Images className="w-5 h-5" /> Hero Slideshow</CardTitle>
          <CardDescription>Hero section-এ multiple banner images auto-slide হবে। যত খুশি ছবি upload করো — drag-order এ slide হবে।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {images.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center bg-muted/20">
              <Images className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No slideshow images yet. Upload your best frames.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((url, idx) => (
                <div key={url + idx} className="relative group rounded-lg overflow-hidden border border-border bg-muted">
                  <img src={url} alt={`Slide ${idx + 1}`} className="w-full aspect-[4/3] object-cover" />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                    #{idx + 1}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="h-7 w-7" disabled={idx === 0} onClick={() => moveImage(idx, -1)}>
                      <GripVertical className="w-3 h-3 rotate-180" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-7 w-7" disabled={idx === images.length - 1} onClick={() => moveImage(idx, 1)}>
                      <GripVertical className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => removeImage(idx)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={() => fileRef.current?.click()} disabled={uploading} variant="outline">
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? "Uploading…" : "Add Images"}
            </Button>
            <p className="text-xs text-muted-foreground">Recommended 1920×1280 · max {Math.round(perFileLimitBytes / 1024 / 1024)}MB each</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Hero Text & CTA</CardTitle>
          <CardDescription>Slideshow-এর উপরে যে text আর button দেখাবে।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Headline</Label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Frames by Alex" maxLength={120} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline (top ribbon text)</Label>
              <Input value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="Visual Storyteller" maxLength={200} />
              <p className="text-[11px] text-muted-foreground">Headline-এর উপরে যে ছোট ribbon text দেখায় (যেমন: "// Bangladeshi Visual Creator...")</p>
            </div>
            <div className="space-y-1.5">
              <Label>Primary Button Text</Label>
              <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="View My Photographs" maxLength={40} />
            </div>
            <div className="space-y-1.5">
              <Label>Primary Button Link</Label>
              <Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="#works" maxLength={200} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
