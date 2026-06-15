import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePlan } from "@/hooks/usePlan";
import { compressImage } from "@/lib/imageCompression";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Trash2, Image as ImageIcon, Sparkles, User, Type, Globe } from "lucide-react";

interface CustomizationData {
  hero_image_url?: string | null;
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  hero_cta_text?: string | null;
  hero_cta_link?: string | null;
  about_image_url?: string | null;
  about_text?: string | null;
  footer_text?: string | null;
  browser_title?: string | null;
}

interface Props {
  portfolio: CustomizationData | null;
  userId: string;
  enabledFields?: import("@/config/themeFeatures").CustomizeField[];
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

export function CustomizationForm({ portfolio, userId, enabledFields, onUpdate, onSuccess, onError }: Props) {
  const ALL_ON = !enabledFields;
  const has = (f: import("@/config/themeFeatures").CustomizeField) =>
    ALL_ON || (enabledFields && enabledFields.includes(f));
  const { perFileLimitBytes } = usePlan();
  const [data, setData] = useState<CustomizationData>({
    hero_image_url: portfolio?.hero_image_url || "",
    hero_headline: portfolio?.hero_headline || "",
    hero_subheadline: portfolio?.hero_subheadline || "",
    hero_cta_text: portfolio?.hero_cta_text || "",
    hero_cta_link: portfolio?.hero_cta_link || "",
    about_image_url: portfolio?.about_image_url || "",
    about_text: portfolio?.about_text || "",
    footer_text: portfolio?.footer_text || "",
    browser_title: portfolio?.browser_title || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const heroRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLInputElement>(null);

  const update = (k: keyof CustomizationData, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const buildPayload = () => ({
    hero_image_url: data.hero_image_url || null,
    hero_headline: data.hero_headline || null,
    hero_subheadline: data.hero_subheadline || null,
    hero_cta_text: data.hero_cta_text || null,
    hero_cta_link: data.hero_cta_link || null,
    about_image_url: data.about_image_url || null,
    about_text: data.about_text || null,
    footer_text: data.footer_text || null,
    browser_title: data.browser_title || null,
  });

  const doSave = async (payload: any, silent = false) => {
    setSaving(true);
    const { error } = await supabase.from("portfolios").update(payload).eq("user_id", userId);
    setSaving(false);
    if (error) {
      onError("Failed to save customization");
      return false;
    }
    if (!silent) onSuccess("Customization saved");
    onUpdate();
    return true;
  };

  const handleSave = async () => {
    await doSave(buildPayload(), false);
  };

  // Auto-save after user stops typing
  const initialData = useRef(data);
  useEffect(() => {
    const changed = JSON.stringify(data) !== JSON.stringify(initialData.current);
    if (!changed) return;
    const timer = setTimeout(() => {
      doSave(buildPayload(), true);
      initialData.current = data;
    }, 800);
    return () => clearTimeout(timer);
  }, [data]);

  const uploadImage = async (file: File, key: "hero_image_url" | "about_image_url", setBusy: (b: boolean) => void) => {
    if (!file.type.startsWith("image/")) { onError("Please upload an image file"); return; }
    if (file.size > perFileLimitBytes) {
      onError(`Image must be less than ${Math.round(perFileLimitBytes / 1024 / 1024)}MB`);
      return;
    }
    setBusy(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82, maxSizeKB: 400 });
      const slug = key === "hero_image_url" ? "hero" : "about";
      const fileName = `${userId}/${slug}.jpg`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(fileName, compressed, { upsert: true });
      if (upErr) throw upErr;
      const { data: u } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const url = u.publicUrl + "?t=" + Date.now();
      setData((d) => ({ ...d, [key]: url }));
      const { error: updErr } = await supabase.from("portfolios").update({ [key]: url } as any).eq("user_id", userId);
      if (updErr) throw updErr;
      onSuccess("Image uploaded");
      onUpdate();
    } catch (e) {
      console.error(e);
      onError("Failed to upload image");
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (key: "hero_image_url" | "about_image_url") => {
    setData((d) => ({ ...d, [key]: "" }));
    const { error } = await supabase.from("portfolios").update({ [key]: null } as any).eq("user_id", userId);
    if (error) onError("Failed to remove image");
    else { onSuccess("Image removed"); onUpdate(); }
  };

  const ImageUpload = ({
    label, value, busy, onUpload, onRemove, inputRef,
  }: {
    label: string; value?: string | null; busy: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="flex items-center gap-4">
      <div className="w-28 h-28 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/40 overflow-hidden">
        {value ? <img src={value} alt={label} className="w-full h-full object-cover" /> : <ImageIcon className="w-7 h-7 text-muted-foreground/50" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mb-2">Recommended: 1600×1200, max {Math.round(perFileLimitBytes/1024/1024)}MB</p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {value ? "Change" : "Upload"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="outline" onClick={onRemove} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </Button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </div>
    </div>
  );

  const showHero = has("hero_image") || has("hero_headline") || has("hero_subheadline") || has("hero_cta");
  const showAbout = has("about_image") || has("about_text");
  const showFooter = has("footer_text") || has("browser_title");

  return (
    <div className="space-y-4">
      {/* HERO */}
      {showHero && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Hero Section</CardTitle>
            <CardDescription>প্রথম যে section দেখাবে — image, headline, CTA সব এখান থেকে control করো।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {has("hero_image") && (
              <ImageUpload
                label="Hero Image (Hero section-এ দেখাবে)"
                value={data.hero_image_url}
                busy={uploadingHero}
                inputRef={heroRef}
                onUpload={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "hero_image_url", setUploadingHero); }}
                onRemove={() => removeImage("hero_image_url")}
              />
            )}
            <div className="grid md:grid-cols-2 gap-3">
              {has("hero_headline") && (
                <div className="space-y-1.5">
                  <Label>Headline</Label>
                  <Input value={data.hero_headline || ""} onChange={(e) => update("hero_headline", e.target.value)} placeholder="e.g., Creative Web Designer" maxLength={120} />
                </div>
              )}
              {has("hero_subheadline") && (
                <div className="space-y-1.5">
                  <Label>Subheadline</Label>
                  <Input value={data.hero_subheadline || ""} onChange={(e) => update("hero_subheadline", e.target.value)} placeholder="Available for hire worldwide" maxLength={160} />
                </div>
              )}
              {has("hero_cta") && (
                <>
                  <div className="space-y-1.5">
                    <Label>CTA Button Text</Label>
                    <Input value={data.hero_cta_text || ""} onChange={(e) => update("hero_cta_text", e.target.value)} placeholder="View my work" maxLength={40} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CTA Button Link</Label>
                    <Input value={data.hero_cta_link || ""} onChange={(e) => update("hero_cta_link", e.target.value)} placeholder="#works or https://..." maxLength={200} />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ABOUT */}
      {showAbout && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> About Section</CardTitle>
            <CardDescription>About section-এর জন্য আলাদা image আর text — Hero থেকে completely separate।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {has("about_image") && (
              <ImageUpload
                label="About Image (About section-এ দেখাবে)"
                value={data.about_image_url}
                busy={uploadingAbout}
                inputRef={aboutRef}
                onUpload={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "about_image_url", setUploadingAbout); }}
                onRemove={() => removeImage("about_image_url")}
              />
            )}
            {has("about_text") && (
              <div className="space-y-1.5">
                <Label>About Text</Label>
                <Textarea
                  value={data.about_text || ""}
                  onChange={(e) => update("about_text", e.target.value)}
                  placeholder="Write about yourself — your story, expertise, and what makes you unique."
                  rows={5}
                  maxLength={1200}
                />
                <p className="text-xs text-muted-foreground">খালি রাখলে Basic Info-এর Bio ব্যবহার হবে।</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* FOOTER & BROWSER */}
      {showFooter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" /> Footer & Browser Tab</CardTitle>
            <CardDescription>Footer text, copyright, browser tab title customize করো।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {has("browser_title") && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground" /> Browser Tab Title</Label>
                <Input
                  value={data.browser_title || ""}
                  onChange={(e) => update("browser_title", e.target.value)}
                  placeholder="e.g., John Doe — Web Designer"
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground">
                  খালি রাখলে: SEO Meta Title → Brand Name → Display Name থেকে fallback হবে।
                </p>
              </div>
            )}
            {has("footer_text") && (
              <div className="space-y-1.5">
                <Label>Footer Text / Copyright</Label>
                <Textarea
                  value={data.footer_text || ""}
                  onChange={(e) => update("footer_text", e.target.value)}
                  placeholder="© 2026 Your Name. All rights reserved."
                  rows={2}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">খালি রাখলে default copyright দেখাবে।</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
