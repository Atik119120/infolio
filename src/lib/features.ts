// Plan-based feature matrix for Infolio Builder dashboard.

export type Plan = "basic" | "creator" | "developer" | "studio" | "commerce" | "free" | "pro";

export type Engine = "theme" | "builder" | "react";

export type WebsiteType =
  | "portfolio"
  | "agency"
  | "business"
  | "food"
  | "clothing"
  | "cosmetics"
  | "digital"
  | "restaurant"
  | "ecommerce"
  | "saas";

export interface FeatureFlags {
  // engines
  themeEngine: boolean;
  builderEngine: boolean;
  reactEngine: boolean;
  // builder
  pageBuilder: boolean;
  themeBuilder: boolean;
  reactProjects: boolean;
  githubIntegration: boolean;
  // ecommerce
  ecommerce: boolean;
  inventory: boolean;
  coupons: boolean;
  shipping: boolean;
  paymentGateways: boolean;
  // team
  team: boolean;
  multiProject: boolean;
  cdn: boolean;
  // misc
  analytics: boolean;
  customDomain: boolean;
  removeBranding: boolean;
  advancedSEO: boolean;
  customCode: boolean;
  integrations: boolean;
  // limits
  websiteLimit: number;
  storageMB: number;
  bandwidthGB: number;
}

const BASIC: FeatureFlags = {
  themeEngine: true,
  builderEngine: false,
  reactEngine: false,
  pageBuilder: false,
  themeBuilder: false,
  reactProjects: false,
  githubIntegration: false,
  ecommerce: false,
  inventory: false,
  coupons: false,
  shipping: false,
  paymentGateways: false,
  team: false,
  multiProject: false,
  cdn: false,
  analytics: false,
  customDomain: false,
  removeBranding: false,
  advancedSEO: false,
  customCode: false,
  integrations: false,
  websiteLimit: 1,
  storageMB: 500,
  bandwidthGB: 10,
};

const CREATOR: FeatureFlags = {
  ...BASIC,
  builderEngine: true,
  pageBuilder: true,
  analytics: true,
  customDomain: true,
  removeBranding: true,
  customCode: true,
  integrations: true,
  storageMB: 2000,
  bandwidthGB: 50,
};

const DEVELOPER: FeatureFlags = {
  ...CREATOR,
  reactEngine: true,
  themeBuilder: true,
  reactProjects: true,
  githubIntegration: true,
  advancedSEO: true,
  storageMB: 5000,
  bandwidthGB: 150,
};

const STUDIO: FeatureFlags = {
  ...DEVELOPER,
  team: true,
  multiProject: true,
  cdn: true,
  websiteLimit: 10,
  storageMB: 20000,
  bandwidthGB: 500,
};

const COMMERCE: FeatureFlags = {
  ...DEVELOPER,
  ecommerce: true,
  inventory: true,
  coupons: true,
  shipping: true,
  paymentGateways: true,
  storageMB: 10000,
  bandwidthGB: 300,
};

const MATRIX: Record<Plan, FeatureFlags> = {
  free: BASIC,
  basic: BASIC,
  pro: CREATOR,
  creator: CREATOR,
  developer: DEVELOPER,
  studio: STUDIO,
  commerce: COMMERCE,
};

export function getFeatures(plan: string | null | undefined): FeatureFlags {
  const key = (plan || "basic").toLowerCase() as Plan;
  return MATRIX[key] || BASIC;
}

export const PLAN_META: Record<string, { label: string; color: string; tagline: string }> = {
  basic: { label: "Basic", color: "from-slate-500 to-slate-700", tagline: "Get started" },
  free: { label: "Basic", color: "from-slate-500 to-slate-700", tagline: "Get started" },
  creator: { label: "Creator Premium", color: "from-violet-500 to-fuchsia-500", tagline: "For creators" },
  pro: { label: "Creator Premium", color: "from-violet-500 to-fuchsia-500", tagline: "For creators" },
  developer: { label: "Developer Pro", color: "from-cyan-500 to-blue-600", tagline: "For developers" },
  studio: { label: "Studio", color: "from-amber-500 to-orange-600", tagline: "For teams" },
  commerce: { label: "Commerce Pro", color: "from-emerald-500 to-teal-600", tagline: "For online stores" },
};

export const ENGINE_META: Record<Engine, { label: string; description: string; icon: string }> = {
  theme: { label: "Theme Engine", description: "Pre-built themes with simple customization", icon: "🎨" },
  builder: { label: "Page Builder", description: "Drag & drop visual website builder", icon: "🧱" },
  react: { label: "React / Next.js", description: "Custom code projects with full control", icon: "⚛️" },
};

export const WEBSITE_TYPES: { value: WebsiteType; label: string; emoji: string; ecommerce?: boolean }[] = [
  { value: "portfolio", label: "Portfolio", emoji: "👤" },
  { value: "agency", label: "Agency", emoji: "🏢" },
  { value: "business", label: "Business", emoji: "💼" },
  { value: "saas", label: "SaaS", emoji: "🚀" },
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "food", label: "Organic Food", emoji: "🥦", ecommerce: true },
  { value: "clothing", label: "Clothing Store", emoji: "👕", ecommerce: true },
  { value: "cosmetics", label: "Cosmetics Store", emoji: "💄", ecommerce: true },
  { value: "digital", label: "Digital Products", emoji: "💾", ecommerce: true },
  { value: "ecommerce", label: "Full Ecommerce", emoji: "🛒", ecommerce: true },
];

export function isEcommerceType(t: string | null | undefined): boolean {
  return WEBSITE_TYPES.find((w) => w.value === t)?.ecommerce === true;
}
