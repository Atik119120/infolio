import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Mail, Phone, MapPin, Globe, ExternalLink, Github, Sparkles, Palette } from "lucide-react";
import { ServiceIcon } from "@/lib/serviceIcons";
import { ThemeProps } from "./types";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { getSocialIcon } from "./utils";

/**
 * Graphic Designer theme.
 * Sections: Header → Hero → About → Skills + Services + Software →
 *           Projects (Pinterest masonry + lightbox) → Clients → Contact → Footer
 */
const C = {
  primary: "#ff4d4d",
  accent: "#111111",
  bg: "#f5f0eb",
  surface: "#ffffff",
  ink: "#111111",
  muted: "#57534e",
  border: "#e7e0d6",
  cream: "#ebe4d8",
};

// Software icon presets — friendly emoji fallbacks
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
  userId,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Lock scroll when lightbox open
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

  // Pinterest-style column distribution
  const columns = useMemo(() => {
    const cols: typeof projects[] = [[], [], []];
    projects.forEach((p, i) => cols[i % 3].push(p));
    return cols;
  }, [projects]);

  // Clients = unique companies from experiences
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

  // Software = first 6 skill names from "Software" or "Tools" categories, else default list
  const softwares = useMemo(() => {
    const fromSkills = skills
      .filter((s) => /software|tool/i.test(s.category || ""))
      .slice(0, 6)
      .map((s) => ({ name: s.name, icon: "✨" }));
    if (fromSkills.length >= 3) return fromSkills;
    return SOFTWARE;
  }, [skills]);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }} className="min-h-screen">
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700,800&f[]=satoshi@400,500,700&display=swap');
        .gd-display { font-family: 'Clash Display', 'Inter', sans-serif; }
        .gd-btn-primary { background: ${C.ink}; color: #fff; transition: all .2s; }
        .gd-btn-primary:hover { background: ${C.primary}; transform: translateY(-2px); }
        .gd-btn-outline { border: 1.5px solid ${C.ink}; color: ${C.ink}; transition: all .2s; }
        .gd-btn-outline:hover { background: ${C.ink}; color: #fff; }
        .gd-link { transition: color .2s; }
        .gd-link:hover { color: ${C.primary}; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .gd-marquee { animation: marquee 30s linear infinite; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 gx-glass-nav-light">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#home" className="gd-display text-2xl font-bold tracking-tight">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt={name} className="h-9 w-auto object-contain" />
            ) : (
              <span>
                {name.split(" ")[0]}<span style={{ color: C.primary }}>®</span>
              </span>
            )}
          </a>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium gx-glass-light rounded-full px-2 py-1.5">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="gd-link px-4 py-1.5 rounded-full hover:bg-black/5 transition" style={{ color: C.muted }}>{n.label}</a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#contact" className="gd-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
              Hire Me <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden gx-glass-nav-light">
            <div className="container mx-auto px-5 py-3 flex flex-col gap-3">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="py-2 text-sm">{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: `linear-gradient(${C.ink} 1px, transparent 1px), linear-gradient(90deg, ${C.ink} 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
        <div className="container mx-auto px-5 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="md:col-span-7">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-bold tracking-[0.2em] uppercase"
                style={{ background: C.ink, color: "#fff" }}>
                <Sparkles className="w-3 h-3" /> Open to projects
              </div>
              <h1 className="gd-display text-6xl md:text-8xl lg:text-9xl font-extrabold leading-[0.9] tracking-tight mb-6">
                I design<br />
                <span style={{ color: C.primary }}>brands</span> that<br />
                <span className="italic">stand out.</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-xl" style={{ color: C.muted }}>
                Hi, I'm <strong>{name}</strong> — {headline.toLowerCase()}.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#projects" className="gd-btn-primary px-7 py-4 text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2">
                  See Portfolio <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="gd-btn-outline px-7 py-4 text-sm font-bold uppercase tracking-wider">
                  Start a Project
                </a>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="md:col-span-5">
              <div className="relative">
                <div aria-hidden className="absolute -top-4 -left-4 w-24 h-24" style={{ background: C.primary }} />
                <div aria-hidden className="absolute -bottom-4 -right-4 w-32 h-32" style={{ background: C.ink }} />
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={name} className="relative w-full max-w-sm mx-auto aspect-[4/5] object-cover" />
                ) : (
                  <div className="relative w-full max-w-sm mx-auto aspect-[4/5] flex items-center justify-center gd-display text-9xl font-extrabold"
                    style={{ background: C.ink, color: C.primary }}>
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="border-y overflow-hidden py-4 mt-8" style={{ borderColor: C.ink, background: C.ink, color: "#fff" }}>
          <div className="flex gap-12 gd-marquee whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                {["Branding", "Logo Design", "Print", "Editorial", "Packaging", "Illustration", "Visual Identity", "Type Design"].map((w) => (
                  <span key={w} className="gd-display text-2xl font-bold flex items-center gap-12">
                    {w} <span style={{ color: C.primary }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28" style={{ background: C.surface }}>
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUp} className="md:col-span-5">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={name} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center gd-display text-9xl font-extrabold"
                    style={{ background: C.cream, color: C.ink }}>
                    {name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-5 -right-5 px-5 py-3 text-white"
                  style={{ background: C.primary }}>
                  <div className="gd-display text-2xl font-bold">{experiences.length}+</div>
                  <div className="text-[10px] uppercase tracking-wider">Years Designing</div>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} /> About Me
              </div>
              <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1] mb-6">
                Crafting <span style={{ color: C.primary }}>visual</span><br />
                identities since day one.
              </h2>
              <p className="text-base md:text-lg leading-[1.85] mb-8" style={{ color: C.muted }}>
                {bio}
              </p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8 text-sm">
                {phone && <FactRow label="Phone" value={phone} />}
                {location && <FactRow label="Based" value={location} />}
                {email && <FactRow label="Email" value={email} />}
                {website && <FactRow label="Web" value={website.replace(/^https?:\/\//, "")} />}
                <FactRow label="Projects" value={`${projects.length}+`} />
                <FactRow label="Clients" value={`${clients.length || projects.length}+`} />
              </div>
              <a href="#contact" className="gd-btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider">
                Let's Collaborate
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPERTISE: Skills + Services + Software */}
      <section id="expertise" className="py-20 md:py-28">
        <div className="container mx-auto px-5">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
              <span className="w-8 h-px" style={{ background: C.primary }} /> What I Do
              <span className="w-8 h-px" style={{ background: C.primary }} />
            </div>
            <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1] mb-3">
              Skills, services & <span style={{ color: C.primary }}>software</span>
            </h2>
          </motion.div>

          {/* Skills */}
          {skills.length > 0 && (
            <motion.div {...fadeUp} className="mb-16">
              <h3 className="gd-display text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: C.primary }}>01</span>
                My Skills
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
                {skills.map((sk) => (
                  <div key={sk.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{sk.name}</span>
                      <span className="gd-display text-sm font-bold" style={{ color: C.primary }}>{sk.proficiency || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden" style={{ background: C.cream }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sk.proficiency || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full"
                        style={{ background: C.primary }}
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
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: C.primary }}>02</span>
                Services
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((sv) => (
                  <div key={sv.id} className="p-7 group transition-all hover:-translate-y-1"
                    style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="w-12 h-12 flex items-center justify-center mb-4"
                      style={{ background: C.cream, color: C.primary }}>
                      <ServiceIcon icon={sv.icon} className="w-6 h-6" />
                    </div>
                    <h4 className="gd-display text-xl font-bold mb-2">{sv.title}</h4>
                    {sv.description && <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>{sv.description}</p>}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: C.border }}>
                      {sv.price ? (
                        <span className="gd-display font-bold" style={{ color: C.primary }}>{sv.price}</span>
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

          {/* Expert Software */}
          <motion.div {...fadeUp}>
            <h3 className="gd-display text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: C.primary }}>03</span>
              Expert Software
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {softwares.map((sw) => (
                <div key={sw.name} className="aspect-square flex flex-col items-center justify-center gap-3 p-4 transition-all hover:-translate-y-1"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div style={{ color: C.primary }}><ServiceIcon icon={sw.icon} className="w-8 h-8" /></div>
                  <span className="gd-display text-sm font-bold text-center">{sw.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS — Pinterest masonry */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 md:py-28" style={{ background: C.cream }}>
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: C.primary }}>
                  <span className="w-8 h-px" style={{ background: C.primary }} /> My Projects
                </div>
                <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1]">
                  Selected <span style={{ color: C.primary, fontStyle: "italic" }}>works.</span>
                </h2>
              </div>
              <p className="text-sm max-w-sm" style={{ color: C.muted }}>
                Click any image to view the full case — story, tools and outcomes.
              </p>
            </motion.div>

            {/* Masonry grid via 3 columns of cards */}
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
                      className="group relative block w-full text-left overflow-hidden"
                      style={{ background: C.surface, border: `1px solid ${C.border}` }}
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                          style={{ aspectRatio: ci % 3 === 0 ? "4/5" : ci % 3 === 1 ? "1/1" : "3/4" }}
                        />
                      ) : (
                        <div className="w-full aspect-[4/5] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.ink})` }}>
                          <Palette className="w-16 h-16 text-white/80" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 transition-opacity"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, transparent 75%)" }}>
                        {(p.tech_stack && p.tech_stack[0]) && (
                          <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1.5" style={{ color: C.primary }}>{p.tech_stack[0]}</div>
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
        <section id="clients" className="py-20 md:py-24" style={{ background: C.surface }}>
          <div className="container mx-auto px-5">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
                <span className="w-8 h-px" style={{ background: C.primary }} /> My Clients
                <span className="w-8 h-px" style={{ background: C.primary }} />
              </div>
              <h2 className="gd-display text-4xl md:text-5xl font-bold leading-[1] mb-3">
                Trusted by <span style={{ color: C.primary, fontStyle: "italic" }}>great brands</span>
              </h2>
              <p className="text-base" style={{ color: C.muted }}>
                A few of the wonderful teams I've had the pleasure to design for.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px"
              style={{ background: C.border }}>
              {clients.map((c) => (
                <div key={c} className="aspect-[3/2] flex items-center justify-center p-6 transition-colors hover:bg-[var(--cream)]"
                  style={{ background: C.surface, ["--cream" as any]: C.cream }}>
                  <span className="gd-display text-lg md:text-xl font-bold text-center" style={{ color: C.ink }}>
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
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: C.primary }}>
              <span className="w-8 h-px" style={{ background: C.primary }} /> Contact Me
              <span className="w-8 h-px" style={{ background: C.primary }} />
            </div>
            <h2 className="gd-display text-4xl md:text-6xl font-bold leading-[1] mb-3">
              Got an <span style={{ color: C.primary, fontStyle: "italic" }}>idea?</span>
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
      <footer style={{ background: C.ink, color: "#fff" }} className="pt-16 pb-8">
        <div className="container mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="gd-display text-2xl font-bold mb-3">{name}<span style={{ color: C.primary }}>®</span></div>
              <p className="text-sm opacity-70 mb-5 max-w-md">{headline}</p>
              <div className="flex gap-2">
                {socialLinks.map((sl) => {
                  const Icon = getSocialIcon(sl.platform);
                  return (
                    <a key={sl.id} href={sl.url} target="_blank" rel="noreferrer"
                      className="w-10 h-10 flex items-center justify-center transition hover:-translate-y-0.5"
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
            style={{ background: "rgba(17,17,17,0.92)" }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto grid md:grid-cols-2"
              style={{ background: C.surface }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full transition"
                style={{ background: C.ink, color: "#fff" }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-[var(--cream)]" style={{ ["--cream" as any]: C.cream }}>
                {activeProject.image_url ? (
                  <img src={activeProject.image_url} alt={activeProject.title} className="w-full h-full object-cover max-h-[90vh]" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.ink})` }}>
                    <Palette className="w-24 h-24 text-white/80" />
                  </div>
                )}
              </div>

              <div className="p-8 md:p-10 flex flex-col">
                <div className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: C.primary }}>
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
                        <span key={t} className="text-xs px-3 py-1.5 font-medium" style={{ background: C.cream }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-3 pt-4">
                  {activeProject.live_url && (
                    <a href={activeProject.live_url} target="_blank" rel="noreferrer"
                      className="gd-btn-primary inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider">
                      Visit Project <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {activeProject.github_url && (
                    <a href={activeProject.github_url} target="_blank" rel="noreferrer"
                      className="gd-btn-outline inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider">
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

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="font-bold shrink-0" style={{ color: C.ink }}>{label}</span>
      <span style={{ color: C.border }}>|</span>
      <span className="truncate" style={{ color: C.muted }}>{value}</span>
    </div>
  );
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="w-12 h-12 flex items-center justify-center" style={{ background: C.cream, color: C.primary }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider" style={{ color: C.muted }}>{label}</div>
        <div className="font-semibold truncate">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}
