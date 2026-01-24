import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Sparkles, Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphicDesignerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const adobeApps = [
    { icon: "Ps", name: "Photoshop", color: "#31A8FF" },
    { icon: "Ai", name: "Illustrator", color: "#FF9A00" },
    { icon: "Id", name: "InDesign", color: "#FF3366" },
    { icon: "Xd", name: "XD", color: "#FF61F6" },
    { icon: "Ae", name: "After Effects", color: "#9999FF" },
    { icon: "Fg", name: "Figma", color: "#A259FF" },
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Design";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-hidden">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed w-6 h-6 rounded-full pointer-events-none z-[100] mix-blend-difference bg-white hidden md:block"
        animate={{ x: cursorPos.x - 12, y: cursorPos.y - 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#1a1a2e] flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="flex gap-3 mb-8 justify-center">
                {adobeApps.slice(0, 4).map((app, i) => (
                  <motion.div
                    key={app.icon}
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg"
                    style={{ backgroundColor: app.color }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                  >
                    {app.icon}
                  </motion.div>
                ))}
              </div>
              <motion.p 
                className="text-white/50 text-sm tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Loading Creative Studio...
              </motion.p>
              <motion.div 
                className="w-48 h-1 bg-white/10 rounded-full mt-6 mx-auto overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2d2d44]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-9 w-auto object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9A00] via-[#FF3366] to-[#A259FF] flex items-center justify-center">
                  <span className="font-black text-sm">Ds</span>
                </div>
              )}
              <span className="font-bold hidden sm:block">{profile?.display_name || "Designer"}</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-1">
              {["Home", "About", "Skills", "Work", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
              <ThemeToggle />
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-[#2d2d44] border-t border-white/10 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Work", "Contact"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="block w-full text-left py-3 text-white/70">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Creative Design Canvas */}
      <section id="hero" className="min-h-screen pt-14 relative flex items-center overflow-hidden">
        {/* Animated Canvas Grid */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(255,154,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,51,102,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }} />
          {/* Animated grid lines */}
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              backgroundPosition: ["0px 0px", "60px 60px"] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(162,89,255,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(162,89,255,0.2) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Floating Color Palettes & Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Paint Splatters */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`splat-${i}`}
              className="absolute rounded-full blur-xl"
              style={{
                width: `${100 + i * 30}px`,
                height: `${100 + i * 30}px`,
                background: `radial-gradient(circle, ${adobeApps[i % adobeApps.length].color}40, transparent)`,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.5 }}
              >
                <Badge className="mb-6 bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF] text-white border-0 px-4 py-1.5">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Creative Designer
                </Badge>
              </motion.div>

              <motion.div 
                className="mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-sm font-mono text-white/40 tracking-wider">{'<'}<span className="text-[#FF9A00]">Designer</span>{' '}name="</span>
              </motion.div>

              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF] bg-clip-text text-transparent">
                  {profile?.display_name || "Creative"}
                </span>
              </motion.h1>

              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm font-mono text-white/40">" <span className="text-[#A259FF]">/{'>'}</span></span>
              </motion.div>

              {portfolio?.headline && (
                <motion.p 
                  className="text-lg sm:text-xl text-white/50 mb-8 max-w-xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                {profile?.email && (
                  <Button 
                    size="lg" 
                    className="rounded-xl bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF] hover:shadow-xl hover:shadow-[#FF3366]/30 px-8"
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Let's Create
                    </a>
                  </Button>
                )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl border-white/20 hover:bg-white/5 hover:border-[#A259FF]/50 px-8"
                  onClick={() => scrollTo('works')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
              </motion.div>

              {/* Design Software Bar */}
              <motion.div 
                className="mt-10 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <span className="text-xs text-white/30 uppercase tracking-widest">Tools:</span>
                <div className="flex gap-2">
                  {adobeApps.map((app, i) => (
                    <motion.div
                      key={app.icon}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: app.color }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + i * 0.1 }}
                      whileHover={{ y: -5, boxShadow: `0 10px 30px -5px ${app.color}60` }}
                    >
                      {app.icon}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Interactive Design Canvas */}
            <motion.div 
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* Main Artboard */}
              <div className="relative">
                {/* Canvas Frame */}
                <motion.div 
                  className="relative bg-[#2d2d44] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/10"
                  whileHover={{ rotateY: 5, rotateX: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                >
                  {/* Artboard Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a2e] border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                    </div>
                    <span className="text-xs text-white/40 font-mono">portfolio.psd @ 100%</span>
                    <div className="flex gap-2">
                      {["Ps", "Ai"].map((icon, i) => (
                        <span key={icon} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: adobeApps[i].color }}>
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Canvas Content */}
                  <div className="aspect-square relative bg-gradient-to-br from-[#1a1a2e] to-[#0d0d18] p-6">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                      backgroundSize: "20px 20px"
                    }} />

                    {/* Floating Design Elements */}
                    <motion.div 
                      className="absolute top-8 left-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF9A00] to-[#FF3366] shadow-xl"
                      animate={{ rotate: [0, 10, 0], y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    
                    <motion.div 
                      className="absolute top-16 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-[#31A8FF] to-[#A259FF] shadow-xl"
                      animate={{ rotate: [0, -10, 0], y: [0, 10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />

                    <motion.div 
                      className="absolute bottom-16 left-16 w-16 h-16 bg-gradient-to-br from-[#FF3366] to-[#A259FF] shadow-xl"
                      style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Center Profile Circle */}
                    <motion.div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-gradient-to-br from-[#FF9A00] via-[#FF3366] to-[#A259FF] flex items-center justify-center shadow-2xl shadow-purple-500/30">
                        <Avatar className="w-28 h-28 border-4 border-[#1a1a2e]">
                          <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                          <AvatarFallback className="text-4xl bg-[#1a1a2e] text-white font-black">
                            {profile?.display_name?.[0]?.toUpperCase() || "D"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </motion.div>

                    {/* Decorative Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.line 
                        x1="10%" y1="30%" x2="40%" y2="50%" 
                        stroke="url(#gradient1)" strokeWidth="1" strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.5 }}
                      />
                      <motion.line 
                        x1="60%" y1="50%" x2="90%" y2="70%" 
                        stroke="url(#gradient2)" strokeWidth="1" strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.7 }}
                      />
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF9A00" />
                          <stop offset="100%" stopColor="#FF3366" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF3366" />
                          <stop offset="100%" stopColor="#A259FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Bottom Toolbar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-white/30">100%</span>
                      <div className="w-20 h-1 bg-white/10 rounded-full">
                        <div className="w-full h-full bg-gradient-to-r from-[#FF9A00] to-[#A259FF] rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">RGB</span>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs text-white/30">8-bit</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Color Palette */}
                <motion.div 
                  className="absolute -right-4 top-1/4 bg-[#2d2d44] rounded-xl p-2 shadow-xl border border-white/10 hidden lg:block"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="space-y-2">
                    {["#FF9A00", "#FF3366", "#A259FF", "#31A8FF", "#28CA41"].map((color, i) => (
                      <motion.div 
                        key={color}
                        className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        whileHover={{ x: 4 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Floating Layers Panel */}
                <motion.div 
                  className="absolute -left-4 bottom-1/4 bg-[#2d2d44] rounded-xl p-3 shadow-xl border border-white/10 hidden lg:block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="text-xs text-white/40 mb-2">Layers</div>
                  <div className="space-y-1.5">
                    {["Text", "Shapes", "BG"].map((layer, i) => (
                      <motion.div 
                        key={layer}
                        className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-xs text-white/60"
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <Eye className="w-3 h-3" />
                        {layer}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div 
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => scrollTo('bio')}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#FF9A00] to-[#A259FF]"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Artboard Style Profile */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2d2d44] rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                  <span className="ml-2 text-xs text-white/40">profile.psd - 100%</span>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#FF9A00]/20 to-[#A259FF]/20">
                  <Avatar className="w-full h-full rounded-xl">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-6xl sm:text-8xl bg-gradient-to-br from-[#FF9A00] to-[#A259FF] text-white rounded-xl">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">About Me</h2>
              <h3 className="text-3xl sm:text-4xl font-black mb-6">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-[#FF3366]" />
                    {portfolio.location}
                  </span>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4 text-[#31A8FF]" />
                    {profile.email}
                  </a>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link, i) => {
                    const Icon = getSocialIcon(link.platform);
                    const colors = ["#FF9A00", "#31A8FF", "#FF3366", "#A259FF"];
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: colors[i % colors.length] }}
                        whileHover={{ y: -3 }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#16162a]">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Expertise</h2>
              <h3 className="text-3xl sm:text-4xl font-black">Creative Tools</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => {
                const colors = ["#FF9A00", "#31A8FF", "#FF3366", "#A259FF", "#9999FF"];
                return (
                  <motion.div 
                    key={category}
                    className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-4" style={{ backgroundColor: colors[i % colors.length] }}>
                      {category[0]}
                    </div>
                    <h4 className="font-bold mb-3">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.id} variant="outline" className="text-xs border-white/10 text-white/60">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {education.length > 0 && (
              <div className="mb-16 sm:mb-20">
                <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#31A8FF] mb-4">Background</h2>
                  <h3 className="text-3xl sm:text-4xl font-black">Education</h3>
                </motion.div>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="bg-[#2d2d44] rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#31A8FF] flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{edu.degree}</h4>
                          <p className="text-[#31A8FF]">{edu.institution}</p>
                          {edu.field_of_study && <p className="text-white/40 text-sm mt-1">{edu.field_of_study}</p>}
                          <p className="text-white/30 text-xs mt-2">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <div>
                <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF3366] mb-4">Career</h2>
                  <h3 className="text-3xl sm:text-4xl font-black">Experience</h3>
                </motion.div>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="bg-[#2d2d44] rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FF3366] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{exp.position}</h4>
                          <p className="text-[#FF3366]">{exp.company}</p>
                          <p className="text-white/30 text-xs mt-2">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                          {exp.description && <p className="text-white/50 text-sm mt-3">{exp.description}</p>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Works Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#16162a]">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#A259FF] mb-4">Portfolio</h2>
              <h3 className="text-3xl sm:text-4xl font-black">Featured Work</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#2d2d44]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF9A00]/20 to-[#A259FF]/20 flex items-center justify-center">
                        <Palette className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent flex items-end p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                  >
                    <div>
                      {project.featured && (
                        <Badge className="mb-2 bg-gradient-to-r from-[#FF9A00] to-[#FF3366] border-0 text-xs">Featured</Badge>
                      )}
                      <h4 className="text-lg font-bold mb-1">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                      )}
                      {(project.live_url || project.github_url) && (
                        <div className="flex gap-3 mt-3">
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">Let's Create Something Amazing</h3>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Have a project in mind? Let's bring your vision to life with stunning designs.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#FF9A00] to-[#FF3366] hover:shadow-lg hover:shadow-[#FF3366]/30"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Me
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/40">
              {portfolio?.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {portfolio.location}
                </span>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-[#16162a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9A00] to-[#A259FF] flex items-center justify-center">
                  <span className="font-bold text-xs">Ds</span>
                </div>
              )}
              <span className="text-sm text-white/40">{profile?.display_name}</span>
            </div>

            {/* Footer Nav */}
            <div className="flex flex-wrap justify-center gap-6">
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm text-white/30 hover:text-[#A259FF] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
