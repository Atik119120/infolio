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
  favicon_url: string | null;
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
  userId?: string;
}

// Theme categories for grouping
export type ThemeCategory = 'free' | 'web-developer' | 'graphic-designer' | 'photographer' | 'video-editor' | 'digital-marketer' | 'official' | 'personal' | 'cosmic';

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
  // Free Theme
  { value: 'simple', label: 'Simple', description: 'Clean minimal free theme', isPremium: false, price: 0, category: 'free', tier: 'free' },
  
  // Web Developer Category
  { value: 'web-developer', label: 'Web Developer', description: 'Tech-focused theme with code aesthetics', isPremium: true, price: 200, category: 'web-developer', tier: 'standard' },
  { value: 'web-developer-pro', label: 'Web Developer Pro', description: 'Matrix-style dark theme with terminal aesthetics', isPremium: true, price: 300, category: 'web-developer', tier: 'pro' },
  { value: 'web-developer-elite', label: 'Web Developer Elite', description: 'Glassmorphism cyberpunk theme with 3D elements', isPremium: true, price: 400, category: 'web-developer', tier: 'elite' },
  
  // Graphic Designer Category
  { value: 'graphic-designer', label: 'Graphic Designer', description: 'Creative theme with bold typography', isPremium: true, price: 200, category: 'graphic-designer', tier: 'standard' },
  { value: 'graphic-designer-pro', label: 'Graphic Designer Pro', description: 'Magazine-style editorial theme with 3D elements', isPremium: true, price: 300, category: 'graphic-designer', tier: 'pro' },
  { value: 'graphic-designer-elite', label: 'Graphic Designer Elite', description: 'Luxury dark theme with cinematic animations', isPremium: true, price: 400, category: 'graphic-designer', tier: 'elite' },
  
  // Photographer Category
  { value: 'photographer', label: 'Photographer', description: 'Visual-focused theme with gallery layouts', isPremium: true, price: 200, category: 'photographer', tier: 'standard' },
  { value: 'photographer-pro', label: 'Photographer Pro', description: 'Lightroom-inspired professional editing interface', isPremium: true, price: 300, category: 'photographer', tier: 'pro' },
  { value: 'photographer-elite', label: 'Photographer Elite', description: 'Cinematic luxury theme with award aesthetics', isPremium: true, price: 400, category: 'photographer', tier: 'elite' },
  
  // Video Editor Category
  { value: 'video-editor', label: 'Video Editor', description: 'Dynamic theme with cinematic feel', isPremium: true, price: 200, category: 'video-editor', tier: 'standard' },
  { value: 'video-editor-pro', label: 'Video Editor Pro', description: 'DaVinci Resolve-inspired color grading interface', isPremium: true, price: 300, category: 'video-editor', tier: 'pro' },
  { value: 'video-editor-elite', label: 'Video Editor Elite', description: 'Premium cinematic filmmaker portfolio', isPremium: true, price: 400, category: 'video-editor', tier: 'elite' },
  
  // Digital Marketer Category
  { value: 'digital-marketer', label: 'Digital Marketer', description: 'Modern theme with analytics focus', isPremium: true, price: 200, category: 'digital-marketer', tier: 'standard' },
  { value: 'digital-marketer-pro', label: 'Digital Marketer Pro', description: 'Growth-focused dashboard with metrics', isPremium: true, price: 300, category: 'digital-marketer', tier: 'pro' },
  { value: 'digital-marketer-elite', label: 'Digital Marketer Elite', description: 'Elite strategist luxury portfolio', isPremium: true, price: 400, category: 'digital-marketer', tier: 'elite' },
  
  // Official Category
  { value: 'official', label: 'Official/Corporate', description: 'Professional business-oriented theme', isPremium: true, price: 200, category: 'official', tier: 'standard' },
  
  // Personal Category
  { value: 'personal', label: 'Personal/Biography', description: 'Elegant personal portfolio theme', isPremium: true, price: 200, category: 'personal', tier: 'standard' },
  
  // Cosmic Category
  { value: 'cosmic', label: 'Cosmic/Universe', description: 'Premium space-inspired luxury theme', isPremium: true, price: 200, category: 'cosmic', tier: 'standard' },
];

// Helper to get themes by category
export const getThemesByCategory = (category: ThemeCategory): ThemeOption[] => {
  return THEME_OPTIONS.filter(theme => theme.category === category);
};

// Helper to get all categories with their themes
export const getGroupedThemes = () => {
  const categories: { category: ThemeCategory; label: string; themes: ThemeOption[] }[] = [
    { category: 'free', label: 'Free', themes: getThemesByCategory('free') },
    { category: 'web-developer', label: 'Web Developer', themes: getThemesByCategory('web-developer') },
    { category: 'graphic-designer', label: 'Graphic Designer', themes: getThemesByCategory('graphic-designer') },
    { category: 'photographer', label: 'Photographer', themes: getThemesByCategory('photographer') },
    { category: 'video-editor', label: 'Video Editor', themes: getThemesByCategory('video-editor') },
    { category: 'digital-marketer', label: 'Digital Marketer', themes: getThemesByCategory('digital-marketer') },
    { category: 'official', label: 'Official', themes: getThemesByCategory('official') },
    { category: 'personal', label: 'Personal', themes: getThemesByCategory('personal') },
    { category: 'cosmic', label: 'Cosmic', themes: getThemesByCategory('cosmic') },
  ];
  return categories.filter(c => c.themes.length > 0);
};

export type ThemeType = typeof THEME_OPTIONS[number]['value'];
