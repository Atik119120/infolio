import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";
import { openWhatsApp } from "@/lib/whatsapp";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={alphaLogo} alt="Alokchitra" className="h-10 w-auto object-contain invert" />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create stunning portfolio websites in minutes. Showcase your work and land your dream opportunities.
            </p>
            <button
              onClick={() => openWhatsApp("Hi! I have a question about Alokchitra.")}
              className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:text-[#1fbb59] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </button>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><button onClick={() => navigate("/themes")} className="text-muted-foreground hover:text-foreground transition-colors">Themes</button></li>
              <li><a href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition-colors">Login</button></li>
              <li><button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition-colors">Get Started</button></li>
              <li>
                <button
                  onClick={() => openWhatsApp("Hi! I need support with Alokchitra.")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Alokchitra. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Alokchitra Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
