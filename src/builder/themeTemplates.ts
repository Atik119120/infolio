import { createBlock } from "./blocks/defaults";
import type { Block, PageContent } from "./types";

// Profession-based 12-section full page flow:
// Navbar → Hero → About → Services → Gallery/Projects → Stats → Testimonial → Pricing → FAQ → CTA → Contact → Footer

type TemplateFn = () => { name: string; theme: PageContent["theme"]; blocks: Block[] };

const set = (b: Block, patch: Partial<Block>): Block => ({
  ...b,
  ...patch,
  content: { ...b.content, ...(patch.content || {}) },
  style: { ...b.style, ...(patch.style || {}) },
});

interface Profile {
  brand: string;
  hero: { eyebrow: string; title: string; subtitle: string; cta: string; bg: string; color?: string };
  about: { title: string; body: string; image: string };
  services: { title: string; items: { icon?: string; title: string; body: string }[] };
  gallery: { title: string; images: string[] };
  stats: { items: { value: string; label: string }[] };
  testimonial: { title: string; items: { quote: string; author: string; role?: string; rating?: number }[] };
  pricing: { title: string; plans: { name: string; price: string; period?: string; features: string[]; featured?: boolean }[] };
  faq: { title: string; items: { question: string; answer: string }[] };
  cta: { title: string; body: string; cta: string; bg: string };
  contact: { title: string; body: string; email: string };
  theme: PageContent["theme"];
  accent: string; // hero bg / text accent
  navBg: string;
  navColor: string;
  footerBg: string;
  footerColor: string;
}

const buildPage = (p: Profile): Block[] => [
  // 1. NAVBAR
  set(createBlock("navbar"), {
    content: {
      brand: p.brand,
      layout: "split",
      sticky: true,
      showCta: true,
      links: [
        { label: "About", url: "#about" },
        { label: "Services", url: "#services" },
        { label: "Work", url: "#work" },
        { label: "Pricing", url: "#pricing" },
        { label: "Contact", url: "#contact" },
      ],
      ctaText: "Hire Me",
      ctaLink: "#contact",
    } as any,
    style: { background: p.navBg, color: p.navColor, paddingTop: "18px", paddingBottom: "18px" },
  }),

  // 2. HERO
  set(createBlock("hero"), {
    content: {
      eyebrow: p.hero.eyebrow,
      title: p.hero.title,
      subtitle: p.hero.subtitle,
      ctaText: p.hero.cta,
      ctaLink: "#contact",
    } as any,
    style: {
      background: p.hero.bg,
      color: p.hero.color || "#ffffff",
      textAlign: "center",
      paddingTop: "140px",
      paddingBottom: "140px",
      animation: "fade-up",
    },
  }),

  // 3. ABOUT
  set(createBlock("about"), {
    content: { title: p.about.title, body: p.about.body, imageUrl: p.about.image } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a", animation: "fade-up" },
  }),

  // 4. SERVICES
  set(createBlock("services"), {
    content: { title: p.services.title, items: p.services.items } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#f8fafc", color: "#0f172a", textAlign: "center", animation: "fade-up" },
  }),

  // 5. GALLERY / PROJECTS
  set(createBlock("gallery"), {
    content: { title: p.gallery.title, images: p.gallery.images } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a", textAlign: "center", animation: "fade-up" },
  }),

  // 6. STATS
  set(createBlock("stats"), {
    content: { items: p.stats.items } as any,
    style: { paddingTop: "80px", paddingBottom: "80px", background: p.accent, color: "#ffffff", textAlign: "center" },
  }),

  // 7. TESTIMONIAL
  set(createBlock("testimonial"), {
    content: { title: p.testimonial.title, items: p.testimonial.items } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#0f172a", color: "#ffffff", textAlign: "center", animation: "fade-up" },
  }),

  // 8. PRICING
  set(createBlock("pricing"), {
    content: { title: p.pricing.title, plans: p.pricing.plans } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a", textAlign: "center", animation: "fade-up" },
  }),

  // 9. FAQ
  set(createBlock("faq"), {
    content: { title: p.faq.title, items: p.faq.items } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#f8fafc", color: "#0f172a" },
  }),

  // 10. CTA
  set(createBlock("cta"), {
    content: { title: p.cta.title, body: p.cta.body, ctaText: p.cta.cta, ctaLink: "#contact" } as any,
    style: { paddingTop: "120px", paddingBottom: "120px", background: p.cta.bg, color: "#ffffff", textAlign: "center" },
  }),

  // 11. CONTACT
  set(createBlock("contact"), {
    content: { title: p.contact.title, body: p.contact.body, email: p.contact.email, ctaText: "Send Email" } as any,
    style: { paddingTop: "100px", paddingBottom: "100px", background: "#ffffff", color: "#0f172a", textAlign: "center" },
  }),

  // 12. FOOTER
  set(createBlock("footer"), {
    content: {
      brand: p.brand,
      tagline: p.hero.subtitle,
      columns: [
        { title: "Navigate", linksText: "About|#about\nServices|#services\nWork|#work" },
        { title: "Company", linksText: "Pricing|#pricing\nFAQ|#faq\nContact|#contact" },
        { title: "Contact", linksText: `${p.contact.email}|mailto:${p.contact.email}` },
      ],
      socialLinks: [
        { platform: "twitter", url: "https://twitter.com" },
        { platform: "instagram", url: "https://instagram.com" },
        { platform: "linkedin", url: "https://linkedin.com" },
      ],
      copyright: `© 2026 ${p.brand}. All rights reserved.`,
    } as any,
    style: { paddingTop: "64px", paddingBottom: "32px", background: p.footerBg, color: p.footerColor },
  }),
];

