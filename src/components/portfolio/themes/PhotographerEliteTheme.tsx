import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus,
  Briefcase, GraduationCap, Menu, X, Eye, Sparkles, Image, 
  Award, Star, Crown, Gem, Play, Pause
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Image Component
const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-[140%] object-cover"
        style={{ y }}
      />
    </div>
  );
};

// Floating Particles
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default function PhotographerEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto slideshow
  useEffect(() => {
    if (allProjects.length > 0 && isPlaying && isLoaded) {
      const interval = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % allProjects.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [allProjects.length, isPlaying, isLoaded]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Loading Screen - Cinematic */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Rotating rings */}
                <motion.div 
                  className="absolute inset-0 border-2 border-amber-500/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-4 border border-amber-400/50 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-8 border border-amber-300/70 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-amber-400" />
                </div>
              </motion.div>
              <motion.p
                className="text-amber-400/80 tracking-[0.4em] text-xs uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Elite Photography
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingParticles />

      {/* Luxury Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent"
        initial={{ y: -100 }}
        animate={{ y: isLoaded ? 0 : -100 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Crown className="w-6 h-6 text-black" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-light tracking-widest text-amber-400">ELITE</p>
                    <p className="text-xs text-neutral-500 tracking-wider">PHOTOGRAPHY</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-10">
              {["Home", "Portfolio", "About", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-[0.2em] font-light"
                >
                  {item}
                </button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-black/95 backdrop-blur-xl px-6 py-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "Portfolio", "About", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="block w-full text-left py-4 text-neutral-400 text-sm tracking-wider uppercase border-b border-neutral-900"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Cinematic Full Screen */}
      <motion.section 
        id="hero" 
        className="h-screen relative overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        {/* Background with Ken Burns Effect */}
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
                  animate={{ scale: [1, 1.1] }}
                  transition={{ duration: 8, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          
          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)"
          }} />
        </div>

        {/* Letterbox Bars */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-black z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-black z-10" />

        {/* Main Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div 
                className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
              <Crown className="w-6 h-6 text-amber-400" />
              <motion.div 
                className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </div>

            <motion.p
              className="text-amber-400/80 tracking-[0.4em] text-xs uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Award-Winning Photography
            </motion.p>

            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                {profile?.display_name || "Elite Artist"}
              </span>
            </motion.h1>

            {portfolio?.headline && (
              <motion.p 
                className="text-xl sm:text-2xl text-neutral-400 font-extralight max-w-2xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {portfolio.headline}
              </motion.p>
            )}

            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black font-medium rounded-none px-10 py-6 shadow-lg shadow-amber-500/30"
                onClick={() => scrollTo('works')}
              >
                <Gem className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
              {profile?.email && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 rounded-none px-10 py-6"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Inquire Now
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Image Navigation */}
        <motion.div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ delay: 2 }}
        >
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/10 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>
          <div className="flex gap-2">
            {allProjects.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-1 rounded-full transition-all ${
                  activeImage === i ? 'w-8 bg-amber-400' : 'w-3 bg-neutral-600 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
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
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Scroll</p>
            <div className="w-5 h-8 border border-neutral-600 rounded-full mx-auto flex justify-center pt-1.5">
              <motion.div 
                className="w-1 h-1.5 bg-amber-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-y border-amber-400/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Projects Completed" },
              { value: "50+", label: "Awards Won" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-light bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Luxury Split */}
      <section id="bio" className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="aspect-[3/4] relative">
                  <div className="absolute inset-0 border border-amber-400/20 translate-x-4 translate-y-4" />
                  <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                      <AvatarFallback className="text-9xl bg-gradient-to-br from-amber-500 to-yellow-600 rounded-none">
                        {profile?.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                {/* Award Badge */}
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-6 shadow-xl shadow-amber-500/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-8 h-8 text-black" />
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-8">
                <div>
                  <p className="text-amber-400 tracking-[0.3em] text-xs uppercase mb-4">The Artist</p>
                  <h2 className="text-4xl sm:text-5xl font-extralight leading-tight">
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                      {profile?.display_name}
                    </span>
                  </h2>
                </div>

                {portfolio?.bio && (
                  <p className="text-lg text-neutral-400 font-light leading-relaxed">
                    {portfolio.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  {portfolio?.location && (
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {portfolio.location}
                    </div>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-400 transition-colors">
                      <Mail className="w-4 h-4 text-amber-400" />
                      {profile.email}
                    </a>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex gap-4 pt-4">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 border border-amber-400/30 flex items-center justify-center hover:bg-amber-400 hover:border-amber-400 transition-all group"
                          whileHover={{ y: -4 }}
                        >
                          <Icon className="w-5 h-5 text-amber-400 group-hover:text-black transition-colors" />
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

      {/* Portfolio Grid - Masonry Style */}
      {projects.length > 0 && (
        <section id="works" className="py-32 px-6 bg-neutral-950">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-20">
                <p className="text-amber-400 tracking-[0.3em] text-xs uppercase mb-4">Selected Works</p>
                <h2 className="text-4xl sm:text-5xl font-extralight">
                  <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                    Portfolio
                  </span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.1}>
                  <motion.div 
                    className={`group relative overflow-hidden bg-neutral-900 ${
                      i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`${i % 5 === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                          <Image className="w-16 h-16 text-neutral-700" />
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-light mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-neutral-400 line-clamp-2">{project.description}</p>
                        )}
                        {(project.live_url || project.github_url) && (
                          <div className="flex gap-3 mt-4">
                            {project.live_url && (
                              <a 
                                href={project.live_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-amber-400 text-sm hover:underline flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" /> View
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/0 group-hover:border-amber-400 transition-colors" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400/0 group-hover:border-amber-400 transition-colors" />
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-32 px-6 bg-black">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-amber-400 tracking-[0.3em] text-xs uppercase mb-4">Expertise</p>
                <h2 className="text-4xl font-extralight">
                  <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                    Specializations
                  </span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 0.05}>
                  <motion.div 
                    className="p-6 border border-neutral-800 hover:border-amber-400/30 transition-colors group"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-light">{skill.name}</h3>
                      <Star className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="h-0.5 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                      />
                    </div>
                    {skill.category && (
                      <p className="text-[10px] text-neutral-600 uppercase tracking-widest mt-3">{skill.category}</p>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-32 px-6 bg-neutral-950">
          <div className="max-w-4xl mx-auto">
            {experiences.length > 0 && (
              <div className="mb-24">
                <ScrollReveal>
                  <p className="text-amber-400 tracking-[0.3em] text-xs uppercase mb-4 text-center">Career</p>
                  <h2 className="text-3xl font-extralight text-center mb-12">
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                      Experience
                    </span>
                  </h2>
                </ScrollReveal>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="border-l-2 border-amber-400/30 pl-8 py-4 relative hover:border-amber-400 transition-colors">
                        <div className="absolute left-0 top-6 w-3 h-3 -translate-x-[7px] bg-amber-400 rounded-full" />
                        <span className="text-xs text-amber-400/80">
                          {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </span>
                        <h3 className="text-xl font-light mt-2">{exp.position}</h3>
                        <p className="text-neutral-500">{exp.company}</p>
                        {exp.description && (
                          <p className="text-sm text-neutral-600 mt-2">{exp.description}</p>
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
                  <p className="text-amber-400 tracking-[0.3em] text-xs uppercase mb-4 text-center">Background</p>
                  <h2 className="text-3xl font-extralight text-center mb-12">
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                      Education
                    </span>
                  </h2>
                </ScrollReveal>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <div className="border-l-2 border-neutral-800 pl-8 py-4 relative hover:border-amber-400/50 transition-colors">
                        <div className="absolute left-0 top-6 w-2 h-2 -translate-x-[5px] bg-neutral-600 rounded-full" />
                        <span className="text-xs text-neutral-600">
                          {formatDate(edu.start_date)} — {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                        </span>
                        <h3 className="text-xl font-light mt-2">{edu.degree}</h3>
                        <p className="text-neutral-500">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-neutral-600 mt-1">{edu.field_of_study}</p>
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
      <section id="contact" className="py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
              <Crown className="w-8 h-8 text-amber-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            <p className="text-amber-400 tracking-[0.3em] text-xs uppercase mb-6">Commission</p>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight mb-8">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                Let's Create Timeless Art
              </span>
            </h2>

            <p className="text-lg text-neutral-400 font-light mb-12 max-w-2xl mx-auto">
              Available for exclusive commissions, editorial projects, and high-end commercial work.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black font-medium rounded-none px-12 py-7 shadow-xl shadow-amber-500/30"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-5 h-5 mr-3" />
                    {profile.email}
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-light tracking-widest text-amber-400">ELITE</p>
                    <p className="text-xs text-neutral-600 tracking-wider">PHOTOGRAPHY</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-700 tracking-wider">
              © {new Date().getFullYear()} {profile?.display_name}. All Rights Reserved.
            </p>

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
                      className="w-10 h-10 border border-neutral-900 flex items-center justify-center hover:border-amber-400/50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-neutral-600 hover:text-amber-400 transition-colors" />
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
