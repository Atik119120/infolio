import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Theme imports
import {
  PhotographerTheme,
  GraphicDesignerTheme,
  VideoEditorTheme,
  DigitalMarketerTheme,
  WebDeveloperTheme,
  OfficialTheme,
  PersonalTheme,
  CosmicTheme,
  ThemeProps,
} from "@/components/portfolio/themes";

// Demo data for preview
const demoData: ThemeProps = {
  profile: {
    display_name: "Alex Johnson",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    email: "alex@example.com",
  },
  portfolio: {
    headline: "Creative Professional | Passionate About Design",
    bio: "I'm a creative professional with over 5 years of experience. I love bringing ideas to life and creating meaningful experiences through my work. When I'm not working, you can find me exploring new technologies and learning new skills.",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    website: "https://example.com",
    theme: null,
    logo_url: null,
  },
  skills: [
    { id: "1", name: "Adobe Photoshop", category: "Design", proficiency: 95 },
    { id: "2", name: "Adobe Illustrator", category: "Design", proficiency: 90 },
    { id: "3", name: "Figma", category: "Design", proficiency: 88 },
    { id: "4", name: "After Effects", category: "Motion", proficiency: 85 },
    { id: "5", name: "Premiere Pro", category: "Motion", proficiency: 80 },
    { id: "6", name: "React", category: "Development", proficiency: 75 },
    { id: "7", name: "JavaScript", category: "Development", proficiency: 82 },
    { id: "8", name: "SEO", category: "Marketing", proficiency: 78 },
    { id: "9", name: "Google Analytics", category: "Marketing", proficiency: 85 },
  ],
  projects: [
    {
      id: "1",
      title: "Brand Identity Design",
      description: "Complete brand identity redesign for a tech startup, including logo, color palette, and brand guidelines.",
      tech_stack: ["Illustrator", "Photoshop", "Figma"],
      live_url: "https://example.com",
      github_url: null,
      image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      featured: true,
    },
    {
      id: "2",
      title: "E-commerce Website",
      description: "Modern e-commerce platform with seamless user experience and optimized conversion rate.",
      tech_stack: ["React", "Node.js", "Stripe"],
      live_url: "https://example.com",
      github_url: "https://github.com",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      featured: true,
    },
    {
      id: "3",
      title: "Mobile App UI/UX",
      description: "Complete UI/UX design for a fitness tracking mobile application.",
      tech_stack: ["Figma", "Prototype"],
      live_url: "https://example.com",
      github_url: null,
      image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      featured: false,
    },
    {
      id: "4",
      title: "Corporate Video",
      description: "Promotional video production for annual company event.",
      tech_stack: ["Premiere Pro", "After Effects"],
      live_url: "https://example.com",
      github_url: null,
      image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop",
      featured: false,
    },
  ],
  experiences: [
    {
      id: "1",
      company: "Creative Agency Inc.",
      position: "Senior Designer",
      description: "Led design team in creating innovative solutions for Fortune 500 clients.",
      start_date: "2022-01-01",
      end_date: null,
      is_current: true,
    },
    {
      id: "2",
      company: "Digital Studio",
      position: "UI/UX Designer",
      description: "Designed user interfaces for web and mobile applications.",
      start_date: "2019-06-01",
      end_date: "2021-12-31",
      is_current: false,
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Arts",
      degree: "Bachelor of Fine Arts",
      field_of_study: "Graphic Design",
      start_date: "2015-09-01",
      end_date: "2019-05-31",
      is_current: false,
    },
  ],
  socialLinks: [
    { id: "1", platform: "linkedin", url: "https://linkedin.com" },
    { id: "2", platform: "github", url: "https://github.com" },
    { id: "3", platform: "twitter", url: "https://twitter.com" },
    { id: "4", platform: "instagram", url: "https://instagram.com" },
  ],
};

export default function ThemeDemo() {
  const { themeName } = useParams<{ themeName: string }>();
  const navigate = useNavigate();

  const renderTheme = () => {
    switch (themeName) {
      case 'photographer':
        return <PhotographerTheme {...demoData} />;
      case 'graphic-designer':
        return <GraphicDesignerTheme {...demoData} />;
      case 'video-editor':
        return <VideoEditorTheme {...demoData} />;
      case 'digital-marketer':
        return <DigitalMarketerTheme {...demoData} />;
      case 'web-developer':
        return <WebDeveloperTheme {...demoData} />;
      case 'official':
        return <OfficialTheme {...demoData} />;
      case 'cosmic':
        return <CosmicTheme {...demoData} />;
      case 'personal':
      default:
        return <PersonalTheme {...demoData} />;
    }
  };

  return (
    <div className="relative">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-[100]">
        <Button 
          variant="secondary" 
          size="sm" 
          className="shadow-lg"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Demo Banner */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <span className="text-sm font-medium">
          This is a demo preview of the {themeName?.replace('-', ' ')} theme
        </span>
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => navigate('/dashboard/edit')}
        >
          Use This Theme
        </Button>
      </div>

      {renderTheme()}
    </div>
  );
}
