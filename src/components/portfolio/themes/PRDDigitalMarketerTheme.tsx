import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Rocket, TrendingUp, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { ThemeProps } from "./types";
import { getSocialIcon } from "./utils";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(to / 40));
    const t = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(t);
      } else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [inView, to]);
  return <div ref={ref}>{val}{suffix}</div>;
}

export default function PRDDigitalMarketerTheme({
  profile,
  portfolio,
  skills,
  projects,
  experiences,
  socialLinks,
  userId,
}: ThemeProps) {
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const name = profile?.display_name || "Marketer";
  const tagline = portfolio?.headline || "growth-focused marketer";
  const bio = portfolio?.bio || "";
  const yearsExp = experiences.length;
  const projectsCount = projects.length;
  const clientsCount = Math.max(projectsCount * 3, 15);

  const serviceTabs = Array.from(new Set(skills.map((s) => s.category || "Marketing"))).slice(0, 5);
  const tabSkills = skills.filter((s) => (s.category || "Marketing") === serviceTabs[activeTab]);

  return (
    <div className="min-h-screen text-slate-50" style={{ background: "#1e1b4b", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      <header className="sticky top-0 z-50 backdrop-blur" style={{ background: "rgba(15,14,46,0.85)" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-extrabold text-xl flex items-center gap-2"><Rocket className="text-green-400" /> {name}</div>
          <nav className="hidden md:flex gap-7 text-sm text-slate-300">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#results" className="hover:text-white">Results</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href="#contact"><Button className="rounded-full" style={{ background: "#22c55e", color: "#052e16" }}>Get Free Audit</Button></a>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-5 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-5" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac" }}>
              🚀 Growth-Focused Marketer
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5">
              I Turn <span style={{ color: "#22c55e" }}>Clicks</span> Into Customers
            </h1>
            <p className="text-lg text-slate-300 mb-3">{tagline}</p>
            <p className="text-slate-400 mb-8 max-w-xl line-clamp-3">{bio}</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="#results"><Button size="lg" style={{ background: "#22c55e", color: "#052e16" }}>See My Results <ArrowRight className="ml-2 w-4 h-4" /></Button></a>
              <a href="#contact"><Button size="lg" variant="outline" className="bg-transparent border-slate-500 text-white hover:bg-slate-800">Book a Call</Button></a>
            </div>
            <div className="text-sm text-slate-400">{clientsCount}+ brands grown · {yearsExp}+ years experience</div>
          </motion.div>

          {/* Fake dashboard */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-2">
            <div className="rounded-2xl p-5" style={{ background: "#2d2a6e" }}>
              <div className="flex items-center justify-between mb-4 text-xs text-slate-300">
                <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-green-400" /> Campaign Performance</span>
                <span className="text-green-400">+247%</span>
              </div>
              <div className="flex items-end gap-2 h-40">
                {[40, 65, 50, 80, 70, 90, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="flex-1 rounded-t"
                    style={{ background: "linear-gradient(180deg, #22c55e, #15803d)" }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                {["M","T","W","T","F","S","S"].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-16" style={{ background: "#0f0e2e" }}>
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Happy Clients", to: clientsCount, suffix: "+" },
            { label: "Campaigns", to: projectsCount, suffix: "+" },
            { label: "Years", to: yearsExp, suffix: "+" },
            { label: "Data-Driven", to: 100, suffix: "%" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-6" style={{ background: "#2d2a6e" }}>
              <div className="text-4xl font-extrabold" style={{ color: "#22c55e" }}>
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services tabs */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-3">How I Can Help</h2>
          <p className="text-center text-slate-400 mb-10">Strategy → Execution → Growth</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-slate-700">
            {serviceTabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 text-sm font-semibold transition ${activeTab === i ? "text-white border-b-2" : "text-slate-400 hover:text-white"}`}
                style={activeTab === i ? { borderColor: "#22c55e" } : {}}
              >
                {t}
              </button>
            ))}
          </div>
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto rounded-2xl p-8 text-center" style={{ background: "#2d2a6e" }}>
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <h3 className="text-2xl font-bold mb-3">{serviceTabs[activeTab]}</h3>
            <p className="text-slate-300 mb-4">Strategic {serviceTabs[activeTab]?.toLowerCase()} services that drive real, measurable results for your business.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {tabSkills.map((s) => <span key={s.id} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac" }}>{s.name}</span>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20" style={{ background: "#0f0e2e" }}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-12">Results That Speak</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <motion.a
                key={p.id}
                href={p.live_url || "#"}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -6 }}
                className="block rounded-2xl p-6"
                style={{ background: "#2d2a6e" }}
              >
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech_stack?.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac" }}>{t}</span>)}
                </div>
                <span className="text-sm flex items-center gap-1" style={{ color: "#22c55e" }}>View Case Study <ArrowRight className="w-3 h-3" /></span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-extrabold text-center mb-12">Tools & Platforms</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((s) => {
              const dots = Math.round((s.proficiency || 80) / 20);
              return (
                <div key={s.id} className="flex items-center justify-between rounded-xl p-4" style={{ background: "#2d2a6e" }}>
                  <span className="font-medium">{s.name}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i < dots ? "#22c55e" : "#475569" }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20" style={{ background: "#0f0e2e" }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-extrabold text-center mb-3">Ready to Grow Your Business?</h2>
          <p className="text-center text-slate-400 mb-8">Let's talk strategy and results.</p>
          <div className="flex justify-center gap-6 mb-8 text-sm text-slate-300">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Response within 24hrs</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Free consultation</span>
          </div>
          {userId && (
            <div className="rounded-2xl p-8" style={{ background: "#2d2a6e" }}>
              <ContactForm portfolioOwnerId={userId} />
            </div>
          )}
        </div>
      </section>

      <footer className="py-10 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 items-center text-sm text-slate-400">
          <div>© {new Date().getFullYear()} {name}</div>
          <div className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = getSocialIcon(s.platform);
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center hover:text-white" style={{ background: "#2d2a6e" }}>
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
