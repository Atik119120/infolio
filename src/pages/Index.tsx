import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Globe, Palette, Users } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">PortfolioHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button 
              className="gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Build your portfolio in minutes</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create a Stunning{" "}
            <span className="gradient-text">Portfolio Website</span>
            <br />
            Without Coding
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Showcase your work, skills, and experience with a professional portfolio 
            that stands out. Get your own custom URL and go live in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              Start Building Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/u/demo")}
            >
              View Demo Portfolio
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">10K+</div>
              <div className="text-muted-foreground">Portfolios Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">50+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">4.9★</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All the tools to create, customize, and share your professional portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Palette className="w-8 h-8" />}
              title="Beautiful Templates"
              description="Choose from stunning, modern templates designed to make your work shine."
              gradient="gradient-primary"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Easy Form Builder"
              description="Just fill in your details. No coding, no design skills needed."
              gradient="gradient-secondary"
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8" />}
              title="Custom URL"
              description="Get your own subdomain like yourname.portfoliohub.com for free."
              gradient="gradient-accent"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Social Integration"
              description="Connect all your social profiles and let visitors find you everywhere."
              gradient="gradient-primary"
            />
            <FeatureCard 
              icon={<ArrowRight className="w-8 h-8" />}
              title="Instant Updates"
              description="Make changes anytime and see them live immediately on your site."
              gradient="gradient-secondary"
            />
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8" />}
              title="SEO Optimized"
              description="Built-in SEO so recruiters and clients can find you on Google."
              gradient="gradient-accent"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="gradient-hero rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Build Your Portfolio?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of professionals who've already created their stunning portfolio. 
                It's free to start!
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Create Your Portfolio
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-10 -left-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">PortfolioHub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 PortfolioHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
      <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}