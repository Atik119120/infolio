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
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  lineHeight?: string;
  letterSpacing?: string;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textShadow?: string;

  // Spacing
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;

  // Background
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  backdropBlur?: number;

  // Border
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  borderWidth?: string;
  borderTopWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderRightWidth?: string;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "double";

  // Shadow
  boxShadow?: string;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowColor?: string;

  // Size
  width?: string;
  height?: string;
  maxWidth?: string;
  minHeight?: string;

  // Position
  position?: "static" | "relative" | "absolute" | "sticky" | "fixed";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;

  // Transform
  rotate?: number;
  scale?: number;
  translateX?: string;
  translateY?: string;
  skewX?: number;
  skewY?: number;

  // Filters
  filterBlur?: number;
  filterBrightness?: number;
  filterGrayscale?: number;

  // Container layout
  display?: "flex" | "grid" | "block" | "inline-block";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  gridColumns?: number;
  gap?: string;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  flexWrap?: "wrap" | "nowrap";

  // Visibility
  hideMobile?: boolean;
  hideTablet?: boolean;
  hideDesktop?: boolean;

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
  animationDuration?: number;
  animationDelay?: number;
  hoverEffect?: "none" | "lift" | "grow" | "shrink" | "tilt" | "glow";
  opacity?: number;

  // Advanced custom
  cssClasses?: string;
  htmlId?: string;
  customCss?: string;
  hoverCss?: string;

  // Responsive overrides (recursive)
  responsive?: {
    tablet?: Partial<BlockStyle>;
    mobile?: Partial<BlockStyle>;
  };
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
  header?: Block | null;
  footer?: Block | null;
}

export type DeviceMode = "desktop" | "tablet" | "mobile";

