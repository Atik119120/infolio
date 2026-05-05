import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe } from "lucide-react";
import { ThemeProps, ThemeService } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";

/**
 * Per-theme style tokens. Each theme passes a unique aesthetic.
 * All themes share the same section structure:
 * Header → Hero → About → Skills → Services → Works → Contact → Footer
 */
export interface ThemeStyle {
  /** Unique theme identifier */
  id: string;
  /** Primary brand color (CSS color) */
  primary: string;
  /** Accent color */
  accent: string;
  /** Page background */
  background: string;
  /** Card / surface background */
  surface: string;
  /** Body text color */
  text: string;
  /** Secondary muted text */
  textMuted: string;
  /** Border color */
  border: string;
  /** Display font (Google Fonts family) */
  displayFont: string;
  /** Body font (Google Fonts family) */
  bodyFont: string;
  /** Google fonts URL */
  fontsHref: string;
  /** Hero badge text */
  heroBadge: string;
  /** Hero CTA primary label */
  heroCta: string;
  /** Border radius style */
  radius: string;
  /** Optional decorative aesthetic ('grid' | 'blob' | 'noise' | 'none') */
  aesthetic?: "grid" | "blob" | "noise" | "lines" | "none";
}

interface Props extends ThemeProps {
  style: ThemeStyle;
  services: ThemeService[];
}

