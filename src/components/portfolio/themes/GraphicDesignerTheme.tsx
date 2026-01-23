import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Sparkles, Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphicDesignerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const adobeApps = [
    { icon: "Ps", name: "Photoshop", color: "#31A8FF" },
    { icon: "Ai", name: "Illustrator", color: "#FF9A00" },
    { icon: "Id", name: "InDesign", color: "#FF3366" },
    { icon: "Xd", name: "XD", color: "#FF61F6" },
    { icon: "Ae", name: "After Effects", color: "#9999FF" },
    { icon: "Fg", name: "Figma", color: "#A259FF" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Design";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-hidden">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed w-6 h-6 rounded-full pointer-events-none z-[100] mix-blend-difference bg-white hidden md:block"
        animate={{ x: cursorPos.x - 12, y: cursorPos.y - 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#1a1a2e] flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="flex gap-3 mb-8 justify-center">
                {adobeApps.slice(0, 4).map((app, i) => (
                  <motion.div
                    key={app.icon}
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg"
                    style={{ backgroundColor: app.color }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                  >
                    {app.icon}
                  </motion.div>
                ))}
              </div>
              <motion.p 
                className="text-white/50 text-sm tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Loading Creative Studio...
              </motion.p>
              <motion.div 
                className="w-48 h-1 bg-white/10 rounded-full mt-6 mx-auto overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 1.2 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2d2d44]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9A00] via-[#FF3366] to-[#A259FF] flex items-center justify-center">
                <span className="font-black text-sm">Ds</span>
              </div>
              <span className="font-bold hidden sm:block">{profile?.display_name || "Designer"}</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-1">
              {["Home", "About", "Skills", "Work", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
              <ThemeToggle />
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-[#2d2d44] border-t border-white/10 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Work", "Contact"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="block w-full text-left py-3 text-white/70">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen pt-14 relative flex items-center">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `linear-gradient(rgba(255,154,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,154,0,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />

        {/* Floating Software Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {adobeApps.map((app, i) => (
            <motion.div
              key={app.icon}
              className="absolute hidden lg:flex w-12 h-12 rounded-xl items-center justify-center font-bold shadow-lg"
              style={{ 
                backgroundColor: app.color,
                right: `${10 + (i % 3) * 8}%`,
                top: `${20 + i * 12}%`,
              }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
            >
              {app.icon}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Badge className="mb-6 bg-gradient-to-r from-[#FF9A00] to-[#FF3366] text-white border-0">
                <PenTool className="w-3 h-3 mr-2" />
                Graphic Designer
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-white/30">I'm a</span>
              <span className="block bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF] bg-clip-text text-transparent">Creative</span>
              <span className="block">Designer</span>
            </motion.h1>

            {portfolio?.headline && (
              <motion.p 
                className="text-lg sm:text-xl text-white/50 mb-8 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {portfolio.headline}
              </motion.p>
            )}

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-full bg-gradient-to-r from-[#FF9A00] to-[#FF3366] hover:shadow-lg hover:shadow-[#FF3366]/30"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Hire Me
                  </a>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full border-white/20 hover:bg-white/5"
                onClick={() => scrollTo('works')}
              >
                <Layers className="w-4 h-4 mr-2" />
                View Work
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Artboard Style Profile */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2d2d44] rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                  <span className="ml-2 text-xs text-white/40">profile.psd - 100%</span>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#FF9A00]/20 to-[#A259FF]/20">
                  <Avatar className="w-full h-full rounded-xl">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-6xl sm:text-8xl bg-gradient-to-br from-[#FF9A00] to-[#A259FF] text-white rounded-xl">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">About Me</h2>
              <h3 className="text-3xl sm:text-4xl font-black mb-6">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-[#FF3366]" />
                    {portfolio.location}
                  </span>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4 text-[#31A8FF]" />
                    {profile.email}
                  </a>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link, i) => {
                    const Icon = getSocialIcon(link.platform);
                    const colors = ["#FF9A00", "#31A8FF", "#FF3366", "#A259FF"];
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: colors[i % colors.length] }}
                        whileHover={{ y: -3 }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#16162a]">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Expertise</h2>
              <h3 className="text-3xl sm:text-4xl font-black">Creative Tools</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => {
                const colors = ["#FF9A00", "#31A8FF", "#FF3366", "#A259FF", "#9999FF"];
                return (
                  <motion.div 
                    key={category}
                    className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-4" style={{ backgroundColor: colors[i % colors.length] }}>
                      {category[0]}
                    </div>
                    <h4 className="font-bold mb-3">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.id} variant="outline" className="text-xs border-white/10 text-white/60">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
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
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#31A8FF] mb-4">Background</h2>
                  <h3 className="text-3xl sm:text-4xl font-black">Education</h3>
                </motion.div>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="bg-[#2d2d44] rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#31A8FF] flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{edu.degree}</h4>
                          <p className="text-[#31A8FF]">{edu.institution}</p>
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
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF3366] mb-4">Career</h2>
                  <h3 className="text-3xl sm:text-4xl font-black">Experience</h3>
                </motion.div>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="bg-[#2d2d44] rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FF3366] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{exp.position}</h4>
                          <p className="text-[#FF3366]">{exp.company}</p>
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
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#16162a]">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#A259FF] mb-4">Portfolio</h2>
              <h3 className="text-3xl sm:text-4xl font-black">Featured Work</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#2d2d44]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF9A00]/20 to-[#A259FF]/20 flex items-center justify-center">
                        <Palette className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent flex items-end p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                  >
                    <div>
                      {project.featured && (
                        <Badge className="mb-2 bg-gradient-to-r from-[#FF9A00] to-[#FF3366] border-0 text-xs">Featured</Badge>
                      )}
                      <h4 className="text-lg font-bold mb-1">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                      )}
                      {(project.live_url || project.github_url) && (
                        <div className="flex gap-3 mt-3">
                          {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">Let's Create Something Amazing</h3>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Have a project in mind? Let's bring your vision to life with stunning designs.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button 
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#FF9A00] to-[#FF3366] hover:shadow-lg hover:shadow-[#FF3366]/30"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/20"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Me
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/40">
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
      <footer className="py-8 px-4 sm:px-6 bg-[#16162a] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9A00] to-[#A259FF] flex items-center justify-center">
              <span className="font-bold text-xs">Ds</span>
            </div>
            <span className="text-sm text-white/40">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
