import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus, Image,
  Briefcase, GraduationCap, Menu, X, Sun, SunDim, ZoomIn
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotographerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shutterActive, setShutterActive] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  // Camera shutter animation on load
  useEffect(() => {
    setShutterActive(true);
    const timer = setTimeout(() => setShutterActive(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate gallery images
  useEffect(() => {
    if (projects.length > 0) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % projects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [projects.length]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Camera Shutter Animation Overlay */}
      <AnimatePresence>
        {shutterActive && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Shutter Blades */}
            <div className="relative w-[400px] h-[400px]">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-[#1a1a1a] origin-center"
                  style={{
                    rotate: `${i * 45}deg`,
                    clipPath: "polygon(50% 50%, 0% 0%, 100% 0%)",
                  }}
                  initial={{ scale: 1 }}
                  animate={{ scale: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                />
              ))}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Aperture className="w-20 h-20 text-white/80 animate-spin" style={{ animationDuration: "3s" }} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Film Strip Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <Aperture className="w-8 h-8 text-white" />
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border-2 border-white/20 rounded-full" />
              </motion.div>
            </div>
            <span className="font-light text-lg tracking-[0.3em] uppercase">{profile?.display_name || "PORTFOLIO"}</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {["hero", "bio", "skills", "works", "contact"].map((item, i) => (
              <motion.button 
                key={item}
                onClick={() => scrollTo(item)} 
                className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item === "hero" ? "Home" : item === "works" ? "Gallery" : item.charAt(0).toUpperCase() + item.slice(1)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-black border-t border-white/10 px-6 py-4 space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Gallery", "Contact"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "gallery" ? "works" : item.toLowerCase() === "home" ? "hero" : item.toLowerCase())} className="block w-full text-left py-2 text-white/80 text-sm tracking-wider">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Full Screen Cinematic */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {projects[activeImageIndex]?.image_url && (
              <motion.img
                key={activeImageIndex}
                src={projects[activeImageIndex].image_url}
                alt="Gallery"
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Film Grain Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />

        {/* Camera Viewfinder Frame */}
        <div className="absolute inset-8 md:inset-16 border border-white/20 pointer-events-none">
          <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-white/60" />
          <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-white/60" />
          <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-white/60" />
          <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-white/60" />
          {/* Center Focus Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16">
            <motion.div 
              className="w-full h-full border border-white/40"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
          </div>
        </div>

        {/* ISO/Aperture Info */}
        <motion.div 
          className="absolute top-24 left-8 text-xs text-white/40 font-mono space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="flex items-center gap-2">
            <Aperture className="w-3 h-3" />
            <span>f/1.8</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-3 h-3" />
            <span>ISO 100</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-3 h-3" />
            <span>1/250s</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-2 rounded-none border border-white/20 bg-black/30 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <Camera className="w-4 h-4 text-white/80" />
            <span className="text-xs font-light tracking-[0.3em] uppercase text-white/80">Photographer</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            {profile?.display_name || "Anonymous"}
          </motion.h1>

          {portfolio?.headline && (
            <motion.p 
              className="text-xl md:text-2xl text-white/60 font-light mb-12 max-w-2xl mx-auto tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
            >
              {portfolio.headline}
            </motion.p>
          )}

          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
          >
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-none border-white/30 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 tracking-widest text-xs px-8"
              onClick={() => scrollTo('works')}
            >
              <Focus className="w-4 h-4 mr-2" />
              VIEW GALLERY
            </Button>
            {profile?.email && (
              <Button 
                size="lg" 
                className="rounded-none bg-white text-black hover:bg-white/90 tracking-widest text-xs px-8"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  GET IN TOUCH
                </a>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Bio Section - Split View */}
      <section id="bio" className="py-32 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Photo - Polaroid Style */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-4 pb-16 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] bg-neutral-200 overflow-hidden">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-8xl bg-neutral-800 text-white rounded-none">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="absolute bottom-4 left-4 right-4 text-center text-black font-handwriting text-lg">
                  {profile?.display_name}
                </p>
              </div>
              {/* Decorative Camera */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white/40" />
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">About Me</p>
              <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide">{profile?.display_name}</h2>
              
              {portfolio?.bio && (
                <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section - Camera Settings Style */}
      {skills.length > 0 && (
        <section id="skills" className="py-32 px-6 bg-[#111]">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Expertise</p>
              <h2 className="text-3xl font-light tracking-wide">Equipment & Skills</h2>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div 
                  key={skill.id}
                  className="bg-black/50 border border-white/10 p-6 text-center hover:border-white/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Aperture className="w-6 h-6 text-white/40 mx-auto mb-3" />
                  <p className="text-sm text-white/80 tracking-wide">{skill.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-32 px-6 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-4xl">
            {education.length > 0 && (
              <div className="mb-20">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Background</p>
                  <h2 className="text-3xl font-light tracking-wide">Education</h2>
                </motion.div>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="border-l-2 border-white/20 pl-8 py-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GraduationCap className="w-6 h-6 text-white/40 mb-3" />
                      <h3 className="text-xl font-light mb-2">{edu.degree}</h3>
                      <p className="text-white/60">{edu.institution}</p>
                      {edu.field_of_study && <p className="text-sm text-white/40 mt-1">{edu.field_of_study}</p>}
                      <p className="text-xs text-white/30 mt-2">
                        {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <div>
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Career</p>
                  <h2 className="text-3xl font-light tracking-wide">Experience</h2>
                </motion.div>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="border-l-2 border-white/20 pl-8 py-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Briefcase className="w-6 h-6 text-white/40 mb-3" />
                      <h3 className="text-xl font-light mb-2">{exp.position}</h3>
                      <p className="text-white/60">{exp.company}</p>
                      <p className="text-xs text-white/30 mt-2">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {exp.description && <p className="text-white/50 mt-3 text-sm">{exp.description}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery Section - Masonry Grid */}
      {projects.length > 0 && (
        <section id="works" className="py-32 px-6 bg-[#111]">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Portfolio</p>
              <h2 className="text-3xl font-light tracking-wide">Selected Works</h2>
            </motion.div>

            {/* Featured Works */}
            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {featuredProjects.map((project, i) => (
                  <motion.div 
                    key={project.id}
                    className="group relative aspect-[4/3] overflow-hidden bg-neutral-900"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-16 h-16 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <Badge className="mb-2 bg-white text-black border-0 text-xs">Featured</Badge>
                      <h3 className="text-lg font-light">{project.title}</h3>
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white mt-2">
                          <ExternalLink className="w-3 h-3" />View Project
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Other Projects - Smaller Grid */}
            {otherProjects.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherProjects.map((project, i) => (
                  <motion.div 
                    key={project.id}
                    className="group relative aspect-square overflow-hidden bg-neutral-900"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-light text-sm">{project.title}</h3>
                        {project.live_url && (
                          <Button size="sm" variant="ghost" className="mt-2 text-white" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-white text-black">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Camera className="w-12 h-12 mx-auto mb-6 text-black/30" />
            <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-4">Get In Touch</p>
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide">Let's Create Together</h2>
            <p className="text-black/60 mb-8">
              Ready to capture your story? Reach out and let's create something beautiful.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button size="lg" className="rounded-none bg-black text-white hover:bg-black/90 tracking-widest text-xs" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-none border-black/20 tracking-widest text-xs" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Film Strip */}
      <footer className="py-8 px-6 bg-black border-t border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Aperture className="w-5 h-5 text-white/40" />
            <span className="font-light tracking-widest uppercase text-sm text-white/60">{profile?.display_name || "Portfolio"}</span>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 4).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
