import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Cloud, Sparkles, BadgeCheck, Lock, Server, ArrowUpRight, ArrowRight } from "lucide-react";

export function Eyebrow({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-primary">
      <span className="w-6 h-px bg-primary/40" /> {text} <span className="w-6 h-px bg-primary/40" />
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <Eyebrow text={eyebrow} />
      <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] mt-3 mb-2">{title}</h2>
      <p className="text-base text-muted-foreground leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}

export function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl border border-border/80 shadow-sm p-4 md:p-6 hover:border-primary/40 hover:bg-primary/5 transition-all group relative"
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

export const FAQS = [
  { q: "Can I connect my own domain?", a: "Yes — on Creator Premium, connect any domain with auto-issued SSL straight from your dashboard." },
  { q: "Is SSL included?", a: "Always. Every site (subdomain or custom) gets free auto-renewing SSL." },
  { q: "Can I switch themes later?", a: "Anytime. Your content carries over when you switch themes from the dashboard." },
  { q: "Can I buy a single premium theme without upgrading?", a: "Yes. On Portfolio Starter you can unlock additional premium themes for ৳50 each." },
  { q: "How do payments work?", a: "Pay monthly or yearly via bKash, Nagad or Rocket. Yearly saves around 15%." },
  { q: "Is Infolio really free to start?", a: "Yes. Build, publish and host on a free subdomain — no credit card required." },
];

export type Plan = {
  name: string;
  short: string;
  tagline: string;
  monthly: number;
  yearly: number;
  badge?: string;
  highlight?: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  { name: "Free", short: "Free", tagline: "For beginners getting started", monthly: 0, yearly: 0,
    features: ["1 Website", "Up to 4 Projects", "2–3 Free Themes", "Free Subdomain", "SSL Included", "Favicon & Browser Title", "Powered by Infolio badge"] },
  { name: "Portfolio Starter", short: "Starter", tagline: "Freelancers & personal portfolios", monthly: 149, yearly: 1499, badge: "Most Popular", highlight: true,
    features: ["1 Website", "Up to 10 Projects", "All Free Themes", "1 Premium Theme included", "Extra premium themes ৳50 each", "Full SEO (Meta, OG, Favicon)", "Free Subdomain + SSL", "Branding Toggle (On/Off)"] },
  { name: "Creator Premium", short: "Creator", tagline: "Professional creators & designers", monthly: 299, yearly: 2999,
    features: ["Unlimited Projects", "All Free + All Premium Themes", "Full SEO Access", "Free Subdomain + SSL", "Custom Domain Support", "Branding Toggle (On/Off)"] },
];

export const COMPARE_ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: "Websites", values: ["1", "1", "1"] },
  { label: "Projects", values: ["4", "10", "Unlimited"] },
  { label: "Free Themes", values: ["2–3", "All", "All"] },
  { label: "Premium Themes", values: [false, "1 included (+৳50 each)", "All included"] },
  { label: "Free Subdomain + SSL", values: [true, true, true] },
  { label: "Favicon & Browser Title", values: [true, true, true] },
  { label: "SEO Controls", values: [false, true, true] },
  { label: "Custom Domain", values: [false, false, true] },
  { label: "Remove Infolio Branding", values: [false, true, true] },
];

export const TERMS = [
  { icon: ShieldCheck, title: "Global Terms", items: ["You're responsible for your content and uploads", "No illegal, phishing, or abusive content", "Hosting abuse may result in suspension", "Maintain your own backups", "Platform limits may evolve over time"] },
  { icon: Cloud, title: "Hosting & Infrastructure", items: ["Infrastructure powered by trusted cloud providers", "Performance varies with region & network", "Infolio not liable for third-party outages", "CDN & external API delays out of our control"] },
  { icon: Sparkles, title: "Evolving Platform", items: ["Some features are experimental or in beta", "UI/UX may evolve over time", "Occasional bugs may occur", "Active development on new themes"] },
  { icon: BadgeCheck, title: "Refund Policy", items: ["Monthly plans: refund within 7 days", "Yearly plans: refund within 15 days", "Single theme purchases are non-refundable", "Domain & third-party costs non-refundable", "Abuse voids refund eligibility"] },
  { icon: Lock, title: "Liability Notice", items: ["Not responsible for business or revenue loss", "Not responsible for SEO ranking loss", "Not responsible for domain propagation delays", "Not responsible for content uploaded by users"] },
  { icon: Server, title: "Plan-Specific Limits", items: ["Free: subdomain only, up to 4 projects, branding visible", "Portfolio Starter: 1 premium theme, branding toggle, no custom domain", "Creator Premium: unlimited projects, all themes, custom domain"] },
];


export function PlanCard({ plan, billing, onClick }: { plan: Plan; billing: "monthly" | "yearly"; onClick: () => void }) {
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const suffix = billing === "monthly" ? "/mo" : "/yr";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-3xl p-6 flex flex-col border backdrop-blur-sm transition-all hover:-translate-y-1 ${
        plan.highlight ? "border-primary/50 bg-gradient-to-br from-primary/15 via-card to-card shadow-2xl shadow-primary/20" : "border-border bg-card/70 hover:border-primary/40"
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
        className={`w-full rounded-xl mt-5 font-semibold group flex items-center justify-center gap-1.5 ${
          plan.highlight ? "gradient-primary text-white hover:opacity-95" : "border-border/80 hover:border-primary/40"
        }`}
        variant={plan.highlight ? "default" : "outline"}
        size="sm"
      >
        {plan.badge === "Upcoming" ? "Notify me" : "Get started"}
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </motion.div>
  );
}
