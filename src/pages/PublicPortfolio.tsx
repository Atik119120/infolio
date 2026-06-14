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
  PRDPhotographerTheme,
  PRDDigitalMarketerTheme,
  BiographyTheme,
  CustomCodeTheme,
  AdminUploadedTheme,
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

  usePortfolioHead({ portfolio, displayName: profile?.display_name });

  useEffect(() => {
    if (username) fetchPortfolio();
  }, [username]);

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

    if (!portfolioData?.is_published) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const [skillsRes, projectsRes, experiencesRes, educationRes, socialRes, servicesRes] = await Promise.all([
      supabase.from("skills").select("*").eq("user_id", fetchedUserId).order("created_at"),
      supabase.from("projects").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("experiences").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("education").select("*").eq("user_id", fetchedUserId).order("display_order"),
      supabase.from("social_links").select("*").eq("user_id", fetchedUserId).order("display_order"),
      (supabase as any).from("services").select("*").eq("user_id", fetchedUserId).order("display_order"),
    ]);

    setProfile(profileData);
    setPortfolio(portfolioData);
    if (skillsRes.data) setSkills(skillsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (experiencesRes.data) setExperiences(experiencesRes.data);
    if (educationRes.data) setEducation(educationRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);
    if (servicesRes.data) setServices(servicesRes.data);

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
    userId: userId || undefined,
  };

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
    case 'freelancer':
    default:
      return <FreelancerTheme {...themeProps} />;
  }
}
