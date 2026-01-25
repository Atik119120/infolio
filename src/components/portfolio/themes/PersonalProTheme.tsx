import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, Star, Feather, Flower2,
  Camera, PenTool, Coffee, Bookmark, ArrowDown, Play
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// Typewriter Effect Component
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, started]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-rose-500 ml-1"
      />
    </span>
  );
};

// Polaroid Card Component
const PolaroidCard = ({ image, caption, rotation }: { image: string; caption: string; rotation: number }) => (
  <motion.div
    className="bg-white p-3 shadow-xl"
    style={{ rotate: rotation }}
    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="aspect-square bg-slate-100 overflow-hidden">
      <img src={image} alt={caption} className="w-full h-full object-cover" />
    </div>
    <p className="text-center text-slate-600 font-handwriting text-sm mt-2 py-2">{caption}</p>
  </motion.div>
);

// Floating Memoir Page
const MemoirPage = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-[#fefcf3] rounded-sm shadow-2xl border border-amber-100/50 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(transparent 47px, #e8dfd0 48px),
          linear-gradient(90deg, transparent 79px, #f0e6d6 80px)
        `,
        backgroundSize: "100% 48px, 80px 100%",
      }}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"0.1\"/%3E%3C/svg%3E')" }} 
      />
      {children}
    </motion.div>
  );
};

// Chapter Divider
const ChapterDivider = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-4 my-16">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
    <div className="text-center">
      <span className="block text-xs text-amber-600 tracking-[0.3em] uppercase mb-1">Chapter {number}</span>
      <span className="font-serif text-2xl text-slate-700">{title}</span>
    </div>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
  </div>
);

// Scroll Progress Bar
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default function PersonalProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f4eb] text-slate-800">
      <ScrollProgress />

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-rose-100/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-amber-100/30 to-transparent" />
      </div>

      {/* Minimal Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-[#f8f4eb]/90 backdrop-blur-md border-b border-amber-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <Feather className="w-6 h-6 text-rose-500" />
              )}
              <span className="font-serif text-xl text-slate-700">{profile?.display_name || "My Memoir"}</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Prologue", "Story", "Works", "Journey", "Connect"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "prologue" ? "hero" : item.toLowerCase() === "story" ? "bio" : item.toLowerCase() === "journey" ? "experience" : item.toLowerCase())}
                  className="text-sm text-slate-500 hover:text-rose-500 transition-colors font-light tracking-wide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-[#f8f4eb]/95 backdrop-blur-md px-6 py-4 border-t border-amber-200/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Prologue", "Story", "Works", "Journey", "Connect"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "prologue" ? "hero" : item.toLowerCase() === "story" ? "bio" : item.toLowerCase() === "journey" ? "experience" : item.toLowerCase())}
                  className="block w-full text-left py-3 text-slate-600"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero - Book Opening */}
      <section id="hero" className="min-h-screen flex items-center pt-16 relative">
        <div className="max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Photo Collage */}
            <motion.div
              className="relative h-[500px] order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Main Photo */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="bg-white p-4 shadow-2xl rotate-2">
                  <Avatar className="w-full aspect-square rounded-none">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-6xl bg-gradient-to-br from-rose-200 to-amber-200 text-rose-600 rounded-none">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-center text-slate-500 text-sm mt-3 font-handwriting">
                    {portfolio?.location || "Somewhere Beautiful"}
                  </p>
                </div>
              </motion.div>

              {/* Decorative polaroids */}
              <motion.div
                className="absolute top-10 left-10 w-32"
                initial={{ opacity: 0, rotate: -15 }}
                animate={{ opacity: 0.6, rotate: -12 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white p-2 shadow-lg">
                  <div className="aspect-square bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                    <Coffee className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-20 right-10 w-28"
                initial={{ opacity: 0, rotate: 15 }}
                animate={{ opacity: 0.6, rotate: 8 }}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-white p-2 shadow-lg">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Bookmark className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Intro Text */}
            <motion.div
              className="order-1 lg:order-2 text-center lg:text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <Badge className="bg-rose-100 text-rose-600 border-rose-200 rounded-full px-4 py-1.5">
                  <BookOpen className="w-3 h-3 mr-2" />
                  A Personal Story
                </Badge>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                <span className="block text-slate-400 text-2xl font-light mb-2">Hello, I'm</span>
                <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                  {profile?.display_name || "Creative Soul"}
                </span>
              </h1>

              {portfolio?.headline && (
                <motion.div
                  className="relative mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Quote className="absolute -left-8 -top-4 w-6 h-6 text-rose-200" />
                  <p className="text-xl text-slate-600 font-serif italic leading-relaxed max-w-lg">
                    {portfolio.headline}
                  </p>
                </motion.div>
              )}

              <motion.div
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg px-8"
                  onClick={() => scrollTo('bio')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read My Story
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 px-8"
                  onClick={() => scrollTo('connect')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
              </motion.div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <motion.div
                  className="flex gap-3 mt-8 justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 text-rose-400" />
            <span className="text-xs text-slate-400 mt-2 tracking-widest">SCROLL</span>
          </motion.div>
        </div>
      </section>

      {/* Chapter 1: The Story */}
      {portfolio?.bio && (
        <section id="bio" className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <ChapterDivider number="01" title="The Story" />
            
            <MemoirPage>
              <div className="p-10 md:p-16">
                <div className="flex items-start gap-4 mb-8">
                  <span className="text-7xl font-serif text-rose-300 leading-none">"</span>
                  <div>
                    <h2 className="text-3xl font-serif text-slate-700 mb-2">About Me</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full" />
                  </div>
                </div>
                <p className="text-lg text-slate-600 leading-loose font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-rose-500 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                  {portfolio.bio}
                </p>
              </div>
            </MemoirPage>
          </div>
        </section>
      )}

      {/* Chapter 2: Skills */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <ChapterDivider number="02" title="My Craft" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/50 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center group-hover:from-rose-200 group-hover:to-amber-200 transition-colors">
                      <Star className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="font-medium text-slate-700">{skill.name}</span>
                  </div>
                  {skill.category && (
                    <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">
                      {skill.category}
                    </Badge>
                  )}
                  {skill.proficiency && (
                    <div className="mt-4">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chapter 3: Works */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 px-6 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent">
          <div className="max-w-6xl mx-auto">
            <ChapterDivider number="03" title="My Works" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="bg-white p-4 shadow-xl rounded-sm hover:shadow-2xl transition-shadow"
                    style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 2}deg)` }}
                  >
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-amber-100">
                          <Camera className="w-12 h-12 text-rose-300" />
                        </div>
                      )}
                      {project.featured && (
                        <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0">
                          <Star className="w-3 h-3 mr-1" fill="currentColor" />
                          Featured
                        </Badge>
                      )}
                      {project.live_url && (
                        <motion.a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-slate-700" />
                          </div>
                        </motion.a>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="font-serif text-lg text-slate-700">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{project.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chapter 4: Journey */}
      {(experiences.length > 0 || education.length > 0) && (
        <section id="experience" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <ChapterDivider number="04" title="The Journey" />

            <div className="space-y-16">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Briefcase className="w-6 h-6 text-rose-500" />
                    <h3 className="text-2xl font-serif text-slate-700">Experience</h3>
                  </div>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <MemoirPage key={exp.id} delay={i * 0.1}>
                        <div className="p-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <h4 className="text-xl font-serif text-slate-700">{exp.position}</h4>
                              <p className="text-rose-500">{exp.company}</p>
                            </div>
                            <Badge variant="outline" className="w-fit border-amber-200 text-amber-600">
                              {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                            </Badge>
                          </div>
                          {exp.description && (
                            <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </MemoirPage>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <GraduationCap className="w-6 h-6 text-amber-500" />
                    <h3 className="text-2xl font-serif text-slate-700">Education</h3>
                  </div>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <MemoirPage key={edu.id} delay={i * 0.1}>
                        <div className="p-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h4 className="text-xl font-serif text-slate-700">{edu.degree}</h4>
                              <p className="text-amber-600">{edu.institution}</p>
                              {edu.field_of_study && (
                                <p className="text-slate-500 text-sm mt-1">{edu.field_of_study}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="w-fit border-amber-200 text-amber-600">
                              {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                            </Badge>
                          </div>
                        </div>
                      </MemoirPage>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Chapter 5: Connect */}
      <section id="connect" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ChapterDivider number="05" title="Let's Connect" />

          <MemoirPage>
            <div className="p-10 md:p-16 text-center">
              <h2 className="text-3xl font-serif text-slate-700 mb-4">Start a Conversation</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Every great story begins with a simple hello. I'd love to hear from you.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full hover:shadow-lg transition-shadow"
                  >
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </a>
                )}
                {portfolio?.phone && (
                  <a
                    href={`tel:${portfolio.phone}`}
                    className="flex items-center gap-2 px-6 py-3 border border-rose-200 text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {portfolio.phone}
                  </a>
                )}
              </div>

              {userId && <ContactForm portfolioOwnerId={userId} />}
            </div>
          </MemoirPage>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gradient-to-b from-transparent to-rose-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto" />
            ) : (
              <Feather className="w-6 h-6 text-rose-400" />
            )}
            <span className="font-serif text-slate-600">{profile?.display_name}</span>
          </div>
          
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mb-6">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
          
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {profile?.display_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
