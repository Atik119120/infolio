// Portfolio Theme Types

export interface ThemeProfile {
  display_name: string | null;
  avatar_url: string | null;
  email?: string | null;
}

export interface ThemePortfolio {
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  theme: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  brand_name?: string | null;
  hero_image_url?: string | null;
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  hero_cta_text?: string | null;
  hero_cta_link?: string | null;
  about_image_url?: string | null;
  about_text?: string | null;
  footer_text?: string | null;
  browser_title?: string | null;
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

export interface ThemeService {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  price: string | null;
}

export interface ThemeProps {
  profile: ThemeProfile | null;
  portfolio: ThemePortfolio | null;
  skills: ThemeSkill[];
  projects: ThemeProject[];
  experiences: ThemeExperience[];
  education: ThemeEducation[];
  socialLinks: ThemeSocialLink[];
  services?: ThemeService[];
  userId?: string;
}

export type ThemeCategory = 'free';

export interface ThemeOption {
  value: string;
  label: string;
  description: string;
  isPremium: boolean;
  price: number;
  category: ThemeCategory;
  tier: 'free' | 'standard' | 'pro' | 'elite';
}

export const THEME_OPTIONS: ThemeOption[] = [
  { value: 'freelancer', label: 'Theme 1', description: 'Clean modern portfolio theme', isPremium: false, price: 0, category: 'free', tier: 'free' },
];

export const getThemesByCategory = (_category: ThemeCategory): ThemeOption[] => {
  return THEME_OPTIONS;
};

export const getGroupedThemes = () => {
  return [{ category: 'free' as ThemeCategory, label: 'Themes', themes: THEME_OPTIONS }];
};

export type ThemeType = typeof THEME_OPTIONS[number]['value'];
