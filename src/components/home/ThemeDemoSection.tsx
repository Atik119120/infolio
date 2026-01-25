import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Code, 
  Camera, 
  Palette, 
  Video, 
  TrendingUp, 
  Briefcase, 
  Heart, 
  Sparkles,
  ArrowRight,
  Eye,
  Crown,
  Zap
} from "lucide-react";
import { getGroupedThemes, ThemeCategory } from "@/components/portfolio/themes/types";

// Category icons mapping
const categoryIcons: Record<ThemeCategory, React.ElementType> = {
  'free': Sparkles,
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
const categoryColors: Record<ThemeCategory, string> = {
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
  'free': 'from-gray-500 to-gray-700',
  'standard': 'from-blue-500 to-cyan-500',
  'pro': 'from-amber-500 to-orange-500',
  'elite': 'from-purple-500 via-violet-500 to-fuchsia-500',
};

export default function ThemeDemoSection() {
  const navigate = useNavigate();
  const groupedThemes = getGroupedThemes();
  
  // Get all premium themes for the grid display (skip free)
  const allPremiumThemes = groupedThemes
    .filter(g => g.category !== 'free')
    .flatMap(g => g.themes);

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {allPremiumThemes.length + 1} Premium Themes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our <span className="gradient-text">Theme Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each theme is crafted for a specific profession with unique animations and layouts
          </p>
        </div>

        {/* Tier Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Standard</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-orange-500" />
            <span>Pro</span>
            <Zap className="w-3 h-3 text-amber-500" />
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-fuchsia-500" />
            <span>Elite</span>
            <Crown className="w-3 h-3 text-purple-500" />
          </span>
        </div>

        {/* Theme Grid - Show by category groups */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {allPremiumThemes.map((theme, index) => {
            const CategoryIcon = categoryIcons[theme.category];
            const tierColor = tierColors[theme.tier];
            
            return (
              <motion.div
                key={theme.value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/demo/${theme.value}`)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                  {/* Tier Badge */}
                  {theme.tier !== 'standard' && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className={`${theme.tier === 'pro' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500'} text-white border-0 text-xs capitalize`}>
                        {theme.tier === 'elite' && <Crown className="w-3 h-3 mr-1" />}
                        {theme.tier === 'pro' && <Zap className="w-3 h-3 mr-1" />}
                        {theme.tier}
                      </Badge>
                    </div>
                  )}

                  {/* Theme Preview Header */}
                  <div className={`h-28 md:h-36 bg-gradient-to-br ${tierColor} relative overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/40" />
                    <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/30" />
                    <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-white/20" />
                    
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon className="w-12 h-12 md:w-16 md:h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Eye className="w-5 h-5" />
                        View Demo
                      </div>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm md:text-base mb-1">{theme.label}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{theme.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon Badge */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
            <div className="flex -space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-red-500 animate-pulse delay-100" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse delay-200" />
            </div>
            <span className="text-sm font-medium text-foreground/80">
              More Pro & Elite themes coming soon...
            </span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8"
            onClick={() => navigate("/themes")}
          >
            View All Themes
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
