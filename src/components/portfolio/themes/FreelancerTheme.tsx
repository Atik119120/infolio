import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "freelancer",
  primary: "#2563eb",
  accent: "#06b6d4",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textMuted: "#475569",
  border: "#e2e8f0",
  displayFont: "Plus Jakarta Sans",
  bodyFont: "Inter",
  fontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
  heroBadge: "Available for hire",
  heroCta: "View my work",
  radius: "14px",
  aesthetic: "grid",
};

export default function FreelancerTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