// ============= PROFESSION PROFILES =============

const PROFILES: Record<string, Profile> = {
  freelancer: {
    brand: "Freelance Studio",
    accent: "#dc2626",
    navBg: "#ffffff",
    navColor: "#0f172a",
    footerBg: "#0f172a",
    footerColor: "#e2e8f0",
    theme: { primaryColor: "#dc2626", fontFamily: "Inter, sans-serif", headingFontFamily: "Space Grotesk, sans-serif", background: "#ffffff", buttonRadius: "10px" },
    hero: {
      eyebrow: "AVAILABLE FOR PROJECTS",
      title: "I build brands that ship",
      subtitle: "Independent designer + developer helping founders launch faster.",
      cta: "Start a project",
      bg: "linear-gradient(135deg,#0f172a 0%,#581c87 60%,#dc2626 100%)",
    },
    about: {
      title: "About me",
      body: "I'm a multidisciplinary freelancer with 8+ years building brands, websites and digital products for ambitious teams worldwide.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
    },
    services: {
      title: "What I offer",
      items: [
        { icon: "Palette", title: "Brand Identity", body: "Logos, type systems, visual language that lasts." },
        { icon: "Monitor", title: "Web Design", body: "Conversion-focused websites built for speed." },
        { icon: "Code", title: "Development", body: "Modern React + Next.js builds, fully responsive." },
        { icon: "Zap", title: "Consulting", body: "Strategy sessions for your next big launch." },
      ],
    },
    gallery: {
      title: "Selected work",
      images: [
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
        "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800",
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800",
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800",
      ],
    },
    stats: {
      items: [
        { value: "120+", label: "Projects shipped" },
        { value: "8yrs", label: "Experience" },
        { value: "40+", label: "Happy clients" },
        { value: "99%", label: "On-time delivery" },
      ],
    },
    testimonial: {
      title: "Client love",
      items: [
        { quote: "Best freelancer I've ever worked with. Delivered ahead of schedule.", author: "Sara K.", role: "Founder, Acme", rating: 5 },
        { quote: "Sharp, fast, and incredibly easy to collaborate with.", author: "Daniel R.", role: "CEO, Globex", rating: 5 },
        { quote: "Took our vision and made it 10× better. Hire him.", author: "Maya P.", role: "PM, Initech", rating: 5 },
      ],
    },
    pricing: {
      title: "Simple packages",
      plans: [
        { name: "Starter", price: "$1.5k", period: "/project", features: ["Landing page", "1 round revisions", "1-week delivery"] },
        { name: "Pro", price: "$4k", period: "/project", features: ["5-page website", "Brand mini-kit", "2-week delivery", "Priority support"], featured: true },
        { name: "Elite", price: "$10k+", period: "/project", features: ["Custom build", "Brand system", "4-week delivery", "Ongoing support"] },
      ],
    },
    faq: {
      title: "Common questions",
      items: [
        { question: "How long does a project take?", answer: "Most projects ship in 1–4 weeks depending on scope." },
        { question: "Do you offer revisions?", answer: "Yes — 2 rounds of revisions included in every package." },
        { question: "What's your payment terms?", answer: "50% upfront, 50% on delivery. Stripe or wire." },
        { question: "Do you sign NDAs?", answer: "Absolutely — happy to sign before any discussion." },
      ],
    },
    cta: { title: "Let's build something great", body: "Limited slots available this quarter.", cta: "Book a discovery call", bg: "linear-gradient(135deg,#dc2626 0%,#7c3aed 100%)" },
    contact: { title: "Get in touch", body: "Tell me about your project — I reply within 24h.", email: "hello@freelancer.com" },
  },

};

export const THEME_TEMPLATES: Record<string, TemplateFn> = {
  freelancer: () => ({ name: "Theme 1 Site", theme: PROFILES.freelancer.theme, blocks: buildPage(PROFILES.freelancer) }),
};

export const getThemeTemplate = (themeId: string): { name: string; theme: PageContent["theme"]; blocks: Block[] } => {
  const fn = THEME_TEMPLATES[themeId];
  if (fn) return fn();
  return THEME_TEMPLATES.freelancer();
};
