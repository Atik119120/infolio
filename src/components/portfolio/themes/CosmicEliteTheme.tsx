import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Star, Sparkles, Orbit, Moon, Sun,
  Rocket, Atom, Calendar, Building2, GraduationCap, ChevronRight, Menu, X,
  Zap, Globe, ArrowRight, Telescope, Satellite, Play, ChevronDown, Send
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";

// 3D Parallax Stars with different depths
const ParallaxStars = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const layers = [
    { count: 50, size: 1, speed: 0.5 },
    { count: 30, size: 2, speed: 0.3 },
    { count: 20, size: 3, speed: 0.1 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {layers.map((layer, layerIndex) =>
        [...Array(layer.count)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const yOffset = useTransform(scrollYProgress, [0, 1], [0, layer.speed * 500]);

          return (
            <motion.div
              key={`${layerIndex}-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: layer.size,
                height: layer.size,
                y: yOffset,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
              }}
            />
          );
        })
      )}
    </div>
  );
};

// Cosmic Wormhole Effect
const WormholeEffect = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/20"
        style={{
          width: 200 + i * 150,
          height: 200 + i * 150,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 10 + i * 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// Aurora Effect
const AuroraEffect = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-1/2 left-0 right-0 h-screen"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.1) 30%, rgba(59, 130, 246, 0.1) 50%, rgba(16, 185, 129, 0.1) 70%, transparent 100%)",
      }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        y: [0, 50, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute -top-1/2 left-1/4 right-1/4 h-screen"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(236, 72, 153, 0.1) 40%, rgba(168, 85, 247, 0.1) 60%, transparent 100%)",
      }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        x: [-50, 50, -50],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

// Cosmic Dust Particles
const CosmicDust = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -1000],
          x: [0, Math.random() * 200 - 100],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 10,
          delay: Math.random() * 10,
          repeat: Infinity,
        }}
      />
    ))}
  </div>
);

// Holographic Card
const HolographicCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Holographic shimmer */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden">
        {/* Rainbow shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(${45 + mousePos.x * 90}deg, 
              rgba(255,0,128,0.3) 0%, 
              rgba(128,0,255,0.3) 25%, 
              rgba(0,128,255,0.3) 50%, 
              rgba(0,255,128,0.3) 75%, 
              rgba(255,255,0,0.3) 100%)`,
          }}
        />
        {children}
      </div>
    </motion.div>
  );
};

// Animated Counter with glow
const GlowingCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (v) => setDisplay(Math.round(v)));
  }, [springValue]);

  return (
    <motion.span
      ref={ref}
      className="relative"
      animate={{ textShadow: ["0 0 20px rgba(168, 85, 247, 0.5)", "0 0 40px rgba(168, 85, 247, 0.8)", "0 0 20px rgba(168, 85, 247, 0.5)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {display}{suffix}
    </motion.span>
  );
};

// Orbit Navigation
const OrbitNavigation = ({ items, activeItem, onSelect }: { items: string[]; activeItem: string; onSelect: (item: string) => void }) => {
  return (
    <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
      {items.map((item, i) => (
        <motion.button
          key={item}
          onClick={() => onSelect(item)}
          className={`w-3 h-3 rounded-full border-2 transition-all ${
            activeItem === item
              ? "bg-amber-400 border-amber-400 scale-125"
              : "bg-transparent border-white/30 hover:border-white/60"
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
    </div>
  );
};

export default function CosmicEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setActiveSection(id);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const navItems = ["hero", "about", "skills", "works", "contact"];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParallaxStars scrollYProgress={scrollYProgress} />
      <WormholeEffect />
      <AuroraEffect />
      <CosmicDust />

      {/* Progress Ring */}
      <div className="fixed top-6 right-6 z-50 w-12 h-12">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="url(#progressGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength: scrollYProgress }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <OrbitNavigation items={navItems} activeItem={activeSection} onSelect={scrollTo} />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-2xl border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center"
                  animate={{
                    boxShadow: ["0 0 20px rgba(168, 85, 247, 0.3)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.3)"],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Atom className="w-6 h-6 text-white" />
                </motion.div>
              )}
              <span className="font-bold text-xl bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                {profile?.display_name || "Portfolio"}
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-10">
              {["Home", "About", "Skills", "Works", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase())}
                  className="relative text-sm text-white/60 hover:text-white transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {item}
                  {activeSection === (item.toLowerCase() === "home" ? "hero" : item.toLowerCase()) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-black/90 backdrop-blur-2xl border-t border-white/10 px-6 py-8"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase())}
                  className="block w-full text-left py-4 text-xl text-white/80 hover:text-white transition-colors"
                >
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
        className="min-h-screen flex items-center relative pt-20"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-white/70">Available for New Projects</span>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-bold leading-[0.9] mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="block text-white/30">{profile?.display_name?.split(" ")[0] || "Creative"}</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {profile?.display_name?.split(" ").slice(1).join(" ") || "Soul"}
                </span>
              </motion.h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-xl text-white/50 mb-10 max-w-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-6 text-base shadow-xl shadow-purple-500/20"
                  onClick={() => scrollTo("works")}
                >
                  <Telescope className="w-5 h-5 mr-2" />
                  Explore Universe
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20 hover:bg-white/5 px-10 py-6 text-base"
                  onClick={() => scrollTo("contact")}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Make Contact
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    <GlowingCounter value={experiences.length} suffix="+" />
                  </div>
                  <div className="text-sm text-white/40 mt-1">Years Journey</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    <GlowingCounter value={projects.length} suffix="+" />
                  </div>
                  <div className="text-sm text-white/40 mt-1">Creations</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    <GlowingCounter value={skills.length} suffix="+" />
                  </div>
                  <div className="text-sm text-white/40 mt-1">Powers</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative mx-auto w-fit">
                {/* Orbital rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/20"
                    style={{
                      width: 250 + i * 80,
                      height: 250 + i * 80,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20 + i * 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div
                      className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ top: -6, left: "50%", marginLeft: -6 }}
                    />
                  </motion.div>
                ))}

                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-10 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 blur-3xl opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <Avatar className="relative w-56 h-56 ring-4 ring-purple-500/30 shadow-2xl">
                  <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                  <AvatarFallback className="text-6xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                    {profile?.display_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-purple-400" />
        </motion.div>
      </motion.section>

      {/* About Section */}
      {portfolio?.bio && (
        <section id="about" className="py-32 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">About Me</Badge>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                My Cosmic Story
              </h2>
            </motion.div>

            <HolographicCard>
              <div className="p-12 md:p-20">
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed text-center">
                  {portfolio.bio}
                </p>

                {/* Contact Info */}
                <div className="flex flex-wrap justify-center gap-6 mt-12 pt-12 border-t border-white/10">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span className="text-white/70">{portfolio.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-purple-400" />
                      <span className="text-white/70">{profile.email}</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex justify-center gap-4 mt-8">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                          whileHover={{ scale: 1.1, y: -5 }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </HolographicCard>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Skills</Badge>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Cosmic Powers
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                <HolographicCard key={category} delay={i * 0.1}>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-white">{category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <motion.span
                          key={skill.id}
                          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70"
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(168, 85, 247, 0.2)",
                            borderColor: "rgba(168, 85, 247, 0.5)",
                          }}
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </HolographicCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-pink-500/20 text-pink-300 border-pink-500/30">Journey</Badge>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Space-Time Timeline
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {experiences.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-purple-400" />
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <HolographicCard key={exp.id} delay={i * 0.1}>
                        <div className="p-6">
                          <Badge className="mb-3 bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </Badge>
                          <h4 className="text-lg font-semibold text-white mb-1">{exp.position}</h4>
                          <p className="text-purple-300">{exp.company}</p>
                          {exp.description && (
                            <p className="text-white/50 text-sm mt-3">{exp.description}</p>
                          )}
                        </div>
                      </HolographicCard>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-cyan-400" />
                    Education
                  </h3>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <HolographicCard key={edu.id} delay={i * 0.1}>
                        <div className="p-6">
                          <Badge className="mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                            {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                          </Badge>
                          <h4 className="text-lg font-semibold text-white mb-1">{edu.degree}</h4>
                          <p className="text-cyan-300">{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-white/50 text-sm mt-1">{edu.field_of_study}</p>
                          )}
                        </div>
                      </HolographicCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30">Portfolio</Badge>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Stellar Creations
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, i) => (
                <HolographicCard key={project.id} delay={i * 0.1}>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-purple-400/50" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">{project.title}</h4>
                    {project.description && (
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{project.description}</p>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-400 text-sm hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </a>
                    )}
                  </div>
                </HolographicCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-500/30">Contact</Badge>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Establish Connection
            </h2>
          </motion.div>

          <HolographicCard>
            <div className="p-12 md:p-20 text-center">
              <p className="text-xl text-white/60 mb-10">
                Ready to embark on a cosmic journey together? Reach out across the universe.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {profile?.email && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-6"
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-5 h-5 mr-2" />
                        {profile.email}
                      </a>
                    </Button>
                  </motion.div>
                )}
                {portfolio?.phone && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/20 px-10 py-6"
                      asChild
                    >
                      <a href={`tel:${portfolio.phone}`}>
                        <Phone className="w-5 h-5 mr-2" />
                        {portfolio.phone}
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>

              {userId && <ContactForm portfolioOwnerId={userId} />}
            </div>
          </HolographicCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto opacity-50" />
              ) : (
                <Atom className="w-6 h-6 text-purple-400/50" />
              )}
              <span className="text-white/30">{profile?.display_name}</span>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}

            <p className="text-sm text-white/20">
              © {new Date().getFullYear()} {profile?.display_name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
