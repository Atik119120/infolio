import {
  Sparkles, Palette, Briefcase, TrendingUp, Camera, Video,
  Code, Rocket, Target, Lightbulb, Smartphone, Wrench,
  PenTool, Brush, Ruler, Film, Image as ImageIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  palette: Palette,
  briefcase: Briefcase,
  trending: TrendingUp,
  camera: Camera,
  video: Video,
  code: Code,
  rocket: Rocket,
  target: Target,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
  wrench: Wrench,
  pen: PenTool,
  brush: Brush,
  ruler: Ruler,
  film: Film,
  image: ImageIcon,
};

export const SERVICE_ICON_KEYS = [
  "sparkles","palette","briefcase","trending","camera","video",
  "code","rocket","target","lightbulb","smartphone","wrench",
];

// Legacy emoji → key migration
const EMOJI_MAP: Record<string, string> = {
  "✨": "sparkles", "🎨": "palette", "💼": "briefcase", "📈": "trending",
  "📷": "camera", "🎬": "video", "💻": "code", "🚀": "rocket",
  "🎯": "target", "💡": "lightbulb", "📱": "smartphone", "🛠️": "wrench",
  "🖌️": "brush", "✒️": "pen", "📐": "ruler", "🖼️": "image",
};

export function ServiceIcon({ icon, className }: { icon?: string | null; className?: string }) {
  const key = (icon && (SERVICE_ICONS[icon] ? icon : EMOJI_MAP[icon])) || "sparkles";
  const Cmp = SERVICE_ICONS[key] ?? Sparkles;
  return <Cmp className={className ?? "w-5 h-5"} />;
}
