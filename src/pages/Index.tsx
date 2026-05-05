import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Globe, Palette, Users, Sparkles, Check,
  Layers, Rocket, ShieldCheck, BadgeCheck, ArrowUpRight,
} from "lucide-react";
import ThemeDemoSection from "@/components/home/ThemeDemoSection";
import Footer from "@/components/home/Footer";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";

export default function Index() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleClaim = () => {
    navigate(`/auth${username ? `?username=${encodeURIComponent(username)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-6 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <img src={alphaLogo} alt="Alpha Portfolio" className="w-8 h-8 object-contain dark:invert" />
            <span className="text-[15px] font-semibold tracking-tight">Alpha Portfolio</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#themes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Themes</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
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

      {/* HERO */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          {/* cyan blobs */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[130px]" />
          <div className="absolute -top-20 right-0 w-[480px] h-[480px] rounded-full bg-accent/25 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-secondary/15 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(ellipse 70% 50% at 50% 40%, #000 30%, transparent 80%)",
            }}
          />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">Your Digital Identity</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02] tracking-[-0.03em] mb-6">
              One profile.
              <br />
              <span className="gradient-text">Endless reach.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              A clean, beautiful portfolio in minutes. Showcase your work, links and story in a single place you actually own.
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

            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Free forever. No credit card required.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BAR */}
      <section className="py-8 border-y border-border/60">
        <div className="container mx-auto px-6">
          <div className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground/80 font-semibold mb-5">
            Built for creators, freelancers & founders
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {["Designers", "Developers", "Photographers", "Writers", "Marketers", "Founders"].map(l => (
              <div key={l} className="text-sm font-medium text-muted-foreground/60 hover:text-foreground transition-colors">{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 px-6">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="How it works" title="Three steps to your digital hub" subtitle="From signup to a live portfolio in less than 5 minutes — no coding, no fuss." />

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <StepCard num="01" icon={<BadgeCheck className="w-5 h-5" />} title="Claim your identity" desc="Sign up free with your Google account and secure your unique username." />
            <StepCard num="02" icon={<Layers className="w-5 h-5" />} title="Add your content" desc="Fill in your bio, links, projects and services with our guided builder." />
            <StepCard num="03" icon={<Rocket className="w-5 h-5" />} title="Share everywhere" desc="Drop your link in Instagram, TikTok, email — wherever your audience lives." />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Features" title="Everything you need to stand out" subtitle="Powerful tools wrapped in a simple, focused interface." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 mt-16 rounded-2xl overflow-hidden border border-border/60">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Beautiful Themes" description="Profession-specific themes for designers, photographers, marketers and more." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="No-Code Builder" description="Fill in a guided form and watch your portfolio update live. No skills needed." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Custom Domain" description="Use a free /u/username link or connect your own domain in a click." />
            <FeatureCard icon={<Users className="w-5 h-5" />} title="Social Hub" description="Connect Instagram, GitHub, LinkedIn and 20+ platforms in one place." />
            <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title="Privacy First" description="You own your data. Approval-based publishing keeps your space spam-free." />
            <FeatureCard icon={<Sparkles className="w-5 h-5" />} title="SEO Optimized" description="Built-in metadata so recruiters and clients can find you on Google instantly." />
          </div>
        </div>
      </section>

      {/* THEME DEMO */}
      <section id="themes" className="border-t border-border/60">
        <ThemeDemoSection />
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader eyebrow="Pricing" title="Simple, transparent pricing" subtitle="Start free. Upgrade when you need premium themes & power features." />

          <div className="grid md:grid-cols-2 gap-5 mt-12">
            {/* BASIC */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 flex flex-col">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Basic Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">Everything to get your portfolio live for free.</p>
              </div>

              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-5xl font-semibold tracking-tight">৳0</span>
                <span className="text-muted-foreground text-sm ml-1">/forever</span>
              </div>

              <div className="my-7 h-px bg-border" />

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unlimited portfolio sections",
                  "Free Simple theme",
                  "Custom /u/username public URL",
                  "Contact inquiries inbox",
                  "Mobile-optimized layouts",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-foreground/70" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" variant="outline" className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => navigate("/auth")}>
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* PRO */}
            <div className="gradient-primary text-white rounded-2xl p-8 md:p-10 flex flex-col relative overflow-hidden shadow-xl shadow-primary/30">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  maskImage: "radial-gradient(ellipse at top right, #000 30%, transparent 75%)",
                }}
              />
              <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">Pro Plan</h3>
                    <p className="text-sm text-white/80 mt-1">Premium themes & advanced features for professionals.</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/40 text-white text-[11px] font-semibold uppercase tracking-wider shrink-0 bg-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> Popular
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mt-6">
                  <span className="text-5xl font-semibold tracking-tight">৳499</span>
                  <span className="text-white/80 text-sm ml-1">/one-time</span>
                </div>

                <div className="my-7 h-px bg-white/20" />

                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Everything in Basic",
                    "All premium themes unlocked",
                    "Custom domain support",
                    "Advanced analytics",
                    "Priority support",
                    "Remove Alpha branding",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-white" />
                      <span className="text-white/95">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-semibold" onClick={() => navigate("/auth")}>
                  Upgrade to Pro <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            One-time payment via bKash / Nagad / Rocket — no subscriptions.
          </p>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-28 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="text-foreground/30 text-7xl font-serif leading-none mb-4 select-none">"</div>
          <p className="text-2xl md:text-3xl font-medium leading-snug tracking-tight mb-8">
            It only took me 2 minutes to set up, and now all my clients know exactly where to find my work. The themes look genuinely professional.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary text-white grid place-items-center font-semibold text-sm shadow-md shadow-primary/30">SC</div>
            <div className="text-left">
              <div className="font-medium text-sm">Sarah C.</div>
              <div className="text-xs text-muted-foreground">Owner · Greek Studio</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-hero rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
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
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-[-0.02em]">Ready to claim your space?</h2>
              <p className="text-base md:text-lg text-white/85 max-w-xl mx-auto mb-8">
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

/* ---------------- helpers ---------------- */

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-5">
        <span className="w-6 h-px bg-primary/40" /> {eyebrow} <span className="w-6 h-px bg-primary/40" />
      </div>
      <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] mb-4">{title}</h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}

function StepCard({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="relative bg-card border border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-11 h-11 rounded-xl gradient-primary text-white grid place-items-center shadow-md shadow-primary/30">
          {icon}
        </div>
        <span className="text-xs font-mono text-primary/60 tracking-wider">{num}</span>
      </div>
      <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
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
