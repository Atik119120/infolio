import type { Block, BlockType } from "../types";

export interface BlockDef {
  type: BlockType;
  label: string;
  category: "section" | "element" | "layout";
  icon: string;
  create: () => Omit<Block, "id">;
  preset?: string; // custom preset key (e.g. cols-2)
}

const containerBase = {
  display: "flex" as const,
  flexDirection: "row" as const,
  gap: "16px",
  paddingTop: "24px",
  paddingBottom: "24px",
  paddingLeft: "24px",
  paddingRight: "24px",
  alignItems: "stretch" as const,
  justifyContent: "flex-start" as const,
  minHeight: "80px",
};

const makeChildCol = (text: string): any => ({
  id: crypto.randomUUID(),
  type: "container",
  content: {},
  style: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "16px",
    paddingRight: "16px",
    background: "rgba(0,0,0,0.02)",
    borderRadius: "8px",
    minHeight: "120px",
    width: "100%",
  },
  children: [
    {
      id: crypto.randomUUID(),
      type: "heading",
      content: { text, level: "h3" },
      style: { fontSize: "20px", fontWeight: "600", color: "#0f172a" },
    },
    {
      id: crypto.randomUUID(),
      type: "paragraph",
      content: { text: "Add content here." },
      style: { fontSize: "14px", color: "#475569" },
    },
  ],
});


