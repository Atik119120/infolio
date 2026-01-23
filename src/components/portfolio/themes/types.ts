// Portfolio Theme Types

export interface ThemeProfile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export interface ThemePortfolio {
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  theme: string | null;
  logo_url: string | null;
}

export interface ThemeSkill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
}

export interface ThemeProject {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean | null;
}

export interface ThemeExperience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
}

export interface ThemeEducation {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
}

export interface ThemeSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ThemeProps {
  profile: ThemeProfile | null;
  portfolio: ThemePortfolio | null;
  skills: ThemeSkill[];
  projects: ThemeProject[];
  experiences: ThemeExperience[];
  education: ThemeEducation[];
  socialLinks: ThemeSocialLink[];
}

export const THEME_OPTIONS = [
  { value: 'photographer', label: 'Photographer', description: 'Visual-focused theme with gallery layouts' },
  { value: 'graphic-designer', label: 'Graphic Designer', description: 'Creative theme with bold typography' },
  { value: 'video-editor', label: 'Video Editor', description: 'Dynamic theme with cinematic feel' },
  { value: 'digital-marketer', label: 'Digital Marketer', description: 'Modern theme with analytics focus' },
  { value: 'web-developer', label: 'Web Developer', description: 'Tech-focused theme with code aesthetics' },
  { value: 'official', label: 'Official/Corporate', description: 'Professional business-oriented theme' },
  { value: 'personal', label: 'Personal/Biography', description: 'Elegant personal portfolio theme' },
  { value: 'cosmic', label: 'Cosmic/Universe', description: 'Premium space-inspired luxury theme' },
] as const;

export type ThemeType = typeof THEME_OPTIONS[number]['value'];
