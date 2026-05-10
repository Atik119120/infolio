import { useEffect } from "react";

interface PortfolioHeadInput {
  portfolio: any | null;
  displayName?: string | null;
}

/**
 * Applies dynamic <head> metadata for a public portfolio:
 * - title, favicon
 * - meta description / keywords
 * - Open Graph (title, description, image, type, url)
 * - Twitter card (summary_large_image, title, description, image)
 * - google-site-verification
 * - custom_head_html injection
 *
 * Cleans up on unmount so the main app branding is restored.
 */
export function usePortfolioHead({ portfolio, displayName }: PortfolioHeadInput) {
  useEffect(() => {
    if (!portfolio) return;
    const p: any = portfolio;

    // Favicon
    const ensureLink = (rel: string) => {
      let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      return link;
    };
    const originalFavicon = (document.querySelector("link[rel~='icon']") as HTMLLinkElement | null)?.href || "/favicon.png";
    if (p.favicon_url) {
      const link = ensureLink("icon");
      link.href = p.favicon_url;
    }

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
      el.setAttribute("data-portfolio-meta", "true");
    };

    const title =
      p.browser_title ||
      p.meta_title ||
      (p.brand_name && (p.headline ? `${p.brand_name} — ${p.headline}` : p.brand_name)) ||
      (displayName ? (p.headline ? `${displayName} — ${p.headline}` : `${displayName} | Portfolio`) : "Portfolio");

    const originalTitle = document.title;
    document.title = title;

    const description = p.meta_description || p.bio || "";
    const image = p.og_image_url || p.logo_url || p.favicon_url || "";
    const url = typeof window !== "undefined" ? window.location.href : "";

    setMeta("description", description);
    setMeta("keywords", p.meta_keywords || "");

    // Open Graph
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "profile", "property");
    if (url) setMeta("og:url", url, "property");
    if (image) setMeta("og:image", image, "property");

    // Twitter
    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);

    if (p.google_verification) setMeta("google-site-verification", p.google_verification);

    // Custom HTML injection
    if (p.custom_head_html) {
      const container = document.createElement("div");
      container.innerHTML = p.custom_head_html;
      Array.from(container.children).forEach((node) => {
        node.setAttribute("data-portfolio-custom", "true");
        document.head.appendChild(node);
      });
    }

    return () => {
      document.title = originalTitle;
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (link) link.href = originalFavicon;
      document.head.querySelectorAll("[data-portfolio-custom]").forEach((n) => n.remove());
      document.head.querySelectorAll("[data-portfolio-meta]").forEach((n) => n.remove());
    };
  }, [portfolio, displayName]);
}
