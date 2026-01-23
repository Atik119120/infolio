import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Eye, 
  Code, 
  Camera, 
  Video, 
  TrendingUp, 
  Briefcase, 
  Heart,
  Sparkles,
  ExternalLink 
} from "lucide-react";
import { motion } from "framer-motion";

const themes = [
  { 
    id: "web-developer", 
    name: "Web Developer", 
    icon: Code, 
    color: "from-green-500 to-emerald-600",
    description: "VS Code-inspired terminal aesthetic"
  },
  { 
    id: "graphic-designer", 
    name: "Graphic Designer", 
    icon: Palette, 
    color: "from-pink-500 to-rose-600",
    description: "Adobe Creative Suite inspired"
  },
  { 
    id: "photographer", 
    name: "Photographer", 
    icon: Camera, 
    color: "from-amber-500 to-orange-600",
    description: "Camera viewfinder frames"
  },
  { 
    id: "video-editor", 
    name: "Video Editor", 
    icon: Video, 
    color: "from-purple-500 to-violet-600",
    description: "Premiere Pro timeline style"
  },
  { 
    id: "digital-marketer", 
    name: "Digital Marketer", 
    icon: TrendingUp, 
    color: "from-blue-500 to-cyan-600",
    description: "Dashboard metrics aesthetic"
  },
  { 
    id: "official", 
    name: "Official", 
    icon: Briefcase, 
    color: "from-slate-600 to-slate-800",
    description: "Apple-style minimalist corporate"
  },
  { 
    id: "personal", 
    name: "Personal", 
    icon: Heart, 
    color: "from-rose-400 to-pink-500",
    description: "Story-driven polaroid style"
  },
  { 
    id: "cosmic", 
    name: "Cosmic", 
    icon: Sparkles, 
    color: "from-indigo-600 via-purple-600 to-pink-500",
    description: "Luxury space universe theme"
  },
];

interface ThemeUsage {
  theme: string;
  count: number;
}

export default function AdminThemes() {
  const navigate = useNavigate();
  const [themeUsage, setThemeUsage] = useState<ThemeUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemeUsage();
  }, []);

  const fetchThemeUsage = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("theme");

      if (error) throw error;

      // Count theme usage
      const usageMap: Record<string, number> = {};
      (data || []).forEach((p) => {
        const theme = p.theme || "default";
        usageMap[theme] = (usageMap[theme] || 0) + 1;
      });

      const usage = Object.entries(usageMap).map(([theme, count]) => ({
        theme,
        count,
      }));

      setThemeUsage(usage);
    } catch (error) {
      console.error("Error fetching theme usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeCount = (themeId: string) => {
    return themeUsage.find((t) => t.theme === themeId)?.count || 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Theme Management</h2>
        <p className="text-muted-foreground">
          View and manage available portfolio themes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className={`h-24 bg-gradient-to-br ${theme.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <theme.icon className="w-12 h-12 text-white/80" />
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  <Badge variant="secondary">
                    {loading ? "..." : getThemeCount(theme.id)} users
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {theme.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`/demo/${theme.id}`, "_blank")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Theme Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Popularity</CardTitle>
          <CardDescription>
            Distribution of themes across all portfolios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {themes.map((theme) => {
              const count = getThemeCount(theme.id);
              const total = themeUsage.reduce((sum, t) => sum + t.count, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={theme.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${theme.color}`} />
                      <span>{theme.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${theme.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
