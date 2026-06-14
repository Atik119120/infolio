import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps, ThemeService } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
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

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const headline = portfolio?.hero_headline || portfolio?.headline || "Creative Professional";
  const subheadline = portfolio?.hero_subheadline || s.heroBadge;
  const heroCtaText = portfolio?.hero_cta_text || s.heroCta;
  const heroCtaLink = portfolio?.hero_cta_link || "#works";
  const heroImage = portfolio?.hero_image_url || profile?.avatar_url;
  const aboutImage = portfolio?.about_image_url || profile?.avatar_url;
  const aboutText = portfolio?.about_text || portfolio?.bio || "Tell your story here.";
  const bio = portfolio?.bio || aboutText;
  const footerText = portfolio?.footer_text;
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
    { id: "ventures", label: "Ventures" },
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

      {/* SLIM FLOATING HEADER */}
      <header className="sticky top-3 z-50 px-3 md:px-5">
        <div className="container mx-auto gx-glass-nav-light rounded-full px-4 md:px-5 py-2.5 flex items-center justify-between max-w-6xl">
          <a href="#home" className="t-display text-base font-bold tracking-tight" style={{ color: s.text }}>
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-7 w-auto object-contain" />
            ) : (
              <>
                <span style={{ color: s.primary }}>{name.split(" ")[0]}</span>
                {name.split(" ").length > 1 && <span>.{name.split(" ").slice(1).join("")}</span>}
              </>
            )}
          </a>

          <nav className="hidden md:flex items-center gap-1 text-[12px] font-medium">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="t-link px-3 py-1.5 rounded-full hover:bg-black/5 transition" style={{ color: s.textMuted }}>{n.label}</a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a href="#contact" className="t-btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold">
              Hire Me <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 container mx-auto max-w-6xl gx-glass-nav-light rounded-2xl">
            <div className="px-5 py-3 flex flex-col gap-2">
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
        <div className="container mx-auto px-6 sm:px-8 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="md:col-span-7">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-5"
                style={{ color: s.primary, background: `${s.primary}15`, borderRadius: s.radius }}>
                {subheadline}
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
                <a href={heroCtaLink} className="t-btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
                  {heroCtaText} <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="t-btn-outline px-6 py-3 text-sm font-semibold">
                  Get in touch
                </a>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="md:col-span-5">
              {heroImage ? (
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full opacity-60" style={{ background: `linear-gradient(135deg, ${s.primary}, ${s.accent})`, filter: "blur(40px)" }} />
                  <img src={heroImage} alt={name}
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
        <div className="container mx-auto px-6 sm:px-8">
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
                {aboutImage ? (
                  <img
                    src={aboutImage}
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
                {aboutText}
              </p>

              {/* Ventures moved to its own section below */}

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

      {/* VENTURES / BRANDS — own section */}
      {projects.length > 0 && (
        <section id="ventures" className="py-20 md:py-24" style={{ background: s.background }}>
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full" style={{ color: s.primary, background: `${s.primary}15` }}>Brands & Ventures</span>
              <h2 className="t-display text-3xl md:text-5xl font-bold mt-4">My Professional <span style={{ color: s.primary }}>Ventures</span></h2>
              <p className="text-base mt-3" style={{ color: s.textMuted }}>Brands and companies I've built or contributed to.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {projects.slice(0, 8).map((p, i) => (
                <motion.a
                  key={p.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  href={p.live_url || (p as any).external_links?.live || (p as any).external_links?.website || "#"}
                  target={p.live_url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="t-card p-5 relative overflow-hidden group"
                  style={{ background: s.surface, border: `1px solid ${s.border}` }}
                >
                  <div
                    aria-hidden
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-30 transition-transform group-hover:scale-125"
                    style={{ background: `${s.primary}33` }}
                  />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4" style={{ background: `${s.primary}15`, color: s.primary }}>
                      <Globe className="w-5 h-5" />
                    </div>
                    <h5 className="t-display text-lg font-bold leading-tight">{p.title}</h5>
                    {p.description && (
                      <p className="text-[11px] uppercase tracking-wider mt-1 font-medium line-clamp-1" style={{ color: s.textMuted }}>
                        {p.description.slice(0, 50)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: s.primary }}>
                      Visit <ArrowRight className="w-3 h-3 -rotate-45" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* SKILLS — clean centered header + animated progress bars */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 md:py-28" style={{ background: s.background }}>
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <SectionLabel s={s}>My Skills</SectionLabel>
              <h2 className="t-display text-3xl md:text-5xl font-bold mt-4 mb-3">
                Tools I work with <span style={{ color: s.primary }}>every day</span>
              </h2>
              <p className="text-base" style={{ color: s.textMuted }}>
                A curated stack refined through years of real-world projects.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-12">
              {Object.entries(grouped).map(([cat, list], ci) => (
                <motion.div key={cat} {...fadeUp} transition={{ duration: 0.5, delay: ci * 0.05 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="t-display text-lg font-bold uppercase tracking-wider">{cat}</h3>
                    <span className="flex-1 h-px" style={{ background: s.border }} />
                    <span className="text-xs font-medium" style={{ color: s.textMuted }}>{list.length}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                    {list.map((sk) => (
                      <div key={sk.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm" style={{ color: s.text }}>{sk.name}</span>
                          <span className="text-xs font-bold" style={{ color: s.primary }}>{sk.proficiency || 0}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: s.border }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${sk.proficiency || 0}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${s.primary}, ${s.accent})` }}
                          />
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

      {/* SERVICES — clean uniform cards */}
      {services.length > 0 && (
        <section id="services" className="py-20 md:py-28" style={{ background: s.surface }}>
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <SectionLabel s={s}>Services</SectionLabel>
              <h2 className="t-display text-3xl md:text-5xl font-bold mt-4 mb-3">
                What I can <span style={{ color: s.primary }}>do for you</span>
              </h2>
              <p className="text-base" style={{ color: s.textMuted }}>
                Thoughtful, end-to-end services designed around your goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((sv, i) => (
                <motion.div
                  key={sv.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative p-7 group transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: s.background,
                    borderRadius: s.radius,
                    border: `1px solid ${s.border}`,
                    boxShadow: `0 4px 20px -8px ${s.primary}1a`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.primary}15`, color: s.primary }}
                  >
                    <ServiceIcon icon={sv.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="t-display text-xl font-bold mb-3" style={{ color: s.text }}>{sv.title}</h3>
                  {sv.description && (
                    <p className="text-sm leading-relaxed mb-5" style={{ color: s.textMuted }}>{sv.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: s.border }}>
                    {sv.price ? (
                      <span className="t-display font-bold text-base" style={{ color: s.primary }}>{sv.price}</span>
                    ) : (
                      <span className="text-xs uppercase tracking-wider" style={{ color: s.textMuted }}>On request</span>
                    )}
                    <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all group-hover:gap-2.5" style={{ color: s.primary }}>
                      Inquire <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WORKS — type-aware ProjectsSection */}
      <ProjectsSection projects={projects as any} username={profile?.username} s={{ primary: s.primary, surface: s.surface, text: s.text, textMuted: s.textMuted, border: s.border, background: s.background }} />

      {/* CONTACT — centered modern with info pills + form card */}
      <section id="contact" className="py-20 md:py-28 relative overflow-hidden" style={{ background: s.background }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top, ${s.primary}10, transparent 60%)` }} />
        <div className="container mx-auto px-6 sm:px-8 relative">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <SectionLabel s={s}>Get in Touch</SectionLabel>
            <h2 className="t-display text-3xl md:text-5xl font-bold mt-4 mb-3">
              Let's <span style={{ color: s.primary }}>work together</span>
            </h2>
            <p className="text-base" style={{ color: s.textMuted }}>
              Have a project in mind? Send a message and I'll get back within 24 hours.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6">
            <motion.div {...fadeUp} className="md:col-span-2 space-y-3">
              {email && <ContactCard icon={<Mail className="w-5 h-5" />} label="Email" value={email} href={`mailto:${email}`} s={s} />}
              {phone && <ContactCard icon={<Phone className="w-5 h-5" />} label="Phone" value={phone} href={`tel:${phone}`} s={s} />}
              {location && <ContactCard icon={<MapPin className="w-5 h-5" />} label="Location" value={location} s={s} />}
              {website && <ContactCard icon={<Globe className="w-5 h-5" />} label="Website" value={website.replace(/^https?:\/\//, "")} href={website} s={s} />}
            </motion.div>

            <motion.div {...fadeUp} className="md:col-span-3 p-6 md:p-7 rounded-2xl" style={{ background: s.surface, border: `1px solid ${s.border}` }}>
              <ContactForm
                portfolioOwnerId={userId}
                themeStyle={{
                  surface: s.background,
                  border: s.border,
                  text: s.text,
                  textMuted: s.textMuted,
                  accent: s.primary,
                  accentText: "#ffffff",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FULL FOOTER */}
      <footer style={{ background: s.text, color: s.background }} className="pt-16 pb-8">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt={name} className="h-9 w-auto object-contain mb-3" style={{ background: "transparent" }} />
              ) : (
                <div className="t-display text-2xl font-bold mb-3">{name}</div>
              )}
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
            <div>{footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}</div>
            <div>Built with Infolio</div>
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

