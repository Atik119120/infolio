import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus,
  Briefcase, GraduationCap, Menu, X, Sun, Moon, Contrast, 
  Palette, Layers, Sparkles, RotateCcw, ZoomIn, ZoomOut,
  Grid, List, Star, ChevronLeft, ChevronRight, Download,
  Settings, SlidersHorizontal, Image as ImageIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Lightroom-style Histogram
const Histogram = ({ className = "" }: { className?: string }) => {
  const bars = useRef([...Array(64)].map(() => ({
    r: 20 + Math.random() * 60,
    g: 20 + Math.random() * 60,
    b: 20 + Math.random() * 60,
  }))).current;

  return (
    <div className={`h-20 relative ${className}`}>
      {/* RGB Channels */}
      <div className="absolute inset-0 flex items-end gap-px opacity-60">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-red-500/50 to-red-400/30 rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${bar.r}%` }}
            transition={{ delay: 0.5 + i * 0.01 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-end gap-px opacity-50">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-green-500/50 to-green-400/30 rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${bar.g}%` }}
            transition={{ delay: 0.6 + i * 0.01 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-end gap-px opacity-40">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-400/30 rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${bar.b}%` }}
            transition={{ delay: 0.7 + i * 0.01 }}
          />
        ))}
      </div>
    </div>
  );
};

// Adjustment Slider Component
const AdjustmentSlider = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  min = -100,
  max = 100 
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  icon?: React.ElementType;
  min?: number;
  max?: number;
}) => {
  return (
    <div className="group">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3 h-3 text-neutral-500" />}
          <span className="text-neutral-400">{label}</span>
        </div>
        <span className="text-neutral-500 tabular-nums">
          {value > 0 ? "+" : ""}{value}
        </span>
      </div>
      <div className="relative h-1 bg-neutral-800 rounded-full">
        <div 
          className="absolute top-0 h-full bg-blue-500 rounded-full transition-all"
          style={{ 
            left: value < 0 ? `${50 + value / 2}%` : '50%',
            width: `${Math.abs(value) / 2}%`
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-2 bg-neutral-600" />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-neutral-700 cursor-pointer"
          style={{ left: `${(value - min) / (max - min) * 100}%`, marginLeft: '-6px' }}
          whileHover={{ scale: 1.2 }}
        />
      </div>
    </div>
  );
};

// Film Strip Component
const FilmStrip = ({ 
  images, 
  activeIndex, 
  onSelect,
  className = ""
}: { 
  images: { id: string; url: string | null; title: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div className={`bg-neutral-900 border-t border-neutral-800 ${className}`}>
      {/* Film perforations - top */}
      <div className="flex justify-between px-2 py-1">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-2 h-1 bg-neutral-700 rounded-sm" />
        ))}
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto py-2 px-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            onClick={() => onSelect(i)}
            className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
              activeIndex === i 
                ? 'border-blue-500 ring-1 ring-blue-500/50' 
                : 'border-transparent hover:border-neutral-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {img.url ? (
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-neutral-600" />
              </div>
            )}
            {activeIndex === i && (
              <motion.div 
                className="absolute inset-0 border-2 border-blue-500 rounded"
                layoutId="activeFrame"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Film perforations - bottom */}
      <div className="flex justify-between px-2 py-1">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-2 h-1 bg-neutral-700 rounded-sm" />
        ))}
      </div>
    </div>
  );
};

