import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Cloud, Sparkles, BadgeCheck, Lock, Server, ArrowUpRight } from "lucide-react";

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
      <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] mt-4 mb-3">{title}</h2>
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

export const FAQS = [
  { q: "Can I connect my own domain?", a: "Yes — on Creator Premium and above, connect any domain with auto-issued SSL straight from your dashboard." },
  { q: "Can I deploy React or Next.js apps?", a: "Yes. Developer Pro and Studio plans support React, Next.js and Vite — connect GitHub or pick a template." },
  { q: "Is SSL included?", a: "Always. Every site (subdomain or custom) gets free auto-renewing SSL." },
  { q: "Can I switch themes later?", a: "Anytime. Your content carries over when you switch themes from the dashboard." },
  { q: "Do you support GitHub deployment?", a: "Yes. Authorize once, then deploy any public or private repo with one click." },
  { q: "Will e-commerce features come later?", a: "Commerce Pro is on the roadmap — products, orders, checkout and store analytics, all included." },
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
  { name: "Basic", short: "Basic", tagline: "Beginners & personal portfolios", monthly: 59, yearly: 599,
    features: ["1 Website", "Free Subdomain", "Basic Themes", "Portfolio Upload", "SSL Included", "500MB Storage", "10GB Bandwidth"] },
  { name: "Creator Premium", short: "Creator", tagline: "Creators & freelancers", monthly: 149, yearly: 1499,
    features: ["Everything in Basic", "Premium Themes", "Custom Domain", "SEO Control", "Remove Branding", "Custom HTML", "1GB Storage", "50GB Bandwidth"] },
  { name: "Developer Pro", short: "Developer", tagline: "Developers & advanced users", monthly: 249, yearly: 2499, badge: "Most Popular", highlight: true,
    features: ["Everything in Creator", "GitHub Connect", "React / Next.js / Vite", "Custom HTML/CSS", "Advanced SEO", "Full Theme Access", "5GB Storage", "200GB Bandwidth"] },
  { name: "Studio", short: "Studio", tagline: "Agencies & multi-project", monthly: 399, yearly: 3999,
    features: ["Everything in Pro", "Up to 10 Projects", "Multiple Domains", "CDN Support", "Team Workspace", "Priority Hosting", "5GB Storage", "500GB Bandwidth"] },
  { name: "Commerce Pro", short: "Commerce", tagline: "E-commerce businesses", monthly: 199, yearly: 1999, badge: "Upcoming",
    features: ["Everything in Studio", "E-commerce Themes", "Product Management", "Payment Integration", "Order System", "Store Analytics", "3GB Storage", "300GB Bandwidth"] },
];

export const COMPARE_ROWS: { label: string; values: (string | boolean)[] }[] = [
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

export const TERMS = [
  { icon: ShieldCheck, title: "Global Terms", items: ["You're responsible for your content, code & deployments", "No illegal, phishing, or abusive content", "Hosting abuse may result in suspension", "Maintain your own backups", "Platform limits may evolve over time"] },
  { icon: Cloud, title: "Third-Party Services", items: ["Infrastructure powered by Supabase, Cloudflare, Vercel & GitHub", "Performance varies with region & network", "Infolio not liable for third-party outages", "CDN & external API delays out of our control"] },
  { icon: Sparkles, title: "Beta / Evolving Platform", items: ["Some features are experimental or in beta", "UI/UX may evolve over time", "Occasional bugs may occur", "Active development on new systems"] },
  { icon: BadgeCheck, title: "Refund Policy", items: ["Monthly plans: refund within 7 days", "Yearly plans: refund within 15 days", "Heavy usage may void refund", "Domain & third-party costs non-refundable", "Abuse voids refund eligibility"] },
  { icon: Lock, title: "Liability Notice", items: ["Not responsible for business or revenue loss", "Not responsible for SEO ranking loss", "Not responsible for deployment / build errors caused by user code", "Not responsible for domain propagation delays"] },
  { icon: Server, title: "Plan-Specific Limits", items: ["Basic: subdomain-only, 500MB / 10GB", "Creator: bring your own domain, 1GB / 50GB", "Developer Pro: you own your code, 5GB / 200GB", "Studio: max 10 projects, no account sharing", "Commerce Pro: you're responsible for products & orders"] },
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
      <Button onClick={onClick} className={`w-full rounded-full mt-5 ${plan.highlight ? "gradient-primary text-white hover:opacity-90 shadow-md shadow-primary/30" : ""}`} variant={plan.highlight ? "default" : "outline"} size="sm">
        {plan.badge === "Upcoming" ? "Notify me" : "Get started"}
      </Button>
    </motion.div>
  );
}
