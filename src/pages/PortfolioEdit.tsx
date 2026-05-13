import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Sparkles, Briefcase, GraduationCap, Link2, FolderOpen, Palette, Image, Wrench, Search, Wand2 } from "lucide-react";
import { BasicInfoForm } from "@/components/portfolio/BasicInfoForm";
import { SkillsForm } from "@/components/portfolio/SkillsForm";
import { ProjectsForm } from "@/components/portfolio/ProjectsForm";
import { ExperienceForm } from "@/components/portfolio/ExperienceForm";
import { EducationForm } from "@/components/portfolio/EducationForm";
import { SocialLinksForm } from "@/components/portfolio/SocialLinksForm";
import { ServicesForm, Service } from "@/components/portfolio/ServicesForm";
import { ThemeSelector } from "@/components/portfolio/ThemeSelector";
import { LogoUploadForm } from "@/components/portfolio/LogoUploadForm";
import { FaviconUploadForm } from "@/components/portfolio/FaviconUploadForm";
import { SeoSettingsForm } from "@/components/portfolio/SeoSettingsForm";
import { CustomizationForm } from "@/components/portfolio/CustomizationForm";
import { CustomCodeForm } from "@/components/portfolio/CustomCodeForm";
import { getThemeConfig } from "@/config/themeFeatures";

export interface Profile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export interface Portfolio {
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  is_published: boolean | null;
  theme: string | null;
  logo_url: string | null;
  favicon_url?: string | null;
  brand_name?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean | null;
  display_order: number | null;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  display_order: number | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  display_order: number | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number | null;
}

export default function PortfolioEdit() {
  const [activeTab, setActiveTab] = useState("theme");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
    
    // Listen for tab switch events from sidebar
    const handleTabSwitch = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };
    
    window.addEventListener('switchTab', handleTabSwitch as EventListener);
    return () => window.removeEventListener('switchTab', handleTabSwitch as EventListener);
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    const [profileRes, portfolioRes, skillsRes, projectsRes, experiencesRes, educationRes, socialRes, servicesRes] = 
      await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("portfolios").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("skills").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("projects").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("experiences").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("education").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("social_links").select("*").eq("user_id", user.id).order("display_order"),
        (supabase as any).from("services").select("*").eq("user_id", user.id).order("display_order"),
      ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (portfolioRes.data) setPortfolio(portfolioRes.data);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (experiencesRes.data) setExperiences(experiencesRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);
    if (servicesRes.data) setServices(servicesRes.data);

    setLoading(false);
  };

  const showSuccess = (message: string) => {
    toast({ title: "Success", description: message });
  };

  const showError = (message: string) => {
    toast({ variant: "destructive", title: "Error", description: message });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded-lg w-full max-w-md" />
        <div className="h-80 bg-muted rounded-lg" />
      </div>
    );
  }

  // All available tabs
  const allTabs = [
    { value: "theme", label: "Theme", icon: Palette },
    { value: "basic", label: "Basic Info", icon: User },
    { value: "customize", label: "Customize", icon: Wand2 },
    { value: "branding", label: "Branding", icon: Image },
    { value: "skills", label: "Skills", icon: Sparkles },
    { value: "services", label: "Services", icon: Wrench },
    { value: "projects", label: "Projects", icon: FolderOpen },
    { value: "experience", label: "Experience", icon: Briefcase },
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "social", label: "Social Links", icon: Link2 },
    { value: "seo", label: "SEO", icon: Search },
  ];

  // Each theme exposes only the sections it actually renders.
  // Theme → enabled feature tabs (theme/basic/customize/branding/social/seo are universal)
  const THEME_FEATURES: Record<string, string[]> = {
    "freelancer":            ["theme", "basic", "customize", "branding", "skills", "services", "projects", "experience", "education", "social", "seo"],
    "small-business":        ["theme", "basic", "customize", "branding", "skills", "services", "projects", "experience", "education", "social", "seo"],
    "prd-graphic-designer":  ["theme", "basic", "customize", "branding", "skills", "services", "projects", "experience", "social", "seo"],
    "prd-photographer":      ["theme", "basic", "customize", "branding", "services", "projects", "experience", "education", "social", "seo"],
    "prd-digital-marketer":  ["theme", "basic", "customize", "branding", "services", "projects", "experience", "social", "seo"],
    "biography":             ["theme", "basic", "customize", "branding", "projects", "experience", "education", "social", "seo"],
    "custom-code":           ["theme", "customize"],
  };

  const activeTheme = portfolio?.theme || "freelancer";
  const enabled = THEME_FEATURES[activeTheme] || allTabs.map((t) => t.value);
  const tabs = allTabs.filter((t) => enabled.includes(t.value));

  // If active tab not enabled by current theme, jump back to theme tab
  if (!enabled.includes(activeTab)) {
    setTimeout(() => setActiveTab("theme"), 0);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Edit Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Choose theme and customize content — sections shown match your selected theme
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList
          className="grid h-auto gap-1.5 bg-transparent p-0"
          style={{ gridTemplateColumns: `repeat(${Math.min(tabs.length, 11)}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                tab.value === 'theme'
                  ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white border-primary/30'
                  : 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="theme" className="mt-4">
          <ThemeSelector
            currentTheme={portfolio?.theme || null}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        <TabsContent value="basic" className="mt-4">
          <BasicInfoForm
            profile={profile}
            portfolio={portfolio}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="customize" className="mt-4 space-y-4">
          {activeTheme !== "custom-code" && (
            <CustomizationForm
              portfolio={portfolio as any}
              userId={user?.id || ""}
              onUpdate={fetchAllData}
              onSuccess={showSuccess}
              onError={showError}
            />
          )}
          <CustomCodeForm
            portfolio={portfolio as any}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        <TabsContent value="branding" className="mt-4 space-y-4">
          <LogoUploadForm
            logoUrl={portfolio?.logo_url || null}
            brandName={(portfolio as any)?.brand_name || null}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
          <FaviconUploadForm
            faviconUrl={(portfolio as any)?.favicon_url || null}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <SkillsForm
            skills={skills}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <ServicesForm
            services={services}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <ProjectsForm
            projects={projects}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          <ExperienceForm
            experiences={experiences}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="education" className="mt-4">
          <EducationForm
            education={education}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <SocialLinksForm
            socialLinks={socialLinks}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <SeoSettingsForm
            portfolio={portfolio as any}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
