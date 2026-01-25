import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture,
  Briefcase, GraduationCap, Menu, X, Award, Crown,
  Star, ChevronLeft, ChevronRight, ArrowUpRight, Sparkles
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Luxury Floating Elements
const LuxuryParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)`,
          }}
          animate={{
            y: [-30, 30, -30],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Gallery Lightbox
const Lightbox = ({ 
  images, 
  activeIndex, 
  isOpen, 
  onClose, 
  onPrev, 
  onNext 
}: { 
  images: { url: string | null; title: string }[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  if (!isOpen) return null;
  const current = images[activeIndex];

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors z-10"
      >
        <X className="w-5 h-5 text-amber-400" />
      </button>

      <button 
        onClick={onPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-amber-400" />
      </button>

      <div className="max-w-6xl max-h-[85vh] mx-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {current?.url && (
              <img 
                src={current.url} 
                alt={current.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-lg font-light">{current?.title}</p>
              <p className="text-amber-400/80 text-sm mt-1">{activeIndex + 1} / {images.length}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={onNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-amber-400" />
      </button>
    </motion.div>
  );
};

export default function PhotographerEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

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
        setActiveImage((prev) => (prev + 1) % Math.min(allProjects.length, 5));
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Loading Screen - Luxury Aperture Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              {/* Aperture Loading Animation */}
              <motion.div className="relative w-40 h-40 mx-auto mb-8">
                {/* Outer ring */}
                <motion.div 
                  className="absolute inset-0 border-2 border-amber-400/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Aperture blades */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 to-transparent origin-left"
                    style={{ 
                      rotate: `${i * 45}deg`,
                      translateX: '-50%',
                      translateY: '-50%',
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.6 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.3 + i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 1
                    }}
                  />
                ))}

                {/* Center lens */}
                <motion.div 
                  className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-400/20 to-transparent flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-8 h-8 text-amber-400" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-amber-400 tracking-[0.5em] text-xs uppercase mb-2">Elite Gallery</p>
                <p className="text-neutral-600 text-xs">Preparing your experience...</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LuxuryParticles />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={allProjects.map(p => ({ url: p.image_url, title: p.title }))}
            activeIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => setLightboxIndex(prev => prev > 0 ? prev - 1 : allProjects.length - 1)}
            onNext={() => setLightboxIndex(prev => prev < allProjects.length - 1 ? prev + 1 : 0)}
          />
        )}
      </AnimatePresence>

      {/* Luxury Navigation */}
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
                    <p className="text-xs font-light tracking-[0.3em] text-amber-400 uppercase">Elite</p>
                    <p className="text-[10px] text-neutral-500 tracking-wider">Photography</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-12">
              {["Gallery", "About", "Awards", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(
                    item === "Gallery" ? "works" : 
                    item === "About" ? "bio" : 
                    item === "Awards" ? "awards" : "contact"
                  )}
                  className="group relative text-[11px] text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-[0.2em] font-light"
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
              {["Gallery", "About", "Awards", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(
                    item === "Gallery" ? "works" : 
                    item === "About" ? "bio" : 
                    item === "Awards" ? "awards" : "contact"
                  )}
                  className="block w-full text-left py-4 text-neutral-400 text-sm tracking-wider uppercase border-b border-neutral-900"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero - Cinematic Gallery Showcase */}
      <motion.section 
        id="hero" 
        className="h-screen relative overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        {/* Slideshow Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {allProjects[activeImage]?.image_url && (
              <motion.div
                key={activeImage}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.5 }}
              >
                <motion.img
                  src={allProjects[activeImage].image_url}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.05] }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Luxury Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          
          {/* Vignette Effect */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)"
          }} />

          {/* Gold Border Frame */}
          <div className="absolute inset-8 border border-amber-400/20 pointer-events-none" />
          <div className="absolute inset-12 border border-amber-400/10 pointer-events-none" />
        </div>

        {/* Main Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {/* Decorative Crown Element */}
            <motion.div 
              className="flex items-center justify-center gap-6 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
              <div className="relative">
                <Crown className="w-8 h-8 text-amber-400" />
                <motion.div 
                  className="absolute -inset-2 border border-amber-400/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <motion.div 
                className="h-px w-20 bg-gradient-to-l from-transparent via-amber-400 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>

            <motion.p
              className="text-amber-400/80 tracking-[0.5em] text-xs uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Award-Winning Photographer
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
                className="text-xl sm:text-2xl text-neutral-300 font-extralight max-w-2xl mx-auto mb-12 leading-relaxed"
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
                className="relative bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-light tracking-wider px-10 py-6 overflow-hidden group"
                onClick={() => scrollTo('works')}
              >
                <span className="relative z-10 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore Gallery
                </span>
              </Button>
              {profile?.email && (
                <Button 
                  size="lg"
                  variant="ghost"
                  className="text-neutral-400 hover:text-amber-400 hover:bg-transparent font-light tracking-wider px-10 py-6"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Book a Session
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Image Indicators */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 2 }}
        >
          {allProjects.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative h-1 rounded-full transition-all duration-500 ${
                activeImage === i ? 'w-12 bg-amber-400' : 'w-3 bg-neutral-600 hover:bg-neutral-500'
              }`}
            >
              {activeImage === i && (
                <motion.div 
                  className="absolute inset-0 bg-amber-400 rounded-full"
                  layoutId="activeIndicator"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Scroll Hint */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className="w-6 h-10 border border-amber-400/30 rounded-full mx-auto flex justify-center pt-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#111] relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTIsMTc1LDU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years Experience", icon: Star },
              { value: "500+", label: "Projects Delivered", icon: Camera },
              { value: "50+", label: "International Awards", icon: Award },
              { value: "100%", label: "Client Satisfaction", icon: Crown },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center group">
                  <stat.icon className="w-6 h-6 text-amber-400/50 mx-auto mb-4 group-hover:text-amber-400 transition-colors" />
                  <p className="text-4xl sm:text-5xl font-extralight bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-500 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Masonry Style */}
      <section id="works" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-4">
                Curated <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Collection</span>
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6" />
            </div>
          </ScrollReveal>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProjects.map((project, i) => {
              // Create varying heights for masonry effect
              const isLarge = i % 5 === 0 || i % 7 === 2;
              
              return (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <motion.div 
                    className={`group relative overflow-hidden cursor-pointer ${
                      isLarge ? 'row-span-2' : ''
                    }`}
                    style={{ aspectRatio: isLarge ? '3/4' : '1/1' }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openLightbox(i)}
                  >
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-neutral-700" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          className="w-12 h-12 rounded-full border border-amber-400 flex items-center justify-center mb-4"
                        >
                          <ArrowUpRight className="w-5 h-5 text-amber-400" />
                        </motion.div>
                        <p className="text-white text-center font-light">{project.title}</p>
                        {project.featured && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-amber-400">Featured</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Frame Corners */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-amber-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-32 px-6 bg-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <div className="relative">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-amber-400/20" />
                <div className="absolute -inset-8 border border-amber-400/10" />
                
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
                  
                  {/* Gold Corner Accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-400" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <p className="text-amber-400/60 tracking-[0.3em] text-xs uppercase mb-4">About the Artist</p>
                <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
                  {profile?.display_name || "The Photographer"}
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

                {/* Contact Info */}
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

                {/* Social Links */}
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

      {/* Awards Section */}
      <section id="awards" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Recognition</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-white">
                Awards & <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Achievements</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills as Awards */}
            {skills.slice(0, 6).map((skill, i) => (
              <ScrollReveal key={skill.id} delay={i * 0.1}>
                <div className="group border border-amber-400/10 hover:border-amber-400/30 p-8 transition-all">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-light mb-2">{skill.name}</h3>
                      <p className="text-neutral-500 text-sm">{skill.category || "Professional Excellence"}</p>
                      <div className="flex gap-1 mt-4">
                        {[...Array(5)].map((_, j) => (
                          <Star 
                            key={j} 
                            className={`w-4 h-4 ${j < (skill.proficiency || 5) / 20 ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      {experiences.length > 0 && (
        <section className="py-24 px-6 bg-[#111]">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Career</p>
                <h2 className="text-4xl font-extralight text-white">Professional Journey</h2>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Timeline Line */}
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
                      
                      {/* Center Dot */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#111]" />
                      
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
      <section id="contact" className="py-32 px-6 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <ScrollReveal>
            <Crown className="w-12 h-12 text-amber-400/50 mx-auto mb-8" />
            <p className="text-amber-400/60 tracking-[0.4em] text-xs uppercase mb-4">Get in Touch</p>
            <h2 className="text-4xl md:text-6xl font-extralight text-white mb-6">
              Let's Create <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Magic</span> Together
            </h2>
            <p className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to capture your most precious moments? I'd love to hear about your vision.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black font-light tracking-wider px-12 py-7 shadow-lg shadow-amber-500/20"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-5 h-5 mr-3" />
                    Book Your Session
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-400/30 text-amber-400 hover:bg-amber-400/10 font-light tracking-wider px-12 py-7"
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
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
              © {new Date().getFullYear()} All rights reserved. Elite Gallery Theme.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
