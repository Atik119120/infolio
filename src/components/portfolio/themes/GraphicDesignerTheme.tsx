import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Palette, Layers, Sparkles,
  Briefcase, GraduationCap, Menu, X, PenTool
} from "lucide-react";
import { useState } from "react";

export default function GraphicDesignerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
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
      {/* Navigation - Bold & Creative */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl">{profile?.display_name || "Designer"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('hero')} className="text-sm font-bold hover:text-primary transition-colors uppercase">Home</button>
            <button onClick={() => scrollTo('bio')} className="text-sm font-bold hover:text-primary transition-colors uppercase">About</button>
            <button onClick={() => scrollTo('skills')} className="text-sm font-bold hover:text-primary transition-colors uppercase">Skills</button>
            <button onClick={() => scrollTo('works')} className="text-sm font-bold hover:text-primary transition-colors uppercase">Work</button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-bold hover:text-primary transition-colors uppercase">Contact</button>
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
          <div className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
            <button onClick={() => scrollTo('hero')} className="block w-full text-left py-2 font-bold uppercase">Home</button>
            <button onClick={() => scrollTo('bio')} className="block w-full text-left py-2 font-bold uppercase">About</button>
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2 font-bold uppercase">Skills</button>
            <button onClick={() => scrollTo('works')} className="block w-full text-left py-2 font-bold uppercase">Work</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 font-bold uppercase">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Bold Typography with Cover */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background Cover */}
        <div className="absolute inset-0">
          {projects[0]?.image_url && (
            <img 
              src={projects[0].image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-gradient-to-tr from-secondary/30 to-primary/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0">
              <PenTool className="w-3 h-3 mr-2" />
              Graphic Designer
            </Badge>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6">
              <span className="block">Creative</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Designer
              </span>
            </h1>

            {portfolio?.headline && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
                {portfolio.headline}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              {profile?.email && (
                <Button size="lg" className="rounded-full font-bold" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Let's Talk
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" className="rounded-full font-bold" onClick={() => scrollTo('works')}>
                <Layers className="w-4 h-4 mr-2" />
                View Work
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Photo */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary to-secondary rounded-3xl transform rotate-3" />
              <Avatar className="relative w-full aspect-square max-w-md mx-auto rounded-3xl border-0">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-3xl object-cover" />
                <AvatarFallback className="text-8xl bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-3xl">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Bio Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">About Me</h2>
              <h3 className="text-4xl font-black mb-6">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-primary" />
                    {portfolio.location}
                  </span>
                )}
              </div>

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
                        className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-gradient-to-br from-muted/50 via-background to-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Expertise</h2>
              <h3 className="text-4xl font-black">Skills & Tools</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category} className="border-0 shadow-xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <CardContent className="p-6">
                    <h4 className="font-black text-lg mb-4">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="rounded-full">
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
              <h2 className="text-sm font-black uppercase tracking-widest text-secondary mb-4">Background</h2>
              <h3 className="text-4xl font-black">Education</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu) => (
                <Card key={edu.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6">
                      <GraduationCap className="w-7 h-7 text-secondary-foreground" />
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
        <section className="py-24 px-6 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Career</h2>
              <h3 className="text-4xl font-black">Experience</h3>
            </div>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <Card key={exp.id} className="border-0 shadow-lg">
                  <CardContent className="p-8 flex gap-6">
                    <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary items-center justify-center flex-shrink-0">
                      <Briefcase className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold">{exp.position}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {exp.description && <p className="text-muted-foreground mt-3">{exp.description}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works Section */}
      {projects.length > 0 && (
        <section id="works" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Portfolio</h2>
              <h3 className="text-4xl font-black">Selected Work</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project, index) => (
                <Card key={project.id} className={`group overflow-hidden border-0 shadow-xl ${index === 0 ? 'md:col-span-2' : ''}`}>
                  <div className={`relative ${index === 0 ? 'aspect-[21/9]' : 'aspect-video'} bg-gradient-to-br from-muted to-muted/50`}>
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                    {project.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="outline" className="rounded-full">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.live_url && (
                        <Button size="sm" className="rounded-full" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />View Project
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
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

      {/* Contact CTA */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-primary-foreground mb-6">
            Let's Create Something Amazing
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Have a project in mind? Let's collaborate and bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button size="lg" variant="secondary" className="rounded-full font-bold" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button size="lg" variant="outline" className="rounded-full font-bold bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
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
      <footer className="py-8 px-6 bg-background border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <span className="font-bold">{profile?.display_name || "Designer"}</span>
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
