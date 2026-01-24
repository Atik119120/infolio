import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation items for all themes
export const PORTFOLIO_PAGES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "works", label: "Works" },
  { id: "contact", label: "Contact" },
] as const;

export type PortfolioPage = typeof PORTFOLIO_PAGES[number]["id"];

interface ThemeLayoutProps {
  children: ReactNode;
  currentPage: PortfolioPage;
  onPageChange: (page: PortfolioPage) => void;
  logoUrl?: string | null;
  displayName?: string | null;
  themeIcon?: ReactNode;
  navClassName?: string;
  footerClassName?: string;
  showBackToTop?: boolean;
}

export function ThemeLayout({
  children,
  currentPage,
  onPageChange,
  logoUrl,
  displayName,
  themeIcon,
  navClassName,
  footerClassName,
  showBackToTop = true,
}: ThemeLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (page: PortfolioPage) => {
    onPageChange(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b",
        navClassName || "bg-background/80 border-border"
      )}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : themeIcon ? (
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {themeIcon}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">
                  {displayName?.[0]?.toUpperCase() || "P"}
                </div>
              )}
              {displayName && (
                <span className="font-semibold text-lg hidden sm:block">{displayName}</span>
              )}
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {PORTFOLIO_PAGES.map((page) => (
                <motion.button
                  key={page.id}
                  onClick={() => handleNavClick(page.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPage === page.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page.label}
                </motion.button>
              ))}
            </div>

            {/* Right Side - Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background/95 backdrop-blur-md"
            >
              <div className="container mx-auto px-6 py-4 space-y-2">
                {PORTFOLIO_PAGES.map((page) => (
                  <motion.button
                    key={page.id}
                    onClick={() => handleNavClick(page.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg font-medium transition-all",
                      currentPage === page.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    {page.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content with Transition */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pt-20"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <footer className={cn(
        "py-8 px-6 border-t mt-20",
        footerClassName || "bg-muted/30 border-border"
      )}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Footer Logo */}
            <motion.button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.02 }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : themeIcon ? (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {themeIcon}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  {displayName?.[0]?.toUpperCase() || "P"}
                </div>
              )}
              {displayName && (
                <span className="font-semibold">{displayName}</span>
              )}
            </motion.button>

            {/* Footer Nav */}
            <div className="flex flex-wrap justify-center gap-4">
              {PORTFOLIO_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleNavClick(page.id)}
                  className={cn(
                    "text-sm transition-colors",
                    currentPage === page.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {page.label}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {displayName || "Portfolio"}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Page transition wrapper for consistent animations
export function PageSection({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <section className={cn("min-h-[calc(100vh-5rem)]", className)}>
      {children}
    </section>
  );
}