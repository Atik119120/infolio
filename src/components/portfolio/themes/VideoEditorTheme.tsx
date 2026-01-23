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

      {/* Hero Section - Cinematic Editor Workspace */}
      <section id="hero" className="min-h-screen pt-14 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Film Grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Cinematic Letterbox Bars */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-16 bg-black z-20"
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ delay: 2.3, duration: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-black z-20"
          initial={{ y: 64 }}
          animate={{ y: 0 }}
          transition={{ delay: 2.3, duration: 0.5 }}
        />

        <div className="w-full max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-5 gap-6 items-center">
            {/* Left: Effects Panel */}
            <motion.div 
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 }}
            >
              <div className="bg-[#0d0d18]/90 rounded-xl border border-white/5 p-3 space-y-3">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Effects</div>
                {["Color Grade", "Sharpen", "Vignette", "Glow"].map((effect, i) => (
                  <motion.div 
                    key={effect}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.6 + i * 0.1 }}
                  >
                    <span className="text-white/60">{effect}</span>
                    <div className="w-8 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  </motion.div>
                ))}
                
                {/* RGB Parade Mini */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="text-xs text-white/40 mb-2">Scopes</div>
                  <div className="flex gap-1 h-12">
                    {["red", "green", "blue"].map((color, i) => (
                      <div key={color} className="flex-1 relative overflow-hidden rounded">
                        {[...Array(8)].map((_, j) => (
                          <motion.div 
                            key={j}
                            className="absolute bottom-0 w-full"
                            style={{ 
                              backgroundColor: color,
                              opacity: 0.3 + j * 0.08,
                            }}
                            animate={{ height: [`${20 + Math.random() * 30}%`, `${40 + Math.random() * 40}%`] }}
                            transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, repeatType: "reverse" }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center: Main Preview */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              {/* Monitor Frame */}
              <div className="rounded-2xl overflow-hidden bg-[#0d0d18]/90 border border-white/10 shadow-2xl shadow-purple-500/20">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-white/30">Program Monitor</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-purple-400">{formatTime(progress)}</span>
                    <span className="text-xs text-white/30">24fps</span>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="relative aspect-video bg-black">
                  {/* Background Visual */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-red-900/40">
                    {allProjects[0]?.image_url && (
                      <motion.img
                        src={allProjects[0].image_url}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-40"
                        animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 8, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Scanlines Effect */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                  }} />

                  {/* Center Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.4 }}
                      >
                        {/* Film Reel Icon */}
                        <motion.div 
                          className="w-20 h-20 mx-auto mb-6 relative"
                          animate={{ rotate: isPlaying ? 360 : 0 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
                          <div className="absolute inset-2 rounded-full border-2 border-pink-500/30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Clapperboard className="w-8 h-8 text-white/80" />
                          </div>
                          {/* Reel Holes */}
                          {[...Array(8)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute w-2 h-2 bg-purple-400/60 rounded-full"
                              style={{
                                top: `${50 + 35 * Math.sin(i * Math.PI / 4)}%`,
                                left: `${50 + 35 * Math.cos(i * Math.PI / 4)}%`,
                                transform: "translate(-50%, -50%)"
                              }}
                            />
                          ))}
                        </motion.div>

                        <Badge className="mb-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 border-0 backdrop-blur-sm">
                          <Film className="w-3 h-3 mr-2" />
                          Video Editor & Colorist
                        </Badge>
                      </motion.div>

                      <motion.h1 
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.6 }}
                      >
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                          {profile?.display_name || "Creative Editor"}
                        </span>
                      </motion.h1>

                      {portfolio?.headline && (
                        <motion.p 
                          className="text-base sm:text-lg text-white/50 max-w-xl mx-auto"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.8 }}
                        >
                          {portfolio.headline}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Corner Info */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-white/50">REC</span>
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-mono text-white/30">
                    4K UHD • 23.976
                  </div>

                  {/* Safe Area Guides */}
                  <div className="absolute inset-[5%] border border-dashed border-white/10 pointer-events-none hidden sm:block" />
                </div>

                {/* Playback Controls */}
                <div className="px-4 py-3 flex items-center gap-4 border-t border-white/5 bg-black/50">
                  <div className="flex items-center gap-2">
                    <motion.button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </motion.button>
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
                      <SkipForward className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" 
                      style={{ width: `${progress}%` }} 
                    />
                    {/* Keyframes */}
                    {[20, 45, 70, 90].map((pos) => (
                      <div 
                        key={pos}
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-sm rotate-45"
                        style={{ left: `${pos}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-white/40">
                    <Volume2 className="w-4 h-4" />
                    <Maximize className="w-4 h-4" />
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
            </motion.div>

            {/* Right: Audio & Metadata Panel */}
            <motion.div 
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 }}
            >
              <div className="bg-[#0d0d18]/90 rounded-xl border border-white/5 p-3 space-y-4">
                {/* Audio Meters */}
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Audio</div>
                  <div className="flex gap-2 h-32">
                    {["L", "R"].map((channel) => (
                      <div key={channel} className="flex-1 flex flex-col gap-1">
                        <div className="flex-1 bg-black/50 rounded relative overflow-hidden flex flex-col-reverse">
                          {[...Array(20)].map((_, i) => (
                            <motion.div 
                              key={i}
                              className="h-1 mx-0.5 rounded-sm"
                              style={{ 
                                backgroundColor: i < 14 ? "#22c55e" : i < 18 ? "#eab308" : "#ef4444"
                              }}
                              animate={{ 
                                opacity: isPlaying ? [0.3, i < 12 + Math.random() * 8 ? 1 : 0.3, 0.3] : 0.3
                              }}
                              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 0.3 }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/30 text-center">{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-3 border-t border-white/5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Metadata</div>
                  <div className="space-y-2 text-xs">
                    {[
                      ["Resolution", "3840×2160"],
                      ["Codec", "H.264"],
                      ["Bitrate", "50 Mbps"],
                      ["Duration", "02:00:00"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-white/50">
                        <span className="text-white/30">{label}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Waveform Mini */}
                <div className="pt-3 border-t border-white/5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Waveform</div>
                  <div className="flex items-center justify-center gap-px h-8">
                    {[...Array(30)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm"
                        animate={{ 
                          height: isPlaying 
                            ? [`${10 + Math.random() * 20}px`, `${5 + Math.random() * 25}px`]
                            : "8px"
                        }}
                        transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline Preview */}
          <motion.div 
            className="hidden lg:block mt-8 rounded-xl overflow-hidden bg-[#0d0d18]/80 border border-white/5"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/50">
              <span className="text-xs text-white/40">Timeline: Main Sequence</span>
              <div className="flex gap-3 text-xs text-white/30">
                <span>V1-V3</span>
                <span>A1-A2</span>
              </div>
            </div>
            <div className="h-24 relative overflow-hidden p-2">
              {/* Time Ruler */}
              <div className="flex justify-between mb-2 text-[10px] text-white/20 px-2">
                {["00:00", "00:30", "01:00", "01:30", "02:00"].map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>

              {/* Playhead */}
              <motion.div 
                className="absolute top-0 bottom-0 w-0.5 z-10 bg-red-500"
                style={{ left: `${progress}%` }}
              >
                <div className="w-3 h-3 -ml-1 bg-red-500 rounded-sm" />
              </motion.div>

              {/* Video Tracks */}
              <div className="space-y-1">
                <div className="flex gap-1 h-6">
                  {[...Array(6)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="rounded bg-gradient-to-r from-purple-600/80 to-pink-600/80"
                      style={{ flex: 1 + Math.random() * 2 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 3.4 + i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="flex gap-1 h-5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="rounded bg-gradient-to-r from-blue-500/60 to-cyan-500/60"
                      style={{ flex: 1 + Math.random() * 3 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 3.5 + i * 0.05 }}
                    />
                  ))}
                </div>
              </div>

              {/* Audio Waveform Track */}
              <div className="flex gap-1 h-5 mt-1">
                {[...Array(10)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 rounded bg-green-500/50 flex items-center justify-center overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 3.6 + i * 0.03 }}
                  >
                    <div className="flex items-center gap-px">
                      {[...Array(8)].map((_, j) => (
                        <div key={j} className="w-0.5 bg-green-400/60" style={{ height: `${Math.random() * 12 + 4}px` }} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Clapperboard className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm text-white/40">{profile?.display_name}</span>
            </div>

            {/* Footer Nav */}
            <div className="flex flex-wrap justify-center gap-6">
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm text-white/30 hover:text-purple-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
