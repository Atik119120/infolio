import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Award, Zap,
  Briefcase, GraduationCap, Menu, X, CheckCircle, ArrowRight, Shield, Star,
  Target, TrendingUp, Users, Clock, ChevronRight, Building, FileText, Send
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

// Animated Counter
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{display}</span>;
};

// Grid Background
const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #000 1px, transparent 1px),
          linear-gradient(to bottom, #000 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

// Service Card
const ServiceCard = ({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm group-hover:border-transparent group-hover:shadow-xl transition-all duration-300">
        <div className="w-14 h-14 rounded-xl bg-slate-900 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors">
          <Icon className="w-7 h-7 text-white group-hover:text-white" />
        </div>
        <h4 className="text-xl font-semibold text-slate-900 group-hover:text-white mb-3 transition-colors">{title}</h4>
        <p className="text-slate-500 group-hover:text-white/80 transition-colors">{description}</p>
        <div className="mt-6 flex items-center text-blue-600 group-hover:text-white text-sm font-medium transition-colors">
          Learn More <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.div>
  );
};

// Timeline Item
const TimelineItem = ({ data, index, isLast }: { data: any; index: number; isLast: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-10 pb-12"
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 to-slate-200" />
      )}
      
      {/* Timeline Dot */}
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge className="bg-blue-100 text-blue-700 border-0">
            {data.start_date && formatDate(data.start_date)} - {data.is_current ? "Present" : data.end_date && formatDate(data.end_date)}
          </Badge>
        </div>
        <h4 className="text-lg font-semibold text-slate-900 mb-1">{data.position || data.degree}</h4>
        <p className="text-blue-600 font-medium mb-3">{data.company || data.institution}</p>
        {(data.description || data.field_of_study) && (
          <p className="text-slate-500 text-sm">{data.description || data.field_of_study}</p>
        )}
      </div>
    </motion.div>
  );
};

// Stats Section
const StatsSection = ({ stats }: { stats: { value: number; label: string; suffix?: string }[] }) => (
  <div className="py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <AnimatedCounter value={stat.value} />
              {stat.suffix || "+"}
            </div>
            <div className="text-blue-300 text-sm uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default function OfficialProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <GridBackground />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-12 w-auto" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
              )}
              <span className="font-bold text-xl tracking-tight">{profile?.display_name || "Portfolio"}</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Services", "Portfolio", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "services" ? "skills" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase())}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
              {profile?.email && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  <Button className="rounded-full bg-slate-900 hover:bg-slate-800 px-6" asChild>
                    <a href={`mailto:${profile.email}`}>
                      Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-slate-100 px-6 py-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Services", "Portfolio", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "services" ? "skills" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase())}
                  className="block w-full text-left py-4 text-slate-600 border-b border-slate-50 last:border-0"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-slate-100/50 to-blue-100/30 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="mb-6 bg-blue-100 text-blue-700 border-0 rounded-full px-5 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Professional Portfolio
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {profile?.display_name || "Your Name"}
              </motion.h1>

              {portfolio?.headline && (
                <motion.p
                  className="text-xl text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}

              {/* Contact Info Pills */}
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {portfolio?.location && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {portfolio.location}
                  </div>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="hidden sm:inline">{profile.email}</span>
                    <span className="sm:hidden">Email</span>
                  </a>
                )}
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 shadow-lg shadow-blue-500/25"
                  onClick={() => scrollTo("works")}
                >
                  View Portfolio <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 hover:bg-slate-50 px-8"
                  onClick={() => scrollTo("about")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </motion.div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <motion.div
                  className="flex gap-3 mt-8 justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all"
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>

            {/* Image */}
            <motion.div
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-[2rem] blur-2xl opacity-50" />
                <div className="absolute -inset-8 bg-gradient-to-tl from-slate-100 to-white rounded-[3rem]" />
                
                <Avatar className="relative w-64 h-64 sm:w-80 sm:h-80 ring-8 ring-white shadow-2xl">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="text-6xl sm:text-7xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-full shadow-lg flex items-center gap-2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Available</span>
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="text-sm font-medium">Top Rated</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection
        stats={[
          { value: experiences.length, label: "Years Experience" },
          { value: projects.length, label: "Projects Completed" },
          { value: skills.length, label: "Skills Mastered" },
          { value: 100, label: "Client Satisfaction", suffix: "%" },
        ]}
      />

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-0">
                <Shield className="w-3 h-3 mr-2" />
                About Me
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Professional Background
              </h2>
              {portfolio?.bio && (
                <p className="text-lg text-slate-500 leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <Target className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold mb-2">Mission Driven</h4>
                  <p className="text-sm text-slate-500">Focused on delivering exceptional results</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold mb-2">Growth Focused</h4>
                  <p className="text-sm text-slate-500">Continuous improvement mindset</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {experiences.slice(0, 3).map((exp, i) => (
                <TimelineItem key={exp.id} data={exp} index={i} isLast={i === Math.min(experiences.length - 1, 2)} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services/Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-0">
                <Zap className="w-3 h-3 mr-2" />
                Services & Expertise
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">What I Do Best</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedSkills).slice(0, 6).map(([category, categorySkills], i) => (
                <ServiceCard
                  key={category}
                  icon={i % 3 === 0 ? Target : i % 3 === 1 ? Zap : CheckCircle}
                  title={category}
                  description={categorySkills.map(s => s.name).slice(0, 3).join(", ")}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-0">
                <GraduationCap className="w-3 h-3 mr-2" />
                Education
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Academic Background</h2>
            </motion.div>

            <div className="space-y-6">
              {education.map((edu, i) => (
                <TimelineItem key={edu.id} data={edu} index={i} isLast={i === education.length - 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {allProjects.length > 0 && (
        <section id="works" className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-0">
                <Award className="w-3 h-3 mr-2" />
                Portfolio
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Featured Work</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Award className="w-12 h-12 text-blue-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            View Project <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {project.featured && (
                        <Badge className="absolute top-4 left-4 bg-blue-600 text-white border-0">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                      {project.description && (
                        <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.tech_stack.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs border-slate-200">
                              {tech}
                            </Badge>
                          ))}
                        </div>
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
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-white/10 text-white border-white/20">
              <Mail className="w-3 h-3 mr-2" />
              Get in Touch
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
            <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it. Let's discuss how we can collaborate.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-blue-100 px-8" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 px-8" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Me
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-blue-200">
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
      <footer className="py-12 px-6 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
              )}
              <span className="text-white/50">{profile?.display_name}</span>
            </div>

            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} {profile?.display_name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
