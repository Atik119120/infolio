import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, TrendingUp, Target, BarChart3, Menu, X, Rocket, LineChart, PieChart, Zap, Crown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
};

export default function DigitalMarketerProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const allProjects = [...projects.filter(p => p.featured), ...projects.filter(p => !p.featured)];
  const groupedSkills = skills.reduce((acc, skill) => { const cat = skill.category || "Marketing"; if (!acc[cat]) acc[cat] = []; acc[cat].push(skill); return acc; }, {} as Record<string, typeof skills>);

  useEffect(() => { window.scrollTo(0, 0); setTimeout(() => setIsLoaded(true), 1200); }, []);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center" exit={{ opacity: 0 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
              <TrendingUp className="w-12 h-12 text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20" initial={{ y: -80 }} animate={{ y: isLoaded ? 0 : -80 }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
            <span className="font-bold">{profile?.display_name}</span>
          </div>
          <div className="hidden md:flex gap-8">{["Home", "About", "Skills", "Results", "Contact"].map(item => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "results" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="text-sm text-neutral-400 hover:text-cyan-400">{item}</button>
          ))}</div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </motion.nav>

      <section id="hero" className="min-h-screen pt-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: isLoaded ? 1 : 0, x: 0 }} transition={{ delay: 0.3 }}>
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20"><Rocket className="w-3 h-3 mr-2" />Growth Marketing Pro</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Scale Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Growth</span></h1>
            {portfolio?.headline && <p className="text-xl text-neutral-400 mb-8">{portfolio.headline}</p>}
            <div className="flex gap-4">
              {profile?.email && <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl" asChild><a href={`mailto:${profile.email}`}><Rocket className="w-4 h-4 mr-2" />Let's Talk</a></Button>}
              <Button size="lg" variant="outline" className="border-cyan-500/30 rounded-xl" onClick={() => scrollTo('works')}>See Results</Button>
            </div>
          </motion.div>
          <motion.div className="hidden lg:block" initial={{ opacity: 0, x: 50 }} animate={{ opacity: isLoaded ? 1 : 0, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-cyan-500/20">
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "ROI", value: "450%", color: "cyan" }, { label: "Leads", value: "10K+", color: "blue" }, { label: "Revenue", value: "$2M+", color: "purple" }, { label: "Growth", value: "300%", color: "green" }].map((m, i) => (
                  <motion.div key={m.label} className="bg-slate-800/50 rounded-2xl p-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
                    <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
                    <p className={`text-2xl font-bold text-${m.color}-400`}>{m.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="bio" className="py-32 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal><Avatar className="w-64 h-64 mx-auto rounded-3xl border-4 border-cyan-500/20"><AvatarImage src={profile?.avatar_url || undefined} className="object-cover" /><AvatarFallback className="text-6xl bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl">{profile?.display_name?.[0]}</AvatarFallback></Avatar></ScrollReveal>
          <ScrollReveal delay={0.2}><div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{profile?.display_name}</h2>
            {portfolio?.bio && <p className="text-lg text-neutral-400">{portfolio.bio}</p>}
            {portfolio?.location && <p className="flex items-center gap-2 text-neutral-500"><MapPin className="w-4 h-4 text-cyan-400" />{portfolio.location}</p>}
            {socialLinks.length > 0 && <div className="flex gap-3">{socialLinks.map(link => { const Icon = getSocialIcon(link.platform); return <a key={link.id} href={link.url} target="_blank" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-cyan-500/20"><Icon className="w-4 h-4" /></a>; })}</div>}
          </div></ScrollReveal>
        </div>
      </section>

      {skills.length > 0 && <section id="skills" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal><h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Marketing Expertise</h2></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{skills.map((skill, i) => (
            <ScrollReveal key={skill.id} delay={i * 0.05}><div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-between mb-2"><span className="font-medium">{skill.name}</span><span className="text-cyan-400 text-sm">{skill.proficiency}%</span></div>
              <div className="h-1.5 bg-slate-800 rounded-full"><motion.div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${skill.proficiency}%` }} viewport={{ once: true }} /></div>
            </div></ScrollReveal>
          ))}</div>
        </div>
      </section>}

      {projects.length > 0 && <section id="works" className="py-32 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal><h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Campaign Results</h2></ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{allProjects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.1}><div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/30 transition-colors">
              {p.image_url && <img src={p.image_url} className="w-full aspect-video object-cover" />}
              <div className="p-4"><h3 className="font-semibold mb-1">{p.title}</h3>{p.description && <p className="text-sm text-neutral-500 line-clamp-2">{p.description}</p>}</div>
            </div></ScrollReveal>
          ))}</div>
        </div>
      </section>}

      <section id="contact" className="py-32 px-6 text-center">
        <ScrollReveal>
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Ready to Grow?</h2>
          {profile?.email && <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl" asChild><a href={`mailto:${profile.email}`}><Rocket className="w-4 h-4 mr-2" />{profile.email}</a></Button>}
        </ScrollReveal>
      </section>

      <footer className="py-12 px-6 bg-slate-900/50 border-t border-slate-800 text-center">
        <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} {profile?.display_name}</p>
      </footer>
    </div>
  );
}
