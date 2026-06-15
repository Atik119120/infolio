import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe, Building2, TrendingUp, Briefcase, Award } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";

/**
 * Entrepreneur Theme — for founders & business owners.
 * Sections: Header → Hero → About → My Companies → Services → Contact → Footer
 */
const C = {
  primary: "#0f766e", // deep teal
  accent: "#f59e0b", // gold
  bg: "#fafaf7",
  surface: "#ffffff",
  ink: "#0a0a0a",
  ink2: "#1c1917",
  muted: "#57534e",
  border: "#e7e5e0",
  cream: "#f5f1ea",
};

export default function SmallBusinessTheme({
  profile,
  portfolio,
  projects,
  services = [],
  socialLinks,
  experiences,
  userId,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const headline = portfolio?.hero_headline || portfolio?.headline || "Founder & Entrepreneur";
  const bio = portfolio?.hero_subheadline || "Building businesses that solve real problems.";
  const aboutText = portfolio?.about_text || portfolio?.bio || bio;
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

  const vHero = isVisible(portfolio, "hero");
  const vAbout = isVisible(portfolio, "about");
  const vProjects = isVisible(portfolio, "projects");
  const vServices = isVisible(portfolio, "services");
  const vContact = isVisible(portfolio, "contact");

  const NAV = [
    vHero && { id: "home", label: "Home" },
    vAbout && { id: "about", label: "About" },
    vProjects && { id: "ventures", label: "Ventures" },
    vServices && { id: "services", label: "Services" },
    vContact && { id: "contact", label: "Contact" },
  ].filter(Boolean) as { id: string; label: string }[];

  const yearsActive = experiences.length > 0 ? `${experiences.length}+` : "5+";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:wght@500;600;700;800;900&display=swap');
        .e-display { font-family: 'Fraunces', Georgia, serif; }
        .e-btn-primary { background: ${C.ink}; color: #fff; transition: transform .2s, background .2s; }
        .e-btn-primary:hover { transform: translateY(-2px); background: ${C.primary}; }
        .e-btn-outline { border: 1.5px solid ${C.ink}; color: ${C.ink}; transition: all .2s; }
        .e-btn-outline:hover { background: ${C.ink}; color: #fff; }
        .e-link { transition: color .2s; }
        .e-link:hover { color: ${C.primary}; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: `${C.bg}e6`, borderBottom: `1px solid ${C.border}` }}>
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#home" className="e-display text-2xl font-bold tracking-tight">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-9 w-auto object-contain" />
            ) : (
              <span>
                {name.split(" ")[0]}
                <span style={{ color: C.primary }}>.</span>
              </span>
            )}
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="e-link" style={{ color: C.muted }}>{n.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#contact" className="e-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full">
              Let's Talk <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: C.border, background: C.surface }}>
            <div className="container mx-auto px-5 py-3 flex flex-col gap-3">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="py-2 text-sm">{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO — editorial founder intro */}
      {vHero && (
      <section id="home" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 85% 20%, ${C.primary}15, transparent 50%), radial-gradient(circle at 10% 90%, ${C.accent}10, transparent 50%)` }} />
        <div className="container mx-auto px-5 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-xs font-semibold"
                style={{ background: C.cream, color: C.primary, border: `1px solid ${C.primary}33` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.primary }} />
                Open to new ventures & collaborations
              </div>
              <h1 className="e-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
                Hi, I'm <span style={{ color: C.primary, fontStyle: "italic" }}>{name.split(" ")[0]}</span>
                <br />
                <span style={{ color: C.muted }}>an entrepreneur.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-xl leading-relaxed" style={{ color: C.muted }}>
                {headline}
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <a href={heroCtaLink || "#ventures"} className="e-btn-primary px-7 py-3.5 text-sm font-semibold rounded-full inline-flex items-center gap-2">
                  {heroCtaText || "See My Ventures"} <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="e-btn-outline px-7 py-3.5 text-sm font-semibold rounded-full">
                  Get in Touch
                </a>
              </div>

              {/* Stat strip */}
              <div className="grid grid-cols-3 gap-4 max-w-lg pt-8 border-t" style={{ borderColor: C.border }}>
                <div>
                  <div className="e-display text-3xl md:text-4xl font-bold" style={{ color: C.primary }}>{projects.length}+</div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: C.muted }}>Ventures</div>
                </div>
                <div>
                  <div className="e-display text-3xl md:text-4xl font-bold" style={{ color: C.primary }}>{yearsActive}</div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: C.muted }}>Years</div>
                </div>
                <div>
                  <div className="e-display text-3xl md:text-4xl font-bold" style={{ color: C.primary }}>{services.length}+</div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: C.muted }}>Services</div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="md:col-span-5">
              <div className="relative">
                <div aria-hidden className="absolute -top-6 -left-6 w-32 h-32 rounded-full"
                  style={{ background: C.accent, opacity: 0.2 }} />
                <div aria-hidden className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl"
                  style={{ background: C.primary, opacity: 0.15 }} />
                {heroImage ? (
                  <img src={heroImage} alt={name}
                    className="relative w-full max-w-sm mx-auto aspect-[4/5] object-cover rounded-3xl"
                    style={{ boxShadow: `0 30px 60px -20px ${C.ink}33` }} />
                ) : (
                  <div className="relative w-full max-w-sm mx-auto aspect-[4/5] flex items-center justify-center e-display text-8xl font-bold rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.ink2})`, color: "#fff" }}>
                    {name.charAt(0)}
                  </div>
                )}
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
                  style={{ border: `1px solid ${C.border}` }}>
                  <Award className="w-5 h-5" style={{ color: C.accent }} />
                  <div>
                    <div className="text-xs" style={{ color: C.muted }}>Founder</div>
                    <div className="text-sm font-bold">{location || "Worldwide"}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* ABOUT ME */}
      {vAbout && (
      <section id="about" className="py-20 md:py-28" style={{ background: C.surface }}>
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="md:col-span-5">
              <div className="relative">
                {aboutImage ? (
                  <img src={aboutImage} alt={name}
                    className="w-full aspect-square object-cover rounded-3xl"
                    style={{ boxShadow: `0 20px 60px -20px ${C.ink}22` }} />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center e-display text-9xl font-bold rounded-3xl"
                    style={{ background: C.cream, color: C.primary }}>
                    {name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-5 -right-5 px-6 py-4 rounded-2xl text-white"
                  style={{ background: C.primary, boxShadow: `0 15px 30px -10px ${C.primary}66` }}>
                  <div className="e-display text-2xl font-bold">{yearsActive}</div>
                  <div className="text-[11px] uppercase tracking-wider opacity-90">Years building</div>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} />
                About Me
              </div>
              <h2 className="e-display text-4xl md:text-5xl font-bold leading-tight mb-6">
                Building <span style={{ color: C.primary, fontStyle: "italic" }}>businesses</span> that matter.
              </h2>
              <p className="text-base md:text-lg leading-[1.85] mb-8" style={{ color: C.muted }}>
                {aboutText}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Building2 className="w-5 h-5" />, label: "Ventures", value: `${projects.length} active` },
                  { icon: <TrendingUp className="w-5 h-5" />, label: "Focus", value: "Growth & Strategy" },
                  { icon: <Briefcase className="w-5 h-5" />, label: "Experience", value: yearsActive + " years" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Based in", value: location || "Worldwide" },
                ].map((it) => (
                  <div key={it.label} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: C.cream }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: C.surface, color: C.primary }}>
                      {it.icon}
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>{it.label}</div>
                      <div className="font-semibold text-sm">{it.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#contact" className="e-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-full">
                Work With Me <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* MY VENTURES (Companies / Startups) */}
      {vProjects && projects.length > 0 && (
        <section id="ventures" className="py-20 md:py-28">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} />
                My Companies
                <span className="w-8 h-px" style={{ background: C.primary }} />
              </div>
              <h2 className="e-display text-4xl md:text-5xl font-bold leading-tight mb-3">
                Ventures &amp; <span style={{ color: C.primary, fontStyle: "italic" }}>Startups</span>
              </h2>
              <p className="text-base" style={{ color: C.muted }}>
                A portfolio of businesses I've founded, co-founded, or scaled.
              </p>
            </motion.div>

            <div className="space-y-6 max-w-5xl mx-auto">
              {projects.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={p.live_url || "#"}
                  target={p.live_url ? "_blank" : undefined}
                  rel="noreferrer"
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group block rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: `0 4px 20px -10px ${C.ink}1a` }}
                >
                  <div className="grid md:grid-cols-12 items-stretch">
                    <div className="md:col-span-5 aspect-[16/10] md:aspect-auto overflow-hidden flex items-center justify-center" style={{ background: C.cream }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-20 h-20" style={{ color: `${C.primary}66` }} />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-7 p-7 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="e-display text-xs font-bold tracking-[0.25em] uppercase" style={{ color: C.primary }}>
                          Venture {String(i + 1).padStart(2, "0")}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: C.accent, color: C.ink }}>
                            Flagship
                          </span>
                        )}
                      </div>
                      <h3 className="e-display text-2xl md:text-3xl font-bold mb-3 leading-tight">{p.title}</h3>
                      {p.description && (
                        <p className="text-base mb-5 leading-relaxed" style={{ color: C.muted }}>{p.description}</p>
                      )}
                      {p.tech_stack && p.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {p.tech_stack.map((t) => (
                            <span key={t} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: C.cream, color: C.ink2 }}>{t}</span>
                          ))}
                        </div>
                      )}
                      {p.live_url && (
                        <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: C.primary }}>
                          Visit Company <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      {vServices && services.length > 0 && (
        <section id="services" className="py-20 md:py-28" style={{ background: C.cream }}>
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} />
                My Services
                <span className="w-8 h-px" style={{ background: C.primary }} />
              </div>
              <h2 className="e-display text-4xl md:text-5xl font-bold leading-tight mb-3">
                How I can <span style={{ color: C.primary, fontStyle: "italic" }}>help you</span>
              </h2>
              <p className="text-base" style={{ color: C.muted }}>
                Strategic services for founders, businesses, and ambitious teams.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((sv, i) => (
                <motion.div
                  key={sv.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative p-8 rounded-3xl group transition-all duration-300 hover:-translate-y-1"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: `0 4px 20px -10px ${C.ink}1a` }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: C.cream, color: C.primary }}>
                    <ServiceIcon icon={sv.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="e-display text-xl font-bold mb-3">{sv.title}</h3>
                  {sv.description && (
                    <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>{sv.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.border }}>
                    {sv.price ? (
                      <span className="e-display font-bold" style={{ color: C.primary }}>{sv.price}</span>
                    ) : (
                      <span className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>On request</span>
                    )}
                    <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all group-hover:gap-2.5" style={{ color: C.primary }}>
                      Inquire <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {vContact && (
      <section id="contact" className="py-20 md:py-28" style={{ background: C.bg }}>
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: C.primary }}>
              <span className="w-8 h-px" style={{ background: C.primary }} />
              Contact Me
              <span className="w-8 h-px" style={{ background: C.primary }} />
            </div>
            <h2 className="e-display text-4xl md:text-5xl font-bold leading-tight mb-3">
              Let's <span style={{ color: C.primary, fontStyle: "italic" }}>build</span> something
            </h2>
            <p className="text-base" style={{ color: C.muted }}>
              Have an idea, a partnership, or just want to chat? I'd love to hear from you.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6">
            <motion.div {...fadeUp} className="md:col-span-2 space-y-3">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.cream, color: C.primary }}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>Email</div>
                    <div className="font-semibold truncate">{email}</div>
                  </div>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.cream, color: C.primary }}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>Phone</div>
                    <div className="font-semibold truncate">{phone}</div>
                  </div>
                </a>
              )}
              {location && (
                <div className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.cream, color: C.primary }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>Based in</div>
                    <div className="font-semibold truncate">{location}</div>
                  </div>
                </div>
              )}
              {website && (
                <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.cream, color: C.primary }}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>Website</div>
                    <div className="font-semibold truncate">{website.replace(/^https?:\/\//, "")}</div>
                  </div>
                </a>
              )}
            </motion.div>

            <motion.div {...fadeUp} className="md:col-span-3 p-6 md:p-7 rounded-2xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <ContactForm
                portfolioOwnerId={userId}
                themeStyle={{
                  surface: C.bg,
                  border: C.border,
                  text: C.ink,
                  textMuted: C.muted,
                  accent: C.primary,
                  accentText: "#ffffff",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: C.ink, color: "#fff" }} className="pt-16 pb-8">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt={name} className="h-10 w-auto object-contain mb-3" style={{ background: "transparent" }} />
              ) : (
                <div className="e-display text-2xl font-bold mb-3">{name}</div>
              )}
              <p className="text-sm opacity-70 mb-5 max-w-md">{headline}</p>
              <div className="flex gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition hover:-translate-y-0.5"
                      style={{ background: `${C.primary}33` }}>
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
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs opacity-60" style={{ borderColor: "#ffffff22" }}>
            <div>{footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}</div>
            {portfolio?.show_branding !== false && <div>Built with Infolio</div>}
          </div>
        </div>
      </footer>
    </div>
  );
}
