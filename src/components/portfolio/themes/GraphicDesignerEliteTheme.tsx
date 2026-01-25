import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Sparkles, Eye, Brush, Droplet,
  Circle, Square, Triangle, Hexagon, Star, Zap, ArrowRight, Frame,
  MousePointer2, Move3D, Wand2
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text, MeshDistortMaterial, Environment, Sparkles as ThreeSparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Dark luxury theme with gradients
const eliteColors = {
  bg: "#0a0a0a",
  card: "#151515",
  accent1: "#ff6b35",
  accent2: "#f7931e",
  accent3: "#ffd700",
  gradient: "linear-gradient(135deg, #ff6b35, #f7931e, #ffd700)",
  text: "#ffffff",
  muted: "#888888",
  border: "#2a2a2a",
};

// 3D Gradient Blob
function GradientBlob({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={eliteColors.accent1}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Interactive 3D Scene
function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color={eliteColors.accent1} />
      <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} color={eliteColors.accent2} />
      
      <GradientBlob position={[-2, 0.5, 0]} scale={0.8} />
      <GradientBlob position={[2, -0.5, 0]} scale={0.6} />
      <GradientBlob position={[0, 1.5, -2]} scale={0.4} />
      
      <ThreeSparkles count={100} scale={10} size={2} speed={0.3} color={eliteColors.accent3} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  );
}

// Scroll animation
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect
function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// Animated text reveal
function TextReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span className="inline-block overflow-hidden">
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

