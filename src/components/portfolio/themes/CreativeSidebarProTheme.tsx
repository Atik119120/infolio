import { useEffect, useState } from "react";
import { Menu, X, Mail, Phone, MapPin, Globe, ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";

/**
 * Creative Sidebar Pro — Editorial magazine-grade refresh.
 * Fixed left sidebar + serif/sans typography pairing, hairline borders,
 * asymmetric layouts, section numbering, refined accent usage.
 */

const NAV = [
  { id: "home", label: "Home", key: "hero" as const },
  { id: "about", label: "About", key: "about" as const },
  { id: "services", label: "Services", key: "services" as const },
  { id: "portfolio", label: "Portfolio", key: "projects" as const },
  { id: "contact", label: "Contact", key: "contact" as const },
];

const DEMO_SERVICES = [
  { id: "d1", title: "Web Development", description: "Building modern, responsive, and functional websites.", icon: "code" },
  { id: "d2", title: "Graphic Design", description: "Crafting beautiful and impactful visual designs for your brand.", icon: "palette" },
  { id: "d3", title: "Photography", description: "Capturing stunning moments and visually appealing photographs.", icon: "camera" },
  { id: "d4", title: "Brand Strategy", description: "Establishing a memorable identity and authoritative digital presence.", icon: "sparkles" },
];

const DEMO_PROJECTS = [
  { id: "p1", title: "Creative Visuals", description: "Graphic Design", image_url: "" },
  { id: "p2", title: "Visual Storytelling", description: "Digital Art", image_url: "" },
  { id: "p3", title: "Graphic Artwork", description: "Illustration", image_url: "" },
  { id: "p4", title: "Brand Identity", description: "Logo Design", image_url: "" },
];

const DEMO_TESTIMONIALS = [
  { id: "t1", name: "Bilal Ahmed", position: "IT Manager", review: "Outstanding work and clear communication throughout the project." },
  { id: "t2", name: "Saman Malik", position: "Customer Support Lead", review: "Delivered beyond expectations. Highly recommended." },
  { id: "t3", name: "Briana Patton", position: "Operations Manager", review: "Professional, creative, and always on time." },
];

const DEMO_CLIENTS = ["AURA", "Power Falcon", "AlphaZero", "Black", "Alokchitra"];

export default function CreativeSidebarProTheme({
  profile,
  portfolio,
  projects,
  services = [],
  socialLinks,
  userId,
  contactItems = [],
}: ThemeProps & { contactItems?: any[] }) {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handler = () => {
      const offsets = NAV.map(n => {
        const el = document.getElementById(n.id);
        if (!el) return { id: n.id, top: Infinity };
        return { id: n.id, top: Math.abs(el.getBoundingClientRect().top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setActive(offsets[0].id);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const primary = (portfolio as any)?.primary_color || "#1A1A1A";
  const accent = (portfolio as any)?.accent_color || "#C9A24C";
  const paper = "#FAF9F6";
  const ink = "#1A1A1A";
  const hairline = "#EAE7E0";

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const profession = portfolio?.hero_subheadline || portfolio?.headline || "Creative Professional";
  const heroHeadline = portfolio?.hero_headline || `Hi, I'm ${name}.`;
  const heroDesc = portfolio?.bio || "A passionate creative designer crafting impactful digital experiences with clean design and modern code.";
  const heroImg = portfolio?.hero_image_url || profile?.avatar_url;
  const avatar = profile?.avatar_url;
  const aboutImg = portfolio?.about_image_url || avatar;
  const aboutText = portfolio?.about_text || heroDesc;
  const footerText = portfolio?.footer_text || `© ${new Date().getFullYear()} ${name}`;
  const cta1Text = portfolio?.hero_cta_text || "Hire Me";
  const cta1Link = portfolio?.hero_cta_link || "#contact";

  const showServices = services.length > 0 ? services : DEMO_SERVICES as any;
  const showProjects = projects.length > 0 ? projects : DEMO_PROJECTS as any;
  const showTestimonials = DEMO_TESTIMONIALS;
  const showClients = DEMO_CLIENTS;
  const showContacts = contactItems.length > 0 ? contactItems : [
    profile?.email && { id: "c-mail", type: "email", label: "Email Address", value: profile.email, icon: "mail" },
    portfolio?.phone && { id: "c-ph", type: "phone", label: "Contact Number", value: portfolio.phone, icon: "phone" },
    portfolio?.location && { id: "c-loc", type: "address", label: "Address", value: portfolio.location, icon: "map" },
  ].filter(Boolean) as any[];

  const vHero = isVisible(portfolio, "hero");
  const vAbout = isVisible(portfolio, "about");
  const vServices = isVisible(portfolio, "services");
  const vProjects = isVisible(portfolio, "projects");
  const vContact = isVisible(portfolio, "contact");
  const vSocial = isVisible(portfolio, "social");

  const visibleNav = NAV.filter(n => isVisible(portfolio, n.key));

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const serif = "'Playfair Display', 'Cormorant Garamond', Georgia, serif";

  const sidebarContent = (
    <div className="flex flex-col h-full px-8 py-10">
      {/* Top: avatar + name */}
      <div className="flex flex-col items-start">
        <div className="relative w-24 h-24 mb-6 rounded-2xl overflow-hidden" style={{ background: "#F2EFE8" }}>
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: primary }}>
              {name.charAt(0)}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold leading-tight" style={{ color: ink, fontFamily: serif }}>{name}</h2>
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase mt-2" style={{ color: accent }}>
          {profession}
        </p>
      </div>

      {/* Menu */}
      <nav className="mt-12 flex flex-col gap-1">
        {visibleNav.map((item, i) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="group text-left py-2.5 text-sm font-medium transition-all flex items-center gap-3"
              style={{ color: isActive ? ink : "#9A958A" }}
            >
              <span
                className="text-[10px] tabular-nums tracking-widest font-mono"
                style={{ color: isActive ? accent : "#C6C0B2" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative">
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px" style={{ background: ink }} />
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-8 border-t" style={{ borderColor: hairline }}>
        {vSocial && socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5">
            {socialLinks.map(s => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-60"
                  style={{ color: ink }}
                  aria-label={s.platform}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
        <p className="text-[10px] tracking-widest uppercase" style={{ color: "#9A958A" }}>{footerText}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: paper, color: ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&display=swap');
        html { scroll-behavior: smooth; }
        .svc-card { transition: background .35s ease, color .35s ease; }
        .svc-card:hover { background: ${ink}; color: #fff; }
        .svc-card:hover .svc-title { color: #fff; }
        .svc-card:hover .svc-desc { color: rgba(255,255,255,0.65); }
        .svc-card:hover .svc-icon-wrap { background: rgba(255,255,255,0.08); color: ${accent}; }
        .svc-card:hover .svc-num { color: ${accent}; }
      `}</style>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 border-b px-5 h-14 flex items-center justify-between" style={{ background: paper, borderColor: hairline }}>
        <div className="flex items-center gap-3">
          {avatar && <img src={avatar} alt={name} className="w-9 h-9 rounded-lg object-cover" />}
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: ink, fontFamily: serif }}>{name}</p>
            <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: accent }}>{profession}</p>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-2" aria-label="Menu">
          <Menu className="w-5 h-5" style={{ color: ink }} />
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 shadow-xl" style={{ background: paper }}>
            <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 p-2 z-10" aria-label="Close">
              <X className="w-5 h-5" style={{ color: ink }} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[300px] border-r z-30" style={{ background: paper, borderColor: hairline }}>
        {sidebarContent}
      </aside>

      <main className="lg:ml-[300px]">
        {/* HERO */}
        {vHero && (
          <section id="home" className="min-h-screen flex items-center px-6 lg:px-20 py-20 border-b" style={{ borderColor: hairline }}>
            <div className="grid lg:grid-cols-12 gap-12 items-center w-full max-w-6xl mx-auto">
              <div className="lg:col-span-7">
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-6 flex items-center gap-3" style={{ color: accent }}>
                  <span className="h-px w-8" style={{ background: accent }} /> Available for projects
                </p>
                <h1 className="text-5xl lg:text-7xl leading-[1.05] tracking-tight" style={{ color: ink, fontFamily: serif, fontWeight: 700 }}>
                  {heroHeadline.split(" ").slice(0, -1).join(" ")}{" "}
                  <span style={{ fontStyle: "italic", fontWeight: 500 }}>{heroHeadline.split(" ").slice(-1).join(" ")}</span>
                </h1>
                <p className="mt-8 text-lg leading-relaxed max-w-lg" style={{ color: "#5C5850" }}>
                  A passionate{" "}
                  <span className="font-semibold border-b-2 pb-0.5" style={{ color: ink, borderColor: accent }}>{profession}</span>
                  . {heroDesc}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={cta1Link}
                    className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-90 flex items-center gap-3"
                    style={{ background: ink, color: "#fff" }}
                  >
                    {cta1Text} <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#portfolio"
                    className="px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] border transition-all hover:bg-white"
                    style={{ borderColor: "#D9D4C7", color: ink }}
                  >
                    View Work
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                {heroImg ? (
                  <div className="relative">
                    <div className="absolute -bottom-5 -right-5 w-full h-full border" style={{ borderColor: accent }} />
                    <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "#F2EFE8" }}>
                      <img src={heroImg} alt={name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/5] flex items-center justify-center text-7xl" style={{ background: accent, color: ink, fontFamily: serif }}>
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {vAbout && (
          <section id="about" className="px-6 lg:px-20 py-28 border-b" style={{ borderColor: hairline }}>
            <div className="max-w-6xl mx-auto">
              <SectionLabel number="01" label="About" accent={accent} />
              <div className="grid lg:grid-cols-2 gap-16 items-start mt-10">
                <div className="relative">
                  {aboutImg ? (
                    <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "#F2EFE8" }}>
                      <img src={aboutImg} alt="About" className="w-full h-full object-cover grayscale" />
                    </div>
                  ) : null}
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl max-w-[200px] border" style={{ borderColor: hairline }}>
                    <p className="text-4xl" style={{ fontFamily: serif, color: ink }}>05<span style={{ color: accent }}>+</span></p>
                    <p className="text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: "#9A958A" }}>Years of craft</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl lg:text-5xl leading-tight" style={{ fontFamily: serif, color: ink, fontWeight: 700 }}>
                    Merging <span style={{ fontStyle: "italic", fontWeight: 500 }}>aesthetic precision</span> with functional strategy.
                  </h2>
                  <p className="mt-8 leading-relaxed text-base" style={{ color: "#5C5850" }}>{aboutText}</p>

                  <div className="mt-10 grid sm:grid-cols-2 gap-y-6 gap-x-8">
                    {profile?.email && <InfoLine label="Email" value={profile.email} ink={ink} />}
                    {portfolio?.phone && <InfoLine label="Phone" value={portfolio.phone} ink={ink} />}
                    {portfolio?.location && <InfoLine label="Residence" value={portfolio.location} ink={ink} />}
                    {portfolio?.website && <InfoLine label="Website" value={portfolio.website} ink={ink} />}
                  </div>

                  <a href="#contact" className="inline-flex items-center gap-3 mt-12 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ background: accent, color: ink }}>
                    Get a Custom Quote <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SERVICES */}
        {vServices && (
          <section id="services" className="px-6 lg:px-20 py-28 border-b" style={{ borderColor: hairline, background: "#F4F1EA" }}>
            <div className="max-w-6xl mx-auto">
              <SectionLabel number="02" label="Services" accent={accent} />
              <h2 className="text-4xl lg:text-5xl mt-6 max-w-2xl" style={{ fontFamily: serif, color: ink, fontWeight: 700 }}>
                How I help <span style={{ fontStyle: "italic", fontWeight: 500 }}>brands</span> grow.
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 mt-16 border-t border-l" style={{ borderColor: hairline }}>
                {(showServices as any[]).map((s, i) => (
                  <div
                    key={s.id}
                    className="svc-card p-8 border-r border-b group cursor-default"
                    style={{ borderColor: hairline, background: "#FAF9F6", color: ink }}
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="svc-icon-wrap w-11 h-11 flex items-center justify-center" style={{ background: "#F2EFE8", color: accent }}>
                        <ServiceIcon icon={s.icon || "sparkles"} className="w-5 h-5" />
                      </div>
                      <span className="svc-num text-[10px] font-mono tracking-widest" style={{ color: "#C6C0B2" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="svc-title text-xl mb-3" style={{ fontFamily: serif, color: ink, fontWeight: 700 }}>{s.title}</h3>
                    <p className="svc-desc text-sm leading-relaxed" style={{ color: "#5C5850" }}>{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PORTFOLIO */}
        {vProjects && (
          <section id="portfolio" className="px-6 lg:px-20 py-28 border-b" style={{ borderColor: hairline }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
                <div>
                  <SectionLabel number="03" label="Selected Works" accent={accent} />
                  <h2 className="text-4xl lg:text-5xl mt-6" style={{ fontFamily: serif, color: ink, fontWeight: 700 }}>
                    Portfolio <span style={{ fontStyle: "italic", fontWeight: 500 }}>highlights</span>
                  </h2>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-20">
                {(showProjects as any[]).map((p, i) => (
                  <a
                    key={p.id}
                    href={p.live_url || "#"}
                    target={p.live_url ? "_blank" : undefined}
                    rel="noreferrer"
                    className={`group block ${i % 2 === 1 ? "sm:translate-y-16" : ""}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden mb-6" style={{ background: "#F2EFE8" }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}22, ${ink}11)` }}>
                          <span className="text-6xl" style={{ color: ink, fontFamily: serif }}>{p.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: accent }}>{p.description || "Project"}</p>
                    <h3 className="text-2xl flex items-center gap-3" style={{ fontFamily: serif, color: ink, fontWeight: 700 }}>
                      {p.title}
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CLIENTS */}
        <section className="px-6 lg:px-20 py-16 border-b" style={{ borderColor: hairline }}>
          <div className="max-w-6xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-center mb-10" style={{ color: "#9A958A" }}>Trusted by innovative brands</p>
            <div className="flex flex-wrap justify-between items-center gap-8 opacity-50">
              {showClients.map((c, i) => (
                <span key={i} className="text-xl tracking-tighter font-bold" style={{ color: ink, fontFamily: i % 2 === 0 ? serif : "inherit", fontStyle: i % 2 === 1 ? "italic" : "normal" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="px-6 lg:px-20 py-28" style={{ background: ink, color: "#fff" }}>
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-6" style={{ color: accent }}>
              04 / Testimonials
            </p>
            <h2 className="text-3xl lg:text-4xl mb-16 max-w-2xl" style={{ fontFamily: serif, fontWeight: 700 }}>
              Words from <span style={{ fontStyle: "italic", fontWeight: 500 }}>clients</span>.
            </h2>
            <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.1)" }}>
              {showTestimonials.map(t => (
                <div key={t.id} className="p-10" style={{ background: ink }}>
                  <span className="text-6xl leading-none block mb-4" style={{ color: accent, fontFamily: serif }}>"</span>
                  <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>
                    {t.review}
                  </p>
                  <div className="pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <p className="font-bold text-sm" style={{ fontFamily: serif }}>{t.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: accent }}>{t.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        {vContact && (
          <section id="contact" className="px-6 lg:px-20 py-28">
            <div className="max-w-6xl mx-auto">
              <SectionLabel number="05" label="Contact" accent={accent} />
              <h2 className="text-4xl lg:text-5xl mt-6 mb-16 max-w-2xl" style={{ fontFamily: serif, color: ink, fontWeight: 700 }}>
                Let's talk about your <span style={{ fontStyle: "italic", fontWeight: 500 }}>next project</span>.
              </h2>
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <ContactForm
                    portfolioOwnerId={userId || ""}
                    themeStyle={{
                      surface: "#FAF9F6",
                      border: hairline,
                      text: ink,
                      textMuted: "#5C5850",
                      accent: ink,
                      accentText: "#FFFFFF",
                    }}
                  />
                </div>
                <div className="space-y-8">
                  {showContacts.map((item: any) => {
                    const Icon = item.icon === "phone" ? Phone : item.icon === "map" ? MapPin : item.icon === "web" ? Globe : Mail;
                    return (
                      <div key={item.id} className="border-l-2 pl-5" style={{ borderColor: accent }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                          <p className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: "#9A958A" }}>{item.label || item.type}</p>
                        </div>
                        <p className="text-base break-words" style={{ color: ink, fontFamily: serif }}>{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SectionLabel({ number, label, accent }: { number: string; label: string; accent: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.3em] uppercase flex items-center gap-3" style={{ color: accent }}>
      <span className="font-mono">{number}</span>
      <span className="h-px w-8" style={{ background: accent }} />
      <span style={{ color: "#9A958A" }}>{label}</span>
    </p>
  );
}

function InfoLine({ label, value, ink }: { label: string; value: string; ink: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: "#9A958A" }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: ink }}>{value}</p>
    </div>
  );
}
