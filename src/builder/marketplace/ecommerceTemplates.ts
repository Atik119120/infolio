import type { Block, PageContent } from "../types";

const uid = () => crypto.randomUUID();
const mk = (type: string, content: any, style: any = {}, children?: Block[]): Block =>
  ({ id: uid(), type: type as any, content, style, children });

/* ============= Fashion Store ============= */
const fashionStore: PageContent = {
  theme: {
    primaryColor: "#0f172a",
    background: "#ffffff",
    fontFamily: "Inter, sans-serif",
    headingFontFamily: "Playfair Display, serif",
    buttonRadius: "8px",
  },
  blocks: [
    mk("navbar", {
      brand: "AURUM",
      links: [
        { label: "Shop", url: "#shop" },
        { label: "Collections", url: "#collections" },
        { label: "About", url: "#" },
      ],
      ctaText: "Cart",
      ctaLink: "#",
    }, { background: "#ffffff", color: "#0f172a", paddingTop: "20px", paddingBottom: "20px" }),

    mk("hero", {
      eyebrow: "FW '26",
      title: "Quietly modern wardrobe staples",
      subtitle: "Crafted with care. Built to last seasons.",
      ctaText: "Shop new",
      ctaLink: "#shop",
    }, {
      paddingTop: "140px", paddingBottom: "140px",
      background: "linear-gradient(180deg,#fafaf9 0%,#f5f5f4 100%)",
      color: "#0f172a", textAlign: "center",
    }),

    mk("categoryGrid", {
      eyebrow: "Browse",
      title: "Shop by category",
      columns: 4,
      items: [
        { name: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", count: "32 items" },
        { name: "Knitwear", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600", count: "48 items" },
        { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", count: "60 items" },
        { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", count: "85 items" },
      ],
    }, { paddingTop: "60px", paddingBottom: "60px" }),

    mk("productGrid", {
      eyebrow: "Bestsellers",
      title: "Featured this week",
      columns: 4,
      accentColor: "#0f172a",
      items: [
        { title: "Cashmere Crewneck", price: "$189", oldPrice: "$229", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600", badge: "Sale", rating: 5, inStock: true },
        { title: "Wool Overcoat", price: "$399", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", badge: "New", rating: 5, inStock: true },
        { title: "Leather Loafers", price: "$249", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", rating: 4, inStock: true },
        { title: "Silk Scarf", price: "$79", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", rating: 4, inStock: false },
      ],
    }, { background: "#ffffff", paddingTop: "60px", paddingBottom: "80px" }),

    mk("cta", {
      title: "Members get 15% off",
      body: "Join our newsletter — never miss a drop.",
      ctaText: "Subscribe",
      ctaLink: "#",
    }, {
      paddingTop: "100px", paddingBottom: "100px",
      background: "#0f172a", color: "#ffffff", textAlign: "center",
    }),

    mk("checkout", {
      title: "Checkout",
      accentColor: "#0f172a",
      currency: "$",
      shippingFee: "8",
      taxRate: 5,
    }, {}),

    mk("cartFloating", {
      label: "Cart", position: "bottom-right",
      accentColor: "#0f172a", currency: "$",
    }, {}),
  ],
};

/* ============= Electronics Store ============= */
const electronicsStore: PageContent = {
  theme: {
    primaryColor: "#2563eb",
    background: "#ffffff",
    fontFamily: "Inter, sans-serif",
    buttonRadius: "10px",
  },
  blocks: [
    mk("navbar", {
      brand: "VOLT",
      links: [
        { label: "Phones", url: "#" },
        { label: "Laptops", url: "#" },
        { label: "Audio", url: "#" },
      ],
      ctaText: "Cart",
      ctaLink: "#",
    }, { background: "#0a0a0a", color: "#ffffff", paddingTop: "20px", paddingBottom: "20px" }),

    mk("hero", {
      eyebrow: "FLASH SALE",
      title: "Tech that performs.",
      subtitle: "Up to 40% off select items. Today only.",
      ctaText: "Shop deals",
      ctaLink: "#",
    }, {
      paddingTop: "120px", paddingBottom: "120px",
      background:
        "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,0.35) 0%, rgba(10,10,10,0) 60%), #0a0a0a",
      color: "#ffffff", textAlign: "center",
    }),

    mk("productGrid", {
      eyebrow: "Hot now",
      title: "Top deals",
      columns: 4,
      accentColor: "#2563eb",
      items: [
        { title: "Wireless Earbuds Pro", price: "$129", oldPrice: "$199", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600", badge: "-35%", rating: 5, inStock: true },
        { title: "Smart Watch X", price: "$249", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600", badge: "New", rating: 5, inStock: true },
        { title: "Mechanical Keyboard", price: "$159", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", rating: 4, inStock: true },
        { title: "Studio Headphones", price: "$299", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", rating: 5, inStock: false },
      ],
    }, { background: "#ffffff", paddingTop: "80px", paddingBottom: "80px" }),

    mk("stats", {
      items: [
        { value: "2M+", label: "Orders shipped" },
        { value: "24h", label: "Fast delivery" },
        { value: "4.9★", label: "Buyer rating" },
        { value: "30d", label: "Easy returns" },
      ],
    }, { paddingTop: "80px", paddingBottom: "80px", background: "#0a0a0a", color: "#ffffff", textAlign: "center" }),

    mk("checkout", {
      title: "Secure checkout",
      accentColor: "#2563eb",
      currency: "$",
      shippingFee: "10",
      taxRate: 7,
    }, {}),

    mk("cartFloating", { label: "Cart", position: "bottom-right", accentColor: "#2563eb", currency: "$" }, {}),
  ],
};

/* ============= Restaurant ============= */
const restaurant: PageContent = {
  theme: {
    primaryColor: "#b91c1c",
    background: "#fffbeb",
    fontFamily: "Inter, sans-serif",
    headingFontFamily: "DM Serif Display, serif",
    buttonRadius: "999px",
  },
  blocks: [
    mk("navbar", {
      brand: "Trattoria Sole",
      links: [
        { label: "Menu", url: "#menu" },
        { label: "Reservations", url: "#" },
        { label: "About", url: "#" },
      ],
      ctaText: "Order online",
      ctaLink: "#",
    }, { background: "#fffbeb", color: "#0f172a", paddingTop: "20px", paddingBottom: "20px" }),

    mk("hero", {
      eyebrow: "Since 1987",
      title: "Italian, the slow way.",
      subtitle: "Wood-fired pizzas, fresh pasta, and natural wine.",
      ctaText: "Book a table",
      ctaLink: "#",
    }, {
      paddingTop: "140px", paddingBottom: "140px",
      background: "linear-gradient(180deg,#fef3c7 0%,#fffbeb 100%)",
      color: "#0f172a", textAlign: "center",
    }),

    mk("productGrid", {
      eyebrow: "Today's menu",
      title: "Chef's selection",
      columns: 3,
      accentColor: "#b91c1c",
      items: [
        { title: "Margherita Classica", price: "$16", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600", rating: 5, inStock: true },
        { title: "Tagliatelle al Ragù", price: "$22", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600", badge: "Chef's", rating: 5, inStock: true },
        { title: "Tiramisù", price: "$9", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600", rating: 5, inStock: true },
      ],
    }, { background: "#fffbeb", paddingTop: "60px", paddingBottom: "80px" }),

    mk("testimonial", {
      title: "What our guests say",
      items: [
        { quote: "The best Italian outside Italy.", author: "Maria L." },
        { quote: "A neighbourhood gem.", author: "James R." },
      ],
    }, { paddingTop: "80px", paddingBottom: "80px", background: "#0f172a", color: "#ffffff", textAlign: "center" }),

    mk("checkout", {
      title: "Place your order",
      accentColor: "#b91c1c",
      currency: "$",
      shippingFee: "3",
      taxRate: 0,
    }, {}),

    mk("cartFloating", { label: "Order", position: "bottom-right", accentColor: "#b91c1c", currency: "$" }, {}),
  ],
};

export const ECOMMERCE_TEMPLATES = [
  {
    id: "ec-fashion",
    name: "Fashion Boutique",
    category: "Ecommerce" as const,
    tier: "Pro" as const,
    preview: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    content: fashionStore,
  },
  {
    id: "ec-electronics",
    name: "Electronics Store",
    category: "Ecommerce" as const,
    tier: "Pro" as const,
    preview: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    content: electronicsStore,
  },
  {
    id: "ec-restaurant",
    name: "Restaurant & Order",
    category: "Ecommerce" as const,
    tier: "Free" as const,
    preview: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    content: restaurant,
  },
];
