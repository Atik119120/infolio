import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ArrowRight, ArrowUpRight, Mail, Phone, MapPin, ExternalLink,
  Sparkles, Palette, PenTool, Brush, MousePointer2, Lightbulb, Star, Heart,
  Download, ChevronUp, Award, Briefcase, Users, Smile,
} from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";

/**
 * Creative Canvas — editorial, playful, premium portfolio for graphic designers.
 * Palette: Orange #FF8A00 · Yellow #FFD54A · Sky Blue #58C7FF · Black #111 · Soft White #FCFCFC
 */
const C = {
  primary: "#F5A623",
  secondary: "#FFD54A",
  accent: "#58C7FF",
  ink: "#111111",
  bg: "#FCFCFC",
  paper: "#FFFFFF",
  muted: "#6b6b6b",
  border: "rgba(17,17,17,0.08)",
};

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const DEFAULT_SOFTWARE = [
  { name: "Photoshop", slug: "photoshop" },
  { name: "Illustrator", slug: "illustrator" },
  { name: "Figma", slug: "figma" },
  { name: "After Effects", slug: "aftereffects" },
  { name: "Premiere Pro", slug: "premierepro" },
  { name: "Blender", slug: "blender" },
];

const DEFAULT_MARQUEE = ["Brand Identity", "Illustration", "UI / UX", "Editorial", "Motion", "Packaging", "Print", "Web Design"];

const PRO_SKILLS = [
  "Logo Design", "Motion Design", "Static Design", "Branding", "Packaging",
];

const fonts =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap";

