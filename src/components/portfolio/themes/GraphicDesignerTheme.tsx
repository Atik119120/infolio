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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tight">{profile?.display_name || "Designer"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('about')} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider">About</button>
            <button onClick={() => scrollTo('work')} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider">Work</button>
            <button onClick={() => scrollTo('skills')} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider">Skills</button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-wider">Contact</button>
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
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 font-bold uppercase tracking-wider">About</button>
            <button onClick={() => scrollTo('work')} className="block w-full text-left py-2 font-bold uppercase tracking-wider">Work</button>
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2 font-bold uppercase tracking-wider">Skills</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 font-bold uppercase tracking-wider">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Bold Typography */}
      <section id="about" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-gradient-to-tr from-secondary/30 to-primary/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <PenTool className="w-3 h-3 mr-2" />
                Graphic Designer
              </Badge>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6">
                <span className="block">Creative</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Designer
                </span>
              </h1>

              {portfolio?.headline && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
                  {portfolio.headline}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mb-8">
                {profile?.email && (
                  <Button size="lg" className="rounded-full" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Let's Talk
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="rounded-full" onClick={() => scrollTo('work')}>
                  View Work
                </Button>
              </div>

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
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl transform rotate-6" />
              <Avatar className="relative w-full aspect-square max-w-md mx-auto rounded-3xl border-0">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-3xl object-cover" />
                <AvatarFallback className="text-8xl bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-3xl">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {portfolio?.bio && (
            <div className="mt-24 max-w-3xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">About Me</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {portfolio.bio}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Work Section - Grid Layout */}
      {projects.length > 0 && (
        <section id="work" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-black">Selected Work</h2>
                <p className="text-muted-foreground">Creative projects & design work</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
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
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black mb-4">Skills & Tools</h2>
              <p className="text-muted-foreground">Technologies and tools I work with</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {category}
                    </h3>
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

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="grid gap-16 md:grid-cols-2">
              {experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="p-4 rounded-xl bg-muted/50">
                        <h3 className="font-bold">{exp.position}</h3>
                        <p className="text-primary text-sm">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                        {exp.description && <p className="text-sm mt-2 text-muted-foreground">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                    Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4 rounded-xl bg-muted/50">
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="text-secondary text-sm">{edu.institution}</p>
                        {edu.field_of_study && <p className="text-xs text-muted-foreground">{edu.field_of_study}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-primary to-accent">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-primary-foreground mb-6">
            Let's Create Something Amazing
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Have a project in mind? Let's collaborate and bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button size="lg" variant="secondary" className="rounded-full" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button size="lg" variant="outline" className="rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
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
