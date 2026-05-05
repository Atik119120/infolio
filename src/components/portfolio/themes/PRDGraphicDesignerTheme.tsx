import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";

const ROTATING = ["Creative.", "Visual.", "Bold.", "Unique."];

export default function PRDGraphicDesignerTheme({
  profile,
  portfolio,
  skills,
  projects,
  socialLinks,
  userId,
}: ThemeProps) {
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setInterval(() => setWordIdx((i) => (i + 1) % ROTATING.length), 2000);
    return () => clearInterval(t);
  }, []);

  const name = profile?.display_name || "Designer";
  const bio = portfolio?.bio || "";
  const email = profile?.email;

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap');
        .display-font { font-family: 'Clash Display', system-ui, sans-serif; letter-spacing: -0.02em; }
        .marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="display-font text-2xl">{name}</div>
          <nav className="flex items-center gap-7 text-sm">
            <a href="#work" className="hover:text-[#ff4d4d]">Work</a>
            <a href="#about" className="hover:text-[#ff4d4d]">About</a>
            <a href="#contact" className="hover:text-[#ff4d4d]">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ background: "#ff4d4d" }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className="absolute bottom-32 right-20 w-48 h-48 rounded-full border-4 border-[#ff4d4d]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
          <h1 className="display-font text-7xl md:text-9xl font-bold leading-none mb-6">
            DESIGN IS<br />MY <span style={{ color: "#ff4d4d" }}>LANGUAGE</span>
          </h1>
          <div className="text-2xl md:text-3xl display-font">
            <motion.span key={wordIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {ROTATING[wordIdx]}
            </motion.span>
          </div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="absolute bottom-8 left-8 flex items-center gap-2 text-sm">
          <ArrowDown className="w-4 h-4" /> Scroll
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y-4 border-[#ff4d4d] py-4 bg-[#ff4d4d]">
        <div className="marquee whitespace-nowrap flex gap-8 display-font text-3xl font-bold">
          {[...projects, ...projects].map((p, i) => (
            <span key={i} className="flex items-center gap-8">
              {p.title} <span>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <section id="work" className="py-24">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`container mx-auto px-6 grid md:grid-cols-5 gap-10 items-center mb-24 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
          >
            <div className="md:col-span-3">
              {p.image_url && (
                <a href={p.live_url || "#"} target="_blank" rel="noreferrer" className="block group relative overflow-hidden">
                  <img src={p.image_url} alt={p.title} className="w-full aspect-video object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#ff4d4d]/0 group-hover:bg-[#ff4d4d]/70 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <span className="display-font text-3xl">View →</span>
                  </div>
                </a>
              )}
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-[#ff4d4d] mb-2 uppercase tracking-widest">0{i + 1} / Project</div>
              <h3 className="display-font text-4xl font-bold mb-4">{p.title}</h3>
              <p className="text-white/70 mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tech_stack?.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 border border-white/30 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* About */}
      <section id="about" className="py-24" style={{ background: "#f5f0eb", color: "#111" }}>
        <div className="container mx-auto px-6 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="text-sm uppercase tracking-widest mb-4">About Me</div>
            <h2 className="display-font text-5xl font-bold mb-6">Hi, I'm {name.split(" ")[0]}</h2>
            <p className="text-stone-700 leading-relaxed mb-6">{bio}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Available for projects
            </div>
          </div>
          {profile?.avatar_url && (
            <div className="md:col-span-3">
              <img src={profile.avatar_url} alt={name} className="w-full max-w-lg ml-auto" />
            </div>
          )}
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="display-font text-5xl font-bold mb-12 text-center">Tools I Use</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((s) => (
              <span key={s.id} className="display-font text-2xl md:text-4xl px-5 py-2 border-2 border-white/40 rounded-full hover:border-[#ff4d4d] hover:text-[#ff4d4d] transition">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services as numbered list (using skills categories) */}
      <section className="py-24" style={{ background: "#f5f0eb", color: "#111" }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="display-font text-5xl font-bold mb-12">Services</h2>
          {Array.from(new Set(skills.map((s) => s.category || "Design"))).slice(0, 6).map((cat, i) => (
            <div key={cat} className="border-b border-stone-300 py-6 flex items-center gap-6">
              <span className="display-font text-3xl text-[#ff4d4d] font-bold w-16">0{i + 1}.</span>
              <span className="display-font text-3xl font-bold flex-1">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-black">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="display-font text-6xl md:text-7xl font-bold mb-8">LET'S CREATE<br /><span style={{ color: "#ff4d4d" }}>SOMETHING</span></h2>
          {email && (
            <a href={`mailto:${email}`} className="display-font text-2xl md:text-3xl underline decoration-[#ff4d4d] underline-offset-8 mb-12 inline-block">{email}</a>
          )}
          {userId && (
            <div className="mt-12 text-left bg-white/5 backdrop-blur rounded-xl p-6">
              <ContactForm portfolioOwnerId={userId} />
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-sm text-white/60">© {new Date().getFullYear()} {name}</div>
          <div className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:border-[#ff4d4d] hover:text-[#ff4d4d]">
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
