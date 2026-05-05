import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "prd-graphic-designer",
  primary: "#ff4d4d",
  accent: "#111111",
  background: "#f5f0eb",
  surface: "#ffffff",
  text: "#111111",
  textMuted: "#57534e",
  border: "#e7e0d6",
  displayFont: "Clash Display",
  bodyFont: "Satoshi",
  fontsHref: "https://api.fontshare.com/v2/css?f[]=clash-display@600,700,800&f[]=satoshi@400,500,700&display=swap",
  heroBadge: "Editorial design studio",
  heroCta: "Browse the portfolio",
  radius: "4px",
  aesthetic: "lines",
};

export default function PRDGraphicDesignerTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
