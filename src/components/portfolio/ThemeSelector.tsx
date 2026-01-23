import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, PenTool, Film, TrendingUp, Code2, Building2, Heart, 
  Eye, Check, Palette, ExternalLink
} from "lucide-react";
import { THEME_OPTIONS } from "./themes/types";

interface ThemeSelectorProps {
  currentTheme: string | null;
  userId: string;
  onUpdate: () => void;
}

const themeIcons: Record<string, typeof Camera> = {
  'photographer': Camera,
  'graphic-designer': PenTool,
  'video-editor': Film,
  'digital-marketer': TrendingUp,
  'web-developer': Code2,
  'official': Building2,
  'personal': Heart,
  'cosmic': Eye,
};

const themeColors: Record<string, string> = {
  'photographer': 'from-zinc-600 to-zinc-900',
  'graphic-designer': 'from-pink-500 to-purple-600',
  'video-editor': 'from-red-500 to-orange-500',
  'digital-marketer': 'from-green-500 to-teal-500',
  'web-developer': 'from-blue-500 to-cyan-500',
  'official': 'from-slate-600 to-slate-800',
  'personal': 'from-rose-400 to-pink-500',
  'cosmic': 'from-indigo-600 via-purple-600 to-pink-500',
};

const themePreviews: Record<string, { hero: string; features: string[] }> = {
  'photographer': {
    hero: 'Full-screen gallery layouts with elegant typography',
    features: ['Masonry gallery grid', 'Minimalist design', 'Focus on visuals', 'Smooth hover effects'],
  },
  'graphic-designer': {
    hero: 'Bold typography with creative color gradients',
    features: ['Large portfolio grid', 'Colorful accents', 'Creative layouts', 'Modern aesthetics'],
  },
  'video-editor': {
    hero: 'Cinematic widescreen layouts with play buttons',
    features: ['Video-focused grid', '16:9 aspect ratios', 'Film strip effects', 'Motion design ready'],
  },
  'digital-marketer': {
    hero: 'Results-focused with stats and metrics display',
    features: ['Stats dashboard', 'Case study cards', 'Professional look', 'Conversion focused'],
  },
  'web-developer': {
    hero: 'Terminal-style with code aesthetics',
    features: ['Code editor UI', 'Tech stack badges', 'GitHub integration', 'Developer friendly'],
  },
  'official': {
    hero: 'Professional corporate look for business use',
    features: ['Clean layouts', 'Business focused', 'Formal design', 'CV-like structure'],
  },
  'personal': {
    hero: 'Elegant biography style for personal branding',
    features: ['Story-focused', 'Warm aesthetics', 'Personal touch', 'Blog-like feel'],
  },
  'cosmic': {
    hero: 'Premium space-inspired luxury universe theme',
    features: ['Solar system hero', 'Floating stars', 'Nebula effects', 'Premium animations'],
  },
};

export function ThemeSelector({ currentTheme, userId, onUpdate }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'personal');
  const [saving, setSaving] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const { toast } = useToast();

  const handleThemeChange = async (theme: string) => {
    setSaving(true);
    setSelectedTheme(theme);

    const { error } = await supabase
      .from("portfolios")
      .update({ theme })
      .eq("user_id", userId);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update theme",
      });
    } else {
      toast({
        title: "Theme Updated!",
        description: `Your portfolio now uses the ${THEME_OPTIONS.find(t => t.value === theme)?.label} theme`,
      });
      onUpdate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Choose Your Theme
        </CardTitle>
        <CardDescription>
          Select a theme that matches your profession. Each theme has unique design and layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {THEME_OPTIONS.map((theme) => {
            const Icon = themeIcons[theme.value] || Heart;
            const isSelected = selectedTheme === theme.value;
            const preview = themePreviews[theme.value];
            const gradient = themeColors[theme.value];

            return (
              <div
                key={theme.value}
                className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleThemeChange(theme.value)}
              >
                {/* Theme Preview Header */}
                <div className={`h-24 bg-gradient-to-br ${gradient} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white/80" />
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-primary">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{theme.label}</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTheme(theme.value);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            {theme.label} Theme
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          {/* Mock Preview */}
                          <div className={`h-48 rounded-xl bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="text-center text-white">
                                <Icon className="w-12 h-12 mx-auto mb-3 opacity-80" />
                                <p className="text-lg font-medium">{preview?.hero}</p>
                              </div>
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="font-medium mb-3">Theme Features:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {preview?.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Check className="w-4 h-4 text-primary" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex gap-3">
                            <Button 
                              className="flex-1"
                              onClick={() => {
                                handleThemeChange(theme.value);
                              }}
                              disabled={isSelected || saving}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Currently Active
                                </>
                              ) : (
                                <>
                                  <Palette className="w-4 h-4 mr-2" />
                                  Use This Theme
                                </>
                              )}
                            </Button>
                            <Button variant="outline" asChild>
                              <a href={`/demo/${theme.value}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
