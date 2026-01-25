import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Eye, ArrowRight, Sparkles,
  Image, Frame, Brush
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Editorial magazine-inspired colors
const proColors = {
  bg: "#fdfcfa",
  bgAlt: "#f5f3ef",
  card: "#ffffff",
  text: "#1a1a1a",
  textMuted: "#6b6b6b",
  accent: "#e63946",
  accentSecondary: "#457b9d",
  accentTertiary: "#f4a261",
  border: "#e5e5e5",
};

// Adobe-style app badges
const adobeApps = [
  { icon: "Ps", name: "Photoshop", color: "#31A8FF" },
  { icon: "Ai", name: "Illustrator", color: "#FF9A00" },
  { icon: "Id", name: "InDesign", color: "#FF3366" },
  { icon: "Xd", name: "XD", color: "#FF61F6" },
  { icon: "Fg", name: "Figma", color: "#A259FF" },
  { icon: "Ae", name: "After Effects", color: "#9999FF" },
];

// Scroll animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
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
}

// Marquee text
function MarqueeText({ text }: { text: string }) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4">
      <motion.div
        className="inline-block"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className="inline-block mx-6 text-7xl sm:text-9xl font-black uppercase tracking-tight"
            style={{ 
              WebkitTextStroke: `2px ${proColors.text}`, 
              color: 'transparent',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Section header with editorial style
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-12">
      <motion.div 
        className="inline-block px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider mb-4"
        style={{ backgroundColor: proColors.accent, color: '#fff' }}
      >
        {label}
      </motion.div>
      <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: proColors.text }}>
        {title}
      </h2>
    </div>
  );
}

