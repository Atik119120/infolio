import type { PageTheme } from "../types";

/**
 * Renders a <style> tag that injects CSS variables and global rules
 * scoped to the page wrapper id. Used in canvas + published page.
 */
export function ThemeStyle({ theme, scopeId }: { theme?: PageTheme; scopeId: string }) {
  const t = theme || {};
  const scope = `#${scopeId}`;
  const css = `
${scope} {
  --builder-primary: ${t.primaryColor || "#dc2626"};
  --builder-text: ${t.textColor || "#0f172a"};
  --builder-muted: ${t.mutedColor || "#64748b"};
  --builder-bg: ${t.background || "#ffffff"};
  --builder-radius: ${t.buttonRadius || "9999px"};
  --builder-container: ${t.containerWidth || "1200px"};
  ${t.baseFontSize ? `font-size: ${t.baseFontSize};` : ""}
  ${t.fontFamily ? `font-family: ${t.fontFamily};` : ""}
  color: var(--builder-text);
}
${scope} h1, ${scope} h2, ${scope} h3, ${scope} h4, ${scope} h5, ${scope} h6 {
  ${t.headingFontFamily ? `font-family: ${t.headingFontFamily};` : ""}
}
${scope} .max-w-6xl, ${scope} .max-w-5xl, ${scope} .max-w-4xl, ${scope} .max-w-3xl {
  max-width: min(100%, var(--builder-container));
}
${scope} a { transition: opacity .2s ease; }
${scope} .bg-red-600 { background-color: var(--builder-primary) !important; }
${scope} .text-red-600 { color: var(--builder-primary) !important; }
${scope} .border-red-500 { border-color: var(--builder-primary) !important; }
${scope} .hover\\:bg-red-700:hover { filter: brightness(0.92); }
${scope} .rounded-full { border-radius: var(--builder-radius); }
`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
