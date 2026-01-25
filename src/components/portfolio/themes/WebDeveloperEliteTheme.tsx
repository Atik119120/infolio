import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, ChevronRight, Folder, FileCode, 
  Cpu, Database, Server, GitBranch, Layers, Zap, ArrowRight, Sparkles,
  Monitor, Smartphone, Tablet, Command, Hash
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// Glassmorphism cyberpunk theme
const eliteColors = {
  bg: "#050510",
  card: "rgba(15, 15, 35, 0.8)",
  cardSolid: "#0f0f23",
  border: "rgba(100, 100, 255, 0.2)",
  text: "#ffffff",
  muted: "#8888aa",
  // Gradients
  gradient1: "#6366f1",
  gradient2: "#8b5cf6",
  gradient3: "#d946ef",
  gradient4: "#f43f5e",
  // Neon
  neonCyan: "#00fff5",
  neonPink: "#ff00ff",
  neonYellow: "#ffff00",
};

// 3D Animated Torus
function AnimatedTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2, 0.5, 32, 100]} />
      <meshStandardMaterial 
        color={eliteColors.gradient1} 
        metalness={0.9} 
        roughness={0.1}
        emissive={eliteColors.gradient2}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// 3D Energy Sphere
function EnergySphere({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[0.3, 64, 64]} position={position}>
        <MeshDistortMaterial 
          color={color} 
          attach="material" 
          distort={0.5} 
          speed={3} 
          roughness={0}
          metalness={1}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

// Hero 3D Scene
function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={eliteColors.gradient1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={eliteColors.gradient3} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <AnimatedTorus />
      <EnergySphere position={[-3, 1, 0]} color={eliteColors.neonCyan} />
      <EnergySphere position={[3, -1, 0]} color={eliteColors.neonPink} />
      <EnergySphere position={[0, 2, -2]} color={eliteColors.gradient3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}

// Magnetic button effect
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Animated counter
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Scroll animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Glowing text effect
function GlowText({ children, color = eliteColors.gradient1 }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.span
      className="relative inline-block"
      animate={{ textShadow: [`0 0 20px ${color}80`, `0 0 40px ${color}`, `0 0 20px ${color}80`] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}

export default function WebDeveloperEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
    { id: "hero", label: "Home", icon: Monitor },
    { id: "bio", label: "About", icon: Command },
    { id: "skills", label: "Stack", icon: Layers },
    { id: "works", label: "Work", icon: Folder },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: eliteColors.bg, color: eliteColors.text }}>
      {/* Cursor follower */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          background: `radial-gradient(circle, ${eliteColors.gradient1}20, transparent 70%)`,
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
      />

      {/* Navigation - Glass */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4 rounded-2xl backdrop-blur-xl border" style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {portfolio?.logo_url ? (
                  <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <motion.div 
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] blur-lg opacity-50"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                )}
                <div className="hidden sm:block">
                  <span className="font-bold">{profile?.display_name?.split(' ')[0] || "Developer"}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#d946ef]">.elite</span>
                </div>
              </motion.div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* CTA + Mobile Menu */}
              <div className="flex items-center gap-3">
                {profile?.email && (
                  <MagneticButton className="hidden sm:block">
                    <Button 
                      size="sm" 
                      className="rounded-xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] hover:opacity-90"
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>Hire Me</a>
                    </Button>
                  </MagneticButton>
                )}
                <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden mx-4 mt-2 rounded-2xl backdrop-blur-xl border overflow-hidden"
              style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative overflow-hidden pt-24">
        {/* 3D Background - Desktop */}
        <div className="absolute inset-0 hidden md:block">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Mobile gradient */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366f120] via-transparent to-[#d946ef20]" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#6366f1] blur-[100px] opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#d946ef] blur-[100px] opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-6rem)] flex items-center">
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <ScrollReveal>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl"
                    style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm">Available for new projects</span>
                  </motion.div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="block" style={{ color: eliteColors.muted }}>Hello, I'm</span>
                    <GlowText color={eliteColors.gradient1}>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef]">
                        {profile?.display_name || "Developer"}
                      </span>
                    </GlowText>
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <p className="text-xl sm:text-2xl" style={{ color: eliteColors.muted }}>
                    {portfolio?.headline || "Full Stack Developer & Designer"}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="flex flex-wrap gap-3">
                    {skills.slice(0, 5).map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        className="px-4 py-2 rounded-xl backdrop-blur-xl border"
                        style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: eliteColors.gradient1 }}
                      >
                        <span className="text-sm">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.4}>
                  <div className="flex flex-wrap gap-4">
                    {profile?.email && (
                      <MagneticButton>
                        <Button 
                          size="lg" 
                          className="rounded-xl px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] hover:opacity-90"
                          asChild
                        >
                          <a href={`mailto:${profile.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Let's Talk
                          </a>
                        </Button>
                      </MagneticButton>
                    )}
                    <MagneticButton>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="rounded-xl px-8 border-white/20 hover:bg-white/5"
                        onClick={() => scrollTo('works')}
                      >
                        <Folder className="w-4 h-4 mr-2" />
                        View Work
                      </Button>
                    </MagneticButton>
                  </div>
                </ScrollReveal>

                {/* Stats */}
                <ScrollReveal delay={0.5}>
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                    <div>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">
                        <Counter value={projects.length} suffix="+" />
                      </div>
                      <div className="text-sm" style={{ color: eliteColors.muted }}>Projects</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]">
                        <Counter value={experiences.length} suffix="+" />
                      </div>
                      <div className="text-sm" style={{ color: eliteColors.muted }}>Years Exp</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#f43f5e]">
                        <Counter value={skills.length} />
                      </div>
                      <div className="text-sm" style={{ color: eliteColors.muted }}>Skills</div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right - Avatar */}
              <ScrollReveal delay={0.2}>
                <div className="relative hidden lg:flex justify-center">
                  {/* Glowing background */}
                  <motion.div 
                    className="absolute w-80 h-80 rounded-full blur-3xl opacity-40"
                    style={{ background: `linear-gradient(135deg, ${eliteColors.gradient1}, ${eliteColors.gradient3})` }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity }}
                  />
                  
                  {/* Avatar container */}
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] opacity-80"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <Avatar className="w-72 h-72 border-4 border-white/10 relative">
                      <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                      <AvatarFallback className="text-6xl bg-gradient-to-br from-[#6366f1] to-[#d946ef]">
                        {profile?.display_name?.charAt(0) || "E"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Floating badges */}
                    <motion.div 
                      className="absolute -top-4 -right-4 px-4 py-2 rounded-xl backdrop-blur-xl border"
                      style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold">ELITE</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl backdrop-blur-xl border"
                      style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" style={{ color: eliteColors.gradient1 }} />
                        <span>Developer</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div 
              className="w-1 h-2 rounded-full bg-white/50"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-[#6366f1]/20 to-[#d946ef]/20 border-0">
                <Command className="w-3 h-3 mr-2" />
                About Me
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Crafting Digital
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#d946ef]"> Experiences</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Bio Card */}
            <ScrollReveal delay={0.1}>
              <motion.div 
                className="lg:col-span-2 rounded-3xl border backdrop-blur-xl p-8"
                style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                whileHover={{ borderColor: eliteColors.gradient1 }}
              >
                <h3 className="text-2xl font-bold mb-4">My Story</h3>
                <p className="text-lg leading-relaxed" style={{ color: eliteColors.muted }}>
                  {portfolio?.bio || "Passionate about creating innovative digital solutions that make a difference. With years of experience in full-stack development, I bring ideas to life through clean code and thoughtful design."}
                </p>
                
                {/* Quick info */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <MapPin className="w-5 h-5" style={{ color: eliteColors.gradient1 }} />
                      <span>{portfolio.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <Mail className="w-5 h-5" style={{ color: eliteColors.gradient2 }} />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Experience Card */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                className="rounded-3xl border backdrop-blur-xl p-8"
                style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                whileHover={{ borderColor: eliteColors.gradient2 }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" style={{ color: eliteColors.gradient2 }} />
                  Experience
                </h3>
                <div className="space-y-6">
                  {experiences.slice(0, 3).map((exp, i) => (
                    <div key={exp.id} className="relative pl-6 border-l-2 border-white/10">
                      <div className="absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-[7px]" style={{ backgroundColor: eliteColors.gradient1 }} />
                      <p className="font-semibold">{exp.position}</p>
                      <p className="text-sm" style={{ color: eliteColors.muted }}>{exp.company}</p>
                      <p className="text-xs mt-1" style={{ color: eliteColors.muted }}>
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.cardSolid }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-[#8b5cf6]/20 to-[#d946ef]/20 border-0">
                <Layers className="w-3 h-3 mr-2" />
                Tech Stack
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Skills &
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]"> Technologies</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIdx) => (
              <ScrollReveal key={category} delay={catIdx * 0.1}>
                <motion.div 
                  className="rounded-3xl border backdrop-blur-xl p-6"
                  style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                  whileHover={{ borderColor: [eliteColors.gradient1, eliteColors.gradient2, eliteColors.gradient3][catIdx % 3] }}
                >
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Hash className="w-4 h-4" style={{ color: [eliteColors.gradient1, eliteColors.gradient2, eliteColors.gradient3][catIdx % 3] }} />
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <motion.span
                        key={skill.id}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        whileHover={{ 
                          backgroundColor: [eliteColors.gradient1, eliteColors.gradient2, eliteColors.gradient3][catIdx % 3] + '30',
                          scale: 1.05
                        }}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-[#d946ef]/20 to-[#f43f5e]/20 border-0">
                <Folder className="w-3 h-3 mr-2" />
                Portfolio
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Featured
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#f43f5e]"> Projects</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {allProjects.slice(0, 4).map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <motion.div 
                  className="group rounded-3xl border overflow-hidden"
                  style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                  whileHover={{ borderColor: eliteColors.gradient1 }}
                >
                  {project.image_url && (
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                        <div className="flex gap-3">
                          {project.live_url && (
                            <motion.a 
                              href={project.live_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                              whileHover={{ scale: 1.1 }}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </motion.a>
                          )}
                          {project.github_url && (
                            <motion.a 
                              href={project.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl border border-white/20"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Github className="w-5 h-5" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.featured && (
                        <Badge className="bg-gradient-to-r from-[#d946ef]/20 to-[#f43f5e]/20 border-0 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: eliteColors.muted }}>
                      {project.description}
                    </p>
                    {project.tech_stack && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.slice(0, 4).map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 rounded-lg text-xs"
                            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.cardSolid }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-[#6366f1]/20 to-[#d946ef]/20 border-0">
              <Mail className="w-3 h-3 mr-2" />
              Get in Touch
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Let's Work
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#d946ef]"> Together</span>
            </h2>
            <p className="text-xl mb-12" style={{ color: eliteColors.muted }}>
              Have a project in mind? Let's create something amazing together.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <MagneticButton>
                  <Button 
                    size="lg" 
                    className="rounded-xl px-8 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef]"
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </MagneticButton>
              )}
              {portfolio?.phone && (
                <MagneticButton>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-xl px-8 border-white/20"
                    asChild
                  >
                    <a href={`tel:${portfolio.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {portfolio.phone}
                    </a>
                  </Button>
                </MagneticButton>
              )}
            </div>
          </ScrollReveal>

          {socialLinks.length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="flex justify-center gap-4 mt-12">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border backdrop-blur-xl"
                    style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                    whileHover={{ scale: 1.1, borderColor: eliteColors.gradient1 }}
                  >
                    {getSocialIcon(link.platform)}
                  </motion.a>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: eliteColors.border }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-6 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#d946ef] flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
            )}
            <span style={{ color: eliteColors.muted }}>
              © {new Date().getFullYear()} {profile?.display_name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: eliteColors.muted }}>
            <span>Powered by</span>
            <a href="https://alphaportfolio0.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:underline text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#d946ef] font-medium">
              Alpha Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
