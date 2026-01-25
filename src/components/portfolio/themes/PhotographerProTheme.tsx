import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus,
  Briefcase, GraduationCap, Menu, X, Eye, Sparkles, Image, 
  Sun, Contrast, Palette, Layers, ZoomIn, Grid3X3
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Lightroom-style Histogram Component
const Histogram = () => {
  return (
    <div className="h-16 flex items-end gap-[1px] opacity-60">
      {[...Array(50)].map((_, i) => {
        const height = 20 + Math.sin(i * 0.3) * 40 + Math.random() * 30;
        return (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-neutral-400 to-white/80 rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: 0.5 + i * 0.01, duration: 0.3 }}
          />
        );
      })}
    </div>
  );
};

// Exposure Meter Component
const ExposureMeter = ({ value = 0 }: { value?: number }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-1">
        <span>-3</span>
        <div className="flex-1" />
        <span>0</span>
        <div className="flex-1" />
        <span>+3</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 flex">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-1 border-r border-neutral-700 last:border-0" />
          ))}
        </div>
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-amber-500 rounded-full"
          style={{ left: `calc(50% + ${value * 15}%)` }}
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default function PhotographerProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'develop' | 'library'>('library');
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Image slideshow
  useEffect(() => {
    if (allProjects.length > 0 && isLoaded) {
      const interval = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % allProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allProjects.length, isLoaded]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const adjustmentSliders = [
    { name: "Exposure", value: 0.2, icon: Sun },
    { name: "Contrast", value: 0.15, icon: Contrast },
    { name: "Highlights", value: -0.3, icon: Layers },
    { name: "Shadows", value: 0.4, icon: Palette },
    { name: "Clarity", value: 0.25, icon: Focus },
    { name: "Vibrance", value: 0.35, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Loading Screen - Lightroom Style */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Camera className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                className="text-xl font-light tracking-widest text-neutral-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                LIGHTROOM PRO
              </motion.h2>
              <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden mx-auto">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-3">Loading catalog...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Lightroom Top Bar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800"
        initial={{ y: -100 }}
        animate={{ y: isLoaded ? 0 : -100 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-4">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-300">{profile?.display_name || "Photographer"}</span>
              </div>
            )}
            
            {/* Mode Toggle */}
            <div className="hidden md:flex items-center gap-1 ml-6 bg-neutral-800 rounded-lg p-1">
              <button 
                onClick={() => setEditMode('library')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${editMode === 'library' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Library
              </button>
              <button 
                onClick={() => setEditMode('develop')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${editMode === 'develop' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Develop
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {["Home", "About", "Gallery", "Contact"].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "gallery" ? "works" : item.toLowerCase())}
                className="text-xs text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
              >
                {item}
              </button>
            ))}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-neutral-900 border-t border-neutral-800 px-4 py-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Gallery", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "gallery" ? "works" : item.toLowerCase())}
                  className="block w-full text-left py-2 text-neutral-400 text-sm"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Lightroom Develop Module */}
      <motion.section 
        id="hero" 
        className="min-h-screen pt-12 relative"
        style={{ opacity: heroOpacity }}
      >
        <div className="flex h-[calc(100vh-48px)]">
          {/* Left Panel - Adjustments */}
          <motion.div 
            className="hidden lg:flex w-72 bg-neutral-900 border-r border-neutral-800 flex-col"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: isLoaded ? 0 : -100, opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Histogram */}
            <div className="p-4 border-b border-neutral-800">
              <Histogram />
            </div>
            
            {/* Quick Develop */}
            <div className="p-4 border-b border-neutral-800">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Quick Develop</h4>
              <ExposureMeter value={0.2} />
            </div>

            {/* Adjustment Sliders */}
            <div className="p-4 flex-1 overflow-y-auto">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-4">Basic</h4>
              <div className="space-y-4">
                {adjustmentSliders.map((slider, i) => (
                  <motion.div 
                    key={slider.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-neutral-400">{slider.name}</span>
                      <span className="text-neutral-500">{slider.value > 0 ? '+' : ''}{Math.round(slider.value * 100)}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full relative">
                      <motion.div 
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ 
                          left: slider.value < 0 ? `${50 + slider.value * 50}%` : '50%',
                          width: `${Math.abs(slider.value) * 50}%`
                        }}
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-neutral-600" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Preview Area */}
          <div className="flex-1 relative bg-neutral-950 flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <AnimatePresence mode="wait">
              {allProjects[activeImage]?.image_url && (
                <motion.div
                  key={activeImage}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <img
                    src={allProjects[activeImage].image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ delay: 0.5 }}
              >
                <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <Aperture className="w-3 h-3 mr-2" />
                  Professional Photographer
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight mb-4 tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                transition={{ delay: 0.6 }}
              >
                <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 bg-clip-text text-transparent">
                  {profile?.display_name || "Photographer"}
                </span>
              </motion.h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-lg sm:text-xl text-neutral-400 mb-8 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}

              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ delay: 1 }}
              >
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg px-6"
                  onClick={() => scrollTo('works')}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
                {profile?.email && (
                  <Button 
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg"
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>

            {/* Image Strip - Bottom Filmstrip */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-800 p-3"
              initial={{ y: 100 }}
              animate={{ y: isLoaded ? 0 : 100 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allProjects.slice(0, 8).map((project, i) => (
                  <motion.button
                    key={project.id}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-amber-500' : 'border-transparent hover:border-neutral-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                        <Image className="w-4 h-4 text-neutral-600" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Metadata */}
          <motion.div 
            className="hidden xl:flex w-64 bg-neutral-900 border-l border-neutral-800 flex-col"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: isLoaded ? 0 : 100, opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 border-b border-neutral-800">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Metadata</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Camera</span>
                  <span className="text-neutral-300">Sony A7R V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Lens</span>
                  <span className="text-neutral-300">85mm f/1.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ISO</span>
                  <span className="text-neutral-300">100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Aperture</span>
                  <span className="text-neutral-300">f/1.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shutter</span>
                  <span className="text-neutral-300">1/250s</span>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="p-4 flex-1">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 8).map((skill) => (
                  <Badge 
                    key={skill.id}
                    variant="outline" 
                    className="text-[10px] border-neutral-700 text-neutral-400"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-800">
                  <Avatar className="w-full h-full rounded-xl">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-8xl bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Lightroom-style overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-3 border border-neutral-800">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Portrait.RAW</span>
                    <span className="text-amber-400">★ ★ ★ ★ ★</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="text-xs uppercase tracking-wider text-amber-400">About the Artist</span>
                </div>

                <h2 className="text-4xl font-light">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {profile?.display_name}
                  </span>
                </h2>

                {portfolio?.bio && (
                  <p className="text-lg text-neutral-400 leading-relaxed">{portfolio.bio}</p>
                )}

                <div className="flex flex-wrap gap-3">
                  {portfolio?.location && (
                    <span className="flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800 px-4 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {portfolio.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors">
                      <Mail className="w-4 h-4 text-amber-400" />
                      {profile.email}
                    </a>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex gap-3 pt-4">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-600 transition-all"
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 bg-neutral-950">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-light mb-4">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Technical Skills
                  </span>
                </h2>
                <p className="text-neutral-500">Expertise developed over years of professional work</p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 0.05}>
                  <motion.div 
                    className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 hover:border-amber-500/30 transition-colors"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-amber-400">{skill.proficiency || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    {skill.category && (
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-2 block">{skill.category}</span>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section - Grid View */}
      {projects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-light mb-2">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      Photo Gallery
                    </span>
                  </h2>
                  <p className="text-neutral-500">{projects.length} photos in collection</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-neutral-400">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <motion.div 
                    className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-800 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-neutral-600" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-medium text-sm mb-1">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <ZoomIn className="w-3 h-3 text-amber-400" />
                          <span className="text-xs text-neutral-400">View</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 sm:py-32 px-4 bg-neutral-950">
          <div className="max-w-4xl mx-auto">
            {experiences.length > 0 && (
              <div className="mb-20">
                <ScrollReveal>
                  <h2 className="text-2xl font-light mb-8 text-center">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      Experience
                    </span>
                  </h2>
                </ScrollReveal>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-medium text-lg">{exp.position}</h3>
                          <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </span>
                        </div>
                        <p className="text-neutral-400 mb-2">{exp.company}</p>
                        {exp.description && (
                          <p className="text-sm text-neutral-500">{exp.description}</p>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <ScrollReveal>
                  <h2 className="text-2xl font-light mb-8 text-center">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      Education
                    </span>
                  </h2>
                </ScrollReveal>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-medium text-lg">{edu.degree}</h3>
                          <span className="text-xs text-neutral-500">
                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                          </span>
                        </div>
                        <p className="text-neutral-400">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-neutral-500 mt-1">{edu.field_of_study}</p>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 bg-neutral-900">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-6">
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase tracking-wider text-amber-400">Get in Touch</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-light mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Let's Create Together
              </span>
            </h2>

            <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
              Available for commercial projects, editorial shoots, and creative collaborations.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-neutral-700 hover:bg-neutral-800 rounded-lg"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium text-neutral-300">{profile?.display_name}</span>
            </div>

            <p className="text-sm text-neutral-600">
              © {new Date().getFullYear()} All rights reserved
            </p>

            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-neutral-500" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
