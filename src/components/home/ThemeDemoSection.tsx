import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Code, Camera, Palette, Video, TrendingUp, Briefcase, Heart,
  Sparkles, ArrowRight, Eye, Crown, Zap, Star,
} from "lucide-react";
import { getGroupedThemes } from "@/components/portfolio/themes/types";

const categoryIcons: Record<string, React.ElementType> = {
  free: Sparkles,
  "web-developer": Code,
  "graphic-designer": Palette,
  photographer: Camera,
  "video-editor": Video,
  "digital-marketer": TrendingUp,
  official: Briefcase,
  personal: Heart,
  cosmic: Sparkles,
};

// Unique gradient per category — each theme gets its own personality
const categoryGradients: Record<string, string> = {
  "web-developer": "from-emerald-500 via-teal-500 to-cyan-600",
  "graphic-designer": "from-fuchsia-500 via-pink-500 to-rose-500",
  photographer: "from-amber-500 via-orange-500 to-red-500",
  "video-editor": "from-violet-600 via-purple-600 to-indigo-700",
  "digital-marketer": "from-sky-500 via-blue-500 to-indigo-600",
  official: "from-slate-700 via-slate-800 to-slate-900",
  personal: "from-rose-400 via-pink-400 to-fuchsia-400",
  cosmic: "from-indigo-600 via-purple-600 to-pink-500",
  free: "from-zinc-500 via-zinc-600 to-zinc-700",
};

// Unique pattern style for each category — gives every card a different vibe
const renderPattern = (category: string) => {
  switch (category) {
    case "web-developer":
      return (
        <div className="absolute inset-0 font-mono text-[9px] text-white/30 leading-[1.1] p-3 overflow-hidden whitespace-pre select-none">
          {"<html>\n  <body>\n    <div class=\n      \"hero\">\n      portfolio\n    </div>\n  </body>\n</html>"}
        </div>
      );
    case "graphic-designer":
      return (
        <>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/15 mix-blend-overlay" />
          <div className="absolute -top-4 right-4 w-16 h-16 rounded-full bg-white/20 mix-blend-overlay" />
          <div className="absolute bottom-6 right-8 w-10 h-10 rotate-45 bg-white/15" />
        </>
      );
    case "photographer":
      return (
        <div className="absolute inset-3 grid grid-cols-3 gap-1.5">
          {[0.3, 0.5, 0.2, 0.4, 0.6, 0.35].map((o, i) => (
            <div key={i} className="rounded bg-white" style={{ opacity: o }} />
          ))}
        </div>
      );
    case "video-editor":
      return (
        <>
          <div className="absolute inset-x-3 bottom-3 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full w-2/3 bg-white/70" />
          </div>
          <div className="absolute inset-x-3 top-3 flex gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex-1 bg-white/40" style={{ height: `${8 + (i * 7) % 22}px` }} />
            ))}
          </div>
        </>
      );
    case "digital-marketer":
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
          <polyline points="0,50 15,40 30,42 45,28 60,32 75,18 100,8" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
          <polyline points="0,55 15,48 30,50 45,40 60,44 75,30 100,22" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        </svg>
      );
    case "official":
      return (
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }} />
      );
    case "personal":
      return (
        <>
          <Heart className="absolute top-3 right-4 w-4 h-4 text-white/40 fill-white/30" />
          <Heart className="absolute bottom-5 left-5 w-6 h-6 text-white/30 fill-white/20" />
          <Star className="absolute top-1/2 left-1/3 w-3 h-3 text-white/40 fill-white/40" />
        </>
      );
    case "cosmic":
      return (
        <>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
                opacity: 0.4 + (i % 4) * 0.15,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </>
      );
    default:
      return (
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "12px 12px",
        }} />
      );
  }
};

export default function ThemeDemoSection() {
  const navigate = useNavigate();
  const groupedThemes = getGroupedThemes();
  const allPremiumThemes = groupedThemes
    .filter((g) => g.category !== "free")
    .flatMap((g) => g.themes);

  return (
    <section className="py-20 px-6 bg-muted/30 relative overflow-hidden">
      {/* ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">
            <span className="w-6 h-px bg-primary/40" /> Themes <span className="w-6 h-px bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] mb-4">
            Designed for <span className="gradient-text">every craft.</span>
          </h2>
          <p className="text-base text-muted-foreground">
            {allPremiumThemes.length + 1} themes — each crafted with a unique aesthetic for your profession.
          </p>
        </div>

        {/* Tier Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-xs">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Standard
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-500" /> Pro
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-purple-500/30">
            <Crown className="w-3 h-3 text-purple-500" /> Elite
          </span>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-12">
          {allPremiumThemes.map((theme, index) => {
            const CategoryIcon = categoryIcons[theme.category] ?? Sparkles;
            const gradient = categoryGradients[theme.category] ?? categoryGradients.free;

            return (
              <motion.div
                key={theme.value}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (index % 8) * 0.04, duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/demo/${theme.value}`)}
              >
                <div className="relative rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300">
                  {/* Tier Badge */}
                  {theme.tier !== "standard" && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <Badge
                        className={`${
                          theme.tier === "pro"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-purple-500 to-fuchsia-500"
                        } text-white border-0 text-[10px] capitalize px-2 py-0.5 shadow-lg`}
                      >
                        {theme.tier === "elite" && <Crown className="w-2.5 h-2.5 mr-1" />}
                        {theme.tier === "pro" && <Zap className="w-2.5 h-2.5 mr-1" />}
                        {theme.tier}
                      </Badge>
                    </div>
                  )}

                  {/* Preview canvas */}
                  <div className={`relative h-36 md:h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
                    {/* category-unique pattern */}
                    {renderPattern(theme.category)}

                    {/* mock window chrome */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>

                    {/* Floating icon disc */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 grid place-items-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center z-20">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-foreground text-xs font-semibold">
                        <Eye className="w-3.5 h-3.5" /> View Demo
                      </div>
                    </div>

                    {/* gloss */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                  </div>

                  {/* Theme Info */}
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm tracking-tight truncate">{theme.label}</h3>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{theme.description}</p>
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
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-primary/20 shadow-sm">
            <div className="flex -space-x-1">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-pink-400 to-red-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
            <span className="text-xs font-medium text-foreground/80">
              More Pro & Elite themes coming soon
            </span>
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="rounded-full gradient-primary hover:opacity-90 transition-opacity text-sm px-7 shadow-lg shadow-primary/30"
            onClick={() => navigate("/themes")}
          >
            View All Themes
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
