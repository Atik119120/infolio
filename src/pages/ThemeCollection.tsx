import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
import SiteHeader from "@/components/home/SiteHeader";

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

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Infolio Theme Gallery",
    description: "Browse free and premium portfolio themes by category — for designers, photographers, developers, marketers, and more.",
    url: "https://infolio.online/themes",
    isPartOf: { "@type": "WebSite", name: "Infolio", url: "https://infolio.online/" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Portfolio Themes — Infolio</title>
        <meta name="description" content="Browse Infolio's gallery of free and premium portfolio themes designed for every profession." />
        <link rel="canonical" href="https://infolio.online/themes" />
        <meta property="og:title" content="Portfolio Themes — Infolio" />
        <meta property="og:description" content="Browse free and premium portfolio themes by category — built for designers, photographers, developers and more." />
        <meta property="og:url" content="https://infolio.online/themes" />
        <script type="application/ld+json">{JSON.stringify(collectionJsonLd)}</script>
      </Helmet>
      <SiteHeader />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {totalThemes} Themes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect <span className="gradient-text">Theme</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beautifully crafted portfolio themes.
          </p>
        </div>
      </section>

      {/* Theme Section */}
      {freeThemes && freeThemes.themes.length > 0 && (
        <section className="py-8 px-6">
          <div className="container mx-auto">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors['free']} flex items-center justify-center shadow-lg`}>
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Themes</h3>
                <p className="text-sm text-muted-foreground">
                  {freeThemes.themes.length} theme{freeThemes.themes.length > 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {freeThemes.themes.map((theme, index) => (
                <motion.div
                  key={theme.value}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/demo/${theme.value}`)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-card border border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                    {/* Theme Preview */}
                    <div className={`h-36 md:h-44 bg-gradient-to-br ${categoryColors['free']} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/40" />
                      <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/30" />
                      <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-white/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Star className="w-16 h-16 md:w-20 md:h-20 text-white/80 group-hover:scale-110 transition-transform duration-300" />
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
              ))}
            </div>
          </div>
        </section>
      )}

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
