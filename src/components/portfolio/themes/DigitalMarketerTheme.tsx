import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, TrendingUp, Target, BarChart3,
  Briefcase, GraduationCap, Menu, X, Megaphone, Rocket, ArrowRight, LineChart, PieChart
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DigitalMarketerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Marketing";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const metrics = [
    { label: "ROI Increase", value: "300%", color: "#10B981" },
    { label: "Conversions", value: "150K+", color: "#3B82F6" },
    { label: "Campaigns", value: `${projects.length}+`, color: "#8B5CF6" },
    { label: "Growth", value: "500%", color: "#F59E0B" },
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [metrics.length]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              )}
              <span className="font-bold text-lg hidden sm:block">{profile?.display_name || "Marketer"}</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Skills", "Results", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "results" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="text-sm text-white/60 hover:text-white transition-colors relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all" />
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
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Results", "Contact"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "results" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="block w-full text-left py-3 text-white/70">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen pt-16 relative flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Rocket className="w-3 h-3 mr-2" />
                  Digital Marketing Expert
                </Badge>
              </motion.div>

              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                I Help Brands
                <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Grow & Scale
                </span>
              </motion.h1>

              {portfolio?.headline && (
                <motion.p 
                  className="text-lg sm:text-xl text-white/60 mb-8 max-w-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {portfolio.headline}
                </motion.p>
              )}

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {profile?.email && (
                  <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Megaphone className="w-4 h-4 mr-2" />
                      Let's Talk Strategy
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="rounded-xl border-white/10 hover:bg-white/5" onClick={() => scrollTo('works')}>
                  See Results <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Dashboard */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Performance Dashboard</h3>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {metrics.map((metric, i) => (
                    <motion.div 
                      key={metric.label}
                      className="bg-white/5 rounded-2xl p-4 relative overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <motion.div 
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: metric.color }}
                        animate={{ opacity: activeMetric === i ? 0.2 : 0.1 }}
                      />
                      <p className="text-xs text-white/40 mb-1">{metric.label}</p>
                      <p className="text-xl sm:text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="h-24 sm:h-32 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                    <motion.div 
                      key={i}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-500"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 1 + i * 0.1, type: "spring" }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Profile Card */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 border-4 border-blue-500/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-4xl sm:text-5xl bg-gradient-to-br from-blue-500 to-purple-600">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">{profile?.display_name}</h3>
                {portfolio?.location && (
                  <p className="text-white/40 flex items-center justify-center gap-2 mb-6 text-sm">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </p>
                )}
                
                {socialLinks.length > 0 && (
                  <div className="flex justify-center gap-3">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">About Me</h2>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6">Driving Growth Through Digital</h3>
              
              {portfolio?.bio && (
                <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8">{portfolio.bio}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/5">
                  <Target className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400 mb-3" />
                  <h4 className="font-bold mb-1 text-sm sm:text-base">Strategy Focused</h4>
                  <p className="text-xs sm:text-sm text-white/40">Data-driven marketing</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/5">
                  <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 mb-3" />
                  <h4 className="font-bold mb-1 text-sm sm:text-base">Results Oriented</h4>
                  <p className="text-xs sm:text-sm text-white/40">Measurable growth</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Expertise</h2>
              <h3 className="text-3xl sm:text-4xl font-bold">Marketing Skills</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                <motion.div 
                  key={category}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5 text-center hover:border-blue-500/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    {i % 4 === 0 && <Target className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />}
                    {i % 4 === 1 && <LineChart className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />}
                    {i % 4 === 2 && <PieChart className="w-5 sm:w-6 h-5 sm:h-6 text-pink-400" />}
                    {i % 4 === 3 && <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />}
                  </div>
                  <h4 className="font-bold mb-3">{category}</h4>
                  <div className="flex flex-wrap justify-center gap-1">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="text-xs border-white/10">{skill.name}</Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Experience */}
      {(education.length > 0 || experiences.length > 0) && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            {education.length > 0 && (
              <div className="mb-16 sm:mb-20">
                <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Background</h2>
                  <h3 className="text-3xl sm:text-4xl font-bold">Education</h3>
                </motion.div>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{edu.degree}</h4>
                          <p className="text-blue-400">{edu.institution}</p>
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
                  <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4">Career</h2>
                  <h3 className="text-3xl sm:text-4xl font-bold">Experience</h3>
                </motion.div>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{exp.position}</h4>
                          <p className="text-purple-400">{exp.company}</p>
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
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Portfolio</h2>
              <h3 className="text-3xl sm:text-4xl font-bold">Campaign Results</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <BarChart3 className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-black/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </motion.div>
                    {project.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 border-0">Featured</Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                    {project.description && <p className="text-sm text-white/50 line-clamp-2">{project.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Let's Grow Together</h3>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Ready to scale your brand? Let's discuss your marketing goals and create a winning strategy.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-xl border-white/10" asChild>
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
      <footer className="py-8 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm text-white/40">{profile?.display_name}</span>
            </div>

            {/* Footer Nav */}
            <div className="flex flex-wrap justify-center gap-6">
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm text-white/30 hover:text-blue-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
