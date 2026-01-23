import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Award, Zap,
  Briefcase, GraduationCap, Menu, X, CheckCircle, ArrowRight, Shield, Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

const ScrollReveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 60 : direction === "down" ? -60 : 0, x: direction === "left" ? 60 : direction === "right" ? -60 : 0 },
    visible: { opacity: 1, y: 0, x: 0 }
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={variants} transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </motion.div>
  );
};

export default function OfficialTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];
  const groupedSkills = skills.reduce((acc, skill) => { const cat = skill.category || "Other"; if (!acc[cat]) acc[cat] = []; acc[cat].push(skill); return acc; }, {} as Record<string, typeof skills>);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />

      <motion.nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`} initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg"><Shield className="w-5 h-5 text-white" /></div>
              <span className="font-semibold text-lg sm:text-xl tracking-tight">{profile?.display_name || "Portfolio"}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["Home", "About", "Services", "Portfolio", "Contact"].map((item, i) => (
                <motion.button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "services" ? "skills" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase())} className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>{item}</motion.button>
              ))}
              <ThemeToggle />
            </div>
            <div className="flex md:hidden items-center gap-2"><ThemeToggle /><button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-600">{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button></div>
          </div>
        </div>
        <AnimatePresence>{menuOpen && (<motion.div className="md:hidden bg-white border-t border-slate-100 px-6 py-4" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{["Home", "About", "Services", "Portfolio", "Contact"].map((item) => (<button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "services" ? "skills" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase() === "portfolio" ? "works" : item.toLowerCase())} className="block w-full text-left py-3 text-slate-600">{item}</button>))}</motion.div>)}</AnimatePresence>
      </motion.nav>

      <motion.section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden" style={{ opacity: heroOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div className="absolute top-20 right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/30 blur-3xl hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-slate-900 text-white border-0 rounded-full px-5 py-2 shadow-lg"><Award className="w-3 h-3 mr-2" />Professional Profile</Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">{profile?.display_name || "Your Name"}</h1>
              {portfolio?.headline && <p className="text-lg sm:text-xl text-slate-500 font-light mb-8 leading-relaxed max-w-lg">{portfolio.headline}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
                {portfolio?.location && <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full"><MapPin className="w-4 h-4 text-slate-600" />{portfolio.location}</span>}
                {profile?.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"><Mail className="w-4 h-4 text-slate-600" />{profile.email}</a>}
              </div>
              <div className="flex flex-wrap gap-4">
                {profile?.email && <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 px-8 shadow-lg" asChild><a href={`mailto:${profile.email}`}>Get In Touch <ArrowRight className="w-4 h-4 ml-2" /></a></Button>}
                <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-300 hover:bg-slate-50" onClick={() => scrollTo('works')}>View Work</Button>
              </div>
            </motion.div>
            <motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="relative"><div className="absolute -inset-6 bg-gradient-to-br from-blue-200/50 to-indigo-200/50 rounded-full blur-2xl" /><Avatar className="relative w-64 h-64 sm:w-80 sm:h-80 border-8 border-white shadow-2xl"><AvatarImage src={profile?.avatar_url || undefined} /><AvatarFallback className="text-5xl sm:text-7xl bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600">{profile?.display_name?.[0]?.toUpperCase() || "?"}</AvatarFallback></Avatar></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[{ value: `${experiences.length}+`, label: "Years Experience", icon: Zap }, { value: `${projects.length}+`, label: "Projects", icon: Award }, { value: `${skills.length}+`, label: "Skills", icon: Star }, { value: "100%", label: "Satisfaction", icon: CheckCircle }].map((stat, i) => (<ScrollReveal key={stat.label} delay={i * 0.1}><div className="text-center"><stat.icon className="w-6 h-6 mx-auto mb-4 text-blue-400" /><div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{stat.value}</div><div className="text-sm text-slate-400">{stat.label}</div></div></ScrollReveal>))}
          </div>
        </div>
      </section>

      <section id="bio" className="py-24 sm:py-32 px-4 sm:px-6"><div className="max-w-4xl mx-auto text-center"><ScrollReveal><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 mb-6"><Shield className="w-4 h-4 text-slate-600" /><span className="text-xs tracking-widest uppercase text-slate-600 font-medium">About Me</span></div><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">Professional Background</h2>{portfolio?.bio && <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto">{portfolio.bio}</p>}{socialLinks.length > 0 && <div className="flex justify-center gap-4">{socialLinks.map((link) => { const Icon = getSocialIcon(link.platform); return <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all" whileHover={{ scale: 1.1, y: -3 }}><Icon className="w-5 h-5" /></motion.a>; })}</div>}</ScrollReveal></div></section>

      {skills.length > 0 && <section id="skills" className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-50"><div className="max-w-5xl mx-auto"><ScrollReveal><div className="text-center mb-16"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-6"><Zap className="w-4 h-4 text-blue-600" /><span className="text-xs tracking-widest uppercase text-slate-600 font-medium">Expertise</span></div><h2 className="text-3xl sm:text-4xl font-bold">Services & Skills</h2></div></ScrollReveal><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Object.entries(groupedSkills).map(([cat, catSkills], i) => (<ScrollReveal key={cat} delay={i * 0.1}><motion.div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-slate-100" whileHover={{ y: -5 }}><div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6"><CheckCircle className="w-6 h-6" /></div><h4 className="text-xl font-bold mb-4">{cat}</h4><ul className="space-y-3">{catSkills.map((skill) => <li key={skill.id} className="flex items-center gap-3 text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500" />{skill.name}</li>)}</ul></motion.div></ScrollReveal>))}</div></div></section>}

      {education.length > 0 && <section className="py-24 sm:py-32 px-4 sm:px-6"><div className="max-w-4xl mx-auto"><ScrollReveal><div className="text-center mb-16"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 mb-6"><GraduationCap className="w-4 h-4 text-blue-600" /><span className="text-xs tracking-widest uppercase text-blue-600 font-medium">Background</span></div><h2 className="text-3xl sm:text-4xl font-bold">Education</h2></div></ScrollReveal><div className="space-y-6">{education.map((edu, i) => (<ScrollReveal key={edu.id} delay={i * 0.1}><motion.div className="flex gap-6 items-start p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors" whileHover={{ x: 5 }}><div className="w-14 h-14 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg"><GraduationCap className="w-7 h-7" /></div><div><h4 className="text-xl font-bold">{edu.degree}</h4><p className="text-blue-600 font-medium">{edu.institution}</p>{edu.field_of_study && <p className="text-sm text-slate-400 mt-1">{edu.field_of_study}</p>}<p className="text-sm text-slate-400 mt-2">{formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}</p></div></motion.div></ScrollReveal>))}</div></div></section>}

      {experiences.length > 0 && <section className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-50"><div className="max-w-4xl mx-auto"><ScrollReveal><div className="text-center mb-16"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-6"><Briefcase className="w-4 h-4 text-slate-600" /><span className="text-xs tracking-widest uppercase text-slate-600 font-medium">Career</span></div><h2 className="text-3xl sm:text-4xl font-bold">Work Experience</h2></div></ScrollReveal><div className="space-y-6">{experiences.map((exp, i) => (<ScrollReveal key={exp.id} delay={i * 0.1}><motion.div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all" whileHover={{ y: -3 }}><div className="flex items-start gap-6"><div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-lg"><Briefcase className="w-7 h-7" /></div><div><h4 className="text-xl font-bold">{exp.position}</h4><p className="text-slate-600 font-medium">{exp.company}</p><p className="text-sm text-slate-400 mt-1">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>{exp.description && <p className="text-slate-500 mt-4 leading-relaxed">{exp.description}</p>}</div></div></motion.div></ScrollReveal>))}</div></div></section>}

      {allProjects.length > 0 && <section id="works" className="py-24 sm:py-32 px-4 sm:px-6"><div className="max-w-6xl mx-auto"><ScrollReveal><div className="text-center mb-16"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 mb-6"><Award className="w-4 h-4 text-slate-600" /><span className="text-xs tracking-widest uppercase text-slate-600 font-medium">Portfolio</span></div><h2 className="text-3xl sm:text-4xl font-bold">Recent Work</h2></div></ScrollReveal><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{allProjects.map((project, i) => (<ScrollReveal key={project.id} delay={i * 0.05}><motion.div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all" onMouseEnter={() => setHoveredProject(project.id)} onMouseLeave={() => setHoveredProject(null)} whileHover={{ y: -8 }}><div className="aspect-[4/3] overflow-hidden relative">{project.image_url ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"><Award className="w-12 h-12 text-slate-300" /></div>}<motion.div className="absolute inset-0 flex items-center justify-center bg-slate-900/60" initial={{ opacity: 0 }} animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}>{project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-slate-900 hover:scale-110 transition-transform shadow-lg"><ExternalLink className="w-6 h-6" /></a>}</motion.div>{project.featured && <Badge className="absolute top-4 left-4 bg-slate-900 text-white border-0 shadow-lg">Featured</Badge>}</div><div className="p-6"><h4 className="font-bold text-lg mb-2">{project.title}</h4>{project.description && <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>}</div></motion.div></ScrollReveal>))}</div></div></section>}

      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-900 text-white"><div className="max-w-3xl mx-auto text-center"><ScrollReveal><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-6"><Mail className="w-4 h-4" /><span className="text-xs tracking-widest uppercase font-medium">Get In Touch</span></div><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2><p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">Have a project in mind? I'd love to hear about it. Let's discuss how we can work together.</p><div className="flex flex-wrap justify-center gap-4 mb-12">{profile?.email && <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-8 shadow-lg" asChild><a href={`mailto:${profile.email}`}><Mail className="w-4 h-4 mr-2" />Get In Touch</a></Button>}{portfolio?.phone && <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 px-8" asChild><a href={`tel:${portfolio.phone}`}><Phone className="w-4 h-4 mr-2" />Call Me</a></Button>}</div><div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400">{portfolio?.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{portfolio.location}</span>}{profile?.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-white transition-colors"><Mail className="w-4 h-4" />{profile.email}</a>}</div></ScrollReveal></div></section>

      <footer className="py-8 px-4 sm:px-6 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm text-white/50">{profile?.display_name}</span>
            </div>

            {/* Footer Nav */}
            <div className="flex flex-wrap justify-center gap-6">
              {["Home", "About", "Skills", "Works", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())}
                  className="text-sm text-white/30 hover:text-white transition-colors"
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
