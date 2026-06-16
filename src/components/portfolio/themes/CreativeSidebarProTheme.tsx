import { useEffect, useState, useMemo } from "react";
import { Menu, X, Mail, Phone, MapPin, Globe, ExternalLink, ArrowUpRight, Send } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";

/**
 * Creative Sidebar Pro — Fixed-sidebar freelancer portfolio.
 * Matches reference: cream/yellow accent, circular avatar with ring,
 * Hero / About / Services / Portfolio / Clients / Testimonials / Contact.
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

  // Scroll spy
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

  const primary = (portfolio as any)?.primary_color || "#0B1B33";
  const accent = (portfolio as any)?.accent_color || "#F5B91C";
  const cream = "#FBF6E2";
  const softBg = "#F5F6F8";

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const profession = portfolio?.hero_subheadline || portfolio?.headline || "Creative Professional";
  const heroHeadline = portfolio?.hero_headline || `Hi, I'm ${name}!`;
  const heroDesc = portfolio?.bio || "A passionate creative designer crafting impactful digital experiences with clean design and modern code.";
  const heroImg = portfolio?.hero_image_url || profile?.avatar_url;
  const avatar = profile?.avatar_url;
  const aboutImg = portfolio?.about_image_url || avatar;
  const aboutHeading = `I'm ${name}`;
  const aboutText = portfolio?.about_text || heroDesc;
  const footerText = portfolio?.footer_text || `© ${new Date().getFullYear()} ${name}`;
  const cta1Text = portfolio?.hero_cta_text || "Hire Me";
  const cta1Link = portfolio?.hero_cta_link || "#contact";
  const cta2Text = "View Work";
  const cta2Link = "#portfolio";

  const showServices = services.length > 0 ? services : DEMO_SERVICES as any;
  const showProjects = projects.length > 0 ? projects : DEMO_PROJECTS as any;
  const showTestimonials = DEMO_TESTIMONIALS; // no DB table yet
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

  const sidebarContent = (
    <div className="flex flex-col h-full px-6 py-8">
      {/* Top: avatar + name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-4">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 220deg, ${accent} 0deg, ${accent} 200deg, transparent 200deg)`,
              padding: 3,
            }}
          >
            <div className="w-full h-full rounded-full bg-white p-1">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold" style={{ color: primary }}>
                  {name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
        <h2 className="font-bold text-lg" style={{ color: primary }}>{name}</h2>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mt-1" style={{ color: accent }}>
          {profession}
        </p>
      </div>

      {/* Menu */}
      <nav className="mt-10 flex flex-col gap-1">
        {visibleNav.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-center py-3 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: isActive ? "#F1F3F5" : "transparent",
                color: isActive ? accent : primary,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: social + copyright */}
      <div className="mt-auto pt-6">
        {vSocial && socialLinks.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mb-4">
            {socialLinks.map(s => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  style={{ color: primary }}
                  aria-label={s.platform}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
        <div className="text-center text-xs text-gray-400 leading-relaxed">
          <p>{footerText}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Mobile top header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar && <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover ring-2" style={{ ['--tw-ring-color' as any]: accent }} />}
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: primary }}>{name}</p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: accent }}>{profession}</p>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Menu">
          <Menu className="w-5 h-5" style={{ color: primary }} />
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 p-2 z-10" aria-label="Close">
              <X className="w-5 h-5" style={{ color: primary }} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[300px] border-r border-gray-100 bg-white z-30">
        {sidebarContent}
      </aside>

      {/* Content */}
      <main className="lg:ml-[300px]">
        {/* HERO */}
        {vHero && (
          <section id="home" className="min-h-screen flex items-center px-6 lg:px-20 py-16 relative overflow-hidden" style={{ background: cream }}>
            <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
              <div>
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight" style={{ color: primary }}>
                  {heroHeadline}
                </h1>
                <p className="mt-6 text-xl lg:text-2xl font-bold" style={{ color: primary }}>
                  A Passionate <span style={{ color: accent }}>{profession}</span>
                </p>
                <p className="mt-6 text-base leading-relaxed max-w-lg" style={{ color: primary, opacity: 0.75 }}>
                  {heroDesc}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={cta1Link}
                    className="px-6 py-3 rounded-full font-semibold text-sm border-2 bg-white transition-all hover:scale-[1.02]"
                    style={{ borderColor: primary, color: primary }}
                  >
                    {cta1Text}
                  </a>
                  <a
                    href={cta2Link}
                    className="px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-[1.02]"
                    style={{ background: "#4FD1A0" }}
                  >
                    {cta2Text}
                  </a>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                {heroImg ? (
                  <div className="relative">
                    <img
                      src={heroImg}
                      alt={name}
                      className="max-h-[520px] w-auto object-contain"
                      style={{ filter: `drop-shadow(0 0 0 ${accent}) drop-shadow(2px 0 0 ${accent}) drop-shadow(-2px 0 0 ${accent}) drop-shadow(0 2px 0 ${accent}) drop-shadow(0 -2px 0 ${accent})` }}
                    />
                  </div>
                ) : (
                  <div className="w-80 h-80 rounded-3xl flex items-center justify-center text-7xl font-bold" style={{ background: accent, color: primary }}>
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {vAbout && (
          <section id="about" className="px-6 lg:px-20 py-20" style={{ background: cream }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-12" style={{ color: primary }}>About Me</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="relative">
                {aboutImg && (
                  <div className="relative">
                    <div className="absolute -bottom-4 -right-4 w-full h-full rounded-xl" style={{ background: accent }} />
                    <img src={aboutImg} alt="About" className="relative w-full max-h-[560px] object-cover rounded-xl" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: primary }}>{aboutHeading}</h3>
                <p className="text-base font-semibold mt-2" style={{ color: primary }}>{profession}</p>
                <p className="mt-6 leading-relaxed" style={{ color: primary, opacity: 0.75 }}>{aboutText}</p>


                {/* Personal info */}
                <div className="mt-8 grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  {profile?.email && <InfoLine label="Email" value={profile.email} primary={primary} />}
                  {portfolio?.phone && <InfoLine label="Phone" value={portfolio.phone} primary={primary} />}
                  {portfolio?.location && <InfoLine label="Residence" value={portfolio.location} primary={primary} />}
                  {portfolio?.website && <InfoLine label="Website" value={portfolio.website} primary={primary} />}
                </div>

                <a href="#contact" className="inline-block mt-8 px-6 py-3 rounded-md font-bold text-sm uppercase tracking-wider text-white" style={{ background: accent }}>
                  Get a Custom Quote
                </a>
              </div>
            </div>
          </section>
        )}

        {/* SERVICES */}
        {vServices && (
          <section id="services" className="px-6 lg:px-20 py-20" style={{ background: cream }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-12" style={{ color: primary }}>My Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showServices as any[]).map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `${accent}26`, color: accent }}>
                    <ServiceIcon icon={s.icon || "sparkles"} className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: primary }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: primary, opacity: 0.65 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PORTFOLIO */}
        {vProjects && (
          <section id="portfolio" className="px-6 lg:px-20 py-20" style={{ background: cream }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-12" style={{ color: primary }}>My Works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showProjects as any[]).map(p => (
                <a
                  key={p.id}
                  href={p.live_url || "#"}
                  target={p.live_url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group block"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}33, ${primary}22)` }}>
                        <span className="text-4xl font-bold" style={{ color: primary }}>{p.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: primary, opacity: 0.5 }}>{p.description || "Project"}</p>
                    <h3 className="font-bold text-lg" style={{ color: primary }}>{p.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CLIENTS */}
        <section className="px-6 lg:px-20 py-16" style={{ background: cream }}>
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-8" style={{ color: primary }}>
            Trusted by <span style={{ color: accent }}>Clients</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {showClients.map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-20 flex items-center justify-center font-bold text-sm" style={{ color: primary }}>
                {c}
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="px-6 lg:px-20 py-20" style={{ background: cream }}>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-10" style={{ color: primary }}>
            Client <span style={{ color: accent }}>Feedback</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {showTestimonials.map(t => (
              <div key={t.id} className="border border-gray-200 rounded-2xl p-6">
                <p className="text-sm leading-relaxed mb-5" style={{ color: primary, opacity: 0.75 }}>"{t.review}"</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold" style={{ color: primary }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: primary }}>{t.name}</p>
                    <p className="text-xs" style={{ color: accent }}>{t.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        {vContact && (
          <section id="contact" className="px-6 lg:px-20 py-20" style={{ background: cream }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-12" style={{ color: primary }}>Get in Touch</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 rounded-2xl p-6 lg:p-8" style={{ background: cream }}>
                <ContactForm
                  portfolioOwnerId={userId || ""}
                  themeStyle={{
                    surface: "#0B1220",
                    border: "rgba(11,27,51,0.15)",
                    text: "#FFFFFF",
                    textMuted: primary,
                    accent: accent,
                    accentText: primary,
                  }}
                />
              </div>
              <div className="space-y-4">
                {showContacts.map((item: any) => {
                  const Icon = item.icon === "phone" ? Phone : item.icon === "map" ? MapPin : item.icon === "web" ? Globe : Mail;
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: accent }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm mb-1" style={{ color: primary }}>{item.label || item.type}</p>
                        <p className="text-sm break-words" style={{ color: primary, opacity: 0.7 }}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function InfoLine({ label, value, primary }: { label: string; value: string; primary: string }) {
  return (
    <div className="flex gap-3">
      <span className="font-bold w-20 flex-shrink-0" style={{ color: primary }}>{label}</span>
      <span className="opacity-30" style={{ color: primary }}>|</span>
      <span className="truncate" style={{ color: primary, opacity: 0.75 }}>{value}</span>
    </div>
  );
}
