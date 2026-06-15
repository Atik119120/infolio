import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import Footer from "@/components/home/Footer";
import { SectionHeader, PLANS, TERMS, PlanCard } from "@/pages/home/shared";

export default function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Pricing — Infolio</title>
        <meta name="description" content="Simple, transparent pricing. Start free, upgrade as your work grows. Pay via bKash, Nagad or Rocket." />
        <link rel="canonical" href="https://infolio.online/pricing" />
      </Helmet>
      <SiteHeader />

      <section className="pt-32 md:pt-40 pb-16 px-6">
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
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} billing={billing} onClick={() => navigate("/auth")} />
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">All prices in BDT (৳). Pay via bKash, Nagad or Rocket. Cancel anytime.</p>
        </div>
      </section>


      <section className="py-20 px-6 border-t border-border/60">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Terms" title="Fair use, plain English" subtitle="The rules of the road for using Infolio." />
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {TERMS.map((t) => (
              <motion.div key={t.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4 }}
                className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur p-6 hover:border-primary/40 transition">
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

      <Footer />
    </div>
  );
}
