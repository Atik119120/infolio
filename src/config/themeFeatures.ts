// Single source of truth: which tabs + customize fields each theme exposes.
// Used by PortfolioEdit (form rendering) and CustomizationForm (per-theme fields).
// This prevents "wrong fields appear" / "data mixing" issues by ensuring the edit UI
// matches what the theme actually renders.

export type CustomizeField =
  | "hero_image"
  | "hero_headline"
  | "hero_subheadline"
  | "hero_cta"
  | "about_image"
  | "about_text"
  | "footer_text"
  | "browser_title";

export interface ThemeConfig {
  /** Top-level edit tabs that should be visible for this theme */
  tabs: string[];
  /** Which customize fields are meaningful for this theme */
  customizeFields: CustomizeField[];
}

const ALL_CUSTOMIZE: CustomizeField[] = [
  "hero_image", "hero_headline", "hero_subheadline", "hero_cta",
  "about_image", "about_text", "footer_text", "browser_title",
];

export const THEME_CONFIG: Record<string, ThemeConfig> = {
  "freelancer": {
    tabs: ["theme", "basic", "customize", "branding", "skills", "services", "projects", "experience", "education", "social", "seo"],
    customizeFields: ALL_CUSTOMIZE,
  },
  "creative-sidebar-pro": {
    tabs: ["theme", "basic", "customize", "branding", "services", "projects", "contact", "social", "seo"],
    customizeFields: ALL_CUSTOMIZE,
  },
  "dark-photographer": {
    tabs: ["theme", "basic", "customize", "branding", "services", "projects", "contact", "social", "seo"],
    customizeFields: ALL_CUSTOMIZE,
  },
  "creative-canvas": {
    tabs: ["theme", "basic", "customize", "branding", "skills", "services", "projects", "education", "contact", "social", "seo"],
    customizeFields: ALL_CUSTOMIZE,
  },
};

export const DEFAULT_CONFIG: ThemeConfig = THEME_CONFIG["freelancer"];

export function getThemeConfig(theme?: string | null): ThemeConfig {
  if (!theme) return DEFAULT_CONFIG;
  // Admin-uploaded themes ("admin:slug") get full edit surface.
  if (theme.startsWith("admin:")) return DEFAULT_CONFIG;
  return THEME_CONFIG[theme] || DEFAULT_CONFIG;
}
