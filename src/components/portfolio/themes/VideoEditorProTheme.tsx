import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin, Mail, Phone, ExternalLink, Film, Play, Pause, SkipForward,
  Briefcase, GraduationCap, Menu, X, Video, Volume2, Maximize, Clapperboard, 
  Sparkles, Scissors, Layers, Wand2, Zap, MonitorPlay
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// DaVinci Resolve Inspired Color Wheels
const ColorWheels = () => {
  return (
    <div className="flex gap-4 justify-center">
      {['Lift', 'Gamma', 'Gain'].map((name, i) => (
        <div key={name} className="text-center">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Outer ring */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              {/* Color gradient */}
              <defs>
                <linearGradient id={`wheel-${i}`} gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor={i === 0 ? '#ef4444' : i === 1 ? '#22c55e' : '#3b82f6'} />
                  <stop offset="100%" stopColor={i === 0 ? '#f97316' : i === 1 ? '#10b981' : '#8b5cf6'} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="none" stroke={`url(#wheel-${i})`} strokeWidth="4" opacity="0.5" />
              {/* Center dot */}
              <motion.circle 
                cx="50" 
                cy="50" 
                r="6" 
                fill={i === 0 ? '#ef4444' : i === 1 ? '#22c55e' : '#3b82f6'}
                animate={{ cx: [50, 55 - i * 5, 50], cy: [50, 45 + i * 3, 50] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Crosshairs */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
          </div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-2">{name}</p>
        </div>
      ))}
    </div>
  );
};

// Waveform Visualizer
const WaveformVisualizer = () => {
  return (
    <div className="h-12 flex items-center gap-[2px]">
      {[...Array(60)].map((_, i) => {
        const height = 20 + Math.sin(i * 0.3) * 30 + Math.random() * 20;
        return (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm"
            animate={{ height: [`${height}%`, `${height + 20}%`, `${height}%`] }}
            transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.02 }}
          />
        );
      })}
    </div>
  );
};