// Project card with hover effect
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        {project.image_url ? (
          <motion.img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: proColors.bgAlt }}
          >
            <Frame className="w-16 h-16" style={{ color: proColors.accent }} />
          </div>
        )}
        
        {/* Overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center gap-3"
          style={{ backgroundColor: `${proColors.accent}e6` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.live_url && (
            <motion.a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5" style={{ color: proColors.accent }} />
            </motion.a>
          )}
          {project.github_url && (
            <motion.a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" style={{ color: proColors.accent }} />
            </motion.a>
          )}
        </motion.div>

        {/* Number badge */}
        <div 
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: proColors.text, color: '#fff' }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold mb-2" style={{ color: proColors.text }}>{project.title}</h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: proColors.textMuted }}>{project.description}</p>
        {project.tech_stack && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.slice(0, 3).map((tech: string, idx: number) => (
              <span 
                key={idx} 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: proColors.bgAlt, color: proColors.text }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function GraphicDesignerProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = ["Home", "About", "Skills", "Work", "Contact"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: proColors.bg, color: proColors.text }}>
      {/* Navigation - Clean Editorial */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b" style={{ borderColor: proColors.border }}>
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
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: proColors.accent }}
                  >
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-black text-lg">{profile?.display_name?.split(' ')[0] || "Studio"}</span>
                    <span className="font-light text-lg opacity-50">.design</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm font-medium transition-colors relative group"
                  style={{ color: proColors.textMuted }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ color: proColors.text }}
                >
                  {item}
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: proColors.accent }}
                  />
                </motion.button>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-4">
              {profile?.email && (
                <Button 
                  size="sm" 
                  className="rounded-full px-6 hidden sm:flex"
                  style={{ backgroundColor: proColors.text, color: '#fff' }}
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
              {navItems.map((item) => (
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
      <section id="hero" className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center py-12">
          <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div className="order-2 lg:order-1">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    {[proColors.accent, proColors.accentSecondary, proColors.accentTertiary].map((color, i) => (
                      <motion.div 
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider" style={{ color: proColors.textMuted }}>
                    Creative Designer
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6">
                  <span className="block">{profile?.display_name?.split(' ')[0] || "Creative"}</span>
                  <span className="block" style={{ color: proColors.accent }}>
                    {profile?.display_name?.split(' ').slice(1).join(' ') || "Designer"}
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-xl mb-8 max-w-md leading-relaxed" style={{ color: proColors.textMuted }}>
                  {portfolio?.headline || "Crafting visual stories that captivate and inspire through thoughtful design."}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mb-10">
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      className="rounded-full px-8"
                      style={{ backgroundColor: proColors.accent, color: '#fff' }}
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
                    style={{ borderColor: proColors.text }}
                    onClick={() => scrollTo('works')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                </div>
              </ScrollReveal>

              {/* Adobe Tools */}
              <ScrollReveal delay={0.4}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: proColors.textMuted }}>
                    Tools:
                  </span>
                  <div className="flex gap-2">
                    {adobeApps.slice(0, 5).map((app, i) => (
                      <motion.div
                        key={app.icon}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer"
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
              <div className="order-1 lg:order-2 flex justify-center relative">
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full"
                  style={{ backgroundColor: proColors.accentTertiary }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-20 h-20 rotate-45"
                  style={{ backgroundColor: proColors.accentSecondary }}
                  animate={{ rotate: [45, 405] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Main avatar with layered effect */}
                <div className="relative">
                  <motion.div 
                    className="absolute -inset-3 rounded-3xl"
                    style={{ backgroundColor: proColors.accent }}
                    animate={{ rotate: [2, -2, 2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -inset-3 rounded-3xl"
                    style={{ backgroundColor: proColors.accentSecondary }}
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <Avatar className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl border-4 border-white relative shadow-2xl">
                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                    <AvatarFallback 
                      className="text-5xl rounded-2xl"
                      style={{ backgroundColor: proColors.accent, color: '#fff' }}
                    >
                      {profile?.display_name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Marquee */}
        <div style={{ backgroundColor: proColors.text }}>
          <MarqueeText text="Creative • Design • Innovation • Art • Brand •" />
        </div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: proColors.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionHeader label="About" title="The Story Behind the Design" />
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Creative grid */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Palette, color: proColors.accent, label: "Brand Design" },
                  { icon: PenTool, color: proColors.accentSecondary, label: "Illustration" },
                  { icon: Layers, color: proColors.accentTertiary, label: "UI/UX" },
                  { icon: Image, color: proColors.text, label: "Photography" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 p-6"
                    style={{ backgroundColor: item.color }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Bio text */}
            <ScrollReveal delay={0.2}>
              <div>
                <p className="text-lg leading-relaxed mb-6" style={{ color: proColors.textMuted }}>
                  {portfolio?.bio || "A passionate designer with an eye for detail and a love for creating meaningful visual experiences. Every project is an opportunity to tell a unique story through design."}
                </p>
                
                <div className="space-y-4">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.bg }}>
                        <MapPin className="w-5 h-5" style={{ color: proColors.accent }} />
                      </div>
                      <span>{portfolio.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.bg }}>
                        <Mail className="w-5 h-5" style={{ color: proColors.accent }} />
                      </div>
                      <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                    </div>
                  )}
                  {portfolio?.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.bg }}>
                        <Phone className="w-5 h-5" style={{ color: proColors.accent }} />
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
            <SectionHeader label="Skills" title="Tools & Expertise" />
          </ScrollReveal>

          {/* Adobe Tools highlight */}
          <ScrollReveal delay={0.1}>
            <div className="mb-12 p-8 rounded-3xl" style={{ backgroundColor: proColors.bgAlt }}>
              <h3 className="text-lg font-bold mb-6">Creative Suite</h3>
              <div className="flex flex-wrap gap-4">
                {adobeApps.map((app, i) => (
                  <motion.div
                    key={app.icon}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
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
                <div className="p-6 rounded-2xl bg-white shadow-sm border" style={{ borderColor: proColors.border }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: proColors.accent }}>{category}</h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span style={{ color: proColors.textMuted }}>{skill.proficiency || 80}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: proColors.bgAlt }}>
                          <motion.div 
                            className="h-full rounded-full"
                            style={{ backgroundColor: proColors.accent }}
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
        <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: proColors.bgAlt }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.accent }}>
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Experience</h3>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <ScrollReveal key={exp.id} delay={i * 0.1}>
                        <div className="relative pl-6 border-l-2" style={{ borderColor: proColors.accent }}>
                          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full" style={{ backgroundColor: proColors.accent }} />
                          <div className="bg-white p-5 rounded-xl shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h4 className="font-bold">{exp.position}</h4>
                              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: proColors.bgAlt, color: proColors.textMuted }}>
                                {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-2" style={{ color: proColors.accent }}>{exp.company}</p>
                            {exp.description && (
                              <p className="text-sm" style={{ color: proColors.textMuted }}>{exp.description}</p>
                            )}
                          </div>
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
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: proColors.accentSecondary }}>
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Education</h3>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <ScrollReveal key={edu.id} delay={i * 0.1}>
                        <div className="relative pl-6 border-l-2" style={{ borderColor: proColors.accentSecondary }}>
                          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full" style={{ backgroundColor: proColors.accentSecondary }} />
                          <div className="bg-white p-5 rounded-xl shadow-sm">
                            <h4 className="font-bold mb-1">{edu.degree}</h4>
                            <p className="text-sm font-medium mb-1" style={{ color: proColors.accentSecondary }}>{edu.institution}</p>
                            {edu.field_of_study && (
                              <p className="text-sm mb-2" style={{ color: proColors.textMuted }}>{edu.field_of_study}</p>
                            )}
                            <span className="text-xs" style={{ color: proColors.textMuted }}>
                              {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                            </span>
                          </div>
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
            <SectionHeader label="Portfolio" title="Selected Works" />
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
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: proColors.text, color: '#fff' }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-black mb-6">Let's Create Something Amazing</h2>
            <p className="text-lg mb-10 opacity-80">
              Ready to bring your vision to life? Let's start a conversation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            {profile?.email && (
              <Button 
                size="lg" 
                className="rounded-full px-10"
                style={{ backgroundColor: proColors.accent }}
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  Get in Touch
                </a>
              </Button>
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
                      className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
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
      <footer className="py-8 px-4 border-t" style={{ backgroundColor: proColors.bg, borderColor: proColors.border }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: proColors.textMuted }}>
            <Palette className="w-4 h-4" />
            <span>© {new Date().getFullYear()} {profile?.display_name || "Designer"}</span>
          </div>
          {portfolio?.logo_url && (
            <img src={portfolio.logo_url} alt="Logo" className="h-6 opacity-50" />
          )}
          <div className="text-sm" style={{ color: proColors.textMuted }}>
            Crafted with passion
          </div>
        </div>
      </footer>
    </div>
  );
}
