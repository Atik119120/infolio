import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Image, Trash2 } from "lucide-react";

interface LogoUploadFormProps {
  logoUrl: string | null;
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function LogoUploadForm({ logoUrl, userId, onUpdate, onSuccess, onError }: LogoUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onError("Logo must be less than 2MB");
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      onError("Failed to upload logo");
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("portfolios")
      .update({ logo_url: urlData.publicUrl })
      .eq("user_id", userId);

    setUploading(false);

    if (updateError) {
      onError("Failed to update portfolio");
    } else {
      onSuccess("Logo uploaded successfully");
      onUpdate();
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
          Footer Logo
        </CardTitle>
        <CardDescription>
          Upload a custom logo for your portfolio footer. Leave empty to use the default theme logo.
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
      </CardContent>
    </Card>
  );
}