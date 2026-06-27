import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Camera } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";
import { usePlan } from "@/hooks/usePlan";
import type { Profile, Portfolio } from "@/pages/PortfolioEdit";

interface Props {
  profile: Profile | null;
  portfolio: Portfolio | null;
  userId: string;
  onUpdate: () => void;
  onSuccess: (m: string) => void;
  onError: (m: string) => void;
}

type Stats = { projects: string; years: string; clients: string };

function readStats(p: any): Stats {
  const s = p?.about_stats || {};
  return {
    projects: s.projects ?? "120+",
    years: s.years ?? "08",
    clients: s.clients ?? "40+",
  };
}

export function AboutPhotographerForm({ profile, portfolio, userId, onUpdate, onSuccess, onError }: Props) {
  const { perFileLimitBytes, isPro } = usePlan();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    headline: portfolio?.headline || "",
    about_headline: (portfolio as any)?.about_headline || "",
    bio: (portfolio as any)?.about_text || portfolio?.bio || "",
    stats: readStats(portfolio),
  });

  const initialData = useRef(formData);
  useEffect(() => {
    if (JSON.stringify(formData) === JSON.stringify(initialData.current)) return;
    const t = setTimeout(async () => {
      const [pr, po] = await Promise.all([
        supabase.from("profiles").update({ display_name: formData.display_name }).eq("user_id", userId),
        supabase.from("portfolios").update({
          headline: formData.headline,
          about_text: formData.bio,
          about_headline: formData.about_headline,
          about_stats: formData.stats,
        } as any).eq("user_id", userId),
      ]);
      if (pr.error || po.error) onError("Failed to save");
      else { initialData.current = formData; onUpdate(); }
    }, 800);
    return () => clearTimeout(t);
  }, [formData]);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return onError("Please upload an image");
    if (file.size > perFileLimitBytes) return onError(`Image must be < ${Math.round(perFileLimitBytes/1024/1024)}MB${isPro?"":" (upgrade to Pro)"}`);
    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 800, quality: 0.85, maxSizeKB: 150 });
      const fileName = `${userId}/avatar.jpg`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(fileName, compressed, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const { error } = await supabase.from("profiles").update({ avatar_url: data.publicUrl + "?t=" + Date.now() }).eq("user_id", userId);
      if (error) throw error;
      onSuccess("Photo updated");
      onUpdate();
    } catch {
      onError("Upload failed");
    } finally { setUploading(false); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>Your photo, bio, and stats shown in the About panel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{formData.display_name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </div>
          <div>
            <h3 className="font-medium">Profile Photo</h3>
            <p className="text-sm text-muted-foreground">Shown beside your About text</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Headline / Tagline</Label>
            <Input value={formData.headline} onChange={(e) => setFormData({ ...formData, headline: e.target.value })} placeholder="Photographer" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>About Headline</Label>
          <Input value={formData.about_headline} onChange={(e) => setFormData({ ...formData, about_headline: e.target.value })} placeholder="Light, shadow, and the space between." />
          <p className="text-xs text-muted-foreground">Big bold title in the About section.</p>
        </div>

        <div className="space-y-2">
          <Label>About / Bio</Label>
          <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={6} placeholder="Tell your story..." />
        </div>

        <div className="space-y-3">
          <Label>Stats</Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Input value={formData.stats.projects} onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, projects: e.target.value } })} placeholder="120+" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Projects</p>
            </div>
            <div className="space-y-1">
              <Input value={formData.stats.years} onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, years: e.target.value } })} placeholder="08" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Years</p>
            </div>
            <div className="space-y-1">
              <Input value={formData.stats.clients} onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, clients: e.target.value } })} placeholder="40+" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Clients</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
