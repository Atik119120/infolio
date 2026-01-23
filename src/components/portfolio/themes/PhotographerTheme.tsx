import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Camera, Aperture, Image,
  Briefcase, GraduationCap, Menu, X
} from "lucide-react";
import { useState } from "react";

export default function PhotographerTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Aperture className="w-6 h-6 text-primary" />
            <span className="font-light text-lg tracking-widest uppercase">{profile?.display_name || "Portfolio"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('hero')} className="text-xs tracking-widest uppercase hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollTo('bio')} className="text-xs tracking-widest uppercase hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo('skills')} className="text-xs tracking-widest uppercase hover:text-primary transition-colors">Skills</button>
            <button onClick={() => scrollTo('works')} className="text-xs tracking-widest uppercase hover:text-primary transition-colors">Works</button>
            <button onClick={() => scrollTo('contact')} className="text-xs tracking-widest uppercase hover:text-primary transition-colors">Contact</button>
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
            <button onClick={() => scrollTo('hero')} className="block w-full text-left py-2 text-sm">Home</button>
            <button onClick={() => scrollTo('bio')} className="block w-full text-left py-2 text-sm">About</button>
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2 text-sm">Skills</button>
            <button onClick={() => scrollTo('works')} className="block w-full text-left py-2 text-sm">Works</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 text-sm">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero Section - Full Screen Cover */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center">
        {/* Cover Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 via-background to-background">
          {projects[0]?.image_url && (
            <img 
              src={projects[0].image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/3 left-10 w-64 h-64 border border-primary/10 rounded-full" />
        <div className="absolute bottom-1/3 right-10 w-96 h-96 border border-primary/5 rounded-full" />
        
        <div className="container mx-auto px-6 relative z-10 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm mb-8">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-xs font-light tracking-[0.3em] uppercase">Photographer</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-6">
            {profile?.display_name || "Anonymous"}
          </h1>

          {portfolio?.headline && (
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto">
              {portfolio.headline}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="rounded-none border-foreground/20" onClick={() => scrollTo('works')}>
              <Image className="w-4 h-4 mr-2" />
              View Gallery
            </Button>
            {profile?.email && (
              <Button size="lg" className="rounded-none" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Photo */}
            <div className="relative">
              <div className="absolute -inset-4 border border-primary/10" />
              <Avatar className="w-full aspect-square rounded-none">
                <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                <AvatarFallback className="text-8xl bg-muted rounded-none">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Bio Content */}
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">About Me</p>
              <h2 className="text-3xl md:text-4xl font-light mb-6">{profile?.display_name}</h2>
              
              {portfolio?.bio && (
                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
                  {portfolio.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                {portfolio?.location && (
                  <span className="flex items-center gap-2">
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
                        className="w-12 h-12 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
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
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Expertise</p>
            <h2 className="text-3xl font-light text-center mb-16">Skills & Tools</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="px-6 py-3 text-sm font-light rounded-none border-foreground/20">
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
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Background</p>
            <h2 className="text-3xl font-light text-center mb-16">Education</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu) => (
                <Card key={edu.id} className="rounded-none border-foreground/10">
                  <CardContent className="p-8">
                    <GraduationCap className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-medium mb-2">{edu.degree}</h3>
                    <p className="text-primary">{edu.institution}</p>
                    {edu.field_of_study && <p className="text-sm text-muted-foreground mt-1">{edu.field_of_study}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
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
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Career</p>
            <h2 className="text-3xl font-light text-center mb-16">Experience</h2>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex gap-8 items-start">
                  <div className="hidden md:block">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 border-l border-border pl-8">
                    <h3 className="text-xl font-medium">{exp.position}</h3>
                    <p className="text-primary">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </p>
                    {exp.description && <p className="text-muted-foreground mt-3">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Works/Gallery Section */}
      {projects.length > 0 && (
        <section id="works" className="py-24 px-6">
          <div className="container mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">Portfolio</p>
            <h2 className="text-3xl font-light text-center mb-16">Selected Works</h2>

            {/* Featured Works - Large Grid */}
            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="group relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <Badge className="mb-3 bg-primary text-primary-foreground rounded-none">Featured</Badge>
                        <h3 className="text-2xl font-light mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                        )}
                        {project.live_url && (
                          <Button size="sm" variant="outline" className="mt-4 rounded-none" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />View
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other Projects - Smaller Grid */}
            {otherProjects.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherProjects.map((project) => (
                  <div key={project.id} className="group relative aspect-square overflow-hidden bg-muted">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center p-4">
                        <h3 className="font-medium mb-2">{project.title}</h3>
                        {project.live_url && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-foreground text-background">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-background/60 mb-4">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-light mb-6">Let's Work Together</h2>
          <p className="text-background/70 mb-8">
            Interested in collaborating? I'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button size="lg" variant="secondary" className="rounded-none" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button size="lg" variant="outline" className="rounded-none border-background/30 text-background hover:bg-background/10" asChild>
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
          <div className="flex items-center gap-3">
            <Aperture className="w-5 h-5 text-primary" />
            <span className="font-light tracking-widest uppercase text-sm">{profile?.display_name || "Portfolio"}</span>
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
