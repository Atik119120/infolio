import { CSSProperties } from "react";
import { Twitter, Github, Linkedin, Instagram, Facebook, Youtube, Check, Plus } from "lucide-react";
import type { Block, BlockStyle, DeviceMode } from "../types";
import { useBuilderStore } from "../store";
import { createBlock } from "./defaults";
import { cn } from "@/lib/utils";
import {
  AccordionWidget, TabsWidget, AlertWidget, IconBoxWidget, CounterWidget,
  ProgressWidget, StatsWidget, FaqWidget, CtaWidget, TeamWidget, LogosWidget,
  CountdownWidget, CarouselWidget,
} from "./AdvancedWidgets";
import { AnimationWrapper } from "./AnimationWrapper";

const styleToCss = (s: BlockStyle, device: DeviceMode): CSSProperties => {
  if (
    (device === "mobile" && s.hideMobile) ||
    (device === "tablet" && s.hideTablet) ||
    (device === "desktop" && s.hideDesktop)
  ) {
    return { display: "none" };
  }
  const css: CSSProperties = {
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
    minHeight: s.minHeight,
  };
  if (s.display) css.display = s.display;
  if (s.display === "flex") {
    css.flexDirection = s.flexDirection;
    css.justifyContent = s.justifyContent;
    css.alignItems = s.alignItems;
    css.flexWrap = s.flexWrap;
    css.gap = s.gap;
  } else if (s.display === "grid") {
    css.gridTemplateColumns = `repeat(${s.gridColumns || 3}, minmax(0, 1fr))`;
    css.gap = s.gap;
  }
  return css;
};

const socialIcon: Record<string, any> = {
  twitter: Twitter, github: Github, linkedin: Linkedin,
  instagram: Instagram, facebook: Facebook, youtube: Youtube,
};

interface Props {
  block: Block;
  device?: DeviceMode;
  editable?: boolean;
  editorMode?: boolean;
  onEditText?: (field: string, value: string) => void;
}

export function BlockRenderer(props: Props) {
  const { block, editorMode } = props;
  const content = <BlockRendererInner {...props} />;
  // Disable entrance animations inside editor canvas; keep hover/opacity.
  if (editorMode) {
    const styleNoAnim = { ...block.style, animation: "none" as const };
    return <AnimationWrapper style={styleNoAnim}>{content}</AnimationWrapper>;
  }
  return <AnimationWrapper style={block.style}>{content}</AnimationWrapper>;
}

