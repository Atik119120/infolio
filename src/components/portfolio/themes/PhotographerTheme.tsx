import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus,
  Briefcase, GraduationCap, Menu, X, Eye, Sparkles, Image
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

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

export default function PhotographerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shutterActive, setShutterActive] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const timer = setTimeout(() => setShutterActive(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (allProjects.length > 0) {
      const interval = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % allProjects.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [allProjects.length]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-950 to-stone-950 text-white">
      {/* Shutter Animation */}
      <AnimatePresence>
        {shutterActive && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-gradient-to-br from-amber-900 via-zinc-950 to-zinc-950 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.div
                className="w-32 h-32 rounded-full border-4 border-amber-500/50 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <Camera className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
              <motion.p
                className="text-center mt-6 text-amber-500/80 tracking-[0.3em] text-sm uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Capturing Moments
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm tracking-[0.2em] uppercase font-light">{profile?.display_name || "Photographer"}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Gallery", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "gallery" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="text-xs tracking-widest uppercase text-white/50 hover:text-amber-400 transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + i * 0.1 }}
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
              className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/5 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Gallery", "Contact"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "gallery" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="block w-full text-left py-3 text-white/70 text-sm tracking-wider uppercase">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        id="hero" 
        className="h-screen relative overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {allProjects[activeImage]?.image_url && (
              <motion.div
                key={activeImage}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <img
                  src={allProjects[activeImage].image_url}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
              </motion.div>
            )}
          </AnimatePresence>
          {!allProjects[activeImage]?.image_url && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-zinc-950 to-zinc-950" />
          )}
        </div>

        {/* Viewfinder Frame */}
        <div className="absolute inset-8 sm:inset-12 md:inset-20 border border-amber-500/20 pointer-events-none z-10">
          <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-amber-500/60" />
          <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-amber-500/60" />
          <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-amber-500/60" />
          <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-amber-500/60" />
          
          {/* Center Focus */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Aperture className="w-full h-full text-amber-500/40" />
          </motion.div>
        </div>

        {/* Camera Info */}
        <div className="absolute top-24 left-6 sm:left-12 text-[10px] font-mono text-amber-500/60 space-y-1 z-10">
          <div className="flex items-center gap-2"><Aperture className="w-3 h-3" /> f/1.8</div>
          <div className="flex items-center gap-2"><Camera className="w-3 h-3" /> 1/250s</div>
          <div>ISO 100</div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="text-xs tracking-[0.2em] uppercase text-amber-400">Professional Photographer</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
              {profile?.display_name || "Photographer"}
            </span>
          </motion.h1>

          {portfolio?.headline && (
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-white/60 font-light max-w-2xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              {portfolio.headline}
            </motion.p>
          )}

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6 }}
          >
            <Button 
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full px-8 shadow-lg shadow-amber-500/20"
              onClick={() => scrollTo('works')}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Gallery
            </Button>
            {profile?.email && (
              <Button 
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-full px-8"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-amber-500/40 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1 h-2 bg-amber-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Polaroid Style Photo */}
            <ScrollReveal direction="left">
              <motion.div 
                className="relative mx-auto lg:mx-0"
                whileHover={{ rotate: 0 }}
                initial={{ rotate: -3 }}
              >
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 pb-16 shadow-2xl max-w-sm rotate-2 hover:rotate-0 transition-transform">
                  <div className="aspect-[4/5] bg-zinc-200 overflow-hidden">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                      <AvatarFallback className="text-6xl sm:text-8xl bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-none">
                        {profile?.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-zinc-800 text-center text-lg mt-4 font-serif italic">
                    {profile?.display_name}
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Bio Content */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs tracking-widest uppercase text-amber-400">About Me</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-light">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {profile?.display_name}
                  </span>
                </h2>
                
                {portfolio?.bio && (
                  <p className="text-lg text-white/60 font-light leading-relaxed">
                    {portfolio.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                  {portfolio?.location && (
                    <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {portfolio.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
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
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center hover:from-amber-500 hover:to-orange-600 transition-all"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <Icon className="w-5 h-5 text-amber-400" />
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
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-900/50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                  <Focus className="w-4 h-4 text-amber-400" />
                  <span className="text-xs tracking-widest uppercase text-amber-400">Expertise</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-light">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Equipment & Skills
                  </span>
                </h2>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 0.05}>
                  <motion.div 
                    className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-amber-500/10 p-6 text-center rounded-2xl hover:border-amber-500/30 transition-all group"
                    whileHover={{ y: -5 }}
                  >
                    <Aperture className="w-6 h-6 text-amber-500/50 mx-auto mb-3 group-hover:text-amber-400 transition-colors" />
                    <p className="text-sm text-white/70">{skill.name}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {education.length > 0 && (
              <div className="mb-20">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                      <GraduationCap className="w-4 h-4 text-orange-400" />
                      <span className="text-xs tracking-widest uppercase text-orange-400">Background</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-light text-white">Education</h2>
                  </div>
                </ScrollReveal>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border border-orange-500/10 p-8 rounded-2xl hover:border-orange-500/30 transition-all">
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-light text-white">{edu.degree}</h3>
                            <p className="text-orange-400">{edu.institution}</p>
                            {edu.field_of_study && <p className="text-white/40 text-sm mt-1">{edu.field_of_study}</p>}
                            <p className="text-white/30 text-xs mt-2">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <div>
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span className="text-xs tracking-widest uppercase text-amber-400">Career</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-light text-white">Experience</h2>
                  </div>
                </ScrollReveal>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border border-amber-500/10 p-8 rounded-2xl hover:border-amber-500/30 transition-all">
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-light text-white">{exp.position}</h3>
                            <p className="text-amber-400">{exp.company}</p>
                            <p className="text-white/30 text-xs mt-2">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                            {exp.description && <p className="text-white/50 text-sm mt-3">{exp.description}</p>}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-900/50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                  <Image className="w-4 h-4 text-amber-400" />
                  <span className="text-xs tracking-widest uppercase text-amber-400">Portfolio</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-light">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Photo Gallery
                  </span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <motion.div 
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-amber-500/40" />
                      </div>
                    )}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent flex items-end p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      <div>
                        <h3 className="text-lg font-light text-white mb-1">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-amber-400 text-sm hover:text-amber-300">
                            View Full <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                    {project.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-3 py-1 rounded-full tracking-wider uppercase">
                        Featured
                      </div>
                    )}
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="text-xs tracking-widest uppercase text-amber-400">Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Let's Create Together
              </span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Ready to capture your story? Let's discuss your vision and create something beautiful together.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full px-8 shadow-lg shadow-amber-500/20"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Me
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-full px-8"
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
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {portfolio.location}
                </span>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-zinc-950 border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white/40">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
