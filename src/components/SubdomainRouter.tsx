import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioHead } from "@/hooks/usePortfolioHead";
import {
  FreelancerTheme,
  SmallBusinessTheme,
  PRDGraphicDesignerTheme,
  PRDPhotographerTheme,
  PRDDigitalMarketerTheme,
  BiographyTheme,
  CreativeSidebarProTheme,
  DarkPhotographerTheme,
  ThemeProfile,
  ThemePortfolio,
  ThemeSkill,
  ThemeProject,
  ThemeExperience,
  ThemeEducation,
  ThemeSocialLink,
  ThemeService,
} from "@/components/portfolio/themes";

interface SubdomainRouterProps {
  children: React.ReactNode;
  mainDomain: string; // e.g., "portfoliohub.com" or "yourdomain.com"
}

/**
 * SubdomainRouter detects if the user is accessing via a subdomain
 * e.g., username.portfoliohub.com -> loads that user's portfolio
 * 
 * For this to work in production:
 * 1. Configure wildcard DNS: *.yourdomain.com -> your server IP
 * 2. Configure wildcard SSL certificate
 */
export default function SubdomainRouter({ children, mainDomain }: SubdomainRouterProps) {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;

    // Skip detection for localhost and Lovable preview/staging URLs
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("lovable.app") ||
      hostname.includes("lovable.dev")
    ) {
      setIsChecking(false);
      return;
    }

    const mainDomainLower = mainDomain.toLowerCase();
    const hostnameLower = hostname.toLowerCase();

    // 1) Platform deployment subdomain: <prefix>.infolio.online
    if (hostnameLower.endsWith("." + mainDomainLower)) {
      const prefix = hostnameLower.slice(0, hostnameLower.length - mainDomainLower.length - 1);
      if (prefix && prefix !== "www" && !prefix.includes(".") && /^[a-z0-9-]+$/.test(prefix)) {
        (async () => {
          const { data } = await (supabase as any).rpc("resolve_active_deployment", { _hostname: hostnameLower });
          const resolvedUsername = Array.isArray(data) ? data[0]?.username : data?.username;
          setSubdomain(resolvedUsername || prefix);
          setIsChecking(false);
        })();
        return;
      }
      // Root domain (or www) — show normal app
      setIsChecking(false);
      return;
    }

    // 2) Custom domain: lookup verified domain → username
    (async () => {
      const candidates = [hostnameLower, hostnameLower.replace(/^www\./, "")];
      const { data: domainRow } = await supabase
        .from("domains")
        .select("user_id")
        .in("domain", candidates)
        .eq("is_verified", true)
        .maybeSingle();

      if (domainRow?.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", domainRow.user_id)
          .maybeSingle();
        if (profile?.username) {
          setSubdomain(profile.username);
        }
      }
      setIsChecking(false);
    })();
  }, [mainDomain]);

  // While checking, show nothing (prevents flash)
  if (isChecking) {
    return null;
  }

  // If subdomain detected, render the portfolio directly
  if (subdomain) {
    return <SubdomainPortfolio username={subdomain} />;
  }

  // Otherwise, render normal app routes
  return <>{children}</>;
}

// Component that loads portfolio for subdomain username
function SubdomainPortfolio({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<ThemeProfile | null>(null);
  const [portfolio, setPortfolio] = useState<ThemePortfolio | null>(null);
  const [skills, setSkills] = useState<ThemeSkill[]>([]);
  const [projects, setProjects] = useState<ThemeProject[]>([]);
  const [experiences, setExperiences] = useState<ThemeExperience[]>([]);
  const [education, setEducation] = useState<ThemeEducation[]>([]);
  const [socialLinks, setSocialLinks] = useState<ThemeSocialLink[]>([]);
  const [services, setServices] = useState<ThemeService[]>([]);
  const [contactItems, setContactItems] = useState<any[]>([]);

  usePortfolioHead({ portfolio, displayName: profile?.display_name });

  useEffect(() => {
    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const fetchPortfolio = async () => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url, email")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const userId = profileData.user_id;

    const { data: portfolioData } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const isPreview = new URLSearchParams(window.location.search).get("preview") === "1";
    if (!portfolioData?.is_published && !isPreview) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const [skillsRes, projectsRes, experiencesRes, educationRes, socialRes, servicesRes, contactRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("projects").select("*").eq("user_id", userId).order("display_order"),
      supabase.from("experiences").select("*").eq("user_id", userId).order("display_order"),
      supabase.from("education").select("*").eq("user_id", userId).order("display_order"),
      supabase.from("social_links").select("*").eq("user_id", userId).order("display_order"),
      (supabase as any).from("services").select("*").eq("user_id", userId).order("display_order"),
      (supabase as any).from("contact_items").select("*").eq("user_id", userId).order("display_order"),
    ]);

    setProfile(profileData);
    setPortfolio(portfolioData);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (experiencesRes.data) setExperiences(experiencesRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);
    if ((servicesRes as any).data) setServices((servicesRes as any).data);
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
  };

  const selectedTheme = portfolio?.theme || 'freelancer';

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
    case 'creative-sidebar-pro':
      return <CreativeSidebarProTheme {...themeProps} />;
    case 'dark-photographer':
      return <DarkPhotographerTheme {...themeProps} />;
    case 'freelancer':
    default:
      return <FreelancerTheme {...themeProps} />;
  }
}