function BlockRendererInner({ block, device = "desktop", editable, editorMode, onEditText }: Props) {
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
    case "container":
      return <ContainerBlock block={block} css={css} device={device} editorMode={editorMode} />;


    case "navbar":
      return (
        <nav style={css}>
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-6">
            <span className="font-bold text-lg" {...editableProps("brand")}>{block.content.brand}</span>
            <div className="hidden md:flex items-center gap-6 text-sm">
              {(block.content.links || []).map((l: any, i: number) => (
                <a key={i} href={editable ? undefined : l.url} onClick={(e) => editable && e.preventDefault()} className="opacity-80 hover:opacity-100">{l.label}</a>
              ))}
            </div>
            {block.content.ctaText && (
              <a href={editable ? undefined : block.content.ctaLink} onClick={(e) => editable && e.preventDefault()} className="text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-full">
                <span {...editableProps("ctaText")}>{block.content.ctaText}</span>
              </a>
            )}
          </div>
        </nav>
      );

    case "hero":
      return (
        <section style={css}>
          <div className="max-w-4xl mx-auto px-6">
            {block.content.eyebrow && (
              <p className="text-xs uppercase tracking-widest opacity-70 mb-3" {...editableProps("eyebrow")}>{block.content.eyebrow}</p>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-4" {...editableProps("title")}>{block.content.title}</h1>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto" {...editableProps("subtitle")}>{block.content.subtitle}</p>
            {block.content.ctaText && (
              <a href={editable ? undefined : block.content.ctaLink} onClick={(e) => editable && e.preventDefault()} className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition">
                <span {...editableProps("ctaText")}>{block.content.ctaText}</span>
              </a>
            )}
            {block.content.imageUrl && (
              <img src={block.content.imageUrl} alt="" className="mt-10 mx-auto rounded-xl max-w-2xl w-full" />
            )}
          </div>
        </section>
      );

    case "about":
      return (
        <section style={css}>
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            {block.content.imageUrl && <img src={block.content.imageUrl} alt="" className="rounded-2xl w-full object-cover aspect-square" />}
            <div>
              <h2 className="text-4xl font-bold mb-4" {...editableProps("title")}>{block.content.title}</h2>
              <p className="opacity-80 leading-relaxed" {...editableProps("body")}>{block.content.body}</p>
            </div>
          </div>
        </section>
      );

    case "services":
      return (
        <section style={css}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(block.content.items || []).map((it: any, i: number) => (
                <div key={i} className="p-6 rounded-xl border border-current/10" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <h3 className="text-xl font-semibold mb-2">{it.title}</h3>
                  <p className="opacity-70 text-sm">{it.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "pricing":
      return (
        <section style={css}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(block.content.plans || []).map((p: any, i: number) => (
                <div key={i} className={`p-6 rounded-2xl border ${p.featured ? "border-red-500 shadow-xl scale-[1.02]" : "border-slate-200"}`}>
                  <p className="text-sm uppercase tracking-wide opacity-60">{p.name}</p>
                  <p className="text-4xl font-bold my-3">{p.price}</p>
                  <ul className="space-y-2 text-sm">
                    {(p.features || []).map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-2"><Check className="w-4 h-4 text-red-600" />{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonial":
      return (
        <section style={css}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(block.content.items || []).map((t: any, i: number) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <p className="italic opacity-90 mb-3">"{t.quote}"</p>
                  <p className="text-sm opacity-60">— {t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section style={css}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(block.content.images || []).map((src: string, i: number) => (
                <img key={i} src={src} alt="" className="rounded-lg aspect-square object-cover w-full" />
              ))}
            </div>
          </div>
        </section>
      );

    case "contact":
      return (
        <section style={css}>
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-3" {...editableProps("title")}>{block.content.title}</h2>
            <p className="opacity-80 mb-6" {...editableProps("body")}>{block.content.body}</p>
            {block.content.email && (
              <a href={editable ? undefined : `mailto:${block.content.email}`} onClick={(e) => editable && e.preventDefault()} className="inline-block bg-red-600 text-white font-semibold px-8 py-3 rounded-full">
                <span {...editableProps("ctaText")}>{block.content.ctaText}</span>
              </a>
            )}
          </div>
        </section>
      );

    case "footer":
      return (
        <footer style={css}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <p {...editableProps("text")}>{block.content.text}</p>
            <div className="flex gap-4 opacity-80">
              {(block.content.links || []).map((l: any, i: number) => (
                <a key={i} href={editable ? undefined : l.url} onClick={(e) => editable && e.preventDefault()}>{l.label}</a>
              ))}
            </div>
          </div>
        </footer>
      );

    case "section":
      return (
        <section style={css}>
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-3" {...editableProps("title")}>{block.content.title}</h2>
            <p className="opacity-80" {...editableProps("body")}>{block.content.body}</p>
          </div>
        </section>
      );

    case "heading": {
      const Tag = (block.content.level || "h2") as any;
      return <Tag style={css} {...editableProps("text")}>{block.content.text}</Tag>;
    }

    case "paragraph":
      return <p style={css} {...editableProps("text")}>{block.content.text}</p>;

    case "button":
      return (
        <div style={{ textAlign: css.textAlign as any, paddingTop: css.paddingTop, paddingBottom: css.paddingBottom }}>
          <a href={editable ? undefined : block.content.link} onClick={(e) => editable && e.preventDefault()}
            style={{ ...css, display: "inline-block" }}>
            <span {...editableProps("text")}>{block.content.text}</span>
          </a>
        </div>
      );

    case "image":
      return (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <img src={block.content.src} alt={block.content.alt || ""} style={css} className="inline-block" />
        </div>
      );

    case "video":
      return (
        <div style={{ ...css, position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
          <iframe src={block.content.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen />
        </div>
      );

    case "form":
      return (
        <form onSubmit={(e) => e.preventDefault()} style={css} className="max-w-md mx-auto space-y-3 px-6">
          <h3 className="text-xl font-semibold" {...editableProps("title")}>{block.content.title}</h3>
          {(block.content.fields || []).map((f: any, i: number) => (
            f.type === "textarea" ? (
              <textarea key={i} placeholder={f.label} rows={3} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm" />
            ) : (
              <input key={i} type={f.type} placeholder={f.label} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm" />
            )
          ))}
          <button type="submit" className="bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold">{block.content.submitText}</button>
        </form>
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
              <a key={i} href={editable ? undefined : l.url} onClick={(e) => editable && e.preventDefault()}
                className="w-10 h-10 rounded-full bg-slate-800 text-white inline-flex items-center justify-center hover:bg-red-600 transition">
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      );

    case "customCode":
      return <div style={css} dangerouslySetInnerHTML={{ __html: block.content.html || "" }} />;

    case "accordion": return <AccordionWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "tabs":      return <TabsWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "alert":     return <AlertWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "iconBox":   return <IconBoxWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "counter":   return <CounterWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "progress":  return <ProgressWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "stats":     return <StatsWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "faq":       return <FaqWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "cta":       return <CtaWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "team":      return <TeamWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "logos":     return <LogosWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "countdown": return <CountdownWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "carousel":  return <CarouselWidget block={block} css={css} editable={editable} onEditText={onEditText} />;

    default:
      return null;
  }
}

function ContainerBlock({
  block,
  css,
  device,
  editorMode,
}: {
  block: Block;
  css: CSSProperties;
  device: DeviceMode;
  editorMode?: boolean;
}) {
  const { selectedId, setSelected, updateBlockContent, addBlockInside } = useBuilderStore();
  const isEmpty = !block.children || block.children.length === 0;
  const isGrid = css.display === "grid";

  return (
    <div style={{ ...css, position: "relative" }}>
      {(block.children || []).map((child) => {
        const isSel = selectedId === child.id;
        if (!editorMode) {
          return (
            <div key={child.id} className={cn(!isGrid && "flex-1 min-w-0")}>
              <BlockRenderer block={child} device={device} />
            </div>
          );
        }
        return (
          <div
            key={child.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(child.id);
            }}
            className={cn(
              "relative cursor-pointer transition min-w-0",
              !isGrid && "flex-1",
              "hover:outline hover:outline-1 hover:outline-red-400/40 hover:outline-offset-2",
              isSel && "outline outline-2 outline-red-500 outline-offset-2 rounded-sm"
            )}
          >
            <BlockRenderer
              block={child}
              device={device}
              editable={isSel}
              editorMode
              onEditText={(field, value) =>
                updateBlockContent(child.id, { [field]: value })
              }
            />
          </div>
        );
      })}

      {editorMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addBlockInside(block.id, createBlock("paragraph"));
          }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full bg-red-600 text-white inline-flex items-center justify-center shadow-lg hover:scale-110 transition"
          title="Add child block"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}

      {editorMode && isEmpty && (
        <div className="w-full text-center text-xs text-slate-400 italic py-4 border-2 border-dashed border-slate-300 rounded">
          Empty container — click + to add
        </div>
      )}
    </div>
  );
}

