import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, TrendingUp, Target, BarChart3,
  Briefcase, GraduationCap, Menu, X, Megaphone, Rocket, Zap, ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function DigitalMarketerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">{profile?.display_name || "Marketer"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('about')} className="text-sm hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo('results')} className="text-sm hover:text-primary transition-colors">Results</button>
            <button onClick={() => scrollTo('expertise')} className="text-sm hover:text-primary transition-colors">Expertise</button>
            <button onClick={() => scrollTo('contact')} className="text-sm hover:text-primary transition-colors">Contact</button>
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2">About</button>
            <button onClick={() => scrollTo('results')} className="block w-full text-left py-2">Results</button>
            <button onClick={() => scrollTo('expertise')} className="block w-full text-left py-2">Expertise</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Results Focused */}
      <section id="about" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-success/10 text-success border-success/20">
                <Rocket className="w-3 h-3 mr-2" />
                Digital Marketing Expert
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                I Help Brands
                <span className="block text-primary">Grow & Scale</span>
              </h1>

              {portfolio?.headline && (
                <p className="text-xl text-muted-foreground mb-8">
                  {portfolio.headline}
                </p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-3xl font-bold text-primary">5+</div>
                  <div className="text-xs text-muted-foreground">Years Exp</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-3xl font-bold text-success">50+</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <div className="text-3xl font-bold text-secondary">100%</div>
                  <div className="text-xs text-muted-foreground">Dedication</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {profile?.email && (
                  <Button size="lg" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Megaphone className="w-4 h-4 mr-2" />
                      Let's Talk Strategy
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => scrollTo('results')}>
                  See Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/20 to-success/20 rounded-3xl blur-2xl" />
              <div className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border">
                <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-center mb-2">{profile?.display_name}</h2>
                {portfolio?.location && (
                  <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </p>
                )}
                
                {socialLinks.length > 0 && (
                  <div className="flex justify-center gap-3 mt-6">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {portfolio?.bio && (
            <div className="mt-24 max-w-3xl mx-auto text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {portfolio.bio}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Results/Projects Section */}
      {projects.length > 0 && (
        <section id="results" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <BarChart3 className="w-3 h-3 mr-2" />
                Case Studies
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Results That Speak</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Real campaigns, real results. Here's how I've helped brands achieve their goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...featuredProjects, ...otherProjects].map((project) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card">
                  <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Target className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                        <Zap className="w-3 h-3 mr-1" />
                        Top Result
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.live_url && (
                        <Button size="sm" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Case
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Expertise Section */}
      {skills.length > 0 && (
        <section id="expertise" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Marketing Expertise</h2>
              <p className="text-muted-foreground">Channels and skills I specialize in</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-3">{category}</h3>
                  <div className="space-y-2">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.id} variant="outline" className="mr-1 mb-1">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              {experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <Card key={exp.id} className="p-4">
                        <h3 className="font-bold">{exp.position}</h3>
                        <p className="text-primary text-sm">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                        {exp.description && <p className="text-sm mt-2 text-muted-foreground">{exp.description}</p>}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                    Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <Card key={edu.id} className="p-4">
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="text-secondary text-sm">{edu.institution}</p>
                        {edu.field_of_study && <p className="text-xs text-muted-foreground">{edu.field_of_study}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section id="contact" className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Brand?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Let's discuss how we can take your business to the next level.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button size="lg" variant="secondary" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <a href={`tel:${portfolio.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {portfolio.phone}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-bold">{profile?.display_name}</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} All Rights Reserved</p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 4).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
