import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";
import {
  MessageCircle, Menu, X, LogIn,
} from "lucide-react";
import alphaLogo from "@/assets/alpha-portfolio-logo.png";

export default function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleNav = (item: NavItem) => {
    close();
    if (item.to) {
      navigate(item.to);
      return;
    }
    if (item.href?.startsWith("/#")) {
      const id = item.href.slice(2);
      if (window.location.pathname !== "/") {
        navigate(`/#${id}`);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1180px,calc(100%-2rem))] bg-background/70 backdrop-blur-xl border border-border/60 rounded-2xl shadow-lg shadow-primary/5">
      <div className="px-5 py-2.5 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <img src={alphaLogo} alt="Infolio" className="h-8 w-auto object-contain" />
        </button>
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
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
          <Button size="sm" className="hidden sm:inline-flex rounded-full gradient-primary text-white hover:opacity-90 text-sm shadow-md shadow-primary/20" onClick={() => navigate("/auth")}>
            Get started
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
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </button>
              );
            })}
            <div className="h-px bg-border/60 my-2" />
            <button
              onClick={() => { close(); openWhatsApp("Hi! I have a question about Infolio."); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#25D366] hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Support
            </button>
            <button onClick={() => { close(); navigate("/auth"); }} className="text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <LogIn className="w-4 h-4" /> Login
            </button>
            <Button size="sm" className="mt-1 w-full rounded-full gradient-primary text-white hover:opacity-90 text-sm shadow-md shadow-primary/20" onClick={() => { close(); navigate("/auth"); }}>
              Get started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
