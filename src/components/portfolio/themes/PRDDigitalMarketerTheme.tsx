import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "prd-digital-marketer",
  primary: "#7c3aed",
  accent: "#ec4899",
  background: "#0b1020",
  surface: "#111936",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#1e293b",
  displayFont: "Space Grotesk",
  bodyFont: "Inter",
  fontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
  heroBadge: "Growth Lab · Data-driven marketer",
  heroCta: "View case studies",
  radius: "12px",
  aesthetic: "grid",
};

export default function PRDDigitalMarketerTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
