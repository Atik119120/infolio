import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, TrendingUp, Menu, X, Crown, Sparkles, Star, Award, Target, BarChart3, LineChart, PieChart, ArrowUpRight, Users, Zap, MousePointer, DollarSign } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

// Dashboard-inspired colors
const dashColors = {
  bg: "#0c0c0c",
  surface: "#141414",
  card: "#1a1a1a",
  border: "#262626",
  text: "#ffffff",
  muted: "#888888",
  emerald: "#10b981",
  cyan: "#06b6d4",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  red: "#ef4444",
};

// Animated number counter
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
};

// Live chart component
const LiveChart = () => {
  const [data, setData] = useState([35, 45, 60, 45, 55, 70, 65, 80, 75, 85, 90, 85]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 30) + 70];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-32 flex items-end gap-1">
      {data.map((value, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t"
          style={{ 
            background: i === data.length - 1 
              ? `linear-gradient(to top, ${dashColors.emerald}, ${dashColors.cyan})` 
              : `linear-gradient(to top, ${dashColors.emerald}40, ${dashColors.cyan}40)`,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Metric card with live updates
const MetricCard = ({ icon: Icon, label, value, change, color }: { 
  icon: any; 
  label: string; 
  value: string; 
  change: string; 
  color: string;
}) => {
  const isPositive = change.startsWith("+");
  
  return (
    <motion.div 
      className="bg-[#1a1a1a] rounded-xl p-4 border border-[#262626] hover:border-[#363636] transition-colors"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          <ArrowUpRight className={`w-3 h-3 ${!isPositive && 'rotate-180'}`} />
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-[#888]">{label}</p>
    </motion.div>
  );
};

// Funnel visualization
const FunnelChart = () => {
  const stages = [
    { label: "Impressions", value: 100000, color: dashColors.cyan },
    { label: "Clicks", value: 25000, color: dashColors.purple },
    { label: "Leads", value: 5000, color: dashColors.amber },
    { label: "Conversions", value: 1250, color: dashColors.emerald },
  ];

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <motion.div 
          key={stage.label}
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-24 text-right">
              <span className="text-xs text-[#888]">{stage.label}</span>
            </div>
            <div className="flex-1 h-10 bg-[#1a1a1a] rounded-lg overflow-hidden">
              <motion.div 
                className="h-full flex items-center justify-end px-3"
                style={{ backgroundColor: stage.color, width: `${(stage.value / 100000) * 100}%` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(stage.value / 100000) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
              >
                <span className="text-sm font-bold text-black">{stage.value.toLocaleString()}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Scroll reveal
const DashReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function DigitalMarketerEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(1247);
  const allProjects = [...projects.filter(p => p.featured), ...projects.filter(p => !p.featured)];

  useEffect(() => { 
    window.scrollTo(0, 0); 
    setTimeout(() => setIsLoaded(true), 1500); 
  }, []);

  // Simulate live visitor count
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => { 
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); 
    setMenuOpen(false); 
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: dashColors.bg }}>
      {/* Loading - Dashboard boot animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#0c0c0c] flex flex-col items-center justify-center" 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6">
              <motion.div 
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <BarChart3 className="w-8 h-8 text-black" />
              </motion.div>
              <motion.div 
                className="absolute -inset-2 rounded-2xl border-2 border-emerald-500/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="text-sm text-[#888] mb-4">Initializing Dashboard...</p>
            <div className="w-48 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Dashboard header */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backgroundColor: `${dashColors.bg}e6`, borderColor: dashColors.border }}
        initial={{ y: -80 }} 
        animate={{ y: isLoaded ? 0 : -80 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{profile?.display_name}</p>
              <p className="text-[10px] text-emerald-400">Growth Analytics</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1">
            {["Dashboard", "About", "Analytics", "Results", "Contact"].map((item, i) => (
              <button
                key={item}
                onClick={() => scrollTo(
                  item.toLowerCase() === "dashboard" ? "hero" : 
                  item.toLowerCase() === "analytics" ? "skills" : 
                  item.toLowerCase() === "results" ? "works" : 
                  item.toLowerCase() === "about" ? "bio" : 
                  item.toLowerCase()
                )}
                className="px-4 py-2 rounded-md text-xs font-medium transition-colors hover:bg-[#262626]"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-lg border border-[#262626]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#888]">{liveVisitors.toLocaleString()} visitors</span>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden border-t px-4 py-4"
              style={{ backgroundColor: dashColors.surface, borderColor: dashColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Dashboard", "About", "Analytics", "Results", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(
                    item.toLowerCase() === "dashboard" ? "hero" : 
                    item.toLowerCase() === "analytics" ? "skills" : 
                    item.toLowerCase() === "results" ? "works" : 
                    item.toLowerCase() === "about" ? "bio" : 
                    item.toLowerCase()
                  )}
                  className="block w-full text-left py-3 text-sm"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Live Dashboard */}
      <section id="hero" className="min-h-screen pt-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto py-12">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Zap className="w-3 h-3 mr-1" />
                Growth Expert
              </Badge>
              <div className="flex items-center gap-2 text-xs text-[#888]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Dashboard
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-[#888]">Hi, I'm </span>
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {profile?.display_name || "Growth Marketer"}
              </span>
            </h1>
            
            {portfolio?.headline && (
              <p className="text-lg sm:text-xl text-[#888] max-w-2xl">
                {portfolio.headline}
              </p>
            )}
          </motion.div>

          {/* Metrics Grid */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MetricCard icon={DollarSign} label="Revenue Generated" value="$12.5M+" change="+127%" color={dashColors.emerald} />
            <MetricCard icon={Users} label="Leads Generated" value="250K+" change="+89%" color={dashColors.cyan} />
            <MetricCard icon={MousePointer} label="Conversion Rate" value="8.5%" change="+2.3%" color={dashColors.purple} />
            <MetricCard icon={Target} label="ROAS Average" value="5.2x" change="+45%" color={dashColors.amber} />
          </motion.div>

          {/* Main Dashboard Grid */}
          <motion.div 
            className="grid lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-[#141414] rounded-xl p-6 border border-[#262626]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Revenue Growth</h3>
                  <p className="text-sm text-[#888]">Last 12 months performance</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+127%</span>
                </div>
              </div>
              <LiveChart />
            </div>

            {/* Profile Card */}
            <div className="bg-[#141414] rounded-xl p-6 border border-[#262626]">
              <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-emerald-500/20">
                <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                  {profile?.display_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center mb-4">
                <h3 className="font-semibold">{profile?.display_name}</h3>
                {portfolio?.location && (
                  <p className="text-sm text-[#888] flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {portfolio.location}
                  </p>
                )}
              </div>
              
              {socialLinks.length > 0 && (
                <div className="flex justify-center gap-2 mb-4">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}

              {profile?.email && (
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-medium rounded-lg"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-20 px-4 sm:px-6" style={{ backgroundColor: dashColors.surface }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <DashReveal>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Crown className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">About Me</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Driving <span className="text-emerald-400">Measurable</span> Growth
                </h2>
                
                {portfolio?.bio && (
                  <p className="text-lg text-[#888] leading-relaxed">
                    {portfolio.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-medium rounded-lg"
                    onClick={() => scrollTo('works')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Case Studies
                  </Button>
                </div>
              </div>
            </DashReveal>

            <DashReveal delay={0.2}>
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#262626]">
                <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
                <FunnelChart />
              </div>
            </DashReveal>
          </div>
        </div>
      </section>

      {/* Skills Section - Analytics Dashboard */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 px-4 sm:px-6" style={{ backgroundColor: dashColors.bg }}>
          <div className="max-w-6xl mx-auto">
            <DashReveal>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
                  <LineChart className="w-3 h-3 mr-1" />
                  Skill Analytics
                </Badge>
                <h2 className="text-3xl font-bold">Marketing Expertise</h2>
              </div>
            </DashReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, i) => (
                <DashReveal key={skill.id} delay={i * 0.05}>
                  <div className="bg-[#141414] rounded-xl p-5 border border-[#262626] hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm font-bold text-emerald-400">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </DashReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects - Case Studies */}
      {projects.length > 0 && (
        <section id="works" className="py-20 px-4 sm:px-6" style={{ backgroundColor: dashColors.surface }}>
          <div className="max-w-6xl mx-auto">
            <DashReveal>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
                  <Target className="w-3 h-3 mr-1" />
                  Case Studies
                </Badge>
                <h2 className="text-3xl font-bold">Campaign Results</h2>
              </div>
            </DashReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <DashReveal key={project.id} delay={i * 0.1}>
                  <motion.div 
                    className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#262626] hover:border-emerald-500/30 transition-all"
                    whileHover={{ y: -8 }}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {project.image_url ? (
                        <img src={project.image_url} className="w-full h-full object-cover" alt={project.title} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                          <BarChart3 className="w-12 h-12 text-emerald-500/50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded">
                        +{Math.floor(Math.random() * 200) + 100}% ROI
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-[#888] line-clamp-2">{project.description}</p>
                      )}
                    </div>
                  </motion.div>
                </DashReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-4 sm:px-6" style={{ backgroundColor: dashColors.bg }}>
        <div className="max-w-2xl mx-auto text-center">
          <DashReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Ready to Scale?</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Let's Grow Your Business
            </h2>
            <p className="text-[#888] mb-8">
              Book a free strategy call and discover how we can drive measurable results for your brand.
            </p>
            
            {profile?.email && (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-medium rounded-lg px-8"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Book a Call
                </a>
              </Button>
            )}
          </DashReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: dashColors.border }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-[#888] text-sm mb-2">{profile?.display_name} • Growth Marketing Expert</p>
          <p className="text-[#555] text-xs">© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
