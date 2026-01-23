import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Camera, Aperture, Focus, Image,
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">{profile?.display_name || "Portfolio"}</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('about')} className="text-sm hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollTo('gallery')} className="text-sm hover:text-primary transition-colors">Gallery</button>
            <button onClick={() => scrollTo('experience')} className="text-sm hover:text-primary transition-colors">Experience</button>
            <button onClick={() => scrollTo('contact')} className="text-sm hover:text-primary transition-colors">Contact</button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 hover:text-primary">About</button>
            <button onClick={() => scrollTo('gallery')} className="block w-full text-left py-2 hover:text-primary">Gallery</button>
            <button onClick={() => scrollTo('experience')} className="block w-full text-left py-2 hover:text-primary">Experience</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 hover:text-primary">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero Section - Full Screen Image Style */}
      <section id="about" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-90" />
        <div className="absolute top-1/4 left-10 w-64 h-64 border border-primary/20 rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 border border-primary/10 rounded-full" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 mb-8">
            <Aperture className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium tracking-widest uppercase">Photographer</span>
          </div>

          <Avatar className="w-40 h-40 mx-auto border-4 border-primary/30 mb-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-5xl bg-primary/10 text-primary">
              {profile?.display_name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">
            {profile?.display_name || "Anonymous"}
          </h1>

          {portfolio?.headline && (
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
              {portfolio.headline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            {portfolio?.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {portfolio.location}
              </span>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-4">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}

          {portfolio?.bio && (
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-12 font-light leading-relaxed">
              {portfolio.bio}
            </p>
          )}
        </div>
      </section>

      {/* Gallery Section - Masonry Style */}
      {projects.length > 0 && (
        <section id="gallery" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Focus className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-light tracking-wide">Portfolio</h2>
            </div>
            <p className="text-center text-muted-foreground mb-16">Selected works and projects</p>

            {/* Featured - Large Grid */}
            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <Badge className="mb-2 bg-primary text-primary-foreground">Featured</Badge>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex gap-2 mt-4">
                          {project.live_url && (
                            <Button size="sm" variant="secondary" asChild>
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />View
                              </a>
                            </Button>
                          )}
                        </div>
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
                  <div key={project.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-light tracking-wide text-center mb-16">Expertise</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="px-4 py-2 text-sm font-light">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section id="experience" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid gap-16 md:grid-cols-2">
              {experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Experience
                  </h2>
                  <div className="space-y-8">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l border-border pl-6">
                        <h3 className="font-medium">{exp.position}</h3>
                        <p className="text-muted-foreground text-sm">{exp.company}</p>
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
                  <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education
                  </h2>
                  <div className="space-y-8">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l border-border pl-6">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-muted-foreground text-sm">{edu.institution}</p>
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

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light tracking-wide mb-8">Let's Work Together</h2>
          <p className="text-muted-foreground mb-8">
            Interested in collaborating? Feel free to reach out.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button asChild size="lg">
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button variant="outline" asChild size="lg">
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
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm">{profile?.display_name || "Portfolio"}</span>
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
