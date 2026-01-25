import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, Folder, FileCode, 
  Database, Server, GitBranch, Layers, Zap, ArrowRight,
  Monitor, Command, ChevronRight, Play, Circle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Modern IDE-inspired dark theme
const eliteColors = {
  bg: "#0d1117",
  bgSecondary: "#161b22",
  card: "#21262d",
  border: "#30363d",
  text: "#c9d1d9",
  textMuted: "#8b949e",
  // Syntax highlighting colors
  syntaxKeyword: "#ff7b72",
  syntaxString: "#a5d6ff",
  syntaxFunction: "#d2a8ff",
  syntaxVariable: "#79c0ff",
  syntaxComment: "#8b949e",
  syntaxNumber: "#79c0ff",
  // Accent
  accent: "#58a6ff",
  accentGreen: "#3fb950",
  accentYellow: "#d29922",
  accentPurple: "#a371f7",
  gradient: "linear-gradient(135deg, #58a6ff, #a371f7)",
};

// Typing animation for code
function TypedCode({ code, speed = 30 }: { code: string; speed?: number }) {
  const [displayedCode, setDisplayedCode] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [isInView, code, speed]);

  return (
    <span ref={ref}>
      {displayedCode}
      <motion.span
        className="inline-block w-2 h-5 ml-0.5 bg-current"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </span>
  );
}

// Scroll animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Terminal window component
function TerminalWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ backgroundColor: eliteColors.bgSecondary, borderColor: eliteColors.border }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: eliteColors.border }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca41]" />
        </div>
        <span className="ml-3 text-sm font-mono" style={{ color: eliteColors.textMuted }}>{title}</span>
      </div>
      <div className="p-4 font-mono text-sm" style={{ color: eliteColors.text }}>
        {children}
      </div>
    </div>
  );
}

