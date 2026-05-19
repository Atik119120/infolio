import type { Block, PageContent } from "./types";

const uid = () => crypto.randomUUID();
const mk = (type: string, content: any, style: any = {}, children?: Block[]): Block =>
  ({ id: uid(), type: type as any, content, style, children });

// ============= TEMPLATE: SaaS Landing =============
const saasLanding: PageContent = {
  theme: {
    primaryColor: "#6366f1",
    background: "#ffffff",
    fontFamily: "Inter, sans-serif",
    headingFontFamily: "Space Grotesk, sans-serif",
    buttonRadius: "12px",
  },
  blocks: [
    mk("navbar", {
      brand: "Stackly",
      links: [
        { label: "Features", url: "#features" },
        { label: "Pricing", url: "#pricing" },
        { label: "Docs", url: "#" },
      ],
      ctaText: "Sign up free", ctaLink: "#",
    }, { background: "#ffffff", color: "#0f172a", paddingTop: "20px", paddingBottom: "20px" }),
    mk("hero", {
      eyebrow: "NEW · Workflow automation",
      title: "Ship work that moves the needle",
      subtitle: "One workspace for docs, tasks and goals — built for fast teams.",
      ctaText: "Start free trial", ctaLink: "#",
    }, {
      paddingTop: "120px", paddingBottom: "120px",
      background: "linear-gradient(135deg,#eef2ff 0%,#ffffff 60%,#fdf2f8 100%)",
      color: "#0f172a", textAlign: "center", animation: "fade-up",
    }),
    mk("logos", {
      title: "Trusted by teams at",
      logos: ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark"],
    }, { paddingTop: "48px", paddingBottom: "48px", background: "#f8fafc", color: "#64748b", textAlign: "center" }),
    mk("services", {
      title: "Everything you need",
      items: [
        { title: "Lightning fast", body: "Sub-100ms interactions everywhere." },
        { title: "Team-ready", body: "Built for collaboration from day one." },
        { title: "Enterprise grade", body: "SSO, audit logs, SOC2 compliant." },
      ],
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a", textAlign: "center", animation: "fade-up" }),
    mk("stats", {
      items: [
        { value: "50K+", label: "Active users" },
        { value: "99.9%", label: "Uptime" },
        { value: "4.9★", label: "Rating" },
        { value: "120+", label: "Integrations" },
      ],
    }, { paddingTop: "80px", paddingBottom: "80px", background: "#0f172a", color: "#ffffff", textAlign: "center" }),
    mk("pricing", {
      title: "Simple, transparent pricing",
      plans: [
        { name: "Starter", price: "$0", features: ["3 projects", "Basic support", "Community"] },
        { name: "Pro", price: "$19", features: ["Unlimited", "Priority support", "Advanced analytics"], featured: true },
        { name: "Team", price: "$49", features: ["Everything in Pro", "SSO", "Audit logs"] },
      ],
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#f8fafc", color: "#0f172a", textAlign: "center", animation: "fade-up" }),
    mk("faq", {
      title: "Frequently asked",
      items: [
        { question: "Can I cancel anytime?", answer: "Yes, cancel from your dashboard, no questions asked." },
        { question: "Do you offer discounts?", answer: "We offer 20% off annual plans and student discounts." },
        { question: "Is there a free trial?", answer: "Yes — 14 days, full access, no credit card." },
      ],
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a" }),
    mk("cta", {
      title: "Ready when you are",
      body: "Join thousands shipping faster with Stackly.",
      ctaText: "Start free", ctaLink: "#",
    }, {
      paddingTop: "100px", paddingBottom: "100px",
      background: "linear-gradient(135deg,#6366f1 0%,#ec4899 100%)",
      color: "#ffffff", textAlign: "center",
    }),
    mk("footer", {
      text: "© 2026 Stackly. All rights reserved.",
      links: [{ label: "Privacy", url: "#" }, { label: "Terms", url: "#" }],
    }, { paddingTop: "32px", paddingBottom: "32px", background: "#0f172a", color: "#ffffff", textAlign: "center" }),
  ],
};

// ============= TEMPLATE: Portfolio =============
const portfolio: PageContent = {
  theme: {
    primaryColor: "#0f172a",
    background: "#fafaf9",
    fontFamily: "DM Sans, sans-serif",
    headingFontFamily: "Playfair Display, serif",
    buttonRadius: "0px",
  },
  blocks: [
    mk("hero", {
      eyebrow: "Designer · Bangalore",
      title: "I craft thoughtful brand experiences",
      subtitle: "Selected work for ambitious founders & teams.",
      ctaText: "See projects", ctaLink: "#work",
    }, { paddingTop: "140px", paddingBottom: "140px", background: "#fafaf9", color: "#0f172a", textAlign: "left", animation: "fade-up" }),
    mk("gallery", {
      title: "Selected work",
      images: [
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
        "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800",
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800",
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800",
      ],
    }, { paddingTop: "80px", paddingBottom: "80px", background: "#ffffff", color: "#0f172a", animation: "fade-up" }),
    mk("about", {
      title: "About",
      body: "I'm a multidisciplinary designer with 8+ years building brands and digital products people remember.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#fafaf9", color: "#0f172a" }),
    mk("contact", {
      title: "Let's talk",
      body: "Open for select projects in 2026.",
      email: "hello@example.com", ctaText: "Email me",
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#0f172a", color: "#ffffff", textAlign: "center" }),
  ],
};

// ============= TEMPLATE: Agency =============
const agency: PageContent = {
  theme: {
    primaryColor: "#dc2626",
    background: "#0a0a0a",
    textColor: "#fafafa",
    fontFamily: "Inter, sans-serif",
    headingFontFamily: "Space Grotesk, sans-serif",
  },
  blocks: [
    mk("navbar", {
      brand: "NORTH/STAR",
      links: [{ label: "Work", url: "#" }, { label: "Studio", url: "#" }, { label: "Contact", url: "#" }],
      ctaText: "Brief us", ctaLink: "#",
    }, { background: "#0a0a0a", color: "#fafafa", paddingTop: "20px", paddingBottom: "20px" }),
    mk("hero", {
      title: "We build brands that matter.",
      subtitle: "A creative studio for ambitious founders.",
      ctaText: "View case studies", ctaLink: "#",
    }, {
      paddingTop: "160px", paddingBottom: "160px",
      background: "radial-gradient(circle at 30% 30%, #1f1f1f 0%, #0a0a0a 60%)",
      color: "#ffffff", textAlign: "left", animation: "fade-up",
    }),
    mk("stats", {
      items: [
        { value: "12yrs", label: "In the game" },
        { value: "80+", label: "Brands launched" },
        { value: "5", label: "Awwwards" },
      ],
    }, { paddingTop: "60px", paddingBottom: "60px", background: "#0a0a0a", color: "#fafafa", textAlign: "center" }),
    mk("services", {
      title: "What we do",
      items: [
        { title: "Brand strategy", body: "Positioning, story, voice." },
        { title: "Identity systems", body: "Logos, type, motion." },
        { title: "Digital products", body: "Sites, apps, experiences." },
      ],
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#0a0a0a", color: "#fafafa", textAlign: "left", animation: "fade-up" }),
    mk("cta", {
      title: "Let's make something.",
      body: "We take on 6 projects a year. Yours?",
      ctaText: "Start a brief", ctaLink: "#",
    }, { paddingTop: "120px", paddingBottom: "120px", background: "#dc2626", color: "#ffffff", textAlign: "center" }),
    mk("footer", {
      text: "© NORTH/STAR Studio",
      links: [{ label: "Instagram", url: "#" }, { label: "Email", url: "#" }],
    }, { paddingTop: "32px", paddingBottom: "32px", background: "#0a0a0a", color: "#9ca3af", textAlign: "center" }),
  ],
};

// ============= TEMPLATE: Event / Launch =============
const event: PageContent = {
  theme: {
    primaryColor: "#f59e0b",
    background: "#0c0a09",
    fontFamily: "Inter, sans-serif",
    buttonRadius: "9999px",
  },
  blocks: [
    mk("hero", {
      eyebrow: "Oct 12 · San Francisco",
      title: "DesignConf 2026",
      subtitle: "Three days, 40 speakers, one community.",
      ctaText: "Get tickets", ctaLink: "#",
    }, {
      paddingTop: "120px", paddingBottom: "60px",
      background: "linear-gradient(135deg,#0c0a09 0%,#451a03 100%)",
      color: "#fef3c7", textAlign: "center", animation: "fade-up",
    }),
    mk("countdown", {
      target: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      label: "Doors open in",
    }, { paddingTop: "20px", paddingBottom: "80px", background: "#0c0a09", color: "#fef3c7", textAlign: "center" }),
    mk("team", {
      title: "Speakers",
      members: [
        { name: "Maya Chen", role: "Figma", image: "https://i.pravatar.cc/200?img=5" },
        { name: "Leo Park", role: "Stripe", image: "https://i.pravatar.cc/200?img=14" },
        { name: "Iris Mehra", role: "Linear", image: "https://i.pravatar.cc/200?img=44" },
      ],
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#fafaf9", color: "#0f172a", textAlign: "center" }),
    mk("pricing", {
      title: "Tickets",
      plans: [
        { name: "Standard", price: "$299", features: ["All talks", "Lunch included"] },
        { name: "Pro", price: "$599", features: ["All talks", "Workshops", "After-party"], featured: true },
        { name: "Team (5)", price: "$1,999", features: ["Pro × 5", "Reserved seating"] },
      ],
    }, { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a", textAlign: "center" }),
  ],
};

// ============= TEMPLATE: Blank =============
const blank: PageContent = { theme: {}, blocks: [] };

export interface TemplateDef {
  id: string;
  name: string;
  category: "Landing" | "Portfolio" | "Agency" | "Event" | "Blank";
  preview: string;
  content: PageContent;
}

export const TEMPLATES: TemplateDef[] = [
  { id: "blank",     name: "Blank",          category: "Blank",     preview: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", content: blank },
  { id: "saas",      name: "SaaS Landing",   category: "Landing",   preview: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600", content: saasLanding },
  { id: "portfolio", name: "Designer Portfolio", category: "Portfolio", preview: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600", content: portfolio },
  { id: "agency",    name: "Creative Agency",category: "Agency",    preview: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600", content: agency },
  { id: "event",     name: "Event / Launch", category: "Event",     preview: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600", content: event },
];

// Reassign fresh IDs across the entire tree so template applies cleanly.
const reassign = (b: Block): Block => ({
  ...b,
  id: crypto.randomUUID(),
  children: b.children?.map(reassign),
});

export const cloneTemplate = (t: TemplateDef): PageContent => ({
  theme: { ...(t.content.theme || {}) },
  blocks: t.content.blocks.map(reassign),
});
