import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WebDeveloperTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const colors = {
    bg: "#1E1E1E",
    sidebar: "#252526",
    active: "#2D2D2D",
    accent: "#007ACC",
    green: "#4EC9B0",
    yellow: "#DCDCAA",
    orange: "#CE9178",
    purple: "#C586C0",
    blue: "#569CD6",
  };

  const fullText = `const developer = {
  name: "${profile?.display_name || "Developer"}",
  role: "${portfolio?.headline || "Full Stack Developer"}",
  location: "${portfolio?.location || "Remote"}",
  skills: [${skills.slice(0, 4).map(s => `"${s.name}"`).join(", ")}],
};`;

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  useEffect(() => {
    const lines = [
      "$ Initializing system...",
      "$ Loading modules...",
      `$ Welcome, ${profile?.display_name || "Developer"}`,
      "$ System ready ✓",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [profile?.display_name]);

  useEffect(() => {
    if (!bootComplete) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [bootComplete, fullText]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const highlightCode = (code: string) => {
    return code
      .replace(/(const|let|var)/g, `<span style="color: ${colors.blue}">$1</span>`)
      .replace(/(".*?")/g, `<span style="color: ${colors.orange}">$1</span>`)
      .replace(/(developer|name|role|location|skills)/g, `<span style="color: ${colors.green}">$1</span>`)
      .replace(/(\[|\]|\{|\})/g, `<span style="color: ${colors.yellow}">$1</span>`)
      .replace(/(=)/g, `<span style="color: ${colors.purple}">$1</span>`);
  };

  return (
    <div className="min-h-screen font-mono text-[#D4D4D4]" style={{ backgroundColor: colors.bg }}>
      {/* Boot Screen */}
      <AnimatePresence>
        {!bootComplete && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-8"
            style={{ backgroundColor: colors.bg }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-2xl w-full">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-6 h-6" style={{ color: colors.accent }} />
                <span className="text-sm text-white/50">Terminal</span>
              </div>
              <div className="rounded-lg p-6 text-sm" style={{ backgroundColor: colors.sidebar }}>
                {bootLines.map((line, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={line.includes("✓") ? "text-[#4EC9B0]" : ""}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: colors.sidebar }}>
        <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>

          <div className="hidden md:flex items-center gap-1">
            {["hero", "bio", "skills", "works", "contact"].map((item, i) => (
              <motion.button 
                key={item}
                onClick={() => scrollTo(item)}
                className="px-3 py-1.5 text-xs flex items-center gap-1 rounded-t transition-colors hover:bg-[#2D2D2D]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Code2 className="w-3 h-3" style={{ color: colors.accent }} />
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
              className="md:hidden border-b px-6 py-4"
              style={{ backgroundColor: colors.sidebar, borderColor: "#3C3C3C" }}
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
                  <Code2 className="w-3 h-3" style={{ color: colors.accent }} />
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
        <div className="hidden md:flex flex-col w-12 min-h-screen border-r" style={{ backgroundColor: colors.sidebar, borderColor: "#3C3C3C" }}>
          <div className="flex flex-col items-center py-4 gap-4">
            <button className="p-2 hover:bg-white/5 rounded" style={{ color: colors.accent }}><Braces className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-white/5 rounded text-white/40"><Globe className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-white/5 rounded text-white/40"><Github className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Explorer */}
        <div className="hidden lg:block w-52 min-h-screen border-r" style={{ backgroundColor: colors.sidebar, borderColor: "#3C3C3C" }}>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wider text-white/40 mb-4">Explorer</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 py-1 px-2 text-sm" style={{ backgroundColor: colors.active }}>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/60 truncate">{profile?.display_name?.toLowerCase().replace(/\s/g, '-') || "project"}</span>
              </div>
              <div className="pl-4 space-y-1">
                {["index.tsx", "about.tsx", "skills.tsx", "projects.tsx", "contact.tsx"].map((file) => (
                  <button 
                    key={file}
                    onClick={() => scrollTo(file.replace(".tsx", "") === "index" ? "hero" : file.replace(".tsx", "") === "about" ? "bio" : file.replace(".tsx", "") === "projects" ? "works" : file.replace(".tsx", ""))}
                    className="flex items-center gap-2 py-1 px-2 text-xs hover:bg-white/5 rounded w-full text-left"
                  >
                    <Code2 className="w-3 h-3" style={{ color: colors.accent }} />
                    {file}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen overflow-x-hidden">
          {/* Hero Section */}
          <section id="hero" className="min-h-screen flex items-center p-4 sm:p-6 md:p-12">
            <div className="w-full max-w-4xl mx-auto">
              <motion.div 
                className="rounded-lg overflow-hidden shadow-2xl"
                style={{ backgroundColor: colors.active }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                  <Code2 className="w-4 h-4 mr-2" style={{ color: colors.accent }} />
                  <span className="text-sm text-white/60">developer.ts</span>
                </div>

                <div className="p-4 sm:p-6 flex overflow-x-auto">
                  <div className="pr-4 sm:pr-6 text-right select-none hidden sm:block" style={{ color: "#858585" }}>
                    {fullText.split('\n').map((_, i) => (
                      <div key={i} className="text-sm leading-7">{i + 1}</div>
                    ))}
                  </div>
                  <pre className="text-sm leading-7 whitespace-pre-wrap break-all sm:break-normal">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(typedText) + (showCursor ? '<span class="animate-pulse">|</span>' : '<span class="opacity-0">|</span>') }} />
                  </pre>
                </div>
              </motion.div>

              <motion.div 
                className="mt-6 rounded-lg overflow-hidden"
                style={{ backgroundColor: colors.sidebar }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                  <Terminal className="w-4 h-4 mr-2" style={{ color: colors.green }} />
                  <span className="text-xs">Terminal</span>
                </div>
                <div className="p-4 text-sm">
                  <p className="text-[#858585]">$ npm run dev</p>
                  <p className="mt-2" style={{ color: colors.green }}>✓ Ready to collaborate!</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-wrap gap-4 mt-8 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {profile?.email && (
                  <Button size="lg" style={{ backgroundColor: colors.accent }} asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      $ contact --send
                    </a>
                  </Button>
                )}
                {socialLinks.find(l => l.platform.toLowerCase() === 'github') && (
                  <Button size="lg" variant="outline" className="border-white/20" asChild>
                    <a href={socialLinks.find(l => l.platform.toLowerCase() === 'github')?.url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      $ git clone
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </section>

          {/* Bio Section */}
          <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: colors.active }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: "#3C3C3C" }}>
                  <Braces className="w-4 h-4 mr-2" style={{ color: colors.accent }} />
                  <span className="text-sm">README.md</span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 mx-auto md:mx-0" style={{ borderColor: colors.accent }}>
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-3xl sm:text-4xl rounded-lg" style={{ backgroundColor: colors.accent }}>
                        {profile?.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-2xl sm:text-3xl font-bold font-sans mb-2" style={{ color: colors.green }}>
                        # {profile?.display_name}
                      </h1>
                      <p className="text-white/60 mb-4">{portfolio?.headline}</p>
                      
                      {portfolio?.bio && (
                        <p className="text-white/70 font-sans leading-relaxed mb-6">{portfolio.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
                        {portfolio?.location && (
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" style={{ color: colors.accent }} />
                            {portfolio.location}
                          </span>
                        )}
                        {profile?.email && (
                          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                            <Mail className="w-4 h-4" style={{ color: colors.accent }} />
                            {profile.email}
                          </a>
                        )}
                      </div>

                      {socialLinks.length > 0 && (
                        <div className="flex gap-2 mt-6 justify-center md:justify-start">
                          {socialLinks.map((link) => {
                            const Icon = getSocialIcon(link.platform);
                            return (
                              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center hover:bg-white/10 transition-colors" style={{ backgroundColor: colors.sidebar }}>
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

          {/* Skills Section */}
          {skills.length > 0 && (
            <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6" style={{ backgroundColor: colors.sidebar }}>
              <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.accent }}>Expertise</h2>
                  <h3 className="text-3xl sm:text-4xl font-bold font-sans">Tech Stack</h3>
                </motion.div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                    <motion.div 
                      key={category}
                      className="rounded-lg p-6 border border-[#3C3C3C]"
                      style={{ backgroundColor: colors.active }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <h4 className="font-bold mb-4 font-sans" style={{ color: colors.green }}>{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge key={skill.id} variant="outline" className="text-xs border-[#3C3C3C]">{skill.name}</Badge>
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
            <section className="py-24 sm:py-32 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                {education.length > 0 && (
                  <div className="mb-16 sm:mb-20">
                    <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.green }}>Background</h2>
                      <h3 className="text-3xl sm:text-4xl font-bold font-sans">Education</h3>
                    </motion.div>
                    <div className="space-y-4">
                      {education.map((edu, i) => (
                        <motion.div 
                          key={edu.id}
                          className="rounded-lg p-6 border border-[#3C3C3C]"
                          style={{ backgroundColor: colors.active }}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.green }}>
                              <GraduationCap className="w-5 h-5 text-black" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg font-sans">{edu.degree}</h4>
                              <p style={{ color: colors.green }}>{edu.institution}</p>
                              {edu.field_of_study && <p className="text-white/40 text-sm mt-1">{edu.field_of_study}</p>}
                              <p className="text-white/30 text-xs mt-2">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {experiences.length > 0 && (
                  <div>
                    <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.accent }}>Career</h2>
                      <h3 className="text-3xl sm:text-4xl font-bold font-sans">Experience</h3>
                    </motion.div>
                    <div className="space-y-4">
                      {experiences.map((exp, i) => (
                        <motion.div 
                          key={exp.id}
                          className="rounded-lg p-6 border border-[#3C3C3C]"
                          style={{ backgroundColor: colors.active }}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.accent }}>
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg font-sans">{exp.position}</h4>
                              <p style={{ color: colors.accent }}>{exp.company}</p>
                              <p className="text-white/30 text-xs mt-2">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                              {exp.description && <p className="text-white/50 text-sm mt-3">{exp.description}</p>}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Works Section */}
          {allProjects.length > 0 && (
            <section id="works" className="py-24 sm:py-32 px-4 sm:px-6" style={{ backgroundColor: colors.sidebar }}>
              <div className="max-w-5xl mx-auto">
                <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.accent }}>Portfolio</h2>
                  <h3 className="text-3xl sm:text-4xl font-bold font-sans">Projects</h3>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {allProjects.map((project, i) => (
                    <motion.div 
                      key={project.id}
                      className="group rounded-lg overflow-hidden border border-[#3C3C3C]"
                      style={{ backgroundColor: colors.active }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <div className="aspect-video overflow-hidden relative">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                            <Code2 className="w-12 h-12 text-white/20" />
                          </div>
                        )}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center bg-black/60 gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                        >
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </motion.div>
                        {project.featured && (
                          <Badge className="absolute top-3 left-3 border-0" style={{ backgroundColor: colors.accent }}>Featured</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold mb-1 font-sans">{project.title}</h4>
                        {project.description && <p className="text-sm text-white/50 line-clamp-2">{project.description}</p>}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {project.tech_stack.slice(0, 3).map((tech, j) => (
                              <Badge key={j} variant="outline" className="text-[10px] border-[#3C3C3C]">{tech}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: colors.accent }}>Get In Touch</h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans mb-6">Let's Build Something</h3>
                <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto font-sans">
                  Have a project in mind? Let's collaborate and build something amazing together.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {profile?.email && (
                    <Button size="lg" style={{ backgroundColor: colors.accent }} asChild>
                      <a href={`mailto:${profile.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        $ send --message
                      </a>
                    </Button>
                  )}
                  {portfolio?.phone && (
                    <Button size="lg" variant="outline" className="border-white/20" asChild>
                      <a href={`tel:${portfolio.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        $ call --now
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/40 font-sans">
                  {portfolio?.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {portfolio.location}
                    </span>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-4 sm:px-6 border-t" style={{ borderColor: "#3C3C3C", backgroundColor: colors.sidebar }}>
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5" style={{ color: colors.accent }} />
                <span className="text-sm text-white/40">{profile?.display_name}</span>
              </div>
              <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
