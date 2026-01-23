import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, TrendingUp, Target, BarChart3,
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
            <button onClick={() => scrollTo('hero')} className="text-sm hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollTo('bio')} className="text-sm hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo('skills')} className="text-sm hover:text-primary transition-colors">Skills</button>
            <button onClick={() => scrollTo('works')} className="text-sm hover:text-primary transition-colors">Results</button>
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
            <button onClick={() => scrollTo('hero')} className="block w-full text-left py-2">Home</button>
            <button onClick={() => scrollTo('bio')} className="block w-full text-left py-2">About</button>
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2">Skills</button>
            <button onClick={() => scrollTo('works')} className="block w-full text-left py-2">Results</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Results Focused with Cover */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Cover Background */}
        <div className="absolute inset-0">
          {projects[0]?.image_url && (
            <img 
              src={projects[0].image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-15"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        </div>
        
        {/* Decorative Blurs */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Rocket className="w-3 h-3 mr-2" />
              Digital Marketing Expert
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              I Help Brands
              <span className="block text-primary">Grow & Scale</span>
            </h1>

            {portfolio?.headline && (
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                {portfolio.headline}
              </p>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
              <div className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
                <div className="text-3xl font-bold text-primary">{experiences.length}+</div>
                <div className="text-xs text-muted-foreground">Years Exp</div>
              </div>
              <div className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
                <div className="text-3xl font-bold text-primary">{projects.length}+</div>
                <div className="text-xs text-muted-foreground">Campaigns</div>
              </div>
              <div className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
                <div className="text-3xl font-bold text-primary">100%</div>
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
              <Button size="lg" variant="outline" onClick={() => scrollTo('works')}>
                See Results
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Profile Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl" />
              <Card className="relative border-0 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <Avatar className="w-40 h-40 mx-auto mb-6 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-5xl bg-primary/10 text-primary">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-bold mb-2">{profile?.display_name}</h3>
                  {portfolio?.location && (
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
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
                </CardContent>
              </Card>
            </div>

            {/* Bio Content */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">Driving Growth Through Digital</h3>
              
              {portfolio?.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-bold">Strategy Focused</h4>
                  <p className="text-sm text-muted-foreground">Data-driven marketing approaches</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-secondary mb-2" />
                  <h4 className="font-bold">Results Oriented</h4>
                  <p className="text-sm text-muted-foreground">Measurable business growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Expertise</h2>
              <h3 className="text-4xl font-bold">Marketing Skills</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold mb-3">{category}</h4>
                    <div className="flex flex-wrap justify-center gap-1">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.id} variant="outline" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section id="education" className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Background</h2>
              <h3 className="text-4xl font-bold">Education</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu) => (
                <Card key={edu.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                      <GraduationCap className="w-7 h-7 text-secondary" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{edu.degree}</h4>
                    <p className="text-secondary font-medium">{edu.institution}</p>
                    {edu.field_of_study && <p className="text-sm text-muted-foreground mt-1">{edu.field_of_study}</p>}
                    <p className="text-xs text-muted-foreground mt-3">
                      {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Career</h2>
              <h3 className="text-4xl font-bold">Experience</h3>
            </div>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <Card key={exp.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="hidden md:flex w-2 bg-gradient-to-b from-primary to-secondary" />
                      <div className="flex-1 p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold">{exp.position}</h4>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                            </p>
                            {exp.description && <p className="text-muted-foreground mt-3">{exp.description}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works/Results Section */}
      {projects.length > 0 && (
        <section id="works" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <BarChart3 className="w-3 h-3 mr-2" />
                Case Studies
              </Badge>
              <h3 className="text-4xl font-bold mb-4">Results That Speak</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Real campaigns, real results. Here's how I've helped brands achieve their goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        <Zap className="w-3 h-3 mr-1" />
                        Top Result
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-2">{project.title}</h4>
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
                    {project.live_url && (
                      <Button size="sm" asChild>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Case
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
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
