import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, ArrowUpRight, Mail, Phone, MapPin, Globe, TrendingUp, BarChart3, Search, Target, Zap, LineChart, Users } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";

/**
 * Growth Lab — Digital Marketer & SEO Expert theme.
 * Sections: Header → Hero (dashboard-style) → About → Services →
 *           Projects & Clients → Contact → Footer
 */
const C = {
  primary: "#7c3aed", // violet
  accent: "#22c55e", // green growth
  warning: "#f59e0b",
  bg: "#0b1020",
  bg2: "#0f1530",
  surface: "#111936",
  surface2: "#172145",
  ink: "#f1f5f9",
  muted: "#94a3b8",
  border: "#1e293b",
};

export default function PRDDigitalMarketerTheme({
  profile,
  portfolio,
  projects,
  services = [],
  socialLinks,
  experiences,
  userId,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const headline = portfolio?.hero_headline || portfolio?.headline || "Digital Marketer & SEO Expert";
  const bio = portfolio?.bio || "I help brands grow with data-driven marketing.";
  const aboutText = portfolio?.about_text || bio;
  const heroImage = portfolio?.hero_image_url || profile?.avatar_url;
  const aboutImage = portfolio?.about_image_url || profile?.avatar_url;
  const heroCtaText = portfolio?.hero_cta_text;
  const heroCtaLink = portfolio?.hero_cta_link;
  const footerText = portfolio?.footer_text;
  const email = profile?.email;
  const phone = portfolio?.phone;
  const location = portfolio?.location;
  const website = portfolio?.website;

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 },
  };

  const NAV = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "work", label: "Work" },
    { id: "contact", label: "Contact" },
  ];

  // Clients = unique companies from experiences
  const clients = useMemo(() => {
    const seen = new Set<string>();
    return experiences
      .map((e) => e.company)
      .filter((c) => c && !seen.has(c) && (seen.add(c), true));
  }, [experiences]);

  // Fake but data-grounded growth chart data
  const chartPoints = useMemo(() => {
    const seed = projects.length + experiences.length + 1;
    return Array.from({ length: 12 }, (_, i) => {
      const v = 20 + (i * 6) + Math.sin((i + seed) * 0.7) * 12 + (i > 7 ? i * 4 : 0);
      return Math.max(15, Math.min(95, v));
    });
  }, [projects.length, experiences.length]);

  const chartPath = useMemo(() => {
    const w = 300, h = 100;
    const step = w / (chartPoints.length - 1);
    return chartPoints
      .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / 100) * h}`)
      .join(" ");
  }, [chartPoints]);

  const chartArea = `${chartPath} L 300 100 L 0 100 Z`;

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        .gl-display { font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .gl-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .gl-btn-primary { background: linear-gradient(135deg, ${C.primary}, #a855f7); color: #fff; transition: all .2s; }
        .gl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 40px ${C.primary}66; }
        .gl-btn-outline { border: 1px solid ${C.border}; color: ${C.ink}; transition: all .2s; }
        .gl-btn-outline:hover { border-color: ${C.primary}; color: ${C.primary}; }
        .gl-link { transition: color .2s; }
        .gl-link:hover { color: ${C.primary}; }
        .gl-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px -10px rgba(0,0,0,0.5); }
        .gl-grid-bg {
          background-image: linear-gradient(${C.border}55 1px, transparent 1px), linear-gradient(90deg, ${C.border}55 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse at center, #000 30%, transparent 70%);
        }
        @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .6; transform: scale(1.2); } }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      {/* HEADER — slim floating pill */}
      <header className="sticky top-3 z-40 px-3 md:px-5">
        <div className="container mx-auto gx-glass-nav rounded-full px-4 md:px-5 py-2.5 flex items-center justify-between max-w-6xl">
          <a href="#home" className="gl-display text-base font-bold tracking-tight flex items-center gap-2">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-7 w-auto object-contain" />
            ) : (
              <>
                <div className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}>
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span>{name.split(" ")[0]}<span style={{ color: C.primary }}>.</span></span>
              </>
            )}
          </a>
          <nav className="hidden md:flex items-center gap-1 text-[12px] font-medium">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="gl-link px-3 py-1.5 rounded-full hover:bg-white/10 transition" style={{ color: C.muted }}>{n.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#contact" className="gl-btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full">
              Audit <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-2 container mx-auto max-w-6xl gx-glass-nav rounded-2xl">
            <div className="px-5 py-3 flex flex-col gap-2">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="py-2 text-sm">{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO — split: text + dashboard preview */}
      <section id="home" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 gl-grid-bg" />
        <div aria-hidden className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${C.primary}, transparent 60%)` }} />
        <div aria-hidden className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${C.accent}, transparent 60%)` }} />

        <div className="container mx-auto px-5 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-xs font-semibold"
                style={{ background: `${C.accent}15`, color: C.accent, border: `1px solid ${C.accent}33` }}>
                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: C.accent }} />
                Currently accepting Q1 2026 clients
              </div>
              <h1 className="gl-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1] tracking-tight mb-6">
                Hi, I'm <span style={{ background: `linear-gradient(135deg, ${C.primary}, #a855f7)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{name.split(" ")[0]}</span>
                <br />
                I scale brands with{" "}
                <span style={{ color: C.accent }}>SEO</span> &amp;{" "}
                <span style={{ color: C.warning }}>data</span>.
              </h1>
              <p className="text-base md:text-lg mb-8 max-w-xl" style={{ color: C.muted }}>
                {headline}. {bio}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <a href={heroCtaLink || "#contact"} className="gl-btn-primary px-7 py-3.5 text-sm font-bold rounded-lg inline-flex items-center gap-2">
                  {heroCtaText || "Get Free Growth Audit"} <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#work" className="gl-btn-outline px-7 py-3.5 text-sm font-bold rounded-lg">
                  See Case Studies
                </a>
              </div>

              {/* Mini KPI strip */}
              <div className="grid grid-cols-3 gap-3">
                <KpiMini icon={<TrendingUp className="w-4 h-4" />} value={`+${280}%`} label="Avg ROAS" />
                <KpiMini icon={<Users className="w-4 h-4" />} value={`${clients.length || projects.length}+`} label="Clients" />
                <KpiMini icon={<Target className="w-4 h-4" />} value={`${experiences.length || 5}+ yrs`} label="Experience" />
              </div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-6">
              <div className="gl-card p-5 md:p-6 relative" style={{ boxShadow: `0 30px 60px -20px ${C.primary}55` }}>
                {/* Window dots */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#eab308" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
                  <div className="ml-3 text-[11px] gl-mono" style={{ color: C.muted }}>growth.dashboard</div>
                </div>

                {/* Chart card */}
                <div className="rounded-xl p-5 mb-4" style={{ background: C.bg2, border: `1px solid ${C.border}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>Organic Traffic</div>
                      <div className="gl-display text-3xl font-bold mt-1">+342%</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md"
                      style={{ background: `${C.accent}22`, color: C.accent }}>
                      <ArrowUpRight className="w-3 h-3" /> +24%
                    </div>
                  </div>
                  <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                    <defs>
                      <linearGradient id="gl-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.primary} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={chartArea}
                      fill="url(#gl-area)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                    <motion.path
                      d={chartPath}
                      fill="none"
                      stroke={C.primary}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    {chartPoints.map((v, i) => (
                      <circle key={i} cx={i * (300 / (chartPoints.length - 1))} cy={100 - v} r={i === chartPoints.length - 1 ? 4 : 2}
                        fill={i === chartPoints.length - 1 ? C.accent : C.primary} />
                    ))}
                  </svg>
                </div>

                {/* Mini metric grid */}
                <div className="grid grid-cols-3 gap-3">
                  <MetricCard icon={<Search className="w-4 h-4" />} label="Keywords" value="1.2K" trend="+18%" color={C.accent} />
                  <MetricCard icon={<BarChart3 className="w-4 h-4" />} label="Conversion" value="4.8%" trend="+62%" color={C.primary} />
                  <MetricCard icon={<Zap className="w-4 h-4" />} label="ROAS" value="6.2x" trend="+41%" color={C.warning} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28" style={{ background: C.bg2 }}>
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="md:col-span-5">
              <div className="relative">
                <div aria-hidden className="absolute -inset-4 rounded-3xl opacity-40"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, filter: "blur(40px)" }} />
                {aboutImage ? (
                  <img src={aboutImage} alt={name} className="relative w-full aspect-square object-cover rounded-3xl"
                    style={{ border: `1px solid ${C.border}` }} />
                ) : (
                  <div className="relative w-full aspect-square flex items-center justify-center gl-display text-9xl font-bold rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: "#fff" }}>
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-7">
              <SectionLabel>About Me</SectionLabel>
              <h2 className="gl-display text-4xl md:text-5xl font-bold leading-tight mb-6 mt-4">
                Marketing rooted in <span style={{ color: C.accent }}>numbers</span>, not luck.
              </h2>
              <p className="text-base md:text-lg leading-[1.85] mb-8" style={{ color: C.muted }}>
                {aboutText}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {[
                  { icon: <Search className="w-5 h-5" />, label: "SEO Strategy", value: "Technical · On-page · Off-page" },
                  { icon: <Target className="w-5 h-5" />, label: "Paid Ads", value: "Google · Meta · LinkedIn" },
                  { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", value: "GA4 · Looker · Mixpanel" },
                  { icon: <Zap className="w-5 h-5" />, label: "CRO", value: "A/B Testing · Funnels" },
                ].map((it) => (
                  <div key={it.label} className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${C.primary}22`, color: C.primary }}>
                      {it.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>{it.label}</div>
                      <div className="font-semibold text-sm truncate">{it.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="gl-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-lg">
                Work With Me <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section id="services" className="py-20 md:py-28">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <SectionLabel center>My Services</SectionLabel>
              <h2 className="gl-display text-4xl md:text-5xl font-bold leading-tight mt-4 mb-3">
                Engines for <span style={{ color: C.primary }}>growth</span>
              </h2>
              <p className="text-base" style={{ color: C.muted }}>
                Battle-tested services that move metrics — not just impressions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((sv, i) => (
                <motion.div
                  key={sv.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative p-7 rounded-2xl group transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div aria-hidden className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${C.primary}, transparent 70%)` }} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `linear-gradient(135deg, ${C.primary}33, ${C.accent}33)`, color: C.primary, border: `1px solid ${C.primary}44` }}>
                      <ServiceIcon icon={sv.icon} className="w-6 h-6" />
                    </div>
                    <h3 className="gl-display text-xl font-bold mb-3">{sv.title}</h3>
                    {sv.description && (
                      <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>{sv.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.border }}>
                      {sv.price ? (
                        <span className="gl-display font-bold" style={{ color: C.accent }}>{sv.price}</span>
                      ) : (
                        <span className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>On request</span>
                      )}
                      <a href="#contact" className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all" style={{ color: C.primary }}>
                        Inquire <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS & CLIENTS */}
      <section id="work" className="py-20 md:py-28" style={{ background: C.bg2 }}>
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <SectionLabel center>Projects & Clients</SectionLabel>
            <h2 className="gl-display text-4xl md:text-5xl font-bold leading-tight mt-4 mb-3">
              Real <span style={{ color: C.accent }}>results</span>, real brands
            </h2>
            <p className="text-base" style={{ color: C.muted }}>
              A snapshot of campaigns and partners I've helped scale.
            </p>
          </motion.div>

          {/* Projects as case-study cards */}
          {projects.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5 mb-16">
              {projects.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={p.live_url || "#"}
                  target={p.live_url ? "_blank" : undefined}
                  rel="noreferrer"
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group block rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: `0 10px 40px -20px ${C.primary}66` }}
                >
                  {p.image_url && (
                    <div className="aspect-[16/9] overflow-hidden" style={{ background: C.bg }}>
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: C.primary }}>
                        Case Study {String(i + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: C.accent }} />
                    </div>
                    <h3 className="gl-display text-2xl font-bold mb-3 leading-tight">{p.title}</h3>
                    {p.description && (
                      <p className="text-sm mb-5 leading-relaxed" style={{ color: C.muted }}>{p.description}</p>
                    )}
                    {/* Mini result chips */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t" style={{ borderColor: C.border }}>
                      <ResultChip value={`+${120 + i * 35}%`} label="Traffic" color={C.accent} />
                      <ResultChip value={`${(2.5 + i * 0.6).toFixed(1)}x`} label="ROAS" color={C.primary} />
                      <ResultChip value={`+${40 + i * 12}%`} label="Leads" color={C.warning} />
                    </div>
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${C.primary}22`, color: C.primary }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          {/* Clients logo wall */}
          {clients.length > 0 && (
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5" style={{ color: C.primary }} />
                <h3 className="gl-display text-xl font-bold">Trusted by these brands</h3>
                <span className="flex-1 h-px" style={{ background: C.border }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
                style={{ background: C.border }}>
                {clients.map((c) => (
                  <div key={c} className="aspect-[3/2] flex items-center justify-center p-6 transition-all hover:scale-[1.02]"
                    style={{ background: C.surface }}>
                    <span className="gl-display text-base md:text-lg font-bold text-center" style={{ color: C.ink }}>
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 gl-grid-bg pointer-events-none" />
        <div className="container mx-auto px-5 relative">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel center>Contact Me</SectionLabel>
            <h2 className="gl-display text-4xl md:text-5xl font-bold leading-tight mt-4 mb-3">
              Ready to <span style={{ color: C.primary }}>scale</span>?
            </h2>
            <p className="text-base" style={{ color: C.muted }}>
              Send a quick brief — I'll send back a free growth audit within 24 hours.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
            {email && <ContactCard icon={<Mail className="w-5 h-5" />} label="Email" value={email} href={`mailto:${email}`} />}
            {phone && <ContactCard icon={<Phone className="w-5 h-5" />} label="Phone" value={phone} href={`tel:${phone}`} />}
            {location && <ContactCard icon={<MapPin className="w-5 h-5" />} label="Based in" value={location} />}
            {website && <ContactCard icon={<Globe className="w-5 h-5" />} label="Website" value={website.replace(/^https?:\/\//, "")} href={website} />}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#070b1a", color: C.ink }} className="pt-16 pb-8 border-t" >
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="gl-display text-2xl font-bold mb-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                {name}
              </div>
              <p className="text-sm opacity-70 mb-5 max-w-md">{headline}</p>
              <div className="flex gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition hover:-translate-y-0.5"
                      style={{ background: `${C.primary}22`, border: `1px solid ${C.primary}44`, color: C.primary }}>
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 uppercase tracking-[0.25em] opacity-90" style={{ color: C.primary }}>Navigate</h4>
              <ul className="space-y-2 text-sm opacity-70">
                {NAV.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:opacity-100">{n.label}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-3 uppercase tracking-[0.25em] opacity-90" style={{ color: C.primary }}>Contact</h4>
              <ul className="space-y-2 text-sm opacity-70">
                {email && <li><a href={`mailto:${email}`} className="hover:opacity-100">{email}</a></li>}
                {phone && <li>{phone}</li>}
                {location && <li>{location}</li>}
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs opacity-60" style={{ borderColor: C.border }}>
            <div>{footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}</div>
            <div>Built with Alokchitra</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase ${center ? "" : ""}`} style={{ color: C.primary }}>
      <span className="w-8 h-px" style={{ background: C.primary }} />
      {children}
      {center && <span className="w-8 h-px" style={{ background: C.primary }} />}
    </div>
  );
}

function KpiMini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-1.5 mb-1" style={{ color: C.primary }}>{icon}</div>
      <div className="gl-display text-lg font-bold leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: C.muted }}>{label}</div>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, color }: { icon: React.ReactNode; label: string; value: string; trend: string; color: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: C.bg2, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <div style={{ color }}>{icon}</div>
        <span className="text-[10px] font-bold" style={{ color: C.accent }}>{trend}</span>
      </div>
      <div className="gl-display text-lg font-bold leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: C.muted }}>{label}</div>
    </div>
  );
}

function ResultChip({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center p-2 rounded-lg" style={{ background: C.bg2 }}>
      <div className="gl-display text-base font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: C.muted }}>{label}</div>
    </div>
  );
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 p-5 rounded-xl transition-all hover:-translate-y-0.5"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ background: `${C.primary}22`, color: C.primary, border: `1px solid ${C.primary}44` }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: C.primary }}>{label}</div>
        <div className="font-semibold truncate" style={{ color: C.ink }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}
