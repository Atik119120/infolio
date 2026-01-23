import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, TrendingUp, Target, BarChart3,
  Briefcase, GraduationCap, Menu, X, Megaphone, Rocket, Zap, ArrowRight, LineChart, PieChart
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DigitalMarketerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Marketing metrics animation
  const metrics = [
    { label: "ROI Increase", value: "300%", color: "#10B981" },
    { label: "Conversions", value: "150K+", color: "#3B82F6" },
    { label: "Campaigns", value: `${projects.length}+`, color: "#8B5CF6" },
    { label: "Growth", value: "500%", color: "#F59E0B" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
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
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
        {/* Floating Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px]"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Navigation - Modern Glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">{profile?.display_name || "Marketer"}</span>
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
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
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Skills", "Results", "Contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "results" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} 
                  className="block w-full text-left py-2 text-white/80"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Dashboard Style */}
      <section id="hero" className="min-h-screen pt-20 relative flex items-center">
        {/* Cover Background */}
        <div className="absolute inset-0">
          {projects[0]?.image_url && (
            <motion.img
              src={projects[0].image_url}
              alt="Cover"
              className="w-full h-full object-cover opacity-10"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Rocket className="w-3 h-3 mr-2" />
                  Digital Marketing Expert
                </Badge>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
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
                  className="text-xl text-white/60 mb-8 max-w-xl"
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
                  <Button 
                    size="lg" 
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                    asChild
                  >
                    <a href={`mailto:${profile.email}`}>
                      <Megaphone className="w-4 h-4 mr-2" />
                      Let's Talk Strategy
                    </a>
                  </Button>
                )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl border-white/10 hover:bg-white/5"
                  onClick={() => scrollTo('works')}
                >
                  See Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Live Metrics Dashboard */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-semibold">Performance Dashboard</h3>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Animated Metric Cards */}
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
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundColor: metric.color }}
                        animate={{ opacity: activeMetric === i ? 0.3 : 0.1 }}
                      />
                      <p className="text-xs text-white/40 mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold" style={{ color: metric.color }}>
                        {metric.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Visualization */}
                <div className="h-32 flex items-end gap-2">
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
      <section id="bio" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Profile Card */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-blue-500/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-purple-600">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-center mb-2">{profile?.display_name}</h3>
                {portfolio?.location && (
                  <p className="text-white/40 flex items-center justify-center gap-2 mb-6">
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
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">Driving Growth Through Digital</h3>
              
              {portfolio?.bio && (
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <Target className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-bold mb-1">Strategy Focused</h4>
                  <p className="text-sm text-white/40">Data-driven marketing approaches</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-bold mb-1">Results Oriented</h4>
                  <p className="text-sm text-white/40">Measurable business growth</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-32 px-6">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Expertise</h2>
              <h3 className="text-4xl font-bold">Marketing Skills</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                <motion.div 
                  key={category}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5 text-center hover:border-blue-500/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    {i % 4 === 0 && <Target className="w-6 h-6 text-blue-400" />}
                    {i % 4 === 1 && <LineChart className="w-6 h-6 text-purple-400" />}
                    {i % 4 === 2 && <PieChart className="w-6 h-6 text-pink-400" />}
                    {i % 4 === 3 && <TrendingUp className="w-6 h-6 text-green-400" />}
                  </div>
                  <h4 className="font-bold mb-3">{category}</h4>
                  <div className="flex flex-wrap justify-center gap-1">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="text-xs border-white/10">
                        {skill.name}
                      </Badge>
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
        <section className="py-32 px-6">
          <div className="container mx-auto max-w-4xl space-y-16">
            {education.length > 0 && (
              <div>
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4">Background</h2>
                  <h3 className="text-4xl font-bold">Education</h3>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-6">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                        <GraduationCap className="w-6 h-6 text-purple-400" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">{edu.degree}</h4>
                      <p className="text-purple-400">{edu.institution}</p>
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
                  <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Career</h2>
                  <h3 className="text-4xl font-bold">Experience</h3>
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="flex-1 w-0.5 bg-gradient-to-b from-purple-500 to-transparent mt-4" />
                      </div>
                      <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                        <h4 className="text-xl font-bold">{exp.position}</h4>
                        <p className="text-blue-400 font-medium">{exp.company}</p>
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

      {/* Works/Results Section */}
      {projects.length > 0 && (
        <section id="works" className="py-32 px-6">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                <BarChart3 className="w-3 h-3 mr-2" />
                Case Studies
              </Badge>
              <h3 className="text-4xl font-bold mb-4">Results That Speak</h3>
              <p className="text-white/40 max-w-xl mx-auto">
                Real campaigns, real results. Here's how I've helped brands achieve their goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                        <Target className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 border-0">
                        <Zap className="w-3 h-3 mr-1" />
                        Top Result
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                    {project.description && (
                      <p className="text-white/40 text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs border-white/10">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {project.live_url && (
                      <Button 
                        size="sm" 
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                        asChild
                      >
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Case Study
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30">
              <Rocket className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Grow?</span>
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Let's discuss how we can take your business to the next level.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile?.email && (
                <Button 
                  size="lg" 
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/25"
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
                  className="rounded-xl border-white/20"
                  asChild
                >
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
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-bold">{profile?.display_name || "Marketer"}</span>
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
