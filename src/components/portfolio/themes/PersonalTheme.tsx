import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, Star, Feather
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-violet-50 text-slate-800 overflow-hidden">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 360], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          >
            {i % 3 === 0 && <Star className="w-full h-full text-amber-400/40" />}
            {i % 3 === 1 && <Heart className="w-full h-full text-rose-400/40" />}
            {i % 3 === 2 && <Sparkles className="w-full h-full text-violet-400/40" />}
          </motion.div>
        ))}
      </div>

      {/* Cursor Follower */}
      <motion.div 
        className="fixed w-80 h-80 rounded-full pointer-events-none z-0 hidden md:block"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
          transform: `translate(${mousePos.x - 160}px, ${mousePos.y - 160}px)`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-amber-50/95 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-amber-50/95 backdrop-blur-sm border-t border-amber-100 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Works", "Connect"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "connect" ? "contact" : item.toLowerCase())} className="block w-full text-left py-3 text-slate-600 font-light">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center pt-16 relative">
        <div className="absolute top-1/4 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-rose-200/30 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-8 bg-amber-100 text-amber-700 border-amber-200 rounded-full px-6 py-2">
              <Sparkles className="w-3 h-3 mr-2" />
              Welcome to my world
            </Badge>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 border-4 border-white shadow-2xl ring-4 ring-amber-200/50">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-4xl sm:text-5xl bg-gradient-to-br from-amber-200 to-rose-200 text-amber-700 font-serif">
                {profile?.display_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-slate-800"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {profile?.display_name || "Hello, I'm Here"}
          </motion.h1>

          {portfolio?.headline && (
            <motion.p 
              className="text-lg sm:text-xl text-slate-500 font-light mb-8 max-w-2xl mx-auto italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              "{portfolio.headline}"
            </motion.p>
          )}

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-10"
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
            <Button size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/20 px-8" onClick={() => scrollTo('bio')}>
              <BookOpen className="w-4 h-4 mr-2" />
              Read My Story
            </Button>
            {profile?.email && (
              <Button size="lg" variant="outline" className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-100 px-8" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Say Hello
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <motion.div 
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-rose-200 rounded-3xl rotate-3" />
              <Avatar className="relative w-full aspect-square max-w-sm mx-auto rounded-3xl shadow-2xl border-0 rotate-[-1deg]">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-3xl object-cover" />
                <AvatarFallback className="text-6xl sm:text-8xl bg-gradient-to-br from-amber-100 to-rose-100 text-amber-600 rounded-3xl font-serif">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Content */}
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-4">About Me</h2>
              <h3 className="text-3xl sm:text-4xl font-serif mb-6 text-slate-800">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-100 mb-8">
                  <Quote className="w-6 sm:w-8 h-6 sm:h-8 text-amber-300 mb-4" />
                  <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed italic">
                    {portfolio.bio}
                  </p>
                </div>
              )}

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
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-300 transition-all shadow-sm"
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-medium uppercase tracking-widest text-rose-500 mb-4">Expertise</h2>
              <h3 className="text-3xl sm:text-4xl font-serif mb-12 text-slate-800">What I Do</h3>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Badge variant="outline" className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-light rounded-full bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all shadow-sm">
                    {skill.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <>
          {education.length > 0 && (
            <section id="education" className="py-24 sm:py-32 px-4 sm:px-6 bg-white/50">
              <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-medium uppercase tracking-widest text-violet-500 mb-4">Background</h2>
                  <h3 className="text-3xl sm:text-4xl font-serif text-slate-800">Education</h3>
                </motion.div>
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
                        <GraduationCap className="w-6 sm:w-7 h-6 sm:h-7 text-violet-500" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-semibold font-serif mb-2 text-slate-800">{edu.degree}</h4>
                      <p className="text-violet-600">{edu.institution}</p>
                      {edu.field_of_study && <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>}
                      <p className="text-xs text-slate-400 mt-3">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="py-24 sm:py-32 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-4">Journey</h2>
                  <h3 className="text-3xl sm:text-4xl font-serif text-slate-800">Career Path</h3>
                </motion.div>
                <div className="space-y-6 sm:space-y-8">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="relative"
                      initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex gap-4 sm:gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            <Briefcase className="w-4 sm:w-5 h-4 sm:h-5" />
                          </div>
                          {i < experiences.length - 1 && (
                            <div className="flex-1 w-0.5 bg-gradient-to-b from-amber-300 to-rose-300 mt-4" />
                          )}
                        </div>
                        <div className="flex-1 pb-6 sm:pb-8">
                          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100">
                            <h4 className="text-lg sm:text-xl font-semibold font-serif text-slate-800">{exp.position}</h4>
                            <p className="text-amber-600">{exp.company}</p>
                            <p className="text-xs text-slate-400 mt-2">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                            {exp.description && <p className="text-slate-500 mt-4 text-sm">{exp.description}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Works Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-medium uppercase tracking-widest text-rose-500 mb-4">Portfolio</h2>
              <h3 className="text-3xl sm:text-4xl font-serif text-slate-800">My Work</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-rose-300" />
                      </div>
                    )}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-black/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:scale-110 transition-transform">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </motion.div>
                    {project.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 border-0">Featured</Badge>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <h4 className="font-semibold text-lg font-serif mb-2 text-slate-800">{project.title}</h4>
                    {project.description && <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>}
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
            <h2 className="text-sm font-medium uppercase tracking-widest text-amber-600 mb-4">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 text-slate-800">Let's Connect</h3>
            <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-xl mx-auto">
              I'd love to hear from you. Whether you have a question or just want to say hi, feel free to reach out.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-lg shadow-amber-500/20 px-8" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Say Hello
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-100 px-8" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Me
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
              {portfolio?.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {portfolio.location}
                </span>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-white/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Feather className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-500 font-serif italic">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
