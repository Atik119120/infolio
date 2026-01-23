import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Building2, Award,
  Briefcase, GraduationCap, Menu, X, Users, CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function OfficialTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
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
      {/* Navigation - Professional/Corporate */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-primary" />
            <span className="font-semibold text-lg">{profile?.display_name || "Portfolio"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('hero')} className="text-sm hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollTo('bio')} className="text-sm hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo('skills')} className="text-sm hover:text-primary transition-colors">Services</button>
            <button onClick={() => scrollTo('works')} className="text-sm hover:text-primary transition-colors">Portfolio</button>
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
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2">Services</button>
            <button onClick={() => scrollTo('works')} className="block w-full text-left py-2">Portfolio</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Clean Corporate with Cover */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative">
        {/* Cover Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background">
          {projects[0]?.image_url && (
            <img 
              src={projects[0].image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-10"
            />
          )}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-0">
                <Award className="w-3 h-3 mr-2" />
                Professional Profile
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {profile?.display_name || "Your Name"}
              </h1>

              {portfolio?.headline && (
                <p className="text-xl text-primary font-medium mb-6">
                  {portfolio.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-primary">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </a>
                )}
                {portfolio?.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {portfolio.phone}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {profile?.email && (
                  <Button size="lg" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Get In Touch
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => scrollTo('works')}>
                  View Work
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-full" />
                <div className="absolute -inset-8 bg-primary/3 rounded-full" />
                <Avatar className="relative w-72 h-72 border-4 border-background shadow-2xl">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-6xl bg-primary/10 text-primary">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">{experiences.length}+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">{projects.length}+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">{skills.length}+</div>
                  <div className="text-sm text-muted-foreground">Skills</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </CardContent>
              </Card>
            </div>

            {/* Bio Content */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">Professional Background</h3>
              
              {portfolio?.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills/Services Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Expertise</h2>
              <h3 className="text-4xl font-bold">Services & Skills</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-4">{category}</h4>
                    <ul className="space-y-2">
                      {categorySkills.map((skill) => (
                        <li key={skill.id} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {skill.name}
                        </li>
                      ))}
                    </ul>
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
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-secondary mb-4">Background</h2>
              <h3 className="text-4xl font-bold">Education</h3>
            </div>
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-8 border-l-2 border-secondary/20">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary" />
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold">{edu.degree}</h4>
                      <p className="text-secondary font-medium">{edu.institution}</p>
                      {edu.field_of_study && <p className="text-sm text-muted-foreground mt-1">{edu.field_of_study}</p>}
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Career</h2>
              <h3 className="text-4xl font-bold">Work Experience</h3>
            </div>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="hidden md:flex w-12 h-12 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold">{exp.position}</h4>
                          <p className="text-primary font-medium">{exp.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </p>
                          {exp.description && <p className="text-muted-foreground mt-3">{exp.description}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works/Portfolio Section */}
      {projects.length > 0 && (
        <section id="works" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Portfolio</h2>
              <h3 className="text-4xl font-bold">Recent Work</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project) => (
                <Card key={project.id} className="group overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-primary">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.slice(0, 3).map((tech) => (
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
                            View
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
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

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <Users className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            I'm open to new opportunities and collaborations. Feel free to reach out.
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

          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mt-8">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-semibold">{profile?.display_name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex gap-3">
            {socialLinks.slice(0, 4).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
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
