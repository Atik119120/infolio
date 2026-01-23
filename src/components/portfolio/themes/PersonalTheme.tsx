import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, Star, Feather, Flower2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// Scroll Animation Wrapper
const ScrollReveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function PersonalTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 text-slate-800 overflow-hidden">
      {/* Floating Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              left: `${5 + i * 12}%`, 
              top: `${10 + (i % 4) * 20}%` 
            }}
            animate={{ 
              y: [0, -30, 0], 
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ 
              duration: 6 + i, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {i % 4 === 0 && <Star className="w-4 h-4 text-yellow-400/40" />}
            {i % 4 === 1 && <Heart className="w-4 h-4 text-rose-400/40" />}
            {i % 4 === 2 && <Sparkles className="w-4 h-4 text-purple-400/40" />}
            {i % 4 === 3 && <Flower2 className="w-4 h-4 text-pink-400/40" />}
          </motion.div>
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-rose-200/50 to-pink-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/50 to-violet-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-yellow-200/30 to-orange-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-rose-300/30">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl italic text-slate-700">{profile?.display_name || "My Story"}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Works", "Connect"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "connect" ? "contact" : item.toLowerCase())} 
                  className="text-sm text-slate-500 hover:text-rose-500 transition-colors font-light"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
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
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-rose-100 px-6 py-4"
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
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        id="hero" 
        className="min-h-screen flex items-center pt-16 relative z-10"
        style={{ y: heroY }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
            style={{ opacity: heroOpacity }}
          >
            <Badge className="mb-8 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 border-rose-200 rounded-full px-6 py-2 shadow-sm">
              <Sparkles className="w-3 h-3 mr-2" />
              Welcome to my world
            </Badge>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 rounded-full blur-xl opacity-50" />
              <Avatar className="relative w-36 h-36 sm:w-44 sm:h-44 border-4 border-white shadow-2xl ring-4 ring-rose-200/50">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-4xl sm:text-5xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 text-white font-serif">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {profile?.display_name || "Hello, I'm Here"}
            </span>
          </motion.h1>

          {portfolio?.headline && (
            <motion.p 
              className="text-lg sm:text-xl text-slate-500 font-light mb-8 max-w-2xl mx-auto italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              "{portfolio.headline}"
            </motion.p>
          )}

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {portfolio?.location && (
              <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-rose-100">
                <MapPin className="w-4 h-4 text-rose-500" />
                {portfolio.location}
              </span>
            )}
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 shadow-lg shadow-rose-300/30 px-8"
              onClick={() => scrollTo('bio')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Read My Story
            </Button>
            {profile?.email && (
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 px-8" 
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
      </motion.section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <ScrollReveal direction="left">
              <div className="relative mx-auto lg:mx-0 max-w-md">
                <div className="absolute -inset-6 bg-gradient-to-br from-rose-200 via-pink-200 to-purple-200 rounded-3xl rotate-3 opacity-70" />
                <div className="absolute -inset-6 bg-gradient-to-tl from-yellow-100 to-orange-100 rounded-3xl -rotate-3 opacity-50" />
                <Avatar className="relative w-full aspect-square rounded-3xl shadow-2xl border-0 rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                  <AvatarImage src={profile?.avatar_url || undefined} className="rounded-3xl object-cover" />
                  <AvatarFallback className="text-6xl sm:text-8xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 text-white rounded-3xl font-serif">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-xs tracking-widest uppercase text-rose-600">About Me</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-serif">
                  <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {profile?.display_name}
                  </span>
                </h2>
                
                {portfolio?.bio && (
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-rose-100">
                    <Quote className="w-8 h-8 text-rose-300 mb-4" />
                    <p className="text-lg text-slate-600 font-light leading-relaxed italic">
                      {portfolio.bio}
                    </p>
                  </div>
                )}

                {socialLinks.length > 0 && (
                  <div className="flex gap-3 pt-4">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-200/50 transition-all"
                          whileHover={{ scale: 1.1, y: -3 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-violet-100 border border-purple-200 mb-4">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs tracking-widest uppercase text-purple-600">Expertise</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif mb-12">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  What I Do
                </span>
              </h2>
            </ScrollReveal>
            
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.id} delay={i * 0.03}>
                  <motion.div whileHover={{ scale: 1.05, y: -3 }}>
                    <Badge 
                      variant="outline" 
                      className="px-5 py-2.5 text-sm font-light rounded-full bg-white/80 border-rose-200 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-sm"
                    >
                      {skill.name}
                    </Badge>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <>
          {education.length > 0 && (
            <section id="education" className="py-24 sm:py-32 px-4 sm:px-6 bg-white/50 relative z-10">
              <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 mb-4">
                      <GraduationCap className="w-4 h-4 text-violet-500" />
                      <span className="text-xs tracking-widest uppercase text-violet-600">Background</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-slate-800">Education</h2>
                  </div>
                </ScrollReveal>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {education.map((edu, i) => (
                    <ScrollReveal key={edu.id} delay={i * 0.1}>
                      <motion.div 
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-violet-100 text-center hover:shadow-xl hover:border-violet-200 transition-all"
                        whileHover={{ y: -5 }}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-300/30">
                          <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold font-serif mb-2 text-slate-800">{edu.degree}</h4>
                        <p className="text-violet-600 font-medium">{edu.institution}</p>
                        {edu.field_of_study && <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>}
                        <p className="text-xs text-slate-400 mt-3">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                      </motion.div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 mb-4">
                      <Briefcase className="w-4 h-4 text-rose-500" />
                      <span className="text-xs tracking-widest uppercase text-rose-600">Journey</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif text-slate-800">Career Path</h2>
                  </div>
                </ScrollReveal>
                
                <div className="space-y-8">
                  {experiences.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="relative flex gap-6">
                        <div className="flex flex-col items-center">
                          <motion.div 
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-rose-300/30 flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Briefcase className="w-5 h-5" />
                          </motion.div>
                          {i < experiences.length - 1 && (
                            <div className="flex-1 w-0.5 bg-gradient-to-b from-rose-300 to-purple-300 mt-4" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-rose-100 hover:shadow-xl hover:border-rose-200 transition-all">
                            <h4 className="text-xl font-semibold font-serif text-slate-800">{exp.position}</h4>
                            <p className="text-rose-500 font-medium">{exp.company}</p>
                            <p className="text-xs text-slate-400 mt-2">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                            {exp.description && <p className="text-slate-500 mt-4 text-sm leading-relaxed">{exp.description}</p>}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Works Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6 bg-white/50 relative z-10">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 mb-4">
                  <Star className="w-4 h-4 text-pink-500" />
                  <span className="text-xs tracking-widest uppercase text-pink-600">Portfolio</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif">
                  <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                    My Work
                  </span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <motion.div 
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-rose-100 hover:border-rose-200"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    whileHover={{ y: -8 }}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 flex items-center justify-center">
                          <Heart className="w-12 h-12 text-rose-300" />
                        </div>
                      )}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                      >
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white hover:scale-110 transition-transform shadow-lg">
                            <ExternalLink className="w-6 h-6" />
                          </a>
                        )}
                      </motion.div>
                      {project.featured && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 border-0 shadow-lg">Featured</Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-lg font-serif mb-2 text-slate-800">{project.title}</h4>
                      {project.description && <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 mb-6">
              <Mail className="w-4 h-4 text-rose-500" />
              <span className="text-xs tracking-widest uppercase text-rose-600">Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6">
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Let's Connect
              </span>
            </h2>
            <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
              I'd love to hear from you. Whether you have a question or just want to say hi, feel free to reach out.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 shadow-lg shadow-rose-300/30 px-8" 
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
                  className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 px-8" 
                  asChild
                >
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
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {portfolio.location}
                </span>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-rose-500 transition-colors">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-white/50 border-t border-rose-100 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-rose-300/20">
              <Feather className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-slate-500 font-serif italic">{profile?.display_name}</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
