export type BlockType =
  | "section"
  | "container"
  | "hero"
  | "heading"
  | "paragraph"
  | "button"
  | "image"
  | "divider"
  | "spacer"
  | "video"
  | "social"
  | "navbar"
  | "about"
  | "services"
  | "pricing"
  | "testimonial"
  | "contact"
  | "footer"
  | "gallery"
  | "form"
  | "customCode"
  | "accordion"
  | "tabs"
  | "alert"
  | "iconBox"
  | "counter"
  | "progress"
  | "stats"
  | "faq"
  | "cta"
  | "team"
  | "logos"
  | "countdown"
  | "carousel";

export interface BlockStyle {
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  background?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  width?: string;
  maxWidth?: string;
  hideMobile?: boolean;
  hideTablet?: boolean;
  hideDesktop?: boolean;
  // Container layout
  display?: "flex" | "grid" | "block";
  flexDirection?: "row" | "column";
  gridColumns?: number;
  gap?: string;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  flexWrap?: "wrap" | "nowrap";
  minHeight?: string;
  // Animation / motion
  animation?:
    | "none"
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "zoom-in"
    | "zoom-out"
    | "flip"
    | "blur";
  animationDuration?: number; // seconds
  animationDelay?: number; // seconds
  hoverEffect?: "none" | "lift" | "grow" | "shrink" | "tilt" | "glow";
  opacity?: number;
}

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  style: BlockStyle;
  children?: Block[];
}

export interface PageTheme {
  primaryColor?: string;
  textColor?: string;
  mutedColor?: string;
  background?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  containerWidth?: string;
  buttonRadius?: string;
  baseFontSize?: string;
}

export interface PageContent {
  blocks: Block[];
  theme?: PageTheme;
}

export type DeviceMode = "desktop" | "tablet" | "mobile";

