export const PROJECT_TYPES = [
  { value: "photographer", label: "Photographer" },
  { value: "graphic_designer", label: "Graphic Designer" },
  { value: "uiux", label: "UI/UX Designer" },
  { value: "web_designer", label: "Web Designer" },
  { value: "digital_marketer", label: "Digital Marketer" },
  { value: "content_creator", label: "Content Creator" },
  { value: "freelancer", label: "Freelancer" },
  { value: "custom", label: "Custom Category" },
] as const;

export type ProjectType = typeof PROJECT_TYPES[number]["value"];

export type GalleryImage = { url: string; caption?: string };

export type SectionBlock =
  | { type: "heading"; content: string }
  | { type: "text"; content: string }
  | { type: "image"; image_url: string; caption?: string };

export type ExternalLinks = {
  behance?: string;
  dribbble?: string;
  facebook?: string;
  website?: string;
  live?: string;
};

export interface FullProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  cover_image: string | null;
  featured: boolean | null;
  display_order: number | null;
  project_type: ProjectType | string;
  custom_category: string | null;
  gallery: any;
  sections: any;
  tools: string[] | null;
  tags: string[] | null;
  client_name: string | null;
  project_date: string | null;
  external_links: any;
  is_visible: boolean;
  slug: string | null;
  created_at?: string;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const getCategoryLabel = (p: { project_type: string; custom_category?: string | null }) => {
  if (p.project_type === "custom" && p.custom_category) return p.custom_category;
  return PROJECT_TYPES.find((t) => t.value === p.project_type)?.label || "Project";
};

export const layoutOf = (t: string): "photographer" | "case_study" | "campaign" | "default" => {
  if (t === "photographer") return "photographer";
  if (t === "graphic_designer" || t === "uiux" || t === "web_designer") return "case_study";
  if (t === "digital_marketer" || t === "content_creator") return "campaign";
  return "default";
};
