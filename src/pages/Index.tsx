import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Globe, Palette, Users, Sparkles, Check, Star,
  Layers, Rocket, MousePointer2, ShieldCheck, BadgeCheck,
  Mail, Github, Linkedin, ExternalLink,
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
        <div className="container mx-auto px-6 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
            <img src={alphaLogo} alt="Alpha Portfolio" className="w-9 h-9 object-contain dark:invert transition-transform group-hover:rotate-6" />
            <span className="text-lg font-bold tracking-tight">Alpha<span className="gradient-text">Portfolio</span></span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            <a href="#themes" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Themes</a>
            <a href="#how" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex">Login</Button>
            <Button size="sm" className="gradient-primary hover:opacity-90 text-white" onClick={() => navigate("/auth")}>
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* gradient background */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/15 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)",
            }}
          />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wide uppercase">Your Digital Identity</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              One Profile,
              <br />
              <span className="gradient-text">Endless Reach.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Build a beautiful portfolio in minutes. Showcase your work, skills, and links — all in
              one place that you actually own.
            </p>

            {/* Claim username box */}
            <div className="bg-card border border-border rounded-2xl p-2 flex items-center gap-2 max-w-lg shadow-lg shadow-primary/5">
              <div className="flex-1 flex items-center pl-4">
                <span className="text-muted-foreground text-sm font-medium">alphazero.online/</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_-]/gi, "").toLowerCase())}
                  placeholder="username"
                  className="flex-1 bg-transparent outline-none px-1 py-3 text-sm font-medium placeholder:text-muted-foreground/60"
                  onKeyDown={(e) => e.key === "Enter" && handleClaim()}
                />
              </div>
              <Button onClick={handleClaim} className="gradient-primary hover:opacity-90 text-white rounded-xl">
                Claim now
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-success" />
              <span>Free forever. No credit card required.</span>
            </div>

            {/* trust strip */}
            <div className="mt-10 flex items-center gap-6 flex-wrap">
              <div className="flex -space-x-2">
                {["bg-pink-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-background grid place-items-center text-white text-xs font-bold`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5"><b className="text-foreground">10,000+</b> creators trust us</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <PhonePreview />
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BAR */}
      <section className="py-10 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6">
            Loved by creators, freelancers & founders
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground/70">
            {["Designers", "Developers", "Photographers", "Writers", "Marketers", "Founders"].map(l => (
              <div key={l} className="text-sm font-bold tracking-wide opacity-60 hover:opacity-100 transition-opacity">{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Badge text="How it works" />
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
              Three steps to your <span className="gradient-text">digital hub</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From signup to a live portfolio in less than 5 minutes — no coding, no fuss.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <StepCard num="01" icon={<BadgeCheck className="w-6 h-6" />} title="Claim your identity" desc="Sign up free with your Google account and secure your unique username." />
            <StepCard num="02" icon={<Layers className="w-6 h-6" />} title="Add your content" desc="Fill in your bio, links, projects, and services with our guided builder." />
            <StepCard num="03" icon={<Rocket className="w-6 h-6" />} title="Share everywhere" desc="Drop your link in Instagram, TikTok, email — wherever your audience lives." />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Badge text="Features" />
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
              Everything you need to <span className="gradient-text">stand out</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools wrapped in a simple, beautiful interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <FeatureCard icon={<Palette className="w-6 h-6" />} title="Beautiful Themes" description="Profession-specific themes built for designers, photographers, marketers and more." gradient="gradient-primary" />
            <FeatureCard icon={<Zap className="w-6 h-6" />} title="No-Code Builder" description="Fill in a guided form and watch your portfolio update live. No design skills needed." gradient="gradient-secondary" />
            <FeatureCard icon={<Globe className="w-6 h-6" />} title="Custom Domain" description="Use a free /u/username link or connect your own domain in a click." gradient="gradient-accent" />
            <FeatureCard icon={<Users className="w-6 h-6" />} title="Social Hub" description="Connect Instagram, GitHub, LinkedIn, and 20+ platforms in one beautiful place." gradient="gradient-primary" />
            <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} title="Privacy First" description="You own your data. Approval-based publishing keeps your space spam-free." gradient="gradient-secondary" />
            <FeatureCard icon={<Sparkles className="w-6 h-6" />} title="SEO Optimized" description="Built-in metadata so recruiters and clients can find you on Google instantly." gradient="gradient-accent" />
          </div>
        </div>
      </section>

      {/* THEME DEMO */}
      <section id="themes">
        <ThemeDemoSection />
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <Badge text="Pricing" />
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
              Transparent <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground">Start free. Upgrade only when you need premium themes.</p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
                <div>
                  <h3 className="text-2xl font-bold">Basic Plan</h3>
                  <p className="text-sm text-muted-foreground mt-1">Essential tools to start building your brand online.</p>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" /> Most Popular
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-5xl font-extrabold">৳0</span>
                <span className="text-muted-foreground text-sm">/forever</span>
              </div>

              <div className="my-8 h-px bg-border" />

              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited portfolio sections",
                  "Free Simple theme",
                  "Custom /u/username public URL",
                  "Contact inquiries inbox",
                  "Basic analytics",
                  "Mobile-optimized layouts",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 grid place-items-center mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-full gradient-primary hover:opacity-90 text-white" onClick={() => navigate("/auth")}>
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Premium themes available as one-time purchase from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-20 px-6 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-6 right-8 text-8xl text-primary/10 font-serif leading-none select-none">"</div>
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6 text-foreground">
                It only took me 2 minutes to set up, and now all my clients know exactly where to find my work.
                The themes look genuinely professional.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold">SC</div>
                <div>
                  <div className="font-semibold">Sarah C.</div>
                  <div className="text-sm text-muted-foreground">Owner · Greek Studio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="gradient-hero rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <MousePointer2 className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Ready to claim your space?</h2>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8">
                Join thousands of professionals showcasing their work the smart way.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base font-semibold px-8 py-6" onClick={() => navigate("/auth")}>
                Create Your Portfolio <ArrowRight className="ml-2 w-5 h-5" />
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

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-widest uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {text}
    </span>
  );
}

function StepCard({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative bg-card border border-border rounded-2xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all group"
    >
      <div className="absolute top-6 right-6 text-5xl font-extrabold text-muted-foreground/10 leading-none">{num}</div>
      <div className="w-12 h-12 rounded-xl gradient-primary text-white grid place-items-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl ${gradient} grid place-items-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function PhonePreview() {
  return (
    <div className="relative w-[300px] md:w-[340px] aspect-[9/19] rounded-[3rem] bg-gradient-to-br from-foreground to-foreground/80 p-3 shadow-2xl shadow-primary/30 ring-1 ring-foreground/20 animate-float">

      <div className="w-full h-full rounded-[2.5rem] bg-background overflow-hidden relative">
        {/* notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-foreground z-10" />

        {/* content */}
        <div className="pt-12 px-6 h-full flex flex-col">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent p-1">
              <div className="w-full h-full rounded-full bg-background grid place-items-center text-2xl font-bold gradient-text">A</div>
            </div>
            <div className="mt-3 font-bold text-base flex items-center justify-center gap-1">
              Alex Rivera <BadgeCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5 px-2 leading-snug">
              Digital creator · Sharing thoughts on design, tech & the future.
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {[
              { label: "Read My Blog", icon: <ExternalLink className="w-3.5 h-3.5" /> },
              { label: "Latest Projects", icon: <ExternalLink className="w-3.5 h-3.5" /> },
              { label: "Join Newsletter", icon: <Mail className="w-3.5 h-3.5" />, highlight: true },
              { label: "GitHub", icon: <Github className="w-3.5 h-3.5" /> },
              { label: "LinkedIn", icon: <Linkedin className="w-3.5 h-3.5" /> },
            ].map((l, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                  l.highlight
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/50 border-border text-foreground/80"
                }`}
              >
                <span>{l.label}</span>
                {l.icon}
              </div>
            ))}
          </div>

          <div className="mt-auto pb-4 text-center text-[9px] uppercase tracking-widest text-muted-foreground">
            Powered by <span className="font-bold gradient-text">Alpha</span>
          </div>
        </div>
      </div>
    </div>
  );
}
