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
  | "social";

export interface BlockStyle {
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  // Spacing
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  // Background & Border
  background?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  // Effects
  boxShadow?: string;
  // Layout
  width?: string;
  maxWidth?: string;
  // Visibility
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

export interface PageContent {
  blocks: Block[];
  theme?: {
    primaryColor?: string;
    background?: string;
    fontFamily?: string;
  };
}

export type DeviceMode = "desktop" | "tablet" | "mobile";
