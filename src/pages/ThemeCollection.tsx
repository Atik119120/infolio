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
  Star
} from "lucide-react";

interface Theme {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  preview: string;
  isPremium: boolean;
  price: number;
}

const themes: Theme[] = [
  { 
    id: "simple", 
    name: "Simple", 
    icon: Star, 
    color: "from-gray-500 to-gray-700",
    preview: "Clean & minimal design",
    isPremium: false,
    price: 0
  },
  { 
    id: "web-developer", 
    name: "Web Developer", 
    icon: Code, 
    color: "from-green-500 to-emerald-600",
    preview: "Terminal & VS Code inspired",
    isPremium: true,
    price: 200
  },
  { 
    id: "graphic-designer", 
    name: "Graphic Designer", 
    icon: Palette, 
    color: "from-pink-500 to-rose-600",
    preview: "Adobe Creative Suite style",
    isPremium: true,
    price: 200
  },
  { 
    id: "photographer", 
    name: "Photographer", 
    icon: Camera, 
    color: "from-amber-500 to-orange-600",
    preview: "Camera viewfinder aesthetic",
    isPremium: true,
    price: 200
  },
  { 
    id: "video-editor", 
    name: "Video Editor", 
    icon: Video, 
    color: "from-purple-500 to-violet-600",
    preview: "Premiere Pro timeline",
    isPremium: true,
    price: 200
  },
  { 
    id: "digital-marketer", 
    name: "Digital Marketer", 
    icon: TrendingUp, 
    color: "from-blue-500 to-cyan-600",
    preview: "Dashboard & metrics style",
    isPremium: true,
    price: 200
  },
  { 
    id: "official", 
    name: "Official", 
    icon: Briefcase, 
    color: "from-slate-600 to-slate-800",
    preview: "Apple minimalist corporate",
    isPremium: true,
    price: 200
  },
  { 
    id: "personal", 
    name: "Personal", 
    icon: Heart, 
    color: "from-rose-400 to-pink-500",
    preview: "Story-driven polaroid",
    isPremium: true,
    price: 200
  },
  { 
    id: "cosmic", 
    name: "Cosmic", 
    icon: Sparkles, 
    color: "from-indigo-600 via-purple-600 to-pink-500",
    preview: "Luxury space universe",
    isPremium: true,
    price: 200
  },
];

export default function ThemeCollection() {
  const navigate = useNavigate();
  
  const freeTheme = themes.find(t => !t.isPremium);
  const premiumThemes = themes.filter(t => t.isPremium);

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
            9 Premium Themes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect <span className="gradient-text">Theme</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free or unlock premium themes for just ৳200
          </p>
        </div>
      </section>

      {/* Free Theme Section */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-1.5">
              🎁 Free Theme
            </Badge>
          </div>
          
          {freeTheme && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Theme Preview */}
                    <div className={`h-48 md:h-auto md:w-1/3 bg-gradient-to-br ${freeTheme.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <freeTheme.icon className="w-20 h-20 text-white/80" />
                      </div>
                    </div>
                    
                    {/* Theme Info */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-2xl font-bold">{freeTheme.name} Theme</h2>
                        <Badge className="bg-primary/20 text-primary">Free Forever</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{freeTheme.preview}</p>
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
                          onClick={() => navigate(`/demo/${freeTheme.id}`)}
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
          )}
        </div>
      </section>

      {/* Premium Themes Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="text-lg px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Crown className="w-4 h-4 mr-1.5" />
              Premium Themes - ৳200 each
            </Badge>
          </div>
          
          <div className="bg-muted/50 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                One-time payment
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                Admin approval required
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Lifetime access
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {premiumThemes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/demo/${theme.id}`)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                  {/* Premium Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      ৳200
                    </Badge>
                  </div>

                  {/* Theme Preview Header */}
                  <div className={`h-32 md:h-40 bg-gradient-to-br ${theme.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/40" />
                    <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-white/30" />
                    <div className="absolute top-4 left-12 w-2 h-2 rounded-full bg-white/20" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <theme.icon className="w-14 h-14 md:w-16 md:h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
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
                    <h3 className="font-semibold text-sm md:text-base mb-1">{theme.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{theme.preview}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
                  <h4 className="font-semibold mb-1">Pay ৳200</h4>
                  <p className="text-sm text-muted-foreground">One-time payment via bKash/Nagad</p>
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
