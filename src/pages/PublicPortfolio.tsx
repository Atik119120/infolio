import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioHead } from "@/hooks/usePortfolioHead";
import { trackView } from "@/lib/trackView";

import {
  FreelancerTheme,
  SmallBusinessTheme,
  PRDGraphicDesignerTheme,
  CreativeCanvasTheme,
  PRDPhotographerTheme,
  PRDDigitalMarketerTheme,
  BiographyTheme,
  CustomCodeTheme,
  AdminUploadedTheme,
  CreativeSidebarProTheme,
  DarkPhotographerTheme,
  ThemeProfile,
  ThemePortfolio,
  ThemeSkill,
  ThemeProject,
  ThemeExperience,
  ThemeEducation,
  ThemeSocialLink,
} from "@/components/portfolio/themes";

export default function PublicPortfolio() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ThemeProfile | null>(null);
  const [portfolio, setPortfolio] = useState<ThemePortfolio | null>(null);
  const [skills, setSkills] = useState<ThemeSkill[]>([]);
  const [projects, setProjects] = useState<ThemeProject[]>([]);
  const [experiences, setExperiences] = useState<ThemeExperience[]>([]);
  const [education, setEducation] = useState<ThemeEducation[]>([]);
  const [socialLinks, setSocialLinks] = useState<ThemeSocialLink[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [contactItems, setContactItems] = useState<any[]>([]);

  usePortfolioHead({ portfolio, displayName: profile?.display_name });

  useEffect(() => {
    if (username) fetchPortfolio();
  }, [username]);

  // Live preview channel: listen for postMessage from the editor (PortfolioEdit)
  // when this page is rendered inside an iframe with ?preview=1. Merge updates
  // into state without remounting → keeps scroll, theme, and SPA state intact.
  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).get("preview") === "1";
    if (!isPreview) return;
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "lovable-preview-scroll") {
        const t = msg.target as string;
        if (t === "__top__") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (t === "__bottom__") {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          return;
        }
        const el = document.getElementById(t);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // brief highlight
          el.style.transition = "box-shadow 300ms ease";
          el.style.boxShadow = "inset 0 0 0 3px rgba(99,102,241,0.45)";
          setTimeout(() => { el.style.boxShadow = ""; }, 900);
        } else {
          // Fallback: scroll to top if section not present in this theme
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      if (msg.type !== "lovable-preview-update") return;
      const d = msg.payload || {};
      if (d.profile) setProfile((p) => ({ ...(p || {} as any), ...d.profile }));
      if (d.portfolio) setPortfolio((p) => ({ ...(p || {} as any), ...d.portfolio }));
      if (Array.isArray(d.skills)) setSkills(d.skills);
      if (Array.isArray(d.projects)) setProjects(d.projects);
      if (Array.isArray(d.experiences)) setExperiences(d.experiences);
      if (Array.isArray(d.education)) setEducation(d.education);
      if (Array.isArray(d.socialLinks)) setSocialLinks(d.socialLinks);
      if (Array.isArray(d.services)) setServices(d.services);
      if (Array.isArray(d.contactItems)) setContactItems(d.contactItems);
    };
    window.addEventListener("message", handler);
    try { window.parent?.postMessage({ type: "lovable-preview-ready" }, "*"); } catch {}
    return () => window.removeEventListener("message", handler);
  }, []);


  const fetchPortfolio = async () => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchedUserId = profileData.user_id;
    setUserId(fetchedUserId);
    trackView({ ownerId: fetchedUserId, pageType: "portfolio", slug: username });

    const { data: portfolioData } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", fetchedUserId)
      .maybeSingle();

    const isPreview = new URLSearchParams(window.location.search).get("preview") === "1";
    if (!portfolioData) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    if (!portfolioData.is_published && !isPreview) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const [skillsRes, projectsRes, experiencesRes, educationRes, socialRes, servicesRes, contactRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", fetchedUserId).order("created_at"),
      supabase.from("projects").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("experiences").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("education").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("social_links").select("*").eq("user_id", fetchedUserId).order("display_order"),
      (supabase as any).from("services").select("*").eq("user_id", fetchedUserId).order("display_order"),
      (supabase as any).from("contact_items").select("*").eq("user_id", fetchedUserId).order("display_order"),
    ]);

    setProfile(profileData);
    setPortfolio(portfolioData);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (experiencesRes.data) setExperiences(experiencesRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);
    if (servicesRes.data) setServices(servicesRes.data);
    if ((contactRes as any).data) setContactItems((contactRes as any).data);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This portfolio doesn't exist or hasn't been published yet.
          </p>
          <Button onClick={() => window.location.href = "/"}>Go Home</Button>
        </div>
      </div>
    );
  }

  const themeProps = {
    profile,
    portfolio,
    skills,
    projects,
    experiences,
    education,
    socialLinks,
    services,
    contactItems,
    userId: userId || undefined,
  } as any;

  const selectedTheme = portfolio?.theme || 'freelancer';

  // Admin-uploaded custom themes use the prefix `admin:` followed by the slug
  if (selectedTheme.startsWith('admin:')) {
    const slug = selectedTheme.slice('admin:'.length);
    return <AdminUploadedTheme slug={slug} {...themeProps} />;
  }

  switch (selectedTheme) {
    case 'small-business':
      return <SmallBusinessTheme {...themeProps} />;
    case 'prd-graphic-designer':
      return <PRDGraphicDesignerTheme {...themeProps} />;
    case 'prd-photographer':
      return <PRDPhotographerTheme {...themeProps} />;
    case 'prd-digital-marketer':
      return <PRDDigitalMarketerTheme {...themeProps} />;
    case 'biography':
      return <BiographyTheme {...themeProps} />;
    case 'custom-code':
      return <CustomCodeTheme {...themeProps} />;
    case 'creative-sidebar-pro':
      return <CreativeSidebarProTheme {...themeProps} />;
    case 'dark-photographer':
      return <DarkPhotographerTheme {...themeProps} />;
    case 'creative-canvas':
      return <CreativeCanvasTheme {...themeProps} />;
    case 'freelancer':
    default:
      return <FreelancerTheme {...themeProps} />;
  }
}
