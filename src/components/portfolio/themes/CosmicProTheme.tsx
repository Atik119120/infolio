import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Star, Sparkles, Orbit, Moon, Sun,
  Rocket, Atom, Calendar, Building2, GraduationCap, ChevronRight, Menu, X,
  Zap, Globe, ArrowRight, Telescope, Satellite
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Animated Stars Background
const StarsBackground = () => {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

// Nebula Effects
const NebulaEffects = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)",
      }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 20, 0],
      }}
      transition={{ duration: 20, repeat: Infinity }}
    />
    <motion.div
      className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)",
      }}
      animate={{
        scale: [1.2, 1, 1.2],
        rotate: [0, -20, 0],
      }}
      transition={{ duration: 15, repeat: Infinity }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, transparent 60%)",
      }}
      animate={{
        scale: [1, 1.3, 1],
      }}
      transition={{ duration: 10, repeat: Infinity }}
    />
  </div>
);

// Shooting Stars
const ShootingStars = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          top: `${10 + i * 15}%`,
          left: "-5%",
          boxShadow: "0 0 10px 2px rgba(255,255,255,0.8)",
        }}
        animate={{
          x: ["0vw", "120vw"],
          y: ["0vh", "40vh"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5,
          delay: i * 3 + Math.random() * 2,
          repeat: Infinity,
          repeatDelay: 10,
        }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-0.5 bg-gradient-to-r from-white to-transparent" />
      </motion.div>
    ))}
  </div>
);

