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
            <Code2 className="w-4 h-4" style={{ color: vsColors.function }} />
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
          {/* Hero Section - Code Editor */}
          <section id="hero" className="min-h-screen flex items-center p-4 sm:p-6 md:p-12">
            <div className="w-full max-w-4xl mx-auto">
              <ScrollReveal>
                {/* Code Editor Window */}
                <div className="rounded-lg overflow-hidden shadow-2xl border" style={{ backgroundColor: vsColors.active, borderColor: vsColors.border }}>
                  {/* Editor Tab */}
                  <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: vsColors.border }}>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-t border-t-2" style={{ borderColor: vsColors.function, backgroundColor: vsColors.bg }}>
                      <FileCode className="w-4 h-4" style={{ color: vsColors.function }} />
                      <span className="text-xs">developer.ts</span>
                      <span className="text-xs ml-2" style={{ color: vsColors.comment }}>×</span>
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-4 sm:p-6 flex overflow-x-auto" style={{ backgroundColor: vsColors.bg }}>
                    {/* Line Numbers */}
                    <div className="pr-4 sm:pr-6 text-right select-none hidden sm:block" style={{ color: vsColors.comment }}>
                      {fullText.split('\n').map((_, i) => (
                        <div key={i} className="text-sm leading-7">{i + 1}</div>
                      ))}
                    </div>
                    
                    {/* Code */}
                    <pre className="text-sm leading-7 whitespace-pre-wrap break-all sm:break-normal">
                      <code 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightCode(typedText) + 
                            (showCursor ? `<span style="color: ${vsColors.function}; animation: blink 1s infinite">|</span>` : '<span class="opacity-0">|</span>') 
                        }} 
                      />
                    </pre>
                  </div>
                </div>
              </ScrollReveal>

              {/* Terminal */}
              <ScrollReveal delay={0.2}>
                <div className="mt-4 rounded-lg overflow-hidden border" style={{ backgroundColor: vsColors.sidebar, borderColor: vsColors.border }}>
                  <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: vsColors.border }}>
                    <Terminal className="w-4 h-4 mr-2" style={{ color: vsColors.string }} />
                    <span className="text-xs font-semibold">TERMINAL</span>
                    <span className="text-xs ml-2" style={{ color: vsColors.comment }}>zsh</span>
                  </div>
                  <div className="p-4 text-sm font-mono" style={{ backgroundColor: vsColors.bg }}>
                    <p style={{ color: vsColors.comment }}>
                      <span style={{ color: vsColors.string }}>➜</span> ~/portfolio <span style={{ color: vsColors.function }}>git:(</span><span style={{ color: vsColors.variable }}>main</span><span style={{ color: vsColors.function }}>)</span> npm run dev
                    </p>
                    <p className="mt-2">
                      <span style={{ color: vsColors.string }}>✓</span> <span style={{ color: vsColors.text }}>Ready in</span> <span style={{ color: vsColors.number }}>1.2s</span>
                    </p>
                    <p className="mt-1">
                      <span style={{ color: vsColors.function }}>➜</span> Local: <span style={{ color: vsColors.operator }}>http://localhost:3000</span>
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal delay={0.4}>
                <div className="flex flex-wrap gap-4 mt-8 justify-center">
                  {profile?.email && (
                    <Button 
                      size="lg" 
                      className="rounded-lg font-mono"
                      style={{ backgroundColor: vsColors.function }}
                      asChild
                    >
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        contact.send()
                      </a>
                    </Button>
                  )}
                  {socialLinks.find(l => l.platform.toLowerCase() === 'github') && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-lg font-mono"
                      style={{ borderColor: vsColors.border, color: vsColors.text }}
                      asChild
                    >
                      <a href={socialLinks.find(l => l.platform.toLowerCase() === 'github')?.url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        git.clone()
                      </a>
                    </Button>
                  )}
                </div>
              </ScrollReveal>
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
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5" style={{ color: vsColors.function }} />
                <span className="text-sm font-mono" style={{ color: vsColors.comment }}>{profile?.display_name}</span>
              </div>
              <p className="text-xs font-mono" style={{ color: vsColors.comment }}>
                {"// "} © {new Date().getFullYear()} All rights reserved.
              </p>
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
