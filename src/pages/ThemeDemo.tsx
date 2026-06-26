import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

import {
  FreelancerTheme,
  SmallBusinessTheme,
  PRDGraphicDesignerTheme,
  PRDPhotographerTheme,
  PRDDigitalMarketerTheme,
  BiographyTheme,
  CreativeSidebarProTheme,
  DarkPhotographerTheme,
  ThemeProps,
} from "@/components/portfolio/themes";

const demoData: ThemeProps = {
  profile: {
    display_name: "Alex Johnson",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    email: "alex@example.com",
  },
  portfolio: {
    headline: "Creative Professional | Passionate About Design",
    bio: "I'm a creative professional with over 5 years of experience. I love bringing ideas to life and creating meaningful experiences through my work.",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    website: "https://example.com",
    theme: null,
    logo_url: null,
    favicon_url: null,
  },
  skills: [
    { id: "1", name: "Adobe Photoshop", category: "Design", proficiency: 95 },
    { id: "2", name: "Adobe Illustrator", category: "Design", proficiency: 90 },
    { id: "3", name: "Figma", category: "Design", proficiency: 88 },
    { id: "4", name: "After Effects", category: "Motion", proficiency: 85 },
    { id: "5", name: "Premiere Pro", category: "Motion", proficiency: 80 },
    { id: "6", name: "React", category: "Development", proficiency: 75 },
  ],
  projects: [
    { id: "1", title: "Brand Identity Design", description: "Complete brand identity redesign for a tech startup.", tech_stack: ["Illustrator", "Photoshop", "Figma"], live_url: "https://example.com", github_url: null, image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop", featured: true },
    { id: "2", title: "E-commerce Website", description: "Modern e-commerce platform.", tech_stack: ["React", "Node.js", "Stripe"], live_url: "https://example.com", github_url: "https://github.com", image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", featured: true },
    { id: "3", title: "Mobile App UI/UX", description: "UI/UX for a fitness app.", tech_stack: ["Figma"], live_url: "https://example.com", github_url: null, image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop", featured: false },
  ],
  experiences: [
    { id: "1", company: "Creative Agency Inc.", position: "Senior Designer", description: "Led design team.", start_date: "2022-01-01", end_date: null, is_current: true },
  ],
  education: [
    { id: "1", institution: "University of Arts", degree: "Bachelor of Fine Arts", field_of_study: "Graphic Design", start_date: "2015-09-01", end_date: "2019-05-31", is_current: false },
  ],
  socialLinks: [
    { id: "1", platform: "linkedin", url: "https://linkedin.com" },
    { id: "2", platform: "github", url: "https://github.com" },
    { id: "3", platform: "twitter", url: "https://twitter.com" },
  ],
  services: [
    { id: "s1", title: "Brand Identity", description: "Logo, color system, type, and full visual language for your brand.", icon: "palette", price: "From $800" },
    { id: "s2", title: "Web Design", description: "Conversion-focused websites that look gorgeous and load fast.", icon: "code", price: "From $1500" },
    { id: "s3", title: "Consulting", description: "1-on-1 strategy sessions to level up your design and growth.", icon: "lightbulb", price: "$120 / hr" },
  ],
};

export default function ThemeDemo() {
  const { themeName } = useParams<{ themeName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [themeName]);

  const renderTheme = () => {
    switch (themeName) {
      case 'small-business':
        return <SmallBusinessTheme {...demoData} />;
      case 'prd-graphic-designer':
        return <PRDGraphicDesignerTheme {...demoData} />;
      case 'prd-photographer':
        return <PRDPhotographerTheme {...demoData} />;
      case 'prd-digital-marketer':
        return <PRDDigitalMarketerTheme {...demoData} />;
      case 'biography':
        return <BiographyTheme {...demoData} />;
      case 'creative-sidebar-pro':
        return <CreativeSidebarProTheme {...demoData} />;
      case 'dark-photographer':
        return <DarkPhotographerTheme {...demoData} />;
      case 'freelancer':
      default:
        return <FreelancerTheme {...demoData} />;
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-[100]">
        <Button variant="secondary" size="sm" className="shadow-lg" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <span className="text-sm font-medium">
          Demo preview of the {themeName?.replace(/-/g, ' ')} theme
        </span>
        <Button size="sm" variant="secondary" onClick={() => navigate('/dashboard/edit')}>
          Use This Theme
        </Button>
      </div>

      {renderTheme()}
    </div>
  );
}
