import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Sparkles, Briefcase, GraduationCap, Link2, FolderOpen, Palette, Image } from "lucide-react";
import { BasicInfoForm } from "@/components/portfolio/BasicInfoForm";
import { SkillsForm } from "@/components/portfolio/SkillsForm";
import { ProjectsForm } from "@/components/portfolio/ProjectsForm";
import { ExperienceForm } from "@/components/portfolio/ExperienceForm";
import { EducationForm } from "@/components/portfolio/EducationForm";
import { SocialLinksForm } from "@/components/portfolio/SocialLinksForm";
import { ThemeSelector } from "@/components/portfolio/ThemeSelector";
import { LogoUploadForm } from "@/components/portfolio/LogoUploadForm";

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
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;

    const [profileRes, portfolioRes, skillsRes, projectsRes, experiencesRes, educationRes, socialRes] = 
      await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("portfolios").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("skills").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("projects").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("experiences").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("education").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("social_links").select("*").eq("user_id", user.id).order("display_order"),
      ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (portfolioRes.data) setPortfolio(portfolioRes.data);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (experiencesRes.data) setExperiences(experiencesRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);

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
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-muted rounded-lg w-full max-w-md" />
        <div className="h-96 bg-muted rounded-lg" />
      </div>
    );
  }

  const tabs = [
    { value: "theme", label: "Theme", icon: Palette },
    { value: "basic", label: "Basic Info", icon: User },
    { value: "branding", label: "Branding", icon: Image },
    { value: "skills", label: "Skills", icon: Sparkles },
    { value: "projects", label: "Projects", icon: FolderOpen },
    { value: "experience", label: "Experience", icon: Briefcase },
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "social", label: "Social Links", icon: Link2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Edit Portfolio</h1>
        <p className="text-muted-foreground">Choose your theme and customize your portfolio content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto gap-2 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                tab.value === 'theme' 
                  ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-primary/50' 
                  : 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="theme" className="mt-6">
          <ThemeSelector
            currentTheme={portfolio?.theme || null}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        <TabsContent value="basic" className="mt-6">
          <BasicInfoForm
            profile={profile}
            portfolio={portfolio}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <LogoUploadForm
            logoUrl={portfolio?.logo_url || null}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsForm
            skills={skills}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsForm
            projects={projects}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <ExperienceForm
            experiences={experiences}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationForm
            education={education}
            userId={user?.id || ""}
            onUpdate={fetchAllData}
            onSuccess={showSuccess}
            onError={showError}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialLinksForm
            socialLinks={socialLinks}
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
