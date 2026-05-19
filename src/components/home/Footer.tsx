import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, ArrowUpRight, Mail, Sparkles } from "lucide-react";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";
import { openWhatsApp } from "@/lib/whatsapp";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border/60 overflow-hidden">
      {/* Decorative glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* CTA strip */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-10 mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-3">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase">Ready when you are</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Build your portfolio in <span className="gradient-text">5 minutes</span>.
            </h3>
            <p className="text-sm text-muted-foreground mt-2">No code. No credit card. Free forever.</p>
          </div>
          <button
            onClick={() => navigate("/auth")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-95 transition"
          >
            Get started free
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 mb-5">
              <img src={alphaLogo} alt="Infolio" className="h-9 w-auto object-contain" />
            </button>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Beautiful portfolios for creators, developers and freelancers — built without writing a single line of code.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openWhatsApp("Hi! I have a question about Infolio.")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 text-sm font-medium transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <a
                href="mailto:atik.magicbox@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/40 text-muted-foreground hover:text-foreground hover:border-primary/40 text-sm font-medium transition"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a></li>
              <li><button onClick={() => navigate("/themes")} className="text-foreground/80 hover:text-primary transition-colors">Themes</button></li>
              <li><a href="/#pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="/#faq" className="text-foreground/80 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">Account</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate("/auth")} className="text-foreground/80 hover:text-primary transition-colors">Login</button></li>
              <li><button onClick={() => navigate("/auth")} className="text-foreground/80 hover:text-primary transition-colors">Create account</button></li>
              <li>
                <button
                  onClick={() => openWhatsApp("Hi! I need support with Infolio.")}
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Support
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative border-t border-border/60">
        <div className="container mx-auto px-6 py-5">
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed text-center max-w-4xl mx-auto">
            Infolio provides website building and deployment tools as-is. Users are fully responsible for their content, code, deployments, domains, products, and business activities.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border/60">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Infolio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by Infolio Team
          </p>
        </div>
      </div>
    </footer>
  );
}
