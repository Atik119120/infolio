import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import {
  MapPin, Mail, Phone, ExternalLink, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, Star, Feather,
  Camera, Film, Bookmark, ArrowDown, Play, Stamp
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

// ==================== FILM STRIP MEMOIR AESTHETIC ====================

// Vintage Film Strip Frame
const FilmStrip = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    {/* Film sprocket holes - left */}
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-900 flex flex-col justify-around py-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-4 h-4 mx-auto rounded-sm bg-slate-700 border border-slate-600" />
      ))}
    </div>
    
    {/* Film content */}
    <div className="ml-10 mr-10 bg-gradient-to-b from-amber-50 to-orange-50 p-6 shadow-xl">
      {children}
    </div>
    
    {/* Film sprocket holes - right */}
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-slate-900 flex flex-col justify-around py-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-4 h-4 mx-auto rounded-sm bg-slate-700 border border-slate-600" />
      ))}
    </div>
  </motion.div>
);

// Vintage Postcard Component
const VintagePostcard = ({ children, rotation = 0 }: { children: React.ReactNode; rotation?: number }) => (
  <motion.div
    className="relative"
    style={{ rotate: rotation }}
    whileHover={{ scale: 1.02, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Postcard stamp */}
    <div className="absolute -top-4 -right-4 z-10">
      <div className="w-16 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-sm shadow-lg flex flex-col items-center justify-center border-2 border-dashed border-rose-300 rotate-6">
        <Heart className="w-6 h-6 text-white mb-1" />
        <span className="text-[8px] text-white font-bold">MEMORIES</span>
        <span className="text-[6px] text-rose-200">2024</span>
      </div>
    </div>
    
    {/* Wax seal */}
    <div className="absolute -bottom-3 -left-3 z-10">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 shadow-lg flex items-center justify-center border-4 border-red-500/30">
        <Star className="w-5 h-5 text-red-200" />
      </div>
    </div>
    
    {/* Postcard body */}
    <div className="bg-[#faf6e9] p-8 rounded-sm shadow-2xl border-4 border-amber-100"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 27px, #e8e0c8 28px),
          repeating-linear-gradient(90deg, transparent, transparent 100%, #e8e0c8 100%)
        `,
      }}
    >
      {children}
    </div>
  </motion.div>
);

// Handwritten Note Component
const HandwrittenNote = ({ text, signature }: { text: string; signature?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      className="relative bg-yellow-100/80 p-8 shadow-lg transform"
      style={{
        backgroundImage: `
          repeating-linear-gradient(transparent, transparent 31px, #d4c4a8 32px)
        `,
        clipPath: "polygon(0 0, 100% 2%, 98% 100%, 2% 98%)",
        rotate: -2,
      }}
      initial={{ opacity: 0, y: 30, rotate: -5 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: -2 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Tape effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-200/60 rotate-3" />
      
      <p className="font-serif italic text-slate-700 text-lg leading-loose" style={{ fontFamily: "'Caveat', cursive" }}>
        {text}
      </p>
      {signature && (
        <p className="text-right mt-4 text-rose-500 text-xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
          — {signature}
        </p>
      )}
    </motion.div>
  );
};

// Vintage Photo Frame
const VintagePhotoFrame = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    {/* Ornate frame border */}
    <div className="absolute -inset-4 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 rounded-sm shadow-2xl">
      {/* Corner ornaments */}
      {["-top-2 -left-2", "-top-2 -right-2", "-bottom-2 -left-2", "-bottom-2 -right-2"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 border-4 border-amber-400 rounded-full bg-amber-600`}>
          <div className="absolute inset-1 border-2 border-amber-400/50 rounded-full" />
        </div>
      ))}
    </div>
    
    {/* Photo content */}
    <div className="relative bg-white p-3">
      <img src={src} alt={alt} className="w-full aspect-[4/3] object-cover sepia-[0.3]" />
      {caption && (
        <p className="text-center text-sm text-slate-600 mt-2 font-serif italic">{caption}</p>
      )}
    </div>
  </motion.div>
);

// Scrapbook Page Tear Effect
const ScrapbookTear = () => (
  <div className="h-8 w-full bg-repeat-x opacity-20"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'%3E%3Cpath d='M0,20 Q10,0 20,15 T40,10 T60,18 T80,5 T100,20' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E")`,
      backgroundSize: "100px 20px",
    }}
  />
);

// Vintage Chapter Header
const ChapterHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="flex flex-col items-center gap-4 my-16">
    <div className="flex items-center gap-6 w-full max-w-lg">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-amber-600" />
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center shadow-lg border-4 border-amber-100">
        <span className="font-serif text-2xl text-amber-800">{number}</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-amber-600 via-amber-400 to-transparent" />
    </div>
    <h2 className="text-4xl font-serif text-slate-700 tracking-wide">{title}</h2>
    <div className="flex items-center gap-2">
      <Film className="w-4 h-4 text-amber-500" />
      <div className="w-24 h-0.5 bg-amber-300" />
      <Film className="w-4 h-4 text-amber-500" />
    </div>
  </div>
);

