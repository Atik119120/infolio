import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Briefcase, Palette, Camera, LayoutGrid,
  Sparkles, ArrowRight, Eye,
} from "lucide-react";
import { THEME_OPTIONS } from "@/components/portfolio/themes/types";

const themeIcons: Record<string, React.ElementType> = {
  freelancer: Briefcase,
  "creative-sidebar-pro": LayoutGrid,
  "dark-photographer": Camera,
  "creative-canvas": Palette,
};

const themeGradients: Record<string, string> = {
  freelancer: "from-blue-600 via-indigo-600 to-violet-700",
  "creative-sidebar-pro": "from-amber-400 via-yellow-500 to-orange-500",
  "dark-photographer": "from-zinc-700 via-zinc-800 to-black",
  "creative-canvas": "from-orange-500 via-amber-500 to-yellow-500",
};

const renderPattern = (value: string) => {
  switch (value) {
    case "freelancer":
      return (
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }} />
      );
    case "creative-sidebar-pro":
      return (
        <>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/15 mix-blend-overlay" />
          <div className="absolute -top-4 right-4 w-16 h-16 rounded-full bg-white/20 mix-blend-overlay" />
        </>
      );
    case "dark-photographer":
      return (
        <div className="absolute inset-3 grid grid-cols-3 gap-1.5">
          {[0.3, 0.5, 0.2, 0.4, 0.6, 0.35].map((o, i) => (
            <div key={i} className="rounded bg-white" style={{ opacity: o }} />
          ))}
        </div>
      );
    case "creative-canvas":
      return (
        <>
          <div className="absolute bottom-6 right-8 w-10 h-10 rotate-45 bg-white/15" />
          <div className="absolute top-6 left-10 w-8 h-8 rounded-full bg-white/20" />
        </>
      );
    default:
      return null;
  }
};

export default function ThemeDemoSection() {
  const navigate = useNavigate();
  const themes = THEME_OPTIONS;

  return (
    <section className="py-20 px-6 bg-muted/30 relative overflow-hidden">
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
            {themes.length} themes — each crafted with a unique aesthetic for your profession.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {themes.map((theme, index) => {
            const CategoryIcon = themeIcons[theme.value] ?? Sparkles;
            const gradient = themeGradients[theme.value] ?? "from-zinc-500 via-zinc-600 to-zinc-700";

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
                  <div className={`relative h-40 md:h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
                    {renderPattern(theme.value)}

                    <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    </div>

                    <div className="absolute bottom-3 left-3 z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 grid place-items-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center z-20">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-foreground text-xs font-semibold">
                        <Eye className="w-3.5 h-3.5" /> View Demo
                      </div>
                    </div>

                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm tracking-tight truncate">{theme.label}</h3>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{theme.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

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
