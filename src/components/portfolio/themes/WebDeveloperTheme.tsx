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
            <button onClick={() => scrollTo('about')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>about
            </button>
            <button onClick={() => scrollTo('projects')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>projects
            </button>
            <button onClick={() => scrollTo('skills')} className="text-sm hover:text-primary transition-colors font-normal">
              <span className="text-muted-foreground">/</span>skills
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
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2">/about</button>
            <button onClick={() => scrollTo('projects')} className="block w-full text-left py-2">/projects</button>
            <button onClick={() => scrollTo('skills')} className="block w-full text-left py-2">/skills</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">/contact</button>
          </div>
        )}
      </nav>

      {/* Hero - Code Editor Style */}
      <section id="about" className="min-h-screen flex items-center pt-20 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Terminal Style Intro */}
              <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="ml-2 text-xs text-muted-foreground">terminal</span>
                </div>
                <div className="p-4 text-sm">
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
                </div>
              </div>

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

          {portfolio?.bio && (
            <Card className="mt-16 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Braces className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">README.md</span>
                </div>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {portfolio.bio}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="projects" className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold font-sans">Projects</h2>
            </div>
            <p className="text-muted-foreground mb-16 font-sans">Things I've built</p>

            <div className="grid md:grid-cols-2 gap-8">
              {[...featuredProjects, ...otherProjects].map((project) => (
                <Card key={project.id} className="group overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-warning/50" />
                    <div className="w-3 h-3 rounded-full bg-success/50" />
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
                      <h3 className="text-xl font-bold font-sans">{project.title}</h3>
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

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold font-sans">Tech Stack</h2>
            </div>
            <p className="text-muted-foreground mb-16 font-sans">Technologies I work with</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card key={category}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Database className="w-5 h-5 text-primary" />
                      <h3 className="font-bold font-sans">{category}</h3>
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

      {/* Experience & Education */}
      {(experiences.length > 0 || education.length > 0) && (
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              {experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-sans">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-primary/30 pl-4">
                        <h3 className="font-bold font-sans">{exp.position}</h3>
                        <p className="text-primary text-sm">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                        {exp.description && <p className="text-sm mt-2 text-muted-foreground font-sans">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-sans">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                    Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l-2 border-secondary/30 pl-4">
                        <h3 className="font-bold font-sans">{edu.degree}</h3>
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

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">contact.sh</span>
            </div>
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 font-sans">Let's Connect</h2>
              <p className="text-muted-foreground mb-8 font-sans">
                Got a project in mind? Let's build something together.
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
            <span className="text-sm">
              <span className="text-muted-foreground">~/</span>{profile?.display_name?.toLowerCase().replace(/\s/g, '-')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-sans">
            © {new Date().getFullYear()} Built with ❤️ and lots of ☕
          </p>
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
