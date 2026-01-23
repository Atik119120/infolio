import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, User, Star, Feather
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-violet-50 text-slate-800 overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {i % 3 === 0 && <Star className="w-full h-full text-amber-400/40" />}
            {i % 3 === 1 && <Heart className="w-full h-full text-rose-400/40" />}
            {i % 3 === 2 && <Sparkles className="w-full h-full text-violet-400/40" />}
          </motion.div>
        ))}
      </div>

      {/* Gradient Cursor Follower */}
      <motion.div 
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
          transform: `translate(${mousePos.x - 192}px, ${mousePos.y - 192}px)`,
        }}
      />

      {/* Navigation - Elegant Serif */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-amber-50/95 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Feather className="w-5 h-5 text-amber-600" />
            <span className="font-serif text-xl italic text-slate-700">{profile?.display_name || "My Story"}</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Home", "About", "Skills", "Works", "Connect"].map((item, i) => (
              <motion.button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "connect" ? "contact" : item.toLowerCase())} 
                className="text-sm text-slate-500 hover:text-amber-600 transition-colors font-light"
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
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-600">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-amber-50/95 backdrop-blur-sm border-t border-amber-100 px-6 py-4 space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Works", "Connect"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "connect" ? "contact" : item.toLowerCase())} 
                  className="block w-full text-left py-2 text-slate-600 font-light"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Warm & Personal */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative">
        {/* Organic Shapes */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-8 bg-amber-100 text-amber-700 border-amber-200 rounded-full px-6 py-2">
                <Sparkles className="w-3 h-3 mr-2" />
                Welcome to my world
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Avatar className="w-40 h-40 mx-auto mb-8 border-4 border-white shadow-2xl ring-4 ring-amber-200/50">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-5xl bg-gradient-to-br from-amber-200 to-rose-200 text-amber-700 font-serif">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 text-slate-800"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {profile?.display_name || "Hello, I'm Here"}
            </motion.h1>

            {portfolio?.headline && (
              <motion.p 
                className="text-xl md:text-2xl text-slate-500 font-light mb-8 max-w-2xl mx-auto italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                "{portfolio.headline}"
              </motion.p>
            )}

            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {portfolio?.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {portfolio.location}
                </span>
              )}
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button 
                size="lg" 
                className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/20 px-8"
                onClick={() => scrollTo('bio')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read My Story
              </Button>
              {profile?.email && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-100 px-8"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Say Hello
                  </a>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section - Story Format */}
      <section id="bio" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Photo */}
            <motion.div 
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-rose-200 rounded-3xl rotate-3" />
              <Avatar className="relative w-full aspect-square max-w-md mx-auto rounded-3xl shadow-2xl border-0 rotate-[-1deg]">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-3xl object-cover" />
                <AvatarFallback className="text-8xl bg-gradient-to-br from-amber-100 to-rose-100 text-amber-600 rounded-3xl font-serif">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Bio Content */}
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-4">About Me</h2>
              <h3 className="text-4xl font-serif mb-6 text-slate-800">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-amber-100 mb-8">
                  <Quote className="w-8 h-8 text-amber-300 mb-4" />
                  <p className="text-lg text-slate-600 font-light leading-relaxed italic">
                    {portfolio.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-300 transition-all shadow-sm"
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section - Soft Badges */}
      {skills.length > 0 && (
        <section id="skills" className="py-32 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-rose-500 mb-4">Expertise</h2>
              <h3 className="text-4xl font-serif mb-12 text-slate-800">What I Do</h3>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Badge 
                    variant="outline" 
                    className="px-5 py-2.5 text-sm font-light rounded-full bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all cursor-default shadow-sm"
                  >
                    {skill.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section id="education" className="py-32 px-6 bg-white/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-violet-500 mb-4">Background</h2>
              <h3 className="text-4xl font-serif text-slate-800">Education</h3>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu, i) => (
                <motion.div 
                  key={edu.id}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-7 h-7 text-violet-500" />
                  </div>
                  <h4 className="text-xl font-semibold font-serif mb-2 text-slate-800">{edu.degree}</h4>
                  <p className="text-violet-600">{edu.institution}</p>
                  {edu.field_of_study && <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>}
                  <p className="text-xs text-slate-400 mt-3">
                    {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section - Timeline */}
      {experiences.length > 0 && (
        <section className="py-32 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-4">Journey</h2>
              <h3 className="text-4xl font-serif text-slate-800">Career Path</h3>
            </motion.div>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  className="relative"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-lg">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      {index < experiences.length - 1 && (
                        <div className="flex-1 w-0.5 bg-gradient-to-b from-amber-300 to-rose-300 mt-4" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h4 className="text-xl font-semibold font-serif text-slate-800">{exp.position}</h4>
                        <p className="text-amber-600">{exp.company}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                        {exp.description && <p className="text-slate-500 mt-3 font-light">{exp.description}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works/Projects Section */}
      {projects.length > 0 && (
        <section id="works" className="py-32 px-6 bg-white/50">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-rose-500 mb-4">Portfolio</h2>
              <h3 className="text-4xl font-serif text-slate-800">My Works</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-50 to-rose-50 overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-rose-200" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-serif mb-2 text-slate-800">{project.title}</h4>
                    {project.description && (
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2 font-light">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs font-light bg-amber-50 text-amber-700">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.live_url && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-50"
                          asChild
                        >
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-full text-slate-400 hover:text-slate-600"
                          asChild
                        >
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3 h-3" />
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
      <section id="contact" className="py-32 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-400/30">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-serif mb-6 text-slate-800">Let's Connect</h2>
            <p className="text-slate-500 font-light mb-8 text-lg">
              I'd love to hear from you. Whether it's a question, a collaboration, or just to say hello.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/20 px-8"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Say Hello
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-100 px-8"
                  asChild
                >
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-12">
                <p className="text-sm text-slate-400 mb-4">Find me on</p>
                <div className="flex justify-center gap-4">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-amber-600 transition-all shadow-md hover:shadow-lg border border-slate-100"
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-amber-100">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="font-serif italic text-slate-600">{profile?.display_name || "Portfolio"}</span>
          </div>
          <p className="text-sm text-slate-400">
            Made with love © {new Date().getFullYear()}
          </p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 4).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-amber-500 transition-colors">
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
