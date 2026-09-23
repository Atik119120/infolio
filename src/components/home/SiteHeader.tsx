import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";
import {
  MessageCircle, Menu, X, LogIn, ArrowRight,
} from "lucide-react";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";

export default function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-2rem))] bg-background/80 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg shadow-primary/5">
      <div className="px-5 py-2.5 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <img src={alphaLogo} alt="Infolio" className="h-8 w-auto object-contain" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openWhatsApp("Hi! I have a question about Infolio.")}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#25D366] hover:text-[#1fbb59] px-3 py-1.5"
          >
            <MessageCircle className="w-4 h-4" /> Support
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex text-sm gap-1.5">
            <LogIn className="w-4 h-4" /> Login
          </Button>
          <Button size="sm" className="hidden sm:inline-flex rounded-xl gradient-primary text-white text-xs font-semibold px-4 group" onClick={() => navigate("/auth")}>
            Get started
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border/60 bg-background/60 hover:bg-muted transition-colors"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-3 pb-3 pt-1 border-t border-border/60">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { close(); openWhatsApp("Hi! I have a question about Infolio."); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#25D366] hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Support
            </button>
            <button onClick={() => { close(); navigate("/auth"); }} className="text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <LogIn className="w-4 h-4" /> Login
            </button>
            <Button size="sm" className="mt-1 w-full rounded-xl gradient-primary text-white text-sm font-semibold group flex items-center justify-center gap-1.5" onClick={() => { close(); navigate("/auth"); }}>
              Get started
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
