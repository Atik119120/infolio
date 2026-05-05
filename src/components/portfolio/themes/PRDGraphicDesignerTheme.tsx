import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe, ExternalLink, Github, Sparkles, Palette } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";

/**
 * Graphic Designer theme — premium glassmorphism on a soft creative gradient.
 * Sections: Header → Hero (glass panel + portrait) → About → Expertise → Projects → Clients → Contact → Footer
 */
const C = {
  primary: "#ec4899", // pink
  primary2: "#a855f7", // purple
  accent: "#22d3ee", // cyan accent
  bg: "#0b0815",
  bg2: "#120c20",
  ink: "#f5f3ff",
  muted: "#a89eb9",
  border: "rgba(255,255,255,0.08)",
};

const SOFTWARE = [
  { name: "Photoshop", icon: "🖌️" },
  { name: "Illustrator", icon: "✒️" },
  { name: "Figma", icon: "🎨" },
  { name: "InDesign", icon: "📐" },
  { name: "After Effects", icon: "🎬" },
  { name: "Procreate", icon: "🖼️" },
];

export default function PRDGraphicDesignerTheme({
  profile,
  portfolio,
  skills,
  projects,
  services = [],
  socialLinks,
  experiences,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject]);

  const name = profile?.display_name || "Your Name";
  const headline = portfolio?.headline || "Graphic Designer";
  const bio = portfolio?.bio || "Crafting visual stories that move people.";
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
    { id: "expertise", label: "Expertise" },
    { id: "projects", label: "Projects" },
    { id: "clients", label: "Clients" },
    { id: "contact", label: "Contact" },
  ];

  const columns = useMemo(() => {
    const cols: typeof projects[] = [[], [], []];
    projects.forEach((p, i) => cols[i % 3].push(p));
    return cols;
  }, [projects]);

  const clients = useMemo(() => {
    const seen = new Set<string>();
    return experiences
      .map((e) => e.company)
      .filter((c) => {
        if (!c || seen.has(c)) return false;
        seen.add(c);
        return true;
      });
  }, [experiences]);

  const softwares = useMemo(() => {
    const fromSkills = skills
      .filter((s) => /software|tool/i.test(s.category || ""))
      .slice(0, 6)
      .map((s) => ({ name: s.name, icon: "✨" }));
    if (fromSkills.length >= 3) return fromSkills;
    return SOFTWARE;
  }, [skills]);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }} className="min-h-screen relative overflow-hidden">
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700,800&f[]=satoshi@400,500,700&display=swap');
        .gd-display { font-family: 'Clash Display', 'Inter', sans-serif; }
        .gd-grad-text { background: linear-gradient(135deg, ${C.primary}, ${C.primary2}, ${C.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .gd-btn-primary { background: linear-gradient(135deg, ${C.primary}, ${C.primary2}); color: #fff; transition: all .25s; }
        .gd-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 40px ${C.primary}66; }
        .gd-btn-glass { transition: all .25s; }
        .gd-btn-glass:hover { transform: translateY(-2px); }
        @keyframes gd-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .gd-marquee { animation: gd-marquee 35s linear infinite; }
      `}</style>

      {/* Background mesh */}
      <div className="gx-mesh-cool fixed inset-0 -z-10" />
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

      {/* HEADER — slim floating pill */}
      <header className="sticky top-3 z-40 px-3 md:px-5">
        <div className="container mx-auto gx-glass-nav rounded-full px-4 md:px-5 py-2.5 flex items-center justify-between max-w-6xl">
          <a href="#home" className="gd-display text-base font-bold tracking-tight">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-7 w-auto object-contain" />
            ) : (
              <span>
                {name.split(" ")[0]}<span className="gd-grad-text">®</span>
              </span>
            )}
          </a>
          <nav className="hidden md:flex items-center gap-1 text-[12px] font-medium">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="px-3 py-1.5 rounded-full hover:bg-white/10 transition" style={{ color: C.muted }}>{n.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#contact" className="gd-btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full">
              Hire <ArrowRight className="w-3 h-3" />
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

      {/* HERO */}
      <section id="home" className="relative pt-12 md:pt-16 pb-16">
        <div className="container mx-auto px-5">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full gx-glass">
                <Sparkles className="w-3 h-3" style={{ color: C.primary }} /> Open to projects
              </div>
              <h1 className="gd-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6">
                I design <span className="gd-grad-text">brands</span><br />
                that <span className="italic">stand out.</span>
              </h1>
              <p className="text-lg mb-8 max-w-xl" style={{ color: C.muted }}>
                Hi, I'm <strong style={{ color: C.ink }}>{name}</strong> — {headline.toLowerCase()}.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#projects" className="gd-btn-primary px-7 py-3.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-full">
                  See Portfolio <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="gd-btn-glass gx-glass px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full" style={{ color: C.ink }}>
                  Start a Project
                </a>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-5">
              <div className="relative">
                <div aria-hidden className="absolute -inset-6 rounded-[2rem] opacity-60"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2}, ${C.accent})`, filter: "blur(60px)" }} />
                <div className="relative rounded-3xl overflow-hidden gx-glass gx-glow-ring p-2">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={name} className="w-full aspect-[4/5] object-cover rounded-[1.25rem]" />
                  ) : (
                    <div className="w-full aspect-[4/5] flex items-center justify-center gd-display text-9xl font-extrabold rounded-[1.25rem]"
                      style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#fff" }}>
                      {name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden py-4 mt-14 gx-glass border-y" style={{ borderColor: C.border }}>
          <div className="flex gap-12 gd-marquee whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0 items-center">
                {["Branding", "Logo Design", "Print", "Editorial", "Packaging", "Illustration", "Visual Identity", "Type Design"].map((w) => (
                  <span key={w} className="gd-display text-2xl font-bold flex items-center gap-12" style={{ color: C.ink }}>
                    {w} <span className="gd-grad-text">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28 relative">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="md:col-span-5">
              <div className="relative rounded-3xl overflow-hidden gx-glass gx-glow-ring p-2">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={name} className="w-full aspect-square object-cover rounded-[1.25rem]" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center gd-display text-9xl font-extrabold rounded-[1.25rem]"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#fff" }}>
                    {name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-3 -right-3 px-5 py-3 rounded-2xl gd-btn-primary">
                  <div className="gd-display text-2xl font-bold">{experiences.length}+</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-90">Years</div>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-7">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} /> About Me
              </div>
              <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
                Crafting <span className="gd-grad-text">visual</span><br />
                identities since day one.
              </h2>
              <p className="text-base md:text-lg leading-[1.85] mb-8" style={{ color: C.muted }}>
                {bio}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8 text-sm">
                {phone && <FactPill label="Phone" value={phone} />}
                {location && <FactPill label="Based" value={location} />}
                {email && <FactPill label="Email" value={email} />}
                {website && <FactPill label="Web" value={website.replace(/^https?:\/\//, "")} />}
                <FactPill label="Projects" value={`${projects.length}+`} />
                <FactPill label="Clients" value={`${clients.length || projects.length}+`} />
              </div>
              <a href="#contact" className="gd-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full">
                Let's Collaborate <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise" className="py-20 md:py-28">
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
              <span className="w-8 h-px" style={{ background: C.primary }} /> What I Do
              <span className="w-8 h-px" style={{ background: C.primary }} />
            </div>
            <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1.05] mb-3">
              Skills, services & <span className="gd-grad-text">software</span>
            </h2>
          </motion.div>

          {/* Skills */}
          {skills.length > 0 && (
            <motion.div {...fadeUp} className="mb-16 max-w-5xl mx-auto">
              <h3 className="gd-display text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: C.primary }}>01</span>
                My Skills
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
                {skills.map((sk) => (
                  <div key={sk.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{sk.name}</span>
                      <span className="gd-display text-sm font-bold gd-grad-text">{sk.proficiency || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sk.proficiency || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.primary2})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <motion.div {...fadeUp} className="mb-16">
              <h3 className="gd-display text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: C.primary }}>02</span>
                Services
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((sv) => (
                  <div key={sv.id} className="p-7 rounded-2xl gx-glass gx-glow-ring group transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl gx-glass-strong" style={{ color: C.primary }}>
                      <ServiceIcon icon={sv.icon} className="w-6 h-6" />
                    </div>
                    <h4 className="gd-display text-xl font-bold mb-2">{sv.title}</h4>
                    {sv.description && <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>{sv.description}</p>}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: C.border }}>
                      {sv.price ? (
                        <span className="gd-display font-bold gd-grad-text">{sv.price}</span>
                      ) : (
                        <span className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>On request</span>
                      )}
                      <a href="#contact" className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all" style={{ color: C.primary }}>
                        Inquire <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Software */}
          <motion.div {...fadeUp}>
            <h3 className="gd-display text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: C.primary }}>03</span>
              Expert Software
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {softwares.map((sw) => (
                <div key={sw.name} className="aspect-square flex flex-col items-center justify-center gap-3 p-4 rounded-2xl gx-glass transition-all hover:-translate-y-1">
                  <div className="text-2xl" style={{ color: C.primary }}>
                    <ServiceIcon icon={sw.icon} className="w-8 h-8" />
                  </div>
                  <span className="gd-display text-sm font-bold text-center">{sw.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS — Pinterest masonry */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 md:py-28">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: C.primary }}>
                  <span className="w-8 h-px" style={{ background: C.primary }} /> My Projects
                </div>
                <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1.05]">
                  Selected <span className="gd-grad-text italic">works.</span>
                </h2>
              </div>
              <p className="text-sm max-w-sm" style={{ color: C.muted }}>
                Click any image to view the full case — story, tools and outcomes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {columns.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-5">
                  {col.map((p, i) => (
                    <motion.button
                      key={p.id}
                      onClick={() => setActiveProject(p)}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="group relative block w-full text-left overflow-hidden rounded-2xl gx-glass gx-glow-ring"
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                          style={{ aspectRatio: ci % 3 === 0 ? "4/5" : ci % 3 === 1 ? "1/1" : "3/4" }}
                        />
                      ) : (
                        <div className="w-full aspect-[4/5] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})` }}>
                          <Palette className="w-16 h-16 text-white/80" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col justify-end p-5"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 45%, transparent 70%)" }}>
                        {(p.tech_stack && p.tech_stack[0]) && (
                          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1.5" style={{ color: C.accent }}>{p.tech_stack[0]}</div>
                        )}
                        <h3 className="gd-display text-xl md:text-2xl font-bold text-white leading-tight">{p.title}</h3>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLIENTS */}
      {clients.length > 0 && (
        <section id="clients" className="py-20 md:py-24">
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} /> My Clients
                <span className="w-8 h-px" style={{ background: C.primary }} />
              </div>
              <h2 className="gd-display text-4xl md:text-5xl font-bold leading-[1.05] mb-3">
                Trusted by <span className="gd-grad-text italic">great brands</span>
              </h2>
            </motion.div>

            <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {clients.map((c) => (
                <div key={c} className="aspect-[3/2] flex items-center justify-center p-6 rounded-2xl gx-glass transition-all hover:-translate-y-0.5">
                  <span className="gd-display text-lg md:text-xl font-bold text-center">
                    {c}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
              <span className="w-8 h-px" style={{ background: C.primary }} /> Contact Me
              <span className="w-8 h-px" style={{ background: C.primary }} />
            </div>
            <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1.05] mb-3">
              Got an <span className="gd-grad-text italic">idea?</span>
            </h2>
            <p className="text-base" style={{ color: C.muted }}>
              Tell me about your project. I'll reply within 24 hours.
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
      <footer className="pt-16 pb-8 border-t" style={{ borderColor: C.border, background: "rgba(0,0,0,0.4)" }}>
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="gd-display text-2xl font-bold mb-3">{name}<span className="gd-grad-text">®</span></div>
              <p className="text-sm mb-5 max-w-md" style={{ color: C.muted }}>{headline}</p>
              <div className="flex gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center gx-glass transition hover:-translate-y-0.5"
                      style={{ color: C.primary }}>
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: C.primary }}>Navigate</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                {NAV.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:text-white transition">{n.label}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: C.primary }}>Contact</h4>
              <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                {email && <li><a href={`mailto:${email}`} className="hover:text-white transition">{email}</a></li>}
                {phone && <li>{phone}</li>}
                {location && <li>{location}</li>}
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs" style={{ borderColor: C.border, color: C.muted }}>
            <div>© {new Date().getFullYear()} {name}. All rights reserved.</div>
            <div>Built with Alpha Portfolio</div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(5,3,15,0.92)", backdropFilter: "blur(12px)" }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto grid md:grid-cols-2 rounded-3xl gx-glass-strong"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full gx-glass-strong transition hover:scale-110"
                aria-label="Close"
                style={{ color: C.ink }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                {activeProject.image_url ? (
                  <img src={activeProject.image_url} alt={activeProject.title} className="w-full h-full object-cover max-h-[90vh]" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})` }}>
                    <Palette className="w-24 h-24 text-white/80" />
                  </div>
                )}
              </div>

              <div className="p-8 md:p-10 flex flex-col">
                <div className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: C.primary }}>
                  Project Case
                </div>
                <h3 className="gd-display text-3xl md:text-4xl font-bold leading-tight mb-4">{activeProject.title}</h3>
                {activeProject.description && (
                  <p className="text-base leading-[1.85] mb-6" style={{ color: C.muted }}>{activeProject.description}</p>
                )}
                {activeProject.tech_stack && activeProject.tech_stack.length > 0 && (
                  <div className="mb-6">
                    <div className="text-[11px] uppercase tracking-wider font-bold mb-2" style={{ color: C.muted }}>Tools used</div>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tech_stack.map((t) => (
                        <span key={t} className="text-xs px-3 py-1.5 rounded-full gx-glass">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-3 pt-4">
                  {activeProject.live_url && (
                    <a href={activeProject.live_url} target="_blank" rel="noreferrer"
                      className="gd-btn-primary inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-full">
                      Visit Project <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {activeProject.github_url && (
                    <a href={activeProject.github_url} target="_blank" rel="noreferrer"
                      className="gd-btn-glass gx-glass inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-full" style={{ color: C.ink }}>
                      Source <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0 px-4 py-2.5 rounded-full gx-glass">
      <span className="text-[10px] uppercase tracking-[0.25em] shrink-0" style={{ color: C.primary }}>{label}</span>
      <span className="truncate text-sm font-medium" style={{ color: C.ink }}>{value}</span>
    </div>
  );
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 p-5 rounded-2xl gx-glass gx-glow-ring transition-all hover:-translate-y-0.5">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl gx-glass-strong" style={{ color: C.primary }}>
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
