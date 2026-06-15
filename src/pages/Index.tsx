import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Palette, Check, Sparkles, Quote,
  Zap, Globe, Rocket, Server, Search, Cloud, Image,
} from "lucide-react";
import Footer from "@/components/home/Footer";
import SiteHeader from "@/components/home/SiteHeader";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import { SectionHeader, FeatureCard, PLANS, TERMS, PlanCard } from "@/pages/home/shared";
import stepsImage from "@/assets/steps-section.jpg";

export default function Index() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const handleClaim = () => {
    navigate(`/auth${username ? `?username=${encodeURIComponent(username)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-foreground">
      <SiteHeader />
      <Helmet>
        <title>Infolio — Build Your Professional Portfolio in Minutes</title>
        <meta name="description" content="Pick a theme, add your work, and publish a stunning personal portfolio in minutes — on your own subdomain or custom domain." />
        <link rel="canonical" href="https://infolio.online/" />
        <meta property="og:title" content="Infolio — Build Your Professional Portfolio in Minutes" />
        <meta property="og:description" content="Pick a theme, add your work, and publish a stunning personal portfolio in minutes." />
        <meta property="og:url" content="https://infolio.online/" />
      </Helmet>

      {/* HERO */}
      <section className="relative isolate min-h-screen flex items-center pt-32 md:pt-36 pb-20 px-6 overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-20 bg-background" />
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 70% at 50% 100%, hsl(187 90% 35% / 0.55), transparent 70%)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <GradientBars numBars={28} gradientFrom="hsl(187 90% 55%)" gradientTo="transparent" animationDuration={2.4} />
        </div>
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 -z-10 pointer-events-none bg-gradient-to-b from-background to-transparent" />

        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
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
              <button onClick={() => navigate("/themes")} className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary text-sm font-medium transition-all">
                <Palette className="w-4 h-4" />
                View all themes
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground mb-10 leading-tight">
                Three steps to<br />your digital hub.
              </h2>
              <div className="space-y-8">
                {[
                  { num: "1", title: "Claim your identity", desc: "Sign up for free and secure your unique username." },
                  { num: "2", title: "Add your content", desc: "Paste your links, socials, portfolio pieces, or stores." },
                  { num: "3", title: "Share everywhere", desc: "Put your Infolio link in your Instagram, TikTok, or email signature." },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-5">
                    <div className="shrink-0 w-10 h-10 rounded-full border border-primary/50 text-primary grid place-items-center text-sm font-semibold mt-0.5">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-base mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
                <img
                  src={stepsImage}
                  alt="Team collaborating"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={1024}
                  height={768}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:bottom-6 md:left-[-2rem] lg:left-[-2.5rem] max-w-xs">
                <div className="bg-card/80 backdrop-blur rounded-2xl p-5 border border-border shadow-xl">
                  <Quote className="w-5 h-5 text-primary mb-2" />
                  <p className="text-foreground text-sm leading-relaxed mb-3">
                    "It only took me 2 minutes to set up, and now all my clients know exactly where to find our work."
                  </p>
                  <p className="text-primary text-xs font-medium">
                    — Sarah C., Owner Grek
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 md:py-32 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader eyebrow="Features" title="Built for creators" subtitle="Everything you need to publish a stunning portfolio — no code required." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Premium Themes" description="Beautiful themes for every profession." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="No-Code Builder" description="Drag, drop, publish — live preview." />
            <FeatureCard icon={<Rocket className="w-5 h-5" />} title="Instant Publish" description="Go live in seconds, worldwide." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Free Subdomain" description="yourname.infolio.online free." />
            <FeatureCard icon={<Server className="w-5 h-5" />} title="Custom Domain" description="Your own domain with auto SSL." />
            <FeatureCard icon={<Search className="w-5 h-5" />} title="SEO Tools" description="Meta, sitemap, social tags." />
            <FeatureCard icon={<Image className="w-5 h-5" />} title="Project Gallery" description="Showcase work with images & videos." />
            <FeatureCard icon={<Cloud className="w-5 h-5" />} title="Global CDN" description="Fast loading from anywhere." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 md:py-32 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-7xl">
          <SectionHeader eyebrow="Pricing" title="Plans for every stage" subtitle="Start free with a subdomain. Upgrade as your work grows." />
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center p-1 rounded-full border border-border bg-card">
              <button onClick={() => setBilling("monthly")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "gradient-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}>Monthly</button>
              <button onClick={() => setBilling("yearly")} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 ${billing === "yearly" ? "gradient-primary text-white shadow-md shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}>
                Yearly <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning">save 15%</span>
              </button>
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} billing={billing} onClick={() => navigate("/auth")} />
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">All prices in BDT (৳). Pay via bKash, Nagad or Rocket. Cancel anytime.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 border-t border-border/60 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-[140px]" />
        </div>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] mb-4">Ready to ship?</h2>
          <p className="text-muted-foreground mb-8">Claim your free subdomain and publish in minutes.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button onClick={() => navigate("/auth")} size="lg" className="rounded-full gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/30">
              Get started free <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
