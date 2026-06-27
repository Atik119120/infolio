import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight, Camera } from "lucide-react";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";

/**
 * Dark Photographer — Pitch-black moody theme with scramble text + circular gallery.
 * Designed for photographers / visual artists. White on black, gold accent, cinematic vibe.
 */

const NAV = [
  { id: "home", label: "Home", key: "hero" as const },
  { id: "about", label: "About", key: "about" as const },
  { id: "work", label: "Work", key: "projects" as const },
  { id: "services", label: "Services", key: "services" as const },
  { id: "contact", label: "Contact", key: "contact" as const },
];

const RANDOM_CHARS = "_!X$0-+*#@%&";

function ScrambleText({ text, className, speed = 30 }: { text: string; className?: string; speed?: number }) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let step = 0;
    const total = text.length * 2;
    const iv = setInterval(() => {
      const reveal = Math.floor(step / 2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < reveal) s += text[i];
        else if (text[i] === " ") s += " ";
        else s += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
      }
      setOut(s);
      step++;
      if (step >= total) {
        setOut(text);
        clearInterval(iv);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span ref={ref} className={className}>{out}</span>;
}

function HeroSlideshow({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const iv = setInterval(() => setIdx(i => (i + 1) % images.length), 4000);
    return () => clearInterval(iv);
  }, [images.length]);
  if (images.length === 0) return null;
  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === idx ? 0.45 : 0,
            transform: i === idx ? "scale(1.05)" : "scale(1)",
            transition: "opacity 1.4s ease, transform 6s ease",
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.85) 70%, #050505 100%)" }} />
    </div>
  );
}

