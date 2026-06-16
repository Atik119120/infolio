import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User, Sparkles, Briefcase, GraduationCap, Link2, FolderOpen, Palette,
  Image as ImageIcon, Wrench, Search, Wand2, Monitor, Smartphone, Tablet,
  RefreshCw, ExternalLink, ArrowLeft, ChevronRight, Check, X, Eye, Loader2,
  Home, Rocket, Save, Type, Mail, EyeOff, MoreHorizontal,
} from "lucide-react";

import { SectionVisibilityForm } from "@/components/portfolio/SectionVisibilityForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BasicInfoForm } from "@/components/portfolio/BasicInfoForm";
import { SkillsForm } from "@/components/portfolio/SkillsForm";
import { ProjectsForm } from "@/components/portfolio/ProjectsForm";
import { ExperienceForm } from "@/components/portfolio/ExperienceForm";
import { EducationForm } from "@/components/portfolio/EducationForm";
import { SocialLinksForm } from "@/components/portfolio/SocialLinksForm";
import { ContactInfoForm, type ContactItem } from "@/components/portfolio/ContactInfoForm";
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
  | "hero" | "about" | "skills" | "services" | "projects"
  | "experience" | "education" | "branding" | "header" | "footer"
  | "contact" | "social" | "seo" | "customize" | "visibility";

type Stage = "theme" | "editor";
type Device = "desktop" | "tablet" | "mobile";

