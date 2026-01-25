import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Sparkles, Eye, ArrowRight,
  Image, Frame, Wand2, Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

// Luxury dark cinema colors
const eliteColors = {
  bg: "#0a0a0a",
  bgSecondary: "#111111",
  card: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#888888",
  // Gold/Warm accents
  accent: "#d4af37",
  accentLight: "#f4d03f",
  accentDark: "#9a7b2a",
  // Gradient
  gradient: "linear-gradient(135deg, #d4af37, #f4d03f, #d4af37)",
  border: "#2a2a2a",
};

// Adobe-style app badges
const adobeApps = [
  { icon: "Ps", name: "Photoshop", color: "#31A8FF" },
  { icon: "Ai", name: "Illustrator", color: "#FF9A00" },
  { icon: "Id", name: "InDesign", color: "#FF3366" },
  { icon: "Xd", name: "XD", color: "#FF61F6" },
  { icon: "Fg", name: "Figma", color: "#A259FF" },
];

// Scroll animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect wrapper
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
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// Glow text effect
function GlowText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="relative inline-block"
      animate={{ 
        textShadow: [
          `0 0 20px ${eliteColors.accent}80`,
          `0 0 40px ${eliteColors.accent}`,
          `0 0 20px ${eliteColors.accent}80`
        ] 
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}

// Project card with 3D tilt
function ProjectCard({ project, index }: { project: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="rounded-2xl overflow-hidden border"
        style={{ 
          rotateX, 
          rotateY,
          backgroundColor: eliteColors.card,
          borderColor: eliteColors.border,
          transformStyle: "preserve-3d"
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {project.image_url ? (
            <motion.img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: eliteColors.gradient }}
            >
              <Frame className="w-16 h-16 text-black/30" />
            </div>
          )}
          
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center gap-4"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full flex items-center justify-center"
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
                className="w-12 h-12 rounded-full flex items-center justify-center border"
                style={{ borderColor: eliteColors.accent }}
                whileHover={{ scale: 1.1, backgroundColor: eliteColors.accent + '20' }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
            )}
          </motion.div>

          {/* Number */}
          <div 
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: eliteColors.gradient, color: '#000' }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold mb-2">{project.title}</h3>
          <p className="text-sm mb-4 line-clamp-2" style={{ color: eliteColors.textMuted }}>
            {project.description}
          </p>
          {project.tech_stack && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 3).map((tech: string, idx: number) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full text-xs border"
                  style={{ borderColor: eliteColors.border, color: eliteColors.accent }}
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Design";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "bio", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "works", label: "Work" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: eliteColors.bg, color: eliteColors.text }}>
      {/* Cursor glow effect */}
      <motion.div
        className="fixed w-80 h-80 rounded-full pointer-events-none z-0 hidden lg:block"
        style={{
          background: `radial-gradient(circle, ${eliteColors.accent}15, transparent 70%)`,
          x: mousePos.x - 160,
          y: mousePos.y - 160,
        }}
      />

      {/* Navigation - Glass Floating */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
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
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: eliteColors.gradient }}
                  >
                    <Wand2 className="w-5 h-5 text-black" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-bold">{profile?.display_name?.split(' ')[0] || "Design"}</span>
                    <span className="font-light opacity-50">.elite</span>
                  </div>
                </div>
              )}
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
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              {profile?.email && (
                <MagneticWrapper>
                  <Button 
                    size="sm" 
                    className="rounded-xl hidden sm:flex text-black font-medium"
                    style={{ background: eliteColors.gradient }}
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
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Cinematic */}
      <section id="hero" className="min-h-screen relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[120px]"
            style={{ backgroundColor: eliteColors.accent }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-[100px]"
            style={{ backgroundColor: eliteColors.accentLight }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-24">
          <div className="w-full grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-3 space-y-8">
              <ScrollReveal>
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ borderColor: eliteColors.accent, backgroundColor: `${eliteColors.accent}10` }}
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: eliteColors.accent }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm" style={{ color: eliteColors.accent }}>Available for Projects</span>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9]">
                  <span className="block" style={{ color: eliteColors.textMuted }}>Creative</span>
                  <GlowText>
                    <span 
                      className="block text-transparent bg-clip-text"
                      style={{ backgroundImage: eliteColors.gradient }}
                    >
                      Designer
                    </span>
                  </GlowText>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-xl max-w-lg" style={{ color: eliteColors.textMuted }}>
                  {portfolio?.headline || "Transforming brands through innovative design and visual storytelling"}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  {profile?.email && (
                    <MagneticWrapper>
                      <Button 
                        size="lg" 
                        className="rounded-xl px-8 text-black font-medium"
                        style={{ background: eliteColors.gradient }}
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

              {/* Adobe Tools */}
              <ScrollReveal delay={0.4}>
                <div className="flex items-center gap-4 pt-4">
                  <span className="text-xs uppercase tracking-wider" style={{ color: eliteColors.textMuted }}>Tools:</span>
                  <div className="flex gap-2">
                    {adobeApps.map((app, i) => (
                      <motion.div
                        key={app.icon}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: app.color }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ y: -4, scale: 1.1 }}
                        title={app.name}
                      >
                        {app.icon}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right - Avatar */}
            <ScrollReveal delay={0.2}>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  {/* Glow effect */}
                  <motion.div 
                    className="absolute -inset-6 rounded-3xl opacity-50 blur-2xl"
                    style={{ background: eliteColors.gradient }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Avatar with border */}
                  <div className="relative">
                    <div 
                      className="absolute -inset-1 rounded-3xl"
                      style={{ background: eliteColors.gradient }}
                    />
                    <Avatar className="w-52 h-52 sm:w-72 sm:h-72 rounded-3xl relative">
                      <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                      <AvatarFallback 
                        className="text-5xl rounded-2xl"
                        style={{ backgroundColor: eliteColors.card, color: eliteColors.accent }}
                      >
                        {profile?.display_name?.charAt(0) || "D"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Floating badge */}
                  <motion.div 
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full flex items-center gap-2"
                    style={{ background: eliteColors.gradient }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Star className="w-4 h-4 text-black fill-black" />
                    <span className="text-sm font-bold text-black">Elite Designer</span>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.bgSecondary }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-12">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: eliteColors.gradient }}
              >
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">About Me</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Creative services */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Palette, label: "Brand Identity", desc: "Logo & Visual Systems" },
                  { icon: PenTool, label: "Illustration", desc: "Custom Artwork" },
                  { icon: Layers, label: "UI/UX Design", desc: "Digital Experiences" },
                  { icon: Image, label: "Photography", desc: "Visual Content" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="p-5 rounded-2xl border group cursor-pointer"
                    style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}
                    whileHover={{ borderColor: eliteColors.accent, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${eliteColors.accent}20` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: eliteColors.accent }} />
                    </div>
                    <h3 className="font-bold mb-1">{item.label}</h3>
                    <p className="text-sm" style={{ color: eliteColors.textMuted }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Bio */}
            <ScrollReveal delay={0.2}>
              <div>
                <p className="text-lg leading-relaxed mb-8" style={{ color: eliteColors.textMuted }}>
                  {portfolio?.bio || "A passionate designer with an eye for detail and a love for creating meaningful visual experiences that leave lasting impressions."}
                </p>
                
                <div className="space-y-4">
                  {portfolio?.location && (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: eliteColors.card }}
                      >
                        <MapPin className="w-5 h-5" style={{ color: eliteColors.accent }} />
                      </div>
                      <span>{portfolio.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: eliteColors.card }}
                      >
                        <Mail className="w-5 h-5" style={{ color: eliteColors.accent }} />
                      </div>
                      <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                    </div>
                  )}
                  {portfolio?.phone && (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: eliteColors.card }}
                      >
                        <Phone className="w-5 h-5" style={{ color: eliteColors.accent }} />
                      </div>
                      <span>{portfolio.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-12">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: eliteColors.gradient }}
              >
                <Layers className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Skills & Expertise</h2>
            </div>
          </ScrollReveal>

          {/* Adobe Tools */}
          <ScrollReveal delay={0.1}>
            <div className="mb-12 p-6 rounded-2xl border" style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}>
              <h3 className="text-lg font-bold mb-6">Creative Suite</h3>
              <div className="flex flex-wrap gap-4">
                {adobeApps.map((app, i) => (
                  <motion.div
                    key={app.icon}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: eliteColors.bgSecondary }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: app.color }}
                    >
                      {app.icon}
                    </div>
                    <span className="font-medium">{app.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Skills by category */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
              <ScrollReveal key={category} delay={catIndex * 0.1}>
                <div 
                  className="p-6 rounded-2xl border"
                  style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}
                >
                  <h3 className="text-lg font-bold mb-6" style={{ color: eliteColors.accent }}>{category}</h3>
                  <div className="space-y-5">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span style={{ color: eliteColors.textMuted }}>{skill.proficiency || 80}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: eliteColors.border }}>
                          <motion.div 
                            className="h-full rounded-full"
                            style={{ background: eliteColors.gradient }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency || 80}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.bgSecondary }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-4 mb-8">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: eliteColors.gradient }}
                      >
                        <Briefcase className="w-5 h-5 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold">Experience</h3>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <ScrollReveal key={exp.id} delay={i * 0.1}>
                        <div 
                          className="p-5 rounded-xl border"
                          style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold">{exp.position}</h4>
                            <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: eliteColors.bgSecondary, color: eliteColors.textMuted }}>
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-2" style={{ color: eliteColors.accent }}>{exp.company}</p>
                          {exp.description && (
                            <p className="text-sm" style={{ color: eliteColors.textMuted }}>{exp.description}</p>
                          )}
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-4 mb-8">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: eliteColors.gradient }}
                      >
                        <GraduationCap className="w-5 h-5 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold">Education</h3>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <ScrollReveal key={edu.id} delay={i * 0.1}>
                        <div 
                          className="p-5 rounded-xl border"
                          style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}
                        >
                          <h4 className="font-bold mb-1">{edu.degree}</h4>
                          <p className="text-sm font-medium mb-1" style={{ color: eliteColors.accent }}>{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-sm mb-2" style={{ color: eliteColors.textMuted }}>{edu.field_of_study}</p>
                          )}
                          <span className="text-xs" style={{ color: eliteColors.textMuted }}>
                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                          </span>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section id="works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-12">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: eliteColors.gradient }}
              >
                <Frame className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Work</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <ProjectCard project={project} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: eliteColors.bgSecondary }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Let's Create <GlowText><span style={{ color: eliteColors.accent }}>Magic</span></GlowText> Together
            </h2>
            <p className="text-lg mb-10" style={{ color: eliteColors.textMuted }}>
              Ready to elevate your brand? Let's start a conversation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            {profile?.email && (
              <MagneticWrapper>
                <Button 
                  size="lg" 
                  className="rounded-xl px-10 text-black font-medium"
                  style={{ background: eliteColors.gradient }}
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-5 h-5 mr-2" />
                    Start a Project
                  </a>
                </Button>
              </MagneticWrapper>
            )}
          </ScrollReveal>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="flex justify-center gap-4 mt-10">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors"
                      style={{ borderColor: eliteColors.border }}
                      whileHover={{ borderColor: eliteColors.accent, backgroundColor: `${eliteColors.accent}10` }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: eliteColors.border }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: eliteColors.textMuted }}>
            <Wand2 className="w-4 h-4" style={{ color: eliteColors.accent }} />
            <span>© {new Date().getFullYear()} {profile?.display_name || "Designer"}</span>
          </div>
          {portfolio?.logo_url && (
            <img src={portfolio.logo_url} alt="Logo" className="h-6 opacity-50" />
          )}
          <div className="text-sm" style={{ color: eliteColors.textMuted }}>
            Crafted with <span style={{ color: eliteColors.accent }}>♦</span> excellence
          </div>
        </div>
      </footer>
    </div>
  );
}