export const BLOCK_DEFS: BlockDef[] = [
  {
    type: "navbar",
    label: "Navbar",
    category: "section",
    icon: "Menu",
    create: () => ({
      type: "navbar",
      content: {
        logoUrl: "",
        brand: "Brand",
        layout: "split",
        sticky: false,
        transparent: false,
        showCta: true,
        links: [
          { label: "Home", url: "#" },
          { label: "About", url: "#about" },
          { label: "Services", url: "#services" },
          { label: "Contact", url: "#contact" },
        ],
        ctaText: "Get Started",
        ctaLink: "#",
      },
      style: { background: "#ffffff", color: "#0f172a", paddingTop: "16px", paddingBottom: "16px" },
    }),
  },
  {
    type: "hero",
    label: "Hero",
    category: "section",
    icon: "Sparkles",
    create: () => ({
      type: "hero",
      content: {
        eyebrow: "Welcome",
        title: "Build something amazing",
        subtitle: "Drag, drop, edit — your site, your way.",
        ctaText: "Get Started",
        ctaLink: "#",
        imageUrl: "",
      },
      style: {
        paddingTop: "96px",
        paddingBottom: "96px",
        background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)",
        color: "#ffffff",
        textAlign: "center",
      },
    }),
  },
  {
    type: "about",
    label: "About",
    category: "section",
    icon: "User",
    create: () => ({
      type: "about",
      content: {
        title: "",
        body: "Tell your story here. Share your journey, mission and what makes you unique.",
        imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#ffffff", color: "#0f172a" },
    }),
  },
  {
    type: "services",
    label: "Services",
    category: "section",
    icon: "Wrench",
    create: () => ({
      type: "services",
      content: {
        title: "",
        items: [
          { title: "Strategy", body: "Plan, research, position." },
          { title: "Design", body: "Interfaces that delight." },
          { title: "Build", body: "Modern, fast, reliable." },
        ],
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#f8fafc", color: "#0f172a", textAlign: "center" },
    }),
  },
  {
    type: "pricing",
    label: "Pricing",
    category: "section",
    icon: "Tags",
    create: () => ({
      type: "pricing",
      content: {
        title: "",
        plans: [
          { name: "Starter", price: "$0", features: ["1 site", "Basic blocks", "Community"] },
          { name: "Pro", price: "$19", features: ["10 sites", "All blocks", "Priority support"], featured: true },
          { name: "Elite", price: "$49", features: ["Unlimited", "Custom code", "Concierge"] },
        ],
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#ffffff", color: "#0f172a", textAlign: "center" },
    }),
  },
  {
    type: "testimonial",
    label: "Testimonial",
    category: "section",
    icon: "Quote",
    create: () => ({
      type: "testimonial",
      content: {
        title: "",
        items: [
          { quote: "Working with them was a dream.", author: "Sara K." },
          { quote: "Delivered beyond expectations.", author: "Daniel R." },
        ],
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#0f172a", color: "#ffffff", textAlign: "center" },
    }),
  },
  {
    type: "gallery",
    label: "Gallery",
    category: "section",
    icon: "Images",
    create: () => ({
      type: "gallery",
      content: {
        title: "",
        images: [
          "https://images.unsplash.com/photo-1503264116251-35a269479413?w=600",
          "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
        ],
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#ffffff", color: "#0f172a", textAlign: "center" },
    }),
  },
  {
    type: "contact",
    label: "Contact",
    category: "section",
    icon: "Mail",
    create: () => ({
      type: "contact",
      content: {
        title: "Get in touch",
        body: "Have a project in mind? Let's talk.",
        email: "hello@example.com",
        ctaText: "Send Email",
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#f8fafc", color: "#0f172a", textAlign: "center" },
    }),
  },
  {
    type: "footer",
    label: "Footer",
    category: "section",
    icon: "PanelBottom",
    create: () => ({
      type: "footer",
      content: { text: "© 2026 Brand. All rights reserved.", links: [{ label: "Privacy", url: "#" }, { label: "Terms", url: "#" }] },
      style: { paddingTop: "32px", paddingBottom: "32px", background: "#0f172a", color: "#ffffff", textAlign: "center" },
    }),
  },
  {
    type: "section",
    label: "Plain Section",
    category: "section",
    icon: "LayoutTemplate",
    create: () => ({
      type: "section",
      content: { title: "Section Title", body: "Section description here." },
      style: { paddingTop: "64px", paddingBottom: "64px", background: "#ffffff", color: "#0f172a", textAlign: "center" },
    }),
  },
  {
    type: "heading",
    label: "Heading",
    category: "element",
    icon: "Heading1",
    create: () => ({
      type: "heading",
      content: { text: "Your Heading", level: "h2" },
      style: { fontSize: "36px", fontWeight: "700", color: "#0f172a", textAlign: "left", paddingTop: "16px", paddingBottom: "16px" },
    }),
  },
  {
    type: "paragraph",
    label: "Paragraph",
    category: "element",
    icon: "Type",
    create: () => ({
      type: "paragraph",
      content: { text: "Add your text here. Click to edit." },
      style: { fontSize: "16px", color: "#475569", textAlign: "left", paddingTop: "8px", paddingBottom: "8px" },
    }),
  },
  {
    type: "button",
    label: "Button",
    category: "element",
    icon: "MousePointerClick",
    create: () => ({
      type: "button",
      content: { text: "Click me", link: "#" },
      style: {
        background: "#dc2626", color: "#ffffff",
        paddingTop: "12px", paddingBottom: "12px", paddingLeft: "24px", paddingRight: "24px",
        borderRadius: "9999px", fontWeight: "600", textAlign: "center",
      },
    }),
  },
  {
    type: "image",
    label: "Image",
    category: "element",
    icon: "Image",
    create: () => ({
      type: "image",
      content: { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200", alt: "Image" },
      style: { borderRadius: "12px", maxWidth: "100%" },
    }),
  },
  {
    type: "video",
    label: "Video",
    category: "element",
    icon: "Video",
    create: () => ({
      type: "video",
      content: { src: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      style: { borderRadius: "12px", maxWidth: "100%" },
    }),
  },
  {
    type: "form",
    label: "Form",
    category: "element",
    icon: "FormInput",
    create: () => ({
      type: "form",
      content: {
        title: "Contact form",
        fields: [
          { label: "Name", type: "text" },
          { label: "Email", type: "email" },
          { label: "Message", type: "textarea" },
        ],
        submitText: "Send",
      },
      style: { paddingTop: "24px", paddingBottom: "24px", background: "#ffffff", color: "#0f172a" },
    }),
  },
  {
    type: "divider",
    label: "Divider",
    category: "element",
    icon: "Minus",
    create: () => ({
      type: "divider",
      content: {},
      style: { borderWidth: "1px", borderColor: "#e2e8f0", marginTop: "16px", marginBottom: "16px" },
    }),
  },
  {
    type: "spacer",
    label: "Spacer",
    category: "element",
    icon: "Move",
    create: () => ({ type: "spacer", content: { height: "48px" }, style: {} }),
  },
  {
    type: "social",
    label: "Social",
    category: "element",
    icon: "Share2",
    create: () => ({
      type: "social",
      content: {
        links: [
          { platform: "twitter", url: "https://twitter.com" },
          { platform: "github", url: "https://github.com" },
          { platform: "linkedin", url: "https://linkedin.com" },
        ],
      },
      style: { textAlign: "center", paddingTop: "16px", paddingBottom: "16px" },
    }),
  },
  {
    type: "customCode",
    label: "Custom Code",
    category: "element",
    icon: "Code2",
    create: () => ({
      type: "customCode",
      content: { html: "<div style='padding:32px;text-align:center;border:1px dashed #cbd5e1'>Your custom HTML here</div>" },
      style: {},
    }),
  },
  // ===== ADVANCED WIDGETS =====
  {
    type: "accordion",
    label: "Accordion",
    category: "element",
    icon: "ChevronsUpDown",
    create: () => ({
      type: "accordion",
      content: {
        items: [
          { title: "What is Infolio?", body: "A modern visual website builder." },
          { title: "Is there a free plan?", body: "Yes — the Starter plan is free forever." },
          { title: "Can I export my site?", body: "Yes, you can publish or export at any time." },
        ],
      },
      style: { paddingTop: "24px", paddingBottom: "24px", color: "#0f172a" },
    }),
  },
  {
    type: "tabs",
    label: "Tabs",
    category: "element",
    icon: "LayoutPanelTop",
    create: () => ({
      type: "tabs",
      content: {
        items: [
          { title: "Overview", body: "An overview of your product or service." },
          { title: "Features", body: "All the powerful features you offer." },
          { title: "", body: "Transparent pricing for everyone." },
        ],
      },
      style: { paddingTop: "24px", paddingBottom: "24px", color: "#0f172a" },
    }),
  },
  {
    type: "alert",
    label: "Alert",
    category: "element",
    icon: "AlertCircle",
    create: () => ({
      type: "alert",
      content: { title: "Heads up!", body: "This is an important message for your visitors.", variant: "info" },
      style: { paddingTop: "16px", paddingBottom: "16px", borderRadius: "12px" },
    }),
  },
  {
    type: "iconBox",
    label: "Icon Box",
    category: "element",
    icon: "Box",
    create: () => ({
      type: "iconBox",
      content: { icon: "Sparkles", title: "Feature title", body: "Short description of this feature." },
      style: { paddingTop: "24px", paddingBottom: "24px", textAlign: "center", color: "#0f172a" },
    }),
  },
  {
    type: "counter",
    label: "Counter",
    category: "element",
    icon: "Hash",
    create: () => ({
      type: "counter",
      content: { value: 1200, suffix: "+", label: "Happy customers" },
      style: { paddingTop: "24px", paddingBottom: "24px", textAlign: "center", color: "#0f172a" },
    }),
  },
  {
    type: "progress",
    label: "Progress",
    category: "element",
    icon: "BarChart3",
    create: () => ({
      type: "progress",
      content: { label: "Design", value: 80 },
      style: { paddingTop: "12px", paddingBottom: "12px", color: "#0f172a" },
    }),
  },
  {
    type: "stats",
    label: "Stats",
    category: "section",
    icon: "TrendingUp",
    create: () => ({
      type: "stats",
      content: {
        items: [
          { value: "10K+", label: "Users" },
          { value: "99%", label: "Uptime" },
          { value: "24/7", label: "Support" },
          { value: "150+", label: "Countries" },
        ],
      },
      style: { paddingTop: "64px", paddingBottom: "64px", background: "#0f172a", color: "#ffffff", textAlign: "center" },
    }),
  },
  {
    type: "faq",
    label: "FAQ",
    category: "section",
    icon: "HelpCircle",
    create: () => ({
      type: "faq",
      content: {
        title: "",
        items: [
          { question: "How do I get started?", answer: "Sign up and start building right away." },
          { question: "Can I cancel anytime?", answer: "Yes, cancel anytime — no questions asked." },
          { question: "Do you offer refunds?", answer: "We offer a 14-day money-back guarantee." },
        ],
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#ffffff", color: "#0f172a" },
    }),
  },
  {
    type: "cta",
    label: "CTA",
    category: "section",
    icon: "Megaphone",
    create: () => ({
      type: "cta",
      content: {
        title: "Ready to get started?",
        body: "Join thousands building beautiful sites with Infolio.",
        ctaText: "Start free",
        ctaLink: "#",
      },
      style: {
        paddingTop: "80px", paddingBottom: "80px",
        background: "linear-gradient(135deg,#dc2626 0%,#7c3aed 100%)",
        color: "#ffffff", textAlign: "center",
      },
    }),
  },
  {
    type: "team",
    label: "Team",
    category: "section",
    icon: "Users",
    create: () => ({
      type: "team",
      content: {
        title: "",
        members: [
          { name: "Alex Park", role: "Founder", image: "https://i.pravatar.cc/200?img=12" },
          { name: "Riya Sen", role: "Designer", image: "https://i.pravatar.cc/200?img=47" },
          { name: "Jon Lee", role: "Engineer", image: "https://i.pravatar.cc/200?img=33" },
        ],
      },
      style: { paddingTop: "80px", paddingBottom: "80px", background: "#ffffff", color: "#0f172a", textAlign: "center" },
    }),
  },
  {
    type: "logos",
    label: "Logos",
    category: "section",
    icon: "Building2",
    create: () => ({
      type: "logos",
      content: {
        title: "Trusted by teams worldwide",
        logos: ["Acme", "Globex", "Soylent", "Initech", "Umbrella", "Hooli"],
      },
      style: { paddingTop: "48px", paddingBottom: "48px", background: "#f8fafc", color: "#475569", textAlign: "center" },
    }),
  },
  {
    type: "countdown",
    label: "Countdown",
    category: "element",
    icon: "Timer",
    create: () => ({
      type: "countdown",
      content: { target: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), label: "Launching in" },
      style: { paddingTop: "32px", paddingBottom: "32px", textAlign: "center", color: "#0f172a" },
    }),
  },
  {
    type: "carousel",
    label: "Carousel",
    category: "element",
    icon: "GalleryHorizontal",
    create: () => ({
      type: "carousel",
      content: {
        images: [
          "https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
        ],
      },
      style: { paddingTop: "24px", paddingBottom: "24px", borderRadius: "16px" },
    }),
  },
  {
    type: "container",
    label: "Container",
    category: "layout",
    icon: "Square",
    preset: "container",
    create: () => ({
      type: "container",
      content: {},
      style: { ...containerBase, flexDirection: "column", minHeight: "120px" },
      children: [],
    }),
  },
  {
    type: "container",
    label: "2 Columns",
    category: "layout",
    icon: "Columns2",
    preset: "cols-2",
    create: () => ({
      type: "container",
      content: {},
      style: { ...containerBase },
      children: [makeChildCol("Column 1"), makeChildCol("Column 2")],
    }),
  },
  {
    type: "container",
    label: "3 Columns",
    category: "layout",
    icon: "Columns3",
    preset: "cols-3",
    create: () => ({
      type: "container",
      content: {},
      style: { ...containerBase },
      children: [makeChildCol("Column 1"), makeChildCol("Column 2"), makeChildCol("Column 3")],
    }),
  },
  {
    type: "container",
    label: "4 Columns",
    category: "layout",
    icon: "Columns4",
    preset: "cols-4",
    create: () => ({
      type: "container",
      content: {},
      style: { ...containerBase },
      children: [makeChildCol("1"), makeChildCol("2"), makeChildCol("3"), makeChildCol("4")],
    }),
  },
  {
    type: "container",
    label: "Grid",
    category: "layout",
    icon: "LayoutGrid",
    preset: "grid",
    create: () => ({
      type: "container",
      content: {},
      style: {
        ...containerBase,
        display: "grid",
        gridColumns: 3,
        gap: "16px",
      },
      children: [makeChildCol("Item 1"), makeChildCol("Item 2"), makeChildCol("Item 3")],
    }),
  },
];

export const createBlock = (typeOrPreset: BlockType | string, preset?: string): Block => {
  const def = preset
    ? BLOCK_DEFS.find((d) => d.preset === preset)
    : BLOCK_DEFS.find((d) => d.preset === typeOrPreset) ||
      BLOCK_DEFS.find((d) => d.type === (typeOrPreset as BlockType));
  if (!def) throw new Error(`Unknown block: ${typeOrPreset}`);
  const created = def.create();
  // Ensure deep IDs already assigned by makeChildCol; just give top-level id
  return { id: crypto.randomUUID(), ...created };
};

