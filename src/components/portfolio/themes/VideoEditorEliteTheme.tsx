import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, ExternalLink, Film, Play, Menu, X, Sparkles, Award, Crown, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>
      {children}
    </motion.div>
  );
};

export default function VideoEditorEliteTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
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
            <motion.div className="w-20 h-20 border-2 border-violet-500/50 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <div className="w-full h-full flex items-center justify-center"><Crown className="w-8 h-8 text-violet-400" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-violet-500/20" initial={{ y: -100 }} animate={{ y: isLoaded ? 0 : -100 }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Crown className="w-5 h-5" /></div>
            <span className="font-light tracking-widest text-sm">{profile?.display_name}</span>
          </div>
          <div className="hidden md:flex gap-8">{["Home", "About", "Works", "Contact"].map(item => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase() === "home" ? "hero" : item.toLowerCase() === "about" ? "bio" : item.toLowerCase())} className="text-xs text-neutral-400 hover:text-violet-400 uppercase tracking-widest">{item}</button>
          ))}</div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </motion.nav>

      <section id="hero" className="h-screen relative flex items-center justify-center">
        {allProjects[0]?.image_url && <img src={allProjects[0].image_url} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: isLoaded ? 1 : 0, y: 0 }} transition={{ delay: 0.5 }}>
            <Badge className="mb-6 bg-violet-500/20 text-violet-400 border-violet-500/30"><Crown className="w-3 h-3 mr-2" />Elite Filmmaker</Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-4 bg-gradient-to-r from-violet-300 via-purple-200 to-violet-300 bg-clip-text text-transparent">{profile?.display_name || "Filmmaker"}</h1>
            {portfolio?.headline && <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">{portfolio.headline}</p>}
            <div className="flex justify-center gap-4">
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-none px-8" onClick={() => scrollTo('works')}><Play className="w-4 h-4 mr-2" />View Showreel</Button>
              {profile?.email && <Button variant="outline" className="border-violet-500/30 text-violet-400 rounded-none" asChild><a href={`mailto:${profile.email}`}><Mail className="w-4 h-4 mr-2" />Contact</a></Button>}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="bio" className="py-32 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal><Avatar className="w-full aspect-square rounded-none"><AvatarImage src={profile?.avatar_url || undefined} className="object-cover" /><AvatarFallback className="text-9xl bg-gradient-to-br from-violet-500 to-purple-600 rounded-none">{profile?.display_name?.[0]}</AvatarFallback></Avatar></ScrollReveal>
          <ScrollReveal delay={0.2}><div className="space-y-6">
            <p className="text-violet-400 tracking-[0.3em] text-xs uppercase">The Artist</p>
            <h2 className="text-4xl font-extralight bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">{profile?.display_name}</h2>
            {portfolio?.bio && <p className="text-lg text-neutral-400">{portfolio.bio}</p>}
            {socialLinks.length > 0 && <div className="flex gap-4">{socialLinks.map(link => { const Icon = getSocialIcon(link.platform); return <a key={link.id} href={link.url} target="_blank" className="w-12 h-12 border border-violet-500/30 flex items-center justify-center hover:bg-violet-500/20"><Icon className="w-5 h-5" /></a>; })}</div>}
          </div></ScrollReveal>
        </div>
      </section>

      {projects.length > 0 && <section id="works" className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal><h2 className="text-4xl font-extralight text-center mb-16 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">Portfolio</h2></ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{allProjects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.1}><div className="group relative aspect-video bg-neutral-900 overflow-hidden">
              {p.image_url && <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play className="w-12 h-12 text-violet-400" /></div>
            </div></ScrollReveal>
          ))}</div>
        </div>
      </section>}

      <section id="contact" className="py-32 px-6 bg-neutral-950 text-center">
        <ScrollReveal>
          <h2 className="text-4xl font-extralight mb-8 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">Let's Create Cinema</h2>
          {profile?.email && <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-none px-10" asChild><a href={`mailto:${profile.email}`}><Mail className="w-4 h-4 mr-2" />{profile.email}</a></Button>}
        </ScrollReveal>
      </section>

      <footer className="py-12 px-6 bg-black border-t border-neutral-900 text-center">
        <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} {profile?.display_name}</p>
      </footer>
    </div>
  );
}
