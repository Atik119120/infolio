import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Loader2, Github, Linkedin, Twitter, Globe, Youtube, Instagram, Facebook } from "lucide-react";
import type { SocialLink } from "@/pages/PortfolioEdit";

interface SocialLinksFormProps {
  socialLinks: SocialLink[];
  userId: string;
  onUpdate: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const PLATFORMS = [
  { value: "github", label: "GitHub", icon: Github },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "Twitter/X", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "website", label: "Website", icon: Globe },
  { value: "other", label: "Other", icon: Globe },
];

const getPlatformIcon = (platform: string) => {
  const p = PLATFORMS.find((pl) => pl.value === platform.toLowerCase());
  return p?.icon || Globe;
};

export function SocialLinksForm({ socialLinks, userId, onUpdate, onSuccess, onError }: SocialLinksFormProps) {
  const [newLink, setNewLink] = useState({ platform: "", url: "" });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newLink.platform || !newLink.url.trim()) {
      onError("Please select a platform and enter URL");
      return;
    }

    setAdding(true);

    const { error } = await supabase.from("social_links").insert({
      user_id: userId,
      platform: newLink.platform,
      url: newLink.url.trim(),
      display_order: socialLinks.length,
    });

    setAdding(false);

    if (error) {
      onError("Failed to add social link");
    } else {
      onSuccess("Social link added");
      setNewLink({ platform: "", url: "" });
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      onError("Failed to delete link");
    } else {
      onSuccess("Link removed");
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Link */}
      <Card>
        <CardHeader>
          <CardTitle>Add Social Link</CardTitle>
          <CardDescription>Connect your social profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={newLink.platform}
                onValueChange={(value) => setNewLink({ ...newLink, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <platform.icon className="w-4 h-4" />
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <Button onClick={handleAdd} disabled={adding} className="gradient-primary">
            {adding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Link
          </Button>
        </CardContent>
      </Card>

      {/* Links List */}
      {socialLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const Icon = getPlatformIcon(link.platform);
                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{link.platform}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary truncate max-w-[200px] block"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                    >
                      {deletingId === link.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {socialLinks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-medium mb-2">No social links yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your social profiles so visitors can connect with you
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}