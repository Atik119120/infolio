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

const FAQS = [
  { q: "Is Infolio really free?", a: "Yes. The Basic plan is free forever with the Simple theme and unlimited sections. Premium themes are an optional one-time purchase." },
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
      className="bg-card p-4 md:p-7 hover:bg-primary/5 transition-colors group relative"
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

function PriceRow({ children, ok = false, light = false }: { children: React.ReactNode; ok?: boolean; light?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className={`shrink-0 w-5 h-5 rounded-full grid place-items-center mt-0.5 ${
        ok
          ? (light ? "bg-white/20 text-white" : "bg-primary/15 text-primary")
          : (light ? "bg-white/10 text-white/50" : "bg-muted text-muted-foreground/60")
      }`}>
        {ok ? <Check className="w-3 h-3" strokeWidth={3} /> : <X className="w-3 h-3" strokeWidth={3} />}
      </span>
      <span className={ok ? (light ? "text-white" : "text-foreground") : (light ? "text-white/60 line-through" : "text-muted-foreground line-through")}>
        {children}
      </span>
    </li>
  );
}