export default function VideoEditorProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activePanel, setActivePanel] = useState<'color' | 'edit' | 'fusion'>('color');
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Progress animation
  useEffect(() => {
    if (isPlaying && isLoaded) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isLoaded]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const formatTime = (p: number) => {
    const totalSecs = (p / 100) * 180;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const frames = Math.floor((totalSecs % 1) * 30);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Loading Screen - DaVinci Style */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#1a1a1a] flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-24 h-24 mx-auto mb-8 relative"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-red-500/30" />
                <div className="absolute inset-2 rounded-full border-2 border-orange-500/40" />
                <div className="absolute inset-4 rounded-full border-2 border-yellow-500/50" />
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <motion.h2
                className="text-xl font-bold tracking-wider text-neutral-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                DaVinci Pro
              </motion.h2>
              <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden mx-auto">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-neutral-600 mt-3">Loading color tools...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - DaVinci Top Menu */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#2a2a2a] border-b border-neutral-700"
        initial={{ y: -60 }}
        animate={{ y: isLoaded ? 0 : -60 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center h-10 px-2">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 border-r border-neutral-700 h-full">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-6 w-auto" />
            ) : (
              <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <span className="text-xs font-medium hidden sm:block">{profile?.display_name}</span>
          </div>

          {/* Page Tabs */}
          <div className="hidden md:flex items-center h-full">
            {[
              { id: 'color', icon: Wand2, label: 'Color' },
              { id: 'edit', icon: Scissors, label: 'Edit' },
              { id: 'fusion', icon: Layers, label: 'Fusion' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id as typeof activePanel)}
                className={`h-full px-4 flex items-center gap-2 text-xs border-r border-neutral-700 transition-colors ${
                  activePanel === tab.id 
                    ? 'bg-[#3a3a3a] text-white' 
                    : 'text-neutral-400 hover:text-white hover:bg-[#333]'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-4 px-4">
            {["Home", "About", "Works", "Contact"].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                className="text-[11px] text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                {item}
              </button>
            ))}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="lg:hidden bg-[#2a2a2a] border-t border-neutral-700 px-4 py-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Works", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="block w-full text-left py-2 text-neutral-400 text-sm"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - DaVinci Color Page */}
      <section id="hero" className="min-h-screen pt-10 bg-[#1a1a1a]">
        <div className="h-[calc(100vh-40px)] flex flex-col">
          {/* Main Viewer Area */}
          <div className="flex-1 flex">
            {/* Left Panel - Node Graph (Desktop) */}
            <motion.div 
              className="hidden xl:flex w-72 bg-[#222] border-r border-neutral-700 flex-col"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: isLoaded ? 0 : -100, opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-3 border-b border-neutral-700">
                <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider">Node Graph</h4>
              </div>
              <div className="flex-1 p-4 relative">
                {/* Sample nodes */}
                <div className="space-y-3">
                  {['Source', 'Color Correct', 'Curves', 'Output'].map((node, i) => (
                    <motion.div
                      key={node}
                      className="bg-neutral-700/50 rounded px-3 py-2 text-xs text-neutral-300 border border-neutral-600"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {node}
                    </motion.div>
                  ))}
                </div>
                {/* Connection lines */}
                <svg className="absolute inset-0 pointer-events-none" style={{ top: '60px', left: '40px' }}>
                  <motion.line
                    x1="0" y1="20" x2="0" y2="180"
                    stroke="rgba(239, 68, 68, 0.5)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Main Preview */}
            <div className="flex-1 flex flex-col">
              {/* Viewer */}
              <div className="flex-1 relative bg-black flex items-center justify-center">
                {/* Background */}
                {allProjects[0]?.image_url && (
                  <motion.img
                    src={allProjects[0].image_url}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 10, repeat: Infinity }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/50" />

                {/* Center Content */}
                <div className="relative z-10 text-center px-4 max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="mb-6 bg-red-500/20 text-red-400 border-red-500/30">
                      <Wand2 className="w-3 h-3 mr-2" />
                      Color Grading Specialist
                    </Badge>
                  </motion.div>

                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      {profile?.display_name || "Colorist"}
                    </span>
                  </motion.h1>

                  {portfolio?.headline && (
                    <motion.p
                      className="text-lg text-neutral-400 mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoaded ? 1 : 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {portfolio.headline}
                    </motion.p>
                  )}

                  <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                    transition={{ delay: 1 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                      onClick={() => scrollTo('works')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View Showreel
                    </Button>
                    {profile?.email && (
                      <Button 
                        variant="outline"
                        className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                        asChild
                      >
                        <a href={`mailto:${profile.email}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Hire Me
                        </a>
                      </Button>
                    )}
                  </motion.div>
                </div>

                {/* Viewer info */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-[10px] text-neutral-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    REC
                  </div>
                  <span className="text-[10px] text-neutral-500">4K UHD</span>
                </div>
                <div className="absolute top-4 right-4 text-[10px] font-mono text-orange-400">
                  {formatTime(progress)}
                </div>
              </div>

              {/* Scopes & Controls */}
              <motion.div 
                className="h-48 bg-[#222] border-t border-neutral-700 p-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: isLoaded ? 0 : 100, opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.4 }}
              >
                <ColorWheels />
              </motion.div>
            </div>

            {/* Right Panel - Curves (Desktop) */}
            <motion.div 
              className="hidden xl:flex w-72 bg-[#222] border-l border-neutral-700 flex-col"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: isLoaded ? 0 : 100, opacity: isLoaded ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-3 border-b border-neutral-700">
                <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider">Curves</h4>
              </div>
              <div className="flex-1 p-4">
                {/* Curves visualization */}
                <div className="aspect-square bg-neutral-900 rounded relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border border-neutral-800" />
                    ))}
                  </div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <motion.path
                      d="M 0 100 Q 25 80 50 50 T 100 0"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                    <motion.path
                      d="M 0 100 Q 30 75 50 55 T 100 5"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      opacity="0.6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                    <motion.path
                      d="M 0 95 Q 25 70 50 45 T 100 0"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      opacity="0.6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    />
                    <motion.path
                      d="M 5 100 Q 30 85 50 55 T 100 5"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      opacity="0.6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.4 }}
                    />
                  </svg>
                </div>
              </div>

              {/* Audio Meters */}
              <div className="p-4 border-t border-neutral-700">
                <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">Audio</h4>
                <WaveformVisualizer />
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div 
            className="h-20 bg-[#2a2a2a] border-t border-neutral-700"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 50, opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-full px-4 flex items-center gap-4">
              {/* Transport Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded bg-neutral-700 flex items-center justify-center hover:bg-neutral-600 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Timeline Track */}
              <div className="flex-1">
                <div className="h-1 bg-neutral-700 rounded-full relative overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Clip thumbnails */}
                <div className="flex gap-1 mt-2">
                  {allProjects.slice(0, 6).map((project, i) => (
                    <div 
                      key={project.id}
                      className="flex-1 h-8 rounded overflow-hidden bg-neutral-800 border border-neutral-700"
                    >
                      {project.image_url && (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timecode */}
              <div className="text-xs font-mono text-neutral-400 w-24 text-right">
                {formatTime(progress)} / 03:00:00
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-4 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-800">
                  <Avatar className="w-full h-full rounded-2xl">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-8xl bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* DaVinci badge */}
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <Wand2 className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Film className="w-4 h-4 text-red-400" />
                  <span className="text-xs uppercase tracking-wider text-red-400">About</span>
                </div>

                <h2 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    {profile?.display_name}
                  </span>
                </h2>

                {portfolio?.bio && (
                  <p className="text-lg text-neutral-400 leading-relaxed">{portfolio.bio}</p>
                )}

                <div className="flex flex-wrap gap-3">
                  {portfolio?.location && (
                    <span className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-800 px-4 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-red-400" />
                      {portfolio.location}
                    </span>
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
                          className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-red-500/20 transition-all"
                          whileHover={{ y: -2 }}
                        >
                          <Icon className="w-5 h-5" />
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
        <section id="skills" className="py-24 px-4 bg-[#222]">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Technical Skills
                  </span>
                </h2>
                <p className="text-neutral-500">Professional tools and techniques</p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 0.05}>
                  <motion.div 
                    className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700 hover:border-red-500/30 transition-colors"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-red-400">{skill.proficiency || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works Section */}
      {projects.length > 0 && (
        <section id="works" className="py-24 px-4 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Color Grading Projects
                  </span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.1}>
                  <motion.div 
                    className="group relative aspect-video rounded-xl overflow-hidden bg-neutral-800"
                    whileHover={{ scale: 1.02 }}
                  >
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MonitorPlay className="w-12 h-12 text-neutral-600" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-neutral-400 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div 
                        className="w-14 h-14 rounded-full bg-red-500/80 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-4 bg-[#222]">
          <div className="max-w-4xl mx-auto">
            {experiences.length > 0 && (
              <div className="mb-20">
                <ScrollReveal>
                  <h2 className="text-2xl font-bold mb-8 text-center">
                    <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      Experience
                    </span>
                  </h2>
                </ScrollReveal>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-medium text-lg">{exp.position}</h3>
                          <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full w-fit">
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </span>
                        </div>
                        <p className="text-neutral-400 mb-2">{exp.company}</p>
                        {exp.description && <p className="text-sm text-neutral-500">{exp.description}</p>}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <ScrollReveal>
                  <h2 className="text-2xl font-bold mb-8 text-center">
                    <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      Education
                    </span>
                  </h2>
                </ScrollReveal>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                        <h3 className="font-medium text-lg mb-1">{edu.degree}</h3>
                        <p className="text-neutral-400">{edu.institution}</p>
                        {edu.field_of_study && <p className="text-sm text-neutral-500 mt-1">{edu.field_of_study}</p>}
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
      <section id="contact" className="py-24 px-4 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Let's Create Together
              </span>
            </h2>
            <p className="text-lg text-neutral-400 mb-8">
              Available for color grading, post-production, and creative collaborations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#222] border-t border-neutral-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="font-medium">{profile?.display_name}</span>
          </div>
          <p className="text-sm text-neutral-600">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
