import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PhotographerTheme,
  GraphicDesignerTheme,
  VideoEditorTheme,
  DigitalMarketerTheme,
  WebDeveloperTheme,
  OfficialTheme,
  PersonalTheme,
  CosmicTheme,
  ThemeProfile,
  ThemePortfolio,
  ThemeSkill,
  ThemeProject,
  ThemeExperience,
  ThemeEducation,
  ThemeSocialLink,
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
    
    // Skip subdomain detection for localhost and preview URLs
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("lovable.app") ||
      hostname.includes("lovable.dev")
    ) {
      setIsChecking(false);
      return;
    }

    // Check if hostname matches pattern: subdomain.maindomain.tld
    const mainDomainLower = mainDomain.toLowerCase();
    const hostnameLower = hostname.toLowerCase();

    // If hostname ends with main domain and has something before it
    if (hostnameLower.endsWith(mainDomainLower)) {
      const prefix = hostnameLower.replace(mainDomainLower, "").replace(/\.$/, "");
      
      // If there's a prefix and it's not "www"
      if (prefix && prefix !== "www" && prefix !== "") {
        setSubdomain(prefix);
      }
    }
    
    setIsChecking(false);
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

    if (!portfolioData?.is_published) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const [skillsRes, projectsRes, experiencesRes, educationRes, socialRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("projects").select("*").eq("user_id", userId).order("display_order"),
      supabase.from("experiences").select("*").eq("user_id", userId).order("display_order"),
      supabase.from("education").select("*").eq("user_id", userId).order("display_order"),
      supabase.from("social_links").select("*").eq("user_id", userId).order("display_order"),
    ]);

    setProfile(profileData);
    setPortfolio(portfolioData);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (experiencesRes.data) setExperiences(experiencesRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);

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
  };

  const selectedTheme = portfolio?.theme || 'personal';

  switch (selectedTheme) {
    case 'photographer':
      return <PhotographerTheme {...themeProps} />;
    case 'graphic-designer':
      return <GraphicDesignerTheme {...themeProps} />;
    case 'video-editor':
      return <VideoEditorTheme {...themeProps} />;
    case 'digital-marketer':
      return <DigitalMarketerTheme {...themeProps} />;
    case 'web-developer':
      return <WebDeveloperTheme {...themeProps} />;
    case 'official':
      return <OfficialTheme {...themeProps} />;
    case 'cosmic':
      return <CosmicTheme {...themeProps} />;
    case 'personal':
    default:
      return <PersonalTheme {...themeProps} />;
  }
}
