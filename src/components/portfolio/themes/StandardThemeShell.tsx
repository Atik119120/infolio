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

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-24" style={{ background: s.surface }}>
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="max-w-3xl mb-10">
            <SectionLabel s={s}>About Me</SectionLabel>
            <h2 className="t-display text-3xl md:text-5xl font-bold mt-3">A bit about my journey</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeUp} className="md:col-span-2">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: s.textMuted }}>{bio}</p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-4 text-sm">
              {location && <Info icon={<MapPin className="w-4 h-4" />} label="Location" value={location} s={s} />}
              {email && <Info icon={<Mail className="w-4 h-4" />} label="Email" value={email} s={s} />}
              {phone && <Info icon={<Phone className="w-4 h-4" />} label="Phone" value={phone} s={s} />}
              {website && <Info icon={<Globe className="w-4 h-4" />} label="Website" value={website} s={s} />}
              <div className="pt-4 grid grid-cols-2 gap-3">
                <Stat n={projects.length} label="Projects" s={s} />
                <Stat n={experiences.length} label="Experience" s={s} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 md:py-24">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
              <SectionLabel s={s}>My Skills</SectionLabel>
              <h2 className="t-display text-3xl md:text-5xl font-bold mt-3">Tools & expertise</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(grouped).map(([cat, list], i) => (
                <motion.div key={cat} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }} className="t-card p-6">
                  <h3 className="t-display text-lg font-semibold mb-4" style={{ color: s.primary }}>{cat}</h3>
                  <div className="space-y-3">
                    {list.map((sk) => (
                      <div key={sk.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span style={{ color: s.text }}>{sk.name}</span>
                          <span style={{ color: s.textMuted }}>{sk.proficiency}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: s.border }}>
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${sk.proficiency || 0}%` }}
                            viewport={{ once: true }} transition={{ duration: 0.9 }}
                            style={{ background: `linear-gradient(90deg, ${s.primary}, ${s.accent})`, height: "100%" }} />
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

      {/* SERVICES */}
      {services.length > 0 && (
        <section id="services" className="py-20 md:py-24" style={{ background: s.surface }}>
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
              <SectionLabel s={s}>Services</SectionLabel>
              <h2 className="t-display text-3xl md:text-5xl font-bold mt-3">What I can do for you</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((sv, i) => (
                <motion.div key={sv.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="t-card p-6 group hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">{sv.icon || "✨"}</div>
                  <h3 className="t-display text-xl font-semibold mb-2">{sv.title}</h3>
                  {sv.description && <p className="text-sm leading-relaxed mb-4" style={{ color: s.textMuted }}>{sv.description}</p>}
                  {sv.price && (
                    <div className="text-sm font-semibold inline-block px-3 py-1 rounded-full" style={{ background: `${s.primary}15`, color: s.primary }}>
                      {sv.price}
                    </div>
                  )}
                </motion.div>
              ))}
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

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-24 relative overflow-hidden" style={{ background: s.surface }}>
        <div className="absolute inset-0 t-bg-deco pointer-events-none" />
        <div className="container mx-auto px-5 relative">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <SectionLabel s={s}>Get in Touch</SectionLabel>
            <h2 className="t-display text-3xl md:text-5xl font-bold mt-3">Let's work together</h2>
            <p className="mt-4" style={{ color: s.textMuted }}>Have a project in mind? Send me a message and I'll get back to you.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="space-y-4">
              {email && <ContactCard icon={<Mail className="w-5 h-5" />} label="Email" value={email} href={`mailto:${email}`} s={s} />}
              {phone && <ContactCard icon={<Phone className="w-5 h-5" />} label="Phone" value={phone} href={`tel:${phone}`} s={s} />}
              {location && <ContactCard icon={<MapPin className="w-5 h-5" />} label="Location" value={location} s={s} />}
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="t-card p-5">
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