export default function CreativeCanvasTheme({
  profile, portfolio, skills, projects, services = [], socialLinks, experiences, education, userId,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Inject fonts
  useEffect(() => {
    if (document.querySelector('link[data-creative-canvas-fonts]')) return;
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = fonts; l.setAttribute("data-creative-canvas-fonts", "true");
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      setShowTop(window.scrollY > 600);
      const offsets = NAV.map(n => {
        const el = document.getElementById(n.id);
        if (!el) return { id: n.id, top: Infinity };
        const r = el.getBoundingClientRect();
        return { id: n.id, top: Math.abs(r.top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setActive(offsets[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const headline = portfolio?.hero_headline || portfolio?.headline || "Graphic Designer & Visual Storyteller";
  const subline = portfolio?.hero_subheadline || "I design bold brands, playful illustrations, and editorial visuals that make people stop scrolling.";
  const heroImg = portfolio?.hero_image_url || profile?.avatar_url;
  const aboutImg = portfolio?.about_image_url || profile?.avatar_url;
  const aboutText = portfolio?.about_text || portfolio?.bio || subline;
  const heroCtaText = portfolio?.hero_cta_text || "Hire Me";
  const heroCtaLink = portfolio?.hero_cta_link || "#contact";
  const footerText = portfolio?.footer_text;
  const email = profile?.email;
  const phone = portfolio?.phone;
  const location = portfolio?.location;
  const website = portfolio?.website;
  const marqueeWords: string[] = Array.isArray((portfolio as any)?.hero_marquee_words) && (portfolio as any).hero_marquee_words.length
    ? (portfolio as any).hero_marquee_words
    : DEFAULT_MARQUEE;
  const softwareList: { name: string; slug: string }[] = Array.isArray((portfolio as any)?.theme_software) && (portfolio as any).theme_software.length
    ? (portfolio as any).theme_software
    : DEFAULT_SOFTWARE;

  const v = {
    hero: isVisible(portfolio, "hero"),
    about: isVisible(portfolio, "about"),
    services: isVisible(portfolio, "services"),
    projects: isVisible(portfolio, "projects"),
    skills: isVisible(portfolio, "skills"),
    education: isVisible(portfolio, "education"),
    contact: isVisible(portfolio, "contact"),
  };

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    projects.forEach(p => (p.tech_stack || []).forEach(t => set.add(t)));
    return Array.from(set).slice(0, 8);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter(p => (p.tech_stack || []).includes(filter));
  }, [projects, filter]);

  const stats = [
    { icon: Award, label: "Years", value: experiences?.length ? `${Math.max(1, experiences.length * 2)}+` : "5+" },
    { icon: Briefcase, label: "Projects", value: projects.length ? `${projects.length}+` : "120+" },
    { icon: Users, label: "Clients", value: "40+" },
    { icon: Smile, label: "Awards", value: "08" },
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, ease: "easeOut" as const },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.8, ease: "easeOut" as const },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.92 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  const slideLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease: "easeOut" as const },
  };

  const slideRight = {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease: "easeOut" as const },
  };


  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Inter', sans-serif" }} className="min-h-screen overflow-x-hidden">
      <style>{`
        .cc-display { font-family: 'Bricolage Grotesque', 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
        .cc-btn { font-family: 'Space Grotesk', sans-serif; }
        @keyframes ccfloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-14px) rotate(4deg)} }
        @keyframes ccspin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ccmarq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .cc-float { animation: ccfloat 6s ease-in-out infinite; }
        .cc-spin-slow { animation: ccspin 20s linear infinite; }
        .cc-marquee { display:flex; width:max-content; animation: ccmarq 30s linear infinite; }
        .cc-grain::before { content:''; position:absolute; inset:0; background-image:radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px); background-size:3px 3px; pointer-events:none; }
        .cc-link-underline { background-image: linear-gradient(${C.primary},${C.primary}); background-repeat:no-repeat; background-size:0% 2px; background-position:left 100%; transition: background-size 0.4s ease; }
        .cc-link-underline:hover, .cc-active { background-size: 100% 2px; }
      `}</style>

      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 cc-display font-extrabold text-xl">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: C.ink }}>
              <Sparkles size={16} style={{ color: C.secondary }} />
            </span>
            <span>{name.split(" ")[0]}<span style={{ color: C.primary }}>.</span></span>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={`cc-link-underline ${active === n.id ? "cc-active" : ""}`}
                style={{ color: active === n.id ? C.ink : C.muted }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("contact")}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold cc-btn text-white hover:scale-[1.03] transition"
              style={{ background: C.ink }}
            >
              Let's Talk <ArrowUpRight size={16} />
            </button>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2"><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed inset-0 z-[60] lg:hidden"
            style={{ background: C.paper }}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: C.border }}>
              <span className="cc-display font-extrabold text-xl">{name}</span>
              <button onClick={() => setMenuOpen(false)}><X size={26} /></button>
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {NAV.map(n => (
                <button key={n.id} onClick={() => scrollTo(n.id)} className="text-left cc-display text-3xl font-bold py-3 border-b" style={{ borderColor: C.border }}>
                  {n.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      {v.hero && (
        <section id="home" className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden cc-grain">



          <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: C.ink, color: C.secondary }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.secondary }} />
                Available for new projects
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="cc-display font-extrabold leading-[1.02] text-[36px] sm:text-5xl lg:text-6xl xl:text-7xl">
                Hi, I'm <span style={{ color: C.primary }}>{name.split(" ")[0]}</span>.<br />
                <span className="relative inline-block">
                  {headline.split(" ").slice(0, 2).join(" ")}
                  <motion.svg initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="absolute -bottom-1.5 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                    <motion.path d="M2 6 Q 50 1 100 6 T 198 4" stroke={C.accent} strokeWidth="4" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </span>{" "}
                <span className="cc-display italic font-medium text-[30px] sm:text-4xl lg:text-5xl" style={{ color: C.muted }}>{headline.split(" ").slice(2).join(" ")}</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-6 text-sm md:text-base max-w-lg mx-auto" style={{ color: C.muted }}>
                {subline}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="mt-7 flex flex-wrap gap-3 cc-btn justify-center">
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} href={heroCtaLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white" style={{ background: C.ink }}>
                  {heroCtaText} <ArrowRight size={16} />
                </motion.a>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => scrollTo("work")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2" style={{ borderColor: C.ink }}>
                  View Portfolio
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-10 flex items-center gap-6 text-sm justify-center" style={{ color: C.muted }}>
                <div className="flex -space-x-2">
                  {[C.primary, C.accent, C.secondary].map((c, i) => (
                    <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.5, delay: 0.8 + i * 0.1, type: "spring" }} className="w-9 h-9 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <span>Trusted by <strong style={{ color: C.ink }}>40+ brands</strong> worldwide</span>
              </motion.div>

            </div>

          </div>



          {/* Marquee — tilted ribbon */}
          <div className="relative mt-16 -mx-10">
            <div className="py-5 overflow-hidden border-y -rotate-1 shadow-xl" style={{ background: C.ink, borderColor: C.ink }}>
              <div className="cc-marquee">
                {Array.from({ length: 2 }).map((_, k) => (
                  <div key={k} className="flex items-center gap-8 px-4 cc-display text-2xl md:text-3xl font-bold whitespace-nowrap">
                    {marqueeWords.map((w, i) => (
                      <span key={i} className="flex items-center gap-8" style={{ color: i % 2 ? C.secondary : C.paper }}>
                        {w} <span style={{ color: C.primary }}>✦</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {v.about && (
        <section id="about" className="py-10 md:py-14 relative overflow-hidden" style={{ background: C.paper }}>
          {/* huge background word */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-6 text-center cc-display font-extrabold tracking-tighter select-none" style={{ fontSize: "clamp(120px, 22vw, 320px)", color: C.ink, opacity: 0.04, lineHeight: 0.9 }}>
            ABOUT
          </div>

          <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
            {/* section marker */}
            <motion.div {...fadeUp} className="flex items-center gap-3 mb-10">
              <span className="cc-display text-xs font-bold opacity-50">02 —</span>
              <span className="h-px w-10" style={{ background: C.ink, opacity: 0.3 }} />
              <span className="text-[10px] font-extrabold tracking-[0.3em]">ABOUT ME</span>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* LEFT — editorial frame */}
              <motion.div {...slideLeft} whileHover={{ rotate: -1, scale: 1.01 }} className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-sm">
                  {/* accent block behind */}
                  <div className="absolute -inset-3 rounded-[8px]" style={{ background: C.primary }} />
                  <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full border-2" style={{ borderColor: C.ink, background: C.accent }} />
                  {/* main frame */}
                  <div className="relative rounded-[8px] border-2 overflow-hidden" style={{ borderColor: C.ink, background: C.paper, boxShadow: `8px 8px 0 ${C.ink}` }}>
                    {/* top meta strip */}
                    <div className="flex items-center justify-between px-4 py-2 border-b-2" style={{ borderColor: C.ink, background: C.paper }}>
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: C.ink }}>Portrait / 01</span>
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60" style={{ color: C.ink }}>NO. 026</span>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {aboutImg ? <img src={aboutImg} alt="About" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700" /> : <div className="w-full h-full" style={{ background: C.secondary }} />}
                      {/* corner ticks */}
                      <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: C.paper }} />
                      <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: C.paper }} />
                      <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: C.paper }} />
                      <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: C.paper }} />
                    </div>
                    {/* bottom caption strip — barcode style */}
                    <div className="px-4 py-3 border-t-2 flex items-center justify-between gap-3" style={{ borderColor: C.ink, background: C.paper }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: C.primary }} />
                        <div className="cc-display italic text-base font-bold truncate" style={{ color: C.ink }}>{name.split(" ")[0]}.</div>
                      </div>
                      {/* barcode lines */}
                      <div className="hidden sm:flex items-center gap-[2px] h-4 opacity-80" aria-hidden>
                        {[3,1,2,1,3,1,2,2,1,3,1,2].map((w, i) => (
                          <span key={i} className="h-full" style={{ width: `${w}px`, background: C.ink }} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70" style={{ color: C.ink }}>est. {new Date().getFullYear() - 8}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* RIGHT — copy + stats ticker */}
              <motion.div {...slideRight} className="lg:col-span-7">
                {/* big quote mark */}
                <div className="cc-display font-extrabold leading-none mb-2" style={{ fontSize: "80px", color: C.primary }}>
                  &ldquo;
                </div>
                <h2 className="cc-display font-extrabold text-3xl md:text-5xl leading-[1.05] mb-6 -mt-4">
                  Designing with <span style={{ color: C.primary }}>heart</span>,<br />
                  building with <span className="italic" style={{ color: C.accent }}>craft.</span>
                </h2>
                <p className="text-base md:text-lg mb-8 max-w-xl" style={{ color: C.muted }}>{aboutText}</p>

                {/* stats — horizontal divider strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 divide-x-2 mb-8" style={{ borderColor: C.ink, ['--tw-divide-opacity' as any]: 1 }}>
                  {stats.map((s, i) => (
                    <div key={i} className="py-2.5 px-3 group hover:bg-black hover:text-white transition" style={{ borderColor: C.ink }}>
                      <div className="flex items-center gap-2 mb-1">
                        <s.icon size={12} className="opacity-60" />
                        <span className="text-[9px] font-bold tracking-[0.2em] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="cc-display text-2xl md:text-3xl font-extrabold leading-none">{s.value}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-70">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {website && (
                    <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full cc-btn font-semibold text-white" style={{ background: C.ink }}>
                      <Download size={16} /> Download CV
                    </a>
                  )}
                  {/* signature */}
                  <div className="cc-display italic text-2xl md:text-3xl font-bold" style={{ color: C.ink }}>
                    {name}
                    <span style={{ color: C.primary }}>.</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}


      {/* SERVICES */}
      {v.services && services.length > 0 && (
        <section id="services" className="py-10 md:py-14 relative" style={{ background: C.ink, color: C.paper }}>
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div {...fadeUp} className="mb-10">
              {/* Editorial header band — matches Work */}
              <div className="relative border-2 rounded-3xl px-5 py-6 md:px-10 md:py-8 overflow-hidden" style={{ borderColor: C.primary, background: "rgba(255,255,255,0.03)", boxShadow: `8px 8px 0 ${C.primary}` }}>
                {/* corner sticker */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full border-2 text-[10px] font-extrabold tracking-[0.25em] rotate-[8deg]" style={{ borderColor: C.primary, background: C.primary, color: C.ink }}>
                  SERVICES ’26
                </div>

                <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="cc-display text-xs font-bold tracking-[0.4em] opacity-50">03 —</span>
                      <span className="h-px w-12" style={{ background: "rgba(255,255,255,0.4)" }} />
                      <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: C.primary }}>WHAT I DO</span>
                    </div>
                    <h2 className="cc-display font-extrabold text-4xl md:text-6xl leading-[0.95]">
                      Services to grow<br />
                      your{" "}
                      <span className="relative inline-block italic font-medium" style={{ color: C.primary }}>
                        brand
                        <span aria-hidden className="absolute left-0 right-0 -bottom-1 h-[6px] -rotate-1 opacity-70" style={{ background: C.primary }} />
                      </span>
                      <span style={{ color: C.primary }}>.</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="h-16 w-px hidden md:block" style={{ background: "rgba(255,255,255,0.2)" }} />
                    <div className="text-right">
                      <div className="cc-display text-5xl md:text-6xl font-extrabold leading-none">
                        {String(services.length).padStart(2, "0")}
                        <span style={{ color: C.primary }}>/</span>
                        <span className="text-2xl md:text-3xl opacity-50">SVC</span>
                      </div>
                      <div className="text-[10px] font-bold tracking-[0.3em] mt-1 opacity-60">PREMIUM DESIGN</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((s, i) => {
                const accent = C.primary;
                return (
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6, scale: 1.02, borderColor: accent }}
                    key={s.id}
                    className="group relative p-5 rounded-2xl border overflow-hidden cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <span className="absolute top-4 right-5 cc-display text-[10px] font-bold opacity-30">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: accent, color: C.ink }}>
                      <ServiceIcon icon={s.icon || undefined} className="w-4 h-4" />
                    </div>
                    <h3 className="relative cc-display text-lg font-bold mb-1">{s.title}</h3>
                    {s.description && <p className="relative text-xs opacity-70 mb-4 line-clamp-1">{s.description}</p>}
                    <div className="relative flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                      <span className="cc-display text-sm font-bold" style={{ color: accent }}>{s.price || "Get in touch"}</span>
                      <button onClick={() => scrollTo("contact")} className="w-8 h-8 rounded-full flex items-center justify-center group-hover:rotate-[-45deg] transition" style={{ background: accent, color: C.ink }}>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WORK — masonry */}
      {v.projects && projects.length > 0 && (
        <section id="work" className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div {...fadeUp} className="mb-10">
              {/* Editorial header band */}
              <div className="relative border-2 rounded-3xl px-5 py-6 md:px-10 md:py-8 overflow-hidden" style={{ borderColor: C.ink, background: C.paper, boxShadow: `8px 8px 0 ${C.ink}` }}>
                {/* corner sticker */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full border-2 text-[10px] font-extrabold tracking-[0.25em] rotate-[8deg]" style={{ borderColor: C.ink, background: C.accent, color: C.ink }}>
                  PORTFOLIO ’26
                </div>

                <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="cc-display text-xs font-bold tracking-[0.4em]" style={{ color: C.muted }}>03 —</span>
                      <span className="h-px w-12" style={{ background: C.ink }} />
                      <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: C.ink }}>SELECTED WORK</span>
                    </div>
                    <h2 className="cc-display font-extrabold text-4xl md:text-6xl leading-[0.95]">
                      A peek at my<br />
                      <span style={{ color: C.primary }} className="italic font-medium">favorite</span>{" "}
                      <span className="relative inline-block">
                        projects
                        <span aria-hidden className="absolute left-0 right-0 -bottom-1 h-[6px] -rotate-1" style={{ background: C.accent }} />
                      </span>
                      <span style={{ color: C.primary }}>.</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="h-16 w-px hidden md:block" style={{ background: C.ink }} />
                    <div className="text-right">
                      <div className="cc-display text-5xl md:text-6xl font-extrabold leading-none" style={{ color: C.ink }}>
                        {String(filteredProjects.length).padStart(2, "0")}
                        <span style={{ color: C.primary }}>/</span>
                        <span className="text-2xl md:text-3xl" style={{ color: C.muted }}>{String(projects.length).padStart(2, "0")}</span>
                      </div>
                      <div className="text-[10px] font-bold tracking-[0.3em] mt-1" style={{ color: C.muted }}>SHOWN / TOTAL</div>
                    </div>
                  </div>
                </div>

                {/* Pill filter tabs */}
                <div className="mt-7 flex flex-wrap gap-2 cc-btn">
                  {categories.map(c => {
                    const isActive = filter === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setFilter(c)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition"
                        style={{
                          borderColor: C.ink,
                          background: isActive ? C.ink : "transparent",
                          color: isActive ? C.paper : C.ink,
                          boxShadow: isActive ? `3px 3px 0 ${C.primary}` : "none",
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>




            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4 [&>*]:break-inside-avoid">
              {filteredProjects.map((p, i) => {
                const heights = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[3/5]", "aspect-[4/3]", "aspect-[2/3]", "aspect-[5/4]", "aspect-[3/4]"];
                const tint = [C.secondary, C.accent, C.primary, C.ink][i % 4];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: (i % 8) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, rotate: i % 2 ? 0.5 : -0.5 }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl"
                    onClick={() => p.image_url && setLightbox(p.image_url)}
                  >
                    <div className={`relative ${heights[i % heights.length]} overflow-hidden`} style={{ background: tint }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center cc-display text-5xl font-extrabold opacity-30">{p.title.charAt(0)}</div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3 md:p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.1) 60%, transparent)" }}>
                        <div className="flex justify-end">
                          {p.live_url && (
                            <a onClick={(e)=>e.stopPropagation()} href={p.live_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.paper, color: C.ink }}>
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <div className="text-white">
                          {p.tech_stack?.[0] && <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.secondary }}>{p.tech_stack[0]}</span>}
                          <h3 className="cc-display text-base md:text-lg font-bold leading-tight mt-0.5 line-clamp-2">{p.title}</h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {v.skills && (
        <section id="skills" className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12">
            <motion.div {...slideLeft}>
              <div className="flex items-center gap-3 mb-4">
                <span className="cc-display text-xs font-bold tracking-[0.4em]" style={{ color: C.muted }}>04 —</span>
                <span className="h-px w-10" style={{ background: C.ink }} />
                <span className="text-[10px] font-bold tracking-[0.3em]">TOOLBOX</span>
              </div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl mb-8">Software<br /><span className="italic font-medium" style={{ color: C.primary }}>I master daily.</span></h2>
              <div className="grid grid-cols-2 gap-0 border-l border-t" style={{ borderColor: C.ink }}>
                {softwareList.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, backgroundColor: C.secondary }}
                    className="group relative flex items-center gap-3 p-4 border-r border-b" style={{ borderColor: C.ink }}
                  >
                    <span className="cc-display text-[10px] font-bold absolute top-2 right-2 tracking-wider" style={{ color: C.muted }}>0{i + 1}</span>
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }} className="w-10 h-10 flex items-center justify-center shrink-0">
                      <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.slug}/${s.slug}-original.svg`}
                        alt={`${s.name} logo`}
                        className="w-9 h-9 object-contain"
                        loading="lazy"
                      />
                    </motion.div>
                    <span className="font-semibold text-sm">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...slideRight}>
              <div className="flex items-center gap-3 mb-4">
                <span className="cc-display text-xs font-bold tracking-[0.4em]" style={{ color: C.muted }}>05 —</span>
                <span className="h-px w-10" style={{ background: C.ink }} />
                <span className="text-[10px] font-bold tracking-[0.3em]">EDUCATION</span>
              </div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl mb-8">Learning<br /><span className="italic font-medium" style={{ color: C.primary }}>journey.</span></h2>
              <div className="grid grid-cols-2 gap-0 border-2 rounded-2xl overflow-hidden" style={{ borderColor: C.ink }}>
                {(education && education.length > 0 ? education : []).slice(0, 2).map((e, i) => (
                  <div key={e.id} className={`relative p-5 ${i === 0 ? "border-r-2" : ""}`} style={{ borderColor: C.ink }}>
                    <span className="absolute top-3 right-4 cc-display text-[10px] font-bold opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full border-2" style={{ background: C.primary, borderColor: C.ink }} />
                      <span className="cc-display text-xs font-bold tracking-wider" style={{ color: C.primary }}>
                        {e.start_date?.slice(0, 4)}{e.end_date ? ` — ${e.end_date.slice(0, 4)}` : e.is_current ? " — Present" : ""}
                      </span>
                    </div>
                    <h3 className="cc-display text-xl font-bold leading-tight">{e.degree}</h3>
                    <p className="text-sm mt-1 line-clamp-1" style={{ color: C.muted }}>{e.institution}{e.field_of_study ? ` · ${e.field_of_study}` : ""}</p>
                  </div>
                ))}
                {(!education || education.length === 0) && (
                  <p className="text-sm p-5 col-span-2" style={{ color: C.muted }}>Add your education from the editor.</p>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}



      {/* CONTACT — single hero card */}
      {v.contact && (
        <section id="contact" className="py-10 md:py-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div
              {...scaleIn}
              whileHover={{ y: -4 }}
              className="relative rounded-[32px] border-2 px-6 py-8 md:px-12 md:py-10 text-center overflow-hidden"
              style={{ borderColor: C.ink, background: C.secondary, boxShadow: `14px 14px 0 ${C.ink}` }}
            >
              {/* dotted bg */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: `radial-gradient(${C.ink} 1.2px, transparent 1.4px)`,
                backgroundSize: "16px 16px",
              }} />
              {/* corner stickers */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 flex items-center justify-center cc-display font-extrabold" style={{ borderColor: C.ink, background: C.accent, color: C.ink }}>✦</motion.div>
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-full border-2 text-[10px] font-bold tracking-[0.25em] rotate-[6deg]" style={{ borderColor: C.ink, background: C.primary, color: C.paper }}>LET'S TALK</motion.div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.3em] mb-5 border-2" style={{ borderColor: C.ink, background: C.paper, color: C.ink }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.primary }} />
                  AVAILABLE FOR WORK
                </div>
                <h2 className="cc-display font-extrabold text-4xl md:text-6xl leading-[0.95] mb-3" style={{ color: C.ink }}>
                  Got a project<br />
                  <span className="italic font-medium" style={{ color: C.primary }}>in mind</span>
                  <span style={{ color: C.accent }}>?</span>
                </h2>
                <p className="text-sm md:text-base max-w-md mx-auto mb-8" style={{ color: C.ink, opacity: 0.7 }}>
                  Drop a line — I usually reply within 24 hours.
                </p>

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="group inline-flex items-center gap-3 px-7 py-4 rounded-full cc-display font-extrabold text-base md:text-lg border-2 transition hover:-translate-y-1"
                    style={{ background: C.ink, color: C.paper, borderColor: C.ink, boxShadow: `6px 6px 0 ${C.primary}` }}
                  >
                    <Mail size={18} />
                    <span className="break-all">{email}</span>
                    <ArrowUpRight size={18} className="group-hover:rotate-45 transition" />
                  </a>
                )}

                {/* secondary row */}
                <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-bold" style={{ color: C.ink }}>
                  {phone && (
                    <a href={`tel:${phone}`} className="flex items-center gap-2 hover:underline underline-offset-4">
                      <Phone size={14} /> {phone}
                    </a>
                  )}
                  {location && (
                    <span className="flex items-center gap-2 opacity-80">
                      <MapPin size={14} /> {location}
                    </span>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {socialLinks.map(l => {
                      const Icon = getSocialIcon(l.platform);
                      return (
                        <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition hover:-translate-y-1"
                          style={{ borderColor: C.ink, background: C.paper, color: C.ink }}
                          aria-label={l.platform}>
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 pt-5 border-t-2 border-dashed text-[11px] font-bold tracking-[0.2em] uppercase" style={{ borderColor: C.ink, color: C.ink, opacity: 0.7 }}>
                  {footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white"
            style={{ background: C.primary }}
            aria-label="Back to top"
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.92)" }}
          >
            <button className="absolute top-5 right-5 text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightbox} alt="" className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
