import { Helmet } from "react-helmet-async";
import { Palette, Zap, Globe, Rocket, Server, Search, Cloud, Image } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import Footer from "@/components/home/Footer";
import { SectionHeader, FeatureCard } from "@/pages/home/shared";

export default function Features() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Features — Infolio</title>
        <meta name="description" content="Portfolio themes, custom domains, SEO tools and instant publishing — everything creators need." />
        <link rel="canonical" href="https://infolio.online/features" />
      </Helmet>
      <SiteHeader />
      <section className="pt-32 md:pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader eyebrow="Features" title="Built for creators" subtitle="Everything you need to build and publish a stunning portfolio — no code required." />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border/60 mt-12 rounded-3xl overflow-hidden border border-border/60">
            <FeatureCard icon={<Palette className="w-5 h-5" />} title="Premium Themes" description="Beautiful themes for every profession." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="No-Code Builder" description="Drag, drop, publish — live preview." />
            <FeatureCard icon={<Rocket className="w-5 h-5" />} title="Instant Publish" description="Go live in seconds, worldwide." />
            <FeatureCard icon={<Globe className="w-5 h-5" />} title="Free Subdomain" description="yourname.infolio.online free." />
            <FeatureCard icon={<Server className="w-5 h-5" />} title="Custom Domain" description="Your own domain with auto SSL." />
            <FeatureCard icon={<Search className="w-5 h-5" />} title="SEO Tools" description="Meta, sitemap, social tags." />
            <FeatureCard icon={<Image className="w-5 h-5" />} title="Project Gallery" description="Showcase work with images & videos." />
            <FeatureCard icon={<Cloud className="w-5 h-5" />} title="Global CDN" description="Fast loading from anywhere." />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
