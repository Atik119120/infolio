import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, TrendingUp, Menu, X, Crown, Sparkles, Star, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
};

export default function DigitalMarketerEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const allProjects = [...projects.filter(p => p.featured), ...projects.filter(p => !p.featured)];

  useEffect(() => { window.scrollTo(0, 0); setTimeout(() => setIsLoaded(true), 1500); }, []);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" exit={{ opacity: 0 }}>
            <motion.div className="w-20 h-20" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <div className="w-full h-full border-2 border-emerald-500/50 rounded-full flex items-center justify-center"><Crown className="w-8 h-8 text-emerald-400" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-emerald-500/20" initial={{ y: -80 }} animate={{ y: isLoaded ? 0 : -80 }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"><Crown className="w-6 h-6 text-black" /></div>
            <div><p className="text-emerald-400 text-xs tracking-widest">ELITE</p><p className="font-light">{profile?.display_name}</p></div>
          </div>
          <div className="hidden md:flex gap-10">{["Home", "About", "Results", "Contact"].map(item => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "results" ? "works" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="text-xs text-neutral-400 hover:text-emerald-400 uppercase tracking-[0.2em]">{item}</button>
          ))}</div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </motion.nav>

      <section id="hero" className="h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/30" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: isLoaded ? 1 : 0, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-400 self-center" />
              <Crown className="w-8 h-8 text-emerald-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-400 self-center" />
            </div>
            <p className="text-emerald-400 tracking-[0.4em] text-xs uppercase mb-6">Elite Growth Strategist</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-6 bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200 bg-clip-text text-transparent">{profile?.display_name || "Strategist"}</h1>
            {portfolio?.headline && <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-light">{portfolio.headline}</p>}
            <div className="flex justify-center gap-6">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-medium rounded-none px-10" onClick={() => scrollTo('works')}><TrendingUp className="w-4 h-4 mr-2" />View Results</Button>
              {profile?.email && <Button size="lg" variant="outline" className="border-emerald-400/30 text-emerald-400 rounded-none px-10" asChild><a href={`mailto:${profile.email}`}><Mail className="w-4 h-4 mr-2" />Inquire</a></Button>}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-y border-emerald-500/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[{ v: "500%", l: "Average ROI" }, { v: "$10M+", l: "Revenue Generated" }, { v: "100+", l: "Clients Served" }, { v: "15+", l: "Years Experience" }].map((s, i) => (
            <ScrollReveal key={s.l} delay={i * 0.1}><div className="text-center">
              <p className="text-3xl font-light bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-1">{s.v}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{s.l}</p>
            </div></ScrollReveal>
          ))}
        </div>
      </section>

      <section id="bio" className="py-32 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal><div className="relative">
            <div className="absolute inset-0 border border-emerald-400/20 translate-x-4 translate-y-4" />
            <Avatar className="w-full aspect-[3/4] rounded-none"><AvatarImage src={profile?.avatar_url || undefined} className="object-cover" /><AvatarFallback className="text-9xl bg-gradient-to-br from-emerald-500 to-teal-500 rounded-none">{profile?.display_name?.[0]}</AvatarFallback></Avatar>
          </div></ScrollReveal>
          <ScrollReveal delay={0.2}><div className="space-y-6">
            <p className="text-emerald-400 tracking-[0.3em] text-xs uppercase">The Strategist</p>
            <h2 className="text-4xl font-extralight bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">{profile?.display_name}</h2>
            {portfolio?.bio && <p className="text-lg text-neutral-400 font-light leading-relaxed">{portfolio.bio}</p>}
            {socialLinks.length > 0 && <div className="flex gap-4 pt-4">{socialLinks.map(link => { const Icon = getSocialIcon(link.platform); return <a key={link.id} href={link.url} target="_blank" className="w-12 h-12 border border-emerald-400/30 flex items-center justify-center hover:bg-emerald-400 hover:border-emerald-400 group"><Icon className="w-5 h-5 text-emerald-400 group-hover:text-black" /></a>; })}</div>}
          </div></ScrollReveal>
        </div>
      </section>

      {projects.length > 0 && <section id="works" className="py-32 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal><div className="text-center mb-20">
            <p className="text-emerald-400 tracking-[0.3em] text-xs uppercase mb-4">Success Stories</p>
            <h2 className="text-4xl font-extralight bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">Campaign Results</h2>
          </div></ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{allProjects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.1}><motion.div className="group relative overflow-hidden" whileHover={{ scale: 1.02 }}>
              <div className="aspect-video bg-neutral-900">{p.image_url && <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4"><h3 className="font-light">{p.title}</h3></div>
              </div>
            </motion.div></ScrollReveal>
          ))}</div>
        </div>
      </section>}

      <section id="contact" className="py-32 px-6 bg-black text-center">
        <ScrollReveal>
          <div className="flex justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-400 self-center" />
            <Crown className="w-8 h-8 text-emerald-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-400 self-center" />
          </div>
          <h2 className="text-4xl font-extralight mb-8 bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">Ready for Elite Growth?</h2>
          {profile?.email && <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-medium rounded-none px-12" asChild><a href={`mailto:${profile.email}`}><Mail className="w-4 h-4 mr-2" />{profile.email}</a></Button>}
        </ScrollReveal>
      </section>

      <footer className="py-16 px-6 bg-black border-t border-neutral-900 text-center">
        <p className="text-neutral-700 text-xs tracking-wider">© {new Date().getFullYear()} {profile?.display_name}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
