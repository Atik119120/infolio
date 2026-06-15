// Centralized helper for portfolio section show/hide state.
// Stored on `portfolios.section_visibility` as JSONB.

export type SectionKey =
  | "hero"
  | "about"
  | "skills"
  | "services"
  | "projects"
  | "experience"
  | "education"
  | "contact"
  | "social";

export const ALL_SECTIONS: SectionKey[] = [
  "hero",
  "about",
  "skills",
  "services",
  "projects",
  "experience",
  "education",
  "contact",
  "social",
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  services: "Services",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
  social: "Social Links",
};

export const DEFAULT_VISIBILITY: Record<SectionKey, boolean> = {
  hero: true,
  about: true,
  skills: true,
  services: true,
  projects: true,
  experience: true,
  education: true,
  contact: true,
  social: true,
};

export function getSectionVisibility(
  portfolio: any
): Record<SectionKey, boolean> {
  const raw = portfolio?.section_visibility;
  if (!raw || typeof raw !== "object") return { ...DEFAULT_VISIBILITY };
  const merged = { ...DEFAULT_VISIBILITY };
  for (const k of ALL_SECTIONS) {
    if (typeof raw[k] === "boolean") merged[k] = raw[k];
  }
  return merged;
}

export function isVisible(portfolio: any, key: SectionKey): boolean {
  return getSectionVisibility(portfolio)[key] !== false;
}
