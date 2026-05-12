import { useEffect, useMemo, useState } from "react";
import type { ThemeProps } from "./types";
import { fetchAdminThemeBySlug, type AdminTheme } from "@/hooks/useAdminThemes";

interface Props extends ThemeProps {
  slug: string;
}

/**
 * Renders an admin-uploaded custom theme (HTML/CSS/JS) inside a sandboxed iframe.
 * Token replacements: {{name}} {{headline}} {{bio}} {{email}} {{phone}}
 * {{location}} {{website}} {{logo_url}} {{avatar_url}} {{brand_name}}
 */
export default function AdminUploadedTheme({ slug, profile, portfolio }: Props) {
  const [theme, setTheme] = useState<AdminTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = await fetchAdminThemeBySlug(slug);
      if (cancelled) return;
      if (!t) setMissing(true);
      else setTheme(t);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const srcDoc = useMemo(() => {
    if (!theme) return "";
    const p: any = portfolio || {};
    const tokens: Record<string, string> = {
      name: profile?.display_name || p.brand_name || "",
      headline: p.headline || "",
      bio: p.bio || "",
      email: profile?.email || "",
      phone: p.phone || "",
      location: p.location || "",
      website: p.website || "",
      logo_url: p.logo_url || "",
      avatar_url: profile?.avatar_url || "",
      brand_name: p.brand_name || "",
    };
    const fill = (s: string) =>
      s.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => tokens[k] ?? "");

    const html = fill(theme.html || "");
    const css = fill(theme.css || "");
    const js = fill(theme.js || "");
    const isFullDoc = /<html[\s>]/i.test(html);
    if (isFullDoc) {
      let doc = html;
      if (css) doc = doc.replace(/<\/head>/i, `<style>${css}</style></head>`);
      if (js) doc = doc.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
      return doc;
    }
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${tokens.name || theme.name}</title><style>html,body{margin:0;padding:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}${css}</style></head><body>${html}${js ? `<script>${js}<\/script>` : ""}</body></html>`;
  }, [theme, profile, portfolio]);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>Loading theme…</div>;
  }
  if (missing) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>Theme not found.</div>;
  }
  return (
    <iframe
      title={theme?.name || "Custom theme"}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