// File tab component
function FileTab({ name, active = false, icon: Icon = FileCode }: { name: string; active?: boolean; icon?: any }) {
  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 transition-colors ${active ? 'border-[#58a6ff]' : 'border-transparent'}`}
      style={{ 
        backgroundColor: active ? eliteColors.card : 'transparent',
        color: active ? eliteColors.text : eliteColors.textMuted 
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{name}</span>
    </div>
  );
}

// Code syntax highlighting helper
function SyntaxHighlight({ children, type }: { children: string; type: 'keyword' | 'string' | 'function' | 'variable' | 'comment' | 'number' }) {
  const colors: Record<string, string> = {
    keyword: eliteColors.syntaxKeyword,
    string: eliteColors.syntaxString,
    function: eliteColors.syntaxFunction,
    variable: eliteColors.syntaxVariable,
    comment: eliteColors.syntaxComment,
    number: eliteColors.syntaxNumber,
  };
  return <span style={{ color: colors[type] }}>{children}</span>;
}

// Project card
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="group relative rounded-xl overflow-hidden border"
      style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, borderColor: eliteColors.accent }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {project.image_url ? (
          <motion.img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: eliteColors.bgSecondary }}>
            <Code2 className="w-12 h-12" style={{ color: eliteColors.accent }} />
          </div>
        )}
        
        {/* Overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center gap-3"
          style={{ backgroundColor: 'rgba(13, 17, 23, 0.9)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.live_url && (
            <motion.a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg"
              style={{ backgroundColor: eliteColors.accent }}
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
              className="p-3 rounded-lg border"
              style={{ borderColor: eliteColors.border }}
              whileHover={{ scale: 1.1, borderColor: eliteColors.accent }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          )}
        </motion.div>

        {/* Index badge */}
        <div 
          className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-mono font-bold"
          style={{ backgroundColor: eliteColors.accent, color: '#000' }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2" style={{ color: eliteColors.text }}>{project.title}</h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: eliteColors.textMuted }}>{project.description}</p>
        {project.tech_stack && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.slice(0, 4).map((tech: string, idx: number) => (
              <span 
                key={idx} 
                className="px-2 py-1 rounded text-xs font-mono"
                style={{ backgroundColor: eliteColors.bgSecondary, color: eliteColors.accent }}
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

export default function WebDeveloperEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
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
    { id: "hero", label: "~/home", icon: Monitor },
    { id: "bio", label: "~/about", icon: Command },
    { id: "skills", label: "~/skills", icon: Layers },
    { id: "works", label: "~/projects", icon: Folder },
    { id: "contact", label: "~/contact", icon: Mail },
  ];

  // Generate intro code
  const introCode = `const developer = {
  name: "${profile?.display_name || 'Developer'}",
  role: "${portfolio?.headline || 'Full Stack Developer'}",
  location: "${portfolio?.location || 'Remote'}",
  available: true
};`;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: eliteColors.bg, color: eliteColors.text }}>
      {/* Navigation - IDE Tab Bar Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: eliteColors.bg, borderColor: eliteColors.border }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-14 px-4">
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
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: eliteColors.accent }}>
                    <Terminal className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-mono text-sm hidden sm:block">
                    <span style={{ color: eliteColors.accent }}>@</span>
                    {profile?.display_name?.toLowerCase().replace(' ', '_') || 'developer'}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Desktop Nav - File Tabs */}
            <div className="hidden md:flex items-center">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-mono transition-all border-b-2 ${
                    activeSection === item.id 
                      ? 'border-[#58a6ff]' 
                      : 'border-transparent hover:bg-[#21262d]'
                  }`}
                  style={{ 
                    color: activeSection === item.id ? eliteColors.accent : eliteColors.textMuted 
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {profile?.email && (
                <Button 
                  size="sm" 
                  className="rounded-lg hidden sm:flex font-mono text-xs"
                  style={{ backgroundColor: eliteColors.accentGreen, color: '#000' }}
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Circle className="w-2 h-2 mr-2 fill-current" />
                    Available
                  </a>
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
              className="md:hidden border-t"
              style={{ backgroundColor: eliteColors.bgSecondary, borderColor: eliteColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#21262d] transition-colors font-mono text-sm"
                    style={{ color: eliteColors.textMuted }}
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

      {/* Hero Section - Terminal Style */}
      <section id="hero" className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto flex items-center min-h-[calc(100vh-8rem)]">
          <div className="w-full grid lg:grid-cols-5 gap-8 items-center">
            {/* Left - Terminal */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <TerminalWindow title="profile.js">
                  <div className="space-y-1">
                    <div>
                      <SyntaxHighlight type="keyword">const</SyntaxHighlight>
                      <span> developer = {"{"}</span>
                    </div>
                    <div className="pl-4">
                      <SyntaxHighlight type="variable">name</SyntaxHighlight>
                      <span>: </span>
                      <SyntaxHighlight type="string">{`"${profile?.display_name || 'Developer'}"`}</SyntaxHighlight>
                      <span>,</span>
                    </div>
                    <div className="pl-4">
                      <SyntaxHighlight type="variable">role</SyntaxHighlight>
                      <span>: </span>
                      <SyntaxHighlight type="string">{`"${portfolio?.headline || 'Full Stack Developer'}"`}</SyntaxHighlight>
                      <span>,</span>
                    </div>
                    <div className="pl-4">
                      <SyntaxHighlight type="variable">location</SyntaxHighlight>
                      <span>: </span>
                      <SyntaxHighlight type="string">{`"${portfolio?.location || 'Remote'}"`}</SyntaxHighlight>
                      <span>,</span>
                    </div>
                    <div className="pl-4">
                      <SyntaxHighlight type="variable">available</SyntaxHighlight>
                      <span>: </span>
                      <SyntaxHighlight type="keyword">true</SyntaxHighlight>
                    </div>
                    <div>{"}"}</div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: eliteColors.border }}>
                    <div className="flex items-center gap-2" style={{ color: eliteColors.textMuted }}>
                      <span>$</span>
                      <TypedCode code={`echo "Welcome to my portfolio!"`} speed={50} />
                    </div>
                  </div>
                </TerminalWindow>
              </ScrollReveal>

              {/* Tech Stack Pills */}
              <ScrollReveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-2">
                  {skills.slice(0, 6).map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      className="px-3 py-1.5 rounded-lg text-sm font-mono border"
                      style={{ borderColor: eliteColors.border, color: eliteColors.accent }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{ borderColor: eliteColors.accent }}
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>

              {/* CTA Buttons */}
              <ScrollReveal delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-4">
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      className="rounded-lg font-mono"
                      style={{ backgroundColor: eliteColors.accent, color: '#000' }}
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        contact@{profile.display_name?.split(' ')[0].toLowerCase() || 'dev'}
                      </a>
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-lg font-mono"
                    style={{ borderColor: eliteColors.border, color: eliteColors.text }}
                    onClick={() => scrollTo('works')}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    ./view-projects
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* Right - Avatar */}
            <ScrollReveal delay={0.2}>
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  <motion.div 
                    className="absolute -inset-4 rounded-2xl opacity-50 blur-xl"
                    style={{ backgroundColor: eliteColors.accent }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <Avatar className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl border-4 relative" style={{ borderColor: eliteColors.border }}>
                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                    <AvatarFallback 
                      className="text-4xl rounded-xl"
                      style={{ backgroundColor: eliteColors.card, color: eliteColors.accent }}
                    >
                      {profile?.display_name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status badge */}
                  <div 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-2"
                    style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border, border: '1px solid' }}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: eliteColors.accentGreen }}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span style={{ color: eliteColors.accentGreen }}>online</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="bio" className="py-20 px-4" style={{ backgroundColor: eliteColors.bgSecondary }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: eliteColors.card }}>
                <Command className="w-5 h-5" style={{ color: eliteColors.accent }} />
              </div>
              <h2 className="text-2xl font-bold font-mono">
                <span style={{ color: eliteColors.textMuted }}>//</span> about_me
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <TerminalWindow title="README.md">
                <p className="leading-relaxed" style={{ color: eliteColors.textMuted }}>
                  {portfolio?.bio || "A passionate developer focused on creating impactful digital experiences."}
                </p>
              </TerminalWindow>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <TerminalWindow title="contact.json">
                <div className="space-y-3">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4" style={{ color: eliteColors.accent }} />
                      <span>{portfolio.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4" style={{ color: eliteColors.accent }} />
                      <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                    </div>
                  )}
                  {portfolio?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4" style={{ color: eliteColors.accent }} />
                      <span>{portfolio.phone}</span>
                    </div>
                  )}
                  {portfolio?.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4" style={{ color: eliteColors.accent }} />
                      <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{portfolio.website}</a>
                    </div>
                  )}
                </div>
              </TerminalWindow>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: eliteColors.card }}>
                <Layers className="w-5 h-5" style={{ color: eliteColors.accentPurple }} />
              </div>
              <h2 className="text-2xl font-bold font-mono">
                <span style={{ color: eliteColors.textMuted }}>//</span> tech_stack
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
              <ScrollReveal key={category} delay={catIndex * 0.1}>
                <TerminalWindow title={`${category.toLowerCase()}.ts`}>
                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <span className="font-mono text-sm">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: eliteColors.border }}>
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ backgroundColor: eliteColors.accent }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency || 80}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              viewport={{ once: true }}
                            />
                          </div>
                          <span className="text-xs font-mono" style={{ color: eliteColors.textMuted }}>
                            {skill.proficiency || 80}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TerminalWindow>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-20 px-4" style={{ backgroundColor: eliteColors.bgSecondary }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6">
                      <Briefcase className="w-5 h-5" style={{ color: eliteColors.accentYellow }} />
                      <h3 className="text-xl font-bold font-mono">experience</h3>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-4">
                    {experiences.map((exp, i) => (
                      <ScrollReveal key={exp.id} delay={i * 0.1}>
                        <div className="p-4 rounded-xl border" style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{exp.position}</h4>
                            <span className="text-xs font-mono" style={{ color: eliteColors.textMuted }}>
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                            </span>
                          </div>
                          <p className="text-sm mb-2" style={{ color: eliteColors.accent }}>{exp.company}</p>
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
                    <div className="flex items-center gap-3 mb-6">
                      <GraduationCap className="w-5 h-5" style={{ color: eliteColors.accentGreen }} />
                      <h3 className="text-xl font-bold font-mono">education</h3>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-4">
                    {education.map((edu, i) => (
                      <ScrollReveal key={edu.id} delay={i * 0.1}>
                        <div className="p-4 rounded-xl border" style={{ backgroundColor: eliteColors.card, borderColor: eliteColors.border }}>
                          <h4 className="font-semibold mb-1">{edu.degree}</h4>
                          <p className="text-sm mb-1" style={{ color: eliteColors.accent }}>{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-sm" style={{ color: eliteColors.textMuted }}>{edu.field_of_study}</p>
                          )}
                          <p className="text-xs font-mono mt-2" style={{ color: eliteColors.textMuted }}>
                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                          </p>
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
      <section id="works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: eliteColors.card }}>
                <Folder className="w-5 h-5" style={{ color: eliteColors.accentYellow }} />
              </div>
              <h2 className="text-2xl font-bold font-mono">
                <span style={{ color: eliteColors.textMuted }}>//</span> projects
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <ProjectCard project={project} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4" style={{ backgroundColor: eliteColors.bgSecondary }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono mb-4">
              <span style={{ color: eliteColors.textMuted }}>$</span> npm run <span style={{ color: eliteColors.accent }}>collaborate</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: eliteColors.textMuted }}>
              Let's build something amazing together
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-lg font-mono"
                  style={{ backgroundColor: eliteColors.accent, color: '#000' }}
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </a>
                </Button>
              )}
            </div>
          </ScrollReveal>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="flex justify-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg flex items-center justify-center border transition-colors"
                      style={{ borderColor: eliteColors.border }}
                      whileHover={{ borderColor: eliteColors.accent, backgroundColor: eliteColors.card }}
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
          <div className="flex items-center gap-2 font-mono text-sm" style={{ color: eliteColors.textMuted }}>
            <Terminal className="w-4 h-4" />
            <span>© {new Date().getFullYear()} {profile?.display_name || "Developer"}</span>
          </div>
          {portfolio?.logo_url && (
            <img src={portfolio.logo_url} alt="Logo" className="h-6 opacity-50" />
          )}
          <div className="text-sm font-mono" style={{ color: eliteColors.textMuted }}>
            Built with <span style={{ color: eliteColors.accent }}>❤</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
