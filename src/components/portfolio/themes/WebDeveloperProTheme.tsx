import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, ChevronRight, Folder, FileCode, 
  Cpu, Database, Server, GitBranch, Box, Layers, Zap, ArrowRight
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center, MeshDistortMaterial, Sphere, Box as ThreeBox } from "@react-three/drei";
import * as THREE from "three";

// Matrix-style dark theme with neon accents
const matrixColors = {
  bg: "#0a0a0f",
  card: "#12121a",
  border: "#1e1e2e",
  text: "#e4e4e7",
  comment: "#6b7280",
  neonGreen: "#00ff88",
  neonBlue: "#00d4ff",
  neonPurple: "#a855f7",
  neonPink: "#ec4899",
  neonOrange: "#f97316",
};

// 3D Floating Code Cube Component
function FloatingCube({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

// 3D Sphere with distortion
function GlowingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere args={[0.5, 32, 32]} position={position}>
        <MeshDistortMaterial 
          color={color} 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={matrixColors.neonGreen} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={matrixColors.neonBlue} />
      <spotLight position={[0, 5, 0]} intensity={0.8} color={matrixColors.neonPurple} />
      
      <FloatingCube position={[-2, 1, 0]} color={matrixColors.neonGreen} />
      <FloatingCube position={[2, -1, 0]} color={matrixColors.neonBlue} />
      <FloatingCube position={[0, 0, -2]} color={matrixColors.neonPurple} />
      <GlowingSphere position={[-1.5, -1.5, 1]} color={matrixColors.neonPink} />
      <GlowingSphere position={[1.5, 1.5, 1]} color={matrixColors.neonOrange} />
    </Canvas>
  );
}

// Terminal Animation Component
function TerminalCode({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayed}<span className="animate-pulse">_</span></span>;
}

