import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Sparkles, Eye, Brush, Droplet,
  Circle, Square, Triangle, Hexagon, Star, Zap, ArrowRight, Frame
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Torus, Cone, Icosahedron, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Magazine/Editorial style colors
const proColors = {
  bg: "#faf8f5",
  card: "#ffffff",
  dark: "#1a1a1a",
  accent1: "#ff4d4d",
  accent2: "#4d4dff",
  accent3: "#ffd700",
  accent4: "#00d4aa",
  muted: "#666666",
  border: "#e5e5e5",
};

// 3D Floating shapes
function FloatingShape({ type, position, color }: { type: string; position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        {type === 'torus' && <torusGeometry args={[0.4, 0.15, 16, 32]} />}
        {type === 'cone' && <coneGeometry args={[0.4, 0.8, 4]} />}
        {type === 'icosahedron' && <icosahedronGeometry args={[0.4]} />}
        {type === 'box' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
    </Float>
  );
}

// 3D Scene
function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FloatingShape type="torus" position={[-2, 1.5, 0]} color={proColors.accent1} />
      <FloatingShape type="cone" position={[2, -1, 0]} color={proColors.accent2} />
      <FloatingShape type="icosahedron" position={[-1.5, -1.5, 1]} color={proColors.accent3} />
      <FloatingShape type="box" position={[1.5, 1, -1]} color={proColors.accent4} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}

// Scroll reveal animation
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

// Marquee text component
function MarqueeText({ text, direction = 1 }: { text: string; direction?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-block mx-8 text-6xl sm:text-8xl font-black uppercase" style={{ WebkitTextStroke: `2px ${proColors.dark}`, color: 'transparent' }}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Color swatch component
function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <motion.div 
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.1, y: -5 }}
    >
      <div 
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-mono" style={{ color: proColors.muted }}>{name}</span>
    </motion.div>
  );
}