function CircularGallery({ images, accent }: { images: { url: string; title: string }[]; accent: string }) {
  const [rotation, setRotation] = useState(0);
  const reqRef = useRef<number | null>(null);
  useEffect(() => {
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last; last = t;
      setRotation(r => r + dt * 0.015);
      reqRef.current = requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, []);

  const count = Math.max(images.length, 1);
  const per = 360 / count;
  const radius = 380;

  return (
    <div className="relative w-full h-[520px] md:h-[640px] flex items-center justify-center overflow-hidden" style={{ perspective: "1400px" }}>
      <div className="relative w-[280px] h-[380px] md:w-[320px] md:h-[440px]" style={{ transformStyle: "preserve-3d", transform: `rotateY(${rotation}deg)` }}>
        {images.map((img, i) => {
          const angle = i * per;
          const rel = Math.abs(((angle + rotation) % 360 + 540) % 360 - 180);
          const opacity = Math.max(0.25, 1 - rel / 180);
          return (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl overflow-hidden border"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                borderColor: `${accent}40`,
                boxShadow: `0 30px 80px -20px ${accent}30`,
                opacity,
              }}
            >
              {img.url ? (
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                  <Camera className="w-12 h-12" style={{ color: accent }} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
                <p className="text-white font-semibold text-sm tracking-wide">{img.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DarkPhotographerTheme({
  profile,
  portfolio,
  projects,
  services = [],
  socialLinks,
  userId,
  contactItems = [],
}: ThemeProps & { contactItems?: any[] }) {
  const accent = (portfolio as any)?.accent_color || "#22D3EE";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const profession = portfolio?.hero_subheadline || portfolio?.headline || "Visual Storyteller";
  const heroHeadline = portfolio?.hero_headline || `Frames by ${name}`;
  const heroDesc = portfolio?.bio || "Capturing fleeting light, quiet moments, and bold stories — one frame at a time.";
  const heroImg = portfolio?.hero_image_url || profile?.avatar_url;
  const aboutImg = portfolio?.about_image_url || heroImg;
  const aboutText = portfolio?.about_text || heroDesc;
  const footerText = portfolio?.footer_text || `© ${new Date().getFullYear()} ${name} — All rights reserved`;

  const demoProjects = [
    { id: "p1", title: "Golden Hour", description: "Portrait", image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&auto=format&fit=crop&q=80" },
    { id: "p2", title: "City Pulse", description: "Street", image_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&auto=format&fit=crop&q=80" },
    { id: "p3", title: "Wild Silence", description: "Nature", image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop&q=80" },
    { id: "p4", title: "Monochrome", description: "Studio", image_url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&auto=format&fit=crop&q=80" },
    { id: "p5", title: "Neon Nights", description: "Editorial", image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80" },
    { id: "p6", title: "Quiet Coast", description: "Landscape", image_url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=900&auto=format&fit=crop&q=80" },
  ];

  const showProjects = projects.length > 0 ? projects : (demoProjects as any);
  const galleryImages = (showProjects as any[]).map((p: any) => ({ url: p.image_url || "", title: p.title }));
  const bentoSpans = [
    "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
    "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2",
    "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
    "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
    "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
    "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  ];
  const bentoItems = (showProjects as any[]).map((p: any, i: number) => ({
    id: i + 1,
    type: "image",
    title: p.title,
    desc: p.description || "Project",
    url: p.image_url || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop&q=80",
    span: bentoSpans[i % bentoSpans.length],
  }));

  const showServices = services.length > 0 ? services : [
    {
      id: "s1",
      title: "Essential",
      tagline: "Single / Personal Shoot",
      price: "$199",
      duration: "1 Hour Session",
      featured: false,
      features: [
        "1 hour photo session",
        "1 location",
        "25+ edited photos",
        "Online gallery delivery",
        "Personal use license",
      ],
    },
    {
      id: "s2",
      title: "Signature",
      tagline: "Pre-Wedding / Couple / Bridal",
      price: "$499",
      duration: "Half-Day Coverage",
      featured: true,
      features: [
        "Up to 4 hours coverage",
        "2 locations / outfit changes",
        "80+ edited photos",
        "10 premium retouched portraits",
        "Private online gallery",
        "Print release included",
      ],
    },
    {
      id: "s3",
      title: "Cinematic",
      tagline: "Wedding / Event / Corporate",
      price: "$1,299",
      duration: "Full-Day Coverage",
      featured: false,
      features: [
        "Up to 10 hours coverage",
        "Unlimited locations",
        "300+ edited photos",
        "Cinematic highlight video (2-3 min)",
        "USB + Online gallery",
        "Second shooter included",
      ],
    },
  ] as any;

  const showContacts = contactItems.length > 0 ? contactItems : [
    profile?.email && { id: "c-mail", type: "email", label: "Email", value: profile.email, icon: "mail" },
    portfolio?.phone && { id: "c-ph", type: "phone", label: "Phone", value: portfolio.phone, icon: "phone" },
    portfolio?.location && { id: "c-loc", type: "address", label: "Studio", value: portfolio.location, icon: "map" },
  ].filter(Boolean) as any[];

  const vHero = isVisible(portfolio, "hero");
  const vAbout = isVisible(portfolio, "about");
  const vProjects = isVisible(portfolio, "projects");
  const vServices = isVisible(portfolio, "services");
  const vContact = isVisible(portfolio, "contact");
  const vSocial = isVisible(portfolio, "social");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#050505" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');
        html { scroll-behavior: smooth; background:#050505; }
        .dp-display { font-family: 'Playfair Display', serif; letter-spacing: -0.02em; }
        .dp-italic { font-family: 'Playfair Display', serif; font-style: italic; }
        .dp-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        .dp-grain::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          mix-blend-mode: overlay; opacity: .5;
        }
        .dp-glow { text-shadow: 0 0 30px ${accent}40, 0 0 80px ${accent}15; }
        .dp-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.4); color: transparent; }
        @keyframes dp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .dp-marquee { animation: dp-marquee 30s linear infinite; }
        .dp-card-img { transition: transform 1.2s cubic-bezier(.2,.7,.2,1), filter .6s ease; }
        .group:hover .dp-card-img { transform: scale(1.06); filter: saturate(1.1); }

        /* ====== CUT-CORNER BUTTONS (simple + unique) ====== */
        .dp-cut-btn {
          position: relative; display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 22px; cursor: pointer; border: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase; font-weight: 600;
          background: transparent;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all .35s cubic-bezier(.2,.7,.2,1);
        }
        .dp-cut-btn.sm { padding: 10px 16px; font-size: 10px; gap: 8px; }
        .dp-cut-btn.primary { background: var(--acc); color: #050505; }
        .dp-cut-btn.primary:hover { transform: translate(-2px,-2px); box-shadow: 4px 4px 0 0 rgba(255,255,255,.15); }
        .dp-cut-btn.ghost {
          color: #fff;
          background:
            linear-gradient(#0a0a0a,#0a0a0a) padding-box,
            var(--acc) border-box;
          border: 1px solid transparent;
        }
        .dp-cut-btn.ghost:hover { color: var(--acc); transform: translate(-2px,-2px); box-shadow: 4px 4px 0 0 var(--acc); }
        .dp-cut-dot {
          width: 6px; height: 6px; background: currentColor; border-radius: 50%;
          flex-shrink: 0; transition: transform .35s ease;
        }
        .dp-cut-btn:hover .dp-cut-dot { transform: scale(1.6); }
        .dp-cut-arrow {
          display: inline-block; transition: transform .35s ease; font-size: 14px;
        }
        .dp-cut-btn:hover .dp-cut-arrow { transform: translateX(4px); }
      `}</style>


      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
            <span className="dp-display font-bold tracking-wide">{name}</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.filter(n => isVisible(portfolio, n.key)).map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors">
                {n.label}
              </button>
            ))}
          </nav>
          <button onClick={() => scrollTo("contact")} className="dp-cut-btn primary sm group hidden md:inline-flex" style={{ ['--acc' as any]: accent }}>
            <span className="dp-cut-dot" />
            <span>Book Me</span>
          </button>
        </div>
      </header>

      <main className="pt-16">
        {/* HERO */}
        {vHero && (
          <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden dp-grain">
            <HeroSlideshow images={[heroImg, ...galleryImages.map(g => g.url)].filter(Boolean) as string[]} />
            <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full py-24">
              <p className="dp-mono text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: accent }}>
                {`// ${profession}`}
              </p>
              <h1 className="dp-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[0.95] dp-glow max-w-4xl">
                {heroHeadline}
              </h1>
              <p className="mt-5 max-w-lg text-white/60 text-sm md:text-base leading-relaxed">
                {heroDesc}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button onClick={() => scrollTo("work")} className="dp-cut-btn primary group" style={{ ['--acc' as any]: accent }}>
                  <span className="dp-cut-dot" />
                  <span>View My Photographs</span>
                  <span className="dp-cut-arrow">→</span>
                </button>
                <button onClick={() => scrollTo("contact")} className="dp-cut-btn ghost group" style={{ ['--acc' as any]: accent }}>
                  <span className="dp-cut-dot" />
                  <span>Book A Next Shoot</span>
                  <span className="dp-cut-arrow">→</span>
                </button>
              </div>
            </div>

            {/* Marquee bottom */}
            <div className="absolute bottom-0 inset-x-0 border-t border-white/10 py-4 overflow-hidden">
              <div className="flex whitespace-nowrap dp-marquee">
                {Array.from({ length: 2 }).map((_, k) => (
                  <div key={k} className="flex items-center gap-12 px-6 dp-mono text-xs uppercase tracking-[0.3em] text-white/40">
                    <span>Available for Bookings</span><span style={{ color: accent }}>✦</span>
                    <span>Portrait · Editorial · Commercial</span><span style={{ color: accent }}>✦</span>
                    <span>Worldwide</span><span style={{ color: accent }}>✦</span>
                    <span>Est. {new Date().getFullYear() - 5}</span><span style={{ color: accent }}>✦</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {vAbout && (
          <section id="about" className="relative px-6 lg:px-12 py-24 lg:py-32">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
                  {aboutImg ? (
                    <img src={aboutImg} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <Camera className="w-16 h-16" style={{ color: accent }} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 dp-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                    [ 01 / Behind the Lens ]
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <p className="dp-mono text-xs uppercase tracking-[0.4em] mb-4" style={{ color: accent }}>About</p>
                <h2 className="dp-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Light, shadow,<br />and the space between.
                </h2>
                <p className="mt-8 text-white/60 leading-relaxed text-lg max-w-2xl">{aboutText}</p>
                <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                  {[
                    { k: "120+", v: "Projects" },
                    { k: "08", v: "Years" },
                    { k: "40+", v: "Clients" },
                  ].map(s => (
                    <div key={s.v} className="border-l border-white/15 pl-4">
                      <p className="dp-display text-3xl font-bold" style={{ color: accent }}>{s.k}</p>
                      <p className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WORK — Interactive Bento Gallery */}
        {vProjects && (
          <section id="work" className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <p className="dp-mono text-xs uppercase tracking-[0.4em] mb-3" style={{ color: accent }}>Selected Work</p>
                <h2 className="dp-display text-4xl md:text-6xl font-bold">Through The Lens</h2>
                <p className="mt-4 text-white/55 max-w-xl">An interactive gallery — drag the tiles to rearrange, tap any frame to view it fullscreen.</p>
              </div>

              <InteractiveBentoGallery
                mediaItems={bentoItems}
              />
            </div>
          </section>
        )}

        {/* SERVICES */}
        {vServices && (
          <section id="services" className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <p className="dp-mono text-xs uppercase tracking-[0.4em] mb-3" style={{ color: accent }}>What I Offer</p>
              <h2 className="dp-display text-4xl md:text-6xl font-bold mb-14">Services</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {(showServices as any[]).map((s: any, i: number) => (
                  <div key={s.id} className="group relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/30 transition-all">
                    <div className="flex items-start justify-between mb-8">
                      <span className="dp-mono text-xs text-white/40">0{i + 1}</span>
                      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[var(--ac)] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" style={{ ['--ac' as any]: accent }} />
                    </div>
                    <h3 className="dp-display text-2xl font-bold mb-3">{s.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        {vContact && (
          <section id="contact" className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
            <div className="max-w-4xl mx-auto text-center">
              <p className="dp-mono text-xs uppercase tracking-[0.4em] mb-3" style={{ color: accent }}>Get in Touch</p>
              <h2 className="dp-display text-4xl md:text-6xl font-bold leading-tight">
                Let's create<br />something <span style={{ color: accent }}>unforgettable</span>.
              </h2>
              <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {showContacts.map((item: any) => {
                  const Icon = item.icon === "phone" ? Phone : item.icon === "map" ? MapPin : Mail;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${accent}20`, color: accent }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-widest text-white/40">{item.label || item.type}</p>
                        <p className="text-sm text-white break-words">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {vSocial && socialLinks.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {socialLinks.map(s => {
                    const Icon = getSocialIcon(s.platform);
                    return (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}
                        className="w-10 h-10 rounded-full border border-white/15 hover:border-white/60 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

          </section>
        )}

        {/* FOOTER */}
        <footer className="px-6 py-8 border-t border-white/5">
          <p className="dp-mono text-xs text-white/40 text-center">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </footer>

      </main>
    </div>
  );
}
