import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Camera, Aperture, Focus,
  Briefcase, GraduationCap, Menu, X, Instagram, Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotographerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shutterActive, setShutterActive] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    const timer = setTimeout(() => setShutterActive(false), 2000);
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
    <div className="min-h-screen bg-black text-white">
      {/* Shutter Animation */}
      <AnimatePresence>
        {shutterActive && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-64 h-64">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 bg-zinc-900"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((i * 45 * Math.PI) / 180)}% ${50 + 50 * Math.sin((i * 45 * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((i + 1) * 45 * Math.PI) / 180)}% ${50 + 50 * Math.sin(((i + 1) * 45 * Math.PI) / 180)}%)`,
                  }}
                  initial={{ scale: 1 }}
                  animate={{ scale: 0 }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                />
              ))}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Aperture className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '2s' }} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Aperture className="w-6 h-6" />
              <span className="text-sm tracking-[0.3em] uppercase font-light">{profile?.display_name || "Photographer"}</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Gallery", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "gallery" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors"
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
              className="md:hidden bg-black border-t border-white/10 px-6 py-4"
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
      </nav>

      {/* Hero Section */}
      <section id="hero" className="h-screen relative overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
              </motion.div>
            )}
          </AnimatePresence>
          {!allProjects[activeImage]?.image_url && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
          )}
        </div>

        {/* Viewfinder Overlay */}
        <div className="absolute inset-4 sm:inset-8 md:inset-16 border border-white/20 pointer-events-none z-10">
          <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-white/60" />
          <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-white/60" />
          <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-white/60" />
          <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-white/60" />
          {/* Center Focus */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/30">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
          </div>
        </div>

        {/* Camera Info */}
        <div className="absolute top-20 left-4 sm:left-8 text-[10px] font-mono text-white/40 space-y-1 z-10">
          <div className="flex items-center gap-2"><Aperture className="w-3 h-3" /> f/1.8</div>
          <div className="flex items-center gap-2"><Camera className="w-3 h-3" /> 1/250s</div>
          <div>ISO 100</div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-black/30 backdrop-blur-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <Camera className="w-4 h-4" />
            <span className="text-xs tracking-[0.2em] uppercase">Photographer</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            {profile?.display_name || "Photographer"}
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
              variant="outline" 
              className="border-white/30 bg-transparent text-white hover:bg-white hover:text-black rounded-none px-8 tracking-widest text-xs"
              onClick={() => scrollTo('works')}
            >
              <Eye className="w-4 h-4 mr-2" />
              VIEW GALLERY
            </Button>
            {profile?.email && (
              <Button 
                className="bg-white text-black hover:bg-white/90 rounded-none px-8 tracking-widest text-xs"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  CONTACT ME
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
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Polaroid Style Photo */}
            <motion.div 
              className="relative mx-auto lg:mx-0"
              initial={{ opacity: 0, rotate: -5 }}
              whileInView={{ opacity: 1, rotate: -2 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-3 sm:p-4 pb-12 sm:pb-16 shadow-2xl max-w-sm">
                <div className="aspect-[4/5] bg-zinc-200 overflow-hidden">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-6xl sm:text-8xl bg-zinc-800 text-white rounded-none">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-black text-center text-sm sm:text-lg mt-3 sm:mt-4 font-serif italic">
                  {profile?.display_name}
                </p>
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">About Me</p>
              <h2 className="text-3xl sm:text-4xl font-light mb-6 tracking-wide">{profile?.display_name}</h2>
              
              {portfolio?.bio && (
                <p className="text-base sm:text-lg text-white/60 font-light leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/40 mb-8">
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
                        className="w-11 h-11 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        whileHover={{ scale: 1.05 }}
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Expertise</p>
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide">Equipment & Skills</h2>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {skills.map((skill, i) => (
                <motion.div 
                  key={skill.id}
                  className="bg-zinc-900/50 border border-white/5 p-4 sm:p-6 text-center hover:border-white/20 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Aperture className="w-5 h-5 text-white/30 mx-auto mb-3" />
                  <p className="text-xs sm:text-sm text-white/70 tracking-wide">{skill.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            {education.length > 0 && (
              <div className="mb-16 sm:mb-20">
                <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Background</p>
                  <h2 className="text-3xl sm:text-4xl font-light">Education</h2>
                </motion.div>
                <div className="space-y-4 sm:space-y-6">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4 sm:gap-6">
                        <GraduationCap className="w-6 h-6 text-white/40 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-light">{edu.degree}</h3>
                          <p className="text-white/60 text-sm sm:text-base">{edu.institution}</p>
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
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Career</p>
                  <h2 className="text-3xl sm:text-4xl font-light">Experience</h2>
                </motion.div>
                <div className="space-y-4 sm:space-y-6">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4 sm:gap-6">
                        <Briefcase className="w-6 h-6 text-white/40 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-light">{exp.position}</h3>
                          <p className="text-white/60 text-sm sm:text-base">{exp.company}</p>
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

      {/* Gallery Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-light">Gallery</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-black/70 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center p-4">
                      <h3 className="text-lg font-light mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                      )}
                      {(project.live_url || project.github_url) && (
                        <div className="flex justify-center gap-3 mt-4">
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  {project.featured && (
                    <div className="absolute top-3 left-3 bg-white text-black text-[10px] px-2 py-1 tracking-wider uppercase">
                      Featured
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-6">Let's Create Together</h2>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Ready to capture your story? Let's discuss your vision and create something beautiful together.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 rounded-none px-8 tracking-widest text-xs"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    EMAIL ME
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 rounded-none px-8 tracking-widest text-xs"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    CALL ME
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-white/40">
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
      <footer className="py-8 px-4 sm:px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Aperture className="w-5 h-5 text-white/40" />
            <span className="text-xs tracking-widest text-white/40 uppercase">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
