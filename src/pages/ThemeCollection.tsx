import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";
import { 
  Code, 
  Camera, 
  Palette, 
  Video, 
  TrendingUp, 
  Briefcase, 
  Heart, 
  Sparkles,
  ArrowLeft,
  Eye,
  Crown,
  Check,
  Star,
  Zap
} from "lucide-react";
import { THEME_OPTIONS, getGroupedThemes, ThemeCategory } from "@/components/portfolio/themes/types";

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  'free': Star,
  'web-developer': Code,
  'graphic-designer': Palette,
  'photographer': Camera,
  'video-editor': Video,
  'digital-marketer': TrendingUp,
  'official': Briefcase,
  'personal': Heart,
  'cosmic': Sparkles,
};

// Category colors mapping
const categoryColors: Record<string, string> = {
  'free': 'from-gray-500 to-gray-700',
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
  'standard': 'from-blue-500 to-cyan-500',
  'pro': 'from-amber-500 to-orange-500',
  'elite': 'from-purple-500 via-violet-500 to-fuchsia-500',
};

// Tier badge colors
const tierBadgeColors: Record<string, string> = {
  'standard': 'bg-blue-500',
  'pro': 'bg-gradient-to-r from-amber-500 to-orange-500',
  'elite': 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500',
};

export default function ThemeCollection() {
  const navigate = useNavigate();
  
  const groupedThemes = getGroupedThemes();
  const freeThemes = groupedThemes.find(g => g.category === 'free');
  const premiumGroups = groupedThemes.filter(g => g.category !== 'free');
  const totalThemes = THEME_OPTIONS.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={alphaLogo} alt="Alpha Portfolio" className="w-10 h-10 object-contain dark:invert" />
            <span className="text-xl font-bold hidden sm:block">Theme Collection</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              className="gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {totalThemes} Premium Themes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect <span className="gradient-text">Theme</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free or unlock premium themes. Pro & Elite tiers with advanced features!
          </p>
        </div>
      </section>

      {/* Free Theme Section */}
      {freeThemes && freeThemes.themes.length > 0 && (
        <section className="py-8 px-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="text-lg px-4 py-1.5">
                🎁 Free Theme
              </Badge>
            </div>
            
            {freeThemes.themes.map((theme) => (
              <motion.div
                key={theme.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Theme Preview */}
                      <div className={`h-48 md:h-auto md:w-1/3 bg-gradient-to-br ${categoryColors['free']} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Star className="w-20 h-20 text-white/80" />
                        </div>
                      </div>
                      
                      {/* Theme Info */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-2xl font-bold">{theme.label} Theme</h2>
                          <Badge className="bg-primary/20 text-primary">Free Forever</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{theme.description}</p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            Clean, minimal design
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            All basic sections included
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            Mobile responsive
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary" />
                            No payment required
                          </li>
                        </ul>
                        <div className="flex gap-3">
                          <Button 
                            size="lg"
                            className="gradient-primary"
                            onClick={() => navigate("/auth")}
                          >
                            Use This Theme Free
                          </Button>
                          <Button 
                            size="lg"
                            variant="outline"
                            onClick={() => navigate(`/demo/${theme.value}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Premium Themes by Category */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="text-lg px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Crown className="w-4 h-4 mr-1.5" />
              Premium Themes
            </Badge>
          </div>
          
          {/* Tier Legend */}
          <div className="bg-muted/50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Theme Tiers</h3>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="font-medium">Standard</span>
                <span className="text-muted-foreground">- ৳200</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-500 to-orange-500" />
                <span className="font-medium">Pro</span>
                <span className="text-muted-foreground">- ৳300</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                <span className="font-medium">Elite</span>
                <span className="text-muted-foreground">- ৳400</span>
                <Crown className="w-4 h-4 text-purple-500" />
              </span>
            </div>
          </div>

          {/* Theme Categories */}
          <div className="space-y-12">
            {premiumGroups.map((group) => {
              const CategoryIcon = categoryIcons[group.category];
              const categoryColor = categoryColors[group.category];
              
              return (
                <div key={group.category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{group.label}</h3>
                      <p className="text-sm text-muted-foreground">{group.themes.length} theme{group.themes.length > 1 ? 's' : ''} available</p>
                    </div>
                  </div>

                  {/* Theme Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {group.themes.map((theme, index) => {
                      const tierColor = tierColors[theme.tier] || categoryColor;
                      const tierBadge = tierBadgeColors[theme.tier];
                      
                      return (
                        <motion.div
                          key={theme.value}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group cursor-pointer"
                          onClick={() => navigate(`/demo/${theme.value}`)}
                        >
                          <div className="relative overflow-hidden rounded-2xl bg-card border shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                            {/* Tier & Price Badge */}
                            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
                              <Badge className={`${tierBadge} text-white border-0 text-xs capitalize`}>
                                {theme.tier === 'elite' && <Crown className="w-3 h-3 mr-1" />}
                                {theme.tier === 'pro' && <Zap className="w-3 h-3 mr-1" />}
                                {theme.tier}
                              </Badge>
                              <Badge className="bg-black/60 text-white border-0 text-xs">
                                ৳{theme.price}
                              </Badge>
                            </div>

                            {/* Theme Preview Header */}
                            <div className={`h-36 md:h-44 bg-gradient-to-br ${tierColor} relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-black/10" />
                              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/40" />
                              <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/30" />
                              <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-white/20" />
                              
                              <div className="absolute inset-0 flex items-center justify-center">
                                <CategoryIcon className="w-16 h-16 md:w-20 md:h-20 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                              </div>

                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex items-center gap-2 text-white font-medium">
                                  <Eye className="w-5 h-5" />
                                  View Demo
                                </div>
                              </div>
                            </div>

                            {/* Theme Info */}
                            <div className="p-4">
                              <h3 className="font-semibold text-base mb-1">{theme.label}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="container mx-auto">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-4">How Premium Themes Work</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Choose a Theme</h4>
                  <p className="text-sm text-muted-foreground">Preview and select your preferred premium theme</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Pay via bKash/Nagad</h4>
                  <p className="text-sm text-muted-foreground">Standard ৳200, Pro ৳300, Elite ৳400</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Admin Approval</h4>
                  <p className="text-sm text-muted-foreground">Get approved and unlock your theme forever</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-8">
            Create your account and start with the free theme, upgrade anytime!
          </p>
          <Button 
            size="lg" 
            className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
}
