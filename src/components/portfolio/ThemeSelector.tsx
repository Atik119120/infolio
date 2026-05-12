import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, PenTool, Film, TrendingUp, Code2, Building2, Heart, 
  Eye, Check, Palette, ExternalLink, Lock, Sparkles, Clock, Star, Crown, Zap
} from "lucide-react";
import { THEME_OPTIONS, getGroupedThemes, ThemeCategory } from "./themes/types";
import { useAdminThemes } from "@/hooks/useAdminThemes";
import { WhatsAppUpgradeDialog } from "@/components/billing/WhatsAppUpgradeDialog";

interface ThemeSelectorProps {
  currentTheme: string | null;
  userId: string;
  onUpdate: () => void;
}

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  'free': Star,
  'web-developer': Code2,
  'graphic-designer': PenTool,
  'photographer': Camera,
  'video-editor': Film,
  'digital-marketer': TrendingUp,
  'official': Building2,
  'personal': Heart,
  'cosmic': Eye,
};

// Category colors mapping
const categoryColors: Record<string, string> = {
  'free': 'from-slate-500 to-slate-700',
  'web-developer': 'from-green-500 to-emerald-600',
  'graphic-designer': 'from-pink-500 to-rose-600',
  'photographer': 'from-amber-500 to-orange-600',
  'video-editor': 'from-purple-500 to-violet-600',
  'digital-marketer': 'from-blue-500 to-cyan-600',
  'official': 'from-slate-600 to-slate-800',
  'personal': 'from-rose-400 to-pink-500',
  'cosmic': 'from-indigo-600 via-purple-600 to-pink-500',
};

// Tier colors
const tierColors: Record<string, string> = {
  'free': 'from-gray-500 to-gray-700',
  'standard': 'from-blue-500 to-cyan-500',
  'pro': 'from-amber-500 to-orange-500',
  'elite': 'from-purple-500 via-violet-500 to-fuchsia-500',
};

