import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "freelancer",
  primary: "#3b82f6",
  accent: "#60a5fa",
  background: "#eff6ff",
  surface: "rgba(255, 255, 255, 0.55)",
  text: "#0b1e3f",
  textMuted: "#3a5a8c",
  border: "rgba(59, 130, 246, 0.25)",
  displayFont: "Cormorant Garamond",
  bodyFont: "Karla",
  fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700;800&family=Karla:wght@400;500;600;700&display=swap",
  heroBadge: "Portfolio · Est. 2025",
  heroCta: "Explore the work",
  radius: "18px",
  aesthetic: "blob",
};

export default function FreelancerTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
