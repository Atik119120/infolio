import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Film, Play, Clapperboard,
  Briefcase, GraduationCap, Menu, X, Video, MonitorPlay
} from "lucide-react";
import { useState } from "react";

export default function VideoEditorTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Cinematic */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-wide">{profile?.display_name || "Editor"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('hero')} className="text-sm hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollTo('bio')} className="text-sm hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo('skills')} className="text-sm hover:text-primary transition-colors">Skills</button>
            <button onClick={() => scrollTo('works')} className="text-sm hover:text-primary transition-colors">Works</button>
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
            <button onClick={() => scrollTo('works')} className="block w-full text-left py-2">Works</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Cinematic Widescreen with Cover */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Cinematic Bars */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-foreground/10 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-foreground/10 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-foreground/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-foreground/10 to-transparent" />

        {/* Cover Background */}
        <div className="absolute inset-0">
          {projects[0]?.image_url && (
            <img 
              src={projects[0].image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-0">
              <Clapperboard className="w-3 h-3 mr-2" />
              Video Editor & Motion Designer
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block text-muted-foreground">I bring</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Stories to Life
              </span>
            </h1>

            {portfolio?.headline && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {portfolio.headline}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2" onClick={() => scrollTo('works')}>
                <Play className="w-5 h-5" />
                Watch My Work
              </Button>
              {profile?.email && (
                <Button size="lg" variant="outline" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Hire Me
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Video Frame Style Photo */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl opacity-20 blur-xl" />
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border-4 border-foreground/10">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="text-8xl bg-gradient-to-br from-primary/20 to-accent/20 rounded-none">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                  <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
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
                        className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
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
        <section id="skills" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Expertise</h2>
              <h3 className="text-4xl font-bold">Software & Skills</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="px-6 py-3 text-sm bg-background">
                  {skill.name}
                </Badge>
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
                <Card key={edu.id} className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-secondary to-accent" />
                  <CardContent className="p-8">
                    <GraduationCap className="w-10 h-10 text-secondary mb-4" />
                    <h4 className="text-xl font-bold mb-2">{edu.degree}</h4>
                    <p className="text-secondary">{edu.institution}</p>
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
                <div key={exp.id} className="flex gap-6">
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 w-0.5 bg-primary/20 mt-4" />
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold">{exp.position}</h4>
                      <p className="text-primary">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {exp.description && <p className="text-muted-foreground mt-3">{exp.description}</p>}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works/Projects Section */}
      {projects.length > 0 && (
        <section id="works" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <MonitorPlay className="w-8 h-8 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Portfolio</h2>
              </div>
              <h3 className="text-4xl font-bold">My Projects</h3>
            </div>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {project.image_url ? (
                        <>
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                              <Play className="w-6 h-6 text-primary-foreground ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                      {project.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
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
                            <ExternalLink className="w-4 h-4 mr-2" />Watch
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {otherProjects.map((project) => (
                  <Card key={project.id} className="group overflow-hidden border-0 bg-card/50">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {project.image_url ? (
                        <>
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-10 h-10 text-primary-foreground" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1">{project.title}</h4>
                      {project.live_url && (
                        <Button size="sm" variant="ghost" className="p-0 h-auto" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                            Watch Video →
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-2xl text-center">
          <Film className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Let's collaborate on your next video project
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button size="lg" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button size="lg" variant="outline" asChild>
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
            <Film className="w-5 h-5 text-primary" />
            <span className="font-medium">{profile?.display_name}</span>
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
