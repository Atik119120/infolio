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
  const [pricingPlan, setPricingPlan] = useState<"free" | "pro">("free");

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
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Features" title="Everything you need" subtitle="A focused toolkit — no bloat." />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 mt-12 rounded-2xl overflow-hidden border border-border/60">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Beautiful Themes" description="Profession-specific themes for designers, photographers, marketers & more." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="No-Code Builder" description="Fill a guided form, watch your portfolio update live." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Custom Domain" description="Free /u/username link or connect your own domain." />
            <FeatureCard icon={<Users className="w-5 h-5" />} title="Social Hub" description="Connect 20+ social platforms in one place." />
            <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title="Privacy First" description="Approval-based publishing keeps spam out." />
            <FeatureCard icon={<Sparkles className="w-5 h-5" />} title="SEO Optimized" description="Built-in metadata so clients find you on Google." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader eyebrow="Pricing" title="Simple, honest pricing" subtitle="Start free. Upgrade when you need more power." />

          {/* Plan toggle */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1 rounded-full border border-border bg-card">
              <button
                onClick={() => setPricingPlan("free")}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${pricingPlan === "free" ? "gradient-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}
              >
                Free
              </button>
              <button
                onClick={() => setPricingPlan("pro")}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 ${pricingPlan === "pro" ? "gradient-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Crown className="w-3.5 h-3.5" /> Pro
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-6 mt-8 max-w-xl mx-auto">
            {pricingPlan === "free" ? (
            /* FREE */
            <motion.div
              key="free"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-card border border-border rounded-3xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold tracking-tight">Free</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Forever</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Everything to launch your first portfolio.</p>
              <div className="mb-6">
                <span className="text-5xl font-semibold tracking-tight">৳0</span>
                <span className="text-muted-foreground ml-1">/forever</span>
              </div>

              <ul className="space-y-3 text-sm flex-1">
                <PriceRow ok>1 website with subdomain</PriceRow>
                <PriceRow ok>100 MB image storage</PriceRow>
                <PriceRow ok>Free Simple theme</PriceRow>
                <PriceRow ok>Basic editor</PriceRow>
                <PriceRow ok>Ad-free experience</PriceRow>
                <PriceRow>Custom domain</PriceRow>
                <PriceRow>SEO meta tags</PriceRow>
                <PriceRow>Google verification</PriceRow>
                <PriceRow>Auto sitemap</PriceRow>
              </ul>

              <Button variant="outline" className="w-full rounded-full mt-7" onClick={() => navigate("/auth")}>
                Get started free
              </Button>
            </motion.div>
            ) : (
            /* PRO */
            <motion.div
              key="pro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-3xl p-8 flex flex-col text-white overflow-hidden gradient-hero shadow-2xl shadow-primary/30"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                  maskImage: "radial-gradient(ellipse at top right, #000 30%, transparent 75%)",
                }}
              />
              <div className="relative z-10 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold tracking-tight inline-flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-300 fill-amber-300" /> Pro
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur font-medium">Most popular</span>
                </div>
                <p className="text-sm text-white/85 mb-5">Full control + SEO power for serious creators.</p>
                <div className="mb-6">
                  <span className="text-5xl font-semibold tracking-tight">৳200</span>
                  <span className="text-white/80 ml-1">/year</span>
                </div>

                <ul className="space-y-3 text-sm flex-1">
                  <PriceRow ok light>Everything in Free</PriceRow>
                  <PriceRow ok light><strong>Custom domain</strong> support</PriceRow>
                  <PriceRow ok light><strong>300 MB</strong> image storage</PriceRow>
                  <PriceRow ok light>Advanced editor &amp; layout</PriceRow>
                  <PriceRow ok light>SEO meta tags editing</PriceRow>
                  <PriceRow ok light>Google Search Console verification</PriceRow>
                  <PriceRow ok light>Auto sitemap generation</PriceRow>
                  <PriceRow ok light>Priority performance</PriceRow>
                </ul>

                <Button className="w-full rounded-full mt-7 bg-white text-primary hover:bg-white/90 font-semibold" onClick={() => navigate("/auth")}>
                  Upgrade to Pro <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
                <p className="text-xs text-white/70 text-center mt-3">One-time payment via bKash, Nagad or Rocket</p>
              </div>
            </motion.div>
            )}
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
