import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "prd-photographer",
  primary: "#d4af37",
  accent: "#9ca3af",
  background: "#0a0a0a",
  surface: "#141414",
  text: "#f5f5f5",
  textMuted: "#a3a3a3",
  border: "#262626",
  displayFont: "Playfair Display",
  bodyFont: "Inter",
  fontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@500;700;900&display=swap",
  heroBadge: "Studio Lens · Visual storyteller",
  heroCta: "Explore the gallery",
  radius: "2px",
  aesthetic: "noise",
};

export default function PRDPhotographerTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
