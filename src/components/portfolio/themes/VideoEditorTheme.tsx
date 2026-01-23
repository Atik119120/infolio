import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Film, Play, Clapperboard,
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
            <button onClick={() => scrollTo('reel')} className="text-sm hover:text-primary transition-colors">Showreel</button>
            <button onClick={() => scrollTo('projects')} className="text-sm hover:text-primary transition-colors">Projects</button>
            <button onClick={() => scrollTo('about')} className="text-sm hover:text-primary transition-colors">About</button>
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
            <button onClick={() => scrollTo('reel')} className="block w-full text-left py-2">Showreel</button>
            <button onClick={() => scrollTo('projects')} className="block w-full text-left py-2">Projects</button>
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2">About</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">Contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Cinematic Widescreen */}
      <section id="reel" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-foreground/5 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-foreground/5 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-foreground/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground/10 to-transparent" />

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

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" className="gap-2" onClick={() => scrollTo('projects')}>
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

            <div className="relative max-w-md mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl opacity-20 blur-xl" />
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border-4 border-foreground/10">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                  <AvatarFallback className="text-6xl bg-gradient-to-br from-primary/20 to-accent/20 rounded-none">
                    {profile?.display_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-4 mt-12">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects - Video Grid */}
      {projects.length > 0 && (
        <section id="projects" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <MonitorPlay className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">My Projects</h2>
            </div>
            <p className="text-muted-foreground mb-16">Selected video and motion design work</p>

            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
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
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
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
                      <div className="flex gap-3">
                        {project.live_url && (
                          <Button size="sm" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />Watch
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {otherProjects.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
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
                      <h3 className="font-semibold mb-1">{project.title}</h3>
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

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About Me</h2>
              {portfolio?.bio && (
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {portfolio.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {portfolio?.location && (
                  <span className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {portfolio.location}
                  </span>
                )}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="bg-muted/50 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Software & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="outline" className="bg-background">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(experiences.length > 0 || education.length > 0) && (
            <div className="grid md:grid-cols-2 gap-12 mt-16">
              {experiences.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-primary/30 pl-4 py-2">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-secondary/30 pl-4 py-2">
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-2xl text-center">
          <Film className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-muted-foreground mb-8">
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
