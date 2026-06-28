import { useState, useRef, useEffect } from "react";
import { usePlan } from "@/hooks/usePlan";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Camera } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";
import type { Profile, Portfolio } from "@/pages/PortfolioEdit";

interface BasicInfoFormProps {
  profile: Profile | null;
  portfolio: Portfolio | null;
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  hideContactFields?: boolean;
}

export function BasicInfoForm({ profile, portfolio, userId, onUpdate, onSuccess, onError, hideContactFields }: BasicInfoFormProps) {
  const { perFileLimitBytes, isPro } = usePlan();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    headline: portfolio?.headline || "",
    bio: (portfolio as any)?.about_text || portfolio?.bio || "",
    location: portfolio?.location || "",
    phone: portfolio?.phone || "",
    website: portfolio?.website || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const doSave = async (silent = true) => {
    setSaving(true);
    const [profileRes, portfolioRes] = await Promise.all([
      supabase
        .from("profiles")
        .update({ display_name: formData.display_name })
        .eq("user_id", userId),
      supabase
        .from("portfolios")
        .update({
          headline: formData.headline,
          about_text: formData.bio,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
        })
        .eq("user_id", userId),
    ]);
    setSaving(false);
    if (profileRes.error || portfolioRes.error) {
      onError("Failed to save changes");
    } else {
      if (!silent) onSuccess("Profile updated successfully");
      onUpdate();
    }
  };

  const initialData = useRef(formData);
  useEffect(() => {
    if (JSON.stringify(formData) === JSON.stringify(initialData.current)) return;
    const t = setTimeout(() => {
      doSave(true);
      initialData.current = formData;
    }, 800);
    return () => clearTimeout(t);
  }, [formData]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }

    // 1MB limit
    if (file.size > perFileLimitBytes) {
      onError(`Image must be less than ${Math.round(perFileLimitBytes/1024/1024)}MB${isPro ? "" : " (upgrade to Pro for 3MB)"}`);
      return;
    }

    setUploading(true);

    try {
      // Compress avatar image
      const compressedFile = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        maxSizeKB: 100,
      });

      const fileName = `${userId}/avatar.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressedFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl + "?t=" + Date.now() })
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      onSuccess("Avatar compressed and uploaded!");
      onUpdate();
    } catch (err) {
      console.error("Upload error:", err);
      onError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Your personal details and introduction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl gradient-primary text-white">
                {formData.display_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="font-medium">Profile Photo</h3>
            <p className="text-sm text-muted-foreground">
              Click to upload a new photo (max 5MB)
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Full Stack Developer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About / Full Biography</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Share your full story, journey, experience, and background..."
            rows={8}
          />
        </div>

        {!hideContactFields && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}