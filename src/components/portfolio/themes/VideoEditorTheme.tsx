import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Film, Play, Pause, SkipForward,
  Briefcase, GraduationCap, Menu, X, Video, MonitorPlay, Volume2, Maximize
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoEditorTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  // Premiere Pro colors
  const premiereColors = {
    primary: "#9999FF",
    accent: "#00D8FF", 
    purple: "#EA77FF",
    pink: "#FF2D95",
    dark: "#1E1E1E",
    panel: "#232323",
    timeline: "#2D2D2D",
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeline(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ backgroundColor: premiereColors.dark }}>
      {/* Premiere Pro Style Loading */}
      <AnimatePresence>
        {!showTimeline && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: premiereColors.dark }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              {/* Premiere Pro Logo Animation */}
              <motion.div 
                className="w-24 h-24 rounded-xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: premiereColors.purple }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1 }}
              >
                <span className="text-4xl font-black">Pr</span>
              </motion.div>
              <motion.p 
                className="text-white/60 text-sm tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                PREMIERE PRO
              </motion.p>
              <motion.div 
                className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: premiereColors.purple }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Premiere Menu Bar Style */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: premiereColors.panel }}>
        <div className="flex items-center px-4 py-2 border-b border-white/10">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: premiereColors.purple }}
            >
              Pr
            </div>
            <span className="font-semibold text-sm hidden md:block">{profile?.display_name || "Editor"}</span>
          </motion.div>

          {/* Menu Items - Premiere Style */}
          <div className="hidden md:flex items-center ml-8 gap-1">
            {["File", "Edit", "Project", "Sequence", "Window", "Help"].map((item, i) => (
              <button
                key={item}
                className="px-3 py-1 text-xs text-white/70 hover:bg-white/10 rounded transition-colors"
              >
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
                  className="text-xs text-white/60 hover:text-white transition-colors uppercase tracking-wider"
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
              className="md:hidden border-b border-white/10 px-6 py-4 space-y-3"
              style={{ backgroundColor: premiereColors.panel }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="block w-full text-left py-2 text-white/80"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Preview Window Style */}
      <section id="hero" className="min-h-screen pt-12 relative flex flex-col">
        {/* Program Monitor */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            className="relative w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          >
            {/* Monitor Frame */}
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: premiereColors.panel }}>
              {/* Monitor Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/60">Program: {profile?.display_name || "Sequence 01"}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#00D8FF] font-mono">{formatTime(progress * 0.6)}</span>
                </div>
              </div>

              {/* Video Preview */}
              <div className="relative aspect-video bg-black overflow-hidden">
                {projects[0]?.image_url ? (
                  <motion.img
                    src={projects[0].image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EA77FF]/20 to-[#00D8FF]/20">
                    <Video className="w-24 h-24 text-white/20" />
                  </div>
                )}
                
                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2 }}
                    >
                      <Badge 
                        className="mb-4 border-0"
                        style={{ backgroundColor: premiereColors.purple }}
                      >
                        <Film className="w-3 h-3 mr-2" />
                        Video Editor & Motion Designer
                      </Badge>
                    </motion.div>
                    
                    <motion.h1 
                      className="text-5xl md:text-7xl lg:text-8xl font-black mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 }}
                    >
                      {profile?.display_name || "Creative Editor"}
                    </motion.h1>
                    
                    {portfolio?.headline && (
                      <motion.p 
                        className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.4 }}
                      >
                        {portfolio.headline}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Safe Area Guides */}
                <div className="absolute inset-[5%] border border-white/10 pointer-events-none" />
                <div className="absolute inset-[10%] border border-white/5 pointer-events-none" />
              </div>

              {/* Playback Controls */}
              <div className="px-4 py-3 flex items-center gap-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full"
                    style={{ backgroundColor: premiereColors.accent, width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-white/60" />
                  <Maximize className="w-4 h-4 text-white/60" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
            >
              <Button 
                size="lg" 
                className="rounded-lg"
                style={{ backgroundColor: premiereColors.purple }}
                onClick={() => scrollTo('works')}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch My Reel
              </Button>
              {profile?.email && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-lg border-white/20"
                  asChild
                >
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
          style={{ backgroundColor: premiereColors.timeline }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div className="flex items-center px-4 py-2 border-b border-white/10">
            <span className="text-xs text-white/60">Timeline: Main Sequence</span>
          </div>
          <div className="h-24 relative overflow-hidden">
            {/* Playhead */}
            <motion.div 
              className="absolute top-0 bottom-0 w-0.5 z-10"
              style={{ backgroundColor: premiereColors.accent, left: `${progress}%` }}
            >
              <div 
                className="w-3 h-3 -ml-1.5 -mt-1"
                style={{ backgroundColor: premiereColors.accent, clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
              />
            </motion.div>

            {/* Video Tracks */}
            <div className="absolute left-0 right-0 top-2 h-8 flex gap-1 px-2">
              {projects.slice(0, 6).map((_, i) => (
                <motion.div 
                  key={i}
                  className="flex-1 rounded"
                  style={{ 
                    backgroundColor: i % 2 === 0 ? premiereColors.purple : "#666699",
                    opacity: 0.8
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.7 + i * 0.1 }}
                />
              ))}
            </div>

            {/* Audio Track */}
            <div className="absolute left-0 right-0 bottom-2 h-6 flex gap-1 px-2">
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="flex-1 rounded flex items-center justify-center"
                  style={{ backgroundColor: "#3D997A" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.9 + i * 0.05 }}
                >
                  {/* Waveform */}
                  <div className="flex items-center gap-px">
                    {[...Array(10)].map((_, j) => (
                      <div 
                        key={j}
                        className="w-0.5 bg-white/30"
                        style={{ height: `${Math.random() * 12 + 4}px` }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bio Section - Panel Style */}
      <section id="bio" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Profile Panel */}
            <motion.div 
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: premiereColors.panel }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/60">Source: profile.mp4</span>
              </div>
              <div className="aspect-square relative">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback 
                    className="text-8xl rounded-none"
                    style={{ backgroundColor: premiereColors.purple }}
                  >
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-mono text-xs text-[#00D8FF]">00:00:00:00</p>
                </div>
              </div>
            </motion.div>

            {/* Bio Content Panel */}
            <motion.div 
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: premiereColors.panel }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/60">Effect Controls</span>
              </div>
              <div className="p-6">
                <h2 className="text-sm uppercase tracking-widest mb-2" style={{ color: premiereColors.purple }}>About</h2>
                <h3 className="text-3xl font-bold mb-4">{profile?.display_name}</h3>
                
                {portfolio?.bio && (
                  <p className="text-white/60 leading-relaxed mb-6">
                    {portfolio.bio}
                  </p>
                )}

                <div className="space-y-3 mb-6">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <MapPin className="w-4 h-4" style={{ color: premiereColors.accent }} />
                      {portfolio.location}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex gap-2">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                          style={{ backgroundColor: premiereColors.timeline }}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section - Effects Panel */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: premiereColors.panel }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/60">Effects</span>
                <span className="text-xs text-white/40">{skills.length} items</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Software & Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {skills.map((skill, i) => (
                    <motion.div 
                      key={skill.id}
                      className="p-4 rounded text-center hover:bg-white/5 transition-colors cursor-default"
                      style={{ backgroundColor: premiereColors.timeline }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Film className="w-5 h-5 mx-auto mb-2" style={{ color: premiereColors.purple }} />
                      <p className="text-sm">{skill.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Education & Experience - Metadata Panel */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            {education.length > 0 && (
              <motion.div 
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: premiereColors.panel }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-white/60">Metadata: Education</span>
                </div>
                <div className="p-6 space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded" style={{ backgroundColor: premiereColors.timeline }}>
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 mt-1" style={{ color: premiereColors.accent }} />
                        <div>
                          <h4 className="font-bold">{edu.degree}</h4>
                          <p style={{ color: premiereColors.accent }}>{edu.institution}</p>
                          {edu.field_of_study && <p className="text-sm text-white/40">{edu.field_of_study}</p>}
                          <p className="text-xs text-white/30 mt-1">
                            {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {experiences.length > 0 && (
              <motion.div 
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: premiereColors.panel }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center px-4 py-2 border-b border-white/10">
                  <span className="text-xs text-white/60">Metadata: Experience</span>
                </div>
                <div className="p-6 space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded" style={{ backgroundColor: premiereColors.timeline }}>
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 mt-1" style={{ color: premiereColors.purple }} />
                        <div>
                          <h4 className="font-bold">{exp.position}</h4>
                          <p style={{ color: premiereColors.purple }}>{exp.company}</p>
                          <p className="text-xs text-white/30 mt-1">
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </p>
                          {exp.description && <p className="text-white/60 mt-2 text-sm">{exp.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Works Section - Media Browser */}
      {projects.length > 0 && (
        <section id="works" className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div 
              className="rounded-lg overflow-hidden max-w-6xl mx-auto"
              style={{ backgroundColor: premiereColors.panel }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs text-white/60">Project: Portfolio</span>
                <span className="text-xs text-white/40">{projects.length} clips</span>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...featuredProjects, ...otherProjects].map((project, i) => (
                    <motion.div 
                      key={project.id}
                      className="group rounded overflow-hidden cursor-pointer"
                      style={{ backgroundColor: premiereColors.timeline }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 text-white/20" />
                          </div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: premiereColors.purple }}
                          >
                            <Play className="w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                        {project.featured && (
                          <Badge 
                            className="absolute top-2 left-2 border-0"
                            style={{ backgroundColor: premiereColors.purple }}
                          >
                            Featured
                          </Badge>
                        )}
                        {/* Duration */}
                        <span className="absolute bottom-2 right-2 text-xs font-mono bg-black/60 px-2 py-0.5 rounded">
                          00:{(i + 1).toString().padStart(2, '0')}:00
                        </span>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm truncate">{project.title}</h4>
                        {project.description && (
                          <p className="text-xs text-white/40 mt-1 line-clamp-1">{project.description}</p>
                        )}
                        {project.live_url && (
                          <a 
                            href={project.live_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs mt-2 hover:underline"
                            style={{ color: premiereColors.accent }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Watch
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div 
            className="rounded-lg overflow-hidden text-center"
            style={{ backgroundColor: premiereColors.panel }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="px-4 py-2 border-b border-white/10">
              <span className="text-xs text-white/60">Export Settings</span>
            </div>
            <div className="p-8">
              <div 
                className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: premiereColors.purple }}
              >
                <MonitorPlay className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Let's Create Together</h2>
              <p className="text-white/60 mb-8">
                Ready to bring your vision to life? Get in touch and let's make something amazing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {profile?.email && (
                  <Button 
                    size="lg" 
                    className="rounded-lg"
                    style={{ backgroundColor: premiereColors.purple }}
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      {profile.email}
                    </a>
                  </Button>
                )}
                {portfolio?.phone && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-lg border-white/20"
                    asChild
                  >
                    <a href={`tel:${portfolio.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {portfolio.phone}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/10" style={{ backgroundColor: premiereColors.panel }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: premiereColors.purple }}
            >
              Pr
            </div>
            <span className="font-semibold text-sm">{profile?.display_name || "Editor"}</span>
          </div>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 4).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
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
