import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Award, Zap,
  Briefcase, GraduationCap, Menu, X, CheckCircle, ArrowRight, Shield, Star,
  Target, TrendingUp, Users, Clock, ChevronRight, Building, FileText, Send,
  Globe, Linkedin, ArrowUpRight, Play, Pause
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Subtle Grid Pattern
const LuxuryGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:100px_100px]" />
  </div>
);

// Animated Line
const AnimatedLine = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  return (
    <motion.div 
      className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 z-50"
      style={{ width }}
    />
  );
};

// Counter Component
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (v) => setDisplay(Math.round(v)));
  }, [springValue]);

  return <span ref={ref}>{display}{suffix}</span>;
};

// Magnetic Effect Hook
const useMagnetic = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { x, y, handleMouseMove, handleMouseLeave };
};

// Feature Card
const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any; title: string; description: string; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-3xl p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-white/10 flex items-center justify-center mb-6 transition-colors duration-500">
          <Icon className="w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-white mb-3 transition-colors duration-500">{title}</h3>
        <p className="text-slate-500 group-hover:text-white/70 transition-colors duration-500">{description}</p>
      </div>
    </motion.div>
  );
};

// Project Card
const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-slate-100 aspect-[4/3]">
        {project.image_url ? (
          <motion.img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
            <Award className="w-16 h-16 text-slate-400" />
          </div>
        )}
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-white text-2xl font-semibold mb-2">{project.title}</h4>
          {project.description && (
            <p className="text-white/70 mb-4 line-clamp-2">{project.description}</p>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-medium hover:underline"
            >
              View Project <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </motion.div>

        {project.featured && (
          <Badge className="absolute top-4 left-4 bg-white text-slate-900 border-0 shadow-lg">
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            Featured
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

// Experience Item
const ExperienceItem = ({ exp, index }: { exp: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-8 pb-12 border-l-2 border-slate-200 last:pb-0"
    >
      {/* Dot */}
      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-slate-900 ring-4 ring-white" />
      
      <div className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge className="bg-slate-900 text-white border-0">{exp.company}</Badge>
          <span className="text-sm text-slate-400">
            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
          </span>
        </div>
        <h4 className="text-xl font-semibold text-slate-900 mb-2">{exp.position}</h4>
        {exp.description && (
          <p className="text-slate-500">{exp.description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default function OfficialEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "work", label: "Work" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <LuxuryGrid />
      <AnimatedLine />

      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm py-4" : "bg-transparent py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{profile?.display_name?.[0] || "P"}</span>
                </div>
              )}
            </motion.div>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {profile?.email && (
                <Button className="rounded-full bg-slate-900 hover:bg-slate-800 px-8" asChild>
                  <a href={`mailto:${profile.email}`}>
                    Let's Talk <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
            </motion.div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="px-6 py-8 space-y-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="block text-2xl font-medium text-slate-900 hover:text-slate-600 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        id="hero" 
        className="min-h-screen flex items-center pt-24 relative overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <Badge className="bg-slate-100 text-slate-700 border-0 rounded-full px-6 py-2 text-sm font-medium">
                  Available for Projects
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {profile?.display_name?.split(" ").map((word, i) => (
                  <span key={i} className={i === 0 ? "text-slate-300" : "text-slate-900"}>
                    {word}{" "}
                  </span>
                )) || "Your Name"}
              </motion.h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-xl md:text-2xl text-slate-500 mb-10 max-w-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-slate-900 hover:bg-slate-800 px-10 py-6 text-base"
                  onClick={() => scrollTo("work")}
                >
                  View My Work
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 hover:bg-slate-50 px-10 py-6 text-base"
                  onClick={() => scrollTo("about")}
                >
                  About Me
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">
                    <Counter value={experiences.length} suffix="+" />
                  </div>
                  <div className="text-sm text-slate-500">Years Exp</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">
                    <Counter value={projects.length} suffix="+" />
                  </div>
                  <div className="text-sm text-slate-500">Projects</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">
                    <Counter value={100} suffix="%" />
                  </div>
                  <div className="text-sm text-slate-500">Satisfaction</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Background shapes */}
                <motion.div
                  className="absolute -inset-10 bg-gradient-to-br from-slate-200 to-slate-100 rounded-[4rem]"
                  animate={{ rotate: [0, 2, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-6 bg-white rounded-[3rem] shadow-2xl"
                  animate={{ rotate: [0, -1, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                
                <Avatar className="relative w-full aspect-square max-w-md mx-auto rounded-[2.5rem] ring-8 ring-white shadow-xl">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover rounded-[2.5rem]" />
                  <AvatarFallback className="text-8xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 rounded-[2.5rem]">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-3"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Available Now</span>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 px-6 py-3 bg-white rounded-2xl shadow-xl flex items-center gap-3"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">Trusted by Many</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-20"
          >
            <div>
              <Badge className="mb-6 bg-slate-100 text-slate-700 border-0">About Me</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Turning Ideas Into Reality
              </h2>
              {portfolio?.bio && (
                <p className="text-xl text-slate-500 leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                {portfolio?.location && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3 mt-8">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Experience Timeline */}
            <div>
              <h3 className="text-2xl font-bold mb-8">Experience</h3>
              <div className="space-y-0">
                {experiences.slice(0, 4).map((exp, i) => (
                  <ExperienceItem key={exp.id} exp={exp} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      {skills.length > 0 && (
        <section id="services" className="py-32 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge className="mb-6 bg-slate-900 text-white border-0">Services</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">What I Do</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedSkills).slice(0, 6).map(([category, categorySkills], i) => (
                <FeatureCard
                  key={category}
                  icon={i % 3 === 0 ? Target : i % 3 === 1 ? Zap : TrendingUp}
                  title={category}
                  description={categorySkills.map(s => s.name).slice(0, 4).join(", ")}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-slate-100 text-slate-700 border-0">
                <GraduationCap className="w-3 h-3 mr-2" />
                Education
              </Badge>
              <h2 className="text-4xl font-bold">Academic Background</h2>
            </motion.div>

            <div className="space-y-6">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="text-xl font-semibold">{edu.degree}</h4>
                      <p className="text-slate-500">{edu.institution}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-200">
                      {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                    </Badge>
                  </div>
                  {edu.field_of_study && (
                    <p className="text-slate-400">{edu.field_of_study}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work/Projects Section */}
      {allProjects.length > 0 && (
        <section id="work" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Badge className="mb-6 bg-slate-900 text-white border-0">Portfolio</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">Selected Work</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-white/10 text-white border-0">Contact</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's Create Something Amazing</h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Ready to start your next project? Get in touch and let's make it happen.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-10 py-6" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-5 h-5 mr-2" />
                    {profile.email}
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-full border-white/20 hover:bg-white/10 px-10 py-6" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>

            {/* Social */}
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-slate-900 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-950 text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto opacity-50" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="font-bold">{profile?.display_name?.[0] || "P"}</span>
              </div>
            )}
            <span>{profile?.display_name}</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
