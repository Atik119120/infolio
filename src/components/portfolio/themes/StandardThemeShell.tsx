import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps, ThemeService } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";

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
  const bio = portfolio?.hero_subheadline || "";
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

  const showHero = isVisible(portfolio, "hero");
  const showAbout = isVisible(portfolio, "about");
  const showSkills = isVisible(portfolio, "skills") && skills.length > 0;
  const showServices = isVisible(portfolio, "services") && services.length > 0;
  const showProjects = isVisible(portfolio, "projects") && projects.length > 0;
  const showContact = isVisible(portfolio, "contact");
  const showSocial = isVisible(portfolio, "social");

  const NAV = [
    showHero && { id: "home", label: "Home" },
    showAbout && { id: "about", label: "About" },
    showProjects && { id: "ventures", label: "Ventures" },
    showSkills && { id: "skills", label: "Skills" },
    showServices && { id: "services", label: "Services" },
    showProjects && { id: "works", label: "Works" },
    showContact && { id: "contact", label: "Contact" },
  ].filter(Boolean) as { id: string; label: string }[];

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
        .t-card { background: var(--t-surface); border: 1px solid var(--t-border); border-radius: var(--t-radius); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); box-shadow: 0 8px 32px -12px ${s.primary}33, inset 0 1px 0 rgba(255,255,255,0.5); }
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

      {/* HERO — editorial */}
      {showHero && (
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 t-bg-deco pointer-events-none" />
        <div className="container mx-auto px-6 sm:px-8 py-10 md:py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="h-px w-10" style={{ background: s.text }} />
                <span className="text-[11px] font-semibold tracking-[0.35em] uppercase" style={{ color: s.textMuted }}>
                  {subheadline}
                </span>
                <span className="h-px w-10" style={{ background: s.text }} />
              </div>
              <h1 className="t-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] mb-6 tracking-tight">
                {name.split(" ")[0]}
                {name.split(" ").length > 1 && (
                  <> <em className="italic font-normal" style={{ color: s.primary }}>{name.split(" ").slice(1).join(" ")}</em></>
                )}
              </h1>
              <p className="t-display italic text-xl md:text-2xl mb-6" style={{ color: s.textMuted }}>
                — {headline}
              </p>
              {bio && (
                <p className="text-base md:text-lg leading-relaxed mb-8 mx-auto max-w-2xl" style={{ color: s.textMuted }}>
                  {bio.length > 220 ? bio.slice(0, 220) + "…" : bio}
                </p>
              )}
              <div className="flex flex-wrap gap-3 justify-center">
                <a href={heroCtaLink} className="t-btn-primary px-7 py-3 text-xs font-bold tracking-[0.2em] uppercase inline-flex items-center gap-2">
                  {heroCtaText} <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="t-btn-outline px-7 py-3 text-xs font-bold tracking-[0.2em] uppercase">
                  Get in touch
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ABOUT — editorial split layout: photo left, typography-rich info right */}
      {showAbout && (
      <section id="about" className="py-8 md:py-10" style={{ background: s.surface }}>
        <div className="container mx-auto px-6 sm:px-8">
          <motion.h2 {...fadeUp} className="t-display text-4xl md:text-6xl font-bold tracking-tight mb-6 md:mb-8 text-center">
            About <span style={{ color: s.primary }}>Me</span>
          </motion.h2>

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-stretch">
            {/* PHOTO with offset accent frame — height matches info column */}
            <motion.div {...fadeUp} className="md:col-span-5 lg:col-span-5 flex">
              <div className="relative w-full max-w-md mx-auto md:mx-0 flex">
                <div
                  aria-hidden
                  className="absolute -bottom-4 -right-4 w-full h-full"
                  style={{ background: s.primary, borderRadius: s.radius }}
                />
                {aboutImage ? (
                  <img
                    src={aboutImage}
                    alt={name}
                    className="relative w-full h-full min-h-[320px] object-cover"
                    style={{ borderRadius: s.radius }}
                  />
                ) : (
                  <div
                    className="relative w-full min-h-[320px] flex items-center justify-center t-display text-8xl font-bold"
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
      )}

      {/* VENTURES / BRANDS — own section */}
      {showProjects && (
        <section id="ventures" className="py-8 md:py-10" style={{ background: s.background }}>
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-6">
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
      {showSkills && (
        <section id="skills" className="py-8 md:py-10" style={{ background: s.background }}>
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-8">
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
      {showServices && (
        <section id="services" className="py-8 md:py-10" style={{ background: s.surface }}>
          <div className="container mx-auto px-6 sm:px-8">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-8">
              <SectionLabel s={s}>Services</SectionLabel>
              <h2 className="t-display text-3xl md:text-5xl font-bold mt-4 mb-3">
                What I can <span style={{ color: s.primary }}>do for you</span>
              </h2>
              <p className="text-base" style={{ color: s.textMuted }}>
                Thoughtful, end-to-end services designed around your goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4 md:gap-5">
              {services.map((sv, i) => {
                // Bento span pattern — first card large, others alternate
                const patterns = [
                  "md:col-span-4 md:row-span-2",
                  "md:col-span-2",
                  "md:col-span-2",
                  "md:col-span-3",
                  "md:col-span-3",
                  "md:col-span-2",
                  "md:col-span-2",
                  "md:col-span-2",
                ];
                const span = patterns[i % patterns.length];
                const isFeature = i === 0;
                return (
                  <motion.div
                    key={sv.id}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`relative p-6 md:p-7 group transition-all duration-300 hover:-translate-y-1 flex flex-col ${span}`}
                    style={{
                      background: isFeature ? s.text : s.background,
                      color: isFeature ? s.background : s.text,
                      borderRadius: s.radius,
                      border: `1px solid ${s.border}`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                      style={{
                        background: isFeature ? `${s.background}1f` : `${s.primary}10`,
                        color: isFeature ? s.background : s.primary,
                      }}
                    >
                      <ServiceIcon icon={sv.icon} className="w-5 h-5" />
                    </div>
                    <h3 className={`t-display font-semibold mb-3 ${isFeature ? "text-3xl md:text-4xl leading-[1.05]" : "text-xl"}`}>
                      {sv.title}
                    </h3>
                    {sv.description && (
                      <p className={`text-sm leading-relaxed mb-5 ${isFeature ? "max-w-md" : "line-clamp-3"}`}
                        style={{ color: isFeature ? `${s.background}cc` : s.textMuted }}>
                        {sv.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t"
                      style={{ borderColor: isFeature ? `${s.background}22` : s.border }}>
                      {sv.price ? (
                        <span className="t-display italic font-semibold text-base"
                          style={{ color: isFeature ? s.background : s.primary }}>{sv.price}</span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">On request</span>
                      )}
                      <a href="#contact" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all group-hover:gap-2.5"
                        style={{ color: isFeature ? s.background : s.primary }}>
                        Inquire <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WORKS — type-aware ProjectsSection */}
      <ProjectsSection projects={projects as any} username={profile?.username} s={{ primary: s.primary, surface: s.surface, text: s.text, textMuted: s.textMuted, border: s.border, background: s.background }} />

      {/* CONTACT — centered modern with info pills + form card */}
      <section id="contact" className="py-8 md:py-10 relative overflow-hidden" style={{ background: s.background }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top, ${s.primary}10, transparent 60%)` }} />
        <div className="container mx-auto px-6 sm:px-8 relative">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-6">
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

      {/* UNIQUE FOOTER — ticker + giant signature + asymmetric grid */}
      <footer style={{ background: s.text, color: s.background }} className="relative overflow-hidden">
        {/* Top scrolling ticker */}
        <div className="border-y overflow-hidden whitespace-nowrap py-3" style={{ borderColor: `${s.background}22`, background: s.primary, color: "#fff" }}>
          <div className="flex gap-10 animate-[marquee_28s_linear_infinite] text-xs font-bold uppercase tracking-[0.3em]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-10">
                <span>Let's Build Something</span>
                <span>✦</span>
                <span>Available For Work</span>
                <span>✦</span>
                <span>{name}</span>
                <span>✦</span>
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 sm:px-8 pt-10 pb-3 relative">
          {/* Asymmetric grid */}
          <div className="grid grid-cols-12 gap-y-10 gap-x-6">
            {/* Left: CTA block */}
            <div className="col-span-12 md:col-span-7">
              <div className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4">— Get in touch</div>
              <a href={email ? `mailto:${email}` : "#contact"} className="t-display block text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.05] hover:opacity-80 transition break-words">
                {email || "say@hello.com"}
                <span style={{ color: s.primary }}>.</span>
              </a>
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs uppercase tracking-wider transition hover:bg-white hover:text-black"
                      style={{ borderColor: `${s.background}33` }}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sl.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right: meta column */}
            <div className="col-span-12 md:col-span-5 md:pl-8 md:border-l" style={{ borderColor: `${s.background}1a` }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] opacity-50 mb-2">Based In</div>
                  <div className="text-sm font-semibold">{location || "Remote · Worldwide"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] opacity-50 mb-2">Status</div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: s.primary }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: s.primary }} />
                    </span>
                    Available
                  </div>
                </div>
                {phone && (
                  <div className="col-span-2">
                    <div className="text-[10px] uppercase tracking-[0.25em] opacity-50 mb-2">Phone</div>
                    <a href={`tel:${phone}`} className="text-sm font-semibold hover:opacity-80">{phone}</a>
                  </div>
                )}
                <div className="col-span-2">
                  <div className="text-[10px] uppercase tracking-[0.25em] opacity-50 mb-2">Sitemap</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {NAV.map((n, i) => (
                      <a key={n.id} href={`#${n.id}`} className="text-xs opacity-70 hover:opacity-100">
                        {String(i + 1).padStart(2, "0")}/ {n.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Giant signature name */}
          <div className="mt-3 -mb-4 overflow-hidden pointer-events-none select-none">
            <div className="t-display font-black tracking-tighter leading-none whitespace-nowrap"
              style={{
                fontSize: "clamp(3rem, 14vw, 12rem)",
                background: `linear-gradient(180deg, ${s.background}22 0%, ${s.background}03 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {name}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-3 mt-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[11px] uppercase tracking-[0.2em] opacity-60" style={{ borderColor: `${s.background}1a` }}>
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: s.primary }} />
              <span>{footerText || `© ${new Date().getFullYear()} ${name} — All rights reserved`}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Crafted with Infolio</span>
              <a href="#home" className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full border hover:bg-white hover:text-black transition" style={{ borderColor: `${s.background}33` }}>
                ↑ Back to top
              </a>
            </div>
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