export default function PortfolioEdit() {
  const [stage, setStage] = useState<Stage>("theme");
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactItems, setContactItems] = useState<ContactItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<Device>("desktop");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const previewReadyRef = useRef(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const activeTheme = portfolio?.theme || "freelancer";
  const themeConfig = getThemeConfig(activeTheme);

  // Safety: never render the editor inside a preview iframe (prevents recursive nesting).
  useEffect(() => {
    if (typeof window !== "undefined" && window.top && window.self !== window.top) {
      const url = new URL(window.location.href);
      if (url.searchParams.get("preview") === "1") {
        // We were loaded inside the editor's own preview iframe — bail out.
        window.location.replace("/");
      }
    }
  }, []);

  useEffect(() => {
    if (user) fetchAllData();
  }, [user]);

  // Scroll preview to the active section (broadcast to all preview iframes)
  useEffect(() => {
    if (!previewReadyRef.current) return;
    const sectionToId: Record<string, string | "__top__" | "__bottom__"> = {
      hero: "__top__",
      header: "__top__",
      branding: "__top__",
      about: "about",
      skills: "skills",
      services: "services",
      projects: "projects",
      experience: "experience",
      education: "education",
      contact: "contact",
      social: "contact",
      footer: "__bottom__",
      seo: "__top__",
    };
    const target = sectionToId[activeSection];
    if (!target) return;
    try {
      document
        .querySelectorAll<HTMLIFrameElement>('iframe[data-preview="1"]')
        .forEach((f) =>
          f.contentWindow?.postMessage(
            { type: "lovable-preview-scroll", target },
            "*"
          )
        );
    } catch {}
  }, [activeSection]);

  // Lock body scroll while editor is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Push the latest snapshot into all preview iframes (no reload).
  const pushPreviewSnapshot = (snapshot?: {
    profile?: any; portfolio?: any; skills?: any[]; projects?: any[];
    experiences?: any[]; education?: any[]; socialLinks?: any[]; services?: any[]; contactItems?: any[];
  }) => {
    const payload = snapshot ?? {
      profile, portfolio, skills, projects, experiences, education, socialLinks, services, contactItems,
    };
    try {
      document
        .querySelectorAll<HTMLIFrameElement>('iframe[data-preview="1"]')
        .forEach((f) =>
          f.contentWindow?.postMessage(
            { type: "lovable-preview-update", payload },
            "*"
          )
        );
    } catch {}
  };

  // Listen for any iframe announcing it is ready to receive a snapshot.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e?.data?.type === "lovable-preview-ready") {
        previewReadyRef.current = true;
        pushPreviewSnapshot();
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  });

  const fetchAllData = async () => {
    if (!user) return;
    const [profileRes, portfolioRes, skillsRes, projectsRes, experiencesRes, educationRes, socialRes, servicesRes, contactRes] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("portfolios").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("skills").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("projects").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("experiences").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("education").select("*").eq("user_id", user.id).order("display_order"),
        supabase.from("social_links").select("*").eq("user_id", user.id).order("display_order"),
        (supabase as any).from("services").select("*").eq("user_id", user.id).order("display_order"),
        (supabase as any).from("contact_items").select("*").eq("user_id", user.id).order("display_order"),
      ]);
    const next = {
      profile: profileRes.data,
      portfolio: portfolioRes.data,
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      experiences: experiencesRes.data || [],
      education: educationRes.data || [],
      socialLinks: socialRes.data || [],
      services: servicesRes.data || [],
      contactItems: (contactRes as any).data || [],
    };
    if (next.profile) setProfile(next.profile);
    if (next.portfolio) {
      setPortfolio(next.portfolio);
      if (next.portfolio.theme && stage === "theme" && loading) {
        setStage("editor");
      }
    }
    setSkills(next.skills);
    setProjects(next.projects);
    setExperiences(next.experiences);
    setEducation(next.education);
    setSocialLinks(next.socialLinks);
    setServices(next.services);
    setContactItems(next.contactItems);
    setLoading(false);
    pushPreviewSnapshot(next);
    setSaveStatus("saved");
  };

  const handleUpdate = () => {
    setSaveStatus("saving");
    fetchAllData();
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

  // Map editor section -> anchor id rendered by themes
  const sectionAnchors: Partial<Record<SectionKey, string>> = {
    hero: "hero", about: "about", skills: "skills", services: "services",
    projects: "projects", experience: "experience", education: "education",
    contact: "contact",
  };
  const previewHrefFor = (key: SectionKey) => {
    const id = sectionAnchors[key];
    return previewUrl ? (id ? `${previewUrl}#${id}` : previewUrl) : null;
  };

  // Auto-scroll preview iframe to the active section (same-origin)
  useEffect(() => {
    const iframe = iframeRef.current;
    const id = sectionAnchors[activeSection];
    if (!iframe || !id) return;
    const scroll = () => {
      try {
        const doc = iframe.contentDocument;
        const el = doc?.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    };
    scroll();
    const t = setTimeout(scroll, 400);
    return () => clearTimeout(t);
  }, [activeSection]);


  const allSections: { value: SectionKey; label: string; icon: any; hint: string; requires?: string }[] = [
    { value: "hero", label: "Hero Section", icon: Home, hint: "Main landing area", requires: "customize" },
    { value: "about", label: "About Me", icon: User, hint: "Personal introduction", requires: "basic" },
    { value: "skills", label: "Skills", icon: Sparkles, hint: "Tools and expertise" },
    { value: "services", label: "Services", icon: Wrench, hint: "What you offer" },
    { value: "projects", label: "Projects", icon: FolderOpen, hint: "Showcase your work" },
    { value: "experience", label: "Experience", icon: Briefcase, hint: "Work history" },
    { value: "education", label: "Education", icon: GraduationCap, hint: "Your education" },
    { value: "branding", label: "Branding", icon: ImageIcon, hint: "Favicon", requires: "branding" },
    { value: "header", label: "Header Settings", icon: Palette, hint: "Logo & brand name", requires: "branding" },
    { value: "footer", label: "Footer Settings", icon: Type, hint: "Footer text", requires: "customize" },
    { value: "contact", label: "Contact Info", icon: Mail, hint: "Email, phone, custom fields", requires: "social" },
    { value: "social", label: "Social Links", icon: Link2, hint: "Your social profiles" },
    { value: "visibility", label: "Sections (Show/Hide)", icon: EyeOff, hint: "Toggle sections on or off" },
    { value: "seo", label: "SEO", icon: Rocket, hint: "Search visibility" },
  ];
  const sections = allSections.filter((s) => {
    if (s.value === "visibility") return true;
    const need = s.requires ?? s.value;
    return themeConfig.tabs.includes(need);
  });
  const activeMeta = sections.find((s) => s.value === activeSection) ?? sections[0];

  // Ensure active section is valid for current theme
  useEffect(() => {
    if (!loading && !sections.some((s) => s.value === activeSection) && sections[0]) {
      setActiveSection(sections[0].value);
    }
  }, [loading, activeTheme]);

  const renderForm = () => {
    switch (activeSection) {
      case "about":
        return <BasicInfoForm profile={profile} portfolio={portfolio} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "hero":
        return activeTheme === "custom-code"
          ? <CustomCodeForm portfolio={portfolio as any} userId={user?.id || ""} onUpdate={handleUpdate} />
          : <CustomizationForm portfolio={portfolio as any} userId={user?.id || ""} enabledFields={themeConfig.customizeFields} scope="hero" onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "footer":
        return <CustomizationForm portfolio={portfolio as any} userId={user?.id || ""} enabledFields={themeConfig.customizeFields} scope="footer" onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "header":
        return <LogoUploadForm logoUrl={portfolio?.logo_url || null} brandName={(portfolio as any)?.brand_name || null} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "branding":
        return <FaviconUploadForm faviconUrl={(portfolio as any)?.favicon_url || null} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
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
      case "contact":
        return <ContactInfoForm portfolio={portfolio} contactItems={contactItems} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "social":
        return <SocialLinksForm socialLinks={socialLinks} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "seo":
        return <SeoSettingsForm portfolio={portfolio as any} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
      case "visibility":
        return <SectionVisibilityForm portfolio={portfolio as any} userId={user?.id || ""} onUpdate={handleUpdate} onSuccess={showSuccess} onError={showError} />;
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
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col text-white overflow-hidden font-sans antialiased">
      {/* TOP HEADER */}
      <header className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-[#1f1f1f] bg-[#0A0A0A]">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-[13px] text-[#A1A1AA] hover:text-white transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="h-4 w-px bg-[#262626]" />
          <span className="text-[13px] font-medium tracking-tight">Portfolio Builder</span>
          <button
            onClick={() => setStage("theme")}
            className="hidden md:inline-flex items-center text-[12px] text-[#71717A] hover:text-white transition-colors duration-150"
          >
            <span className="text-[#52525B] mr-1">·</span>
            Theme: <span className="capitalize ml-1 text-[#A1A1AA]">{activeTheme.replace(/-/g, " ")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[12px] text-[#71717A] mr-2">
            {saveStatus === "saving" ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Saving…</>
            ) : saveStatus === "unsaved" ? (
              <>Unsaved changes</>
            ) : (
              <><Check className="w-3 h-3" /> Saved</>
            )}
          </span>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] px-3 h-8 rounded-md border border-[#262626] text-[#A1A1AA] hover:text-white hover:border-[#3f3f3f] transition-all duration-150"
            >
              Preview
            </a>
          )}
          <button
            onClick={handlePublishToggle}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 text-[12px] px-3.5 h-8 rounded-md bg-white text-black hover:bg-[#f4f4f5] font-medium transition-all duration-150 disabled:opacity-50"
          >
            {publishing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : portfolio?.is_published ? (
              "Published"
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-[#1f1f1f] bg-[#111111]">
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {sections.map((s) => {
              const active = activeSection === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setActiveSection(s.value)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-md text-[13px] text-left transition-colors duration-150",
                    active
                      ? "bg-[#181818] text-white"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#181818]/60"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-150",
                      active ? "bg-white" : "bg-transparent"
                    )}
                  />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* EDITOR PANEL (~25%) */}
        <section className="hidden lg:flex w-[340px] shrink-0 flex-col border-r border-[#1f1f1f] bg-[#0A0A0A]">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-[15px] font-semibold tracking-tight text-white">
              {activeMeta?.label}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6 portfolio-minimal-form">
            {renderForm()}
          </div>
        </section>

        {/* MOBILE: editor + sticky bottom nav (PicsArt/Canva/CapCut style) */}
        <MobilePortfolioEditor
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeMeta={activeMeta}
          renderForm={renderForm}
          previewHrefFor={previewHrefFor}
        />



        {/* PREVIEW (~75%) */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0A0A0A]">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 p-0.5 rounded-md bg-[#111111] border border-[#262626]">
            {([
              { d: "desktop", Icon: Monitor },
              { d: "tablet", Icon: Tablet },
              { d: "mobile", Icon: Smartphone },
            ] as const).map(({ d, Icon }) => (
              <button
                key={d}
                onClick={() => setPreviewDevice(d)}
                className={cn(
                  "px-2 py-1 rounded transition-colors duration-150",
                  previewDevice === d
                    ? "bg-[#181818] text-white"
                    : "text-[#71717A] hover:text-white"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            <div className="w-px h-4 bg-[#262626] mx-0.5" />
            <button
              onClick={() => { iframeRef.current && (iframeRef.current.src = iframeRef.current.src); }}
              className="px-2 py-1 rounded text-[#71717A] hover:text-white transition-colors duration-150"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute inset-0 flex items-stretch justify-center p-6 pt-16 overflow-auto">
            {previewUrl ? (
              <div
                className={cn(
                  "bg-white rounded-lg overflow-hidden border border-[#262626] transition-all duration-200",
                  previewDevice === "desktop" ? "w-full h-full" : "h-full"
                )}
                style={{
                  width: previewDevice === "desktop" ? "100%" : deviceWidth[previewDevice],
                  maxWidth: "100%",
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={previewUrl}
                  title="Portfolio preview"
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="text-[#71717A] text-sm flex items-center justify-center w-full">
                Set up your username to see a live preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mobile editor (bottom-nav style) ---------------- */
type SectionMeta = { value: SectionKey; label: string; icon: any; hint: string; requires?: string };

const PRIMARY_KEYS: SectionKey[] = ["hero", "about", "skills", "services", "projects"];

function MobilePortfolioEditor({
  sections, activeSection, setActiveSection, activeMeta, renderForm, previewHrefFor,
}: {
  sections: SectionMeta[];
  activeSection: SectionKey;
  setActiveSection: (k: SectionKey) => void;
  activeMeta: SectionMeta | undefined;
  renderForm: () => React.ReactNode;
  previewHrefFor: (k: SectionKey) => string | null;
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  // Build primary tabs from what the active theme actually exposes
  const available = new Set(sections.map((s) => s.value));
  const primary: SectionMeta[] = PRIMARY_KEYS
    .filter((k) => available.has(k))
    .map((k) => sections.find((s) => s.value === k)!)
    .slice(0, 5);
  const primarySet = new Set(primary.map((s) => s.value));
  const moreItems = sections.filter((s) => !primarySet.has(s.value));
  const isMoreActive = !primarySet.has(activeSection);

  const tap = (k: SectionKey) => {
    setActiveSection(k);
    setMoreOpen(false);
  };

  return (
    <section className="lg:hidden w-full flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden relative">
      {/* Editor header */}
      <div className="shrink-0 px-5 pt-4 pb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {activeMeta?.icon && <activeMeta.icon className="w-4 h-4 text-[#A1A1AA] shrink-0" />}
          <h2 className="text-[14px] font-semibold tracking-tight truncate">{activeMeta?.label}</h2>
        </div>
        {previewHrefFor(activeSection) && (
          <a
            href={previewHrefFor(activeSection)!}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-white shrink-0"
          >
            <Eye className="w-3 h-3" /> Preview
          </a>
        )}
      </div>

      {/* Form scroll area — bottom padding clears the sticky nav */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+88px)] portfolio-minimal-form">
        {renderForm()}
      </div>

      {/* Sticky bottom navigation */}
      <nav
        className="absolute bottom-0 inset-x-0 z-20 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#1f1f1f] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-6 h-16">
          {primary.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.value;
            return (
              <button
                key={s.value}
                onClick={() => tap(s.value)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors duration-150 relative",
                  active ? "text-white" : "text-[#71717A] hover:text-white"
                )}
              >
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white" />}
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[10px] font-medium leading-none">{s.label.split(" ")[0]}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors duration-150 relative",
              isMoreActive || moreOpen ? "text-white" : "text-[#71717A] hover:text-white"
            )}
          >
            {(isMoreActive || moreOpen) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white" />}
            <MoreHorizontal className="w-[18px] h-[18px]" />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* More sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="h-auto max-h-[75vh] p-0 bg-[#0A0A0A] border-t border-[#1f1f1f] text-white rounded-t-2xl"
        >
          <SheetHeader className="px-5 pt-4 pb-2 text-left">
            <SheetTitle className="text-white text-[15px] font-semibold tracking-tight">More sections</SheetTitle>
            <SheetDescription className="text-[#71717A] text-[12px]">
              Tap a section to start editing.
            </SheetDescription>
          </SheetHeader>
          <div className="px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2 overflow-y-auto">
            {moreItems.length === 0 ? (
              <div className="px-3 py-8 text-center text-[12px] text-[#71717A]">
                No additional sections for this theme.
              </div>
            ) : (
              <div className="grid grid-cols-1 divide-y divide-[#161616]">
                {moreItems.map((s) => {
                  const Icon = s.icon;
                  const active = activeSection === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => tap(s.value)}
                      className={cn(
                        "flex items-center gap-3 px-3 h-14 text-left transition-colors duration-150 rounded-md",
                        active ? "bg-[#181818] text-white" : "text-[#D4D4D8] hover:bg-[#141414]"
                      )}
                    >
                      <span className={cn(
                        "w-9 h-9 rounded-md inline-flex items-center justify-center shrink-0",
                        active ? "bg-white text-black" : "bg-[#141414] text-[#A1A1AA]"
                      )}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-medium truncate">{s.label}</span>
                        <span className="block text-[11px] text-[#71717A] truncate">{s.hint}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#52525B]" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

