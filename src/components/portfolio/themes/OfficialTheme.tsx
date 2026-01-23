import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Award,
  Briefcase, GraduationCap, Menu, X, CheckCircle, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfficialTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.span className="font-semibold text-xl tracking-tight" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {profile?.display_name || "Portfolio"}
            </motion.span>
            
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Services", "Portfolio", "Contact"].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "services" ? "skills" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase())} 
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
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
              className="md:hidden bg-white border-t border-slate-100 px-6 py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Home", "About", "Services", "Portfolio", "Contact"].map((item) => (
                <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "services" ? "skills" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase())} className="block w-full text-left py-3 text-slate-600">
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-3xl hidden lg:block" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full bg-purple-50/50 blur-3xl hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-slate-900 text-white border-0 rounded-full px-4 py-1.5">
                <Award className="w-3 h-3 mr-2" />
                Professional Profile
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                {profile?.display_name || "Your Name"}
              </h1>

              {portfolio?.headline && (
                <p className="text-lg sm:text-xl text-slate-500 font-light mb-8 leading-relaxed">
                  {portfolio.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {profile?.email && (
                  <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 px-8" asChild>
                    <a href={`mailto:${profile.email}`}>
                      Get In Touch <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-200" onClick={() => scrollTo('works')}>
                  View Work
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl" />
                <Avatar className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 border-8 border-white shadow-2xl">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-5xl sm:text-7xl bg-slate-100 text-slate-400">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: `${experiences.length}+`, label: "Years Experience" },
              { value: `${projects.length}+`, label: "Projects" },
              { value: `${skills.length}+`, label: "Skills" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">About Me</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">Professional Background</h3>
            
            {portfolio?.bio && (
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto">
                {portfolio.bio}
              </p>
            )}

            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Expertise</h2>
              <h3 className="text-3xl sm:text-4xl font-bold">Services & Skills</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
                <motion.div 
                  key={category}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">{category}</h4>
                  <ul className="space-y-2">
                    {categorySkills.map((skill) => (
                      <li key={skill.id} className="flex items-center gap-2 text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                        {skill.name}
                      </li>
                    ))}
                  </ul>
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
            <section id="education" className="py-24 sm:py-32 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Background</h2>
                  <h3 className="text-3xl sm:text-4xl font-bold">Education</h3>
                </motion.div>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      className="flex gap-4 sm:gap-6 items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pb-6 border-b border-slate-100">
                        <h4 className="text-lg sm:text-xl font-bold">{edu.degree}</h4>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                        {edu.field_of_study && <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>}
                        <p className="text-sm text-slate-400 mt-2">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-50">
              <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Career</h2>
                  <h3 className="text-3xl sm:text-4xl font-bold">Work Experience</h3>
                </motion.div>
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <motion.div 
                      key={exp.id}
                      className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg sm:text-xl font-bold">{exp.position}</h4>
                          <p className="text-slate-600 font-medium">{exp.company}</p>
                          <p className="text-sm text-slate-400 mt-1">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                          {exp.description && <p className="text-slate-500 mt-4">{exp.description}</p>}
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
        <section id="works" className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Portfolio</h2>
              <h3 className="text-3xl sm:text-4xl font-bold">Recent Work</h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {allProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
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
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Award className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-slate-900 hover:scale-110 transition-transform">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </motion.div>
                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-slate-900 text-white border-0">Featured</Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                    {project.description && <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h3>
            <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              Have a project in mind? I'd love to hear about it. Let's discuss how we can work together.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {profile?.email && (
                <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-8" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Get In Touch
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 px-8" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Me
                  </a>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400">
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
      <footer className="py-8 px-4 sm:px-6 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-white/40">{profile?.display_name}</span>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
