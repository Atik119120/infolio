import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "freelancer",
  primary: "#0d0d0d",
  accent: "#2d2d2d",
  background: "#f5f3ee",
  surface: "#e8e4dd",
  text: "#0d0d0d",
  textMuted: "#5b5853",
  border: "#d6d1c7",
  displayFont: "Cormorant Garamond",
  bodyFont: "Karla",
  fontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700;800&family=Karla:wght@400;500;600;700&display=swap",
  heroBadge: "Portfolio · Est. 2025",
  heroCta: "Explore the work",
  radius: "4px",
  aesthetic: "noise",
};

export default function FreelancerTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
