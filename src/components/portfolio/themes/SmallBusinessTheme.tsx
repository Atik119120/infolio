import { StandardThemeShell, ThemeStyle } from "./StandardThemeShell";
import { ThemeProps } from "./types";

const style: ThemeStyle = {
  id: "small-business",
  primary: "#16a34a",
  accent: "#f59e0b",
  background: "#fffbf5",
  surface: "#ffffff",
  text: "#1c1917",
  textMuted: "#57534e",
  border: "#fde68a",
  displayFont: "Fraunces",
  bodyFont: "Nunito",
  fontsHref: "https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=Nunito:wght@400;600;700&display=swap",
  heroBadge: "Locally trusted",
  heroCta: "See our offerings",
  radius: "20px",
  aesthetic: "blob",
};

export default function SmallBusinessTheme(props: ThemeProps) {
  return <StandardThemeShell {...props} services={props.services || []} style={style} />;
}
