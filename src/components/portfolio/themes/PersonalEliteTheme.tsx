import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, Star, Feather, Flower2,
  ArrowRight, Play, Pause, ChevronDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Cinematic Film Grain Effect
const FilmGrain = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Parallax Image Component
const ParallaxImage = ({ src, alt, depth = 0.1 }: { src: string; alt: string; depth?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [-100 * depth, 100 * depth]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
};

// Animated Counter
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// Luxury Card Component
const LuxuryCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative ${className}`}
    >
      <div className="absolute -inset-px bg-gradient-to-br from-amber-200/50 via-rose-200/30 to-purple-200/50 rounded-3xl blur-sm" />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

// Magnetic Button
const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Section Transition
const SectionTransition = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="py-20 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      {subtitle && (
        <span className="text-sm tracking-[0.3em] uppercase text-rose-400">{subtitle}</span>
      )}
      <h2 className="text-4xl md:text-6xl font-serif text-slate-800">{title}</h2>
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
        <Flower2 className="w-6 h-6 text-rose-300" />
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
      </div>
    </motion.div>
  </div>
);

// Floating Elements
const FloatingElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      >
        {i % 3 === 0 && <Sparkles className="w-4 h-4 text-amber-300" />}
        {i % 3 === 1 && <Heart className="w-3 h-3 text-rose-300" />}
        {i % 3 === 2 && <Star className="w-3 h-3 text-purple-300" />}
      </motion.div>
    ))}
  </div>
);

export default function PersonalEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setActiveSection(id);
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-slate-800 overflow-hidden">
      <FilmGrain />
      <FloatingElements />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 via-amber-400 to-purple-400 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Luxury Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-rose-100/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 via-amber-400 to-purple-400 flex items-center justify-center shadow-lg">
                  <Feather className="w-6 h-6 text-white" />
                </div>
              )}
              <span className="font-serif text-2xl text-slate-700">{profile?.display_name || "Portfolio"}</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-10">
              {[
                { id: "hero", label: "Home" },
                { id: "story", label: "Story" },
                { id: "expertise", label: "Expertise" },
                { id: "gallery", label: "Gallery" },
                { id: "contact", label: "Contact" },
              ].map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative text-sm tracking-wide transition-colors ${
                    activeSection === item.id ? "text-rose-500" : "text-slate-500 hover:text-slate-800"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-400"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-rose-100/50 px-6 py-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["hero", "story", "expertise", "gallery", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className="block w-full text-left py-4 text-lg text-slate-600 capitalize border-b border-rose-50 last:border-0"
                >
                  {item === "hero" ? "Home" : item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Cinematic */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-rose-200/60 via-amber-100/40 to-transparent blur-3xl"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-200/50 via-pink-100/30 to-transparent blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, -10, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              className="order-2 lg:order-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Badge className="mb-8 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 border-0 rounded-full px-6 py-2 shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Welcome to My World
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <span className="block text-slate-300 text-2xl md:text-3xl font-light mb-4 tracking-wider">Hello, I'm</span>
                <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-purple-500 bg-clip-text text-transparent">
                  {profile?.display_name || "Creative Soul"}
                </span>
              </motion.h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-xl md:text-2xl text-slate-500 font-light mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  "{portfolio.headline}"
                </motion.p>
              )}

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 mb-10 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <div className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-slate-800">
                    <AnimatedNumber value={experiences.length} suffix="+" />
                  </div>
                  <div className="text-sm text-slate-400">Years Exp</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-slate-800">
                    <AnimatedNumber value={projects.length} suffix="+" />
                  </div>
                  <div className="text-sm text-slate-400">Projects</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-slate-800">
                    <AnimatedNumber value={skills.length} suffix="+" />
                  </div>
                  <div className="text-sm text-slate-400">Skills</div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <MagneticButton
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 text-white rounded-full shadow-lg shadow-rose-300/30 flex items-center gap-2"
                  onClick={() => scrollTo('story')}
                >
                  <BookOpen className="w-5 h-5" />
                  Explore My Story
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
                <MagneticButton
                  className="px-8 py-4 border-2 border-rose-200 text-rose-600 rounded-full flex items-center gap-2 hover:bg-rose-50"
                  onClick={() => scrollTo('contact')}
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative max-w-md mx-auto">
                {/* Decorative Frame */}
                <motion.div
                  className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-rose-200 via-amber-100 to-purple-200"
                  animate={{ rotate: [3, 5, 3] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-4 rounded-[2.5rem] bg-white shadow-xl"
                  animate={{ rotate: [-2, -3, -2] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />

                {/* Main Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4]">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-8xl bg-gradient-to-br from-rose-200 via-amber-100 to-purple-200 text-rose-600 rounded-none font-serif">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating Decorations */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-rose-400 to-amber-400 rounded-2xl shadow-lg flex items-center justify-center"
                  animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Heart className="w-8 h-8 text-white" fill="currentColor" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl shadow-lg flex items-center justify-center"
                  animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-rose-400" />
        </motion.div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 px-6 relative">
        <SectionTransition title="My Story" subtitle="About Me" />

        <div className="max-w-5xl mx-auto">
          {portfolio?.bio && (
            <LuxuryCard className="mb-12">
              <div className="p-10 md:p-16">
                <div className="flex items-start gap-6 mb-8">
                  <Quote className="w-12 h-12 text-rose-200 flex-shrink-0" />
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-rose-400 first-letter:float-left first-letter:mr-4">
                    {portfolio.bio}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid sm:grid-cols-3 gap-6 mt-10 pt-10 border-t border-rose-100">
                  {portfolio?.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Location</div>
                        <div className="text-slate-700">{portfolio.location}</div>
                      </div>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Email</div>
                        <div className="text-slate-700 truncate">{profile.email}</div>
                      </div>
                    </div>
                  )}
                  {portfolio?.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Phone</div>
                        <div className="text-slate-700">{portfolio.phone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </LuxuryCard>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-xl transition-all border border-rose-100/50"
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Expertise Section */}
      {(skills.length > 0 || experiences.length > 0 || education.length > 0) && (
        <section id="expertise" className="py-24 px-6 bg-gradient-to-b from-white via-rose-50/30 to-white">
          <SectionTransition title="My Expertise" subtitle="Skills & Experience" />

          <div className="max-w-6xl mx-auto">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {Object.entries(groupedSkills).map(([category, categorySkills], catIdx) => (
                  <LuxuryCard key={category} delay={catIdx * 0.1}>
                    <div className="p-8">
                      <h4 className="text-lg font-serif text-slate-700 mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="border-rose-200 text-slate-600 hover:bg-rose-50 transition-colors"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            )}

            {/* Experience & Education */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif text-slate-700 mb-8 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-rose-500" />
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <LuxuryCard key={exp.id} delay={i * 0.1}>
                        <div className="p-6">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <h4 className="font-medium text-slate-800">{exp.position}</h4>
                              <p className="text-rose-500">{exp.company}</p>
                            </div>
                            <Badge variant="outline" className="text-xs border-amber-200 text-amber-600 flex-shrink-0">
                              {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                            </Badge>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </LuxuryCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif text-slate-700 mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-amber-500" />
                    Education
                  </h3>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <LuxuryCard key={edu.id} delay={i * 0.1}>
                        <div className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-medium text-slate-800">{edu.degree}</h4>
                              <p className="text-amber-500">{edu.institution}</p>
                              {edu.field_of_study && (
                                <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs border-amber-200 text-amber-600 flex-shrink-0">
                              {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                            </Badge>
                          </div>
                        </div>
                      </LuxuryCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {allProjects.length > 0 && (
        <section id="gallery" className="py-24 px-6">
          <SectionTransition title="My Gallery" subtitle="Selected Works" />

          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
                    <div className="aspect-[4/3] overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-rose-300" />
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <h4 className="text-white text-xl font-serif mb-2">{project.title}</h4>
                      {project.description && (
                        <p className="text-white/70 text-sm line-clamp-2">{project.description}</p>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-white text-sm hover:text-rose-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </a>
                      )}
                    </motion.div>

                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-white to-rose-50">
        <SectionTransition title="Let's Connect" subtitle="Get in Touch" />

        <div className="max-w-2xl mx-auto">
          <LuxuryCard>
            <div className="p-10 md:p-16 text-center">
              <p className="text-slate-600 mb-8 text-lg">
                I'd love to hear from you. Whether you have a question, a project idea, or just want to say hello!
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {profile?.email && (
                  <MagneticButton
                    className="px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full shadow-lg flex items-center gap-2"
                  >
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      {profile.email}
                    </a>
                  </MagneticButton>
                )}
                {portfolio?.phone && (
                  <MagneticButton
                    className="px-8 py-4 border-2 border-rose-200 text-rose-600 rounded-full flex items-center gap-2"
                  >
                    <a href={`tel:${portfolio.phone}`} className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      {portfolio.phone}
                    </a>
                  </MagneticButton>
                )}
              </div>

              {userId && <ContactForm portfolioOwnerId={userId} />}
            </div>
          </LuxuryCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gradient-to-b from-rose-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
                <Feather className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="font-serif text-xl text-slate-600">{profile?.display_name}</span>
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
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {profile?.display_name}. Crafted with <Heart className="w-3 h-3 inline text-rose-400" fill="currentColor" /> All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
