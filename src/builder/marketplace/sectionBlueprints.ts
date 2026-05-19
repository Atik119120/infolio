import type { Block } from "../types";

const uid = () => crypto.randomUUID();
const mk = (type: string, content: any, style: any = {}, children?: Block[]): Block =>
  ({ id: uid(), type: type as any, content, style, children });

export type Tier = "Free" | "Pro" | "Elite";
export type BlueprintCategory =
  | "Hero"
  | "Features"
  | "Pricing"
  | "Testimonials"
  | "CTA"
  | "Stats"
  | "Ecommerce"
  | "Footer"
  | "Contact";

export interface SectionBlueprint {
  id: string;
  name: string;
  category: BlueprintCategory;
  tier: Tier;
  tags: string[];
  preview: string;
  /** Block to insert. May be one block (or you can extend later to array.) */
  build: () => Block;
}

/* ============================================================
   SECTION BLUEPRINTS — drag-in pre-designed sections
   ============================================================ */
export const SECTION_BLUEPRINTS: SectionBlueprint[] = [
  // ---------- HERO ----------
  {
    id: "hero-gradient",
    name: "Gradient Hero",
    category: "Hero",
    tier: "Free",
    tags: ["landing", "saas"],
    preview: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600",
    build: () =>
      mk(
        "hero",
        {
          eyebrow: "NEW",
          title: "Build something people love",
          subtitle: "A bold gradient hero that converts visitors.",
          ctaText: "Get started",
          ctaLink: "#",
        },
        {
          paddingTop: "120px",
          paddingBottom: "120px",
          background: "linear-gradient(135deg,#6366f1 0%,#ec4899 100%)",
          color: "#ffffff",
          textAlign: "center",
          animation: "fade-up",
        }
      ),
  },
  {
    id: "hero-editorial",
    name: "Editorial Hero",
    category: "Hero",
    tier: "Free",
    tags: ["magazine", "minimal"],
    preview: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600",
    build: () =>
      mk(
        "hero",
        {
          eyebrow: "Issue 24",
          title: "Quiet ideas, loud impact.",
          subtitle: "An editorial hero with refined typography.",
          ctaText: "Read more",
          ctaLink: "#",
        },
        {
          paddingTop: "140px",
          paddingBottom: "140px",
          background: "#fafaf9",
          color: "#0f172a",
          textAlign: "left",
        }
      ),
  },
  {
    id: "hero-dark",
    name: "Dark Glow Hero",
    category: "Hero",
    tier: "Pro",
    tags: ["dark", "tech"],
    preview: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600",
    build: () =>
      mk(
        "hero",
        {
          eyebrow: "v2.0",
          title: "Engineered for speed",
          subtitle: "Dark canvas. Glowing gradients. Maximum focus.",
          ctaText: "Launch app",
          ctaLink: "#",
        },
        {
          paddingTop: "140px",
          paddingBottom: "140px",
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.35) 0%, rgba(2,6,23,0) 60%), #020617",
          color: "#ffffff",
          textAlign: "center",
        }
      ),
  },

  // ---------- FEATURES ----------
  {
    id: "features-3col",
    name: "Three Feature Pillars",
    category: "Features",
    tier: "Free",
    tags: ["services", "saas"],
    preview: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
    build: () =>
      mk(
        "services",
        {
          title: "Built for teams that ship",
          items: [
            { title: "Lightning fast", body: "Sub-100ms across every interaction." },
            { title: "Made to scale", body: "From day 1 to your 10M-th customer." },
            { title: "Plays well", body: "Integrates with 100+ tools out of the box." },
          ],
        },
        {
          paddingTop: "100px",
          paddingBottom: "100px",
          background: "#ffffff",
          color: "#0f172a",
          textAlign: "center",
          animation: "fade-up",
        }
      ),
  },

  // ---------- STATS ----------
  {
    id: "stats-dark",
    name: "Dark Stats Strip",
    category: "Stats",
    tier: "Free",
    tags: ["social proof"],
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    build: () =>
      mk(
        "stats",
        {
          items: [
            { value: "50K+", label: "Active users" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "Rating" },
            { value: "120+", label: "Integrations" },
          ],
        },
        {
          paddingTop: "80px",
          paddingBottom: "80px",
          background: "#0f172a",
          color: "#ffffff",
          textAlign: "center",
        }
      ),
  },

  // ---------- PRICING ----------
  {
    id: "pricing-3plan",
    name: "Three-Plan Pricing",
    category: "Pricing",
    tier: "Free",
    tags: ["saas", "billing"],
    preview: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
    build: () =>
      mk(
        "pricing",
        {
          title: "Simple, transparent pricing",
          plans: [
            { name: "Starter", price: "$0", features: ["3 projects", "Basic support", "Community"] },
            { name: "Pro", price: "$19", features: ["Unlimited", "Priority support", "Advanced analytics"], featured: true },
            { name: "Team", price: "$49", features: ["Everything in Pro", "SSO", "Audit logs"] },
          ],
        },
        {
          paddingTop: "100px",
          paddingBottom: "100px",
          background: "#f8fafc",
          color: "#0f172a",
          textAlign: "center",
          animation: "fade-up",
        }
      ),
  },

  // ---------- TESTIMONIALS ----------
  {
    id: "testimonial-dark",
    name: "Dark Testimonials",
    category: "Testimonials",
    tier: "Free",
    tags: ["social proof"],
    preview: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600",
    build: () =>
      mk(
        "testimonial",
        {
          title: "Loved by makers",
          items: [
            { quote: "We shipped 3x faster after switching.", author: "Sara K., CTO" },
            { quote: "Delightful from start to finish.", author: "Daniel R., Founder" },
            { quote: "Best decision we made this year.", author: "Iris M., Designer" },
          ],
        },
        {
          paddingTop: "100px",
          paddingBottom: "100px",
          background: "#0f172a",
          color: "#ffffff",
          textAlign: "center",
        }
      ),
  },

  // ---------- CTA ----------
  {
    id: "cta-gradient",
    name: "Gradient Call to Action",
    category: "CTA",
    tier: "Free",
    tags: ["conversion"],
    preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600",
    build: () =>
      mk(
        "cta",
        {
          title: "Ready when you are",
          body: "Join thousands shipping faster.",
          ctaText: "Start free",
          ctaLink: "#",
        },
        {
          paddingTop: "100px",
          paddingBottom: "100px",
          background: "linear-gradient(135deg,#6366f1 0%,#ec4899 100%)",
          color: "#ffffff",
          textAlign: "center",
        }
      ),
  },
  {
    id: "cta-newsletter",
    name: "Newsletter Capture",
    category: "CTA",
    tier: "Free",
    tags: ["email", "leads"],
    preview: "https://images.unsplash.com/photo-1526925539332-aa3b66e35444?w=600",
    build: () =>
      mk(
        "form",
        {
          title: "Subscribe for weekly drops",
          fields: [{ label: "Email", type: "email" }],
          submitText: "Subscribe",
        },
        {
          paddingTop: "80px",
          paddingBottom: "80px",
          background: "#0f172a",
          color: "#ffffff",
          textAlign: "center",
        }
      ),
  },

  // ---------- ECOMMERCE ----------
  {
    id: "ec-product-grid",
    name: "Featured Products",
    category: "Ecommerce",
    tier: "Free",
    tags: ["shop", "store"],
    preview: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    build: () =>
      mk(
        "productGrid",
        {
          eyebrow: "Bestsellers",
          title: "Featured this week",
          subtitle: "Hand-picked favourites our customers love.",
          columns: 4,
          accentColor: "#0f172a",
          items: [
            { title: "Minimalist Sneaker", price: "$129", oldPrice: "$159", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", badge: "Sale", rating: 5, inStock: true },
            { title: "Wool Knit Sweater", price: "$89", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600", badge: "New", rating: 4, inStock: true },
            { title: "Leather Watch", price: "$249", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600", rating: 5, inStock: true },
            { title: "Canvas Tote", price: "$39", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", rating: 4, inStock: false },
          ],
        },
        { background: "#fafafa", paddingTop: "80px", paddingBottom: "80px" }
      ),
  },
  {
    id: "ec-category-grid",
    name: "Shop by Category",
    category: "Ecommerce",
    tier: "Free",
    tags: ["shop", "categories"],
    preview: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600",
    build: () =>
      mk(
        "categoryGrid",
        {
          eyebrow: "Browse",
          title: "Shop by category",
          columns: 4,
          items: [
            { name: "Men", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600", count: "120 items" },
            { name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600", count: "240 items" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", count: "85 items" },
            { name: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", count: "60 items" },
          ],
        },
        {}
      ),
  },
  {
    id: "ec-checkout",
    name: "Checkout Section",
    category: "Ecommerce",
    tier: "Pro",
    tags: ["checkout", "cart"],
    preview: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600",
    build: () =>
      mk(
        "checkout",
        {
          title: "Checkout",
          accentColor: "#0f172a",
          currency: "$",
          shippingFee: "5",
          taxRate: 0,
        },
        {}
      ),
  },

  // ---------- CONTACT ----------
  {
    id: "contact-form",
    name: "Contact Form",
    category: "Contact",
    tier: "Free",
    tags: ["contact", "form"],
    preview: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600",
    build: () =>
      mk(
        "contact",
        {
          title: "Get in touch",
          body: "Have a project in mind? Let's talk.",
          email: "hello@example.com",
          ctaText: "Send Email",
        },
        {
          paddingTop: "100px",
          paddingBottom: "100px",
          background: "#f8fafc",
          color: "#0f172a",
          textAlign: "center",
        }
      ),
  },
];

export const BLUEPRINT_CATEGORIES: BlueprintCategory[] = [
  "Hero",
  "Features",
  "Stats",
  "Pricing",
  "Testimonials",
  "CTA",
  "Ecommerce",
  "Contact",
];
