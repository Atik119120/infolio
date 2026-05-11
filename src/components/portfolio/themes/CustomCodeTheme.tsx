import { useMemo } from "react";
import type { ThemeProps } from "./types";

/**
 * Custom Code theme — renders user-supplied HTML/CSS/JS in a sandboxed iframe.
 * Token replacements available in HTML/CSS/JS:
 *   {{name}} {{headline}} {{bio}} {{email}} {{phone}} {{location}}
 *   {{website}} {{logo_url}} {{avatar_url}}
 */
export default function CustomCodeTheme({ profile, portfolio }: ThemeProps) {
  const srcDoc = useMemo(() => {
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

    const html = fill(p.custom_html || "");
    const css = fill(p.custom_css || "");
    const js = fill(p.custom_js || "");

    // If user provided a full HTML document, inject css/js into it; otherwise wrap.
    const isFullDoc = /<html[\s>]/i.test(html);
    if (isFullDoc) {
      let doc = html;
      if (css) doc = doc.replace(/<\/head>/i, `<style>${css}</style></head>`);
      if (js) doc = doc.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
      return doc;
    }

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${tokens.name || "Portfolio"}</title>
<style>
  html,body{margin:0;padding:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
  ${css}
</style>
</head>
<body>
${html}
${js ? `<script>${js}<\/script>` : ""}
</body>
</html>`;
  }, [portfolio, profile]);

  return (
    <iframe
      title="Custom portfolio"
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
