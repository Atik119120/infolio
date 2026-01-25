import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, Star, Crown,
  Award, Trophy, Play, Pause, ChevronDown, Zap
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// ==================== HOLLYWOOD GLAMOUR AESTHETIC ====================

// Spotlight Effect Component
const Spotlight = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
      style={{
        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 215, 0, 0.3) 0%, transparent 40%)`,
      }}
    />
  );
};

// Gold Particle Effect
const GoldParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-yellow-400"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100],
          x: [0, Math.random() * 50 - 25],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

// Red Carpet Effect
const RedCarpet = () => (
  <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-red-800 to-transparent" />
    <div className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 50px,
          rgba(0,0,0,0.1) 50px,
          rgba(0,0,0,0.1) 100px
        )`,
      }}
    />
    {/* Gold rope stanchions */}
    <div className="absolute bottom-4 left-8 right-8 flex justify-between">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-3 h-20 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-lg" />
        </div>
      ))}
    </div>
  </div>
);

// Velvet Curtain
const VelvetCurtain = ({ side }: { side: 'left' | 'right' }) => (
  <motion.div
    className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-24 h-full z-40 pointer-events-none hidden lg:block`}
    initial={{ x: side === 'left' ? -100 : 100 }}
    animate={{ x: 0 }}
    transition={{ delay: 0.5, duration: 1 }}
  >
    <div className="w-full h-full bg-gradient-to-r from-red-900 via-red-800 to-red-900 opacity-80"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(0,0,0,0.2) 20px,
            rgba(0,0,0,0.2) 21px
          )
        `,
      }}
    />
    {/* Gold trim */}
    <div className={`absolute top-0 ${side === 'left' ? 'right-0' : 'left-0'} w-2 h-full bg-gradient-to-b from-yellow-500 via-yellow-400 to-yellow-500`} />
  </motion.div>
);

// Hollywood Star Component
const HollywoodStar = ({ name, featured }: { name: string; featured?: boolean }) => (
  <motion.div
    className={`relative ${featured ? 'w-40 h-40' : 'w-32 h-32'}`}
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Star shape */}
    <div className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      }}
    />
    {/* Inner circle */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-red-800 to-red-900 border-2 border-yellow-500 flex items-center justify-center">
      <Award className="w-6 h-6 text-yellow-400" />
    </div>
    {/* Name plate */}
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 px-4 py-1 rounded-sm shadow-lg">
      <span className="text-xs font-bold text-red-900 whitespace-nowrap">{name}</span>
    </div>
  </motion.div>
);

// Award Trophy Component
const AwardTrophy = ({ title, description }: { title: string; description: string }) => (
  <motion.div
    className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-lg border border-yellow-500/30 backdrop-blur-sm"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02, borderColor: 'rgba(234, 179, 8, 0.6)' }}
  >
    <div className="relative">
      <Trophy className="w-12 h-12 text-yellow-500" />
      <motion.div
        className="absolute -inset-2 bg-yellow-500/20 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
    <div>
      <h3 className="font-bold text-yellow-400">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </motion.div>
);

// Animated Counter with Gold Style
const GoldCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
      {displayValue}{suffix}
    </span>
  );
};

// Premiere Movie Ticket
const MovieTicket = ({ children, rotation = 0 }: { children: React.ReactNode; rotation?: number }) => (
  <motion.div
    className="relative"
    style={{ rotate: rotation }}
    whileHover={{ scale: 1.02, rotate: 0 }}
  >
    {/* Ticket perforated edge */}
    <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="w-4 h-4 rounded-full bg-slate-950" />
      ))}
    </div>
    
    {/* Ticket body */}
    <div className="ml-4 bg-gradient-to-r from-red-900 via-red-800 to-red-900 p-8 rounded-r-lg border-2 border-yellow-500/50 shadow-2xl">
      {children}
    </div>
  </motion.div>
);

// Flashing Camera Effect
const CameraFlash = () => {
  const [flash, setFlash] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-white pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: flash ? 0.3 : 0 }}
      transition={{ duration: 0.1 }}
    />
  );
};

