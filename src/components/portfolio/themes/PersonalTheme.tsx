import { ThemeProps } from "./types";
import { getSocialIcon, formatDate } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Heart, Sparkles, BookOpen,
  Briefcase, GraduationCap, Menu, X, Quote, User
} from "lucide-react";
import { useState } from "react";

export default function PersonalTheme({ profile, portfolio, skills, projects, experiences, education, socialLinks }: ThemeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Elegant Personal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-accent" />
            <span className="font-serif text-xl italic">{profile?.display_name || "My Story"}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('hero')} className="text-sm hover:text-accent transition-colors">Home</button>
            <button onClick={() => scrollTo('bio')} className="text-sm hover:text-accent transition-colors">About</button>
            <button onClick={() => scrollTo('skills')} className="text-sm hover:text-accent transition-colors">Skills</button>
            <button onClick={() => scrollTo('works')} className="text-sm hover:text-accent transition-colors">Works</button>
            <button onClick={() => scrollTo('contact')} className="text-sm hover:text-accent transition-colors">Connect</button>
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
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2">Connect</button>
          </div>
        )}
      </nav>

      {/* Hero - Personal & Elegant with Cover */}
      <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        
        {/* Cover Background */}
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
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-accent/10 text-accent border-accent/20">
              <Sparkles className="w-3 h-3 mr-2" />
              Welcome to my world
            </Badge>

            <Avatar className="w-40 h-40 mx-auto mb-8 border-4 border-accent/20 shadow-xl">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-5xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
                {profile?.display_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6">
              {profile?.display_name || "Hello, I'm Here"}
            </h1>

            {portfolio?.headline && (
              <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 max-w-2xl mx-auto italic">
                "{portfolio.headline}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
              {portfolio?.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {portfolio.location}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full" onClick={() => scrollTo('bio')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Read My Story
              </Button>
              {profile?.email && (
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Say Hello
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
            {/* Photo */}
            <div className="relative order-2 lg:order-1">
              <Avatar className="w-full aspect-square max-w-md mx-auto rounded-3xl shadow-2xl border-0">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-3xl object-cover" />
                <AvatarFallback className="text-8xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent rounded-3xl">
                  {profile?.display_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Bio Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-sm font-medium uppercase tracking-widest text-accent mb-4">About Me</h2>
              <h3 className="text-4xl font-serif mb-6">{profile?.display_name}</h3>
              
              {portfolio?.bio && (
                <Card className="bg-card/50 backdrop-blur-sm mb-8">
                  <CardContent className="p-8">
                    <Quote className="w-8 h-8 text-accent/30 mb-4" />
                    <p className="text-lg text-muted-foreground font-light leading-relaxed italic">
                      {portfolio.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all"
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
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-sm font-medium uppercase tracking-widest text-accent mb-4">Expertise</h2>
            <h3 className="text-4xl font-serif mb-12">What I Do</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => (
                <Badge key={skill.id} variant="outline" className="px-5 py-2 text-sm font-light rounded-full bg-background">
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
              <h2 className="text-sm font-medium uppercase tracking-widest text-secondary mb-4">Background</h2>
              <h3 className="text-4xl font-serif">Education</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {education.map((edu) => (
                <Card key={edu.id} className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                      <GraduationCap className="w-7 h-7 text-secondary" />
                    </div>
                    <h4 className="text-xl font-semibold font-serif mb-2">{edu.degree}</h4>
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
              <h2 className="text-sm font-medium uppercase tracking-widest text-accent mb-4">Journey</h2>
              <h3 className="text-4xl font-serif">Career Path</h3>
            </div>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.id} className={`flex gap-8 ${index % 2 === 0 ? '' : 'flex-row-reverse text-right'}`}>
                  <div className="hidden md:block w-1/2" />
                  <div className="w-4 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-accent" />
                    <div className="flex-1 w-0.5 bg-accent/20" />
                  </div>
                  <Card className="flex-1 md:w-1/2 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold font-serif">{exp.position}</h4>
                      <p className="text-accent">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                      {exp.description && <p className="text-muted-foreground mt-3 font-light">{exp.description}</p>}
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
              <h2 className="text-sm font-medium uppercase tracking-widest text-accent mb-4">Portfolio</h2>
              <h3 className="text-4xl font-serif">My Works</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[...featuredProjects, ...otherProjects].map((project) => (
                <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10">
                        <Heart className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {project.featured && (
                      <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-serif mb-2">{project.title}</h4>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 font-light">{project.description}</p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs font-light">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.live_url && (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="ghost" className="rounded-full" asChild>
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
      <section id="contact" className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <User className="w-10 h-10 text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-serif mb-6">Let's Connect</h2>
          <p className="text-muted-foreground font-light mb-8 text-lg">
            I'd love to hear from you. Whether it's a question, a collaboration, or just to say hello.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.email && (
              <Button size="lg" className="rounded-full" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Say Hello
                </a>
              </Button>
            )}
            {portfolio?.phone && (
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <a href={`tel:${portfolio.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {portfolio.phone}
                </a>
              </Button>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-12">
              <p className="text-sm text-muted-foreground mb-4">Find me on</p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-background flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all shadow-md"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto text-center">
          <Heart className="w-6 h-6 text-accent mx-auto mb-4" />
          <p className="font-serif text-lg mb-2">{profile?.display_name}</p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} — Made with love
          </p>
        </div>
      </footer>
    </div>
  );
}
