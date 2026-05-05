import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Globe, Palette, Users, Sparkles, Check,
  ShieldCheck, ArrowUpRight, Plus, Minus, Star, BadgeCheck,
} from "lucide-react";
import ThemeDemoSection from "@/components/home/ThemeDemoSection";
import Footer from "@/components/home/Footer";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";

export default function Index() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleClaim = () => {
    navigate(`/auth${username ? `?username=${encodeURIComponent(username)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <img src={alphaLogo} alt="Alpha Portfolio" className="w-8 h-8 object-contain dark:invert" />
            <span className="text-[15px] font-semibold tracking-tight">Alpha Portfolio</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            <a href="#why" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why us</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#themes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Themes</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex text-sm">Login</Button>
            <Button size="sm" className="rounded-full gradient-primary text-white hover:opacity-90 text-sm shadow-md shadow-primary/20" onClick={() => navigate("/auth")}>
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO — unique split: text left, layered cards right */}
      <section className="relative pt-32 md:pt-36 pb-20 px-6 overflow-hidden">
        {/* cyan ambient */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-40 w-[520px] h-[520px] rounded-full bg-primary/25 blur-[140px]" />
          <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-accent/30 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)",
            }}
          />
        </div>

        {/* Decorative background orbs & rings */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary/10" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-primary/5" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[1300px] rounded-full border border-primary/5" />
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] left-[12%] w-14 h-14 rounded-2xl gradient-primary shadow-xl shadow-primary/40 grid place-items-center rotate-12"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute bottom-[16%] right-[10%] w-16 h-16 rounded-2xl gradient-accent shadow-xl shadow-accent/40 grid place-items-center -rotate-6"
          >
            <Star className="w-7 h-7 text-white fill-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute top-[28%] right-[14%] w-12 h-12 rounded-full bg-card border border-primary/30 shadow-xl shadow-primary/20 grid place-items-center"
          >
            <BadgeCheck className="w-5 h-5 text-primary" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            className="absolute bottom-[22%] left-[14%] w-12 h-12 rounded-full bg-card border border-primary/30 shadow-xl shadow-primary/20 grid place-items-center"
          >
            <Globe className="w-5 h-5 text-primary" />
          </motion.div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6">
              <Sparkles className="w-3 h-3" />
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">Build in minutes</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.03em] mb-5">
              Your <span className="gradient-text">portfolio</span>,
              <br />done right.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Pick a theme, fill a form, share your link. Beautiful portfolios for creators, developers and freelancers — without writing a single line of code.
            </p>

            <div className="bg-card border border-primary/20 rounded-full p-1.5 flex items-center gap-2 max-w-lg mx-auto shadow-lg shadow-primary/10">
              <div className="flex-1 flex items-center pl-4 min-w-0">
                <span className="text-muted-foreground text-sm font-medium hidden sm:inline">alphazero.online/</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_-]/gi, "").toLowerCase())}
                  placeholder="username"
                  className="flex-1 bg-transparent outline-none px-2 py-2.5 text-sm font-medium placeholder:text-muted-foreground/60 min-w-0"
                  onKeyDown={(e) => e.key === "Enter" && handleClaim()}
                />
              </div>
              <Button onClick={handleClaim} size="sm" className="rounded-full gradient-primary text-white hover:opacity-90 px-5 shadow-md shadow-primary/30">
                Claim <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-5 text-sm text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Free forever</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Live in 5 min</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY US — compact 4-stat row */}
      <section id="why" className="py-16 px-6 border-y border-border/60 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <Eyebrow text="Why Alpha Portfolio" />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] mt-4">
              Built for people, <span className="gradient-text">not coders.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WhyCard icon={<Zap className="w-5 h-5" />} title="5-min setup" desc="Live portfolio without code." />
            <WhyCard icon={<Palette className="w-5 h-5" />} title="Pro themes" desc="Profession-specific designs." />
            <WhyCard icon={<Globe className="w-5 h-5" />} title="Custom domain" desc="Use your own URL." />
            <WhyCard icon={<ShieldCheck className="w-5 h-5" />} title="You own it" desc="Privacy-first by default." />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Features" title="Everything you need" subtitle="A focused toolkit — no bloat." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 mt-12 rounded-2xl overflow-hidden border border-border/60">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Beautiful Themes" description="Profession-specific themes for designers, photographers, marketers & more." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="No-Code Builder" description="Fill a guided form, watch your portfolio update live." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Custom Domain" description="Free /u/username link or connect your own domain." />
            <FeatureCard icon={<Users className="w-5 h-5" />} title="Social Hub" description="Connect 20+ social platforms in one place." />
            <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title="Privacy First" description="Approval-based publishing keeps spam out." />
            <FeatureCard icon={<Sparkles className="w-5 h-5" />} title="SEO Optimized" description="Built-in metadata so clients find you on Google." />
          </div>
        </div>
      </section>

      {/* THEMES */}
      <section id="themes" className="border-t border-border/60">
        <ThemeDemoSection />
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-3xl">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" subtitle="Everything you might want to know before getting started." />

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-primary/40 bg-primary/[0.03]" : "border-border bg-card hover:border-primary/20"}`}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold text-[15px] tracking-tight">{faq.q}</span>
                    <span className={`shrink-0 w-7 h-7 rounded-full grid place-items-center transition-colors ${isOpen ? "gradient-primary text-white" : "bg-muted text-foreground/70"}`}>
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-hero rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-semibold mb-3 tracking-[-0.02em]">Claim your space today.</h2>
              <p className="text-base md:text-lg text-white/85 max-w-xl mx-auto mb-7">
                Join thousands of professionals showcasing their work the smart way.
              </p>
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 text-sm font-semibold px-7" onClick={() => navigate("/auth")}>
                Create your portfolio <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ---------------- data & helpers ---------------- */

const FAQS = [
  { q: "Is Alpha Portfolio really free?", a: "Yes. The Basic plan is free forever with the Simple theme and unlimited sections. Premium themes are an optional one-time purchase." },
  { q: "Do I need any coding skills?", a: "No code at all. Just sign up, fill a guided form, and your portfolio is live with a public URL." },
  { q: "Can I use my own domain?", a: "Yes. You get a free /u/username link, and you can connect a custom domain from your dashboard." },
  { q: "How long does it take to get approved?", a: "New accounts are usually activated within a few hours by our team. You'll get an email when your account is ready." },
  { q: "How do payments work for premium themes?", a: "One-time payment via bKash, Nagad or Rocket — no subscriptions. Once paid, the theme is yours forever." },
  { q: "Can I change my theme later?", a: "Absolutely. Switch themes anytime from your dashboard — your content carries over automatically." },
];

function Eyebrow({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-primary">
      <span className="w-6 h-px bg-primary/40" /> {text} <span className="w-6 h-px bg-primary/40" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <Eyebrow text={eyebrow} />
      <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] mt-4 mb-3">{title}</h2>
      <p className="text-base text-muted-foreground leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
    >
      <div className="w-10 h-10 rounded-xl gradient-primary text-white grid place-items-center mb-3 shadow-md shadow-primary/30">
        {icon}
      </div>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-card p-7 hover:bg-primary/5 transition-colors group relative"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:gradient-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/30 transition-all">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 tracking-tight flex items-center gap-2">
        {title}
        <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
