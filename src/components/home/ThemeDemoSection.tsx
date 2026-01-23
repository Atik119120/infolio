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
  Eye
} from "lucide-react";

const themes = [
  { 
    id: "web-developer", 
    name: "Web Developer", 
    icon: Code, 
    color: "from-green-500 to-emerald-600",
    preview: "Terminal & VS Code inspired"
  },
  { 
    id: "graphic-designer", 
    name: "Graphic Designer", 
    icon: Palette, 
    color: "from-pink-500 to-rose-600",
    preview: "Adobe Creative Suite style"
  },
  { 
    id: "photographer", 
    name: "Photographer", 
    icon: Camera, 
    color: "from-amber-500 to-orange-600",
    preview: "Camera viewfinder aesthetic"
  },
  { 
    id: "video-editor", 
    name: "Video Editor", 
    icon: Video, 
    color: "from-purple-500 to-violet-600",
    preview: "Premiere Pro timeline"
  },
  { 
    id: "digital-marketer", 
    name: "Digital Marketer", 
    icon: TrendingUp, 
    color: "from-blue-500 to-cyan-600",
    preview: "Dashboard & metrics style"
  },
  { 
    id: "official", 
    name: "Official", 
    icon: Briefcase, 
    color: "from-slate-600 to-slate-800",
    preview: "Apple minimalist corporate"
  },
  { 
    id: "personal", 
    name: "Personal", 
    icon: Heart, 
    color: "from-rose-400 to-pink-500",
    preview: "Story-driven polaroid"
  },
  { 
    id: "cosmic", 
    name: "Cosmic", 
    icon: Sparkles, 
    color: "from-indigo-600 via-purple-600 to-pink-500",
    preview: "Luxury space universe"
  },
];

export default function ThemeDemoSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Premium Themes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our <span className="gradient-text">Theme Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each theme is crafted for a specific profession with unique animations and layouts
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/demo/${theme.id}`)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-card border shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                {/* Theme Preview Header */}
                <div className={`h-28 md:h-36 bg-gradient-to-br ${theme.color} relative overflow-hidden`}>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/40" />
                  <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/30" />
                  <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-white/20" />
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <theme.icon className="w-12 h-12 md:w-16 md:h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
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
                  <h3 className="font-semibold text-sm md:text-base mb-1">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{theme.preview}</p>
                </div>
              </div>
            </motion.div>
          ))}
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
              More themes coming soon...
            </span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Start Building with Any Theme
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
