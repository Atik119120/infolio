import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture,
  Briefcase, GraduationCap, Menu, X, Award, Crown,
  Star, ChevronLeft, ChevronRight, ArrowUpRight, Sparkles,
  Play, Pause, Heart, Maximize2, Grid, Layers
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

// Scroll Animation
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Floating Gold Particles
const GoldParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// Immersive Gallery Lightbox
const ImmersiveLightbox = ({ 
  images, 
  activeIndex, 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  images: { id: string; url: string | null; title: string; description?: string | null }[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const current = images[activeIndex];

  useEffect(() => {
    if (isPlaying && isOpen) {
      const interval = setInterval(() => {
        onSelect((activeIndex + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isOpen, activeIndex, images.length, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelect(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
      if (e.key === 'ArrowRight') onSelect((activeIndex + 1) % images.length);
      if (e.key === ' ') setIsPlaying(!isPlaying);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, onSelect, isPlaying]);

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fullscreen Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
        >
          {current?.url && (
            <img 
              src={current.url} 
              alt={current.title}
              className="w-full h-full object-cover"
            />
          )}
          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <Crown className="w-6 h-6 text-amber-400" />
          <span className="text-amber-400/80 text-sm tracking-widest uppercase">Elite Gallery</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <button 
        onClick={() => onSelect(activeIndex > 0 ? activeIndex - 1 : images.length - 1)}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6 text-amber-400" />
      </button>
      <button 
        onClick={() => onSelect((activeIndex + 1) % images.length)}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6 text-amber-400" />
      </button>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-amber-400 text-sm tracking-widest uppercase mb-2">
              {activeIndex + 1} / {images.length}
            </p>
            <h3 className="text-3xl font-light text-white mb-2">{current?.title}</h3>
            {current?.description && (
              <p className="text-neutral-400 max-w-2xl">{current.description}</p>
            )}
          </motion.div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, i) => (
              <motion.button
                key={img.id}
                onClick={() => onSelect(i)}
                className={`relative flex-shrink-0 w-24 h-16 overflow-hidden transition-all ${
                  activeIndex === i 
                    ? 'ring-2 ring-amber-400' 
                    : 'opacity-50 hover:opacity-100'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {img.url ? (
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-neutral-600" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Bento Grid Item
const BentoItem = ({ 
  project, 
  size = 'normal',
  onClick 
}: { 
  project: { id: string; image_url: string | null; title: string; featured?: boolean | null };
  size?: 'normal' | 'large' | 'tall' | 'wide';
  onClick: () => void;
}) => {
  const sizeClasses = {
    normal: 'col-span-1 row-span-1',
    large: 'col-span-2 row-span-2',
    tall: 'col-span-1 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  return (
    <motion.div
      className={`relative group cursor-pointer overflow-hidden ${sizeClasses[size]}`}
      onClick={onClick}
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <Camera className="w-12 h-12 text-neutral-700" />
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center mb-4"
          >
            <Maximize2 className="w-6 h-6 text-amber-400" />
          </motion.div>
          <p className="text-white text-lg font-light">{project.title}</p>
        </div>
      </div>

      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-amber-500/90 text-black border-0">
            <Star className="w-3 h-3 mr-1 fill-black" />
            Featured
          </Badge>
        </div>
      )}

      {/* Frame Corners */}
      <div className="absolute inset-4 border border-amber-400/0 group-hover:border-amber-400/30 transition-all pointer-events-none">
        <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

export default function PhotographerEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeHero, setActiveHero] = useState(0);
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (allProjects.length > 0 && isLoaded) {
      const interval = setInterval(() => {
        setActiveHero((prev) => (prev + 1) % Math.min(allProjects.length, 5));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allProjects.length, isLoaded]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Calculate bento grid sizes
  const getBentoSize = (index: number): 'normal' | 'large' | 'tall' | 'wide' => {
    const patterns = ['large', 'normal', 'tall', 'normal', 'wide', 'normal', 'normal', 'tall', 'wide', 'normal'];
    return patterns[index % patterns.length] as 'normal' | 'large' | 'tall' | 'wide';
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Loading Screen - Luxury Lens Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#080808] flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div className="relative w-32 h-32 mx-auto mb-8">
                {/* Outer rotating ring */}
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-amber-400/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner pulsing ring */}
                <motion.div 
                  className="absolute inset-4 rounded-full border border-amber-400/40"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Center lens */}
                <motion.div 
                  className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/30 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-black" />
                  </div>
                </motion.div>

                {/* Aperture blades */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    style={{ rotate: `${i * 60}deg` }}
                  >
                    <motion.div 
                      className="absolute top-1/2 left-0 w-1/2 h-px bg-gradient-to-r from-amber-400/60 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: [0, 1, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-amber-400 tracking-[0.5em] text-xs uppercase mb-1">Elite</p>
                <p className="text-neutral-500 tracking-[0.2em] text-xs uppercase">Photography</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GoldParticles />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <ImmersiveLightbox
            images={allProjects.map(p => ({ 
              id: p.id, 
              url: p.image_url, 
              title: p.title,
              description: p.description
            }))}
            activeIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onSelect={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: isLoaded ? 0 : -100 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gradient-to-b from-black via-black/80 to-transparent py-6 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Crown className="w-5 h-5 text-black" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">Elite</p>
                    <p className="text-[10px] text-neutral-500 tracking-wider">Photography</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-12">
              {["Gallery", "About", "Experience", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="group relative text-[11px] text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-[0.2em]"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-amber-400" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-black/95 backdrop-blur-xl px-8 py-6 border-t border-amber-400/10"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Gallery", "About", "Experience", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="block w-full text-left py-4 text-neutral-400 text-sm tracking-wider uppercase border-b border-neutral-900"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Cinematic Fullscreen */}
      <motion.section 
        id="hero" 
        className="h-screen relative overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        {/* Background Slideshow */}
        <AnimatePresence mode="wait">
          {allProjects[activeHero]?.image_url && (
            <motion.div
              key={activeHero}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5 }}
            >
              <motion.img
                src={allProjects[activeHero].image_url}
                alt="Gallery"
                className="w-full h-full object-cover"
                animate={{ scale: [1, 1.08] }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        
        {/* Luxury Frame */}
        <div className="absolute inset-10 border border-amber-400/10 pointer-events-none" />
        <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-amber-400/40" />
        <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-amber-400/40" />
        <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-amber-400/40" />
        <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-amber-400/40" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* Crown Decoration */}
            <motion.div 
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
              <Crown className="w-8 h-8 text-amber-400" />
              <motion.div 
                className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>

            <motion.p
              className="text-amber-400/80 tracking-[0.5em] text-xs uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Elite Photography
            </motion.p>

            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                {profile?.display_name || "Elite Artist"}
              </span>
            </motion.h1>

            {portfolio?.headline && (
              <motion.p 
                className="text-xl sm:text-2xl text-neutral-300 font-extralight max-w-2xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                {portfolio.headline}
              </motion.p>
            )}

            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black font-medium tracking-wider px-10 py-6 shadow-lg shadow-amber-500/20"
                onClick={() => scrollTo('gallery')}
              >
                <Grid className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
              {profile?.email && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-400/30 text-amber-400 hover:bg-amber-400/10 tracking-wider px-10 py-6"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <motion.div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 2 }}
        >
          {allProjects.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHero(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeHero === i ? 'w-10 bg-amber-400' : 'w-3 bg-neutral-600 hover:bg-neutral-500'
              }`}
            />
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border border-amber-400/30 rounded-full flex justify-center pt-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-[#080808] to-[#0d0d0d] border-y border-amber-400/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Projects" },
              { value: "50+", label: "Awards" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center group">
                  <p className="text-4xl sm:text-5xl font-extralight bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-500 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery - Bento Grid */}
      <section id="gallery" className="py-24 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-4">
                Curated <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Gallery</span>
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {allProjects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.05}>
                <BentoItem
                  project={project}
                  size={getBentoSize(i)}
                  onClick={() => openLightbox(i)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="absolute -inset-4 border border-amber-400/10" />
                <div className="aspect-[3/4] bg-neutral-900 overflow-hidden relative">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name || ''} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-20 h-20 text-neutral-700" />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-400" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <p className="text-amber-400/60 tracking-[0.3em] text-xs uppercase mb-4">About</p>
                <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
                  {profile?.display_name || "The Artist"}
                </h2>
                {portfolio?.headline && (
                  <p className="text-xl text-amber-400/80 font-light mb-6 italic">
                    "{portfolio.headline}"
                  </p>
                )}
                {portfolio?.bio && (
                  <p className="text-neutral-400 leading-relaxed text-lg mb-8">
                    {portfolio.bio}
                  </p>
                )}

                <div className="space-y-4 mb-8">
                  {portfolio?.location && (
                    <div className="flex items-center gap-4 text-neutral-400">
                      <MapPin className="w-5 h-5 text-amber-400/50" />
                      {portfolio.location}
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-4 text-neutral-400">
                      <Mail className="w-5 h-5 text-amber-400/50" />
                      {profile.email}
                    </div>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex gap-4">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 border border-amber-400/20 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-all"
                        >
                          <Icon className="w-5 h-5 text-amber-400/70" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section id="experience" className="py-24 px-6 bg-[#080808]">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Career</p>
                <h2 className="text-4xl font-extralight text-white">Professional Journey</h2>
              </div>
            </ScrollReveal>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/50 via-amber-400/20 to-transparent" />

              <div className="space-y-16">
                {experiences.map((exp, i) => (
                  <ScrollReveal key={exp.id} delay={i * 0.1}>
                    <div className={`relative flex items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                        <p className="text-amber-400 text-sm mb-2">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </p>
                        <h3 className="text-xl text-white font-light">{exp.position}</h3>
                        <p className="text-neutral-500">{exp.company}</p>
                        {exp.description && (
                          <p className="text-neutral-400 text-sm mt-3">{exp.description}</p>
                        )}
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#080808]" />
                      <div className="w-1/2" />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <ScrollReveal>
            <Crown className="w-12 h-12 text-amber-400/50 mx-auto mb-8" />
            <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Let's Create <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Together</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to capture extraordinary moments? I'd love to discuss your vision.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black font-medium tracking-wider px-12 py-7 shadow-lg shadow-amber-500/20"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-5 h-5 mr-3" />
                    Book Session
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-400/30 text-amber-400 hover:bg-amber-400/10 tracking-wider px-12 py-7"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-5 h-5 mr-3" />
                    Call Now
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-amber-400/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white font-light">{profile?.display_name}</p>
              <p className="text-xs text-neutral-500">Elite Photography</p>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex gap-6">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-amber-400 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}

          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
