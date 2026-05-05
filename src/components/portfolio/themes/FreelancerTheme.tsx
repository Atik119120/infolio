import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";

export default function FreelancerTheme({
  profile,
  portfolio,
  skills,
  projects,
  experiences,
  socialLinks,
  userId,
}: ThemeProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const name = profile?.display_name || "Your Name";
  const tagline = portfolio?.headline || "Freelance Professional";
  const bio = portfolio?.bio || "";
  const yearsExp = experiences?.length || 0;
  const projectsCount = projects?.length || 0;
  const clientsCount = Math.max(projectsCount * 2, 10);

  const categories = Array.from(new Set(projects.map((p) => p.tech_stack?.[0]).filter(Boolean))) as string[];
  const skillsByCategory = skills.reduce((acc: Record<string, typeof skills>, s) => {
    const c = s.category || "General";
    (acc[c] = acc[c] || []).push(s);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen text-slate-50"
      style={{
        background: "#0f172a",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur" style={{ background: "rgba(15,23,42,0.85)" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl">{name}</div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-300">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#portfolio" className="hover:text-white">Portfolio</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href="#contact">
            <Button className="rounded-full px-5" style={{ background: "#3b82f6" }}>Hire Me</Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-3"
          >
            {portfolio?.location && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-5"
                style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Available for work
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5">
              I Help Businesses <span style={{ color: "#3b82f6" }}>{tagline}</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 line-clamp-3 max-w-xl">{bio}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#portfolio">
                <Button size="lg" style={{ background: "#3b82f6" }}>View My Work <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="border-slate-500 bg-transparent text-white hover:bg-slate-800">Let's Talk</Button>
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 flex justify-center"
          >
            {profile?.avatar_url && (
              <div className="relative">
                <div
                  className="w-72 h-72 overflow-hidden"
                  style={{
                    clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                    boxShadow: "0 0 80px rgba(59,130,246,0.5)",
                  }}
                >
                  <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10" style={{ background: "#1e293b" }}>
        <div className="container mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { num: `${yearsExp}+`, label: "Years Experience" },
            { num: `${clientsCount}+`, label: "Happy Clients" },
            { num: `${projectsCount}+`, label: "Projects Done" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-extrabold" style={{ color: "#3b82f6" }}>{s.num}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services (from skills categories) */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">What I Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(skillsByCategory).slice(0, 6).map(([cat, list]) => (
              <motion.div
                key={cat}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl"
                style={{ background: "#1e293b", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(59,130,246,0.2)" }}>
                  <CheckCircle2 className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{cat}</h3>
                <p className="text-slate-400 text-sm mb-3">Professional {cat.toLowerCase()} services tailored to your needs.</p>
                <div className="text-xs text-slate-500">{list.length} skill{list.length > 1 ? "s" : ""}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills with bars */}
      <section className="py-16" style={{ background: "#0b1225" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.slice(0, 10).map((s) => (
              <div key={s.id}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-slate-400">{s.proficiency || 80}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e293b" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.proficiency || 80}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: "#3b82f6" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">My Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <motion.a
                key={p.id}
                href={p.live_url || "#"}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -8 }}
                className="block rounded-2xl overflow-hidden"
                style={{ background: "#1e293b" }}
              >
                {p.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tech_stack?.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>{t}</span>
                    ))}
                  </div>
                  <span className="text-sm flex items-center gap-1" style={{ color: "#3b82f6" }}>View Project <ExternalLink className="w-3 h-3" /></span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20" style={{ background: "#0b1225" }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-3">Ready to Start a Project?</h2>
          <p className="text-center text-slate-400 mb-10">Let's build something great together.</p>
          {userId && (
            <div className="rounded-2xl p-8" style={{ background: "#1e293b" }}>
              <ContactForm portfolioOwnerId={userId} />
            </div>
          )}
          <div className="flex justify-center gap-4 mt-8 text-slate-300">
            {portfolio?.phone && (
              <a href={`tel:${portfolio.phone}`} className="flex items-center gap-2 hover:text-white"><Phone className="w-4 h-4" />{portfolio.phone}</a>
            )}
            {portfolio?.location && (
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{portfolio.location}</span>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-slate-400">
          <div>© {new Date().getFullYear()} {name}. All rights reserved.</div>
          <div className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white" style={{ background: "#1e293b" }}>
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