export default function GraphicDesignerProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const adobeApps = [
    { icon: "Ps", name: "Photoshop", color: "#31A8FF" },
    { icon: "Ai", name: "Illustrator", color: "#FF9A00" },
    { icon: "Id", name: "InDesign", color: "#FF3366" },
    { icon: "Xd", name: "XD", color: "#FF61F6" },
    { icon: "Fg", name: "Figma", color: "#A259FF" },
    { icon: "Ae", name: "After Effects", color: "#9999FF" },
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
    <div className="min-h-screen font-sans" style={{ backgroundColor: proColors.bg, color: proColors.dark }}>
      {/* Navigation - Magazine Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b" style={{ borderColor: proColors.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: proColors.accent1 }}>
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-lg tracking-tight">{profile?.display_name?.split(' ')[0] || "Designer"}</span>
                  <span className="font-light text-lg">.pro</span>
                </div>
              )}
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Work", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm font-medium hover:text-[#ff4d4d] transition-colors relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4d4d] group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              {profile?.email && (
                <Button 
                  size="sm" 
                  className="hidden sm:flex rounded-full px-6"
                  style={{ backgroundColor: proColors.dark }}
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>Let's Talk</a>
                </Button>
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
              className="md:hidden bg-white border-t px-6 py-4"
              style={{ borderColor: proColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Work", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="block w-full text-left py-3 text-lg font-medium"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Editorial Magazine Style */}
      <section id="hero" className="min-h-screen pt-16 relative overflow-hidden">
        {/* 3D Background - Desktop */}
        <div className="absolute inset-0 hidden md:block opacity-30">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center py-12">
            {/* Left - Text */}
            <div className="order-2 lg:order-1">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1">
                    {[proColors.accent1, proColors.accent2, proColors.accent3].map((color, i) => (
                      <motion.div 
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: proColors.muted }}>Creative Designer</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.9] mb-6">
                  <span className="block">{profile?.display_name?.split(' ')[0] || "Creative"}</span>
                  <span className="block" style={{ color: proColors.accent1 }}>{profile?.display_name?.split(' ').slice(1).join(' ') || "Designer"}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-xl mb-8 max-w-md" style={{ color: proColors.muted }}>
                  {portfolio?.headline || "Crafting visual stories that captivate and inspire"}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mb-10">
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      className="rounded-full px-8"
                      style={{ backgroundColor: proColors.accent1 }}
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Get in Touch
                      </a>
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 border-2"
                    style={{ borderColor: proColors.dark }}
                    onClick={() => scrollTo('works')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                </div>
              </ScrollReveal>

              {/* Tools */}
              <ScrollReveal delay={0.4}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: proColors.muted }}>Tools:</span>
                  <div className="flex gap-2">
                    {adobeApps.slice(0, 5).map((app, i) => (
                      <motion.div
                        key={app.icon}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: app.color }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ y: -5, scale: 1.1 }}
                      >
                        {app.icon}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right - Avatar with creative frame */}
            <ScrollReveal delay={0.2}>
              <div className="order-1 lg:order-2 relative flex justify-center">
                {/* Decorative shapes */}
                <motion.div 
                  className="absolute -top-8 -left-8 w-32 h-32 rounded-full"
                  style={{ backgroundColor: proColors.accent3 }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -bottom-8 -right-8 w-24 h-24"
                  style={{ backgroundColor: proColors.accent2, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Main avatar */}
                <div className="relative">
                  <motion.div 
                    className="absolute -inset-4 rounded-3xl"
                    style={{ backgroundColor: proColors.accent1 }}
                    animate={{ rotate: [3, -3, 3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -inset-4 rounded-3xl"
                    style={{ backgroundColor: proColors.accent2 }}
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <Avatar className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border-4 border-white relative shadow-2xl">
                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover rounded-2xl" />
                    <AvatarFallback className="text-6xl rounded-2xl" style={{ backgroundColor: proColors.accent1, color: 'white' }}>
                      {profile?.display_name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Marquee */}
        <div className="absolute bottom-0 left-0 right-0 py-6 overflow-hidden" style={{ backgroundColor: proColors.dark }}>
          <MarqueeText text="Creative • Design • Innovation • Art •" />
        </div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image grid */}
            <ScrollReveal>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="aspect-square rounded-3xl overflow-hidden"
                  style={{ backgroundColor: proColors.accent1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-16 h-16 text-white" />
                  </div>
                </motion.div>
                <motion.div 
                  className="aspect-square rounded-3xl overflow-hidden translate-y-8"
                  style={{ backgroundColor: proColors.accent2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <PenTool className="w-16 h-16 text-white" />
                  </div>
                </motion.div>
                <motion.div 
                  className="aspect-square rounded-3xl overflow-hidden -translate-y-4"
                  style={{ backgroundColor: proColors.accent3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-16 h-16 text-white" />
                  </div>
                </motion.div>
                <motion.div 
                  className="aspect-square rounded-3xl overflow-hidden translate-y-4"
                  style={{ backgroundColor: proColors.accent4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Brush className="w-16 h-16 text-white" />
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Right - Content */}
            <div>
              <ScrollReveal>
                <Badge className="mb-6 px-4 py-2 rounded-full" style={{ backgroundColor: `${proColors.accent1}20`, color: proColors.accent1 }}>
                  About Me
                </Badge>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-black mb-6">
                  Designing with
                  <span style={{ color: proColors.accent1 }}> Passion</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: proColors.muted }}>
                  {portfolio?.bio || "I'm a creative professional with a passion for visual storytelling. With expertise in brand identity, UI/UX design, and digital illustration, I help brands communicate their unique stories through compelling visuals."}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: proColors.card }}>
                    <div className="text-3xl font-black" style={{ color: proColors.accent1 }}>{projects.length}+</div>
                    <div className="text-sm" style={{ color: proColors.muted }}>Projects</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: proColors.card }}>
                    <div className="text-3xl font-black" style={{ color: proColors.accent2 }}>{experiences.length}+</div>
                    <div className="text-sm" style={{ color: proColors.muted }}>Years</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: proColors.card }}>
                    <div className="text-3xl font-black" style={{ color: proColors.accent4 }}>{skills.length}</div>
                    <div className="text-sm" style={{ color: proColors.muted }}>Skills</div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Location & Contact */}
              <ScrollReveal delay={0.4}>
                <div className="flex flex-wrap gap-4">
                  {portfolio?.location && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: proColors.card }}>
                      <MapPin className="w-4 h-4" style={{ color: proColors.accent1 }} />
                      <span>{portfolio.location}</span>
                    </div>
                  )}
                  {portfolio?.phone && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: proColors.card }}>
                      <Phone className="w-4 h-4" style={{ color: proColors.accent2 }} />
                      <span>{portfolio.phone}</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: proColors.dark, color: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge className="mb-6 px-4 py-2 rounded-full bg-white/10 text-white border-0">
                <Layers className="w-3 h-3 mr-2" />
                My Toolkit
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-black">
                Skills & <span style={{ color: proColors.accent3 }}>Expertise</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Adobe Apps */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {adobeApps.map((app, i) => (
                <motion.div
                  key={app.icon}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: `${app.color}30` }}
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

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIdx) => (
              <ScrollReveal key={category} delay={catIdx * 0.1}>
                <motion.div 
                  className="p-6 rounded-3xl bg-white/5"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: [proColors.accent1, proColors.accent2, proColors.accent3, proColors.accent4][catIdx % 4] }}>
                    <Sparkles className="w-4 h-4" />
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 rounded-full text-sm bg-white/10"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Color Palette */}
          <ScrollReveal delay={0.3}>
            <div className="mt-16 text-center">
              <h3 className="text-lg font-medium mb-8" style={{ color: proColors.muted }}>My Color Palette</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <ColorSwatch color={proColors.accent1} name="#FF4D4D" />
                <ColorSwatch color={proColors.accent2} name="#4D4DFF" />
                <ColorSwatch color={proColors.accent3} name="#FFD700" />
                <ColorSwatch color={proColors.accent4} name="#00D4AA" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects Section - Magazine Grid */}
      <section id="works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16">
              <div>
                <Badge className="mb-6 px-4 py-2 rounded-full" style={{ backgroundColor: `${proColors.accent2}20`, color: proColors.accent2 }}>
                  <Frame className="w-3 h-3 mr-2" />
                  Portfolio
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-black">
                  Selected <span style={{ color: proColors.accent2 }}>Works</span>
                </h2>
              </div>
              <p className="text-lg max-w-md mt-4 sm:mt-0" style={{ color: proColors.muted }}>
                A curated collection of my best design projects
              </p>
            </div>
          </ScrollReveal>

          {/* Projects Grid - Magazine Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allProjects.slice(0, 6).map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <motion.div 
                  className={`group relative rounded-3xl overflow-hidden ${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}
                  style={{ backgroundColor: proColors.card }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className={`relative ${i === 0 || i === 3 ? 'aspect-[2/1]' : 'aspect-square'}`}>
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: [proColors.accent1, proColors.accent2, proColors.accent3, proColors.accent4][i % 4] }}>
                        <Frame className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <motion.div 
                      className="absolute inset-0 flex flex-col justify-end p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
                    >
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2">{project.title}</h3>
                          <p className="text-white/70 line-clamp-2">{project.description}</p>
                          {project.tech_stack && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.tech_stack.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-full text-xs bg-white/20 text-white">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {project.live_url && (
                            <a 
                              href={project.live_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl text-white"
                              style={{ backgroundColor: proColors.accent1 }}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          {project.github_url && (
                            <a 
                              href={project.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-white/20 text-white"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="rounded-full px-4" style={{ backgroundColor: proColors.accent3, color: proColors.dark }}>
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: proColors.card }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.accent1 }}>
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      Experience
                    </h3>
                  </ScrollReveal>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <ScrollReveal key={exp.id} delay={i * 0.1}>
                        <motion.div 
                          className="relative pl-8 border-l-2"
                          style={{ borderColor: proColors.accent1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]" style={{ backgroundColor: proColors.accent1 }} />
                          <p className="font-bold text-lg">{exp.position}</p>
                          <p style={{ color: proColors.accent1 }}>{exp.company}</p>
                          <p className="text-sm mt-1" style={{ color: proColors.muted }}>
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </p>
                          {exp.description && (
                            <p className="text-sm mt-2" style={{ color: proColors.muted }}>{exp.description}</p>
                          )}
                        </motion.div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.accent2 }}>
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      Education
                    </h3>
                  </ScrollReveal>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <ScrollReveal key={edu.id} delay={i * 0.1}>
                        <motion.div 
                          className="relative pl-8 border-l-2"
                          style={{ borderColor: proColors.accent2 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]" style={{ backgroundColor: proColors.accent2 }} />
                          <p className="font-bold text-lg">{edu.degree}</p>
                          <p style={{ color: proColors.accent2 }}>{edu.institution}</p>
                          <p className="text-sm mt-1" style={{ color: proColors.muted }}>
                            {edu.field_of_study}
                          </p>
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
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: proColors.accent1 }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-6xl font-black mb-6">
              Let's Create<br />Something Amazing
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-xl mb-12 opacity-90">
              Have a project in mind? Let's bring your vision to life.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-full px-8 text-[#ff4d4d]"
                  style={{ backgroundColor: 'white' }}
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
                  className="rounded-full px-8 border-2 border-white text-white hover:bg-white/10"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>

          {socialLinks.length > 0 && (
            <ScrollReveal delay={0.3}>
              <div className="flex justify-center gap-4 mt-12">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
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
      <footer className="py-12 px-4 border-t" style={{ borderColor: proColors.border, backgroundColor: proColors.bg }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-6 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: proColors.accent1 }}>
                <Palette className="w-4 h-4 text-white" />
              </div>
            )}
            <span style={{ color: proColors.muted }}>
              © {new Date().getFullYear()} {profile?.display_name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: proColors.muted }}>
            <span>Designed with</span>
            <span style={{ color: proColors.accent1 }}>✨</span>
            <a href="https://alphaportfolio0.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: proColors.accent1 }}>
              Alpha Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
