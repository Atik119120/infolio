import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Theme imports
import {
  PhotographerTheme,
  GraphicDesignerTheme,
  GraphicDesignerProTheme,
  GraphicDesignerEliteTheme,
  VideoEditorTheme,
  DigitalMarketerTheme,
  WebDeveloperTheme,
  WebDeveloperProTheme,
  WebDeveloperEliteTheme,
  OfficialTheme,
  PersonalTheme,
  CosmicTheme,
  SimpleTheme,
  FreelancerTheme,
  SmallBusinessTheme,
  PRDGraphicDesignerTheme,
  PRDPhotographerTheme,
  PRDDigitalMarketerTheme,
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

  // Set favicon when portfolio loads
  useEffect(() => {
    if (portfolio?.favicon_url) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (link) {
        link.href = portfolio.favicon_url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = portfolio.favicon_url;
        document.head.appendChild(newLink);
      }
    }
    
    // Set page title
    if (profile?.display_name) {
      document.title = `${profile.display_name} | Portfolio`;
    }

    // Cleanup - restore default favicon on unmount
    return () => {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (link) {
        link.href = '/favicon.ico';
      }
      document.title = 'Alpha Portfolio';
    };
  }, [portfolio?.favicon_url, profile?.display_name]);

  useEffect(() => {
    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const fetchPortfolio = async () => {
    // Only select non-sensitive profile fields for public view
    // Excludes email and phone_number to prevent PII exposure
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchedUserId = profileData.user_id;
    setUserId(fetchedUserId);

    const { data: portfolioData } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", fetchedUserId)
      .maybeSingle();

    if (!portfolioData?.is_published) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const [skillsRes, projectsRes, experiencesRes, educationRes, socialRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", fetchedUserId).order("created_at"),
      supabase.from("projects").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("experiences").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("education").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("social_links").select("*").eq("user_id", fetchedUserId).order("display_order"),
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
    userId: userId || undefined,
  };

  // Get theme from portfolio or default to 'simple'
  const selectedTheme = portfolio?.theme || 'simple';

  // Render the appropriate theme
  switch (selectedTheme) {
    case 'simple':
      return <SimpleTheme {...themeProps} />;
    case 'freelancer':
      return <FreelancerTheme {...themeProps} />;
    case 'small-business':
      return <SmallBusinessTheme {...themeProps} />;
    case 'prd-graphic-designer':
      return <PRDGraphicDesignerTheme {...themeProps} />;
    case 'prd-photographer':
      return <PRDPhotographerTheme {...themeProps} />;
    case 'prd-digital-marketer':
      return <PRDDigitalMarketerTheme {...themeProps} />;
    case 'photographer':
      return <PhotographerTheme {...themeProps} />;
    case 'graphic-designer':
      return <GraphicDesignerTheme {...themeProps} />;
    case 'graphic-designer-pro':
      return <GraphicDesignerProTheme {...themeProps} />;
    case 'graphic-designer-elite':
      return <GraphicDesignerEliteTheme {...themeProps} />;
    case 'video-editor':
      return <VideoEditorTheme {...themeProps} />;
    case 'digital-marketer':
      return <DigitalMarketerTheme {...themeProps} />;
    case 'web-developer':
      return <WebDeveloperTheme {...themeProps} />;
    case 'web-developer-pro':
      return <WebDeveloperProTheme {...themeProps} />;
    case 'web-developer-elite':
      return <WebDeveloperEliteTheme {...themeProps} />;
    case 'official':
      return <OfficialTheme {...themeProps} />;
    case 'cosmic':
      return <CosmicTheme {...themeProps} />;
    case 'personal':
    default:
      return <PersonalTheme {...themeProps} />;
  }
}