export default function PersonalEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setActiveSection(id);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Spotlight />
      <GoldParticles />
      <CameraFlash />
      <VelvetCurtain side="left" />
      <VelvetCurtain side="right" />

      {/* Gold Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Glamorous Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-yellow-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Crown className="w-6 h-6 text-slate-900" />
                </div>
              )}
              <span className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent tracking-wider">
                {profile?.display_name || "STAR"}
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-10">
              {[
                { id: "hero", label: "PREMIERE" },
                { id: "about", label: "BIOGRAPHY" },
                { id: "awards", label: "AWARDS" },
                { id: "filmography", label: "PORTFOLIO" },
                { id: "contact", label: "BOOKINGS" },
              ].map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative text-sm tracking-widest transition-colors ${
                    activeSection === item.id 
                      ? "text-yellow-400" 
                      : "text-slate-400 hover:text-yellow-200"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-yellow-400">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-yellow-500/20 px-6 py-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["hero", "about", "awards", "filmography", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className="block w-full text-left py-4 text-lg text-slate-300 uppercase tracking-widest border-b border-yellow-500/10 last:border-0"
                >
                  {item === "hero" ? "Premiere" : item === "filmography" ? "Portfolio" : item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero - Grand Premiere */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Stage lights */}
        <div className="absolute top-0 left-0 right-0 h-32">
          <div className="absolute top-0 left-1/4 w-32 h-64 bg-gradient-to-b from-yellow-400/20 to-transparent transform -rotate-12" />
          <div className="absolute top-0 right-1/4 w-32 h-64 bg-gradient-to-b from-yellow-400/20 to-transparent transform rotate-12" />
        </div>

        <RedCarpet />

        <div className="max-w-7xl mx-auto px-6 lg:px-24 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Star Presentation */}
            <motion.div
              className="order-2 lg:order-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Badge className="mb-8 bg-gradient-to-r from-yellow-600/30 to-yellow-400/30 text-yellow-300 border border-yellow-500/50 rounded-full px-6 py-2">
                  <Star className="w-4 h-4 mr-2 fill-yellow-400" />
                  WORLD PREMIERE
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mb-4"
              >
                <span className="text-sm text-yellow-500 tracking-[0.5em]">INTRODUCING</span>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                  {profile?.display_name || "THE STAR"}
                </span>
              </motion.h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-xl md:text-2xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  "{portfolio.headline}"
                </motion.p>
              )}

              {/* Stats with Hollywood flair */}
              <motion.div
                className="grid grid-cols-3 gap-8 mb-10 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                {[
                  { value: experiences.length, label: "Years Active", suffix: "+" },
                  { value: projects.length, label: "Productions", suffix: "" },
                  { value: skills.length, label: "Talents", suffix: "" },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="text-4xl font-bold">
                      <GoldCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 font-bold rounded-full shadow-lg shadow-yellow-500/30 px-8 hover:from-yellow-500 hover:to-yellow-400"
                  onClick={() => scrollTo('about')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Biography
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-yellow-500/50 text-yellow-400 rounded-full hover:bg-yellow-500/10 px-8"
                  onClick={() => scrollTo('contact')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Book Now
                </Button>
              </motion.div>
            </motion.div>

            {/* Right - Star Photo */}
            <motion.div
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative max-w-md mx-auto">
                {/* Spotlight glow */}
                <motion.div
                  className="absolute -inset-8 bg-gradient-to-br from-yellow-500/30 via-transparent to-transparent rounded-full blur-2xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Gold frame */}
                <div className="relative p-2 bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-600 rounded-lg shadow-2xl">
                  <div className="p-1 bg-slate-900 rounded-md">
                    <Avatar className="w-full aspect-[3/4] rounded-md">
                      <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                      <AvatarFallback className="text-8xl bg-gradient-to-br from-slate-800 to-slate-900 text-yellow-500 rounded-md font-bold">
                        {profile?.display_name?.[0]?.toUpperCase() || "★"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Floating awards */}
                <motion.div
                  className="absolute -right-8 -top-8"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="w-8 h-8 text-slate-900" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-6 bottom-1/4"
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      {portfolio?.bio && (
        <section id="about" className="py-32 px-6 lg:px-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-red-950/20 to-slate-950" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-yellow-500 tracking-[0.3em] uppercase text-sm">The Story</span>
              <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Biography
              </h2>
            </motion.div>

            <MovieTicket rotation={1}>
              <div className="text-center">
                <Quote className="w-12 h-12 text-yellow-500/50 mx-auto mb-6" />
                <p className="text-lg text-slate-300 leading-loose font-serif italic">
                  {portfolio.bio}
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="w-20 h-0.5 bg-yellow-500/30" />
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <div className="w-20 h-0.5 bg-yellow-500/30" />
                </div>
              </div>
            </MovieTicket>
          </div>
        </section>
      )}

      {/* Awards Section (Skills) */}
      {skills.length > 0 && (
        <section id="awards" className="py-32 px-6 lg:px-24 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-yellow-500 tracking-[0.3em] uppercase text-sm">Recognition</span>
              <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Awards & Talents
              </h2>
            </motion.div>

            {/* Hollywood Walk of Fame style */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 justify-items-center">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  <HollywoodStar name={skill.name} featured={i === 0} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filmography (Projects) */}
      {allProjects.length > 0 && (
        <section id="filmography" className="py-32 px-6 lg:px-24 bg-slate-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-yellow-500 tracking-[0.3em] uppercase text-sm">Selected Works</span>
              <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Portfolio
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-lg border-2 border-yellow-500/30 bg-slate-900 group-hover:border-yellow-500/60 transition-colors">
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-900 to-slate-900 flex items-center justify-center">
                          <Star className="w-16 h-16 text-yellow-500/30" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                      
                      {/* Featured badge */}
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                          FEATURED
                        </div>
                      )}

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">{project.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                        
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                          >
                            View Project <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Career Timeline */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-32 px-6 lg:px-24 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-yellow-500 tracking-[0.3em] uppercase text-sm">Career</span>
              <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Milestones
              </h2>
            </motion.div>

            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <AwardTrophy
                  key={exp.id}
                  title={exp.position}
                  description={`${exp.company} • ${formatDate(exp.start_date)} - ${exp.is_current ? "Present" : formatDate(exp.end_date)}`}
                />
              ))}
              {education.map((edu, i) => (
                <AwardTrophy
                  key={edu.id}
                  title={edu.degree}
                  description={`${edu.institution} • ${formatDate(edu.start_date)} - ${formatDate(edu.end_date)}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact - VIP Bookings */}
      <section id="contact" className="py-32 px-6 lg:px-24 bg-slate-950 relative overflow-hidden">
        {/* Red carpet effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-full bg-gradient-to-t from-red-900/50 to-transparent" />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-yellow-500 tracking-[0.3em] uppercase text-sm">Get in Touch</span>
            <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              VIP Contact
            </h2>
          </motion.div>

          <motion.div
            className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-8 border border-yellow-500/30"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4 mb-8">
              {portfolio?.phone && (
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span>{portfolio.phone}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span>{profile.email}</span>
                </div>
              )}
              {portfolio?.location && (
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4 mb-8 pb-8 border-b border-yellow-500/20">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-slate-800 border border-yellow-500/30 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            )}

            <ContactForm portfolioOwnerId={userId || ''} />
          </motion.div>
        </div>
      </section>

      {/* Footer - End Credits */}
      <footer className="py-16 bg-slate-950 border-t border-yellow-500/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto" />
            ) : (
              <Crown className="w-10 h-10 text-yellow-500" />
            )}
          </motion.div>
          
          <p className="text-yellow-500/60 text-lg font-bold tracking-widest mb-2">
            {profile?.display_name?.toUpperCase() || "THE STAR"}
          </p>
          <p className="text-slate-500 text-sm tracking-wider">
            ★ A Premium Production ★
          </p>
          <p className="text-slate-600 text-xs mt-4">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}