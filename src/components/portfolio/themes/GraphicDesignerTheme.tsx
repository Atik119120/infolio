import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, PenTool, Layers,
  Briefcase, GraduationCap, Menu, X, Sparkles, Triangle, Circle, Square, Hexagon
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphicDesignerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
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

  // Adobe-style colors
  const adobeColors = {
    illustrator: "#FF9A00",
    photoshop: "#31A8FF", 
    indesign: "#FF3366",
    xd: "#FF61F6",
    aftereffects: "#9999FF",
    figma: "#A259FF"
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-hidden">
      {/* Custom Cursor Follower */}
      <motion.div 
        className="fixed w-6 h-6 rounded-full pointer-events-none z-[100] mix-blend-difference bg-white hidden md:block"
        animate={{ x: cursorPos.x - 12, y: cursorPos.y - 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Adobe-Style Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#1a1a2e] flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              {/* Adobe Apps Animation */}
              <div className="flex gap-4 mb-8">
                {[
                  { icon: "Ps", color: adobeColors.photoshop },
                  { icon: "Ai", color: adobeColors.illustrator },
                  { icon: "Id", color: adobeColors.indesign },
                  { icon: "Xd", color: adobeColors.xd },
                ].map((app, i) => (
                  <motion.div
                    key={app.icon}
                    className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg"
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
                className="text-white/60 text-sm tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Loading Creative Studio...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Design Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {i % 3 === 0 && <Triangle className="w-8 h-8 text-[#FF9A00]/10" />}
            {i % 3 === 1 && <Circle className="w-8 h-8 text-[#31A8FF]/10" />}
            {i % 3 === 2 && <Square className="w-8 h-8 text-[#FF3366]/10" />}
          </motion.div>
        ))}
      </div>

      {/* Navigation - Toolbar Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2d2d44]/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Adobe-Style Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9A00] via-[#FF3366] to-[#A259FF] flex items-center justify-center">
              <span className="font-black text-sm">Ds</span>
            </div>
            <span className="font-bold text-lg">{profile?.display_name || "Designer"}</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-1">
            {["Home", "About", "Skills", "Work", "Contact"].map((item, i) => (
              <motion.button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase())} 
                className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
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

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-[#2d2d44] border-t border-white/10 px-6 py-4 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Work", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "work" ? "works" : item.toLowerCase())} 
                  className="block w-full text-left py-2 text-white/80 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Creative Canvas */}
      <section id="hero" className="min-h-screen pt-20 relative flex items-center overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,154,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,154,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }} />

        {/* Cover Background */}
        <div className="absolute inset-0">
          {projects[0]?.image_url && (
            <motion.img
              src={projects[0].image_url}
              alt="Cover"
              className="w-full h-full object-cover opacity-20"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#1a1a2e]/90 to-[#1a1a2e]/70" />
        </div>

        {/* Floating Software Icons */}
        <motion.div 
          className="absolute top-1/4 right-[10%] hidden lg:block"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-16 h-16 rounded-xl bg-[#31A8FF] flex items-center justify-center font-bold text-xl shadow-2xl shadow-[#31A8FF]/30">
            Ps
          </div>
        </motion.div>
        <motion.div 
          className="absolute top-1/3 right-[20%] hidden lg:block"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="w-14 h-14 rounded-xl bg-[#FF9A00] flex items-center justify-center font-bold text-lg shadow-2xl shadow-[#FF9A00]/30">
            Ai
          </div>
        </motion.div>
        <motion.div 
          className="absolute bottom-1/3 right-[15%] hidden lg:block"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-xl bg-[#A259FF] flex items-center justify-center font-bold shadow-2xl shadow-[#A259FF]/30">
            Fg
          </div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-[#FF9A00] to-[#FF3366] text-white border-0">
                <PenTool className="w-3 h-3 mr-2" />
                Graphic Designer
              </Badge>
            </motion.div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
                <span className="block text-white/20">I'm a</span>
                <span className="block bg-gradient-to-r from-[#FF9A00] via-[#FF3366] to-[#A259FF] bg-clip-text text-transparent">
                  Creative
                </span>
                <span className="block">Designer</span>
              </h1>
            </motion.div>

            {portfolio?.headline && (
              <motion.p 
                className="text-xl md:text-2xl text-white/60 mb-8 max-w-xl"
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
                  className="rounded-full bg-gradient-to-r from-[#FF9A00] to-[#FF3366] hover:shadow-lg hover:shadow-[#FF3366]/30 transition-all"
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
                className="rounded-full border-white/20 hover:bg-white/10"
                onClick={() => scrollTo('works')}
              >
                <Layers className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section - Artboard Style */}
      <section id="bio" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Profile - Artboard */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Artboard Frame */}
              <div className="relative bg-[#2d2d44] rounded-2xl p-4 shadow-2xl">
                {/* Toolbar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                  <span className="ml-2 text-xs text-white/40">profile.psd - 100%</span>
                </div>
                {/* Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#FF9A00]/20 to-[#A259FF]/20">
                  <Avatar className="w-full h-full rounded-xl">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-8xl bg-gradient-to-br from-[#FF9A00] to-[#A259FF] text-white rounded-xl">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Rulers */}
                <div className="absolute top-12 left-0 bottom-0 w-4 bg-[#2d2d44] flex flex-col text-[8px] text-white/30">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-1 border-b border-white/10 flex items-end justify-center pb-1">
                      {i * 100}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">About Me</h2>
              <h3 className="text-4xl font-black mb-6">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <p className="text-lg text-white/60 leading-relaxed mb-8">
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
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link, i) => {
                    const Icon = getSocialIcon(link.platform);
                    const colors = [adobeColors.illustrator, adobeColors.photoshop, adobeColors.indesign, adobeColors.xd];
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: colors[i % colors.length] }}
                        whileHover={{ y: -5 }}
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

      {/* Skills Section - Tools Palette */}
      {skills.length > 0 && (
        <section id="skills" className="py-32 px-6 bg-[#16162a]">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Expertise</h2>
              <h3 className="text-4xl font-black">Creative Tools</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills], index) => {
                const colors = [adobeColors.illustrator, adobeColors.photoshop, adobeColors.indesign, adobeColors.xd, adobeColors.figma];
                const color = colors[index % colors.length];
                return (
                  <motion.div 
                    key={category}
                    className="bg-[#2d2d44] rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-2" style={{ backgroundColor: color }} />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Palette className="w-5 h-5" style={{ color }} />
                        </div>
                        <h4 className="font-bold">{category}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge 
                            key={skill.id} 
                            variant="secondary" 
                            className="rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
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
        <section className="py-32 px-6">
          <div className="container mx-auto max-w-4xl">
            {education.length > 0 && (
              <div className="mb-20">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#31A8FF] mb-4">Background</h2>
                  <h3 className="text-4xl font-black">Education</h3>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-6">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="bg-[#2d2d44] rounded-2xl p-6 hover:shadow-lg hover:shadow-[#31A8FF]/10 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#31A8FF]/20 flex items-center justify-center mb-4">
                        <GraduationCap className="w-7 h-7 text-[#31A8FF]" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">{edu.degree}</h4>
                      <p className="text-[#31A8FF]">{edu.institution}</p>
                      {edu.field_of_study && <p className="text-sm text-white/40 mt-1">{edu.field_of_study}</p>}
                      <p className="text-xs text-white/30 mt-3">
                        {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <div>
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Career</h2>
                  <h3 className="text-4xl font-black">Experience</h3>
                </motion.div>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="flex gap-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="hidden md:flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9A00] to-[#FF3366] flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 w-0.5 bg-gradient-to-b from-[#FF3366] to-transparent mt-4" />
                      </div>
                      <div className="flex-1 bg-[#2d2d44] rounded-2xl p-6">
                        <h4 className="text-xl font-bold">{exp.position}</h4>
                        <p className="text-[#FF9A00] font-medium">{exp.company}</p>
                        <p className="text-sm text-white/40 mt-1">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                        {exp.description && <p className="text-white/60 mt-3">{exp.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Portfolio Section - Gallery Grid */}
      {projects.length > 0 && (
        <section id="works" className="py-32 px-6 bg-[#16162a]">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF9A00] mb-4">Portfolio</h2>
              <h3 className="text-4xl font-black">Selected Work</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project, index) => (
                <motion.div 
                  key={project.id}
                  className={`group ${index === 0 ? 'md:col-span-2' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-[#2d2d44] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <div className={`relative ${index === 0 ? 'aspect-[21/9]' : 'aspect-video'} bg-gradient-to-br from-[#FF9A00]/10 to-[#A259FF]/10 overflow-hidden`}>
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette className="w-16 h-16 text-white/10" />
                        </div>
                      )}
                      {project.featured && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[#FF9A00] to-[#FF3366] text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                      {project.description && (
                        <p className="text-white/60 mb-4 line-clamp-2">{project.description}</p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack.map((tech) => (
                            <Badge key={tech} variant="outline" className="rounded-full border-white/20 text-white/60">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.live_url && (
                          <Button 
                            size="sm" 
                            className="rounded-full bg-gradient-to-r from-[#FF9A00] to-[#FF3366]"
                            asChild
                          >
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />View Project
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button size="sm" variant="outline" className="rounded-full border-white/20" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section id="contact" className="py-32 px-6 bg-gradient-to-br from-[#FF9A00] via-[#FF3366] to-[#A259FF]">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Hexagon className="w-16 h-16 mx-auto mb-6 text-white/30" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Let's Create Magic
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Have a project in mind? Let's collaborate and bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button size="lg" variant="secondary" className="rounded-full font-bold" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-full font-bold bg-transparent border-white text-white hover:bg-white hover:text-[#FF3366]" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#1a1a2e] border-t border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9A00] to-[#FF3366] flex items-center justify-center">
              <span className="font-bold text-xs">Ds</span>
            </div>
            <span className="font-bold">{profile?.display_name || "Designer"}</span>
          </div>
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 4).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
