import { useState, useCallback } from "react";

export type PortfolioPage = "home" | "about" | "skills" | "works" | "contact";

export const PORTFOLIO_PAGES: { id: PortfolioPage; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "works", label: "Works" },
  { id: "contact", label: "Contact" },
];

export function usePortfolioNavigation(initialPage: PortfolioPage = "home") {
  const [currentPage, setCurrentPage] = useState<PortfolioPage>(initialPage);

  const navigateTo = useCallback((page: PortfolioPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return {
    currentPage,
    navigateTo,
    scrollToSection,
    pages: PORTFOLIO_PAGES,
  };
}