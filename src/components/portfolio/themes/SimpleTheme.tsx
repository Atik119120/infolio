import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Mail, MapPin, Phone, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProps } from "./types";
import { formatDate, getSocialIcon } from "./utils";

export default function SimpleTheme({
  profile,
  portfolio,
  skills,
  projects,
  experiences,
  education,
  socialLinks,
}: ThemeProps) {
  const displayName = profile?.display_name || "Your Name";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {portfolio?.logo_url ? (
                <img src={portfolio.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <Star className="w-5 h-5 text-primary" />
              )}
              <span className="font-semibold">{displayName}</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
              <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
              <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayName}</h1>
            
            {portfolio?.headline && (
              <p className="text-xl text-primary mb-4">{portfolio.headline}</p>
            )}
            
            {portfolio?.location && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                <MapPin className="w-4 h-4" />
                <span>{portfolio.location}</span>
              </div>
            )}
            
            {portfolio?.bio && (
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                {portfolio.bio}
              </p>
            )}

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex justify-center gap-3">
                {socialLinks.map((link) => {
                  const IconComponent = getSocialIcon(link.platform);
                  return (
                    <Button
                      key={link.id}
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <IconComponent className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">Skills</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="px-4 py-2 text-sm">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">Projects</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {project.image_url && (
                      <div className="h-48 bg-muted">
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tech_stack.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {project.live_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Live
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-3 h-3 mr-1" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Separator />

      {/* Experience Section */}
      {experiences && experiences.length > 0 && (
        <section id="experience" className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">Experience</h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-primary">{exp.company}</p>
                        </div>
                        <Badge variant="secondary">
                          {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </Badge>
                      </div>
                      {exp.description && (
                        <p className="text-muted-foreground text-sm mt-3">{exp.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          {edu.field_of_study && (
                            <p className="text-sm text-primary">{edu.field_of_study}</p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Separator />

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Feel free to reach out for collaborations or just a friendly hello!
            </p>
            
            <div className="flex flex-col items-center gap-4">
              {profile?.email && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </a>
                </Button>
              )}
              {portfolio?.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${portfolio.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {portfolio.phone}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            {portfolio?.logo_url ? (
              <img src={portfolio.logo_url} alt="Logo" className="h-6 w-auto object-contain" />
            ) : (
              <Star className="w-4 h-4 text-primary" />
            )}
            <span className="font-medium">{displayName}</span>
          </div>
          <p>© {new Date().getFullYear()} {displayName}. All rights reserved.</p>
          <p className="mt-2">
            Built with <a href="https://alphaportfolio.com" className="text-primary hover:underline">Alpha Portfolio</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
