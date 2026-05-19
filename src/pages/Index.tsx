import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Globe, Palette, Users, Sparkles, Check,
  ShieldCheck, ArrowUpRight, Plus, Minus, Star, BadgeCheck, Crown, X, Menu,
  Github, Cloud, Code2, Rocket, Server, Search, BarChart3, ShoppingBag,
  Layers, FolderGit2, Gauge, FileCode, Lock, Database,
} from "lucide-react";
import ThemeDemoSection from "@/components/home/ThemeDemoSection";
import Footer from "@/components/home/Footer";
import SiteHeader from "@/components/home/SiteHeader";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";
import { GradientBars } from "@/components/ui/gradient-bars-background";

export default function Index() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const handleClaim = () => {
    navigate(`/auth${username ? `?username=${encodeURIComponent(username)}` : ""}`);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-foreground">
      <Helmet>
        <title>Infolio — Build Your Professional Portfolio in Minutes</title>
        <meta name="description" content="Pick a theme, add your work, and publish a stunning personal portfolio in minutes — on your own subdomain or custom domain." />
        <link rel="canonical" href="https://infolio.online/" />
        <meta property="og:title" content="Infolio — Build Your Professional Portfolio in Minutes" />
        <meta property="og:description" content="Pick a theme, add your work, and publish a stunning personal portfolio in minutes." />
        <meta property="og:url" content="https://infolio.online/" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      {/* NAV */}
      <SiteHeader />

      {/* HERO — unique split: text left, layered cards right */}
      <section className="relative isolate min-h-screen flex items-center pt-32 md:pt-36 pb-20 px-6 overflow-hidden">
        {/* Gradient bars background */}
        <div aria-hidden className="absolute inset-0 -z-20 bg-background" />
        {/* base radial fill so vertical seams between bars don't read as gaps */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 100%, hsl(187 90% 35% / 0.55), transparent 70%)",
          }}
        />
        {/* Gradient bars sit above bg, below content */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <GradientBars
            numBars={28}
            gradientFrom="hsl(187 90% 55%)"
            gradientTo="transparent"
            animationDuration={2.4}
          />
        </div>
        {/* subtle top fade to soften bars near nav */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 -z-10 pointer-events-none bg-gradient-to-b from-background to-transparent"
        />

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

            <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02] tracking-[-0.04em] mb-6 lg:text-7xl">
              Build your <span className="gradient-text">portfolio</span>,<br />the smart way.
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Pick a theme, fill a form, share your link. Beautiful portfolios for creators, developers and freelancers — without writing a single line of code.
            </p>

            <div className="bg-card border border-primary/20 rounded-full p-1.5 flex items-center gap-2 max-w-xl mx-auto shadow-lg shadow-primary/10">
              <div className="flex-1 flex items-center pl-4 min-w-0">
                <span className="text-muted-foreground text-sm font-medium hidden sm:inline">infolio.online/</span>
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

            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={() => navigate("/themes")}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary text-sm font-medium transition-all"
              >
                <Palette className="w-4 h-4" />
                View all themes
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Features" title="Everything you need to ship" subtitle="From no-code themes to GitHub-powered deployments — one platform." />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/60 mt-12 rounded-3xl overflow-hidden border border-border/60">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Ready Themes" description="Premium themes for every profession." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="Portfolio Builder" description="No-code guided builder, live preview." />
            <FeatureCard icon={<Rocket className="w-5 h-5" />} title="Instant Deploy" description="Push live in seconds, globally." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Free Subdomain" description="username.infolio.online instantly." />
            <FeatureCard icon={<Server className="w-5 h-5" />} title="Custom Domain" description="Connect any domain with auto SSL." />
            <FeatureCard icon={<Github className="w-5 h-5" />} title="GitHub Integration" description="Import & deploy any repository." />
            <FeatureCard icon={<Code2 className="w-5 h-5" />} title="React Deploy" description="Production React builds, optimized." />
            <FeatureCard icon={<Layers className="w-5 h-5" />} title="Next.js Deploy" description="SSR, ISR, edge — all supported." />
            <FeatureCard icon={<FileCode className="w-5 h-5" />} title="Vite Deploy" description="Lightning-fast Vite builds." />
            <FeatureCard icon={<FolderGit2 className="w-5 h-5" />} title="Custom HTML/CSS" description="Drop in your own code anywhere." />
            <FeatureCard icon={<Search className="w-5 h-5" />} title="SEO Management" description="Meta tags, sitemap, Search Console." />
            <FeatureCard icon={<Cloud className="w-5 h-5" />} title="Global CDN" description="Edge-cached for blazing speed." />
            <FeatureCard icon={<Users className="w-5 h-5" />} title="Team Workspace" description="Collaborate across projects." />
            <FeatureCard icon={<Database className="w-5 h-5" />} title="Multi-Project" description="Run up to 10 projects per account." />
            <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="Analytics" description="Visitor insights — coming soon." />
            <FeatureCard icon={<ShoppingBag className="w-5 h-5" />} title="E-commerce" description="Store, products, checkout — soon." />
          </div>
        </div>
      </section>

      {/* DEPLOYMENT SHOWCASE */}
      <section id="deploy" className="py-24 px-6 border-t border-border/60 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Deployments" title="Ship from GitHub in one click" subtitle="React, Next.js, Vite — connect a repo or pick a template. We build, deploy and serve it globally." />

          <div className="mt-14 grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl gradient-primary text-white grid place-items-center shadow-lg shadow-primary/40">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Connect GitHub</h3>
                  <p className="text-xs text-muted-foreground">OAuth in seconds</p>
                </div>
              </div>
              <ol className="space-y-3 text-sm text-foreground/85">
                {["Authorize Infolio with your GitHub", "Pick any public or private repo", "Choose framework — auto detected", "Hit Publish — live in 60s"].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-semibold grid place-items-center">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary grid place-items-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Or use a template</h3>
                  <p className="text-xs text-muted-foreground">Zero setup</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { name: "React Starter", icon: <Code2 className="w-4 h-4" /> },
                  { name: "Next.js Blog", icon: <Layers className="w-4 h-4" /> },
                  { name: "Vite Portfolio", icon: <FileCode className="w-4 h-4" /> },
                  { name: "Landing Page", icon: <Rocket className="w-4 h-4" /> },
                ].map((t) => (
                  <div key={t.name} className="rounded-xl border border-border bg-background/50 p-3 flex items-center gap-2 hover:border-primary/40 transition">
                    <span className="text-primary">{t.icon}</span>
                    <span className="font-medium">{t.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Gauge className="w-4 h-4 text-primary" /> Average deploy time: <strong className="text-foreground">42 seconds</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: "Free SSL", v: <Lock className="w-4 h-4" /> },
              { k: "Global CDN", v: <Cloud className="w-4 h-4" /> },
              { k: "Auto Builds", v: <Rocket className="w-4 h-4" /> },
              { k: "Custom Domains", v: <Globe className="w-4 h-4" /> },
            ].map((b) => (
              <div key={b.k} className="rounded-2xl border border-border bg-card/60 backdrop-blur p-4 flex items-center gap-2 text-sm">
                <span className="text-primary">{b.v}</span>
                <span className="font-medium">{b.k}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-7xl">
          <SectionHeader eyebrow="Pricing" title="Plans for every stage" subtitle="Start free with a subdomain. Upgrade as your work grows." />

          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1 rounded-full border border-border bg-card">
              <button onClick={() => setBilling("monthly")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "gradient-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}>Monthly</button>
              <button onClick={() => setBilling("yearly")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 ${billing === "yearly" ? "gradient-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}>
                Yearly <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning">save 15%</span>
              </button>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} billing={billing} onClick={() => navigate("/auth")} />
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">All prices in BDT (৳). Pay via bKash, Nagad or Rocket. Cancel anytime.</p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-24 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-7xl">
          <SectionHeader eyebrow="Compare" title="Find the right plan" subtitle="Side-by-side breakdown of every feature." />
          <div className="mt-12 overflow-x-auto rounded-3xl border border-border bg-card/60 backdrop-blur">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30">
                  <th className="text-left p-4 font-semibold tracking-tight">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.name} className="text-center p-4 font-semibold tracking-tight">
                      <div className="flex flex-col items-center gap-1">
                        <span>{p.short}</span>
                        {p.badge && <span className="text-[10px] px-2 py-0.5 rounded-full gradient-primary text-white">{p.badge}</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? "bg-background/30" : ""}>
                    <td className="p-4 text-foreground/85">{row.label}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="p-4 text-center text-muted-foreground">
                        {v === true ? <Check className="w-4 h-4 text-primary mx-auto" strokeWidth={3} /> :
                         v === false ? <X className="w-4 h-4 text-muted-foreground/40 mx-auto" /> :
                         <span className="font-medium text-foreground/85">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section id="terms" className="py-24 px-6 border-t border-border/60 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/8 blur-[140px]" />
        </div>
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Terms" title="Fair use, plain English" subtitle="The rules of the road for using Infolio." />
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {TERMS.map((t) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur p-6 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary text-white grid place-items-center shadow-md shadow-primary/30">
                    <t.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{t.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {t.items.map((it) => (
                    <li key={it} className="flex gap-2"><Check className="w-3.5 h-3.5 mt-1 shrink-0 text-primary" /><span>{it}</span></li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-border/60 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-5xl">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" subtitle="Everything you might want to know before getting started." />

          <div className="mt-12 max-w-3xl mx-auto flex flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`border rounded-2xl overflow-hidden transition-all backdrop-blur-sm ${isOpen ? "border-primary/40 bg-primary/[0.05] shadow-xl shadow-primary/10" : "border-border/70 bg-card/60 hover:border-primary/30"}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4"
                  >
                    <span className="font-medium text-[15px] md:text-base tracking-tight">{faq.q}</span>
                    <span className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition-all ${isOpen ? "gradient-primary text-white rotate-180 shadow-md shadow-primary/40" : "bg-muted text-foreground/70"}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                      className="px-5 md:px-6 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">Still have questions?</p>
            <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-full">
              Contact support <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}

/* ---------------- data & helpers ---------------- */

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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-card p-4 md:p-6 hover:bg-primary/5 transition-colors group relative"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:gradient-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/30 transition-all">
        {icon}
      </div>
      <h3 className="text-sm font-semibold mb-1.5 tracking-tight flex items-center gap-2">
        {title}
        <ArrowUpRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}


const FAQS = [
  { q: "Can I connect my own domain?", a: "Yes — on Creator Premium and above, connect any domain with auto-issued SSL straight from your dashboard." },
  { q: "Can I deploy React or Next.js apps?", a: "Yes. Developer Pro and Studio plans support React, Next.js and Vite — connect GitHub or pick a template." },
  { q: "Is SSL included?", a: "Always. Every site (subdomain or custom) gets free auto-renewing SSL." },
  { q: "Can I switch themes later?", a: "Anytime. Your content carries over when you switch themes from the dashboard." },
  { q: "Do you support GitHub deployment?", a: "Yes. Authorize once, then deploy any public or private repo with one click." },
  { q: "Will e-commerce features come later?", a: "Commerce Pro is on the roadmap — products, orders, checkout and store analytics, all included." },
  { q: "How do payments work?", a: "Pay monthly or yearly via bKash, Nagad or Rocket. Yearly saves around 15%." },
  { q: "Is Infolio really free to start?", a: "Yes. Build, publish and host on a free subdomain — no credit card required." },
];

type Plan = {
  name: string;
  short: string;
  tagline: string;
  monthly: number;
  yearly: number;
  badge?: string;
  highlight?: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Basic", short: "Basic", tagline: "Beginners & personal portfolios",
    monthly: 59, yearly: 599,
    features: ["1 Website", "Free Subdomain", "Basic Themes", "Portfolio Upload", "SSL Included", "500MB Storage", "10GB Bandwidth"],
  },
  {
    name: "Creator Premium", short: "Creator", tagline: "Creators & freelancers",
    monthly: 149, yearly: 1499,
    features: ["Everything in Basic", "Premium Themes", "Custom Domain", "SEO Control", "Remove Branding", "Custom HTML", "1GB Storage", "50GB Bandwidth"],
  },
  {
    name: "Developer Pro", short: "Developer", tagline: "Developers & advanced users",
    monthly: 249, yearly: 2499, badge: "Most Popular", highlight: true,
    features: ["Everything in Creator", "GitHub Connect", "React / Next.js / Vite", "Custom HTML/CSS", "Advanced SEO", "Full Theme Access", "5GB Storage", "200GB Bandwidth"],
  },
  {
    name: "Studio", short: "Studio", tagline: "Agencies & multi-project",
    monthly: 399, yearly: 3999,
    features: ["Everything in Pro", "Up to 10 Projects", "Multiple Domains", "CDN Support", "Team Workspace", "Priority Hosting", "5GB Storage", "500GB Bandwidth"],
  },
  {
    name: "Commerce Pro", short: "Commerce", tagline: "E-commerce businesses",
    monthly: 199, yearly: 1999, badge: "Upcoming",
    features: ["Everything in Studio", "E-commerce Themes", "Product Management", "Payment Integration", "Order System", "Store Analytics", "3GB Storage", "300GB Bandwidth"],
  },
];

const COMPARE_ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: "Websites / Projects", values: ["1", "1", "3", "10", "Unlimited"] },
  { label: "Themes", values: ["Basic", "Premium", "Full", "Full", "Commerce"] },
  { label: "Custom Domain", values: [false, true, true, true, true] },
  { label: "SEO Management", values: [false, true, true, true, true] },
  { label: "GitHub Deploy", values: [false, false, true, true, true] },
  { label: "React / Next / Vite", values: [false, false, true, true, true] },
  { label: "Custom HTML/CSS", values: [false, true, true, true, true] },
  { label: "CDN", values: [true, true, true, true, true] },
  { label: "Team Workspace", values: [false, false, false, true, true] },
  { label: "E-commerce", values: [false, false, false, false, true] },
  { label: "Storage", values: ["500MB", "1GB", "5GB", "5GB", "3GB"] },
  { label: "Bandwidth / mo", values: ["10GB", "50GB", "200GB", "500GB", "300GB"] },
];

const TERMS = [
  {
    icon: ShieldCheck, title: "Global Terms",
    items: [
      "You're responsible for your content, code & deployments",
      "No illegal, phishing, or abusive content",
      "Hosting abuse may result in suspension",
      "Maintain your own backups",
      "Platform limits may evolve over time",
    ],
  },
  {
    icon: Cloud, title: "Third-Party Services",
    items: [
      "Infrastructure powered by Supabase, Cloudflare, Vercel & GitHub",
      "Performance varies with region & network",
      "Infolio not liable for third-party outages",
      "CDN & external API delays out of our control",
    ],
  },
  {
    icon: Sparkles, title: "Beta / Evolving Platform",
    items: [
      "Some features are experimental or in beta",
      "UI/UX may evolve over time",
      "Occasional bugs may occur",
      "Active development on new systems",
    ],
  },
  {
    icon: BadgeCheck, title: "Refund Policy",
    items: [
      "Monthly plans: refund within 7 days",
      "Yearly plans: refund within 15 days",
      "Heavy usage may void refund",
      "Domain & third-party costs non-refundable",
      "Abuse voids refund eligibility",
    ],
  },
  {
    icon: Lock, title: "Liability Notice",
    items: [
      "Not responsible for business or revenue loss",
      "Not responsible for SEO ranking loss",
      "Not responsible for deployment / build errors caused by user code",
      "Not responsible for domain propagation delays",
    ],
  },
  {
    icon: Server, title: "Plan-Specific Limits",
    items: [
      "Basic: subdomain-only, 500MB / 10GB",
      "Creator: bring your own domain, 1GB / 50GB",
      "Developer Pro: you own your code, 5GB / 200GB",
      "Studio: max 10 projects, no account sharing",
      "Commerce Pro: you're responsible for products & orders",
    ],
  },
];

function PlanCard({ plan, billing, onClick }: { plan: Plan; billing: "monthly" | "yearly"; onClick: () => void }) {
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const suffix = billing === "monthly" ? "/mo" : "/yr";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-3xl p-6 flex flex-col border backdrop-blur-sm transition-all hover:-translate-y-1 ${
        plan.highlight
          ? "border-primary/50 bg-gradient-to-br from-primary/15 via-card to-card shadow-2xl shadow-primary/20"
          : "border-border bg-card/70 hover:border-primary/40"
      }`}
    >
      {plan.badge && (
        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-3 py-1 rounded-full ${plan.highlight ? "gradient-primary text-white shadow-md shadow-primary/40" : "bg-warning/20 text-warning border border-warning/30"}`}>
          {plan.badge}
        </span>
      )}
      <h3 className="text-base font-semibold tracking-tight">{plan.name}</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-4 min-h-[32px]">{plan.tagline}</p>
      <div className="mb-5">
        <span className="text-3xl font-semibold tracking-tight">৳{price}</span>
        <span className="text-muted-foreground text-sm ml-1">{suffix}</span>
      </div>
      <ul className="space-y-2 text-xs flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" strokeWidth={3} />
            <span className="text-foreground/85">{f}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onClick}
        className={`w-full rounded-full mt-5 ${plan.highlight ? "gradient-primary text-white hover:opacity-90 shadow-md shadow-primary/30" : ""}`}
        variant={plan.highlight ? "default" : "outline"}
        size="sm"
      >
        {plan.badge === "Upcoming" ? "Notify me" : "Get started"}
      </Button>
    </motion.div>
  );
}

