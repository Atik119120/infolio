import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Film, Play, Pause, SkipForward,
  Briefcase, GraduationCap, Menu, X, Video, Volume2, Maximize
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoEditorTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const colors = {
    primary: "#9999FF",
    accent: "#00D8FF", 
    purple: "#EA77FF",
    dark: "#1E1E1E",
    panel: "#232323",
    timeline: "#2D2D2D",
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeline(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.3));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const formatTime = (p: number) => {
    const totalSecs = (p / 100) * 120;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const frames = Math.floor((totalSecs % 1) * 24);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: colors.dark }}>
      {/* Loading Animation */}
      <AnimatePresence>
        {!showTimeline && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: colors.dark }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 rounded-xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: colors.purple }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" }}
              >
                <span className="text-3xl font-black">Pr</span>
              </motion.div>
              <motion.p 
                className="text-white/50 text-sm tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                PREMIERE PRO
              </motion.p>
              <motion.div 
                className="w-40 h-1 bg-white/10 rounded-full mt-4 overflow-hidden mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: colors.purple }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: colors.panel }}>
        <div className="flex items-center px-4 py-2 border-b border-white/10">
          <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm" style={{ backgroundColor: colors.purple }}>
              Pr
            </div>
            <span className="font-semibold text-sm hidden sm:block">{profile?.display_name || "Editor"}</span>
          </motion.div>

          <div className="hidden md:flex items-center ml-8 gap-1">
            {["File", "Edit", "Sequence", "Window"].map((item) => (
              <button key={item} className="px-3 py-1 text-xs text-white/60 hover:bg-white/5 rounded">
                {item}
              </button>
            ))}
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              {["hero", "bio", "skills", "works", "contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item)} 
                  className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider"
                >
                  {item === "hero" ? "Home" : item}
                </button>
              ))}
            </div>
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 md:hidden">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden border-b border-white/10 px-6 py-4"
              style={{ backgroundColor: colors.panel }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="block w-full text-left py-3 text-white/70"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Program Monitor */}
      <section id="hero" className="min-h-screen pt-12 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            className="relative w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
          >
            {/* Monitor Frame */}
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: colors.panel }}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/50">Program: {profile?.display_name || "Sequence 01"}</span>
                <span className="text-xs font-mono" style={{ color: colors.accent }}>{formatTime(progress)}</span>
              </div>

              {/* Video Preview */}
              <div className="relative aspect-video bg-black overflow-hidden">
                {allProjects[0]?.image_url ? (
                  <motion.img
                    src={allProjects[0].image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    animate={{ scale: isPlaying ? [1, 1.01, 1] : 1 }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EA77FF]/20 to-[#00D8FF]/20">
                    <Video className="w-20 h-20 text-white/20" />
                  </div>
                )}
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-center px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
                      <Badge className="mb-4 border-0" style={{ backgroundColor: colors.purple }}>
                        <Film className="w-3 h-3 mr-2" />
                        Video Editor & Motion Designer
                      </Badge>
                    </motion.div>
                    
                    <motion.h1 
                      className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 }}
                    >
                      {profile?.display_name || "Creative Editor"}
                    </motion.h1>
                    
                    {portfolio?.headline && (
                      <motion.p 
                        className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.6 }}
                      >
                        {portfolio.headline}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Safe Area Guides */}
                <div className="absolute inset-[5%] border border-white/10 pointer-events-none hidden sm:block" />
              </div>

              {/* Playback Controls */}
              <div className="px-4 py-3 flex items-center gap-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full" style={{ backgroundColor: colors.accent, width: `${progress}%` }} />
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-white/50" />
                  <Maximize className="w-4 h-4 text-white/50" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
            >
              <Button size="lg" className="rounded-lg" style={{ backgroundColor: colors.purple }} onClick={() => scrollTo('works')}>
                <Play className="w-4 h-4 mr-2" />
                Watch My Reel
              </Button>
              {profile?.email && (
                <Button size="lg" variant="outline" className="rounded-lg border-white/20" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Hire Me
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Timeline Preview */}
        <motion.div 
          className="hidden lg:block border-t border-white/10"
          style={{ backgroundColor: colors.timeline }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <div className="flex items-center px-4 py-2 border-b border-white/10">
            <span className="text-xs text-white/50">Timeline: Main Sequence</span>
          </div>
          <div className="h-20 relative overflow-hidden">
            {/* Playhead */}
            <motion.div 
              className="absolute top-0 bottom-0 w-0.5 z-10"
              style={{ backgroundColor: colors.accent, left: `${progress}%` }}
            >
              <div className="w-3 h-3 -ml-1.5 -mt-1" style={{ backgroundColor: colors.accent, clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
            </motion.div>

            {/* Video Tracks */}
            <div className="absolute left-0 right-0 top-2 h-6 flex gap-1 px-2">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="flex-1 rounded"
                  style={{ backgroundColor: i % 2 === 0 ? colors.purple : "#666699" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 3 + i * 0.1 }}
                />
              ))}
            </div>

            {/* Audio Track */}
            <div className="absolute left-0 right-0 bottom-2 h-5 flex gap-1 px-2">
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="flex-1 rounded flex items-center justify-center"
                  style={{ backgroundColor: "#3D997A" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 3.2 + i * 0.05 }}
                >
                  <div className="flex items-center gap-px">
                    {[...Array(8)].map((_, j) => (
                      <div key={j} className="w-0.5 bg-white/30" style={{ height: `${Math.random() * 10 + 4}px` }} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Profile Panel */}
            <motion.div 
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: colors.panel }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/50">Source: profile.mp4</span>
              </div>
              <div className="aspect-square relative">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="text-6xl sm:text-8xl rounded-none" style={{ backgroundColor: colors.purple }}>
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-mono text-xs" style={{ color: colors.accent }}>00:00:00:00</p>
                </div>
              </div>
            </motion.div>

            {/* Bio Content Panel */}
            <motion.div 
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: colors.panel }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/50">Effect Controls</span>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.purple }}>About Me</h2>
                <h3 className="text-2xl sm:text-3xl font-black mb-6">{profile?.display_name}</h3>
                
                {portfolio?.bio && (
                  <p className="text-white/60 leading-relaxed mb-6">{portfolio.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-6">
                  {portfolio?.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: colors.accent }} />
                      {portfolio.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                      <Mail className="w-4 h-4" style={{ color: colors.accent }} />
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
                          className="w-10 h-10 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                          style={{ backgroundColor: colors.timeline }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4" style={{ backgroundColor: colors.panel }}>
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.purple }}>Expertise</h2>
              <h3 className="text-3xl sm:text-4xl font-black">Editing Tools</h3>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((skill, i) => (
                <motion.div 
                  key={skill.id}
                  className="rounded-lg p-4 text-center border border-white/5 hover:border-white/10 transition-colors"
                  style={{ backgroundColor: colors.timeline }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Film className="w-5 h-5 mx-auto mb-2" style={{ color: colors.accent }} />
                  <p className="text-xs sm:text-sm text-white/70">{skill.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-24 sm:py-32 px-4">
          <div className="max-w-4xl mx-auto">
            {education.length > 0 && (
              <div className="mb-16 sm:mb-20">
                <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.accent }}>Background</h2>
                  <h3 className="text-3xl sm:text-4xl font-black">Education</h3>
                </motion.div>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="rounded-lg p-6 border border-white/5"
                      style={{ backgroundColor: colors.panel }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.accent }}>
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{edu.degree}</h4>
                          <p style={{ color: colors.accent }}>{edu.institution}</p>
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
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.purple }}>Career</h2>
                  <h3 className="text-3xl sm:text-4xl font-black">Experience</h3>
                </motion.div>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="rounded-lg p-6 border border-white/5"
                      style={{ backgroundColor: colors.panel }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.purple }}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{exp.position}</h4>
                          <p style={{ color: colors.purple }}>{exp.company}</p>
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
        <section id="works" className="py-24 sm:py-32 px-4" style={{ backgroundColor: colors.panel }}>
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.purple }}>Portfolio</h2>
              <h3 className="text-3xl sm:text-4xl font-black">My Work</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group relative rounded-lg overflow-hidden"
                  style={{ backgroundColor: colors.timeline }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EA77FF]/20 to-[#00D8FF]/20">
                        <Film className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    {/* Play Button Overlay */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-black/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.purple }}>
                        <Play className="w-6 h-6 ml-1" />
                      </div>
                    </motion.div>
                    {project.featured && (
                      <Badge className="absolute top-3 left-3 border-0" style={{ backgroundColor: colors.purple }}>Featured</Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-1">{project.title}</h4>
                    {project.description && (
                      <p className="text-sm text-white/50 line-clamp-2">{project.description}</p>
                    )}
                    {(project.live_url || project.github_url) && (
                      <div className="flex gap-3 mt-3">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.purple }}>Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">Let's Create Together</h3>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Ready to bring your vision to life? Let's discuss your next video project.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-lg" style={{ backgroundColor: colors.purple }} asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-lg border-white/20" asChild>
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
      <footer className="py-8 px-4 border-t border-white/5" style={{ backgroundColor: colors.panel }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm" style={{ backgroundColor: colors.purple }}>
              Pr
            </div>
            <span className="text-sm text-white/40">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
