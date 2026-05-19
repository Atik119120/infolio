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
  | "customCode";

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
  background?: string;
  fontFamily?: string;
  containerWidth?: string;
  buttonRadius?: string;
}

export interface PageContent {
  blocks: Block[];
  theme?: PageTheme;
}

export type DeviceMode = "desktop" | "tablet" | "mobile";

