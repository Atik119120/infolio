import { CSSProperties } from "react";
import { Twitter, Github, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import type { Block, BlockStyle, DeviceMode } from "../types";

const styleToCss = (s: BlockStyle, device: DeviceMode): CSSProperties => {
  if (
    (device === "mobile" && s.hideMobile) ||
    (device === "tablet" && s.hideTablet) ||
    (device === "desktop" && s.hideDesktop)
  ) {
    return { display: "none" };
  }
  return {
    fontSize: s.fontSize,
    fontWeight: s.fontWeight as any,
    fontFamily: s.fontFamily,
    color: s.color,
    textAlign: s.textAlign,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
    paddingLeft: s.paddingLeft,
    paddingRight: s.paddingRight,
    marginTop: s.marginTop,
    marginBottom: s.marginBottom,
    background: s.background,
    borderRadius: s.borderRadius,
    borderWidth: s.borderWidth,
    borderColor: s.borderColor,
    borderStyle: s.borderWidth ? "solid" : undefined,
    boxShadow: s.boxShadow,
    width: s.width,
    maxWidth: s.maxWidth,
  };
};

const socialIcon: Record<string, any> = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

interface Props {
  block: Block;
  device?: DeviceMode;
  editable?: boolean;
  onEditText?: (field: string, value: string) => void;
}

export function BlockRenderer({ block, device = "desktop", editable, onEditText }: Props) {
  const css = styleToCss(block.style, device);
  const editableProps = (field: string) =>
    editable
      ? {
          contentEditable: true as any,
          suppressContentEditableWarning: true,
          onBlur: (e: any) => onEditText?.(field, e.currentTarget.textContent || ""),
          className: "outline-none focus:ring-2 focus:ring-red-500/50 rounded px-1",
        }
      : {};

  switch (block.type) {
    case "hero":
      return (
        <section style={css}>
          <div className="max-w-4xl mx-auto px-6">
            {block.content.eyebrow && (
              <p className="text-xs uppercase tracking-widest opacity-70 mb-3" {...editableProps("eyebrow")}>
                {block.content.eyebrow}
              </p>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-4" {...editableProps("title")}>
              {block.content.title}
            </h1>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto" {...editableProps("subtitle")}>
              {block.content.subtitle}
            </p>
            {block.content.ctaText && (
              <a
                href={editable ? undefined : block.content.ctaLink}
                onClick={(e) => editable && e.preventDefault()}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition"
              >
                <span {...editableProps("ctaText")}>{block.content.ctaText}</span>
              </a>
            )}
            {block.content.imageUrl && (
              <img src={block.content.imageUrl} alt="" className="mt-10 mx-auto rounded-xl max-w-2xl w-full" />
            )}
          </div>
        </section>
      );

    case "section":
      return (
        <section style={css}>
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-3" {...editableProps("title")}>
              {block.content.title}
            </h2>
            <p className="opacity-80" {...editableProps("body")}>
              {block.content.body}
            </p>
          </div>
        </section>
      );

    case "heading": {
      const Tag = (block.content.level || "h2") as any;
      return (
        <Tag style={css} {...editableProps("text")}>
          {block.content.text}
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p style={css} {...editableProps("text")}>
          {block.content.text}
        </p>
      );

    case "button":
      return (
        <div style={{ textAlign: css.textAlign as any, paddingTop: css.paddingTop, paddingBottom: css.paddingBottom }}>
          <a
            href={editable ? undefined : block.content.link}
            onClick={(e) => editable && e.preventDefault()}
            style={{ ...css, display: "inline-block", paddingTop: css.paddingTop, paddingBottom: css.paddingBottom }}
          >
            <span {...editableProps("text")}>{block.content.text}</span>
          </a>
        </div>
      );

    case "image":
      return (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <img
            src={block.content.src}
            alt={block.content.alt || ""}
            style={css}
            className="inline-block"
          />
        </div>
      );

    case "video":
      return (
        <div style={{ ...css, position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
          <iframe
            src={block.content.src}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
          />
        </div>
      );

    case "divider":
      return <hr style={{ ...css, borderTopWidth: css.borderWidth }} />;

    case "spacer":
      return <div style={{ height: block.content.height || "48px" }} />;

    case "social":
      return (
        <div style={css} className="flex items-center justify-center gap-4">
          {(block.content.links || []).map((l: any, i: number) => {
            const Icon = socialIcon[l.platform] || Twitter;
            return (
              <a
                key={i}
                href={editable ? undefined : l.url}
                onClick={(e) => editable && e.preventDefault()}
                className="w-10 h-10 rounded-full bg-slate-800 text-white inline-flex items-center justify-center hover:bg-red-600 transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      );

    default:
      return null;
  }
}