const themePreviews: Record<string, { hero: string; features: string[] }> = {
  'simple': {
    hero: 'Clean and minimal design for everyone',
    features: ['Clean layout', 'Fast loading', 'Mobile friendly', 'Free forever'],
  },
  'photographer': {
    hero: 'Full-screen gallery layouts with elegant typography',
    features: ['Masonry gallery grid', 'Minimalist design', 'Focus on visuals', 'Smooth hover effects'],
  },
  'graphic-designer': {
    hero: 'Bold typography with creative color gradients',
    features: ['Large portfolio grid', 'Colorful accents', 'Creative layouts', 'Modern aesthetics'],
  },
  'graphic-designer-pro': {
    hero: 'Magazine-style editorial theme with 3D elements',
    features: ['3D floating shapes', 'Marquee text', 'Color swatches', 'Editorial layout'],
  },
  'graphic-designer-elite': {
    hero: 'Luxury dark theme with cinematic animations',
    features: ['3D gradient blobs', 'Tilt cards', 'Luxury animations', 'Dark aesthetics'],
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
  'web-developer-pro': {
    hero: 'Matrix-style dark theme with terminal aesthetics',
    features: ['3D floating cubes', 'Matrix rain effect', 'Bento grid layout', 'Terminal animations'],
  },
  'web-developer-elite': {
    hero: 'Glassmorphism cyberpunk with 3D elements',
    features: ['3D torus animations', 'Magnetic buttons', 'Animated counters', 'Glassmorphism UI'],
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

interface PurchaseStatus {
  theme_id: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function ThemeSelector({ currentTheme, userId, onUpdate }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'freelancer');
  const [saving, setSaving] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [purchasedThemes, setPurchasedThemes] = useState<PurchaseStatus[]>([]);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedPurchaseTheme, setSelectedPurchaseTheme] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();

  const baseGrouped = getGroupedThemes();
  const { themes: adminThemes } = useAdminThemes();
  const groupedThemes = adminThemes.length > 0
    ? [
        ...baseGrouped,
        {
          category: 'free' as ThemeCategory,
          label: 'Custom Themes',
          themes: adminThemes.map((t) => ({
            value: `admin:${t.slug}`,
            label: t.name,
            description: t.description || 'Custom uploaded theme',
            isPremium: false,
            price: 0,
            category: 'free' as ThemeCategory,
            tier: 'free' as const,
          })),
        },
      ]
    : baseGrouped;

  useEffect(() => {
    setSelectedTheme(currentTheme || 'freelancer');
  }, [currentTheme]);

  // Fetch user's purchased themes
  useEffect(() => {
    const fetchPurchases = async () => {
      const { data } = await supabase
        .from("theme_purchases")
        .select("theme_id, status")
        .eq("user_id", userId);
      
      if (data) {
        setPurchasedThemes(data as PurchaseStatus[]);
      }
    };

    fetchPurchases();
  }, [userId]);

  const isThemeUnlocked = (themeValue: string) => {
    // Free tier themes are always unlocked
    const themeOption = THEME_OPTIONS.find(t => t.value === themeValue);
    if (themeOption?.tier === 'free') return true;

    // Check if user has approved purchase
    return purchasedThemes.some(
      p => p.theme_id === themeValue && p.status === 'approved'
    );
  };

  const getThemePurchaseStatus = (themeValue: string) => {
    const purchase = purchasedThemes.find(p => p.theme_id === themeValue);
    return purchase?.status;
  };

  const handleThemeChange = async (themeValue: string) => {
    // Check if theme is locked
    if (!isThemeUnlocked(themeValue)) {
      const themeOption = THEME_OPTIONS.find(t => t.value === themeValue);
      setSelectedPurchaseTheme({ id: themeValue, name: themeOption?.label || themeValue });
      setPurchaseDialogOpen(true);
      return;
    }

    setSaving(true);
    setSelectedTheme(themeValue);

    const { error } = await supabase
      .from("portfolios")
      .update({ theme: themeValue })
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
        description: `Your portfolio now uses the ${THEME_OPTIONS.find(t => t.value === themeValue)?.label} theme`,
      });
      onUpdate();
    }
  };

  const handlePurchaseSuccess = async () => {
    // Refresh purchases
    const { data } = await supabase
      .from("theme_purchases")
      .select("theme_id, status")
      .eq("user_id", userId);
    
    if (data) {
      setPurchasedThemes(data as PurchaseStatus[]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Choose Your Theme
          </CardTitle>
          <CardDescription>
            Select a theme that matches your profession. Themes are grouped by category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Tier Legend */}
          <div className="flex flex-wrap items-center gap-4 text-sm p-4 bg-muted/50 rounded-lg">
            <span className="font-medium">Tiers:</span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500" />
              Standard ৳200
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-orange-500" />
              <Zap className="w-3 h-3 text-amber-500" />
              Pro ৳300
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-fuchsia-500" />
              <Crown className="w-3 h-3 text-purple-500" />
              Elite ৳400
            </span>
          </div>

          {/* Theme Categories */}
          {groupedThemes.map((group) => {
            const CategoryIcon = categoryIcons[group.category];
            const categoryColor = categoryColors[group.category];
            
            return (
              <div key={group.category}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                    <CategoryIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold">{group.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {group.themes.length} theme{group.themes.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Theme Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.themes.map((theme) => {
                    const Icon = categoryIcons[theme.category];
                    const isSelected = selectedTheme === theme.value;
                    const preview = themePreviews[theme.value];
                    const gradient = tierColors[theme.tier];
                    const isUnlocked = isThemeUnlocked(theme.value);
                    const purchaseStatus = getThemePurchaseStatus(theme.value);
                    const isFree = theme.tier === 'free';

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
                          
                          {/* Lock overlay for premium themes */}
                          {!isUnlocked && !isFree && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                              <div className="bg-black/60 rounded-full p-2">
                                <Lock className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {isSelected && (
                              <Badge className="bg-white text-primary">
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            {isFree ? null : isUnlocked ? (
                              <Badge variant="secondary" className="bg-amber-500/90 text-white border-0">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Owned
                              </Badge>
                            ) : purchaseStatus === 'pending' ? (
                              <Badge variant="secondary" className="bg-blue-500/90 text-white border-0">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            ) : (
                              <>
                                <Badge className={`${theme.tier === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : theme.tier === 'elite' ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500' : 'bg-blue-500'} text-white border-0 text-xs capitalize`}>
                                  {theme.tier === 'elite' && <Crown className="w-3 h-3 mr-1" />}
                                  {theme.tier === 'pro' && <Zap className="w-3 h-3 mr-1" />}
                                  {theme.tier}
                                </Badge>
                                <Badge variant="secondary" className="bg-black/60 text-white border-0">
                                  ৳{theme.price}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Theme Info */}
                        <div className="p-4 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-sm">{theme.label}</h3>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewTheme(theme.value);
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
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
                                    {isFree ? null : (
                                      <Badge className={`${theme.tier === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : theme.tier === 'elite' ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500' : 'bg-blue-500'} text-white ml-2 capitalize`}>
                                        {theme.tier} - ৳{theme.price}
                                      </Badge>
                                    )}
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
                                    {isUnlocked ? (
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
                                    ) : purchaseStatus === 'pending' ? (
                                      <Button className="flex-1" disabled>
                                        <Clock className="w-4 h-4 mr-2" />
                                        Purchase Pending Approval
                                      </Button>
                                    ) : (
                                      <Button 
                                        className={`flex-1 ${theme.tier === 'elite' ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600' : theme.tier === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}`}
                                        onClick={() => {
                                          setSelectedPurchaseTheme({ id: theme.value, name: theme.label });
                                          setPurchaseDialogOpen(true);
                                        }}
                                      >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Unlock for ৳{theme.price}
                                      </Button>
                                    )}
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
                          <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
                          <Button
                            className="mt-4 w-full"
                            variant={isSelected ? "secondary" : isUnlocked ? "default" : "outline"}
                            size="sm"
                            disabled={isSelected || saving}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleThemeChange(theme.value);
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Selected
                              </>
                            ) : isUnlocked ? (
                              <>
                                <Palette className="w-4 h-4 mr-2" />
                                Select Theme
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Unlock
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Purchase Dialog */}
      {selectedPurchaseTheme && (
        <WhatsAppUpgradeDialog
          open={purchaseDialogOpen}
          onOpenChange={setPurchaseDialogOpen}
          reason={`Unlock theme: ${selectedPurchaseTheme.name}`}
          title={`Unlock ${selectedPurchaseTheme.name}`}
          description="Contact us on WhatsApp to unlock this premium theme."
        />
      )}
    </>
  );
}