// Scroll Progress with Film Reel
const FilmReelProgress = () => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 w-16 h-16"
      style={{ rotate }}
    >
      <div className="w-full h-full rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-500 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
        </div>
        {/* Film reel spokes */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <div
            key={angle}
            className="absolute w-1 h-6 bg-slate-600"
            style={{ transform: `rotate(${angle}deg) translateY(-4px)` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default function PersonalProTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks, userId }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const allProjects = [...featuredProjects, ...projects.filter((p) => !p.featured)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#2a2520] text-amber-100">
      <FilmReelProgress />

      {/* Vintage Paper Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#2a2520]/95 backdrop-blur-md border-b border-amber-900/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <Film className="w-6 h-6 text-amber-400" />
              )}
              <span className="font-serif text-xl text-amber-200">{profile?.display_name || "Film Memoir"}</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Reel", "Story", "Gallery", "Journey", "Contact"].map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "reel" ? "hero" : item.toLowerCase())}
                  className="text-sm text-amber-300/70 hover:text-amber-200 transition-colors tracking-wide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-amber-200">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-[#2a2520]/95 backdrop-blur-md px-6 py-4 border-t border-amber-900/30"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {["Reel", "Story", "Gallery", "Journey", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase() === "reel" ? "hero" : item.toLowerCase())}
                  className="block w-full text-left py-3 text-amber-200"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero - Film Opening Sequence */}
      <section id="hero" className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Film countdown overlay */}
        <motion.div
          className="absolute inset-0 bg-slate-900 flex items-center justify-center z-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            className="text-9xl font-bold text-amber-400 font-mono"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1 }}
          >
            ▶
          </motion.div>
        </motion.div>

        {/* Film grain lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-amber-200/10 w-full"
              style={{ top: `${20 + i * 15}%` }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Vintage Photo Stack */}
            <motion.div
              className="relative h-[500px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              {/* Stacked vintage photos */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* Back photos */}
                <div className="absolute -left-8 -top-4 w-48 h-60 bg-[#faf6e9] p-2 shadow-2xl rotate-[-12deg]">
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300" />
                </div>
                <div className="absolute -right-8 -top-8 w-48 h-60 bg-[#faf6e9] p-2 shadow-2xl rotate-[8deg]">
                  <div className="w-full h-full bg-gradient-to-br from-rose-200 to-rose-300" />
                </div>
                
                {/* Main polaroid */}
                <div className="relative w-64 bg-[#faf6e9] p-4 shadow-2xl rotate-2">
                  <Avatar className="w-full aspect-square rounded-none">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover sepia-[0.2]" />
                    <AvatarFallback className="text-6xl bg-gradient-to-br from-amber-100 to-rose-100 text-amber-700 rounded-none">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-4 text-center">
                    <p className="text-slate-700 font-serif text-sm">"{portfolio?.location || "My Story"}"</p>
                    <p className="text-amber-600 text-xs mt-1">{new Date().getFullYear()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative film strips */}
              <motion.div
                className="absolute -bottom-4 left-0 right-0 h-12 bg-slate-900 flex items-center px-2 gap-1"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 h-8 bg-amber-100/80 rounded-sm" />
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Film Title Card */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
            >
              <motion.div className="mb-6">
                <Badge className="bg-amber-900/50 text-amber-200 border-amber-700 rounded-sm px-4 py-1.5">
                  <Film className="w-3 h-3 mr-2" />
                  A Film Memoir
                </Badge>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                <span className="block text-amber-500/50 text-2xl font-light mb-2 tracking-[0.3em]">PRESENTS</span>
                <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
                  {profile?.display_name || "A Story"}
                </span>
              </h1>

              {portfolio?.headline && (
                <motion.div className="relative mb-8">
                  <p className="text-xl text-amber-300/80 font-serif italic leading-relaxed max-w-lg">
                    "{portfolio.headline}"
                  </p>
                </motion.div>
              )}

              <motion.div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="rounded-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-100 shadow-lg px-8"
                  onClick={() => scrollTo('story')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch My Story
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-sm border-amber-700 text-amber-300 hover:bg-amber-900/30 px-8"
                  onClick={() => scrollTo('contact')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send a Letter
                </Button>
              </motion.div>

              {/* Social Links as vintage stamps */}
              {socialLinks.length > 0 && (
                <motion.div
                  className="flex gap-3 mt-8 justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-amber-900/50 border-2 border-amber-700 rounded-sm flex items-center justify-center text-amber-400 hover:bg-amber-800/50 hover:text-amber-200 transition-all"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-amber-500 mt-2 tracking-widest">SCROLL</span>
          </motion.div>
        </div>
      </section>

      {/* Chapter 1: The Story - Postcard Style */}
      {portfolio?.bio && (
        <section id="story" className="py-24 px-6 bg-gradient-to-b from-[#2a2520] to-[#352f28]">
          <div className="max-w-4xl mx-auto">
            <ChapterHeader number="I" title="The Story" />
            
            <VintagePostcard rotation={-1}>
              <div className="grid md:grid-cols-[1fr,auto] gap-8">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <Quote className="w-8 h-8 text-amber-600 flex-shrink-0" />
                    <h3 className="text-2xl font-serif text-slate-700">Dear Reader,</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-loose font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    {portfolio.bio}
                  </p>
                  <p className="text-right mt-6 text-amber-700 font-serif italic">
                    With love,<br />
                    <span className="text-2xl">{profile?.display_name || "Me"}</span>
                  </p>
                </div>
                
                {/* Postcard stamp line */}
                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-amber-300 to-transparent" />
              </div>
            </VintagePostcard>
          </div>
        </section>
      )}

      {/* Chapter 2: Skills - Film Frames */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-[#352f28]">
          <div className="max-w-5xl mx-auto">
            <ChapterHeader number="II" title="My Craft" />

            <div className="space-y-6">
              {skills.map((skill, i) => (
                <FilmStrip key={skill.id} index={i}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-800" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-slate-800">{skill.name}</h3>
                        {skill.category && (
                          <span className="text-sm text-amber-600">{skill.category}</span>
                        )}
                      </div>
                    </div>
                    {skill.proficiency && (
                      <div className="hidden md:flex items-center gap-2">
                        {[...Array(5)].map((_, starI) => (
                          <Star
                            key={starI}
                            className={`w-5 h-5 ${
                              starI < Math.round(skill.proficiency / 20)
                                ? "text-amber-500 fill-amber-500"
                                : "text-amber-200"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </FilmStrip>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chapter 3: Projects - Photo Gallery */}
      {allProjects.length > 0 && (
        <section id="gallery" className="py-24 px-6 bg-gradient-to-b from-[#352f28] to-[#2a2520]">
          <div className="max-w-6xl mx-auto">
            <ChapterHeader number="III" title="The Gallery" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {allProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  {/* Vintage photo with frame */}
                  <div className="bg-[#faf6e9] p-4 shadow-2xl transform group-hover:rotate-0 transition-transform"
                    style={{ transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)` }}
                  >
                    {/* Photo */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover sepia-[0.3] group-hover:sepia-0 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-amber-400" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white hover:bg-amber-500"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Caption */}
                    <div className="mt-4 text-center">
                      <h3 className="font-serif text-lg text-slate-700">{project.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    
                    {/* Date stamp */}
                    <div className="absolute top-6 right-6 bg-amber-600/90 text-white text-xs px-3 py-1 rounded-sm rotate-12">
                      Featured
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chapter 4: Experience & Education - Timeline */}
      {(experiences.length > 0 || education.length > 0) && (
        <section id="journey" className="py-24 px-6 bg-[#2a2520]">
          <div className="max-w-4xl mx-auto">
            <ChapterHeader number="IV" title="The Journey" />

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-600" />

              <div className="space-y-12">
                {/* Experiences */}
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    className="relative pl-20"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-5 h-5 rounded-full bg-amber-500 border-4 border-[#2a2520]" />
                    
                    <HandwrittenNote
                      text={`${exp.position} at ${exp.company}\n\n${exp.description || "A wonderful chapter in my journey."}`}
                      signature={formatDate(exp.start_date) + (exp.is_current ? " - Present" : exp.end_date ? ` - ${formatDate(exp.end_date)}` : "")}
                    />
                  </motion.div>
                ))}

                {/* Education */}
                {education.map((edu, i) => (
                  <motion.div
                    key={edu.id}
                    className="relative pl-20"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (experiences.length + i) * 0.1 }}
                  >
                    <div className="absolute left-6 w-5 h-5 rounded-full bg-rose-500 border-4 border-[#2a2520]" />
                    
                    <HandwrittenNote
                      text={`${edu.degree} in ${edu.field_of_study || "Studies"}\n\n${edu.institution}`}
                      signature={formatDate(edu.start_date) + (edu.is_current ? " - Present" : edu.end_date ? ` - ${formatDate(edu.end_date)}` : "")}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact - Final Letter */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-b from-[#2a2520] to-[#1f1b17]">
        <div className="max-w-2xl mx-auto">
          <ChapterHeader number="V" title="Write to Me" />
          
      <VintagePostcard>
        <div className="space-y-6">
          {portfolio?.phone && (
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="w-5 h-5 text-amber-600" />
                  <span className="font-serif">{portfolio.phone}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <span className="font-serif">{profile.email}</span>
                </div>
              )}
              {portfolio?.location && (
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span className="font-serif">{portfolio.location}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-amber-200">
                <ContactForm portfolioOwnerId={userId || ''} />
              </div>
            </div>
          </VintagePostcard>
        </div>
      </section>

      {/* Footer - Film Credits */}
      <footer className="py-12 bg-[#1f1b17] border-t border-amber-900/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-10 w-auto" />
            ) : (
              <Film className="w-8 h-8 text-amber-500" />
            )}
          </div>
          <p className="text-amber-500/60 font-serif text-sm tracking-wider">
            ★ A {profile?.display_name || "Personal"} Production ★
          </p>
          <p className="text-amber-600/40 text-xs mt-2">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}