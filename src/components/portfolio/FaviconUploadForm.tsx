import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Globe, Trash2 } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface FaviconUploadFormProps {
  faviconUrl: string | null;
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function FaviconUploadForm({ faviconUrl, userId, onUpdate, onSuccess, onError }: FaviconUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      onError("Favicon must be less than 1MB");
      return;
    }

    setUploading(true);

    try {
      // Compress favicon image - smaller size for favicon
      const compressedFile = await compressImage(file, {
        maxWidth: 180,
        maxHeight: 180,
        quality: 0.9,
        maxSizeKB: 50,
      });

      const fileName = `${userId}/favicon.png`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressedFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Use type assertion since favicon_url was just added to the schema
      const { error: updateError } = await supabase
        .from("portfolios")
        .update({ favicon_url: urlData.publicUrl + "?t=" + Date.now() } as any)
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      onSuccess("Favicon uploaded successfully!");
      onUpdate();
    } catch (err) {
      console.error("Upload error:", err);
      onError("Failed to upload favicon");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFavicon = async () => {
    setRemoving(true);

    // Use type assertion since favicon_url was just added to the schema
    const { error } = await supabase
      .from("portfolios")
      .update({ favicon_url: null } as any)
      .eq("user_id", userId);

    setRemoving(false);

    if (error) {
      onError("Failed to remove favicon");
    } else {
      onSuccess("Favicon removed successfully");
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5" />
          Favicon
        </CardTitle>
        <CardDescription className="text-sm">
          Upload a small icon that appears in browser tabs. Recommended: 180x180 PNG.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 overflow-hidden">
              {faviconUrl ? (
                <img 
                  src={faviconUrl} 
                  alt="Favicon" 
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Globe className="w-6 h-6 text-muted-foreground/50" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-1" />
                {faviconUrl ? "Change" : "Upload"}
              </Button>
              {faviconUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFavicon}
                  disabled={removing}
                  className="text-destructive hover:text-destructive"
                >
                  {removing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
