import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, ChevronRight, Folder, FileCode, Cpu
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// VS Code Theme Colors (One Dark Pro inspired)
const vsColors = {
  bg: "#282C34",
  sidebar: "#21252B",
  active: "#2C313C",
  border: "#3E4451",
  text: "#ABB2BF",
  comment: "#5C6370",
  // Syntax colors
  keyword: "#C678DD",      // purple - const, let, var, function
  string: "#98C379",       // green - strings
  number: "#D19A66",       // orange - numbers
  function: "#61AFEF",     // blue - function names
  variable: "#E06C75",     // red - variables
  property: "#E5C07B",     // yellow - properties
  operator: "#56B6C2",     // cyan - operators
  class: "#E5C07B",        // yellow - classes
  tag: "#E06C75",          // red - JSX tags
  attribute: "#D19A66",    // orange - attributes
};

// Scroll animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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

export default function WebDeveloperTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const fullText = `const developer = {
  name: "${profile?.display_name || "Developer"}",
  role: "${portfolio?.headline || "Full Stack Developer"}",
  location: "${portfolio?.location || "Remote"}",
  available: true,
  skills: [${skills.slice(0, 3).map(s => `"${s.name}"`).join(", ")}],
};

export default developer;`;

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Typing animation - starts immediately
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [fullText]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // Enhanced syntax highlighting
  const highlightCode = (code: string) => {
    return code
      // Keywords
      .replace(/\b(const|let|var|function|return|export|default|import|from|async|await|if|else|for|while|class|extends|new|this|true|false|null|undefined)\b/g, 
        `<span style="color: ${vsColors.keyword}">$1</span>`)
      // Strings
      .replace(/(".*?"|'.*?'|`.*?`)/g, `<span style="color: ${vsColors.string}">$1</span>`)
      // Numbers
      .replace(/\b(\d+)\b/g, `<span style="color: ${vsColors.number}">$1</span>`)
      // Properties/keys
      .replace(/(\w+)(?=\s*:)/g, `<span style="color: ${vsColors.variable}">$1</span>`)
      // Object name
      .replace(/\b(developer)\b(?!\s*:)/g, `<span style="color: ${vsColors.function}">$1</span>`)
      // Brackets
      .replace(/([{}[\]()])/g, `<span style="color: ${vsColors.property}">$1</span>`)
      // Operators
      .replace(/([=,;])/g, `<span style="color: ${vsColors.operator}">$1</span>`);
  };

  return (
    <div className="min-h-screen font-mono" style={{ backgroundColor: vsColors.bg, color: vsColors.text }}>

      {/* Navigation - VS Code Title Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: vsColors.sidebar }}>
        <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: vsColors.border }}>
          {/* Window Controls */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>

          {/* VS Code Icon & Title */}
          <div className="hidden sm:flex items-center gap-2 mr-6">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-5 w-auto object-contain" />
            ) : (
              <Code2 className="w-4 h-4" style={{ color: vsColors.function }} />
            )}
            <span className="text-xs" style={{ color: vsColors.comment }}>
              {profile?.display_name?.toLowerCase().replace(/\s/g, '-') || "portfolio"} - Visual Studio Code
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {[
              { id: "hero", name: "index.tsx", icon: FileCode },
              { id: "bio", name: "about.tsx", icon: FileCode },
              { id: "skills", name: "skills.tsx", icon: FileCode },
              { id: "works", name: "projects.tsx", icon: Folder },
              { id: "contact", name: "contact.tsx", icon: Mail },
            ].map((tab, i) => (
              <motion.button 
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className="px-3 py-1.5 text-xs flex items-center gap-1.5 border-t-2 transition-colors"
                style={{ 
                  borderColor: i === 0 ? vsColors.function : "transparent",
                  backgroundColor: i === 0 ? vsColors.active : "transparent",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ backgroundColor: vsColors.active }}
              >
                <tab.icon className="w-3 h-3" style={{ color: i === 0 ? vsColors.function : vsColors.comment }} />
                <span style={{ color: i === 0 ? vsColors.text : vsColors.comment }}>{tab.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 md:hidden">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden border-b px-4 py-3"
              style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["index", "about", "skills", "projects", "contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item === "index" ? "hero" : item === "about" ? "bio" : item === "projects" ? "works" : item)}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm hover:bg-white/5 rounded px-2"
                >
                  <FileCode className="w-4 h-4" style={{ color: vsColors.function }} />
                  {item}.tsx
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Layout */}
      <div className="flex pt-10">
        {/* Activity Bar */}
        <div className="hidden md:flex flex-col w-12 min-h-screen border-r" style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}>
          <div className="flex flex-col items-center py-4 gap-3">
            {[
              { icon: FileCode, active: true, color: vsColors.function },
              { icon: Globe, active: false, color: vsColors.comment },
              { icon: Github, active: false, color: vsColors.comment },
              { icon: Cpu, active: false, color: vsColors.comment },
            ].map((item, i) => (
              <motion.button 
                key={i}
                className="p-2 rounded relative"
                style={{ color: item.color }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <item.icon className="w-5 h-5" />
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ backgroundColor: vsColors.function }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Explorer Sidebar */}
        <div className="hidden lg:block w-56 min-h-screen border-r" style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}>
          <div className="p-3">
            <p className="text-[10px] uppercase tracking-wider mb-3 font-semibold" style={{ color: vsColors.comment }}>Explorer</p>
            
            {/* Project Folder */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer" style={{ backgroundColor: vsColors.active }}>
                <ChevronRight className="w-3 h-3" style={{ color: vsColors.text }} />
                <Folder className="w-4 h-4" style={{ color: vsColors.property }} />
                <span className="text-xs truncate">{profile?.display_name?.toLowerCase().replace(/\s/g, '-') || "my-portfolio"}</span>
              </div>
              
              {/* Files */}
              <div className="ml-3 space-y-0.5">
                {[
                  { name: "index.tsx", section: "hero" },
                  { name: "about.tsx", section: "bio" },
                  { name: "skills.tsx", section: "skills" },
                  { name: "projects.tsx", section: "works" },
                  { name: "contact.tsx", section: "contact" },
                ].map((file) => (
                  <button 
                    key={file.name}
                    onClick={() => scrollTo(file.section)}
                    className="flex items-center gap-2 py-1 px-2 text-xs hover:bg-white/5 rounded w-full text-left"
                  >
                    <FileCode className="w-4 h-4" style={{ color: vsColors.function }} />
                    <span style={{ color: vsColors.text }}>{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen overflow-x-hidden">
          {/* Hero Section - Unique 3D Developer Workspace */}
          <section id="hero" className="min-h-screen flex items-center p-4 sm:p-6 md:p-12 relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(${vsColors.function}40 1px, transparent 1px),
                    linear-gradient(90deg, ${vsColors.function}40 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
              {/* Floating Code Particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xs font-mono"
                  style={{ 
                    color: [vsColors.keyword, vsColors.string, vsColors.function, vsColors.variable, vsColors.number][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.8, 0.2],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  {["</>", "{}", "=>", "[]", "//", "&&", "||", "++", "==", "!=", "const", "let", "async", "await", "import"][i]}
                </motion.div>
              ))}
            </div>

            <div className="w-full max-w-6xl mx-auto relative z-10">
              {/* Split Hero Layout */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side - Developer Identity */}
                <ScrollReveal>
                  <div className="space-y-6">
                    {/* ASCII Art Style Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: vsColors.string }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs uppercase tracking-widest" style={{ color: vsColors.comment }}>
                          Status: Available for hire
                        </span>
                      </div>
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                        <span style={{ color: vsColors.keyword }}>const </span>
                        <motion.span 
                          style={{ color: vsColors.function }}
                          animate={{ textShadow: [`0 0 20px ${vsColors.function}60`, `0 0 40px ${vsColors.function}80`, `0 0 20px ${vsColors.function}60`] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {profile?.display_name?.split(' ')[0] || "Dev"}
                        </motion.span>
                        <span style={{ color: vsColors.operator }}> = </span>
                        <span style={{ color: vsColors.string }}>"</span>
                        <span className="text-2xl sm:text-3xl lg:text-4xl" style={{ color: vsColors.string }}>
                          {profile?.display_name?.split(' ').slice(1).join(' ') || "Developer"}
                        </span>
                        <span style={{ color: vsColors.string }}>"</span>
                        <span style={{ color: vsColors.operator }}>;</span>
                      </h1>
                      
                      <motion.p 
                        className="text-lg sm:text-xl mt-4 max-w-md"
                        style={{ color: vsColors.comment }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span style={{ color: vsColors.comment }}>// </span>
                        {portfolio?.headline || "Crafting digital experiences"}
                      </motion.p>
                    </motion.div>

                    {/* Tech Stack Pills */}
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {skills.slice(0, 6).map((skill, i) => (
                        <motion.span
                          key={skill.id}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold border"
                          style={{ 
                            backgroundColor: `${[vsColors.keyword, vsColors.string, vsColors.function, vsColors.variable, vsColors.number, vsColors.operator][i % 6]}15`,
                            borderColor: [vsColors.keyword, vsColors.string, vsColors.function, vsColors.variable, vsColors.number, vsColors.operator][i % 6],
                            color: [vsColors.keyword, vsColors.string, vsColors.function, vsColors.variable, vsColors.number, vsColors.operator][i % 6],
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div 
                      className="flex flex-wrap gap-4 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {profile?.email && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="lg" 
                            className="rounded-lg font-mono text-sm px-6 relative overflow-hidden group"
                            style={{ backgroundColor: vsColors.function }}
                            asChild
                          >
                            <a href={`mailto:${profile.email}`}>
                              <span className="relative z-10 flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                hire.me()
                              </span>
                              <motion.div 
                                className="absolute inset-0"
                                style={{ backgroundColor: vsColors.keyword }}
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            </a>
                          </Button>
                        </motion.div>
                      )}
                      {socialLinks.find(l => l.platform.toLowerCase() === 'github') && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="rounded-lg font-mono text-sm px-6"
                            style={{ borderColor: vsColors.string, color: vsColors.string }}
                            asChild
                          >
                            <a href={socialLinks.find(l => l.platform.toLowerCase() === 'github')?.url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              view.code()
                            </a>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </ScrollReveal>

                {/* Right Side - 3D Code Cards Stack */}
                <ScrollReveal delay={0.2}>
                  <div className="relative h-[400px] sm:h-[500px] perspective-1000">
                    {/* Main Code Window */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl border"
                      style={{ 
                        backgroundColor: vsColors.bg, 
                        borderColor: vsColors.border,
                        transformStyle: 'preserve-3d',
                      }}
                      initial={{ rotateY: 15, rotateX: -5 }}
                      animate={{ 
                        rotateY: [15, -5, 15],
                        rotateX: [-5, 5, -5],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
                    >
                      {/* Window Header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCode className="w-3 h-3" style={{ color: vsColors.function }} />
                          <span className="text-xs" style={{ color: vsColors.text }}>developer.ts</span>
                        </div>
                        <div />
                      </div>

                      {/* Code Content with Typing Effect */}
                      <div className="p-4 sm:p-6 flex overflow-hidden" style={{ backgroundColor: vsColors.bg }}>
                        <div className="pr-4 text-right select-none hidden sm:block" style={{ color: vsColors.comment }}>
                          {fullText.split('\n').map((_, i) => (
                            <div key={i} className="text-sm leading-7">{i + 1}</div>
                          ))}
                        </div>
                        <pre className="text-sm leading-7 whitespace-pre-wrap break-all sm:break-normal overflow-hidden">
                          <code 
                            dangerouslySetInnerHTML={{ 
                              __html: highlightCode(typedText) + 
                                (showCursor ? `<span style="color: ${vsColors.function}; animation: blink 1s infinite">|</span>` : '<span class="opacity-0">|</span>') 
                            }} 
                          />
                        </pre>
                      </div>
                    </motion.div>

                    {/* Floating Terminal */}
                    <motion.div 
                      className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 w-64 sm:w-72 rounded-lg overflow-hidden shadow-2xl border z-20"
                      style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}
                      initial={{ opacity: 0, y: 50, x: 30 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ delay: 1.5 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                    >
                      <div className="flex items-center px-3 py-1.5 border-b" style={{ borderColor: vsColors.border }}>
                        <Terminal className="w-3 h-3 mr-2" style={{ color: vsColors.string }} />
                        <span className="text-[10px] font-semibold" style={{ color: vsColors.text }}>TERMINAL</span>
                      </div>
                      <div className="p-3 text-xs font-mono" style={{ backgroundColor: `${vsColors.bg}ee` }}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2 }}
                        >
                          <p style={{ color: vsColors.comment }}>
                            <span style={{ color: vsColors.string }}>➜</span> ~ <span style={{ color: vsColors.function }}>npm run dev</span>
                          </p>
                          <motion.p 
                            className="mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 }}
                          >
                            <span style={{ color: vsColors.string }}>✓</span> Ready in <span style={{ color: vsColors.number }}>1.2s</span>
                          </motion.p>
                          <motion.p 
                            className="mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3 }}
                          >
                            <span style={{ color: vsColors.keyword }}>→</span> <span style={{ color: vsColors.operator }}>localhost:3000</span>
                          </motion.p>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Floating Git Status */}
                    <motion.div 
                      className="absolute -top-4 -left-4 sm:top-8 sm:left-0 px-4 py-2 rounded-lg border shadow-lg z-10"
                      style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: vsColors.string }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-xs font-mono">
                          <span style={{ color: vsColors.function }}>git:</span>
                          <span style={{ color: vsColors.variable }}>(main)</span>
                        </span>
                        <span className="text-xs" style={{ color: vsColors.string }}>✓</span>
                      </div>
                    </motion.div>

                    {/* Floating Stats */}
                    <motion.div 
                      className="absolute top-1/2 -right-8 sm:-right-4 -translate-y-1/2 space-y-2 z-10"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.2 }}
                    >
                      {[
                        { label: "projects", value: projects.length, color: vsColors.function },
                        { label: "skills", value: skills.length, color: vsColors.string },
                        { label: "years", value: experiences.length > 0 ? "5+" : "3+", color: vsColors.keyword },
                      ].map((stat, i) => (
                        <motion.div 
                          key={stat.label}
                          className="px-3 py-1.5 rounded-lg border text-center"
                          style={{ backgroundColor: `${stat.color}15`, borderColor: stat.color }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.4 + i * 0.2 }}
                          whileHover={{ scale: 1.1, x: -5 }}
                        >
                          <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                          <div className="text-[9px] uppercase tracking-wider" style={{ color: vsColors.comment }}>{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Scroll Indicator */}
              <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: vsColors.comment }}>scroll.down()</span>
                  <motion.div 
                    className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
                    style={{ borderColor: vsColors.function }}
                  >
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: vsColors.function }}
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Bio Section */}
          <section id="bio" className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: vsColors.sidebar }}>
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: vsColors.bg, borderColor: vsColors.border }}>
                  {/* Tab */}
                  <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: vsColors.border }}>
                    <Braces className="w-4 h-4 mr-2" style={{ color: vsColors.property }} />
                    <span className="text-sm">README.md</span>
                  </div>
                  
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
                      {/* Avatar */}
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
                        <Avatar className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl border-2 mx-auto md:mx-0" style={{ borderColor: vsColors.function }}>
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-4xl sm:text-5xl rounded-xl font-bold" style={{ backgroundColor: vsColors.function, color: vsColors.bg }}>
                            {profile?.display_name?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                          <span style={{ color: vsColors.comment }}># </span>
                          <span style={{ color: vsColors.variable }}>{profile?.display_name}</span>
                        </h1>
                        <p className="mb-4" style={{ color: vsColors.string }}>{portfolio?.headline}</p>
                        
                        {portfolio?.bio && (
                          <p className="leading-relaxed mb-6" style={{ color: vsColors.text }}>{portfolio.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
                          {portfolio?.location && (
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: vsColors.active }}>
                              <MapPin className="w-4 h-4" style={{ color: vsColors.operator }} />
                              {portfolio.location}
                            </span>
                          )}
                          {profile?.email && (
                            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-3 py-1.5 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: vsColors.active }}>
                              <Mail className="w-4 h-4" style={{ color: vsColors.function }} />
                              {profile.email}
                            </a>
                          )}
                        </div>

                        {socialLinks.length > 0 && (
                          <div className="flex gap-2 mt-6 justify-center md:justify-start">
                            {socialLinks.map((link) => {
                              const Icon = getSocialIcon(link.platform);
                              return (
                                <motion.a 
                                  key={link.id} 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                  style={{ backgroundColor: vsColors.active }}
                                  whileHover={{ scale: 1.1, backgroundColor: vsColors.function }}
                                >
                                  <Icon className="w-4 h-4" />
                                </motion.a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Skills Section */}
          {skills.length > 0 && (
            <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: vsColors.bg }}>
              <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: vsColors.keyword }}>
                      {"// EXPERTISE"}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                      <span style={{ color: vsColors.keyword }}>const </span>
                      <span style={{ color: vsColors.function }}>techStack</span>
                      <span style={{ color: vsColors.operator }}> = </span>
                      <span style={{ color: vsColors.property }}>{"{"}</span>
                    </h2>
                  </div>
                </ScrollReveal>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(groupedSkills).map(([category, categorySkills], i) => {
                    const categoryColors = [vsColors.variable, vsColors.string, vsColors.function, vsColors.keyword, vsColors.operator];
                    const catColor = categoryColors[i % categoryColors.length];
                    
                    return (
                      <ScrollReveal key={category} delay={i * 0.1}>
                        <motion.div 
                          className="rounded-lg p-5 border"
                          style={{ backgroundColor: vsColors.active, borderColor: vsColors.border }}
                          whileHover={{ borderColor: catColor, y: -4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: catColor }} />
                            <h4 className="font-bold font-mono" style={{ color: catColor }}>{category}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categorySkills.map((skill) => (
                              <Badge 
                                key={skill.id} 
                                variant="outline" 
                                className="text-xs font-mono"
                                style={{ borderColor: vsColors.border, color: vsColors.text }}
                              >
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      </ScrollReveal>
                    );
                  })}
                </div>

                <ScrollReveal delay={0.3}>
                  <div className="text-center mt-8">
                    <span className="text-3xl sm:text-4xl font-bold" style={{ color: vsColors.property }}>{"}"}</span>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          )}

          {/* Education & Experience */}
          {(education.length > 0 || experiences.length > 0) && (
            <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: vsColors.sidebar }}>
              <div className="max-w-4xl mx-auto">
                {education.length > 0 && (
                  <div className="mb-16">
                    <ScrollReveal>
                      <div className="text-center mb-10">
                        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: vsColors.string }}>
                          {"// BACKGROUND"}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: vsColors.string }}>Education</h2>
                      </div>
                    </ScrollReveal>
                    
                    <div className="space-y-4">
                      {education.map((edu, i) => (
                        <ScrollReveal key={edu.id} delay={i * 0.1}>
                          <motion.div 
                            className="rounded-lg p-5 border"
                            style={{ backgroundColor: vsColors.bg, borderColor: vsColors.border }}
                            whileHover={{ borderColor: vsColors.string }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: vsColors.string }}>
                                <GraduationCap className="w-5 h-5" style={{ color: vsColors.bg }} />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg" style={{ color: vsColors.text }}>{edu.degree}</h4>
                                <p style={{ color: vsColors.string }}>{edu.institution}</p>
                                {edu.field_of_study && <p className="text-sm mt-1" style={{ color: vsColors.comment }}>{edu.field_of_study}</p>}
                                <p className="text-xs mt-2" style={{ color: vsColors.comment }}>{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                              </div>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                )}

                {experiences.length > 0 && (
                  <div>
                    <ScrollReveal>
                      <div className="text-center mb-10">
                        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: vsColors.function }}>
                          {"// CAREER"}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: vsColors.function }}>Experience</h2>
                      </div>
                    </ScrollReveal>
                    
                    <div className="space-y-4">
                      {experiences.map((exp, i) => (
                        <ScrollReveal key={exp.id} delay={i * 0.1}>
                          <motion.div 
                            className="rounded-lg p-5 border"
                            style={{ backgroundColor: vsColors.bg, borderColor: vsColors.border }}
                            whileHover={{ borderColor: vsColors.function }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: vsColors.function }}>
                                <Briefcase className="w-5 h-5" style={{ color: vsColors.bg }} />
                              </div>
                              <div>
                                <h4 className="font-bold text-lg" style={{ color: vsColors.text }}>{exp.position}</h4>
                                <p style={{ color: vsColors.function }}>{exp.company}</p>
                                <p className="text-xs mt-2" style={{ color: vsColors.comment }}>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                {exp.description && <p className="text-sm mt-3" style={{ color: vsColors.text }}>{exp.description}</p>}
                              </div>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Works Section */}
          {allProjects.length > 0 && (
            <section id="works" className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: vsColors.bg }}>
              <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: vsColors.keyword }}>
                      {"// PORTFOLIO"}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                      <span style={{ color: vsColors.keyword }}>export </span>
                      <span style={{ color: vsColors.keyword }}>const </span>
                      <span style={{ color: vsColors.variable }}>projects</span>
                    </h2>
                  </div>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allProjects.map((project, i) => (
                    <ScrollReveal key={project.id} delay={i * 0.05}>
                      <motion.div 
                        className="group rounded-lg overflow-hidden border"
                        style={{ backgroundColor: vsColors.active, borderColor: vsColors.border }}
                        onMouseEnter={() => setHoveredProject(project.id)}
                        onMouseLeave={() => setHoveredProject(null)}
                        whileHover={{ borderColor: vsColors.function, y: -4 }}
                      >
                        <div className="aspect-video overflow-hidden relative">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: vsColors.sidebar }}>
                              <Code2 className="w-12 h-12" style={{ color: vsColors.border }} />
                            </div>
                          )}
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center gap-3"
                            style={{ backgroundColor: "rgba(40, 44, 52, 0.9)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                          >
                            {project.live_url && (
                              <motion.a 
                                href={project.live_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: vsColors.function }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <ExternalLink className="w-4 h-4" style={{ color: vsColors.bg }} />
                              </motion.a>
                            )}
                            {project.github_url && (
                              <motion.a 
                                href={project.github_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: vsColors.string }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <Github className="w-4 h-4" style={{ color: vsColors.bg }} />
                              </motion.a>
                            )}
                          </motion.div>
                          {project.featured && (
                            <Badge className="absolute top-3 left-3 border-0 font-mono text-xs" style={{ backgroundColor: vsColors.keyword, color: vsColors.bg }}>★ featured</Badge>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold mb-1 font-mono" style={{ color: vsColors.text }}>{project.title}</h4>
                          {project.description && <p className="text-sm line-clamp-2" style={{ color: vsColors.comment }}>{project.description}</p>}
                          {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.tech_stack.slice(0, 3).map((tech, j) => (
                                <Badge key={j} variant="outline" className="text-[10px] font-mono" style={{ borderColor: vsColors.border, color: vsColors.text }}>{tech}</Badge>
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
          )}

          {/* Contact Section */}
          <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: vsColors.sidebar }}>
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: vsColors.operator }}>
                  {"// GET IN TOUCH"}
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span style={{ color: vsColors.function }}>contact</span>
                  <span style={{ color: vsColors.property }}>()</span>
                </h2>
                <p className="mb-10 max-w-xl mx-auto" style={{ color: vsColors.comment }}>
                  Have a project in mind? Let's collaborate and build something amazing together.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      className="rounded-lg font-mono"
                      style={{ backgroundColor: vsColors.function }}
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        sendEmail()
                      </a>
                    </Button>
                  )}
                  {portfolio?.phone && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-lg font-mono"
                      style={{ borderColor: vsColors.border }}
                      asChild
                    >
                      <a href={`tel:${portfolio.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        call()
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 text-sm" style={{ color: vsColors.comment }}>
                  {portfolio?.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: vsColors.operator }} />
                      {portfolio.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Mail className="w-4 h-4" style={{ color: vsColors.function }} />
                      {profile.email}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-6 px-4 sm:px-6 border-t" style={{ backgroundColor: vsColors.bg, borderColor: vsColors.border }}>
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  {portfolio?.logo_url ? (
                    <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
                  ) : (
                    <Code2 className="w-5 h-5" style={{ color: vsColors.function }} />
                  )}
                  <span className="text-sm font-mono" style={{ color: vsColors.comment }}>{profile?.display_name}</span>
                </div>

                {/* Footer Nav */}
                <div className="flex flex-wrap justify-center gap-6">
                  {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                      className="text-sm font-mono hover:opacity-80 transition-opacity"
                      style={{ color: vsColors.comment }}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* Copyright */}
                <p className="text-xs font-mono" style={{ color: vsColors.comment }}>
                  {"// "} © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Custom cursor blink animation */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
