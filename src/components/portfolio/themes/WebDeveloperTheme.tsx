import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Code2, Terminal, Braces,
  Briefcase, GraduationCap, Menu, X, Globe, Cpu, Database
} from "lucide-react";
import { useState } from "react";

export default function WebDeveloperTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
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
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Navigation - Developer Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">
              <span className="text-muted-foreground">~/</span>{profile?.display_name?.toLowerCase().replace(/\s/g, '-') || "dev"}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollTo('hero')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>home
            </button>
            <button onClick={() => scrollTo('bio')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>about
            </button>
            <button onClick={() => scrollTo('skills')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>skills
            </button>
            <button onClick={() => scrollTo('works')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>projects
            </button>
            <button onClick={() => scrollTo('contact')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>contact
            </button>
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
            <button onClick={() => scrollTo('hero')} className="block w-full text-left py-2">/home</button>
            <button onClick={() => scrollTo('bio')} className="block w-full text-left py-2">/about</button>
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2">/skills</button>
            <button onClick={() => scrollTo('works')} className="block w-full text-left py-2">/projects</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">/contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Code Editor Style with Cover */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Cover Image Overlay */}
        <div className="absolute inset-0">
          {projects[0]?.image_url && (
            <img 
              src={projects[0].image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-10"
            />
          )}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Terminal Style Intro */}
              <Card className="mb-8 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-muted-foreground">terminal</span>
                </div>
                <CardContent className="p-4 text-sm">
                  <p className="text-muted-foreground">$ whoami</p>
                  <p className="text-primary mt-1">{profile?.display_name || "Developer"}</p>
                  <p className="text-muted-foreground mt-3">$ cat role.txt</p>
                  <p className="text-secondary mt-1">{portfolio?.headline || "Full Stack Developer"}</p>
                  {portfolio?.location && (
                    <>
                      <p className="text-muted-foreground mt-3">$ echo $LOCATION</p>
                      <p className="text-accent mt-1">{portfolio.location}</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-sans">
                <span className="text-muted-foreground">&lt;</span>
                Hello World
                <span className="text-muted-foreground">/&gt;</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 font-sans">
                I build things for the web. Passionate about clean code, 
                great UX, and solving complex problems.
              </p>

              <div className="flex flex-wrap gap-4">
                {profile?.email && (
                  <Button size="lg" className="font-sans" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Me
                    </a>
                  </Button>
                )}
                {socialLinks.find(l => l.platform.toLowerCase() === 'github') && (
                  <Button size="lg" variant="outline" className="font-sans" asChild>
                    <a href={socialLinks.find(l => l.platform.toLowerCase() === 'github')?.url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View GitHub
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-xl" />
              <Card className="relative overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">profile.tsx</span>
                </div>
                <CardContent className="p-6">
                  <Avatar className="w-32 h-32 mx-auto mb-6 rounded-xl">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary rounded-xl">
                      {profile?.display_name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold font-sans">{profile?.display_name}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{portfolio?.headline}</p>
                  </div>
                  
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
                            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
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
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
              <Braces className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">README.md</span>
            </div>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold font-sans mb-6">About Me</h2>
              {portfolio?.bio && (
                <p className="text-muted-foreground font-sans leading-relaxed text-lg mb-8">
                  {portfolio.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {portfolio?.location && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    {portfolio.location}
                  </span>
                )}
                {profile?.email && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                    {profile.email}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-primary" />
                <h2 className="text-sm uppercase tracking-widest text-primary">Tech Stack</h2>
              </div>
              <h3 className="text-4xl font-bold font-sans">Technologies I Work With</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Database className="w-5 h-5 text-primary" />
                      <h4 className="font-bold font-sans">{category}</h4>
                    </div>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-sans">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.proficiency}%</span>
                          </div>
                          <Progress value={skill.proficiency || 0} className="h-2" />
                        </div>
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
        <section id="education" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-secondary mb-4">Background</h2>
              <h3 className="text-4xl font-bold font-sans">Education</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu) => (
                <Card key={edu.id}>
                  <CardContent className="p-6">
                    <GraduationCap className="w-10 h-10 text-secondary mb-4" />
                    <h4 className="text-xl font-bold font-sans mb-2">{edu.degree}</h4>
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
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-widest text-primary mb-4">Career</h2>
              <h3 className="text-4xl font-bold font-sans">Experience</h3>
            </div>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex gap-6">
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <div className="flex-1 w-0.5 bg-primary/20 mt-2" />
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold font-sans">{exp.position}</h4>
                      <p className="text-primary">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {exp.description && <p className="text-muted-foreground mt-3 font-sans">{exp.description}</p>}
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
        <section id="works" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-sm uppercase tracking-widest text-primary">Portfolio</h2>
              </div>
              <h3 className="text-4xl font-bold font-sans">Projects</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project) => (
                <Card key={project.id} className="group overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-xs text-muted-foreground">{project.title.toLowerCase().replace(/\s/g, '-')}</span>
                  </div>
                  {project.image_url && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="text-xl font-bold font-sans">{project.title}</h4>
                      {project.featured && (
                        <Badge className="bg-primary/10 text-primary border-0">Featured</Badge>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 font-sans">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="outline" className="font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.live_url && (
                        <Button size="sm" className="font-sans" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="outline" className="font-sans" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Source
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
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">contact.sh</span>
            </div>
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold font-sans mb-4">Let's Connect</h2>
              <p className="text-muted-foreground mb-8 font-sans">
                Looking for a developer? Let's build something amazing together.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {profile?.email && (
                  <Button size="lg" className="font-sans" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      {profile.email}
                    </a>
                  </Button>
                )}
                {portfolio?.phone && (
                  <Button size="lg" variant="outline" className="font-sans" asChild>
                    <a href={`tel:${portfolio.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {portfolio.phone}
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-bold">{profile?.display_name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary">$</span> echo "© {new Date().getFullYear()} All Rights Reserved"
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
