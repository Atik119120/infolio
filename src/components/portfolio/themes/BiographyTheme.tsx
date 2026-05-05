import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu, X, Mail, Phone, MapPin, Globe, Calendar, Briefcase, GraduationCap,
  Heart, MessageCircle, Share2, ThumbsUp, Camera, BadgeCheck, Link as LinkIcon,
  ExternalLink, BookOpen,
} from "lucide-react";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";

/**
 * Biography Theme — Facebook-style profile for writers, bloggers, public figures.
 * Sections: Header → Cover + Profile → About/Bio → Contact Info → Websites/Links → Footer
 */
const C = {
  primary: "#1877f2", // FB blue
  accent: "#42b72a",  // FB green
  bg: "#f0f2f5",      // FB grey bg
  surface: "#ffffff",
  ink: "#050505",
  ink2: "#1c1e21",
  muted: "#65676b",
  border: "#dadde1",
  hover: "#f2f2f2",
};

export default function BiographyTheme({
  profile,
  portfolio,
  projects,
  experiences,
  education,
  socialLinks,
}: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const name = profile?.display_name || "Your Name";
  const headline = portfolio?.headline || "Writer · Storyteller";
  const bio = portfolio?.bio || "Welcome to my page.";
  const avatar = profile?.avatar_url;
  const email = profile?.email;
  const phone = portfolio?.phone;
  const location = portfolio?.location;
  const website = portfolio?.website;

  // Use first project image (or any image) as cover
  const cover = projects?.find(p => p.image_url)?.image_url;

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5 },
  };

  const NAV = [
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "websites", label: "Websites" },
    { id: "timeline", label: "Timeline" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // Random-ish stats for FB-style social proof
  const followers = Math.max(1200, (experiences?.length || 0) * 850 + (projects?.length || 0) * 320);
  const friends = Math.max(420, (socialLinks?.length || 0) * 180 + (education?.length || 0) * 120);

  const websites: { label: string; url: string }[] = [];
  if (website) websites.push({ label: website.replace(/^https?:\/\//, "").replace(/\/$/, ""), url: website });
  projects?.forEach(p => {
    if (p.live_url) websites.push({ label: p.title, url: p.live_url });
  });

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }} className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50" style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-lg" style={{ background: C.primary }}>
              {(name[0] || "B").toUpperCase()}
            </div>
            <div className="hidden sm:block font-bold text-[15px]" style={{ color: C.ink }}>{name}</div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)}
                className="px-4 py-2 rounded-md text-[14px] font-semibold transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                {n.label}
              </button>
            ))}
          </nav>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ background: C.surface, borderColor: C.border }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="block w-full text-left px-3 py-2 rounded-md text-[14px] font-semibold" style={{ color: C.ink2 }}>
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* COVER + PROFILE */}
      <section className="bg-white" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-[1100px] mx-auto">
          {/* Cover photo */}
          <div className="relative w-full" style={{ aspectRatio: "16/6", maxHeight: 420 }}>
            {cover ? (
              <img src={cover} alt={`${name} cover`} className="w-full h-full object-cover rounded-b-xl" />
            ) : (
              <div className="w-full h-full rounded-b-xl"
                style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #4267B2 50%, #5b7bd5 100%)` }} />
            )}
          </div>

          {/* Profile row — centered */}
          <div className="px-4 md:px-8 pb-6">
            <div className="flex flex-col items-center -mt-20 md:-mt-24">
              <div className="relative">
                <div className="w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden bg-white grid place-items-center text-4xl font-extrabold"
                  style={{ boxShadow: `0 0 0 5px ${C.surface}, 0 4px 12px rgba(0,0,0,0.08)`, color: C.muted, background: C.hover }}>
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{(name[0] || "?").toUpperCase()}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-3xl md:text-[34px] font-extrabold" style={{ color: C.ink }}>{name}</h1>
                  <BadgeCheck className="w-7 h-7" style={{ color: C.primary }} />
                </div>
                <div className="text-[15px] font-semibold mt-1" style={{ color: C.muted }}>{headline}</div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {email && (
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-semibold text-white"
                    style={{ background: C.primary }}>
                    <MessageCircle className="w-4 h-4" /> Message
                  </a>
                )}
                <button onClick={() => scrollTo("about")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-semibold"
                  style={{ background: C.hover, color: C.ink2 }}>
                  <ThumbsUp className="w-4 h-4" /> Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <main className="max-w-[1100px] mx-auto px-4 py-6 grid lg:grid-cols-5 gap-5">
        {/* LEFT COLUMN — Intro + Contact */}
        <div className="lg:col-span-2 space-y-4">
          {/* Intro card */}
          <motion.div {...fadeUp} id="about" className="rounded-xl p-4"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <h2 className="font-extrabold text-[20px] mb-2" style={{ color: C.ink }}>Intro</h2>
            <p className="text-[15px] leading-relaxed text-center" style={{ color: C.ink2 }}>{bio}</p>

            <div className="mt-4 space-y-2.5 text-[14px]" style={{ color: C.ink2 }}>
              {experiences?.[0] && (
                <Row icon={<Briefcase className="w-5 h-5" />} text={<>Works at <b>{experiences[0].company}</b></>} />
              )}
              {education?.[0] && (
                <Row icon={<GraduationCap className="w-5 h-5" />} text={<>Studied at <b>{education[0].institution}</b></>} />
              )}
              {location && <Row icon={<MapPin className="w-5 h-5" />} text={<>Lives in <b>{location}</b></>} />}
              {website && <Row icon={<LinkIcon className="w-5 h-5" />} text={<a href={website} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: C.primary }}>{website.replace(/^https?:\/\//, "")}</a>} />}
              <Row icon={<Heart className="w-5 h-5" />} text={<>Loves storytelling & writing</>} />
            </div>
          </motion.div>

          {/* Contact card */}
          <motion.div {...fadeUp} id="contact" className="rounded-xl p-4"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <h2 className="font-extrabold text-[20px] mb-3" style={{ color: C.ink }}>Contact info</h2>
            <div className="space-y-3">
              {email && <ContactRow icon={<Mail className="w-5 h-5" />} label="Email" value={email} href={`mailto:${email}`} />}
              {phone && <ContactRow icon={<Phone className="w-5 h-5" />} label="Phone" value={phone} href={`tel:${phone}`} />}
              {location && <ContactRow icon={<MapPin className="w-5 h-5" />} label="Location" value={location} />}
              {website && <ContactRow icon={<Globe className="w-5 h-5" />} label="Website" value={website.replace(/^https?:\/\//, "")} href={website} />}
            </div>

            {socialLinks && socialLinks.length > 0 && (
              <>
                <div className="h-px my-4" style={{ background: C.border }} />
                <h3 className="font-extrabold text-[15px] mb-2" style={{ color: C.ink }}>Social</h3>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(s => {
                    const Icon = getSocialIcon(s.platform);
                    return (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-semibold capitalize"
                        style={{ background: C.hover, color: C.ink2 }}>
                        <Icon className="w-4 h-4" /> {s.platform}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN — Bio post + Websites + Timeline */}
        <div className="lg:col-span-3 space-y-4">
          {/* FB-style "post" with full biography */}
          <motion.div {...fadeUp} className="rounded-xl overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <div className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden grid place-items-center font-bold text-white shrink-0"
                style={{ background: C.primary }}>
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : (name[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold" style={{ color: C.ink }}>{name}</div>
                <div className="text-[12px] flex items-center gap-1" style={{ color: C.muted }}>
                  <Calendar className="w-3 h-3" /> Pinned · About me · 🌍
                </div>
              </div>
            </div>
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: C.primary }} />
                <h2 className="font-extrabold text-[18px]" style={{ color: C.ink }}>My Biography</h2>
              </div>
              <p className="text-[15px] leading-7 whitespace-pre-line" style={{ color: C.ink2 }}>{bio}</p>
            </div>
            {cover && (
              <div className="border-t border-b" style={{ borderColor: C.border }}>
                <img src={cover} alt="" className="w-full max-h-[420px] object-cover" />
              </div>
            )}
          </motion.div>

          {/* Websites card — "his website tap" */}
          <motion.div {...fadeUp} id="websites" className="rounded-xl overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <div className="p-4 flex items-center justify-between">
              <h2 className="font-extrabold text-[20px]" style={{ color: C.ink }}>Websites & Links</h2>
              <span className="text-[13px] font-semibold" style={{ color: C.primary }}>See all</span>
            </div>
            <div className="px-4 pb-4">
              {websites.length === 0 ? (
                <p className="text-[14px]" style={{ color: C.muted }}>No links added yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {websites.slice(0, 8).map((w, i) => (
                    <a key={i} href={w.url} target="_blank" rel="noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-lg transition-colors"
                      style={{ background: C.hover, border: `1px solid ${C.border}` }}>
                      <div className="w-11 h-11 rounded-lg grid place-items-center text-white shrink-0"
                        style={{ background: C.primary }}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold truncate" style={{ color: C.ink }}>{w.label}</div>
                        <div className="text-[12px] truncate" style={{ color: C.muted }}>{w.url.replace(/^https?:\/\//, "")}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 shrink-0" style={{ color: C.muted }} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Timeline (experiences/education) */}
          {(experiences?.length || education?.length) ? (
            <motion.div {...fadeUp} id="timeline" className="rounded-xl p-4"
              style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              <h2 className="font-extrabold text-[20px] mb-3" style={{ color: C.ink }}>Life Events</h2>
              <div className="space-y-3">
                {experiences?.map(ex => (
                  <TimelineItem key={ex.id} icon={<Briefcase className="w-5 h-5" />}
                    title={`${ex.position} at ${ex.company}`}
                    sub={ex.description || undefined}
                    date={`${ex.start_date?.slice(0, 4) || ""} - ${ex.is_current ? "Present" : ex.end_date?.slice(0, 4) || ""}`} />
                ))}
                {education?.map(ed => (
                  <TimelineItem key={ed.id} icon={<GraduationCap className="w-5 h-5" />}
                    title={`${ed.degree} · ${ed.institution}`}
                    sub={ed.field_of_study || undefined}
                    date={`${ed.start_date?.slice(0, 4) || ""} - ${ed.is_current ? "Present" : ed.end_date?.slice(0, 4) || ""}`} />
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }} className="py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full grid place-items-center text-white font-bold" style={{ background: C.primary }}>
              {(name[0] || "B").toUpperCase()}
            </div>
            <span className="font-bold text-[15px]" style={{ color: C.ink }}>{name}</span>
          </div>
          <p className="text-[12px]" style={{ color: C.muted }}>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ color: C.muted }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-3 p-2 rounded-lg" style={{ background: C.hover }}>
      <div className="w-9 h-9 rounded-full grid place-items-center text-white shrink-0" style={{ background: C.primary }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: C.muted }}>{label}</div>
        <div className="text-[14px] font-semibold truncate" style={{ color: C.ink }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" className="block">{inner}</a> : inner;
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[14px] font-semibold"
      style={{ color: C.muted }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      {icon} {label}
    </button>
  );
}

function TimelineItem({ icon, title, sub, date }: { icon: React.ReactNode; title: string; sub?: string; date?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: C.hover }}>
      <div className="w-10 h-10 rounded-full grid place-items-center text-white shrink-0" style={{ background: C.primary }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold" style={{ color: C.ink }}>{title}</div>
        {sub && <div className="text-[13px]" style={{ color: C.ink2 }}>{sub}</div>}
        {date && <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>{date}</div>}
      </div>
    </div>
  );
}
