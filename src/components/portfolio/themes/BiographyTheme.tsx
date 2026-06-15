import { useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap } from "lucide-react";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";
import { isVisible } from "@/lib/sectionVisibility";

/**
 * Biography Theme — Linktree-style bio link page on a dark background.
 * Layout: Avatar → Name (verified) → Headline → Bio → Social icons row → Stacked link buttons → Footer
 */
const C = {
  bg: "#0a0a0a",
  bg2: "#141414",
  surface: "rgba(255,255,255,0.06)",
  surfaceHover: "rgba(255,255,255,0.12)",
  border: "rgba(255,255,255,0.12)",
  ink: "#ffffff",
  muted: "#a1a1aa",
  primary: "#3b82f6",
  accent: "#c6ff3a",
};

export default function BiographyTheme({
  profile,
  portfolio,
  projects,
  experiences,
  education,
  socialLinks,
}: ThemeProps) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const name = portfolio?.brand_name || profile?.display_name || "Your Name";
  const headline = portfolio?.hero_headline || portfolio?.headline || "Creator";
  const bio = portfolio?.hero_subheadline || portfolio?.about_text || portfolio?.bio || "Welcome to my page.";
  const avatar = portfolio?.hero_image_url || portfolio?.about_image_url || profile?.avatar_url;
  const footerText = portfolio?.footer_text;
  const email = profile?.email;
  const phone = portfolio?.phone;
  const location = portfolio?.location;
  const website = portfolio?.website;

  const vHero = isVisible(portfolio, "hero");
  const vAbout = isVisible(portfolio, "about");
  const vSocial = isVisible(portfolio, "social");
  const vContact = isVisible(portfolio, "contact");
  const vProjects = isVisible(portfolio, "projects");
  const vExperience = isVisible(portfolio, "experience");
  const vEducation = isVisible(portfolio, "education");

  // Build link buttons from website + projects
  const links: { label: string; url: string }[] = [];
  if (vContact && website) links.push({ label: "My Website", url: website });
  if (vProjects) projects?.forEach(p => {
    if (p.live_url) links.push({ label: p.title, url: p.live_url });
  });
  if (vContact && email) links.push({ label: `Email Me`, url: `mailto:${email}` });
  if (vContact && phone) links.push({ label: `WhatsApp`, url: `https://wa.me/${phone.replace(/[^0-9]/g, "")}` });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay },
  });

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, ${C.bg} 60%)`,
        color: C.ink,
        fontFamily: "Inter, -apple-system, system-ui, sans-serif",
      }}
    >
      {/* Soft glow */}
      <div className="absolute inset-x-0 top-0 h-[480px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, ${C.accent}22, transparent 60%)` }} />

      <main className="relative max-w-[560px] mx-auto px-5 pt-14 pb-16">
        {/* AVATAR */}
        <motion.div {...fadeUp(0)} className="flex justify-center">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full overflow-hidden grid place-items-center text-3xl font-extrabold"
              style={{
                background: C.bg2,
                boxShadow: `0 0 0 3px ${C.accent}, 0 8px 32px rgba(0,0,0,0.5)`,
                color: C.muted,
              }}
            >
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span>{(name[0] || "?").toUpperCase()}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* NAME + VERIFIED */}
        <motion.div {...fadeUp(0.05)} className="mt-5 flex items-center justify-center gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center" style={{ color: C.ink }}>
            {name}
          </h1>
          <BadgeCheck className="w-7 h-7 fill-current" style={{ color: C.primary }} />
        </motion.div>

        {/* HEADLINE pill */}
        <motion.div {...fadeUp(0.1)} className="mt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase font-semibold"
            style={{ color: C.muted }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
            {headline}
          </div>
        </motion.div>

        {/* BIO */}
        {vAbout && (
        <motion.p
          {...fadeUp(0.15)}
          className="mt-5 text-center text-[15px] leading-relaxed mx-auto max-w-[440px] whitespace-pre-line"
          style={{ color: "#d4d4d8" }}
        >
          {bio}
        </motion.p>
        )}

        {/* META (location/website) */}
        {vContact && (location || website) && (
          <motion.div {...fadeUp(0.18)} className="mt-4 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[12px]" style={{ color: C.muted }}>
            {location && (<span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{location}</span>)}
            {website && (<a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" />{website.replace(/^https?:\/\//, "")}</a>)}
          </motion.div>
        )}

        {/* SOCIAL ICONS ROW */}
        {vSocial && socialLinks && socialLinks.length > 0 && (
          <motion.div {...fadeUp(0.2)} className="mt-6 flex items-center justify-center flex-wrap gap-3">
            {socialLinks.map(s => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.platform}
                  className="w-11 h-11 rounded-full grid place-items-center transition-all hover:scale-110"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.ink }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.surface)}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              );
            })}
          </motion.div>
        )}

        {/* LINK BUTTONS */}
        <div className="mt-8 space-y-3">
          {links.map((l, i) => (
            <motion.a
              key={i}
              href={l.url}
              target={l.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              {...fadeUp(0.25 + i * 0.05)}
              className="group block w-full text-center px-5 py-4 rounded-2xl font-bold text-[15px] transition-all relative"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                color: C.ink,
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.surfaceHover;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.surface;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>{l.label}</span>
              <ExternalLink className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity" />
            </motion.a>
          ))}
          {links.length === 0 && (
            <div className="text-center text-[13px]" style={{ color: C.muted }}>No links yet.</div>
          )}
        </div>

        {/* OPTIONAL: brief experience/education chips */}
        {((vExperience && experiences?.length) || (vEducation && education?.length)) ? (
          <motion.div {...fadeUp(0.4)} className="mt-10">
            <div className="text-center text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: C.muted }}>
              Background
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {experiences?.slice(0, 3).map(ex => (
                <span key={ex.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: "#d4d4d8" }}>
                  <Briefcase className="w-3 h-3" /> {ex.position} · {ex.company}
                </span>
              ))}
              {education?.slice(0, 2).map(ed => (
                <span key={ed.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: "#d4d4d8" }}>
                  <GraduationCap className="w-3 h-3" /> {ed.degree} · {ed.institution}
                </span>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* FOOTER */}
        <footer className="mt-14 text-center">
          <p className="text-[11px]" style={{ color: C.muted }}>
            {footerText || `© ${new Date().getFullYear()} ${name}`}
          </p>
        </footer>
      </main>
    </div>
  );
}
