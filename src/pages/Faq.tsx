import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/home/SiteHeader";
import Footer from "@/components/home/Footer";
import { SectionHeader, FAQS } from "@/pages/home/shared";

export default function Faq() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>FAQ — Infolio</title>
        <meta name="description" content="Frequently asked questions about Infolio — domains, deploys, billing and more." />
        <link rel="canonical" href="https://infolio.online/faq" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <SiteHeader />

      <section className="pt-32 md:pt-40 pb-24 px-6 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-5xl">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" subtitle="Everything you might want to know before getting started." />

          <div className="mt-12 max-w-3xl mx-auto flex flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`border rounded-2xl overflow-hidden transition-all backdrop-blur-sm ${isOpen ? "border-primary/40 bg-primary/[0.05] shadow-xl shadow-primary/10" : "border-border/70 bg-card/60 hover:border-primary/30"}`}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4">
                    <span className="font-medium text-[15px] md:text-base tracking-tight">{faq.q}</span>
                    <span className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition-all ${isOpen ? "gradient-primary text-white rotate-180 shadow-md shadow-primary/40" : "bg-muted text-foreground/70"}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }} className="px-5 md:px-6 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">
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