export default function PhotographerProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'loupe'>('loupe');
  const [adjustments, setAdjustments] = useState({
    exposure: 0,
    contrast: 10,
    highlights: -15,
    shadows: 20,
    clarity: 25,
    vibrance: 15,
  });
  const [zoom, setZoom] = useState(100);
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  const currentProject = allProjects[activeImage];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handlePrev = () => setActiveImage(prev => prev > 0 ? prev - 1 : allProjects.length - 1);
  const handleNext = () => setActiveImage(prev => prev < allProjects.length - 1 ? prev + 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Loading Screen - Import Progress */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-neutral-900 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-80">
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Aperture className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-medium">Lightroom Pro</h2>
                  <p className="text-xs text-neutral-500">Loading catalog...</p>
                </div>
              </div>
              <div className="space-y-2">
                <motion.div 
                  className="h-1 bg-neutral-800 rounded-full overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                  />
                </motion.div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Importing photos...</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {allProjects.length} items
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightroom Top Bar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-neutral-800 border-b border-neutral-700"
        initial={{ y: -60 }}
        animate={{ y: isLoaded ? 0 : -60 }}
      >
        <div className="flex items-center justify-between h-10 px-3">
          <div className="flex items-center gap-3">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-6 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                  <Aperture className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-neutral-300 hidden sm:block">
                  {profile?.display_name || "Lightroom Pro"}
                </span>
              </div>
            )}
            
            <div className="hidden md:flex items-center gap-1 ml-4 text-xs">
              {["Library", "Develop", "Map", "Book", "Print"].map((tab, i) => (
                <button 
                  key={tab}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    i === 1 ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-4 mr-4">
              {["Home", "Portfolio", "About", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(
                    item === "Home" ? "hero" : 
                    item === "Portfolio" ? "works" : 
                    item === "About" ? "bio" : "contact"
                  )}
                  className="text-xs text-neutral-400 hover:text-blue-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
            
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 hover:bg-neutral-700 rounded">
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-neutral-800 border-t border-neutral-700 px-3 py-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "Portfolio", "About", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(
                    item === "Home" ? "hero" : 
                    item === "Portfolio" ? "works" : 
                    item === "About" ? "bio" : "contact"
                  )}
                  className="block w-full text-left py-2 text-neutral-400 text-sm hover:text-white"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero - Lightroom Develop Module */}
      <section id="hero" className="min-h-screen pt-10 flex">
        {/* Left Panel - Navigator & Adjustments */}
        <motion.aside 
          className="hidden lg:flex w-72 bg-neutral-850 border-r border-neutral-700 flex-col flex-shrink-0"
          style={{ backgroundColor: '#1a1a1a' }}
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: isLoaded ? 0 : -280, opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Navigator Preview */}
          <div className="p-3 border-b border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500">Navigator</span>
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <button className="hover:text-white">FIT</button>
                <span className="text-neutral-600">|</span>
                <button className="hover:text-white">FILL</button>
                <span className="text-neutral-600">|</span>
                <button className="text-white">1:1</button>
              </div>
            </div>
            <div className="aspect-[4/3] bg-neutral-800 rounded overflow-hidden relative">
              {currentProject?.image_url && (
                <img 
                  src={currentProject.image_url} 
                  alt="Navigator" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-2 border border-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Histogram */}
          <div className="p-3 border-b border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500">Histogram</span>
            </div>
            <Histogram />
          </div>

          {/* Basic Panel */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-400 uppercase tracking-wider">Basic</span>
              <button className="text-neutral-500 hover:text-white">
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-5">
              <AdjustmentSlider 
                label="Exposure" 
                value={adjustments.exposure} 
                onChange={(v) => setAdjustments(prev => ({ ...prev, exposure: v }))}
                icon={Sun}
              />
              <AdjustmentSlider 
                label="Contrast" 
                value={adjustments.contrast} 
                onChange={(v) => setAdjustments(prev => ({ ...prev, contrast: v }))}
                icon={Contrast}
              />
              <AdjustmentSlider 
                label="Highlights" 
                value={adjustments.highlights} 
                onChange={(v) => setAdjustments(prev => ({ ...prev, highlights: v }))}
                icon={Layers}
              />
              <AdjustmentSlider 
                label="Shadows" 
                value={adjustments.shadows} 
                onChange={(v) => setAdjustments(prev => ({ ...prev, shadows: v }))}
                icon={Moon}
              />
              <AdjustmentSlider 
                label="Clarity" 
                value={adjustments.clarity} 
                onChange={(v) => setAdjustments(prev => ({ ...prev, clarity: v }))}
                icon={Focus}
              />
              <AdjustmentSlider 
                label="Vibrance" 
                value={adjustments.vibrance} 
                onChange={(v) => setAdjustments(prev => ({ ...prev, vibrance: v }))}
                icon={Sparkles}
              />
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-neutral-950">
          {/* Toolbar */}
          <motion.div 
            className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('loupe')}
                className={`p-1.5 rounded ${viewMode === 'loupe' ? 'bg-neutral-700' : 'hover:bg-neutral-700/50'}`}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-neutral-700' : 'hover:bg-neutral-700/50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span>{currentProject?.title || "Untitled"}</span>
              <span className="text-neutral-600">|</span>
              <span>{activeImage + 1} / {allProjects.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white">
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="text-xs text-neutral-500 w-12 text-center">{zoom}%</span>
              <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white">
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Image Preview */}
          <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {currentProject?.image_url ? (
                <motion.div
                  key={activeImage}
                  className="relative max-w-full max-h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={currentProject.image_url} 
                    alt={currentProject.title}
                    className="max-w-full max-h-[calc(100vh-200px)] object-contain shadow-2xl"
                    style={{
                      filter: `
                        brightness(${1 + adjustments.exposure / 100}) 
                        contrast(${1 + adjustments.contrast / 100}) 
                        saturate(${1 + adjustments.vibrance / 100})
                      `
                    }}
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded text-xs">
                    <p className="text-white font-medium">{currentProject.title}</p>
                    {currentProject.description && (
                      <p className="text-neutral-400 mt-0.5">{currentProject.description}</p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-neutral-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No image selected</p>
                </div>
              )}
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-800/80 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-800/80 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Film Strip */}
          <FilmStrip 
            images={allProjects.map(p => ({ id: p.id, url: p.image_url, title: p.title }))}
            activeIndex={activeImage}
            onSelect={setActiveImage}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-24 px-6 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-light text-white">About the Photographer</h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-12">
            <ScrollReveal delay={0.1}>
              <div className="lg:col-span-1">
                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name || ''} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-16 h-16 text-neutral-600" />
                    </div>
                  )}
                </div>
                
                {/* Quick Info */}
                <div className="mt-6 space-y-3">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {portfolio.location}
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <Mail className="w-4 h-4 text-blue-400" />
                      {profile.email}
                    </div>
                  )}
                  {portfolio?.phone && (
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <Phone className="w-4 h-4 text-blue-400" />
                      {portfolio.phone}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex gap-2 mt-6">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-neutral-800 hover:bg-blue-600 rounded flex items-center justify-center transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-light text-white mb-2">
                  {profile?.display_name || "Photographer"}
                </h3>
                {portfolio?.headline && (
                  <p className="text-blue-400 mb-6">{portfolio.headline}</p>
                )}
                {portfolio?.bio && (
                  <p className="text-neutral-400 leading-relaxed text-lg mb-8">
                    {portfolio.bio}
                  </p>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div>
                    <h4 className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          variant="outline" 
                          className="border-neutral-700 text-neutral-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section id="works" className="py-24 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-light text-white">Photo Library</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{allProjects.length} Photos</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProjects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.05}>
                <motion.div 
                  className="group relative aspect-square bg-neutral-900 rounded-lg overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveImage(i);
                    scrollTo('hero');
                  }}
                >
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-neutral-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-medium text-white truncate">{project.title}</p>
                      {project.featured && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-yellow-400">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-6 bg-neutral-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {experiences.length > 0 && (
                <ScrollReveal>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-light text-white">Experience</h2>
                  </div>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-neutral-700 pl-4 hover:border-blue-500 transition-colors">
                        <h4 className="font-medium text-white">{exp.position}</h4>
                        <p className="text-blue-400 text-sm">{exp.company}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-neutral-400 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {education.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-light text-white">Education</h2>
                  </div>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-neutral-700 pl-4 hover:border-blue-500 transition-colors">
                        <h4 className="font-medium text-white">{edu.degree}</h4>
                        <p className="text-blue-400 text-sm">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-xs text-neutral-500">{edu.field_of_study}</p>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-neutral-950">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-2 mb-6">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Available for Projects</span>
            </div>
            <h2 className="text-4xl font-light text-white mb-4">Let's Create Together</h2>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
              Ready to capture your vision? Get in touch to discuss your photography needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              )}
              {portfolio?.website && (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-neutral-700 text-white hover:bg-neutral-800"
                  asChild
                >
                  <a href={portfolio.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Aperture className="w-3 h-3" />
            </div>
            <span className="text-sm text-neutral-500">
              © {new Date().getFullYear()} {profile?.display_name}. Lightroom Pro Theme.
            </span>
          </div>
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
                    className="text-neutral-500 hover:text-blue-400 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
