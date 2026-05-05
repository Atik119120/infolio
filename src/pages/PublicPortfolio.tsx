import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  FreelancerTheme,
  SmallBusinessTheme,
  PRDGraphicDesignerTheme,
  PRDPhotographerTheme,
  PRDDigitalMarketerTheme,
  BiographyTheme,
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

  useEffect(() => {
    if (portfolio?.favicon_url) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (link) link.href = portfolio.favicon_url;
      else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = portfolio.favicon_url;
        document.head.appendChild(newLink);
      }
    }

    // SEO meta tags (Pro fields)
    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const p: any = portfolio || {};
    const title = p.meta_title || (profile?.display_name ? `${profile.display_name} | Portfolio` : 'Portfolio');
    document.title = title;
    setMeta('description', p.meta_description || p.bio || '');
    setMeta('keywords', p.meta_keywords || '');
    setMeta('og:title', title, 'property');
    setMeta('og:description', p.meta_description || p.bio || '', 'property');
    if (p.og_image_url) setMeta('og:image', p.og_image_url, 'property');
    if (p.google_verification) setMeta('google-site-verification', p.google_verification);

    // Inject custom <head> HTML (sitemap, analytics, etc.)
    if (p.custom_head_html) {
      const container = document.createElement('div');
      container.innerHTML = p.custom_head_html;
      Array.from(container.children).forEach((node) => {
        node.setAttribute('data-portfolio-custom', 'true');
        document.head.appendChild(node);
      });
    }

    return () => {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (link) link.href = '/favicon.ico';
      document.title = 'Alpha Portfolio';
      // Remove injected custom head nodes
      document.head.querySelectorAll('[data-portfolio-custom]').forEach((n) => n.remove());
    };
  }, [portfolio, profile?.display_name]);

  useEffect(() => {
    if (username) fetchPortfolio();
  }, [username]);

  const fetchPortfolio = async () => {
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
    case 'freelancer':
    default:
      return <FreelancerTheme {...themeProps} />;
  }
}
