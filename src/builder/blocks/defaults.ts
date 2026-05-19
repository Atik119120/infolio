import type { Block, BlockType } from "../types";

export interface BlockDef {
  type: BlockType;
  label: string;
  category: "section" | "element";
  icon: string; // lucide icon name as string key
  create: () => Omit<Block, "id">;
}

export const BLOCK_DEFS: BlockDef[] = [
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
    type: "section",
    label: "Section",
    category: "section",
    icon: "LayoutTemplate",
    create: () => ({
      type: "section",
      content: { title: "Section Title", body: "Section description here." },
      style: {
        paddingTop: "64px",
        paddingBottom: "64px",
        background: "#ffffff",
        color: "#0f172a",
        textAlign: "center",
      },
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
      style: {
        fontSize: "36px",
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "left",
        paddingTop: "16px",
        paddingBottom: "16px",
      },
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
      style: {
        fontSize: "16px",
        color: "#475569",
        textAlign: "left",
        paddingTop: "8px",
        paddingBottom: "8px",
      },
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
        background: "#dc2626",
        color: "#ffffff",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        paddingRight: "24px",
        borderRadius: "9999px",
        fontWeight: "600",
        textAlign: "center",
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
      content: {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
        alt: "Image",
      },
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
    type: "divider",
    label: "Divider",
    category: "element",
    icon: "Minus",
    create: () => ({
      type: "divider",
      content: {},
      style: {
        borderWidth: "1px",
        borderColor: "#e2e8f0",
        marginTop: "16px",
        marginBottom: "16px",
      },
    }),
  },
  {
    type: "spacer",
    label: "Spacer",
    category: "element",
    icon: "Move",
    create: () => ({
      type: "spacer",
      content: { height: "48px" },
      style: {},
    }),
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
];

export const createBlock = (type: BlockType): Block => {
  const def = BLOCK_DEFS.find((d) => d.type === type);
  if (!def) throw new Error(`Unknown block: ${type}`);
  return { id: crypto.randomUUID(), ...def.create() };
};
