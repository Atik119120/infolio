import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe, ExternalLink, Camera, Award, Aperture } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";

/**
 * Studio Lens — Photographer theme.
 * Sections: Header → Hero (scrolling photo carousel + captions) → About (with Awards) →
 *           Services → Photography gallery → Contact → Footer
 */
const C = {
  primary: "#d4af37", // gold
  bg: "#0a0a0a",
  surface: "#141414",
  surface2: "#1c1c1c",
  ink: "#f5f5f5",
  muted: "#a3a3a3",
  border: "#262626",
};

export default function PRDPhotographerTheme({
  profile,
  portfolio,
  projects,
  services = [],
  socialLinks,
  experiences,
  education,
  userId,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<typeof projects[number] | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    document.body.style.overflow = activePhoto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activePhoto]);

  const name = profile?.display_name || "Your Name";
  const headline = portfolio?.headline || "Visual Storyteller";
  const bio = portfolio?.bio || "I capture moments that words can't tell.";
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
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  // Hero carousel: featured (or all) projects with images
  const heroPhotos = useMemo(() => {
    const withImg = projects.filter((p) => p.image_url);
    const featured = withImg.filter((p) => p.featured);
    const list = featured.length > 0 ? featured : withImg;
    // duplicate for seamless marquee
    return list.length > 0 ? [...list, ...list] : [];
  }, [projects]);

  // Awards = combine education honors + featured projects + experience milestones
  const awards = useMemo(() => {
    const list: { title: string; sub: string; year: string }[] = [];
    education.forEach((e) => {
      list.push({ title: e.degree, sub: e.institution, year: e.end_date ? new Date(e.end_date).getFullYear().toString() : "—" });
    });
    experiences.slice(0, 3).forEach((e) => {
      list.push({ title: e.position, sub: e.company, year: e.start_date ? new Date(e.start_date).getFullYear().toString() : "—" });
    });
    return list.slice(0, 6);
  }, [education, experiences]);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@500;700;900&display=swap');
        .sl-display { font-family: 'Playfair Display', Georgia, serif; }
        .sl-btn-primary { background: ${C.primary}; color: ${C.bg}; transition: all .2s; }
        .sl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px ${C.primary}55; }
        .sl-btn-outline { border: 1px solid ${C.primary}; color: ${C.primary}; transition: all .2s; }
        .sl-btn-outline:hover { background: ${C.primary}; color: ${C.bg}; }
        .sl-link { transition: color .2s; }
        .sl-link:hover { color: ${C.primary}; }
        @keyframes hero-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sl-carousel { animation: hero-scroll 60s linear infinite; }
        .sl-carousel:hover { animation-play-state: paused; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 gx-glass-nav">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#home" className="sl-display text-2xl font-bold tracking-tight flex items-center gap-2" style={{ color: C.ink }}>
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-9 w-auto object-contain" />
            ) : (
              <>
                <Aperture className="w-6 h-6" style={{ color: C.primary }} />
                <span className="italic">{name.split(" ")[0]}</span>
              </>
            )}
          </a>
          <nav className="hidden md:flex items-center gap-1 text-sm tracking-wider uppercase gx-glass rounded-full px-2 py-1.5">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="sl-link px-4 py-1.5 rounded-full hover:bg-white/10 transition" style={{ color: C.muted }}>{n.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#contact" className="sl-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full">
              Book a Shoot <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden gx-glass-nav">
            <div className="container mx-auto px-5 py-3 flex flex-col gap-3">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="py-2 text-sm uppercase tracking-wider">{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative pt-12 md:pt-16 pb-20 overflow-hidden">
        <div className="gx-mesh gx-blob" />
        <div className="container mx-auto px-5 mb-10 md:mb-14 relative">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-medium tracking-[0.3em] uppercase rounded-full gx-glass"
              style={{ color: C.primary }}>
              <Camera className="w-3 h-3" /> Photographer · Booking 2026
            </div>
            <h1 className="sl-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-5">
              {name.split(" ")[0]}
              <span className="italic" style={{ color: C.primary }}> {name.split(" ").slice(1).join(" ") || "."}</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: C.muted }}>
              {headline}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#gallery" className="sl-btn-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 rounded-full">
                View Portfolio
              </a>
              <a href="#contact" className="gx-glass px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition" style={{ color: C.ink }}>
                Book Session
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scrolling photo carousel */}
        {heroPhotos.length > 0 ? (
          <div className="relative" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
            <div className="flex gap-5 sl-carousel w-max">
              {heroPhotos.map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  className="relative shrink-0 w-[280px] md:w-[360px] aspect-[3/4] overflow-hidden group cursor-pointer"
                  style={{ background: C.surface }}
                  onClick={() => setActivePhoto(p)}
                >
                  <img src={p.image_url!} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 50%)" }}>
                    <div className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: C.primary }}>
                      {p.tech_stack?.[0] || "Photography"}
                    </div>
                    <h3 className="sl-display text-xl font-semibold text-white">{p.title}</h3>
                    {p.description && (
                      <p className="text-xs text-white/70 mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-5">
            <div className="aspect-[16/9] flex items-center justify-center" style={{ background: C.surface }}>
              <Camera className="w-16 h-16" style={{ color: C.primary }} />
            </div>
          </div>
        )}

        {/* Stats strip */}
        <div className="container mx-auto px-5 mt-12">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t" style={{ borderColor: C.border }}>
            <Stat n={projects.length} label="Shoots" />
            <Stat n={experiences.length} label="Years" />
            <Stat n={awards.length} label="Awards" />
          </div>
        </div>
      </section>

      {/* ABOUT (includes Awards) */}
      <section id="about" className="py-20 md:py-28" style={{ background: C.surface }}>
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <motion.div {...fadeUp} className="md:col-span-5">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={name} className="w-full aspect-[4/5] object-cover" />
                ) : (
                  <div className="w-full aspect-[4/5] flex items-center justify-center sl-display text-9xl font-bold"
                    style={{ background: C.surface2, color: C.primary }}>
                    {name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-4 -right-4 px-5 py-3"
                  style={{ background: C.primary, color: C.bg }}>
                  <div className="sl-display text-2xl font-bold italic">{experiences.length || "5"}+</div>
                  <div className="text-[10px] uppercase tracking-[0.25em]">Years Behind the Lens</div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-7">
              <div className="text-[11px] font-medium tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
                — About Me
              </div>
              <h2 className="sl-display text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
                Telling stories<br />
                <span className="italic" style={{ color: C.primary }}>through light.</span>
              </h2>
              <p className="text-base md:text-lg leading-[1.85] mb-8" style={{ color: C.muted }}>
                {bio}
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-10">
                {phone && <FactRow label="Phone" value={phone} />}
                {location && <FactRow label="Studio" value={location} />}
                {email && <FactRow label="Email" value={email} />}
                {website && <FactRow label="Website" value={website.replace(/^https?:\/\//, "")} />}
              </div>

              {/* AWARDS inside About */}
              {awards.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Award className="w-5 h-5" style={{ color: C.primary }} />
                    <h3 className="sl-display text-2xl font-bold">Awards & Recognition</h3>
                  </div>
                  <div className="space-y-3">
                    {awards.map((a, i) => (
                      <div key={i} className="flex items-start gap-5 py-4 border-t" style={{ borderColor: C.border }}>
                        <span className="sl-display text-xl font-bold w-16 shrink-0" style={{ color: C.primary }}>
                          {a.year}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{a.title}</div>
                          <div className="text-sm" style={{ color: C.muted }}>{a.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section id="services" className="py-20 md:py-28">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-[11px] font-medium tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
                — My Services
              </div>
              <h2 className="sl-display text-4xl md:text-6xl font-bold leading-[1.05] mb-3">
                Sessions <span className="italic" style={{ color: C.primary }}>tailored</span> for you
              </h2>
              <p className="text-base" style={{ color: C.muted }}>
                Every shoot is shaped around your story, light, and vision.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((sv, i) => (
                <motion.div
                  key={sv.id}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative p-8 rounded-2xl gx-glass gx-glow-ring group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 flex items-center justify-center mb-5 rounded-xl gx-glass-strong"
                    style={{ color: C.primary }}>
                    <ServiceIcon icon={sv.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="sl-display text-2xl font-bold mb-3 italic">{sv.title}</h3>
                  {sv.description && (
                    <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>{sv.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.border }}>
                    {sv.price ? (
                      <span className="sl-display font-bold italic" style={{ color: C.primary }}>{sv.price}</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: C.muted }}>On request</span>
                    )}
                    <a href="#contact" className="text-[10px] font-bold uppercase tracking-[0.25em] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all" style={{ color: C.primary }}>
                      Inquire <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PHOTOGRAPHY GALLERY */}
      {projects.length > 0 && (
        <section id="gallery" className="py-20 md:py-28" style={{ background: C.surface }}>
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <div className="text-[11px] font-medium tracking-[0.3em] uppercase mb-3" style={{ color: C.primary }}>
                  — My Photographs
                </div>
                <h2 className="sl-display text-4xl md:text-6xl font-bold leading-[1.05]">
                  The <span className="italic" style={{ color: C.primary }}>Gallery</span>
                </h2>
              </div>
              <p className="text-sm max-w-sm" style={{ color: C.muted }}>
                Click any frame to enter the full story.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
              {projects.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => setActivePhoto(p)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                  className={`group relative overflow-hidden ${i % 7 === 0 ? "row-span-2 col-span-2" : i % 5 === 0 ? "row-span-2" : ""}`}
                  style={{ background: C.surface2 }}
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover aspect-square transition-all duration-700 group-hover:scale-110"
                      style={{ minHeight: "100%" }}
                    />
                  ) : (
                    <div className="w-full h-full aspect-square flex items-center justify-center">
                      <Camera className="w-12 h-12" style={{ color: C.primary }} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 45%, transparent 75%)" }}>
                    <div className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: C.primary }}>{(p as any).category || "Photo"}</div>
                    <h3 className="sl-display text-base md:text-lg font-bold text-white leading-tight">{p.title}</h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] font-medium tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
              — Contact Me
            </div>
            <h2 className="sl-display text-4xl md:text-6xl font-bold leading-[1.05] mb-3">
              Let's create <span className="italic" style={{ color: C.primary }}>magic</span>
            </h2>
            <p className="text-base" style={{ color: C.muted }}>
              Tell me about your shoot. I respond to every inquiry within 24 hours.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
            {email && <ContactCard icon={<Mail className="w-5 h-5" />} label="Email" value={email} href={`mailto:${email}`} />}
            {phone && <ContactCard icon={<Phone className="w-5 h-5" />} label="Phone" value={phone} href={`tel:${phone}`} />}
            {location && <ContactCard icon={<MapPin className="w-5 h-5" />} label="Studio" value={location} />}
            {website && <ContactCard icon={<Globe className="w-5 h-5" />} label="Website" value={website.replace(/^https?:\/\//, "")} href={website} />}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#000", color: C.ink }} className="pt-16 pb-8 border-t" >
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="sl-display text-2xl font-bold mb-3 flex items-center gap-2">
                <Aperture className="w-6 h-6" style={{ color: C.primary }} /> {name}
              </div>
              <p className="text-sm opacity-70 mb-5 max-w-md">{headline}</p>
              <div className="flex gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition hover:-translate-y-0.5"
                      style={{ background: `${C.primary}22`, border: `1px solid ${C.primary}44` }}>
                      <Icon className="w-4 h-4" style={{ color: C.primary }} />
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
            <div>© {new Date().getFullYear()} {name}. All rights reserved.</div>
            <div>Built with Alpha Portfolio</div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(0,0,0,0.96)" }}
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden grid md:grid-cols-3"
              style={{ background: C.surface }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full transition"
                style={{ background: C.bg, color: C.primary, border: `1px solid ${C.primary}` }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:col-span-2 max-h-[92vh] overflow-hidden flex items-center justify-center" style={{ background: "#000" }}>
                {activePhoto.image_url ? (
                  <img src={activePhoto.image_url} alt={activePhoto.title} className="w-full h-full object-contain max-h-[92vh]" />
                ) : (
                  <Camera className="w-24 h-24" style={{ color: C.primary }} />
                )}
              </div>

              <div className="p-8 md:p-10 overflow-y-auto max-h-[92vh]">
                <div className="text-[10px] font-medium tracking-[0.3em] uppercase mb-3" style={{ color: C.primary }}>
                  Photograph
                </div>
                <h3 className="sl-display text-3xl font-bold leading-tight mb-4">{activePhoto.title}</h3>
                {activePhoto.description && (
                  <p className="text-base leading-[1.85] mb-6" style={{ color: C.muted }}>{activePhoto.description}</p>
                )}
                {activePhoto.tech_stack && activePhoto.tech_stack.length > 0 && (
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color: C.primary }}>Gear & Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {activePhoto.tech_stack.map((t) => (
                        <span key={t} className="text-xs px-3 py-1.5" style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.border}` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {activePhoto.live_url && (
                  <a href={activePhoto.live_url} target="_blank" rel="noreferrer"
                    className="sl-btn-primary inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em]">
                    View Full Story <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-[10px] uppercase tracking-[0.25em] shrink-0 w-20" style={{ color: C.primary }}>{label}</span>
      <span className="truncate" style={{ color: C.ink }}>{value}</span>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <div className="sl-display text-3xl md:text-4xl font-bold italic" style={{ color: C.primary }}>{n}+</div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: C.muted }}>{label}</div>
    </div>
  );
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="w-12 h-12 flex items-center justify-center" style={{ background: C.surface2, color: C.primary, border: `1px solid ${C.primary}33` }}>
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