// Planet Component
const Planet = ({ size, color, orbit, duration, hasRing }: { size: number; color: string; orbit: number; duration: number; hasRing?: boolean }) => (
  <motion.div
    className="absolute left-1/2 top-1/2"
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    style={{
      width: orbit * 2,
      height: orbit * 2,
      marginLeft: -orbit,
      marginTop: -orbit,
    }}
  >
    <div className="absolute inset-0 rounded-full border border-white/10" />
    <div
      className={`absolute rounded-full shadow-lg ${color}`}
      style={{
        width: size,
        height: size,
        top: 0,
        left: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    >
      {hasRing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-amber-200/50 rounded-full"
          style={{ width: size * 2, height: size * 0.5 }}
        />
      )}
    </div>
  </motion.div>
);

// Constellation Card
const ConstellationCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
      <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

// Animated Counter
const CosmicCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
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

// Section Header
const SectionHeader = ({ badge, title }: { badge: string; title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-16"
  >
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
      <Sparkles className="w-4 h-4 text-amber-400" />
      <span className="text-sm text-purple-300 tracking-wide">{badge}</span>
    </div>
    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
      {title}
    </h2>
  </motion.div>
);

export default function CosmicProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
      <StarsBackground />
      <NebulaEffects />
      <ShootingStars />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-slate-950/50 backdrop-blur-xl border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Orbit className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-bold text-lg bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                {profile?.display_name || "Portfolio"}
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Works", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase())}
                  className="text-sm text-purple-200/70 hover:text-white transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase())}
                  className="block w-full text-left py-4 text-purple-200"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center relative pt-20">
        {/* Orbiting Planets - Desktop only */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Planet size={12} color="bg-gradient-to-br from-orange-400 to-red-600" orbit={200} duration={30} />
            <Planet size={8} color="bg-gradient-to-br from-blue-400 to-cyan-500" orbit={280} duration={20} />
            <Planet size={16} color="bg-gradient-to-br from-amber-300 to-yellow-500" orbit={360} duration={45} hasRing />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto mb-10 w-fit"
            >
              <motion.div
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-xl opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <Avatar className="relative w-40 h-40 ring-4 ring-white/20 shadow-2xl">
                <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                <AvatarFallback className="text-5xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {profile?.display_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span className="text-sm tracking-[0.3em] uppercase text-purple-300">Welcome to my universe</span>
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                {profile?.display_name || "Cosmic Creator"}
              </h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-xl md:text-2xl text-purple-200/80 max-w-2xl mx-auto mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}
            </motion.div>

            {/* Contact Pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {portfolio?.location && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">{portfolio.location}</span>
                </div>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">{profile.email}</span>
                </a>
              )}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 shadow-lg shadow-purple-500/25"
                onClick={() => scrollTo("works")}
              >
                <Telescope className="w-4 h-4 mr-2" />
                Explore Works
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8"
                onClick={() => scrollTo("contact")}
              >
                <Satellite className="w-4 h-4 mr-2" />
                Make Contact
              </Button>
            </motion.div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                className="flex justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.1, y: -3 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Rocket className="w-6 h-6 text-amber-400 rotate-180" />
          <span className="text-xs text-purple-300 mt-2 tracking-widest">EXPLORE</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: experiences.length, label: "Years", suffix: "+", icon: Zap },
              { value: projects.length, label: "Projects", suffix: "+", icon: Rocket },
              { value: skills.length, label: "Skills", suffix: "+", icon: Star },
              { value: 100, label: "Passion", suffix: "%", icon: Sparkles },
            ].map((stat, i) => (
              <ConstellationCard key={stat.label} delay={i * 0.1}>
                <div className="p-6 text-center">
                  <stat.icon className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    <CosmicCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-purple-300/70">{stat.label}</div>
                </div>
              </ConstellationCard>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      {portfolio?.bio && (
        <section id="about" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeader badge="About Me" title="My Cosmic Journey" />
            <ConstellationCard>
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-3 mb-8">
                  <Atom className="w-8 h-8 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">The Story</h3>
                </div>
                <p className="text-lg text-purple-100/80 leading-relaxed">
                  {portfolio.bio}
                </p>
              </div>
            </ConstellationCard>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader badge="Expertise" title="Powers & Abilities" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                <ConstellationCard key={category} delay={i * 0.1}>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Orbit className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-semibold text-white">{category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-sm text-purple-100"
                        >
                          {skill.name}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ConstellationCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeader badge="Journey" title="Experience & Education" />

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-purple-400" />
                    Experience
                  </h3>
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <ConstellationCard key={exp.id} delay={i * 0.1}>
                        <div className="p-6">
                          <Badge className="mb-3 bg-purple-500/20 text-purple-300 border-purple-400/30">
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </Badge>
                          <h4 className="text-lg font-semibold text-white mb-1">{exp.position}</h4>
                          <p className="text-purple-300 mb-3">{exp.company}</p>
                          {exp.description && (
                            <p className="text-purple-100/60 text-sm">{exp.description}</p>
                          )}
                        </div>
                      </ConstellationCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-cyan-400" />
                    Education
                  </h3>
                  <div className="space-y-6">
                    {education.map((edu, i) => (
                      <ConstellationCard key={edu.id} delay={i * 0.1}>
                        <div className="p-6">
                          <Badge className="mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                            {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                          </Badge>
                          <h4 className="text-lg font-semibold text-white mb-1">{edu.degree}</h4>
                          <p className="text-cyan-300 mb-1">{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-purple-100/60 text-sm">{edu.field_of_study}</p>
                          )}
                        </div>
                      </ConstellationCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader badge="Portfolio" title="Stellar Creations" />

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
                  <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-white/10">
                    <div className="aspect-[4/3] overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                          <Star className="w-16 h-16 text-purple-400/50" />
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <h4 className="text-white text-xl font-bold mb-2">{project.title}</h4>
                      {project.description && (
                        <p className="text-white/70 text-sm line-clamp-2 mb-4">{project.description}</p>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-amber-400 text-sm hover:text-amber-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </a>
                      )}
                    </motion.div>

                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
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
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader badge="Contact" title="Let's Connect" />

          <ConstellationCard>
            <div className="p-10 md:p-14 text-center">
              <p className="text-lg text-purple-100/80 mb-10">
                Ready to start something amazing? Reach out and let's explore the possibilities together.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {profile?.email && (
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
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
                    className="rounded-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8"
                    asChild
                  >
                    <a href={`tel:${portfolio.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {portfolio.phone}
                    </a>
                  </Button>
                )}
              </div>

              {userId && <ContactForm portfolioOwnerId={userId} />}
            </div>
          </ConstellationCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto opacity-70" />
              ) : (
                <Orbit className="w-6 h-6 text-purple-400" />
              )}
              <span className="text-purple-300/70">{profile?.display_name}</span>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-300/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}

            <p className="text-sm text-purple-300/50">
              © {new Date().getFullYear()} {profile?.display_name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
