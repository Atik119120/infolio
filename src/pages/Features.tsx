import { Helmet } from "react-helmet-async";
import {
  Palette, Zap, Globe, Users, Rocket, Server, Github, Code2,
  Layers, FileCode, FolderGit2, Search, Cloud, Database, BarChart3, ShoppingBag,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import Footer from "@/components/home/Footer";
import { SectionHeader, FeatureCard } from "@/pages/home/shared";

export default function Features() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Features — Infolio</title>
        <meta name="description" content="Everything Infolio offers — no-code themes, GitHub deploys, custom domains, SEO, CDN and more." />
        <link rel="canonical" href="https://infolio.online/features" />
      </Helmet>
      <SiteHeader />
      <section className="pt-32 md:pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader eyebrow="Features" title="Everything you need to ship" subtitle="From no-code themes to GitHub-powered deployments — one platform." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/60 mt-12 rounded-3xl overflow-hidden border border-border/60">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Ready Themes" description="Premium themes for every profession." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="Portfolio Builder" description="No-code guided builder, live preview." />
            <FeatureCard icon={<Rocket className="w-5 h-5" />} title="Instant Deploy" description="Push live in seconds, globally." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Free Subdomain" description="username.infolio.online instantly." />
            <FeatureCard icon={<Server className="w-5 h-5" />} title="Custom Domain" description="Connect any domain with auto SSL." />
            <FeatureCard icon={<Github className="w-5 h-5" />} title="GitHub Integration" description="Import & deploy any repository." />
            <FeatureCard icon={<Code2 className="w-5 h-5" />} title="React Deploy" description="Production React builds, optimized." />
            <FeatureCard icon={<Layers className="w-5 h-5" />} title="Next.js Deploy" description="SSR, ISR, edge — all supported." />
            <FeatureCard icon={<FileCode className="w-5 h-5" />} title="Vite Deploy" description="Lightning-fast Vite builds." />
            <FeatureCard icon={<FolderGit2 className="w-5 h-5" />} title="Custom HTML/CSS" description="Drop in your own code anywhere." />
            <FeatureCard icon={<Search className="w-5 h-5" />} title="SEO Management" description="Meta tags, sitemap, Search Console." />
            <FeatureCard icon={<Cloud className="w-5 h-5" />} title="Global CDN" description="Edge-cached for blazing speed." />
            <FeatureCard icon={<Users className="w-5 h-5" />} title="Team Workspace" description="Collaborate across projects." />
            <FeatureCard icon={<Database className="w-5 h-5" />} title="Multi-Project" description="Run up to 10 projects per account." />
            <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="Analytics" description="Visitor insights — coming soon." />
            <FeatureCard icon={<ShoppingBag className="w-5 h-5" />} title="E-commerce" description="Store, products, checkout — soon." />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