// Project card with 3D tilt
function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="group relative"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="rounded-3xl overflow-hidden"
        style={{ 
          rotateX, 
          rotateY,
          backgroundColor: eliteColors.card,
          transformStyle: "preserve-3d"
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${eliteColors.accent1}, ${eliteColors.accent2})` }}
            >
              <Frame className="w-16 h-16 text-white/30" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex gap-3 mb-4">
                {project.live_url && (
                  <motion.a 
                    href={project.live_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl"
                    style={{ background: eliteColors.gradient }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5 text-black" />
                  </motion.a>
                )}
                {project.github_url && (
                  <motion.a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-white/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                )}
              </div>
            </div>
          </div>

          {/* Number */}
          <div 
            className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
            style={{ background: eliteColors.gradient, color: 'black' }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-sm mb-4 line-clamp-2" style={{ color: eliteColors.muted }}>
            {project.description}
          </p>
          {project.tech_stack && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech: string, idx: number) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full text-xs"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: eliteColors.accent1 }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GraphicDesignerEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const adobeApps = [
    { icon: "Ps", name: "Photoshop", color: "#31A8FF" },
    { icon: "Ai", name: "Illustrator", color: "#FF9A00" },
    { icon: "Id", name: "InDesign", color: "#FF3366" },
    { icon: "Xd", name: "XD", color: "#FF61F6" },
    { icon: "Fg", name: "Figma", color: "#A259FF" },
  ];

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Design";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: eliteColors.bg, color: eliteColors.text }}>
      {/* Navigation - Floating Glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4">
        <div 
          className="max-w-7xl mx-auto rounded-2xl backdrop-blur-xl border"
          style={{ backgroundColor: 'rgba(10,10,10,0.8)', borderColor: eliteColors.border }}
        >
          <div className="flex items-center justify-between h-16 px-6">
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
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: eliteColors.gradient }}
                  >
                    <Wand2 className="w-5 h-5 text-black" />
                  </div>
                </div>
              )}
              <span className="font-bold text-lg hidden sm:block">
                {profile?.display_name?.split(' ')[0] || "Designer"}
                <span className="font-light opacity-50">.elite</span>
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {["Home", "About", "Skills", "Work", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              {profile?.email && (
                <MagneticWrapper>
                  <Button 
                    size="sm" 
                    className="rounded-xl hidden sm:flex"
                    style={{ background: eliteColors.gradient, color: 'black' }}
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>Hire Me</a>
                  </Button>
                </MagneticWrapper>
              )}
              <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl backdrop-blur-xl border overflow-hidden"
              style={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: eliteColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="p-4 space-y-2">
                {["Home", "About", "Skills", "Work", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                    className="block w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Cinematic */}
      <section id="hero" className="min-h-screen relative overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 hidden md:block">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Mobile gradient */}
        <div className="absolute inset-0 md:hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-50"
            style={{ backgroundColor: eliteColors.accent1 }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-50"
            style={{ backgroundColor: eliteColors.accent2 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-24">
          <div className="w-full">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Left - Main Content (3 cols) */}
              <div className="lg:col-span-3 space-y-8">
                <ScrollReveal>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                    style={{ borderColor: eliteColors.accent1, backgroundColor: `${eliteColors.accent1}10` }}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: eliteColors.accent1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm" style={{ color: eliteColors.accent1 }}>Available for Projects</span>
                  </motion.div>
                </ScrollReveal>

                <div className="space-y-2">
                  <ScrollReveal delay={0.1}>
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9]">
                      <TextReveal text="Creative" delay={0.2} />
                    </h1>
                  </ScrollReveal>
                  <ScrollReveal delay={0.2}>
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9]">
                      <span 
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: eliteColors.gradient }}
                      >
                        <TextReveal text="Designer" delay={0.3} />
                      </span>
                    </h1>
                  </ScrollReveal>
                </div>

                <ScrollReveal delay={0.3}>
                  <p className="text-xl max-w-lg" style={{ color: eliteColors.muted }}>
                    {portfolio?.headline || "Transforming brands through innovative design and visual storytelling"}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.4}>
                  <div className="flex flex-wrap gap-4">
                    {profile?.email && (
                      <MagneticWrapper>
                        <Button 
                          size="lg" 
                          className="rounded-xl px-8"
                          style={{ background: eliteColors.gradient, color: 'black' }}
                          asChild
                        >
                          <a href={`mailto:${profile.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Get in Touch
                          </a>
                        </Button>
                      </MagneticWrapper>
                    )}
                    <MagneticWrapper>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="rounded-xl px-8"
                        style={{ borderColor: eliteColors.border }}
                        onClick={() => scrollTo('works')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Work
                      </Button>
                    </MagneticWrapper>
                  </div>
                </ScrollReveal>

                {/* Stats Row */}
                <ScrollReveal delay={0.5}>
                  <div className="flex gap-12 pt-8">
                    <div>
                      <div 
                        className="text-4xl font-black text-transparent bg-clip-text"
                        style={{ backgroundImage: eliteColors.gradient }}
                      >
                        {projects.length}+
                      </div>
                      <div className="text-sm" style={{ color: eliteColors.muted }}>Projects</div>
                    </div>
                    <div>
                      <div 
                        className="text-4xl font-black text-transparent bg-clip-text"
                        style={{ backgroundImage: eliteColors.gradient }}
                      >
                        {experiences.length}+
                      </div>
                      <div className="text-sm" style={{ color: eliteColors.muted }}>Years Exp</div>
                    </div>
                    <div>
                      <div 
                        className="text-4xl font-black text-transparent bg-clip-text"
                        style={{ backgroundImage: eliteColors.gradient }}
                      >
                        {skills.length}
                      </div>
                      <div className="text-sm" style={{ color: eliteColors.muted }}>Skills</div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right - Avatar (2 cols) */}
              <ScrollReveal delay={0.3}>
                <div className="lg:col-span-2 relative hidden lg:flex justify-center">
                  {/* Gradient ring */}
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      background: `conic-gradient(from 0deg, ${eliteColors.accent1}, ${eliteColors.accent2}, ${eliteColors.accent3}, ${eliteColors.accent1})`,
                      padding: '4px'
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: eliteColors.bg }} />
                  </motion.div>
                  
                  <Avatar className="w-72 h-72 border-4 relative" style={{ borderColor: eliteColors.bg }}>
                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                    <AvatarFallback 
                      className="text-6xl"
                      style={{ background: eliteColors.gradient, color: 'black' }}
                    >
                      {profile?.display_name?.charAt(0) || "E"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -top-4 -right-4 px-4 py-2 rounded-xl"
                    style={{ background: eliteColors.gradient, color: 'black' }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <Sparkles className="w-4 h-4" />
                      ELITE
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl border"
                    style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" style={{ color: eliteColors.accent1 }} />
                      Designer
                    </div>
                  </motion.div>
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
          <div 
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
            style={{ borderColor: eliteColors.border }}
          >
            <motion.div 
              className="w-1 h-2 rounded-full"
              style={{ backgroundColor: eliteColors.accent1 }}
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual Grid */}
            <ScrollReveal>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="aspect-square rounded-3xl flex items-center justify-center"
                  style={{ background: eliteColors.gradient }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Palette className="w-20 h-20 text-black/80" />
                </motion.div>
                <motion.div 
                  className="aspect-square rounded-3xl flex items-center justify-center translate-y-8"
                  style={{ backgroundColor: eliteColors.card, border: `1px solid ${eliteColors.border}` }}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                >
                  <PenTool className="w-20 h-20" style={{ color: eliteColors.accent1 }} />
                </motion.div>
                <motion.div 
                  className="aspect-square rounded-3xl flex items-center justify-center -translate-y-4"
                  style={{ backgroundColor: eliteColors.card, border: `1px solid ${eliteColors.border}` }}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                >
                  <Layers className="w-20 h-20" style={{ color: eliteColors.accent2 }} />
                </motion.div>
                <motion.div 
                  className="aspect-square rounded-3xl flex items-center justify-center translate-y-4"
                  style={{ background: `linear-gradient(135deg, ${eliteColors.accent2}, ${eliteColors.accent3})` }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Brush className="w-20 h-20 text-black/80" />
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Right - Content */}
            <div>
              <ScrollReveal>
                <Badge 
                  className="mb-6 px-4 py-2 rounded-full border-0"
                  style={{ background: `${eliteColors.accent1}20`, color: eliteColors.accent1 }}
                >
                  About Me
                </Badge>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-black mb-6">
                  Passion for
                  <span 
                    className="text-transparent bg-clip-text block"
                    style={{ backgroundImage: eliteColors.gradient }}
                  >
                    Creative Excellence
                  </span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: eliteColors.muted }}>
                  {portfolio?.bio || "I'm a passionate creative designer dedicated to crafting exceptional visual experiences. With expertise spanning brand identity, UI/UX design, and digital illustration, I transform ideas into stunning visual narratives that resonate with audiences."}
                </p>
              </ScrollReveal>

              {/* Info cards */}
              <ScrollReveal delay={0.3}>
                <div className="space-y-4">
                  {portfolio?.location && (
                    <div 
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ backgroundColor: eliteColors.card, border: `1px solid ${eliteColors.border}` }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${eliteColors.accent1}20` }}
                      >
                        <MapPin className="w-5 h-5" style={{ color: eliteColors.accent1 }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: eliteColors.muted }}>Location</p>
                        <p className="font-semibold">{portfolio.location}</p>
                      </div>
                    </div>
                  )}
                  {profile?.email && (
                    <div 
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ backgroundColor: eliteColors.card, border: `1px solid ${eliteColors.border}` }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${eliteColors.accent2}20` }}
                      >
                        <Mail className="w-5 h-5" style={{ color: eliteColors.accent2 }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: eliteColors.muted }}>Email</p>
                        <p className="font-semibold">{profile.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.card }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge 
                className="mb-6 px-4 py-2 rounded-full border-0"
                style={{ background: `${eliteColors.accent2}20`, color: eliteColors.accent2 }}
              >
                <Layers className="w-3 h-3 mr-2" />
                Skills & Tools
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-black">
                My Creative
                <span 
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: eliteColors.gradient }}
                > Arsenal</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Tools */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {adobeApps.map((app, i) => (
                <motion.div
                  key={app.icon}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl border"
                  style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.bg }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, borderColor: app.color }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.icon}
                  </div>
                  <span className="font-medium">{app.name}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Skills Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIdx) => (
              <ScrollReveal key={category} delay={catIdx * 0.1}>
                <motion.div 
                  className="p-6 rounded-3xl border"
                  style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.bg }}
                  whileHover={{ borderColor: [eliteColors.accent1, eliteColors.accent2, eliteColors.accent3][catIdx % 3] }}
                >
                  <h3 
                    className="text-lg font-bold mb-4 flex items-center gap-2"
                    style={{ color: [eliteColors.accent1, eliteColors.accent2, eliteColors.accent3][catIdx % 3] }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      >
                        {skill.name}
                      </span>
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
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16">
              <div>
                <Badge 
                  className="mb-6 px-4 py-2 rounded-full border-0"
                  style={{ background: `${eliteColors.accent3}20`, color: eliteColors.accent3 }}
                >
                  <Frame className="w-3 h-3 mr-2" />
                  Portfolio
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-black">
                  Featured
                  <span 
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: eliteColors.gradient }}
                  > Works</span>
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {allProjects.slice(0, 6).map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.card }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              {experiences.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: eliteColors.gradient }}
                      >
                        <Briefcase className="w-5 h-5 text-black" />
                      </div>
                      Experience
                    </h3>
                  </ScrollReveal>
                  <div className="space-y-8">
                    {experiences.map((exp, i) => (
                      <ScrollReveal key={exp.id} delay={i * 0.1}>
                        <motion.div 
                          className="relative pl-8"
                          whileHover={{ x: 10 }}
                        >
                          <div 
                            className="absolute left-0 top-0 w-3 h-3 rounded-full"
                            style={{ backgroundColor: eliteColors.accent1 }}
                          />
                          <div 
                            className="absolute left-1.5 top-3 w-0.5 h-full -translate-x-1/2"
                            style={{ backgroundColor: eliteColors.border }}
                          />
                          <p className="font-bold text-lg">{exp.position}</p>
                          <p style={{ color: eliteColors.accent1 }}>{exp.company}</p>
                          <p className="text-sm mt-1" style={{ color: eliteColors.muted }}>
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </p>
                        </motion.div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${eliteColors.accent2}, ${eliteColors.accent3})` }}
                      >
                        <GraduationCap className="w-5 h-5 text-black" />
                      </div>
                      Education
                    </h3>
                  </ScrollReveal>
                  <div className="space-y-8">
                    {education.map((edu, i) => (
                      <ScrollReveal key={edu.id} delay={i * 0.1}>
                        <motion.div 
                          className="relative pl-8"
                          whileHover={{ x: 10 }}
                        >
                          <div 
                            className="absolute left-0 top-0 w-3 h-3 rounded-full"
                            style={{ backgroundColor: eliteColors.accent2 }}
                          />
                          <div 
                            className="absolute left-1.5 top-3 w-0.5 h-full -translate-x-1/2"
                            style={{ backgroundColor: eliteColors.border }}
                          />
                          <p className="font-bold text-lg">{edu.degree}</p>
                          <p style={{ color: eliteColors.accent2 }}>{edu.institution}</p>
                          <p className="text-sm mt-1" style={{ color: eliteColors.muted }}>{edu.field_of_study}</p>
                        </motion.div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 50% 50%, ${eliteColors.accent1}30, transparent 70%)` }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <Badge 
              className="mb-6 px-4 py-2 rounded-full border-0"
              style={{ background: `${eliteColors.accent1}20`, color: eliteColors.accent1 }}
            >
              <Mail className="w-3 h-3 mr-2" />
              Get in Touch
            </Badge>
            <h2 className="text-4xl sm:text-6xl font-black mb-6">
              Let's Create
              <span 
                className="text-transparent bg-clip-text block"
                style={{ backgroundImage: eliteColors.gradient }}
              >
                Something Epic
              </span>
            </h2>
            <p className="text-xl mb-12" style={{ color: eliteColors.muted }}>
              Ready to elevate your brand? Let's make it happen.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <MagneticWrapper>
                  <Button 
                    size="lg" 
                    className="rounded-xl px-8"
                    style={{ background: eliteColors.gradient, color: 'black' }}
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      {profile.email}
                    </a>
                  </Button>
                </MagneticWrapper>
              )}
              {portfolio?.phone && (
                <MagneticWrapper>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-xl px-8"
                    style={{ borderColor: eliteColors.border }}
                    asChild
                  >
                    <a href={`tel:${portfolio.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {portfolio.phone}
                    </a>
                  </Button>
                </MagneticWrapper>
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
                    className="p-4 rounded-xl border"
                    style={{ borderColor: eliteColors.border, backgroundColor: eliteColors.card }}
                    whileHover={{ scale: 1.1, borderColor: eliteColors.accent1 }}
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
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: eliteColors.gradient }}
              >
                <Wand2 className="w-4 h-4 text-black" />
              </div>
            )}
            <span style={{ color: eliteColors.muted }}>
              © {new Date().getFullYear()} {profile?.display_name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: eliteColors.muted }}>
            <span>Built with</span>
            <span style={{ color: eliteColors.accent1 }}>✨</span>
            <a 
              href="https://alphaportfolio0.lovable.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline"
              style={{ color: eliteColors.accent1 }}
            >
              Alpha Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
