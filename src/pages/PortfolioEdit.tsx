import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User, Sparkles, Briefcase, GraduationCap, Link2, FolderOpen, Palette,
  Image as ImageIcon, Wrench, Search, Wand2, Monitor, Smartphone, RefreshCw, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

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

export interface Skill { id: string; name: string; category: string | null; proficiency: number | null; }
import type { FullProject as Project } from "@/lib/projectTypes";
export type { FullProject as Project } from "@/lib/projectTypes";
export interface Experience { id: string; company: string; position: string; description: string | null; start_date: string | null; end_date: string | null; is_current: boolean | null; display_order: number | null; }
export interface Education { id: string; institution: string; degree: string; field_of_study: string | null; start_date: string | null; end_date: string | null; is_current: boolean | null; display_order: number | null; }
export interface SocialLink { id: string; platform: string; url: string; display_order: number | null; }

type SectionKey =
  | "theme" | "basic" | "customize" | "branding" | "skills" | "services"
  | "projects" | "experience" | "education" | "social" | "seo";

export default function PortfolioEdit() {
  const [activeSection, setActiveSection] = useState<SectionKey>("theme");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const activeTheme = portfolio?.theme || "freelancer";
  const themeConfig = getThemeConfig(activeTheme);

  useEffect(() => {
    if (user) fetchAllData();
    const handleTabSwitch = (e: CustomEvent) => setActiveSection(e.detail as SectionKey);
    window.addEventListener("switchTab", handleTabSwitch as EventListener);
    return () => window.removeEventListener("switchTab", handleTabSwitch as EventListener);
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

  const refreshPreview = () => setPreviewKey((k) => k + 1);

  const handleUpdate = () => {
    fetchAllData();
    // small delay so DB write reflects before iframe reloads
    setTimeout(refreshPreview, 400);
  };

  const showSuccess = (message: string) => toast({ title: "Success", description: message });
  const showError = (message: string) => toast({ variant: "destructive", title: "Error", description: message });

  useEffect(() => {
    if (!loading && !themeConfig.tabs.includes(activeSection)) {
      setActiveSection("theme");
    }
  }, [loading, activeTheme, activeSection, themeConfig.tabs]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-full max-w-md" />
        <div className="h-80 bg-white/5 rounded-lg" />
      </div>
    );
  }

  const allSections: { value: SectionKey; label: string; icon: any; hint?: string }[] = [
    { value: "theme", label: "Theme", icon: Palette, hint: "Choose your portfolio theme" },
    { value: "basic", label: "Basic Info", icon: User, hint: "Name, bio, contact details" },
    { value: "customize", label: "Customize", icon: Wand2, hint: "Hero, about, footer content" },
    { value: "branding", label: "Branding", icon: ImageIcon, hint: "Logo and favicon" },
    { value: "skills", label: "Skills", icon: Sparkles, hint: "List your skills" },
    { value: "services", label: "Services", icon: Wrench, hint: "Offerings you provide" },
    { value: "projects", label: "Projects", icon: FolderOpen, hint: "Showcase your work" },
    { value: "experience", label: "Experience", icon: Briefcase, hint: "Work history" },
    { value: "education", label: "Education", icon: GraduationCap, hint: "Academic background" },
    { value: "social", label: "Social Links", icon: Link2, hint: "Social profiles" },
    { value: "seo", label: "SEO", icon: Search, hint: "Search engine settings" },
  ];
  const sections = allSections.filter((s) => themeConfig.tabs.includes(s.value));
  const activeMeta = sections.find((s) => s.value === activeSection) ?? sections[0];
  const ActiveIcon = activeMeta?.icon ?? Palette;

  const username = profile?.username;
  const previewUrl = username ? `/u/${username}?preview=1` : null;

  const renderForm = () => {
    switch (activeSection) {
      case "theme":
        return <ThemeSelector currentTheme={portfolio?.theme || null} userId={user?.id || ""} onUpdate={handleUpdate} />;
      case "basic":
        return <BasicInfoForm profile={profile} portfolio={portfolio} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "customize":
        return activeTheme === "custom-code"
          ? <CustomCodeForm portfolio={portfolio as any} userId={user?.id || ""} onUpdate={handleUpdate} />
          : <CustomizationForm portfolio={portfolio as any} userId={user?.id || ""} enabledFields={themeConfig.customizeFields} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "branding":
        return (
          <div className="space-y-4">
            <LogoUploadForm logoUrl={portfolio?.logo_url || null} brandName={(portfolio as any)?.brand_name || null} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />
            <FaviconUploadForm faviconUrl={(portfolio as any)?.favicon_url || null} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />
          </div>
        );
      case "skills":
        return <SkillsForm skills={skills} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "services":
        return <ServicesForm services={services} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "projects":
        return <ProjectsForm projects={projects} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "experience":
        return <ExperienceForm experiences={experiences} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "education":
        return <EducationForm education={education} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "social":
        return <SocialLinksForm socialLinks={socialLinks} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "seo":
        return <SeoSettingsForm portfolio={portfolio as any} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
    }
  };


  return (
    <div className="animate-fade-in text-white -mx-4 sm:-mx-6 -my-4 sm:-my-6">
      {/* Topbar */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-20">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">Edit Portfolio</h1>
          <p className="text-xs text-white/40 truncate">Theme · {activeTheme}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:hidden flex rounded-md border border-white/10 overflow-hidden">
            <button
              onClick={() => setMobileView("edit")}
              className={cn("px-3 py-1.5 text-xs", mobileView === "edit" ? "bg-white text-black" : "text-white/70")}
            >Edit</button>
            <button
              onClick={() => setMobileView("preview")}
              className={cn("px-3 py-1.5 text-xs", mobileView === "preview" ? "bg-white text-black" : "text-white/70")}
            >Preview</button>
          </div>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in new tab
            </a>
          )}
        </div>
      </div>

      {/* 3-column split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1.2fr)] h-[calc(100vh-9rem)] min-h-[640px]">
        {/* LEFT RAIL: section nav */}
        <aside
          className={cn(
            "border-r border-white/10 bg-black/30 overflow-y-auto",
            mobileView === "edit" ? "block" : "hidden lg:block"
          )}
        >
          <div className="px-4 pt-5 pb-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/35 font-medium">Sections</p>
          </div>
          <nav className="px-2 pb-4 space-y-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setActiveSection(s.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                    active
                      ? "bg-white text-black"
                      : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", active ? "text-black" : "text-white/50")} />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MIDDLE: control panel / form */}
        <section
          className={cn(
            "border-r border-white/10 bg-black/20 flex flex-col",
            mobileView === "edit" ? "flex" : "hidden lg:flex"
          )}
        >
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <ActiveIcon className="w-4 h-4 text-white/80" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight">{activeMeta?.label}</h2>
                {activeMeta?.hint && (
                  <p className="text-xs text-white/45 mt-0.5">{activeMeta.hint}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-2xl">
              {renderForm()}
            </div>
          </div>
        </section>

        {/* RIGHT: live preview */}
        <section
          className={cn(
            "bg-neutral-900 flex flex-col",
            mobileView === "preview" ? "flex" : "hidden lg:flex"
          )}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-white/10">
            <span className="text-xs text-white/45 font-medium">Live Preview</span>
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-md border border-white/10 overflow-hidden">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={cn("px-2.5 py-1.5", previewDevice === "desktop" ? "bg-white text-black" : "text-white/60 hover:text-white")}
                  title="Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={cn("px-2.5 py-1.5", previewDevice === "mobile" ? "bg-white text-black" : "text-white/60 hover:text-white")}
                  title="Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-white/60 hover:text-white hover:bg-white/5"
                onClick={refreshPreview}
                title="Refresh preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]">
            {previewUrl ? (
              <div
                className={cn(
                  "bg-white rounded-lg shadow-2xl overflow-hidden transition-all ring-1 ring-white/10",
                  previewDevice === "desktop" ? "w-full h-full" : "w-[390px] h-[760px] max-h-full"
                )}
              >
                <iframe
                  key={previewKey}
                  ref={iframeRef}
                  src={previewUrl}
                  title="Portfolio preview"
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="text-white/50 text-sm p-8">Set up your username to see a live preview.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
