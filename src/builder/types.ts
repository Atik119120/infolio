export type BlockType =
  | "section"
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
}

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  style: BlockStyle;
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