export function StandardThemeShell({
  style: s,
  profile,
  portfolio,
  skills,
  projects,
  services,
  socialLinks,
  experiences,
  userId,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const name = profile?.display_name || "Your Name";
  const headline = portfolio?.headline || "Creative Professional";
  const bio = portfolio?.bio || "Tell your story here.";
  const email = profile?.email;
  const phone = portfolio?.phone;
  const location = portfolio?.location;
  const website = portfolio?.website;

  const grouped = useMemo(() => {
    return skills.reduce((acc, sk) => {
      const cat = sk.category || "Other";
      acc[cat] = acc[cat] || [];
      acc[cat].push(sk);
      return acc;
    }, {} as Record<string, typeof skills>);
  }, [skills]);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 },
  };

  const NAV = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "services", label: "Services" },
    { id: "works", label: "Works" },
    { id: "contact", label: "Contact" },
  ];

  // Inline color vars for full theme isolation
  const cssVars = {
    ["--t-primary" as any]: s.primary,
    ["--t-accent" as any]: s.accent,
    ["--t-bg" as any]: s.background,
    ["--t-surface" as any]: s.surface,
    ["--t-text" as any]: s.text,
    ["--t-muted" as any]: s.textMuted,
    ["--t-border" as any]: s.border,
    ["--t-radius" as any]: s.radius,
  };

  return (
    <div
      style={{ ...cssVars, background: "var(--t-bg)", color: "var(--t-text)", fontFamily: `'${s.bodyFont}', system-ui, sans-serif` }}
      className="min-h-screen"
    >
      <style>{`
        @import url('${s.fontsHref}');
        .t-display { font-family: '${s.displayFont}', system-ui, sans-serif; }
        .t-card { background: var(--t-surface); border: 1px solid var(--t-border); border-radius: var(--t-radius); }
        .t-btn-primary { background: var(--t-primary); color: #fff; border-radius: var(--t-radius); transition: transform .2s, opacity .2s; }
        .t-btn-primary:hover { transform: translateY(-2px); opacity: .92; }
        .t-btn-outline { border: 1.5px solid var(--t-border); color: var(--t-text); border-radius: var(--t-radius); transition: all .2s; }
        .t-btn-outline:hover { border-color: var(--t-primary); color: var(--t-primary); }
        .t-link:hover { color: var(--t-primary); }
        ${s.aesthetic === "grid" ? `.t-bg-deco { background-image: linear-gradient(var(--t-border) 1px, transparent 1px), linear-gradient(90deg, var(--t-border) 1px, transparent 1px); background-size: 48px 48px; opacity: .35; }` : ""}
        ${s.aesthetic === "blob" ? `.t-bg-deco { background: radial-gradient(circle at 20% 30%, ${s.primary}22, transparent 50%), radial-gradient(circle at 80% 70%, ${s.accent}22, transparent 50%); }` : ""}
        ${s.aesthetic === "lines" ? `.t-bg-deco { background-image: repeating-linear-gradient(45deg, var(--t-border) 0 1px, transparent 1px 24px); opacity: .25; }` : ""}
        ${s.aesthetic === "noise" ? `.t-bg-deco { background-color: var(--t-bg); background-image: radial-gradient(${s.border} 1px, transparent 1px); background-size: 18px 18px; opacity: .4; }` : ""}
      `}</style>

      {/* MODERN HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: `${s.background}cc`, borderBottom: `1px solid ${s.border}` }}>
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#home" className="t-display text-xl font-bold tracking-tight" style={{ color: s.text }}>
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-9 w-auto object-contain" />
            ) : (
              <>
                <span style={{ color: s.primary }}>{name.split(" ")[0]}</span>
                {name.split(" ").length > 1 && <span>.{name.split(" ").slice(1).join("")}</span>}
              </>
            )}
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="t-link" style={{ color: s.textMuted }}>{n.label}</a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a href="#contact" className="t-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
              Hire Me <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: s.border, background: s.surface }}>
            <div className="container mx-auto px-5 py-3 flex flex-col gap-3">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="py-2 text-sm" style={{ color: s.text }}>{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 t-bg-deco pointer-events-none" />
        <div className="container mx-auto px-5 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="md:col-span-7">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-5"
                style={{ color: s.primary, background: `${s.primary}15`, borderRadius: s.radius }}>
                {s.heroBadge}
              </span>
              <h1 className="t-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5">
                Hi, I'm {" "}
                <span style={{ color: s.primary }}>{name.split(" ")[0]}</span>
              </h1>
              <p className="t-display text-xl md:text-2xl mb-6" style={{ color: s.textMuted }}>
                {headline}
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: s.textMuted }}>
                {bio.length > 220 ? bio.slice(0, 220) + "…" : bio}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#works" className="t-btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
                  {s.heroCta} <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="t-btn-outline px-6 py-3 text-sm font-semibold">
                  Get in touch
                </a>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="md:col-span-5">
              {profile?.avatar_url ? (
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full opacity-60" style={{ background: `linear-gradient(135deg, ${s.primary}, ${s.accent})`, filter: "blur(40px)" }} />
                  <img src={profile.avatar_url} alt={name}
                    className="relative w-full max-w-sm mx-auto aspect-square object-cover"
                    style={{ borderRadius: s.radius, border: `4px solid ${s.surface}`, boxShadow: `0 20px 60px ${s.primary}33` }} />
                </div>
              ) : (
                <div className="w-full max-w-sm mx-auto aspect-square flex items-center justify-center t-display text-7xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${s.primary}, ${s.accent})`, color: "#fff", borderRadius: s.radius }}>
                  {name.charAt(0)}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT — editorial split layout: photo left, typography-rich info right */}
      <section id="about" className="py-20 md:py-28" style={{ background: s.surface }}>
        <div className="container mx-auto px-5">
          <motion.h2 {...fadeUp} className="t-display text-4xl md:text-6xl font-bold tracking-tight mb-12 md:mb-16">
            About <span style={{ color: s.primary }}>Me</span>
          </motion.h2>

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-start">
            {/* PHOTO with offset accent frame */}
            <motion.div {...fadeUp} className="md:col-span-5 lg:col-span-5">
              <div className="relative w-full max-w-md mx-auto md:mx-0">
                <div
                  aria-hidden
                  className="absolute -bottom-4 -right-4 w-full h-full"
                  style={{ background: s.primary, borderRadius: s.radius }}
                />
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={name}
                    className="relative w-full aspect-[4/5] object-cover"
                    style={{ borderRadius: s.radius }}
                  />
                ) : (
                  <div
                    className="relative w-full aspect-[4/5] flex items-center justify-center t-display text-8xl font-bold"
                    style={{ background: `linear-gradient(135deg, ${s.primary}, ${s.accent})`, color: "#fff", borderRadius: s.radius }}
                  >
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>

            {/* INFO column */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-7 lg:col-span-7">
              <h3 className="t-display text-2xl md:text-3xl font-bold mb-2">I'm {name}</h3>
              {headline && (
                <p className="t-display text-base md:text-lg font-semibold mb-5" style={{ color: s.text }}>
                  {headline}
                </p>
              )}
              <p className="text-base leading-[1.85] mb-8 text-justify" style={{ color: s.textMuted }}>
                {bio}
              </p>

              {/* Ventures (from projects, top 2) */}
              {projects.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="block w-8 h-[3px]" style={{ background: s.primary }} />
                    <h4 className="t-display text-base font-bold uppercase tracking-wider">My Professional Ventures</h4>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {projects.slice(0, 2).map((p) => (
                      <a
                        key={p.id}
                        href={p.live_url || "#"}
                        target={p.live_url ? "_blank" : undefined}
                        rel="noreferrer"
                        className="t-card p-5 relative overflow-hidden group"
                      >
                        <div
                          aria-hidden
                          className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-30 transition-transform group-hover:scale-125"
                          style={{ background: `${s.primary}33` }}
                        />
                        <div className="relative flex items-start justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4" style={{ background: `${s.primary}15`, color: s.primary }}>
                              <Globe className="w-5 h-5" />
                            </div>
                            <h5 className="t-display text-lg font-bold leading-tight">{p.title}</h5>
                            {p.description && (
                              <p className="text-[11px] uppercase tracking-wider mt-1 font-medium" style={{ color: s.textMuted }}>
                                {p.description.slice(0, 40)}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 -rotate-45" style={{ color: s.textMuted }} />
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {/* Personal info grid */}
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-8">
                {phone && <FactRow label="Phone" value={phone} s={s} />}
                {location && <FactRow label="Residence" value={location} s={s} />}
                {email && <FactRow label="Email" value={email} s={s} />}
                <FactRow label="Freelance" value="Available" s={s} />
                <FactRow label="Projects" value={String(projects.length)} s={s} />
                <FactRow label="Experience" value={`${experiences.length}+ Roles`} s={s} />
              </div>

              <a href="#contact" className="t-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold tracking-wider uppercase">
                Get a Custom Quote
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS — editorial big-number layout with circular dials */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 md:py-28 relative overflow-hidden">
          <div className="container mx-auto px-5 relative">
            <motion.div {...fadeUp} className="grid md:grid-cols-12 gap-6 items-end mb-14">
              <div className="md:col-span-7">
                <div className="t-display text-[80px] md:text-[140px] leading-none font-black opacity-[0.06]" style={{ color: s.primary }}>
                  01 / SKILLS
                </div>
                <h2 className="t-display text-3xl md:text-5xl font-bold -mt-8 md:-mt-16">
                  Crafted with <span style={{ color: s.primary }}>precision</span>.
                </h2>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="text-sm md:text-base" style={{ color: s.textMuted }}>
                  A toolkit refined through years of building, breaking and rebuilding ideas into reality.
                </p>
              </div>
            </motion.div>

            <div className="space-y-10">
              {Object.entries(grouped).map(([cat, list], ci) => (
                <motion.div key={cat} {...fadeUp} transition={{ duration: 0.5, delay: ci * 0.05 }}>
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="t-display text-xs font-bold tracking-[0.3em] uppercase" style={{ color: s.primary }}>
                      0{ci + 1}
                    </span>
                    <h3 className="t-display text-xl md:text-2xl font-bold">{cat}</h3>
                    <span className="flex-1 h-px" style={{ background: s.border }} />
                    <span className="text-xs" style={{ color: s.textMuted }}>{list.length} skills</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {list.map((sk) => (
                      <div key={sk.id} className="t-card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                        <SkillRing value={sk.proficiency || 0} s={s} />
                        <div className="min-w-0">
                          <div className="t-display font-semibold truncate" style={{ color: s.text }}>{sk.name}</div>
                          <div className="text-[11px] uppercase tracking-wider" style={{ color: s.textMuted }}>Proficient</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES — asymmetric numbered cards with alternating dark fills */}
      {services.length > 0 && (
        <section id="services" className="py-20 md:py-28 relative overflow-hidden" style={{ background: s.surface }}>
          <div className="absolute inset-0 t-bg-deco pointer-events-none opacity-50" />
          <div className="container mx-auto px-5 relative">
            <motion.div {...fadeUp} className="grid md:grid-cols-12 gap-6 mb-14">
              <div className="md:col-span-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="block w-10 h-[3px]" style={{ background: s.primary }} />
                  <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: s.primary }}>What I Offer</span>
                </div>
                <h2 className="t-display text-3xl md:text-5xl font-bold leading-[1.05]">
                  Services tailored<br />
                  <span style={{ color: s.primary }}>to your vision.</span>
                </h2>
              </div>
              <div className="md:col-span-6 md:pt-12">
                <p className="text-base leading-relaxed" style={{ color: s.textMuted }}>
                  Each engagement is a partnership — strategy first, execution flawless, results measurable. Pick the service that fits your stage of growth.
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((sv, i) => {
                const dark = i % 3 === 0;
                return (
                  <motion.div
                    key={sv.id}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="relative p-7 group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: dark ? s.text : s.background,
                      color: dark ? s.background : s.text,
                      borderRadius: s.radius,
                      border: dark ? "none" : `1px solid ${s.border}`,
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-125"
                      style={{ background: s.primary }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-6">
                        <span className="t-display text-4xl font-black opacity-30">0{i + 1}</span>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ background: dark ? `${s.primary}33` : `${s.primary}15` }}>
                          {sv.icon || "✦"}
                        </div>
                      </div>
                      <h3 className="t-display text-xl md:text-2xl font-bold mb-3 leading-tight">{sv.title}</h3>
                      {sv.description && (
                        <p className="text-sm leading-relaxed mb-5 opacity-80">{sv.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-5 border-t"
                        style={{ borderColor: dark ? `${s.background}22` : s.border }}>
                        {sv.price ? (
                          <span className="t-display font-bold text-base" style={{ color: s.primary }}>{sv.price}</span>
                        ) : (
                          <span className="text-xs uppercase tracking-wider opacity-60">On request</span>
                        )}
                        <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                          Inquire <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WORKS */}
      {projects.length > 0 && (
        <section id="works" className="py-20 md:py-24">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <SectionLabel s={s}>Selected Works</SectionLabel>
                <h2 className="t-display text-3xl md:text-5xl font-bold mt-3">Recent projects</h2>
              </div>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p, i) => (
                <motion.a key={p.id} href={p.live_url || "#"} target={p.live_url ? "_blank" : undefined} rel="noreferrer"
                  {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="t-card overflow-hidden group block">
                  {p.image_url && (
                    <div className="aspect-[16/10] overflow-hidden" style={{ background: s.border }}>
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="t-display text-xl font-semibold">{p.title}</h3>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: s.primary }} />
                    </div>
                    {p.description && <p className="text-sm mb-4" style={{ color: s.textMuted }}>{p.description}</p>}
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${s.primary}10`, color: s.primary }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT — split panel: dramatic dark side + clean form side */}
      <section id="contact" className="py-20 md:py-28 relative overflow-hidden" style={{ background: s.background }}>
        <div className="container mx-auto px-5 relative">
          <div
            className="grid md:grid-cols-2 overflow-hidden"
            style={{ borderRadius: s.radius, boxShadow: `0 30px 80px -20px ${s.primary}33` }}
          >
            <motion.div
              {...fadeUp}
              className="p-8 md:p-12 relative overflow-hidden"
              style={{ background: s.text, color: s.background }}
            >
              <div aria-hidden className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
                style={{ background: `radial-gradient(circle, ${s.primary}55, transparent 70%)` }} />
              <div aria-hidden className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full"
                style={{ background: `radial-gradient(circle, ${s.accent}33, transparent 70%)` }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[11px] font-bold tracking-[0.25em] uppercase rounded-full"
                  style={{ background: `${s.primary}33`, color: "#fff" }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.primary }} />
                  Available for Work
                </div>
                <h2 className="t-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5">
                  Let's create<br />
                  <span style={{ color: s.primary }}>something great.</span>
                </h2>
                <p className="text-base opacity-80 mb-10 max-w-md">
                  Whether it's a bold new brand, a digital product, or a creative collaboration — drop a message and let's start the conversation.
                </p>
                <div className="space-y-5">
                  {email && <ContactLine icon={<Mail className="w-4 h-4" />} label="Email" value={email} href={`mailto:${email}`} s={s} />}
                  {phone && <ContactLine icon={<Phone className="w-4 h-4" />} label="Phone" value={phone} href={`tel:${phone}`} s={s} />}
                  {location && <ContactLine icon={<MapPin className="w-4 h-4" />} label="Based in" value={location} s={s} />}
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="p-8 md:p-12" style={{ background: s.surface }}>
              <div className="mb-6">
                <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: s.primary }}>Send a Message</span>
                <h3 className="t-display text-2xl md:text-3xl font-bold mt-2">Tell me about your project</h3>
              </div>
              {userId && <ContactForm portfolioOwnerId={userId} />}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FULL FOOTER */}
      <footer style={{ background: s.text, color: s.background }} className="pt-16 pb-8">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="t-display text-2xl font-bold mb-3">{name}</div>
              <p className="text-sm opacity-70 mb-5 max-w-md">{headline}</p>
              <div className="flex gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition"
                      style={{ background: `${s.primary}33`, color: "#fff" }}>
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">Navigate</h4>
              <ul className="space-y-2 text-sm opacity-70">
                {NAV.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:opacity-100">{n.label}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-90">Contact</h4>
              <ul className="space-y-2 text-sm opacity-70">
                {email && <li><a href={`mailto:${email}`} className="hover:opacity-100">{email}</a></li>}
                {phone && <li>{phone}</li>}
                {location && <li>{location}</li>}
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs opacity-60" style={{ borderColor: `${s.background}22` }}>
            <div>© {new Date().getFullYear()} {name}. All rights reserved.</div>
            <div>Built with Alpha Portfolio</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ s, children }: { s: ThemeStyle; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase" style={{ color: s.primary }}>
      <span className="w-8 h-px" style={{ background: s.primary }} />
      {children}
    </div>
  );
}

function Info({ icon, label, value, s }: { icon: React.ReactNode; label: string; value: string; s: ThemeStyle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.primary}15`, color: s.primary }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider" style={{ color: s.textMuted }}>{label}</div>
        <div className="font-medium truncate" style={{ color: s.text }}>{value}</div>
      </div>
    </div>
  );
}

function Stat({ n, label, s }: { n: number; label: string; s: ThemeStyle }) {
  return (
    <div className="t-card p-3 text-center">
      <div className="t-display text-2xl font-bold" style={{ color: s.primary }}>{n}+</div>
      <div className="text-xs" style={{ color: s.textMuted }}>{label}</div>
    </div>
  );
}

function FactRow({ label, value, s }: { label: string; value: string; s: ThemeStyle }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="font-bold shrink-0" style={{ color: s.text }}>{label}</span>
      <span style={{ color: s.border }}>|</span>
      <span className="truncate" style={{ color: s.textMuted }}>{value}</span>
    </div>
  );
}


function ContactCard({ icon, label, value, href, s }: { icon: React.ReactNode; label: string; value: string; href?: string; s: ThemeStyle }) {
  const inner = (
    <div className="t-card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.primary}15`, color: s.primary }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider" style={{ color: s.textMuted }}>{label}</div>
        <div className="font-medium truncate" style={{ color: s.text }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:-translate-y-0.5 transition-transform">{inner}</a> : inner;
}

function SkillRing({ value, s }: { value: number; s: ThemeStyle }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke={s.border} strokeWidth="4" />
        <motion.circle
          cx="28" cy="28" r={r} fill="none"
          stroke={s.primary} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color: s.text }}>
        {value}%
      </div>
    </div>
  );
}

function ContactLine({ icon, label, value, href, s }: { icon: React.ReactNode; label: string; value: string; href?: string; s: ThemeStyle }) {
  const inner = (
    <div className="flex items-center gap-4 group">
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors"
        style={{ background: `${s.primary}33`, color: "#fff" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.25em] opacity-60">{label}</div>
        <div className="font-semibold truncate group-hover:translate-x-1 transition-transform" style={{ color: "#fff" }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

