import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus,
  Briefcase, GraduationCap, Menu, X, Sun, Moon, Contrast, 
  Layers, Sparkles, ZoomIn, Grid, Star, ChevronLeft, ChevronRight,
  Image as ImageIcon, Play, Pause, Maximize2, Heart, Share2, Download
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Polaroid Card Component
const PolaroidCard = ({ 
  image, 
  title, 
  onClick, 
  rotation = 0,
  featured = false 
}: { 
  image: string | null; 
  title: string; 
  onClick: () => void;
  rotation?: number;
  featured?: boolean;
}) => {
  return (
    <motion.div
      className="cursor-pointer group"
      style={{ rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="bg-white p-3 pb-12 shadow-xl shadow-black/20 relative">
        <div className="aspect-square bg-neutral-100 overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200">
              <Camera className="w-8 h-8 text-neutral-400" />
            </div>
          )}
        </div>
        <p className="absolute bottom-3 left-0 right-0 text-center text-sm text-neutral-700 font-handwriting truncate px-3">
          {title}
        </p>
        {featured && (
          <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}
        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-amber-100/80 rotate-[-2deg] shadow-sm" />
      </div>
    </motion.div>
  );
};

// Magazine Cover Component
const MagazineCover = ({ 
  image, 
  title, 
  subtitle,
  photographer 
}: { 
  image: string | null; 
  title: string;
  subtitle?: string;
  photographer: string;
}) => {
  return (
    <div className="relative aspect-[3/4] overflow-hidden group">
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
          <Camera className="w-16 h-16 text-neutral-600" />
        </div>
      )}
      
      {/* Magazine Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      
      {/* Magazine Title */}
      <div className="absolute top-6 left-0 right-0 text-center">
        <h2 className="text-4xl font-serif font-bold text-white tracking-widest">LENS</h2>
        <p className="text-xs text-white/60 tracking-[0.3em] mt-1">PHOTOGRAPHY MAGAZINE</p>
      </div>

      {/* Cover Story */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-amber-400 text-xs uppercase tracking-widest mb-2">Featured Story</p>
        <h3 className="text-2xl font-serif text-white mb-1">{title}</h3>
        {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
        <p className="text-white/50 text-xs mt-4">Photography by {photographer}</p>
      </div>

      {/* Issue Info */}
      <div className="absolute top-6 right-6 text-right">
        <p className="text-white/60 text-xs">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
        <p className="text-white text-lg font-bold">Vol. 12</p>
      </div>
    </div>
  );
};

// Gallery Lightbox with Film Strip
const GalleryLightbox = ({ 
  images, 
  activeIndex, 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  images: { id: string; url: string | null; title: string; featured?: boolean }[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const current = images[activeIndex];

  useEffect(() => {
    if (isPlaying && isOpen) {
      const interval = setInterval(() => {
        onSelect((activeIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isOpen, activeIndex, images.length, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelect(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
      if (e.key === 'ArrowRight') onSelect((activeIndex + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Aperture className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-neutral-400">LensPro Gallery</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-amber-500" /> : <Play className="w-5 h-5 text-neutral-400" />}
          </button>
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Heart className="w-5 h-5 text-neutral-400" />
          </button>
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5 text-neutral-400" />
          </button>
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-neutral-400" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors ml-4"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button 
          onClick={() => onSelect(activeIndex > 0 ? activeIndex - 1 : images.length - 1)}
          className="absolute left-4 z-10 w-12 h-12 bg-neutral-800/50 hover:bg-neutral-800 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="max-w-5xl max-h-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {current?.url ? (
              <img 
                src={current.url} 
                alt={current.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-96 h-64 bg-neutral-800 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-neutral-600" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={() => onSelect((activeIndex + 1) % images.length)}
          className="absolute right-4 z-10 w-12 h-12 bg-neutral-800/50 hover:bg-neutral-800 rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Info Bar */}
      <div className="px-6 py-3 border-t border-neutral-800 flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">{current?.title}</h3>
          <p className="text-neutral-500 text-sm">{activeIndex + 1} of {images.length}</p>
        </div>
        {current?.featured && (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Star className="w-3 h-3 mr-1 fill-amber-400" />
            Featured
          </Badge>
        )}
      </div>

      {/* Film Strip */}
      <div className="border-t border-neutral-800 bg-neutral-900 p-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              onClick={() => onSelect(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-all ${
                activeIndex === i 
                  ? 'border-amber-500 ring-2 ring-amber-500/30' 
                  : 'border-transparent hover:border-neutral-600'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {img.url ? (
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-neutral-600" />
                </div>
              )}
              {img.featured && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white fill-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function PhotographerProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeHero, setActiveHero] = useState(0);
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (allProjects.length > 0 && isLoaded) {
      const interval = setInterval(() => {
        setActiveHero((prev) => (prev + 1) % Math.min(allProjects.length, 4));
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
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* Loading Screen - Camera Shutter */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-neutral-900 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {/* Camera shutter blades */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0"
                    style={{ rotate: `${i * 45}deg` }}
                  >
                    <motion.div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full origin-bottom"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    />
                  </motion.div>
                ))}
                <div className="absolute inset-6 bg-neutral-900 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-amber-500" />
                </div>
              </motion.div>
              <motion.p
                className="text-amber-500 tracking-widest text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                LENS PRO
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <GalleryLightbox
            images={allProjects.map(p => ({ 
              id: p.id, 
              url: p.image_url, 
              title: p.title,
              featured: p.featured || false
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
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200"
        initial={{ y: -80 }}
        animate={{ y: isLoaded ? 0 : -80 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Aperture className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-semibold text-neutral-900">{profile?.display_name || "LensPro"}</p>
                    <p className="text-xs text-neutral-500">Photography</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Home", "Gallery", "About", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(
                    item === "Home" ? "hero" : 
                    item === "Gallery" ? "gallery" : 
                    item === "About" ? "about" : "contact"
                  )}
                  className="text-sm text-neutral-600 hover:text-amber-600 transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-white border-t border-neutral-200 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "Gallery", "About", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(
                    item === "Home" ? "hero" : 
                    item === "Gallery" ? "gallery" : 
                    item === "About" ? "about" : "contact"
                  )}
                  className="block w-full text-left py-3 text-neutral-600 border-b border-neutral-100 last:border-0"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero - Magazine Style */}
      <section id="hero" className="min-h-screen pt-16 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50"
          style={{ y: heroY }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left: Magazine Cover */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -50 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="max-w-md mx-auto lg:mx-0 shadow-2xl shadow-neutral-900/20">
                <MagazineCover
                  image={allProjects[activeHero]?.image_url}
                  title={allProjects[activeHero]?.title || "Featured Work"}
                  subtitle={allProjects[activeHero]?.description?.slice(0, 60)}
                  photographer={profile?.display_name || "Artist"}
                />
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {allProjects.slice(0, 4).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHero(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeHero === i ? 'w-8 bg-amber-500' : 'bg-neutral-300 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 50 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-6 bg-amber-100 text-amber-700 border-amber-200 text-xs">
                <Camera className="w-3 h-3 mr-2" />
                Professional Photographer
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-neutral-900 mb-6 leading-tight">
                Capturing <br />
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-normal">
                  Timeless
                </span> <br />
                Moments
              </h1>

              {portfolio?.headline && (
                <p className="text-lg text-neutral-600 mb-8 max-w-lg mx-auto lg:mx-0">
                  {portfolio.headline}
                </p>
              )}

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button 
                  size="lg"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-8"
                  onClick={() => scrollTo('gallery')}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
                {profile?.email && (
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-neutral-300 hover:border-amber-500 hover:text-amber-600 rounded-full px-8"
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Get in Touch
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery - Polaroid Wall */}
      <section id="gallery" className="py-24 px-6 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-white text-amber-600 border-amber-200">
                <Sparkles className="w-3 h-3 mr-2" />
                Portfolio
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
                Photo Gallery
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                A curated collection of my best work, capturing life's most beautiful moments
              </p>
            </div>
          </ScrollReveal>

          {/* Polaroid Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {allProjects.map((project, i) => {
              const rotations = [-3, 2, -2, 3, -1, 2, -3, 1, 2, -2];
              return (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <PolaroidCard
                    image={project.image_url}
                    title={project.title}
                    onClick={() => openLightbox(i)}
                    rotation={rotations[i % rotations.length]}
                    featured={project.featured || false}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative">
                {/* Main Photo */}
                <div className="relative z-10 bg-white p-4 shadow-xl rotate-[-2deg]">
                  <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.display_name || ''} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                        <Camera className="w-16 h-16 text-neutral-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-500/10 rounded-full" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500/10 rounded-full" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <Badge className="mb-4 bg-amber-50 text-amber-600 border-amber-200">About Me</Badge>
                <h2 className="text-4xl font-serif text-neutral-900 mb-4">
                  {profile?.display_name || "The Photographer"}
                </h2>
                {portfolio?.headline && (
                  <p className="text-xl text-amber-600 mb-6 italic font-serif">
                    "{portfolio.headline}"
                  </p>
                )}
                {portfolio?.bio && (
                  <p className="text-neutral-600 leading-relaxed mb-8">
                    {portfolio.bio}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-3 mb-8">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3 text-neutral-600">
                      <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-amber-600" />
                      </div>
                      {portfolio.location}
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-neutral-600">
                      <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-amber-600" />
                      </div>
                      {profile.email}
                    </div>
                  )}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="outline"
                        className="border-neutral-200 text-neutral-600"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-6 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {experiences.length > 0 && (
                <ScrollReveal>
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-serif text-neutral-900">Experience</h3>
                    </div>
                    <div className="space-y-6">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                          <h4 className="font-semibold text-neutral-900">{exp.position}</h4>
                          <p className="text-amber-600">{exp.company}</p>
                          <p className="text-sm text-neutral-500 mt-1">
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </p>
                          {exp.description && (
                            <p className="text-neutral-600 text-sm mt-3">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {education.length > 0 && (
                <ScrollReveal delay={0.1}>
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-serif text-neutral-900">Education</h3>
                    </div>
                    <div className="space-y-6">
                      {education.map((edu) => (
                        <div key={edu.id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                          <h4 className="font-semibold text-neutral-900">{edu.degree}</h4>
                          <p className="text-amber-600">{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-sm text-neutral-500">{edu.field_of_study}</p>
                          )}
                          <p className="text-sm text-neutral-500 mt-1">
                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <Camera className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Let's Create Together
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
              Ready to capture your story? I'd love to hear about your project and bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full px-10"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-neutral-600 text-white hover:bg-neutral-800 rounded-full px-10"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-4 mt-12">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-neutral-800 hover:bg-amber-500 hover:text-black rounded-full flex items-center justify-center transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Aperture className="w-4 h-4 text-white" />
            </div>
            <span className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} {profile?.display_name}. LensPro Theme.
            </span>
          </div>
          <p className="text-neutral-600 text-xs">
            Crafted with passion for photography
          </p>
        </div>
      </footer>
    </div>
  );
}
