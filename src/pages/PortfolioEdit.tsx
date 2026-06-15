import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User, Sparkles, Briefcase, GraduationCap, Link2, FolderOpen, Palette,
  Image as ImageIcon, Wrench, Search, Wand2, Monitor, Smartphone, Tablet,
  RefreshCw, ExternalLink, ArrowLeft, ChevronRight, Check, X, Eye, Loader2,
  Home, Rocket, Save,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
  | "basic" | "customize" | "branding" | "skills" | "services"
  | "projects" | "experience" | "education" | "social" | "seo";

type Stage = "theme" | "editor";
type Device = "desktop" | "tablet" | "mobile";

export default function PortfolioEdit() {
  const [stage, setStage] = useState<Stage>("theme");
  const [activeSection, setActiveSection] = useState<SectionKey>("basic");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<Device>("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const activeTheme = portfolio?.theme || "freelancer";
  const themeConfig = getThemeConfig(activeTheme);

  useEffect(() => {
    if (user) fetchAllData();
  }, [user]);

  // Lock body scroll while editor is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

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
    if (portfolioRes.data) {
      setPortfolio(portfolioRes.data);
      // If a theme is already chosen, skip directly to editor on first load
      if (portfolioRes.data.theme && stage === "theme" && loading) {
        setStage("editor");
      }
    }
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
    setTimeout(refreshPreview, 400);
  };
  const showSuccess = (message: string) => toast({ title: "Success", description: message });
  const showError = (message: string) => toast({ variant: "destructive", title: "Error", description: message });

  const handlePublishToggle = async () => {
    if (!user || !portfolio) return;
    setPublishing(true);
    const newState = !portfolio.is_published;
    const { error } = await supabase
      .from("portfolios")
      .update({ is_published: newState })
      .eq("user_id", user.id);
    setPublishing(false);
    if (error) showError(error.message);
    else {
      showSuccess(newState ? "Portfolio published" : "Portfolio unpublished");
      handleUpdate();
    }
  };

  const username = profile?.username;
  const previewUrl = username ? `/u/${username}?preview=1` : null;

  const allSections: { value: SectionKey; label: string; icon: any; hint: string }[] = [
    { value: "customize", label: "Hero Section", icon: Home, hint: "Main landing area" },
    { value: "basic", label: "About Me", icon: User, hint: "Personal introduction" },
    { value: "skills", label: "Skills", icon: Sparkles, hint: "Tools and expertise" },
    { value: "services", label: "Services", icon: Wrench, hint: "What you offer" },
    { value: "projects", label: "Projects", icon: FolderOpen, hint: "Showcase your work" },
    { value: "experience", label: "Experience", icon: Briefcase, hint: "Work history" },
    { value: "education", label: "Education", icon: GraduationCap, hint: "Your education" },
    { value: "branding", label: "Branding", icon: ImageIcon, hint: "Logo and favicon" },
    { value: "social", label: "Social Links", icon: Link2, hint: "Your social profiles" },
    { value: "seo", label: "SEO", icon: Rocket, hint: "Search visibility" },
  ];
  const sections = allSections.filter((s) => themeConfig.tabs.includes(s.value));
  const activeMeta = sections.find((s) => s.value === activeSection) ?? sections[0];

  // Ensure active section is valid for current theme
  useEffect(() => {
    if (!loading && !sections.some((s) => s.value === activeSection) && sections[0]) {
      setActiveSection(sections[0].value);
    }
  }, [loading, activeTheme]);

  const renderForm = () => {
    switch (activeSection) {
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  // ===== STAGE 1: THEME SELECTION =====
  if (stage === "theme") {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col text-white overflow-hidden">
        {/* Top header */}
        <header className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-medium">Choose a Theme</span>
          </div>
          {portfolio?.theme && (
            <Button
              size="sm"
              onClick={() => setStage("editor")}
              className="h-8 px-4 bg-white text-black hover:bg-white/90 text-xs font-medium gap-1.5"
            >
              Edit Portfolio <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </header>

        {/* Theme picker body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="mb-8 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mb-3">Step 1 of 2</p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Pick a theme to begin</h1>
              <p className="text-sm text-white/50 mt-2">Select the look, then we'll open the editor.</p>
            </div>
            <ThemeSelector
              currentTheme={portfolio?.theme || null}
              userId={user?.id || ""}
              onUpdate={handleUpdate}
            />
            {portfolio?.theme && (
              <div className="sticky bottom-4 mt-10 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => setStage("editor")}
                  className="bg-white text-black hover:bg-white/90 font-medium gap-2 shadow-2xl shadow-white/10"
                >
                  Continue to Editor <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== STAGE 2: EDITOR =====
  const deviceWidth: Record<Device, string> = {
    desktop: "100%",
    tablet: "820px",
    mobile: "390px",
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col text-white overflow-hidden">
      {/* TOP HEADER */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-8 h-8 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-white/10" />
          <button
            onClick={() => setStage("theme")}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/5 transition-colors group"
          >
            <Palette className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80" />
            <span className="text-sm font-medium capitalize">{activeTheme.replace(/-/g, " ")}</span>
            <span className="text-[10px] text-white/40 group-hover:text-white/60">Change</span>
          </button>
        </div>

        {/* Center: device toggles */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          {([
            { d: "desktop", Icon: Monitor },
            { d: "tablet", Icon: Tablet },
            { d: "mobile", Icon: Smartphone },
          ] as const).map(({ d, Icon }) => (
            <button
              key={d}
              onClick={() => setPreviewDevice(d)}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all",
                previewDevice === d ? "bg-white text-black" : "text-white/50 hover:text-white"
              )}
              title={d}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPreview}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 h-8 rounded-md border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </a>
          )}
          <Button
            size="sm"
            onClick={handlePublishToggle}
            disabled={publishing}
            className={cn(
              "h-8 px-3.5 text-xs font-medium gap-1.5",
              portfolio?.is_published
                ? "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                : "bg-white text-black hover:bg-white/90"
            )}
          >
            {publishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : portfolio?.is_published ? (
              <><Check className="w-3.5 h-3.5" /> Published</>
            ) : (
              <>Publish</>
            )}
          </Button>
        </div>
      </header>

      {/* BODY: full-bleed preview with floating glass panel */}
      <div className="flex-1 relative overflow-hidden bg-[#111] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)]">
        {/* Full-bleed preview */}
        <div className="absolute inset-0 flex items-stretch justify-center p-4 lg:pl-[calc(360px+2rem)] lg:pr-6 overflow-auto">
          {previewUrl ? (
            <div
              className={cn(
                "bg-white rounded-xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10 transition-all duration-300",
                previewDevice === "desktop" ? "w-full" : "h-full"
              )}
              style={{
                width: previewDevice === "desktop" ? "100%" : deviceWidth[previewDevice],
                maxWidth: "100%",
              }}
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
            <div className="text-white/50 text-sm flex items-center justify-center w-full">
              Set up your username to see a live preview.
            </div>
          )}
        </div>

        {/* Floating glass editor panel */}
        <aside
          className={cn(
            "absolute top-4 bottom-4 left-4 w-[340px] z-10 flex flex-col rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60 backdrop-blur-2xl bg-[rgba(15,15,17,0.85)] transition-transform duration-300",
            panelOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
          )}
        >
          {/* Section icon rail at top */}
          <div className="flex items-center gap-1 px-2 py-2 border-b border-white/[0.06] overflow-x-auto scrollbar-none">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setActiveSection(s.value)}
                  title={s.label}
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                    active
                      ? "bg-white text-black"
                      : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Section header */}
          <div className="px-5 pt-4 pb-3 border-b border-white/[0.05]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-medium">
              Editing
            </p>
            <h2 className="text-base font-semibold tracking-tight mt-0.5">
              {activeMeta?.label}
            </h2>
            <p className="text-xs text-white/45 mt-0.5">{activeMeta?.hint}</p>
          </div>

          {/* Form scroll area */}
          <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin">
            {renderForm()}
          </div>

          {/* Section nav footer (prev/next) */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-white/[0.06]">
            <button
              onClick={() => {
                const i = sections.findIndex((s) => s.value === activeSection);
                if (i > 0) setActiveSection(sections[i - 1].value);
              }}
              disabled={sections[0]?.value === activeSection}
              className="text-xs text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1"
            >
              ← Prev
            </button>
            <span className="text-[10px] text-white/30">
              {sections.findIndex((s) => s.value === activeSection) + 1} / {sections.length}
            </span>
            <button
              onClick={() => {
                const i = sections.findIndex((s) => s.value === activeSection);
                if (i < sections.length - 1) setActiveSection(sections[i + 1].value);
              }}
              disabled={sections[sections.length - 1]?.value === activeSection}
              className="text-xs text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1"
            >
              Next →
            </button>
          </div>
        </aside>

        {/* Toggle button when panel hidden */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-20 w-7 h-16 rounded-r-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 border-l-0 flex items-center justify-center transition-all",
            panelOpen ? "left-[calc(340px+1rem)]" : "left-0"
          )}
          title={panelOpen ? "Hide panel" : "Show panel"}
        >
          <ChevronRight className={cn("w-3.5 h-3.5 text-white/70 transition-transform", panelOpen && "rotate-180")} />
        </button>
      </div>
    </div>
  );
}
