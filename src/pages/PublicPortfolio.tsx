import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Briefcase,
  GraduationCap,
  Star,
  Loader2,
} from "lucide-react";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface Portfolio {
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean | null;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const getSocialIcon = (platform: string) => {
  const icons: Record<string, typeof Globe> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
  };
  return icons[platform.toLowerCase()] || Globe;
};

export default function PublicPortfolio() {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const fetchPortfolio = async () => {
    // First get the profile by username
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

    // Check if portfolio is published
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

    // Fetch all data
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

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl mb-6">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-4xl gradient-primary text-white">
                {profile?.display_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {profile?.display_name || "Anonymous"}
            </h1>

            {portfolio?.headline && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                {portfolio.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
              {portfolio?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {portfolio.location}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
              {portfolio?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {portfolio.phone}
                </span>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mb-8">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}

            {portfolio?.bio && (
              <p className="max-w-2xl text-lg text-muted-foreground">
                {portfolio.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-20 px-6 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category} className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 gradient-text">{category}</h3>
                    <div className="space-y-3">
                      {categorySkills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-primary rounded-full transition-all duration-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
                )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 mb-12">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden group">
                    {project.image_url && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-4 right-4 bg-warning">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-muted-foreground mb-4">{project.description}</p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                )}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.live_url && (
                          <Button size="sm" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )))}
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    {project.image_url && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {project.live_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-20 px-6 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Experience */}
              {experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-8 border-l-2 border-primary/30 pb-6 last:pb-0">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                        <h3 className="font-semibold">{exp.position}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.start_date && new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          {" - "}
                          {exp.is_current ? "Present" : exp.end_date && new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                        </p>
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    )))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                    Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="relative pl-8 border-l-2 border-secondary/30 pb-6 last:pb-0">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary" />
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {edu.start_date && new Date(edu.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          {" - "}
                          {edu.is_current ? "Present" : edu.end_date && new Date(edu.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                        </p>
                      </div>
                    )))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Built with PortfolioHub</p>
        </div>
      </footer>
    </div>
  );
}
