import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, ExternalLink, Film, Play, Pause, Menu, X, Clapperboard, Volume2, SkipBack, SkipForward, Maximize2, Settings, Award, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from "framer-motion";

// Cinema-grade color palette
const cinemaColors = {
  bg: "#0a0a0a",
  surface: "#141414",
  card: "#1c1c1c",
  border: "#2a2a2a",
  text: "#ffffff",
  muted: "#888888",
  accent: "#e50914", // Netflix red
  gold: "#c9a227",
  timeline: "#333333",
};

// Film grain overlay
const FilmGrain = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Video timeline bar with playhead
const VideoTimeline = ({ progress = 35 }: { progress?: number }) => (
  <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
    <div className="flex items-center gap-4 mb-3">
      <div className="flex items-center gap-2">
        <motion.button 
          className="w-8 h-8 rounded bg-[#333] flex items-center justify-center hover:bg-[#444]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipBack className="w-4 h-4" />
        </motion.button>
        <motion.button 
          className="w-10 h-10 rounded-full bg-[#e50914] flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="w-5 h-5 fill-white" />
        </motion.button>
        <motion.button 
          className="w-8 h-8 rounded bg-[#333] flex items-center justify-center hover:bg-[#444]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipForward className="w-4 h-4" />
        </motion.button>
      </div>
      <span className="text-xs font-mono text-[#888]">00:00:35:12 / 00:02:45:00</span>
      <div className="ml-auto flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-[#888]" />
        <Settings className="w-4 h-4 text-[#888]" />
        <Maximize2 className="w-4 h-4 text-[#888]" />
      </div>
    </div>
    
    {/* Timeline tracks */}
    <div className="space-y-1.5">
      {["V1", "V2", "A1", "A2"].map((track, i) => (
        <div key={track} className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#666] w-6">{track}</span>
          <div className="flex-1 h-6 bg-[#222] rounded overflow-hidden relative">
            {/* Clips */}
            {i < 2 && (
              <>
                <motion.div 
                  className={`absolute h-full ${i === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-purple-600 to-purple-500'} rounded`}
                  style={{ left: '5%', width: '25%' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                />
                <motion.div 
                  className={`absolute h-full ${i === 0 ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-pink-600 to-pink-500'} rounded`}
                  style={{ left: '35%', width: '40%' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7 + i * 0.2, duration: 0.5 }}
                />
              </>
            )}
            {i >= 2 && (
              <motion.div 
                className="absolute h-full bg-gradient-to-r from-amber-600/80 to-amber-500/80 rounded"
                style={{ left: '10%', width: '60%' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
              >
                {/* Waveform pattern */}
                <div className="flex items-center h-full px-1 gap-[2px]">
                  {[...Array(40)].map((_, j) => (
                    <div 
                      key={j} 
                      className="w-[2px] bg-amber-300/60 rounded-full"
                      style={{ height: `${Math.random() * 70 + 20}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ))}
    </div>
    
    {/* Playhead */}
    <div className="relative h-2 mt-3">
      <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#333] -translate-y-1/2" />
      <motion.div 
        className="absolute top-0 w-[2px] h-full bg-[#e50914]"
        style={{ left: `${progress}%` }}
        animate={{ left: [`${progress}%`, `${progress + 2}%`, `${progress}%`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-[#e50914]" />
      </motion.div>
    </div>
  </div>
);

// Color wheels for color grading
const ColorWheels = () => (
  <div className="grid grid-cols-3 gap-4">
    {[{ label: "Lift", color: "#3b82f6" }, { label: "Gamma", color: "#22c55e" }, { label: "Gain", color: "#f59e0b" }].map((wheel, i) => (
      <div key={wheel.label} className="text-center">
        <motion.div 
          className="w-20 h-20 mx-auto rounded-full border-2 relative mb-2"
          style={{ borderColor: wheel.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#222] to-[#111]">
            <motion.div 
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: wheel.color, top: '20%', left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>
        </motion.div>
        <span className="text-[10px] text-[#666] uppercase tracking-wider">{wheel.label}</span>
      </div>
    ))}
  </div>
);

// Scroll reveal with cinematic effect
const CinemaReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function VideoEditorEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const allProjects = [...projects.filter(p => p.featured), ...projects.filter(p => !p.featured)];

  useEffect(() => { 
    window.scrollTo(0, 0); 
    setTimeout(() => setIsLoaded(true), 2000); 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 24);
    }, 41.67); // 24fps
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => { 
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); 
    setMenuOpen(false); 
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: cinemaColors.bg }}>
      <FilmGrain />
      
      {/* Cinema Loading - Film reel animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center" 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Film reel */}
              <motion.div 
                className="w-32 h-32 border-4 border-[#333] rounded-full relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-4 h-4 bg-[#333] rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateY(-48px) translateX(-50%)`,
                    }}
                  />
                ))}
                <div className="absolute inset-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <Clapperboard className="w-10 h-10 text-[#e50914]" />
                </div>
              </motion.div>
            </div>
            <motion.div 
              className="mt-8 font-mono text-sm text-[#666]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-[#e50914]">LOADING</span> • FRAME {String(currentFrame).padStart(2, '0')}/24
            </motion.div>
            <motion.div 
              className="w-48 h-1 bg-[#222] rounded-full mt-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="h-full bg-[#e50914]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Video editor style toolbar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backgroundColor: cinemaColors.surface, borderColor: cinemaColors.border }}
        initial={{ y: -80 }} 
        animate={{ y: isLoaded ? 0 : -80 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Logo as film strip */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 h-8 bg-[#333] mx-[1px] rounded-sm" />
              ))}
            </div>
            <div className="w-10 h-10 bg-[#e50914] flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 h-8 bg-[#333] mx-[1px] rounded-sm" />
              ))}
            </div>
            <span className="ml-2 text-sm font-light tracking-wider hidden sm:block">{profile?.display_name}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1">
            {["Reel", "About", "Timeline", "Credits"].map((item, i) => (
              <motion.button
                key={item}
                onClick={() => scrollTo(item.toLowerCase() === "reel" ? "hero" : item.toLowerCase() === "timeline" ? "works" : item.toLowerCase() === "credits" ? "contact" : "bio")}
                className="px-4 py-2 rounded-md text-xs font-medium transition-colors hover:bg-[#333]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {item}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded">
              <div className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
              <span className="text-[10px] font-mono text-[#888]">REC</span>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden border-t px-4 py-4"
              style={{ backgroundColor: cinemaColors.surface, borderColor: cinemaColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Reel", "About", "Timeline", "Credits"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "reel" ? "hero" : item.toLowerCase() === "timeline" ? "works" : item.toLowerCase() === "credits" ? "contact" : "bio")}
                  className="block w-full text-left py-3 text-sm"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Cinema Preview */}
      <section id="hero" className="min-h-screen pt-14 relative overflow-hidden">
        {/* Background with letterbox */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-[10vh] bg-black z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black z-10" />
          {allProjects[0]?.image_url && (
            <motion.img 
              src={allProjects[0].image_url} 
              className="w-full h-full object-cover opacity-40"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-20 h-[calc(100vh-56px)] flex flex-col justify-center px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isLoaded ? 1 : 0, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-5 h-5 text-[#c9a227]" />
                  <span className="text-xs tracking-[0.3em] uppercase text-[#c9a227]">Award-Winning Filmmaker</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extralight mb-4 leading-[1.1]">
                  <span className="block text-[#888]">Cinematic</span>
                  <span className="block text-white">{profile?.display_name || "Storyteller"}</span>
                </h1>
                
                {portfolio?.headline && (
                  <p className="text-lg sm:text-xl text-[#666] mb-8 max-w-lg font-light">
                    {portfolio.headline}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-[#e50914] hover:bg-[#b20710] rounded-none px-8"
                    onClick={() => scrollTo('works')}
                  >
                    <Play className="w-4 h-4 mr-2 fill-white" />
                    Watch Showreel
                  </Button>
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-[#333] hover:border-white rounded-none px-8"
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Hire Me
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Right - Video editing interface preview */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isLoaded ? 1 : 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="bg-[#0d0d0d] rounded-xl border border-[#2a2a2a] overflow-hidden">
                  {/* Preview window */}
                  <div className="aspect-video bg-black relative">
                    {allProjects[0]?.image_url && (
                      <img src={allProjects[0].image_url} className="w-full h-full object-cover opacity-80" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(229, 9, 20, 0.8)" }}
                      >
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </motion.div>
                    </div>
                    {/* Timecode overlay */}
                    <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded text-[10px] font-mono text-[#e50914]">
                      00:00:35:12
                    </div>
                  </div>
                  
                  {/* Mini timeline */}
                  <div className="p-3 bg-[#111]">
                    <VideoTimeline />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#333] flex justify-center pt-2">
            <motion.div 
              className="w-1 h-2 bg-[#e50914] rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Bio Section - Director's cut style */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6" style={{ backgroundColor: cinemaColors.surface }}>
        <div className="max-w-6xl mx-auto">
          <CinemaReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full border border-[#333] mb-6">
                <Clapperboard className="w-4 h-4 text-[#e50914]" />
                <span className="text-xs tracking-widest uppercase text-[#888]">Director's Profile</span>
              </div>
            </div>
          </CinemaReveal>

          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Avatar with film frame effect */}
            <CinemaReveal delay={0.2}>
              <div className="lg:col-span-2">
                <div className="relative">
                  {/* Film sprocket holes */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#0a0a0a] flex flex-col justify-between py-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-4 h-3 bg-[#1a1a1a] rounded-sm mx-auto" />
                    ))}
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-[#0a0a0a] flex flex-col justify-between py-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-4 h-3 bg-[#1a1a1a] rounded-sm mx-auto" />
                    ))}
                  </div>
                  
                  {/* Main photo */}
                  <div className="mx-6">
                    <Avatar className="w-full aspect-[3/4] rounded-none">
                      <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                      <AvatarFallback className="text-8xl bg-gradient-to-b from-[#e50914] to-[#8a0a0f] rounded-none">
                        {profile?.display_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Frame number */}
                  <div className="absolute bottom-2 left-8 text-[10px] font-mono text-[#666]">
                    FRAME 001 - {profile?.display_name?.toUpperCase()}
                  </div>
                </div>
              </div>
            </CinemaReveal>

            {/* Bio content */}
            <CinemaReveal delay={0.4}>
              <div className="lg:col-span-3 space-y-6">
                <h2 className="text-4xl font-extralight">
                  <span className="text-[#888]">Director & </span>
                  <span className="text-white">Editor</span>
                </h2>
                
                <h3 className="text-2xl font-light text-[#e50914]">{profile?.display_name}</h3>
                
                {portfolio?.bio && (
                  <p className="text-lg text-[#888] font-light leading-relaxed">
                    {portfolio.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-[#666]">
                  {portfolio?.location && (
                    <span className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-lg">
                      <MapPin className="w-4 h-4 text-[#e50914]" />
                      {portfolio.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a 
                      href={`mailto:${profile.email}`} 
                      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-lg hover:bg-[#222]"
                    >
                      <Mail className="w-4 h-4 text-[#e50914]" />
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
                          className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center hover:bg-[#e50914] transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      );
                    })}
                  </div>
                )}

                {/* Color grading panel */}
                <div className="pt-8">
                  <p className="text-xs text-[#666] uppercase tracking-wider mb-4">Color Grading Suite</p>
                  <ColorWheels />
                </div>
              </div>
            </CinemaReveal>
          </div>
        </div>
      </section>

      {/* Projects Section - Film portfolio */}
      {projects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6" style={{ backgroundColor: cinemaColors.bg }}>
          <div className="max-w-7xl mx-auto">
            <CinemaReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full border border-[#333] mb-6">
                  <Film className="w-4 h-4 text-[#e50914]" />
                  <span className="text-xs tracking-widest uppercase text-[#888]">Filmography</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-extralight">
                  <span className="text-[#888]">Selected </span>
                  <span className="text-white">Works</span>
                </h2>
              </div>
            </CinemaReveal>

            {/* Projects grid with cinema-style cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <CinemaReveal key={project.id} delay={i * 0.1}>
                  <motion.div 
                    className="group relative bg-[#111] overflow-hidden"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Poster/Thumbnail */}
                    <div className="aspect-[16/9] relative overflow-hidden">
                      {project.image_url ? (
                        <motion.img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#e50914] to-[#5a0308] flex items-center justify-center">
                          <Film className="w-16 h-16 text-white/30" />
                        </div>
                      )}
                      
                      {/* Play overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-14 h-14 rounded-full bg-[#e50914] flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </motion.div>
                      </motion.div>
                      
                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono">
                        02:45
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-1">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-[#888] line-clamp-2 mb-3">{project.description}</p>
                      )}
                      {project.tech_stack && (
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.slice(0, 3).map((tech, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 text-[10px] bg-[#1a1a1a] rounded text-[#666]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </CinemaReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills as editing tools */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-4 sm:px-6" style={{ backgroundColor: cinemaColors.surface }}>
          <div className="max-w-5xl mx-auto">
            <CinemaReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extralight mb-4">
                  <span className="text-[#888]">Editing </span>
                  <span className="text-white">Arsenal</span>
                </h2>
              </div>
            </CinemaReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill, i) => (
                <CinemaReveal key={skill.id} delay={i * 0.05}>
                  <div className="bg-[#1a1a1a] p-4 border border-[#2a2a2a] hover:border-[#e50914]/30 transition-colors">
                    <div className="text-sm font-medium mb-2">{skill.name}</div>
                    <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#e50914] to-[#ff4444]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 80}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </CinemaReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact - End credits style */}
      <section id="contact" className="py-32 px-4 sm:px-6 text-center" style={{ backgroundColor: cinemaColors.bg }}>
        <CinemaReveal>
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-[2px] bg-[#e50914] mx-auto mb-8" />
            <h2 className="text-4xl font-extralight mb-4">
              <span className="text-[#888]">Let's Create </span>
              <span className="text-white">Together</span>
            </h2>
            <p className="text-[#666] mb-8">Ready to bring your vision to life?</p>
            
            {profile?.email && (
              <Button 
                size="lg" 
                className="bg-[#e50914] hover:bg-[#b20710] rounded-none px-12"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            )}
          </div>
        </CinemaReveal>
      </section>

      {/* Footer - Film credits style */}
      <footer className="py-16 px-4 border-t" style={{ backgroundColor: cinemaColors.bg, borderColor: cinemaColors.border }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-[#c9a227] fill-[#c9a227]" />
            ))}
          </div>
          <p className="text-[#666] text-sm mb-2">
            A {profile?.display_name} Production
          </p>
          <p className="text-[#444] text-xs">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