// Scroll animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Bento Grid Card Component
function BentoCard({ children, className = "", glow = matrixColors.neonGreen }: { children: React.ReactNode; className?: string; glow?: string }) {
  return (
    <motion.div 
      className={`relative rounded-2xl border overflow-hidden ${className}`}
      style={{ backgroundColor: matrixColors.card, borderColor: matrixColors.border }}
      whileHover={{ scale: 1.02, borderColor: glow }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500" 
        style={{ background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glow}10, transparent 40%)` }} 
      />
      {children}
    </motion.div>
  );
}

export default function WebDeveloperProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setActiveSection(id);
  };

  const navItems = [
    { id: "hero", label: "~/home", icon: Terminal },
    { id: "bio", label: "~/about", icon: Code2 },
    { id: "skills", label: "~/skills", icon: Cpu },
    { id: "works", label: "~/projects", icon: Folder },
    { id: "contact", label: "~/contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen font-mono" style={{ backgroundColor: matrixColors.bg, color: matrixColors.text }}>
      {/* Matrix Rain Effect Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs"
            style={{ 
              left: `${(i * 3.33)}%`,
              color: matrixColors.neonGreen,
            }}
            initial={{ y: -100 }}
            animate={{ y: "100vh" }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            {[..."01001011"].map((char, j) => (
              <div key={j} className="my-1">{char}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ backgroundColor: `${matrixColors.bg}e6` }}>
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
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: matrixColors.neonGreen, backgroundColor: `${matrixColors.neonGreen}10` }}>
                  <Terminal className="w-4 h-4" style={{ color: matrixColors.neonGreen }} />
                  <span className="font-bold text-sm" style={{ color: matrixColors.neonGreen }}>DEV</span>
                </div>
              )}
              <span className="hidden sm:block text-sm" style={{ color: matrixColors.comment }}>
                {profile?.display_name || "Developer"}.pro
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
                  style={{ 
                    color: activeSection === item.id ? matrixColors.neonGreen : matrixColors.comment,
                    backgroundColor: activeSection === item.id ? `${matrixColors.neonGreen}15` : "transparent"
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ backgroundColor: `${matrixColors.neonGreen}10` }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden border-t px-4 py-4"
              style={{ backgroundColor: matrixColors.card, borderColor: matrixColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center gap-3 w-full py-3 text-left"
                  style={{ color: activeSection === item.id ? matrixColors.neonGreen : matrixColors.text }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with 3D */}
      <section id="hero" className="min-h-screen pt-16 relative overflow-hidden">
        {/* 3D Background - Desktop only */}
        <div className="absolute inset-0 hidden md:block">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </div>

        {/* Mobile gradient background */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff8820] via-transparent to-[#00d4ff20]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <ScrollReveal>
              <div className="space-y-8">
                {/* Terminal Header */}
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: matrixColors.card, borderColor: matrixColors.border }}>
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: matrixColors.border }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs ml-2" style={{ color: matrixColors.comment }}>zsh</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div style={{ color: matrixColors.neonGreen }}>
                      <span style={{ color: matrixColors.neonBlue }}>➜</span>{" "}
                      <span style={{ color: matrixColors.neonPurple }}>~</span>{" "}
                      <TerminalCode text={`whoami`} />
                    </div>
                    <div className="mt-2 text-lg sm:text-xl font-bold" style={{ color: matrixColors.text }}>
                      {profile?.display_name || "Developer"}
                    </div>
                    <div className="mt-3" style={{ color: matrixColors.neonGreen }}>
                      <span style={{ color: matrixColors.neonBlue }}>➜</span>{" "}
                      <span style={{ color: matrixColors.neonPurple }}>~</span>{" "}
                      <TerminalCode text={`cat title.txt`} delay={1000} />
                    </div>
                    <div className="mt-2" style={{ color: matrixColors.comment }}>
                      {portfolio?.headline || "Full Stack Developer"}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: matrixColors.neonGreen, backgroundColor: `${matrixColors.neonGreen}10` }}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: matrixColors.neonGreen }} />
                    <span className="text-sm" style={{ color: matrixColors.neonGreen }}>Available for hire</span>
                  </div>
                  {portfolio?.location && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: matrixColors.comment }}>
                      <MapPin className="w-4 h-4" />
                      {portfolio.location}
                    </div>
                  )}
                </motion.div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 8).map((skill, i) => (
                    <motion.span
                      key={skill.id}
                      className="px-3 py-1.5 rounded-lg text-xs border"
                      style={{ 
                        borderColor: [matrixColors.neonGreen, matrixColors.neonBlue, matrixColors.neonPurple, matrixColors.neonPink][i % 4],
                        color: [matrixColors.neonGreen, matrixColors.neonBlue, matrixColors.neonPurple, matrixColors.neonPink][i % 4],
                        backgroundColor: `${[matrixColors.neonGreen, matrixColors.neonBlue, matrixColors.neonPurple, matrixColors.neonPink][i % 4]}10`
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      className="rounded-xl px-8"
                      style={{ backgroundColor: matrixColors.neonGreen, color: matrixColors.bg }}
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Me
                      </a>
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-xl px-8"
                    style={{ borderColor: matrixColors.neonBlue, color: matrixColors.neonBlue }}
                    onClick={() => scrollTo('works')}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    View Projects
                  </Button>
                </div>

                {/* Social Links */}
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
                          className="p-3 rounded-xl border transition-all"
                          style={{ borderColor: matrixColors.border, backgroundColor: matrixColors.card }}
                          whileHover={{ scale: 1.1, borderColor: matrixColors.neonGreen }}
                        >
                          <Icon className="w-5 h-5" style={{ color: matrixColors.neonGreen }} />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Right - Avatar with glow effect */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                className="relative hidden lg:flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  {/* Glow rings */}
                  <motion.div 
                    className="absolute inset-0 rounded-full blur-3xl opacity-30"
                    style={{ backgroundColor: matrixColors.neonGreen }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-4 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: matrixColors.neonBlue }}
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Avatar */}
                  <Avatar className="w-64 h-64 border-4" style={{ borderColor: matrixColors.neonGreen }}>
                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                    <AvatarFallback className="text-6xl" style={{ backgroundColor: matrixColors.card, color: matrixColors.neonGreen }}>
                      {profile?.display_name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: matrixColors.neonGreen, color: matrixColors.bg }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    PRO
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-lg text-xs border"
                    style={{ borderColor: matrixColors.neonPurple, backgroundColor: matrixColors.card, color: matrixColors.neonPurple }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Code2 className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section - Bento Grid */}
      <section id="bio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${matrixColors.neonBlue}20`, color: matrixColors.neonBlue }}>
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                <span style={{ color: matrixColors.neonBlue }}>~/</span>about_me
              </h2>
            </div>
          </ScrollReveal>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bio Card - Large */}
            <ScrollReveal delay={0.1}>
              <BentoCard className="lg:col-span-2 p-6" glow={matrixColors.neonGreen}>
                <h3 className="text-xl font-bold mb-4" style={{ color: matrixColors.neonGreen }}>Bio</h3>
                <p className="leading-relaxed" style={{ color: matrixColors.comment }}>
                  {portfolio?.bio || "A passionate developer focused on building innovative solutions."}
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Stats Card */}
            <ScrollReveal delay={0.2}>
              <BentoCard className="p-6" glow={matrixColors.neonPurple}>
                <h3 className="text-xl font-bold mb-4" style={{ color: matrixColors.neonPurple }}>Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span style={{ color: matrixColors.comment }}>Projects</span>
                    <span className="text-2xl font-bold" style={{ color: matrixColors.neonPurple }}>{projects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: matrixColors.comment }}>Skills</span>
                    <span className="text-2xl font-bold" style={{ color: matrixColors.neonBlue }}>{skills.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: matrixColors.comment }}>Experience</span>
                    <span className="text-2xl font-bold" style={{ color: matrixColors.neonGreen }}>{experiences.length}+</span>
                  </div>
                </div>
              </BentoCard>
            </ScrollReveal>

            {/* Experience Timeline - If exists */}
            {experiences.length > 0 && (
              <ScrollReveal delay={0.3}>
                <BentoCard className="p-6" glow={matrixColors.neonOrange}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: matrixColors.neonOrange }}>
                    <Briefcase className="w-5 h-5" />
                    Latest Role
                  </h3>
                  <div>
                    <p className="font-semibold">{experiences[0].position}</p>
                    <p style={{ color: matrixColors.comment }}>{experiences[0].company}</p>
                    <p className="text-xs mt-2" style={{ color: matrixColors.comment }}>
                      {formatDate(experiences[0].start_date)} - {experiences[0].is_current ? "Present" : formatDate(experiences[0].end_date)}
                    </p>
                  </div>
                </BentoCard>
              </ScrollReveal>
            )}

            {/* Education - If exists */}
            {education.length > 0 && (
              <ScrollReveal delay={0.4}>
                <BentoCard className="p-6" glow={matrixColors.neonPink}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: matrixColors.neonPink }}>
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h3>
                  <div>
                    <p className="font-semibold">{education[0].degree}</p>
                    <p style={{ color: matrixColors.comment }}>{education[0].institution}</p>
                    <p className="text-xs mt-2" style={{ color: matrixColors.neonPink }}>{education[0].field_of_study}</p>
                  </div>
                </BentoCard>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: matrixColors.card }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${matrixColors.neonPurple}20`, color: matrixColors.neonPurple }}>
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                <span style={{ color: matrixColors.neonPurple }}>~/</span>skills
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIdx) => (
              <ScrollReveal key={category} delay={catIdx * 0.1}>
                <motion.div 
                  className="rounded-xl border p-6"
                  style={{ backgroundColor: matrixColors.bg, borderColor: matrixColors.border }}
                  whileHover={{ borderColor: [matrixColors.neonGreen, matrixColors.neonBlue, matrixColors.neonPurple][catIdx % 3] }}
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: [matrixColors.neonGreen, matrixColors.neonBlue, matrixColors.neonPurple][catIdx % 3] }}>
                    <Layers className="w-4 h-4" />
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span style={{ color: matrixColors.comment }}>{skill.proficiency || 80}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: matrixColors.border }}>
                          <motion.div 
                            className="h-full rounded-full"
                            style={{ backgroundColor: [matrixColors.neonGreen, matrixColors.neonBlue, matrixColors.neonPurple][catIdx % 3] }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency || 80}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-12">
              <div className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${matrixColors.neonGreen}20`, color: matrixColors.neonGreen }}>
                <Folder className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                <span style={{ color: matrixColors.neonGreen }}>~/</span>projects
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allProjects.slice(0, 6).map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <motion.div 
                  className="group rounded-xl border overflow-hidden"
                  style={{ backgroundColor: matrixColors.card, borderColor: matrixColors.border }}
                  whileHover={{ borderColor: matrixColors.neonGreen }}
                >
                  {project.image_url && (
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="flex gap-2">
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg" style={{ backgroundColor: matrixColors.neonGreen, color: matrixColors.bg }}>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border" style={{ borderColor: matrixColors.neonGreen, color: matrixColors.neonGreen }}>
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold" style={{ color: matrixColors.neonGreen }}>{project.title}</h3>
                      {project.featured && (
                        <Badge style={{ backgroundColor: `${matrixColors.neonOrange}20`, color: matrixColors.neonOrange }}>Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: matrixColors.comment }}>
                      {project.description}
                    </p>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.slice(0, 4).map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: matrixColors.bg, color: matrixColors.text }}
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
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: matrixColors.card }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${matrixColors.neonPink}20`, color: matrixColors.neonPink }}>
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                <span style={{ color: matrixColors.neonPink }}>~/</span>contact
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-xl mb-8" style={{ color: matrixColors.comment }}>
              Let's build something amazing together
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-xl px-8"
                  style={{ backgroundColor: matrixColors.neonGreen, color: matrixColors.bg }}
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
                  className="rounded-xl px-8"
                  style={{ borderColor: matrixColors.neonBlue, color: matrixColors.neonBlue }}
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
              <div className="flex justify-center gap-4 mt-8">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl border"
                      style={{ borderColor: matrixColors.border, backgroundColor: matrixColors.bg }}
                      whileHover={{ scale: 1.1, borderColor: matrixColors.neonGreen }}
                    >
                      <Icon className="w-6 h-6" style={{ color: matrixColors.neonGreen }} />
                    </motion.a>
                  );
                })}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: matrixColors.border }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-6 w-auto" />
            ) : (
              <Terminal className="w-5 h-5" style={{ color: matrixColors.neonGreen }} />
            )}
            <span style={{ color: matrixColors.comment }}>
              © {new Date().getFullYear()} {profile?.display_name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: matrixColors.comment }}>
            <span>Built with</span>
            <span style={{ color: matrixColors.neonGreen }}>⚡</span>
            <a href="https://alphaportfolio0.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: matrixColors.neonGreen }}>
              Alpha Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
