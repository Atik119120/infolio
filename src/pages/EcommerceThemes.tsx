import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Crown, ShoppingBag, Sparkles, ExternalLink, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/home/SiteHeader";
import { Footer } from "@/components/home/Footer";
import { ECOMMERCE_TEMPLATES } from "@/builder/marketplace/ecommerceTemplates";

const CATS = ["All", "Fashion", "Electronics", "Food", "Service", "Digital"];

export default function EcommerceThemes() {
  const [cat, setCat] = useState("All");
  const filtered = useMemo(
    () => (cat === "All" ? ECOMMERCE_TEMPLATES : ECOMMERCE_TEMPLATES.filter(t => t.category === cat)),
    [cat]
  );

  return (
    <>
      <Helmet>
        <title>Ecommerce Themes — Infolio Builder</title>
        <meta name="description" content="Premium ecommerce templates: fashion, electronics, food & digital stores. Drag & drop builder + theme engine ready." />
        <link rel="canonical" href="https://infolio.lovable.app/themes/ecommerce" />
      </Helmet>

      <SiteHeader />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-amber-500/10" />
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <Badge className="mb-4 bg-pink-500/10 text-pink-600 border-pink-500/30">
                <ShoppingBag className="w-3 h-3 mr-1" /> Ecommerce Marketplace
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Sell anything with <span className="bg-gradient-to-r from-pink-600 to-amber-500 bg-clip-text text-transparent">premium themes</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Production-ready storefront templates. Works with both <strong>Drag & Drop Builder</strong> and <strong>Theme Engine</strong>.
                bKash/Nagad/COD payments built-in.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild className="gradient-primary">
                  <Link to="/dashboard/builder"><Wand2 className="w-4 h-4 mr-2" />Open Builder</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard/engine">Switch Engine</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 h-9 text-sm rounded-full border transition ${
                  cat === c
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground/70 border-border hover:border-foreground/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                className="group rounded-xl overflow-hidden border bg-card hover:border-pink-500/60 hover:shadow-xl transition"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img src={t.preview} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  {t.tier !== "Free" && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider">
                      <Crown className="w-3 h-3 text-amber-400" />
                      {t.tier}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{t.name}</h3>
                    <Badge variant="outline" className="text-xs">{t.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Builder & Theme engine compatible · bKash / Nagad / COD
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link to="/dashboard/builder">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Use Template
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={t.preview} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No themes in this category yet. Check back soon.
            </div>
          )}
        </section>

        {/* Engine compat */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-6 bg-gradient-to-br from-purple-500/5 to-transparent">
              <Wand2 className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Drag & Drop Builder</h3>
              <p className="text-sm text-muted-foreground">Full visual editing, one-click apply, custom blocks. Best for non-technical store owners.</p>
            </div>
            <div className="rounded-xl border p-6 bg-gradient-to-br from-pink-500/5 to-transparent">
              <Sparkles className="w-8 h-8 text-pink-500 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Theme Engine</h3>
              <p className="text-sm text-muted-foreground">Standardized sections, fastest setup. Switch anytime from Engine Manager.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
