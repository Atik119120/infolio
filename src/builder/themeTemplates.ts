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

  "small-business": {
    brand: "Acme Co.",
    accent: "#0ea5e9",
    navBg: "#ffffff",
    navColor: "#0c4a6e",
    footerBg: "#0c4a6e",
    footerColor: "#e0f2fe",
    theme: { primaryColor: "#0ea5e9", fontFamily: "Inter, sans-serif", background: "#f8fafc", buttonRadius: "8px" },
    hero: {
      eyebrow: "TRUSTED SINCE 2010",
      title: "Local. Trusted. Reliable.",
      subtitle: "Serving our community with premium services for over a decade.",
      cta: "Get a quote",
      bg: "linear-gradient(135deg,#0c4a6e 0%,#0284c7 100%)",
    },
    about: {
      title: "About our business",
      body: "Family-owned and operated since 2010, we pride ourselves on quality work, honest pricing, and customer service that keeps people coming back.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    },
    services: {
      title: "Our services",
      items: [
        { icon: "Wrench", title: "Installation", body: "Professional installation by certified technicians." },
        { icon: "Settings", title: "Maintenance", body: "Regular service plans to keep things running." },
        { icon: "ShieldCheck", title: "Repairs", body: "Quick, affordable repairs with warranty." },
        { icon: "Phone", title: "24/7 Support", body: "Emergency callouts available any time." },
      ],
    },
    gallery: {
      title: "Recent jobs",
      images: [
        "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      ],
    },
    stats: {
      items: [
        { value: "15yrs", label: "In business" },
        { value: "2,500+", label: "Happy customers" },
        { value: "4.9★", label: "Google rating" },
        { value: "24/7", label: "Availability" },
      ],
    },
    testimonial: {
      title: "What our customers say",
      items: [
        { quote: "Showed up on time, fair price, did the job right.", author: "Mark T.", role: "Homeowner", rating: 5 },
        { quote: "Best service in town. Won't go anywhere else.", author: "Lisa W.", role: "Long-time customer", rating: 5 },
      ],
    },
    pricing: {
      title: "Service packages",
      plans: [
        { name: "Basic", price: "$99", period: "/visit", features: ["Inspection", "Basic service", "Written report"] },
        { name: "Standard", price: "$249", period: "/visit", features: ["Full service", "Parts included", "30-day warranty"], featured: true },
        { name: "Premium", price: "$499", period: "/visit", features: ["Complete overhaul", "1-year warranty", "Priority booking"] },
      ],
    },
    faq: {
      title: "FAQs",
      items: [
        { question: "Do you offer free estimates?", answer: "Yes — free, no-obligation estimates for all jobs." },
        { question: "Are you licensed and insured?", answer: "Fully licensed, bonded, and insured." },
        { question: "What areas do you serve?", answer: "Within a 50-mile radius of our location." },
      ],
    },
    cta: { title: "Ready to get started?", body: "Call now or request a quote online.", cta: "Request quote", bg: "linear-gradient(135deg,#0284c7 0%,#0ea5e9 100%)" },
    contact: { title: "Contact us", body: "We're here to help. Call, email, or stop by.", email: "info@acmeco.com" },
  },

  "prd-graphic-designer": {
    brand: "Studio Ink",
    accent: "#ec4899",
    navBg: "#ffffff",
    navColor: "#831843",
    footerBg: "#1f1f1f",
    footerColor: "#fce7f3",
    theme: { primaryColor: "#ec4899", fontFamily: "DM Sans, sans-serif", headingFontFamily: "Playfair Display, serif", background: "#ffffff", buttonRadius: "0px" },
    hero: {
      eyebrow: "GRAPHIC DESIGNER · BANGALORE",
      title: "Visual stories that move.",
      subtitle: "Branding, illustration & art direction for ambitious brands.",
      cta: "View portfolio",
      bg: "linear-gradient(135deg,#831843 0%,#db2777 60%,#f472b6 100%)",
    },
    about: {
      title: "About the studio",
      body: "Studio Ink is an independent design practice. We craft identities, illustrations and editorial work for brands who want to stand out.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    },
    services: {
      title: "Services",
      items: [
        { icon: "PenTool", title: "Brand Identity", body: "Logos, marks, full identity systems." },
        { icon: "Image", title: "Illustration", body: "Custom illustration for editorial & web." },
        { icon: "Layout", title: "Editorial Design", body: "Books, magazines, print collateral." },
        { icon: "Sparkles", title: "Art Direction", body: "Campaign concepts and creative direction." },
      ],
    },
    gallery: {
      title: "Selected projects",
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800",
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800",
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
        "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800",
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
      ],
    },
    stats: {
      items: [
        { value: "200+", label: "Projects" },
        { value: "12", label: "Awwwards" },
        { value: "50+", label: "Brands" },
        { value: "10yrs", label: "Practice" },
      ],
    },
    testimonial: {
      title: "Clients",
      items: [
        { quote: "They took our brand from ordinary to iconic.", author: "Priya M.", role: "Founder, Nova", rating: 5 },
        { quote: "Beautiful, considered work every single time.", author: "Arjun S.", role: "CMO, Hue", rating: 5 },
      ],
    },
    pricing: {
      title: "Engagements",
      plans: [
        { name: "Logo", price: "$2k", features: ["Logo + mark", "2 concepts", "Final files"] },
        { name: "Identity", price: "$8k", features: ["Full identity system", "Brand guidelines", "Stationery"], featured: true },
        { name: "Brand Story", price: "$20k+", features: ["Strategy + identity", "Launch campaign", "Ongoing direction"] },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        { question: "What's your typical timeline?", answer: "Identity projects take 6–8 weeks from kickoff." },
        { question: "Do you work internationally?", answer: "Yes — most of our clients are outside India." },
        { question: "What do I receive?", answer: "All source files, exports, and brand guidelines." },
      ],
    },
    cta: { title: "Let's create something beautiful", body: "Now booking projects for next quarter.", cta: "Start a brief", bg: "linear-gradient(135deg,#db2777 0%,#f472b6 100%)" },
    contact: { title: "Say hello", body: "hello@studioink.com — we reply within 48h.", email: "hello@studioink.com" },
  },

  "prd-photographer": {
    brand: "Lens & Light Studio",
    accent: "#f59e0b",
    navBg: "#fafaf9",
    navColor: "#1c1917",
    footerBg: "#1c1917",
    footerColor: "#fef3c7",
    theme: { primaryColor: "#f59e0b", fontFamily: "Georgia, serif", headingFontFamily: "Playfair Display, serif", background: "#fafaf9", buttonRadius: "0px" },
    hero: {
      eyebrow: "PHOTOGRAPHER · WORLDWIDE",
      title: "Capturing moments, crafting memories.",
      subtitle: "Editorial, wedding & lifestyle photography.",
      cta: "Book a session",
      bg: "linear-gradient(135deg,#1c1917 0%,#44403c 60%,#78350f 100%)",
    },
    about: {
      title: "About the lens",
      body: "Award-winning photographer with 10+ years documenting weddings, editorials and brands across 30 countries. Available worldwide.",
      image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800",
    },
    services: {
      title: "Photography services",
      items: [
        { icon: "Heart", title: "Weddings", body: "Full-day coverage, candid and editorial." },
        { icon: "Camera", title: "Editorial", body: "Magazine, brand, and lookbook shoots." },
        { icon: "User", title: "Portraits", body: "Studio and on-location portraits." },
        { icon: "Map", title: "Destination", body: "Travel-ready, worldwide bookings." },
      ],
    },
    gallery: {
      title: "Portfolio",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800",
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800",
      ],
    },
    stats: {
      items: [
        { value: "300+", label: "Weddings shot" },
        { value: "30", label: "Countries" },
        { value: "10yrs", label: "Experience" },
        { value: "5★", label: "Avg rating" },
      ],
    },
    testimonial: {
      title: "Couples & clients",
      items: [
        { quote: "Our wedding photos are pure magic. Thank you.", author: "Aisha & Rohan", role: "Wedding", rating: 5 },
        { quote: "Captured our brand exactly as we imagined.", author: "Studio Nova", role: "Editorial", rating: 5 },
      ],
    },
    pricing: {
      title: "Packages",
      plans: [
        { name: "Half-day", price: "$1.5k", features: ["4 hours coverage", "50 edited photos", "Online gallery"] },
        { name: "Full-day", price: "$3.5k", features: ["8 hours coverage", "200 edited photos", "Print release"], featured: true },
        { name: "Destination", price: "$6k+", features: ["Multi-day", "Travel included", "Full gallery + film"] },
      ],
    },
    faq: {
      title: "Questions",
      items: [
        { question: "How soon do I get photos?", answer: "Sneak peeks in 48h, full gallery in 4–6 weeks." },
        { question: "Do you travel?", answer: "Yes — worldwide, travel quoted separately." },
        { question: "Print rights included?", answer: "Yes, full personal print rights with every package." },
      ],
    },
    cta: { title: "Book your date", body: "Limited dates available each season.", cta: "Check availability", bg: "linear-gradient(135deg,#78350f 0%,#f59e0b 100%)" },
    contact: { title: "Book a session", body: "Tell me about your day — let's create something timeless.", email: "studio@lensandlight.com" },
  },

  "prd-digital-marketer": {
    brand: "Growth Lab",
    accent: "#3b82f6",
    navBg: "#ffffff",
    navColor: "#1e3a8a",
    footerBg: "#0f172a",
    footerColor: "#dbeafe",
    theme: { primaryColor: "#3b82f6", fontFamily: "Inter, sans-serif", headingFontFamily: "Space Grotesk, sans-serif", background: "#ffffff", buttonRadius: "10px" },
    hero: {
      eyebrow: "PERFORMANCE MARKETING",
      title: "Marketing that actually scales.",
      subtitle: "Data-driven growth strategies for ambitious teams.",
      cta: "Get a free audit",
      bg: "linear-gradient(135deg,#1e3a8a 0%,#3b82f6 60%,#06b6d4 100%)",
    },
    about: {
      title: "About Growth Lab",
      body: "We're a performance marketing agency that's driven over $200M in revenue for 100+ DTC brands and SaaS companies worldwide.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    },
    services: {
      title: "Growth services",
      items: [
        { icon: "Target", title: "Paid Ads", body: "Google, Meta, TikTok — full-funnel campaigns." },
        { icon: "Mail", title: "Email & Lifecycle", body: "Klaviyo flows that convert and retain." },
        { icon: "Search", title: "SEO", body: "Technical + content SEO that ranks." },
        { icon: "TrendingUp", title: "CRO", body: "Landing page tests + funnel optimization." },
      ],
    },
    gallery: {
      title: "Case studies",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800",
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
      ],
    },
    stats: {
      items: [
        { value: "$200M", label: "Revenue driven" },
        { value: "100+", label: "Brands scaled" },
        { value: "5.2x", label: "Avg ROAS" },
        { value: "6yrs", label: "Track record" },
      ],
    },
    testimonial: {
      title: "Results that speak",
      items: [
        { quote: "Doubled our MRR in 6 months. Unreal results.", author: "Tom B.", role: "CEO, SaaS Co.", rating: 5 },
        { quote: "Best agency we've worked with. Period.", author: "Nina K.", role: "VP Marketing, DTC", rating: 5 },
      ],
    },
    pricing: {
      title: "Retainers",
      plans: [
        { name: "Starter", price: "$3k", period: "/mo", features: ["1 channel", "Weekly reports", "Email support"] },
        { name: "Growth", price: "$8k", period: "/mo", features: ["Multi-channel", "CRO + creative", "Slack channel"], featured: true },
        { name: "Scale", price: "$20k+", period: "/mo", features: ["Full-funnel", "Dedicated team", "Strategy sessions"] },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        { question: "How fast will I see results?", answer: "Initial results in 30 days, compounding from there." },
        { question: "What's the minimum ad spend?", answer: "We recommend $10k/mo ad spend minimum for ROAS." },
        { question: "Do you require long contracts?", answer: "Month-to-month after a 3-month initial term." },
      ],
    },
    cta: { title: "Ready to scale?", body: "Book a free 30-minute growth audit.", cta: "Book free audit", bg: "linear-gradient(135deg,#1e40af 0%,#3b82f6 100%)" },
    contact: { title: "Let's talk growth", body: "Reply within 12 business hours.", email: "growth@growthlab.com" },
  },

  biography: {
    brand: "Your Name",
    accent: "#7c3aed",
    navBg: "#ffffff",
    navColor: "#1e1b4b",
    footerBg: "#1e1b4b",
    footerColor: "#ede9fe",
    theme: { primaryColor: "#7c3aed", fontFamily: "Georgia, serif", headingFontFamily: "Playfair Display, serif", background: "#ffffff", buttonRadius: "9999px" },
    hero: {
      eyebrow: "HELLO, I'M",
      title: "Your Name",
      subtitle: "Writer · Speaker · Storyteller",
      cta: "Read my story",
      bg: "linear-gradient(135deg,#1e1b4b 0%,#7c3aed 60%,#a78bfa 100%)",
    },
    about: {
      title: "My story",
      body: "I've spent the last decade writing about ideas, people and the future. Author of two books, contributor to many more. Currently based in Lisbon.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    },
    services: {
      title: "What I do",
      items: [
        { icon: "BookOpen", title: "Writing", body: "Books, essays, longform journalism." },
        { icon: "Mic", title: "Speaking", body: "Keynotes, conferences, podcasts." },
        { icon: "Users", title: "Workshops", body: "Storytelling workshops for teams." },
      ],
    },
    gallery: {
      title: "Featured work",
      images: [
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",
      ],
    },
    stats: {
      items: [
        { value: "2", label: "Books published" },
        { value: "100+", label: "Talks given" },
        { value: "10yrs", label: "Writing" },
        { value: "50k", label: "Newsletter readers" },
      ],
    },
    testimonial: {
      title: "Praise",
      items: [
        { quote: "A storyteller of rare wisdom and warmth.", author: "The Times", role: "Book review", rating: 5 },
        { quote: "One of the most thoughtful voices today.", author: "Atlantic Monthly", rating: 5 },
      ],
    },
    pricing: {
      title: "Engagements",
      plans: [
        { name: "Podcast", price: "Free", features: ["30-min interview", "Audio + transcript"] },
        { name: "Keynote", price: "$5k", features: ["45-min keynote", "Q&A", "Custom topic"], featured: true },
        { name: "Workshop", price: "$10k", features: ["Half-day in-person", "Workbook included", "Follow-up call"] },
      ],
    },
    faq: {
      title: "Common questions",
      items: [
        { question: "Are you accepting interview requests?", answer: "Yes — please email with details and audience size." },
        { question: "Do you write for outlets?", answer: "Selectively. Pitch via the form below." },
      ],
    },
    cta: { title: "Let's connect", body: "For talks, interviews, or collaborations.", cta: "Get in touch", bg: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)" },
    contact: { title: "Say hello", body: "Replies within a week — usually faster.", email: "hello@yourname.com" },
  },
};

export const THEME_TEMPLATES: Record<string, TemplateFn> = {
  freelancer: () => ({ name: "Freelancer Site", theme: PROFILES.freelancer.theme, blocks: buildPage(PROFILES.freelancer) }),
  "small-business": () => ({ name: "Small Business Site", theme: PROFILES["small-business"].theme, blocks: buildPage(PROFILES["small-business"]) }),
  "prd-graphic-designer": () => ({ name: "Graphic Designer Site", theme: PROFILES["prd-graphic-designer"].theme, blocks: buildPage(PROFILES["prd-graphic-designer"]) }),
  "prd-photographer": () => ({ name: "Photographer Site", theme: PROFILES["prd-photographer"].theme, blocks: buildPage(PROFILES["prd-photographer"]) }),
  "prd-digital-marketer": () => ({ name: "Marketer Site", theme: PROFILES["prd-digital-marketer"].theme, blocks: buildPage(PROFILES["prd-digital-marketer"]) }),
  biography: () => ({ name: "Personal Bio", theme: PROFILES.biography.theme, blocks: buildPage(PROFILES.biography) }),
  "custom-code": () => ({
    name: "Custom HTML Page",
    theme: { primaryColor: "#dc2626", fontFamily: "Inter, sans-serif", background: "#ffffff" },
    blocks: [createBlock("customCode")],
  }),
};

export const getThemeTemplate = (themeId: string): { name: string; theme: PageContent["theme"]; blocks: Block[] } => {
  const fn = THEME_TEMPLATES[themeId];
  if (fn) return fn();
  return THEME_TEMPLATES.freelancer();
};
