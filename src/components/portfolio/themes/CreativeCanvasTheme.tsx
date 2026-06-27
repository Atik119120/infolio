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
  primary: "#FF8A00",
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
  { id: "gallery", label: "Gallery" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const SOFTWARE = [
  { name: "Photoshop", color: "#31A8FF" },
  { name: "Illustrator", color: "#FF9A00" },
  { name: "Figma", color: "#A259FF" },
  { name: "After Effects", color: "#9999FF" },
  { name: "Premiere Pro", color: "#EA77FF" },
  { name: "Blender", color: "#F5792A" },
];

const PRO_SKILLS = [
  "Branding", "Illustration", "UI Design", "Motion Design", "Print Design", "Web Design",
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
          {/* Floating background shapes */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: C.secondary }} />
            <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full blur-3xl opacity-40" style={{ background: C.accent }} />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full blur-2xl opacity-30" style={{ background: C.primary }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left */}
            <div className="relative z-10">
              <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: C.ink, color: C.secondary }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.secondary }} />
                Available for new projects
              </motion.div>

              <motion.h1 {...fadeUp} className="cc-display font-extrabold leading-[0.95] text-[44px] sm:text-6xl lg:text-7xl">
                Hi, I'm <span style={{ color: C.primary }}>{name.split(" ")[0]}</span>.<br />
                <span className="relative inline-block">
                  {headline.split(" ").slice(0, 2).join(" ")}
                  <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none">
                    <path d="M2 8 Q 50 2 100 8 T 198 6" stroke={C.accent} strokeWidth="5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                <span className="cc-display italic font-medium" style={{ color: C.muted }}>{headline.split(" ").slice(2).join(" ")}</span>
              </motion.h1>

              <motion.p {...fadeUp} className="mt-6 text-base md:text-lg max-w-xl" style={{ color: C.muted }}>
                {subline}
              </motion.p>

              <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-3 cc-btn">
                <a href={heroCtaLink} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white hover:scale-[1.03] transition" style={{ background: C.ink }}>
                  {heroCtaText} <ArrowRight size={18} />
                </a>
                <button onClick={() => scrollTo("work")} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border-2 hover:scale-[1.03] transition" style={{ borderColor: C.ink }}>
                  View Portfolio
                </button>
              </motion.div>

              <motion.div {...fadeUp} className="mt-10 flex items-center gap-6 text-sm" style={{ color: C.muted }}>
                <div className="flex -space-x-2">
                  {[C.primary, C.accent, C.secondary].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <span>Trusted by <strong style={{ color: C.ink }}>40+ brands</strong> worldwide</span>
              </motion.div>
            </div>

            {/* Right — image with floating icons */}
            <div className="relative h-[460px] sm:h-[520px] lg:h-[600px]">
              {/* Decorative big yellow blob */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[78%] aspect-square">
                  <div className="absolute inset-0 rounded-[42%_58%_38%_62%/55%_45%_55%_45%] cc-spin-slow" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.primary})` }} />
                  <div className="absolute inset-3 rounded-[40%_60%_40%_60%/50%_50%_50%_50%] overflow-hidden border-4 border-black">
                    {heroImg ? (
                      <img src={heroImg} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center cc-display text-7xl font-bold text-white" style={{ background: C.ink }}>{name.charAt(0)}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating icons */}
              {[
                { Icon: PenTool, top: "8%", left: "6%", bg: C.primary, delay: 0 },
                { Icon: Palette, top: "12%", right: "10%", bg: C.accent, delay: 1 },
                { Icon: Brush, bottom: "18%", left: "4%", bg: C.secondary, delay: 2 },
                { Icon: Lightbulb, bottom: "8%", right: "8%", bg: C.ink, delay: 1.5, fg: C.secondary },
                { Icon: Star, top: "44%", left: "0%", bg: C.ink, delay: 0.5, fg: C.primary },
                { Icon: Heart, top: "38%", right: "2%", bg: C.paper, delay: 2.5, fg: C.primary, ring: true },
              ].map((it: any, i) => (
                <div
                  key={i}
                  className="absolute w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg cc-float"
                  style={{
                    top: it.top, left: it.left, right: it.right, bottom: it.bottom,
                    background: it.bg, animationDelay: `${it.delay}s`,
                    border: it.ring ? `2px solid ${C.ink}` : "none",
                  }}
                >
                  <it.Icon size={22} style={{ color: it.fg || C.paper }} />
                </div>
              ))}

              {/* Sticker badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold cc-display rotate-[-6deg] shadow-md" style={{ background: C.paper, border: `2px solid ${C.ink}` }}>
                ✦ Design Studio ✦
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="relative mt-16 py-5 overflow-hidden border-y" style={{ background: C.ink, borderColor: C.ink }}>
            <div className="cc-marquee">
              {Array.from({ length: 2 }).map((_, k) => (
                <div key={k} className="flex items-center gap-8 px-4 cc-display text-2xl md:text-3xl font-bold whitespace-nowrap">
                  {["Brand Identity", "Illustration", "UI / UX", "Editorial", "Motion", "Packaging", "Print", "Web Design"].map((w, i) => (
                    <span key={i} className="flex items-center gap-8" style={{ color: i % 2 ? C.secondary : C.paper }}>
                      {w} <span style={{ color: C.primary }}>✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {v.about && (
        <section id="about" className="py-20 md:py-28 relative">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden border-4 border-black">
                {aboutImg ? <img src={aboutImg} alt="About" className="w-full h-full object-cover" /> : <div className="w-full h-full" style={{ background: C.secondary }} />}
              </div>
              <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full flex items-center justify-center cc-spin-slow" style={{ background: C.primary }}>
                <span className="cc-display text-xs font-bold text-white">★ HELLO ★ HELLO ★</span>
              </div>
              <div className="absolute -bottom-5 -left-5 px-4 py-3 rounded-2xl cc-display font-bold rotate-[-4deg]" style={{ background: C.accent, border: `2px solid ${C.ink}` }}>
                Let's create<br />something great!
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.secondary }}>
                ABOUT ME
              </div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl leading-tight mb-5">
                Designing with <span style={{ color: C.primary }}>heart</span>, building with <span style={{ color: C.accent }}>craft</span>.
              </h2>
              <p className="text-base md:text-lg mb-8" style={{ color: C.muted }}>{aboutText}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="p-4 rounded-2xl border-2 hover:-translate-y-1 transition" style={{ borderColor: C.ink, background: i % 2 ? C.secondary : C.paper }}>
                    <s.icon size={20} className="mb-2" />
                    <div className="cc-display text-3xl font-extrabold">{s.value}</div>
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {website && (
                <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full cc-btn font-semibold text-white" style={{ background: C.ink }}>
                  <Download size={16} /> Download CV
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      {v.services && services.length > 0 && (
        <section id="services" className="py-20 md:py-28 relative" style={{ background: C.ink, color: C.paper }}>
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.secondary, color: C.ink }}>
                  WHAT I DO
                </div>
                <h2 className="cc-display font-extrabold text-4xl md:text-5xl leading-tight">
                  Services to grow<br />your <span style={{ color: C.secondary }}>brand</span>.
                </h2>
              </div>
              <p className="max-w-md text-sm md:text-base opacity-70">
                Premium design services crafted for modern brands that want to stand out and stay memorable.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <motion.article
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                  key={s.id}
                  className="group relative p-7 rounded-3xl border transition-all hover:-translate-y-1.5"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: [C.primary, C.secondary, C.accent][i % 3], color: C.ink }}>
                    <ServiceIcon icon={s.icon || undefined} className="w-5 h-5" />
                  </div>
                  <h3 className="cc-display text-2xl font-bold mb-2">{s.title}</h3>
                  {s.description && <p className="text-sm opacity-70 mb-5">{s.description}</p>}
                  <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <span className="cc-display font-bold" style={{ color: C.secondary }}>{s.price || "Get in touch"}</span>
                    <button onClick={() => scrollTo("contact")} className="w-9 h-9 rounded-full flex items-center justify-center group-hover:rotate-[-45deg] transition" style={{ background: C.secondary, color: C.ink }}>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WORK — masonry */}
      {v.projects && projects.length > 0 && (
        <section id="work" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div {...fadeUp} className="flex items-end justify-between flex-wrap gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.accent }}>
                  SELECTED WORK
                </div>
                <h2 className="cc-display font-extrabold text-4xl md:text-6xl leading-[0.95]">
                  Recent<br /><span style={{ color: C.primary }} className="italic font-medium">case studies</span>.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 cc-btn">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition"
                    style={{
                      background: filter === c ? C.ink : C.paper,
                      color: filter === c ? C.paper : C.ink,
                      borderColor: C.ink,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5 [&>*]:break-inside-avoid">
              {filteredProjects.map((p, i) => {
                const heights = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[5/4]", "aspect-[4/5]", "aspect-square"];
                const tint = [C.secondary, C.accent, C.primary][i % 3];
                return (
                  <motion.div
                    key={p.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: (i % 6) * 0.05 }}
                    className="group relative rounded-3xl overflow-hidden border-2 cursor-pointer"
                    style={{ borderColor: C.ink }}
                    onClick={() => p.image_url && setLightbox(p.image_url)}
                  >
                    <div className={`relative ${heights[i % heights.length]} overflow-hidden`} style={{ background: tint }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center cc-display text-6xl font-extrabold opacity-30">{p.title.charAt(0)}</div>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-end p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)" }}>
                        <div className="text-white">
                          {p.tech_stack?.[0] && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.secondary }}>{p.tech_stack[0]}</span>}
                          <h3 className="cc-display text-2xl font-bold mt-1">{p.title}</h3>
                          <div className="flex gap-2 mt-3">
                            {p.live_url && <a onClick={(e)=>e.stopPropagation()} href={p.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: C.secondary, color: C.ink }}>Live <ExternalLink size={12} /></a>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between" style={{ background: C.paper }}>
                      <div>
                        <div className="cc-display font-bold">{p.title}</div>
                        {p.tech_stack?.[0] && <div className="text-xs" style={{ color: C.muted }}>{p.tech_stack.slice(0,2).join(" · ")}</div>}
                      </div>
                      <ArrowUpRight size={18} className="group-hover:rotate-[-45deg] transition" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY — bento */}
      {v.projects && projects.length > 0 && (
        <section id="gallery" className="py-20 md:py-28" style={{ background: C.paper }}>
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div {...fadeUp} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.primary, color: C.paper }}>GALLERY</div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl">Moments from the studio</h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-4">
              {projects.slice(0, 8).map((p, i) => {
                const spans = [
                  "col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-2",
                  "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1",
                  "col-span-2 row-span-1", "col-span-1 row-span-1",
                ];
                return (
                  <button
                    key={p.id}
                    onClick={() => p.image_url && setLightbox(p.image_url)}
                    className={`${spans[i % spans.length]} relative rounded-2xl overflow-hidden border-2 group`}
                    style={{ borderColor: C.ink, background: [C.secondary, C.accent, C.primary][i % 3] }}
                  >
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {v.skills && (
        <section id="skills" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.secondary }}>TOOLBOX</div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl mb-8">Software<br />I master daily.</h2>
              <div className="grid grid-cols-2 gap-3">
                {SOFTWARE.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border-2 hover:-translate-y-1 transition" style={{ borderColor: C.ink, background: C.paper }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold cc-display" style={{ background: s.color }}>{s.name.charAt(0)}</div>
                    <span className="font-semibold">{s.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.accent }}>EXPERTISE</div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl mb-8">Skills built<br />over the years.</h2>
              <div className="space-y-4">
                {(skills.length ? skills.slice(0, 6).map(s => ({ name: s.name, level: s.proficiency || 85 })) : PRO_SKILLS.map((n, i) => ({ name: n, level: 95 - i * 5 }))).map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{s.name}</span>
                      <span className="cc-display font-bold" style={{ color: C.primary }}>{s.level}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* EDUCATION timeline */}
      {v.education && education && education.length > 0 && (
        <section id="education" className="py-20 md:py-28" style={{ background: C.paper }}>
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.secondary }}>EDUCATION</div>
              <h2 className="cc-display font-extrabold text-4xl md:text-5xl">Learning journey</h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style={{ background: C.ink }} />
              {education.map((e, i) => (
                <motion.div
                  key={e.id}
                  {...fadeUp}
                  className={`relative mb-10 grid md:grid-cols-2 gap-6 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                    <div className="absolute left-4 md:left-1/2 top-3 w-4 h-4 rounded-full -translate-x-1/2 border-4" style={{ background: C.primary, borderColor: C.paper, boxShadow: `0 0 0 2px ${C.ink}` }} />
                    <span className="cc-display text-sm font-bold" style={{ color: C.primary }}>
                      {e.start_date?.slice(0, 4)}{e.end_date ? ` — ${e.end_date.slice(0, 4)}` : e.is_current ? " — Present" : ""}
                    </span>
                    <h3 className="cc-display text-2xl font-bold mt-1">{e.degree}</h3>
                    <p className="text-sm" style={{ color: C.muted }}>{e.institution}{e.field_of_study ? ` · ${e.field_of_study}` : ""}</p>
                  </div>
                  <div />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {v.contact && (
        <section id="contact" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: C.primary, color: C.paper }}>CONTACT</div>
              <h2 className="cc-display font-extrabold text-4xl md:text-6xl leading-[0.95] mb-4">
                Let's make<br />something <span style={{ color: C.primary }} className="italic font-medium">unforgettable</span>.
              </h2>
              <p className="text-base md:text-lg mb-8" style={{ color: C.muted }}>
                Have a project in mind? Drop a message and let's build something beautiful together.
              </p>

              <div className="space-y-4 mb-8">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-4 p-4 rounded-2xl border-2 hover:-translate-y-1 transition" style={{ borderColor: C.ink, background: C.paper }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.secondary }}><Mail size={20} /></div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold" style={{ color: C.muted }}>Email</div>
                      <div className="font-semibold">{email}</div>
                    </div>
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="flex items-center gap-4 p-4 rounded-2xl border-2 hover:-translate-y-1 transition" style={{ borderColor: C.ink, background: C.paper }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.accent }}><Phone size={20} /></div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold" style={{ color: C.muted }}>Phone</div>
                      <div className="font-semibold">{phone}</div>
                    </div>
                  </a>
                )}
                {location && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl border-2" style={{ borderColor: C.ink, background: C.paper }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.primary, color: C.paper }}><MapPin size={20} /></div>
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold" style={{ color: C.muted }}>Location</div>
                      <div className="font-semibold">{location}</div>
                    </div>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map(l => {
                    const Icon = getSocialIcon(l.platform);
                    return (
                      <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full flex items-center justify-center border-2 hover:-translate-y-1 transition" style={{ borderColor: C.ink, background: C.paper }}>
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div {...fadeUp} className="p-6 md:p-8 rounded-3xl border-4" style={{ borderColor: C.ink, background: C.secondary }}>
              <h3 className="cc-display text-2xl font-extrabold mb-4">Send a message</h3>
              {userId ? (
                <ContactForm portfolioOwnerId={userId} variant="default" />
              ) : (
                <p className="text-sm" style={{ color: C.ink }}>Contact form unavailable in demo mode.</p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="relative pt-20 pb-10 overflow-hidden" style={{ background: C.ink, color: C.paper }}>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full blur-3xl" style={{ background: C.primary }} />
          <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full blur-3xl" style={{ background: C.accent }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="cc-display font-extrabold text-3xl mb-3">{name}<span style={{ color: C.primary }}>.</span></div>
              <p className="text-sm opacity-70 max-w-xs">Creative graphic designer crafting bold brands and editorial visuals.</p>
            </div>
            <div>
              <h4 className="cc-display font-bold mb-4" style={{ color: C.secondary }}>Navigation</h4>
              <ul className="space-y-2 text-sm opacity-80">
                {NAV.slice(0, 5).map(n => (
                  <li key={n.id}><button onClick={() => scrollTo(n.id)} className="hover:opacity-100 opacity-80">{n.label}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="cc-display font-bold mb-4" style={{ color: C.secondary }}>Get in touch</h4>
              {email && <p className="text-sm opacity-80">{email}</p>}
              {phone && <p className="text-sm opacity-80">{phone}</p>}
              {socialLinks.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {socialLinks.map(l => {
                    const Icon = getSocialIcon(l.platform);
                    return <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20"><Icon size={15} /></a>;
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <span>{footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}</span>
            <span>Crafted with <Heart size={12} className="inline" style={{ color: C.primary }} /> + a lot of coffee.</span>
          </div>
        </div>
      </footer>

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
