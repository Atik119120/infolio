import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Film, Play, Pause, SkipForward,
  Briefcase, GraduationCap, Menu, X, Video, Volume2, Maximize, Clapperboard, Sparkles
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

export default function VideoEditorTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeline(true), 2200);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#12121f] to-[#0d0d18] text-white">
      {/* Loading Animation */}
      <AnimatePresence>
        {!showTimeline && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#0a0a12] via-[#1a1a2e] to-[#0d0d18]"
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-24 h-24 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 shadow-2xl shadow-purple-500/30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Clapperboard className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h2
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Video Editor
              </motion.h2>
              <motion.div 
                className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 1 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Clapperboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-sm hidden sm:block">{profile?.display_name || "Editor"}</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Works", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm text-white/50 hover:text-purple-400 transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 + i * 0.1 }}
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
              className="md:hidden bg-[#0a0a12]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4"
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
      </motion.nav>

      {/* Hero Section - Program Monitor */}
      <section id="hero" className="min-h-screen pt-14 flex items-center justify-center px-4">
        <motion.div 
          className="w-full max-w-5xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          {/* Monitor Frame */}
          <div className="rounded-2xl overflow-hidden bg-[#1a1a2e]/80 border border-white/10 shadow-2xl shadow-purple-500/10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#12121f]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-white/40">Program: {profile?.display_name || "Sequence 01"}</span>
              </div>
              <span className="text-xs font-mono text-purple-400">{formatTime(progress)}</span>
            </div>

            {/* Video Preview */}
            <div className="relative aspect-video bg-black overflow-hidden">
              {allProjects[0]?.image_url ? (
                <motion.img
                  src={allProjects[0].image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-red-900/30">
                  <Video className="w-24 h-24 text-white/10" />
                </div>
              )}
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center px-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 2.4 }}
                  >
                    <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
                      <Film className="w-3 h-3 mr-2" />
                      Video Editor & Motion Designer
                    </Badge>
                  </motion.div>
                  
                  <motion.h1 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.6 }}
                  >
                    {profile?.display_name || "Creative Editor"}
                  </motion.h1>
                  
                  {portfolio?.headline && (
                    <motion.p 
                      className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.8 }}
                    >
                      {portfolio.headline}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Safe Area Guides */}
              <div className="absolute inset-[5%] border border-purple-500/20 pointer-events-none hidden sm:block" />
            </div>

            {/* Playback Controls */}
            <div className="px-4 py-3 flex items-center gap-4 border-t border-white/10 bg-[#12121f]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-white/40" />
                <Maximize className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
          >
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 px-8"
              onClick={() => scrollTo('works')}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch My Reel
            </Button>
            {profile?.email && (
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-8" 
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Hire Me
                </a>
              </Button>
            )}
          </motion.div>

          {/* Timeline Preview */}
          <motion.div 
            className="hidden lg:block mt-8 rounded-xl overflow-hidden bg-[#1a1a2e]/60 border border-white/5"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <div className="flex items-center px-4 py-2 border-b border-white/5 bg-[#12121f]/80">
              <span className="text-xs text-white/40">Timeline: Main Sequence</span>
            </div>
            <div className="h-20 relative overflow-hidden p-2">
              {/* Playhead */}
              <motion.div 
                className="absolute top-0 bottom-0 w-0.5 z-10 bg-gradient-to-b from-purple-500 to-pink-500"
                style={{ left: `${progress}%` }}
              >
                <div className="w-4 h-4 -ml-1.5 -mt-1 bg-gradient-to-r from-purple-500 to-pink-500" style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
              </motion.div>

              {/* Video Tracks */}
              <div className="flex gap-1 h-7 mb-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 rounded bg-gradient-to-r from-purple-600 to-pink-600 opacity-80"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 3.4 + i * 0.05 }}
                  />
                ))}
              </div>

              {/* Audio Track */}
              <div className="flex gap-1 h-5">
                {[...Array(10)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 rounded bg-gradient-to-r from-green-500 to-emerald-500 opacity-60 flex items-center justify-center"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 3.6 + i * 0.03 }}
                  >
                    <div className="flex items-center gap-px">
                      {[...Array(6)].map((_, j) => (
                        <div key={j} className="w-0.5 bg-white/40" style={{ height: `${Math.random() * 8 + 4}px` }} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Profile Panel */}
            <ScrollReveal direction="left">
              <div className="rounded-2xl overflow-hidden bg-[#1a1a2e]/60 border border-white/10">
                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#12121f]/80">
                  <span className="text-xs text-white/40">Source: profile.mp4</span>
                </div>
                <div className="aspect-square relative">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-6xl sm:text-8xl rounded-none bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="font-mono text-xs text-purple-400">00:00:00:00</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Bio Content Panel */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="rounded-2xl overflow-hidden bg-[#1a1a2e]/60 border border-white/10 h-full">
                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#12121f]/80">
                  <span className="text-xs text-white/40">Effect Controls</span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs tracking-widest uppercase text-purple-400">About Me</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    {profile?.display_name}
                  </h3>
                  
                  {portfolio?.bio && (
                    <p className="text-white/60 leading-relaxed mb-6">{portfolio.bio}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/40 mb-6">
                    {portfolio?.location && (
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        {portfolio.location}
                      </span>
                    )}
                    {profile?.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                        <Mail className="w-4 h-4 text-purple-400" />
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
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center hover:from-purple-500 hover:to-pink-500 transition-all"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Icon className="w-5 h-5 text-purple-400" />
                          </motion.a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#12121f]/50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
                  <Film className="w-4 h-4 text-pink-400" />
                  <span className="text-xs tracking-widest uppercase text-pink-400">Expertise</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Editing Tools
                </h2>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 0.05}>
                  <motion.div 
                    className="bg-[#1a1a2e]/60 border border-white/5 rounded-2xl p-5 text-center hover:border-purple-500/30 transition-all group"
                    whileHover={{ y: -5 }}
                  >
                    <Film className="w-6 h-6 mx-auto mb-3 text-purple-500/50 group-hover:text-purple-400 transition-colors" />
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
                      <GraduationCap className="w-4 h-4 text-pink-400" />
                      <span className="text-xs tracking-widest uppercase text-pink-400">Background</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white">Education</h2>
                  </div>
                </ScrollReveal>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <div className="bg-[#1a1a2e]/60 border border-white/5 rounded-2xl p-6 hover:border-pink-500/30 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">{edu.degree}</h4>
                            <p className="text-pink-400">{edu.institution}</p>
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <span className="text-xs tracking-widest uppercase text-purple-400">Career</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white">Experience</h2>
                  </div>
                </ScrollReveal>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="bg-[#1a1a2e]/60 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">{exp.position}</h4>
                            <p className="text-purple-400">{exp.company}</p>
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

      {/* Works Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#12121f]/50">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span className="text-xs tracking-widest uppercase text-purple-400">Portfolio</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  My Work
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <motion.div 
                    className="group relative rounded-2xl overflow-hidden bg-[#1a1a2e]/60 border border-white/5 hover:border-purple-500/30 transition-all"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                          <Film className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                      {/* Play Button Overlay */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                      >
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30">
                          <Play className="w-7 h-7 ml-1 text-white" />
                        </div>
                      </motion.div>
                      {project.featured && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 border-0">Featured</Badge>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold mb-1 text-white">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm text-white/50 line-clamp-2">{project.description}</p>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-purple-400 text-sm hover:text-purple-300">
                          Watch <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-xs tracking-widest uppercase text-purple-400">Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Let's Create Together
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Ready to bring your vision to life? Let's discuss your next video project.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 px-8" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-8" asChild>
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
                  <MapPin className="w-4 h-4 text-purple-500" />
                  {portfolio.location}
                </span>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-white/5 bg-[#0a0a12]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white/40">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
