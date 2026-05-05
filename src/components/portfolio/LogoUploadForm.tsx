import { useState, useRef } from "react";
import { usePlan } from "@/hooks/usePlan";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Image, Trash2, Type } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface LogoUploadFormProps {
  logoUrl: string | null;
  brandName?: string | null;
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function LogoUploadForm({ logoUrl, brandName, userId, onUpdate, onSuccess, onError }: LogoUploadFormProps) {
  const { perFileLimitBytes, isPro } = usePlan();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [name, setName] = useState(brandName || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = async () => {
    setSavingName(true);
    const { error } = await supabase
      .from("portfolios")
      .update({ brand_name: name.trim() || null })
      .eq("user_id", userId);
    setSavingName(false);
    if (error) onError("Failed to save brand name");
    else { onSuccess("Brand name saved"); onUpdate(); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }

    // 1MB limit
    if (file.size > perFileLimitBytes) {
      onError(`Logo must be less than ${Math.round(perFileLimitBytes/1024/1024)}MB${isPro ? "" : " (upgrade to Pro for 3MB)"}`);
      return;
    }

    setUploading(true);

    try {
      // Compress logo image
      const compressedFile = await compressImage(file, {
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.85,
        maxSizeKB: 150,
      });

      const fileName = `${userId}/logo.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressedFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("portfolios")
        .update({ logo_url: urlData.publicUrl + "?t=" + Date.now() })
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      onSuccess("Logo compressed and uploaded!");
      onUpdate();
    } catch (err) {
      console.error("Upload error:", err);
      onError("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    setRemoving(true);

    const { error } = await supabase
      .from("portfolios")
      .update({ logo_url: null })
      .eq("user_id", userId);

    setRemoving(false);

    if (error) {
      onError("Failed to remove logo");
    } else {
      onSuccess("Logo removed successfully");
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Portfolio Logo
        </CardTitle>
        <CardDescription>
          Upload a custom logo for your portfolio header and footer. This single logo will appear in both places.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 overflow-hidden">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Footer logo" 
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Image className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Custom Logo</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Recommended: PNG or SVG, max 2MB
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {logoUrl ? "Change" : "Upload"}
              </Button>
              {logoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={removing}
                  className="text-destructive hover:text-destructive"
                >
                  {removing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Brand name fallback */}
        <div className="border-t pt-4 space-y-2">
          <Label htmlFor="brand_name" className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            Brand Name (text fallback)
          </Label>
          <p className="text-xs text-muted-foreground">
            Shown in your portfolio header & footer when no logo image is uploaded.
            Leave empty to use your display name.
          </p>
          <div className="flex gap-2">
            <Input
              id="brand_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="e.g., John Doe Studio"
            />
            <Button onClick={handleSaveName} disabled={savingName} variant="secondary">
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}