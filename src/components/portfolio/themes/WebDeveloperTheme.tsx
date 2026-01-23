import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, Cpu, Database, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WebDeveloperTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // VS Code / Terminal colors
  const codeColors = {
    bg: "#1E1E1E",
    sidebar: "#252526",
    active: "#2D2D2D",
    accent: "#007ACC",
    green: "#4EC9B0",
    yellow: "#DCDCAA",
    orange: "#CE9178",
    purple: "#C586C0",
    blue: "#569CD6",
    comment: "#6A9955",
  };

  const fullText = `const developer = {
  name: "${profile?.display_name || "Developer"}",
  role: "${portfolio?.headline || "Full Stack Developer"}",
  location: "${portfolio?.location || "Remote"}",
  skills: [${skills.slice(0, 5).map(s => `"${s.name}"`).join(", ")}],
  passion: "Building amazing web experiences"
};`;

  // Boot sequence
  useEffect(() => {
    const lines = [
      "$ Initializing system...",
      "$ Loading modules...",
      `$ Welcome, ${profile?.display_name || "Developer"}`,
      "$ System ready ✓",
    ];
    
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        setBootLines(prev => [...prev, lines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [profile?.display_name]);

  // Typing animation
  useEffect(() => {
    if (!bootComplete) return;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [bootComplete, fullText]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // Syntax highlighting
  const highlightCode = (code: string) => {
    return code
      .replace(/(const|let|var)/g, `<span style="color: ${codeColors.blue}">$1</span>`)
      .replace(/(".*?")/g, `<span style="color: ${codeColors.orange}">$1</span>`)
      .replace(/(developer|name|role|location|skills|passion)/g, `<span style="color: ${codeColors.green}">$1</span>`)
      .replace(/(\[|\]|\{|\})/g, `<span style="color: ${codeColors.yellow}">$1</span>`)
      .replace(/(=)/g, `<span style="color: ${codeColors.purple}">$1</span>`);
  };

  return (
    <div className="min-h-screen font-mono text-[#D4D4D4] overflow-hidden" style={{ backgroundColor: codeColors.bg }}>
      {/* Boot Screen */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-8"
            style={{ backgroundColor: codeColors.bg }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl w-full">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-6 h-6" style={{ color: codeColors.accent }} />
                <span className="text-sm text-white/60">Terminal</span>
              </div>
              <div className="rounded-lg p-6 text-sm" style={{ backgroundColor: codeColors.sidebar }}>
                {bootLines.map((line, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={line.includes("✓") ? "text-[#4EC9B0]" : "text-[#D4D4D4]"}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VS Code Style Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: codeColors.sidebar }}>
        <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
          {/* Window Controls */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>

          {/* File Tabs */}
          <div className="hidden md:flex items-center gap-1">
            {["hero", "bio", "skills", "works", "contact"].map((item, i) => (
              <motion.button 
                key={item}
                onClick={() => scrollTo(item)}
                className="px-3 py-1.5 text-xs flex items-center gap-1 rounded-t transition-colors"
                style={{ 
                  backgroundColor: i === 0 ? codeColors.active : "transparent",
                }}
                whileHover={{ backgroundColor: codeColors.active }}
              >
                <Code2 className="w-3 h-3" style={{ color: codeColors.accent }} />
                {item === "hero" ? "index" : item}.tsx
              </motion.button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 md:hidden">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden border-b px-6 py-4 space-y-2"
              style={{ backgroundColor: codeColors.sidebar, borderColor: "#3C3C3C" }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["index", "about", "skills", "projects", "contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item === "index" ? "hero" : item === "about" ? "bio" : item === "projects" ? "works" : item)}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm"
                >
                  <Code2 className="w-3 h-3" style={{ color: codeColors.accent }} />
                  {item}.tsx
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex pt-10">
        {/* Activity Bar */}
        <div className="hidden md:flex flex-col w-12 min-h-screen border-r" style={{ backgroundColor: codeColors.sidebar, borderColor: "#3C3C3C" }}>
          <div className="flex flex-col items-center py-4 gap-4">
            <button className="p-2 hover:bg-white/5 rounded transition-colors" style={{ color: codeColors.accent }}>
              <Braces className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded transition-colors text-white/40">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded transition-colors text-white/40">
              <Database className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded transition-colors text-white/40">
              <Github className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explorer Sidebar */}
        <div className="hidden lg:block w-60 min-h-screen border-r" style={{ backgroundColor: codeColors.sidebar, borderColor: "#3C3C3C" }}>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-white/40 mb-4">Explorer</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 py-1 px-2 text-sm" style={{ backgroundColor: codeColors.active }}>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/60">{profile?.display_name?.toLowerCase().replace(/\s/g, '-') || "project"}</span>
              </div>
              <div className="pl-4 space-y-1">
                {["index.tsx", "about.tsx", "skills.tsx", "projects.tsx", "contact.tsx"].map((file, i) => (
                  <button 
                    key={file}
                    onClick={() => scrollTo(file.replace(".tsx", "") === "index" ? "hero" : file.replace(".tsx", "") === "about" ? "bio" : file.replace(".tsx", "") === "projects" ? "works" : file.replace(".tsx", ""))}
                    className="flex items-center gap-2 py-1 px-2 text-xs hover:bg-white/5 rounded w-full text-left"
                  >
                    <Code2 className="w-3 h-3" style={{ color: codeColors.accent }} />
                    {file}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 min-h-screen">
          {/* Hero Section - Code Editor */}
          <section id="hero" className="min-h-screen flex items-center p-6 md:p-12">
            <div className="w-full max-w-4xl mx-auto">
              {/* Line Numbers + Code */}
              <motion.div 
                className="rounded-lg overflow-hidden shadow-2xl"
                style={{ backgroundColor: codeColors.active }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Editor Header */}
                <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                  <Code2 className="w-4 h-4 mr-2" style={{ color: codeColors.accent }} />
                  <span className="text-sm text-white/60">developer.ts</span>
                </div>

                {/* Code Content */}
                <div className="p-6 flex">
                  {/* Line Numbers */}
                  <div className="pr-6 text-right select-none" style={{ color: "#858585" }}>
                    {fullText.split('\n').map((_, i) => (
                      <div key={i} className="text-sm leading-7">{i + 1}</div>
                    ))}
                  </div>

                  {/* Code */}
                  <pre className="text-sm leading-7 overflow-x-auto">
                    <code 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightCode(typedText) + (showCursor ? '<span class="animate-pulse">|</span>' : '<span class="opacity-0">|</span>') 
                      }} 
                    />
                  </pre>
                </div>
              </motion.div>

              {/* Terminal Output */}
              <motion.div 
                className="mt-6 rounded-lg overflow-hidden"
                style={{ backgroundColor: codeColors.sidebar }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                  <Terminal className="w-4 h-4 mr-2" style={{ color: codeColors.green }} />
                  <span className="text-xs">Terminal</span>
                </div>
                <div className="p-4 text-sm">
                  <p className="text-[#858585]">$ npm run dev</p>
                  <p className="mt-2" style={{ color: codeColors.green }}>
                    ✓ Ready to collaborate!
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-8 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {profile?.email && (
                  <Button 
                    size="lg" 
                    className="font-mono"
                    style={{ backgroundColor: codeColors.accent }}
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      $ contact --send
                    </a>
                  </Button>
                )}
                {socialLinks.find(l => l.platform.toLowerCase() === 'github') && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="font-mono border-white/20"
                    asChild
                  >
                    <a href={socialLinks.find(l => l.platform.toLowerCase() === 'github')?.url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      $ git clone
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </section>

          {/* Bio Section - README Style */}
          <section id="bio" className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: codeColors.active }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                  <Braces className="w-4 h-4 mr-2" style={{ color: codeColors.accent }} />
                  <span className="text-sm">README.md</span>
                </div>
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <Avatar className="w-32 h-32 rounded-lg border-2" style={{ borderColor: codeColors.accent }}>
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-4xl rounded-lg" style={{ backgroundColor: codeColors.accent }}>
                        {profile?.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold font-sans mb-2" style={{ color: codeColors.green }}>
                        # {profile?.display_name}
                      </h1>
                      <p className="text-white/60 mb-4">{portfolio?.headline}</p>
                      
                      {portfolio?.bio && (
                        <p className="text-white/70 font-sans leading-relaxed mb-6">
                          {portfolio.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {portfolio?.location && (
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" style={{ color: codeColors.accent }} />
                            {portfolio.location}
                          </span>
                        )}
                        {profile?.email && (
                          <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" style={{ color: codeColors.accent }} />
                            {profile.email}
                          </span>
                        )}
                      </div>

                      {socialLinks.length > 0 && (
                        <div className="flex gap-2 mt-6">
                          {socialLinks.map((link) => {
                            const Icon = getSocialIcon(link.platform);
                            return (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                                style={{ backgroundColor: codeColors.sidebar }}
                              >
                                <Icon className="w-4 h-4" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Skills Section - Package.json Style */}
          {skills.length > 0 && (
            <section id="skills" className="py-20 px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="rounded-lg overflow-hidden"
                  style={{ backgroundColor: codeColors.active }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                    <Cpu className="w-4 h-4 mr-2" style={{ color: codeColors.yellow }} />
                    <span className="text-sm">package.json</span>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        <span style={{ color: "#D4D4D4" }}>{"{"}</span>{"\n"}
                        <span style={{ color: codeColors.green }}>  "dependencies"</span>
                        <span style={{ color: "#D4D4D4" }}>: {"{"}</span>{"\n"}
                        {skills.map((skill, i) => (
                          <span key={skill.id}>
                            <span style={{ color: codeColors.accent }}>    "{skill.name}"</span>
                            <span style={{ color: "#D4D4D4" }}>: </span>
                            <span style={{ color: codeColors.orange }}>"{skill.proficiency || 80}%"</span>
                            {i < skills.length - 1 && <span style={{ color: "#D4D4D4" }}>,</span>}
                            {"\n"}
                          </span>
                        ))}
                        <span style={{ color: "#D4D4D4" }}>  {"}"}</span>{"\n"}
                        <span style={{ color: "#D4D4D4" }}>{"}"}</span>
                      </code>
                    </pre>
                  </div>
                </motion.div>

                {/* Skills Progress */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                    <motion.div 
                      key={category}
                      className="rounded-lg p-6"
                      style={{ backgroundColor: codeColors.sidebar }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <h4 className="font-bold font-sans mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4" style={{ color: codeColors.accent }} />
                        {category}
                      </h4>
                      <div className="space-y-3">
                        {categorySkills.map((skill) => (
                          <div key={skill.id}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{skill.name}</span>
                              <span style={{ color: codeColors.green }}>{skill.proficiency || 80}%</span>
                            </div>
                            <Progress value={skill.proficiency || 80} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Education & Experience */}
          {(education.length > 0 || experiences.length > 0) && (
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto space-y-8">
                {education.length > 0 && (
                  <motion.div 
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: codeColors.active }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                      <GraduationCap className="w-4 h-4 mr-2" style={{ color: codeColors.purple }} />
                      <span className="text-sm">education.json</span>
                    </div>
                    <div className="p-6 space-y-4">
                      {education.map((edu) => (
                        <div 
                          key={edu.id}
                          className="p-4 rounded"
                          style={{ backgroundColor: codeColors.sidebar }}
                        >
                          <h4 className="font-bold font-sans">{edu.degree}</h4>
                          <p style={{ color: codeColors.purple }}>{edu.institution}</p>
                          {edu.field_of_study && <p className="text-sm text-white/40">{edu.field_of_study}</p>}
                          <p className="text-xs text-white/30 mt-2">
                            {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {experiences.length > 0 && (
                  <motion.div 
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: codeColors.active }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                      <Briefcase className="w-4 h-4 mr-2" style={{ color: codeColors.green }} />
                      <span className="text-sm">experience.json</span>
                    </div>
                    <div className="p-6 space-y-4">
                      {experiences.map((exp) => (
                        <div 
                          key={exp.id}
                          className="p-4 rounded"
                          style={{ backgroundColor: codeColors.sidebar }}
                        >
                          <h4 className="font-bold font-sans">{exp.position}</h4>
                          <p style={{ color: codeColors.green }}>{exp.company}</p>
                          <p className="text-xs text-white/30 mt-1">
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </p>
                          {exp.description && (
                            <p className="text-white/60 mt-2 text-sm font-sans">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <section id="works" className="py-20 px-6">
              <div className="max-w-5xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm font-mono mb-2" style={{ color: codeColors.comment }}>
                    {"// Featured repositories"}
                  </p>
                  <h2 className="text-3xl font-bold font-sans" style={{ color: codeColors.green }}>
                    Projects
                  </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[...featuredProjects, ...otherProjects].map((project, i) => (
                    <motion.div 
                      key={project.id}
                      className="rounded-lg overflow-hidden group"
                      style={{ backgroundColor: codeColors.sidebar }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {/* Window Controls */}
                      <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        </div>
                        <span className="ml-3 text-xs text-white/40">{project.title.toLowerCase().replace(/\s/g, '-')}</span>
                      </div>

                      {project.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-bold font-sans" style={{ color: codeColors.green }}>{project.title}</h3>
                          {project.featured && (
                            <Badge style={{ backgroundColor: codeColors.accent }}>Featured</Badge>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-white/60 mb-4 line-clamp-2 font-sans">{project.description}</p>
                        )}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech_stack.map((tech) => (
                              <Badge key={tech} variant="outline" className="border-white/20 text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          {project.live_url && (
                            <Button size="sm" style={{ backgroundColor: codeColors.accent }} asChild>
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />Live
                              </a>
                            </Button>
                          )}
                          {project.github_url && (
                            <Button size="sm" variant="outline" className="border-white/20" asChild>
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3 h-3 mr-1" />Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="py-20 px-6">
            <div className="max-w-2xl mx-auto">
              <motion.div 
                className="rounded-lg overflow-hidden text-center"
                style={{ backgroundColor: codeColors.active }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center px-4 py-2 border-b justify-center" style={{ borderColor: "#3C3C3C" }}>
                  <Terminal className="w-4 h-4 mr-2" style={{ color: codeColors.green }} />
                  <span className="text-sm">contact.sh</span>
                </div>
                <div className="p-8">
                  <pre className="text-left inline-block mb-6 text-sm">
                    <code>
                      <span style={{ color: codeColors.comment }}># Let's build something amazing</span>{"\n"}
                      <span style={{ color: codeColors.green }}>$ </span>
                      <span style={{ color: codeColors.yellow }}>echo</span>
                      <span style={{ color: codeColors.orange }}> "Ready to collaborate?"</span>
                    </code>
                  </pre>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    {profile?.email && (
                      <Button 
                        size="lg" 
                        className="font-mono"
                        style={{ backgroundColor: codeColors.accent }}
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
                        className="font-mono border-white/20"
                        asChild
                      >
                        <a href={`tel:${portfolio.phone}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          {portfolio.phone}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer - Status Bar */}
          <footer className="py-3 px-4 border-t flex items-center justify-between text-xs" style={{ backgroundColor: codeColors.accent, borderColor: "#3C3C3C" }}>
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} {profile?.display_name}</span>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.slice(0, 4).map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
