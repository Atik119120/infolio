import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Palette, Check, Sparkles, Tag, HelpCircle, LayoutGrid, Quote,
} from "lucide-react";
import Footer from "@/components/home/Footer";
import SiteHeader from "@/components/home/SiteHeader";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import { SectionHeader } from "@/pages/home/shared";

export default function Index() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleClaim = () => {
    navigate(`/auth${username ? `?username=${encodeURIComponent(username)}` : ""}`);
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
      </Helmet>

      <SiteHeader />

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


      {/* EXPLORE MORE — teaser cards linking to dedicated pages */}
      <section className="py-24 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Explore" title="Dive deeper" subtitle="Everything else lives on its own page — pick what you need." />
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { icon: LayoutGrid, title: "Features", desc: "16+ tools — themes, builder, deploys, SEO, CDN and more.", to: "/features" },
              { icon: Tag, title: "Pricing", desc: "Plans from ৳59/mo. Compare side-by-side, pay via bKash.", to: "/pricing" },
              { icon: HelpCircle, title: "FAQ", desc: "Quick answers about domains, deploys, billing and refunds.", to: "/faq" },
            ].map((c) => (
              <motion.button
                key={c.title}
                onClick={() => navigate(c.to)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                className="text-left group rounded-3xl border border-border/70 bg-card/60 backdrop-blur p-6 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl gradient-primary text-white grid place-items-center shadow-md shadow-primary/30 mb-4">
                  <c.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-1.5">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.button>
            ))}
          </div>
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
            <Button onClick={() => navigate("/pricing")} size="lg" variant="outline" className="rounded-full">
              See pricing
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
