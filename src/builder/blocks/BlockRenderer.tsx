import { CSSProperties } from "react";
import * as Icons from "lucide-react";
import { Twitter, Github, Linkedin, Instagram, Facebook, Youtube, Check, Plus, Star } from "lucide-react";
import type { Block, BlockStyle, DeviceMode } from "../types";
import { useBuilderStore } from "../store";
import { createBlock } from "./defaults";
import { cn } from "@/lib/utils";
import {
  AccordionWidget, TabsWidget, AlertWidget, IconBoxWidget, CounterWidget,
  ProgressWidget, StatsWidget, FaqWidget, CtaWidget, TeamWidget, LogosWidget,
  CountdownWidget, CarouselWidget,
} from "./AdvancedWidgets";
import { ProductGridWidget, ProductCardWidget, CategoryGridWidget } from "./EcommerceWidgets";
import { CartFloatingWidget, CheckoutWidget } from "./CartWidgets";
import { AnimationWrapper } from "./AnimationWrapper";

const mergeStyle = (s: BlockStyle, device: DeviceMode): BlockStyle => {
  if (device === "desktop") return s;
  const override = s.responsive?.[device] || {};
  return { ...s, ...override };
};

const buildTransform = (s: BlockStyle): string | undefined => {
  const parts: string[] = [];
  if (s.translateX || s.translateY)
    parts.push(`translate(${s.translateX || "0"}, ${s.translateY || "0"})`);
  if (s.rotate) parts.push(`rotate(${s.rotate}deg)`);
  if (s.scale && s.scale !== 1) parts.push(`scale(${s.scale})`);
  if (s.skewX) parts.push(`skewX(${s.skewX}deg)`);
  if (s.skewY) parts.push(`skewY(${s.skewY}deg)`);
  return parts.length ? parts.join(" ") : undefined;
};

const buildFilter = (s: BlockStyle): string | undefined => {
  const parts: string[] = [];
  if (s.filterBlur) parts.push(`blur(${s.filterBlur}px)`);
  if (s.filterBrightness != null && s.filterBrightness !== 1)
    parts.push(`brightness(${s.filterBrightness})`);
  if (s.filterGrayscale) parts.push(`grayscale(${s.filterGrayscale})`);
  return parts.length ? parts.join(" ") : undefined;
};

const buildBackground = (s: BlockStyle): string | undefined => {
  if (s.gradientFrom && s.gradientTo) {
    return `linear-gradient(${s.gradientAngle ?? 135}deg, ${s.gradientFrom}, ${s.gradientTo})`;
  }
  if (s.backgroundImage) {
    return `url("${s.backgroundImage}")${s.background ? `, ${s.background}` : ""}`;
  }
  return s.background;
};

const buildShadow = (s: BlockStyle): string | undefined => {
  if (s.shadowColor || s.shadowBlur || s.shadowX || s.shadowY || s.shadowSpread) {
    return `${s.shadowX || 0}px ${s.shadowY || 0}px ${s.shadowBlur || 0}px ${s.shadowSpread || 0}px ${s.shadowColor || "rgba(0,0,0,0.2)"}`;
  }
  return s.boxShadow;
};

const styleToCss = (raw: BlockStyle, device: DeviceMode): CSSProperties => {
  if (
    (device === "mobile" && raw.hideMobile) ||
    (device === "tablet" && raw.hideTablet) ||
    (device === "desktop" && raw.hideDesktop)
  ) {
    return { display: "none" };
  }
  const s = mergeStyle(raw, device);
  const css: CSSProperties = {
    fontSize: s.fontSize,
    fontWeight: s.fontWeight as any,
    fontFamily: s.fontFamily,
    fontStyle: s.fontStyle,
    textTransform: s.textTransform,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    color: s.color,
    textAlign: s.textAlign,
    textShadow: s.textShadow,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
    paddingLeft: s.paddingLeft,
    paddingRight: s.paddingRight,
    marginTop: s.marginTop,
    marginBottom: s.marginBottom,
    marginLeft: s.marginLeft,
    marginRight: s.marginRight,
    background: buildBackground(s),
    backgroundSize: s.backgroundSize,
    backgroundPosition: s.backgroundPosition,
    backgroundRepeat: s.backgroundRepeat,
    backdropFilter: s.backdropBlur ? `blur(${s.backdropBlur}px)` : undefined,
    borderRadius: s.borderRadius,
    borderTopLeftRadius: s.borderTopLeftRadius,
    borderTopRightRadius: s.borderTopRightRadius,
    borderBottomLeftRadius: s.borderBottomLeftRadius,
    borderBottomRightRadius: s.borderBottomRightRadius,
    borderWidth: s.borderWidth,
    borderTopWidth: s.borderTopWidth,
    borderBottomWidth: s.borderBottomWidth,
    borderLeftWidth: s.borderLeftWidth,
    borderRightWidth: s.borderRightWidth,
    borderColor: s.borderColor,
    borderStyle: s.borderStyle || (s.borderWidth || s.borderTopWidth ? "solid" : undefined),
    boxShadow: buildShadow(s),
    width: s.width,
    height: s.height,
    maxWidth: s.maxWidth,
    minHeight: s.minHeight,
    position: s.position,
    top: s.top,
    right: s.right,
    bottom: s.bottom,
    left: s.left,
    zIndex: s.zIndex,
    transform: buildTransform(s),
    filter: buildFilter(s),
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
  const inner = <BlockRendererInner {...props} />;
  const styleProp = editorMode ? { ...block.style, animation: "none" as const } : block.style;

  const bbId = `bb-${block.id.replace(/-/g, "").slice(0, 8)}`;
  const extraClass = [bbId, block.style.cssClasses || ""].filter(Boolean).join(" ");
  const customCss = block.style.customCss || "";
  const hoverCss = block.style.hoverCss || "";

  const cssBlock =
    (customCss || hoverCss)
      ? `.${bbId}{${customCss.replace(/selector/g, `.${bbId}`)}} .${bbId}:hover{${hoverCss.replace(/selector/g, `.${bbId}`)}}`
      : "";

  return (
    <div id={block.style.htmlId || undefined} className={extraClass}>
      {cssBlock && <style dangerouslySetInnerHTML={{ __html: cssBlock }} />}
      <AnimationWrapper style={styleProp}>{inner}</AnimationWrapper>
    </div>
  );
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
      return <NavbarBlock block={block} css={css} editable={editable} onEditText={onEditText} />;

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
              {block.content.title && <h2 className="text-4xl font-bold mb-4" {...editableProps("title")}>{block.content.title}</h2>}
              <p className="opacity-80 leading-relaxed" {...editableProps("body")}>{block.content.body}</p>
            </div>
          </div>
        </section>
      );

    case "services":
      return (
        <section style={css}>
          <div className="max-w-6xl mx-auto px-6">
            {block.content.title && (
              <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.content.items || []).map((it: any, i: number) => {
                const Icon = it.icon ? (Icons as any)[it.icon] : null;
                return (
                  <div key={i} className="relative p-6 rounded-xl border border-current/10 hover:-translate-y-1 transition" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    {it.badge && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wide bg-pink-500/10 text-pink-600 px-2 py-0.5 rounded-full">{it.badge}</span>
                    )}
                    {it.image && <img src={it.image} alt="" className="w-full h-40 rounded-lg object-cover mb-4" />}
                    {Icon && !it.image && (
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    {it.title && <h3 className="text-xl font-semibold mb-2">{it.title}</h3>}
                    {it.body && <p className="opacity-70 text-sm">{it.body}</p>}
                    {it.buttonText && (
                      <a href={editable ? undefined : it.buttonLink} onClick={(e) => editable && e.preventDefault()} className="inline-block mt-4 text-sm font-medium text-pink-600 hover:underline">
                        {it.buttonText} →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case "pricing":
      return (
        <section style={css}>
          <div className="max-w-6xl mx-auto px-6">
            {block.content.title && (
              <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {(block.content.plans || []).map((p: any, i: number) => (
                <div key={i} className={`p-6 rounded-2xl border ${p.featured ? "border-pink-500 shadow-xl scale-[1.02]" : "border-slate-200"}`}>
                  <p className="text-sm uppercase tracking-wide opacity-60">{p.name}</p>
                  <p className="text-4xl font-bold my-3">
                    {p.price}
                    {p.period && <span className="text-base font-normal opacity-60">{p.period}</span>}
                  </p>
                  <ul className="space-y-2 text-sm mb-5">
                    {(p.features || []).map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-2"><Check className="w-4 h-4 text-pink-600" />{f}</li>
                    ))}
                  </ul>
                  {p.buttonText && (
                    <a href={editable ? undefined : p.buttonLink} onClick={(e) => editable && e.preventDefault()}
                      className={`block text-center py-2 rounded-lg text-sm font-semibold ${p.featured ? "bg-pink-600 text-white" : "border border-slate-300"}`}>
                      {p.buttonText}
                    </a>
                  )}
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
            {block.content.title && (
              <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {(block.content.items || []).map((t: any, i: number) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  {t.rating > 0 && (
                    <div className="flex gap-0.5 mb-3 text-yellow-400">
                      {Array.from({ length: Math.min(5, Number(t.rating) || 0) }).map((_, k) => (
                        <Star key={k} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <p className="italic opacity-90 mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    {t.image && <img src={t.image} alt="" className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      {t.author && <p className="text-sm font-semibold">{t.author}</p>}
                      {t.role && <p className="text-xs opacity-60">{t.role}</p>}
                    </div>
                  </div>
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
            {block.content.title && (
              <h2 className="text-4xl font-bold mb-10" {...editableProps("title")}>{block.content.title}</h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(block.content.images || []).map((src: string, i: number) => (
                src ? <img key={i} src={src} alt="" className="rounded-lg aspect-square object-cover w-full hover:scale-[1.02] transition" /> : null
              ))}
            </div>
          </div>
        </section>
      );

    case "contact":
      return (
        <section style={css}>
          <div className="max-w-2xl mx-auto px-6">
            {block.content.title && <h2 className="text-4xl font-bold mb-3" {...editableProps("title")}>{block.content.title}</h2>}
            {block.content.body && <p className="opacity-80 mb-6" {...editableProps("body")}>{block.content.body}</p>}
            {block.content.email && block.content.ctaText && (
              <a href={editable ? undefined : `mailto:${block.content.email}`} onClick={(e) => editable && e.preventDefault()} className="inline-block bg-pink-600 text-white font-semibold px-8 py-3 rounded-full">
                <span {...editableProps("ctaText")}>{block.content.ctaText}</span>
              </a>
            )}
          </div>
        </section>
      );

    case "footer":
      return <FooterBlock block={block} css={css} editable={editable} onEditText={onEditText} />;

    case "section":
      return (
        <section style={css}>
          <div className="max-w-4xl mx-auto px-6">
            {block.content.title && <h2 className="text-3xl font-bold mb-3" {...editableProps("title")}>{block.content.title}</h2>}
            {block.content.body && <p className="opacity-80" {...editableProps("body")}>{block.content.body}</p>}
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

    case "productGrid":  return <ProductGridWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "productCard":  return <ProductCardWidget block={block} css={css} editable={editable} onEditText={onEditText} />;
    case "categoryGrid": return <CategoryGridWidget block={block} css={css} editable={editable} onEditText={onEditText} />;

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

/* ============== NAVBAR ============== */
function NavbarBlock({
  block, css, editable, onEditText,
}: {
  block: Block; css: CSSProperties; editable?: boolean; onEditText?: (f: string, v: string) => void;
}) {
  const c = block.content || {};
  const editableProps = (field: string) =>
    editable
      ? {
          contentEditable: true as any,
          suppressContentEditableWarning: true,
          onBlur: (e: any) => onEditText?.(field, e.currentTarget.textContent || ""),
          className: "outline-none focus:ring-2 focus:ring-red-500/50 rounded px-1",
        }
      : {};
  const layout: string = c.layout || "split";
  const isSticky = !!c.sticky;
  const isTransparent = !!c.transparent;

  const wrapStyle: CSSProperties = {
    ...css,
    ...(isSticky ? { position: "sticky", top: 0, zIndex: 50 } : {}),
    ...(isTransparent ? { background: "transparent" } : {}),
    backdropFilter: isTransparent ? "blur(8px)" : (css as any).backdropFilter,
  };

  const Brand = (
    <a href={editable ? undefined : "#"} onClick={(e) => editable && e.preventDefault()} className="flex items-center gap-2 shrink-0">
      {c.logoUrl ? (
        <img src={c.logoUrl} alt="" className="h-8 w-auto object-contain" />
      ) : null}
      {c.brand && (
        <span className="font-bold text-lg" {...editableProps("brand")}>{c.brand}</span>
      )}
    </a>
  );

  const Links = (
    <div className="hidden md:flex items-center gap-6 text-sm">
      {(c.links || []).map((l: any, i: number) => (
        <a key={i} href={editable ? undefined : l.url}
          onClick={(e) => editable && e.preventDefault()}
          className="opacity-80 hover:opacity-100 transition">
          {l.label}
        </a>
      ))}
    </div>
  );

  const Cta = c.showCta !== false && c.ctaText ? (
    <a href={editable ? undefined : c.ctaLink}
      onClick={(e) => editable && e.preventDefault()}
      className="hidden md:inline-block text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-full shrink-0">
      <span {...editableProps("ctaText")}>{c.ctaText}</span>
    </a>
  ) : null;

  return (
    <nav style={wrapStyle}>
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
        {layout === "center" ? (
          <>
            <div className="flex-1">{Brand}</div>
            <div className="flex-1 flex justify-center">{Links}</div>
            <div className="flex-1 flex justify-end">{Cta}</div>
          </>
        ) : layout === "left" ? (
          <>
            {Brand}
            {Links}
            <div className="ml-auto">{Cta}</div>
          </>
        ) : (
          <>
            {Brand}
            <div className="ml-auto flex items-center gap-6">{Links}{Cta}</div>
          </>
        )}
        {/* Mobile menu icon (visual only) */}
        <button className="md:hidden ml-auto p-2 rounded hover:bg-black/5" aria-label="Menu">
          <Icons.Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

/* ============== FOOTER ============== */
function FooterBlock({
  block, css, editable, onEditText,
}: {
  block: Block; css: CSSProperties; editable?: boolean; onEditText?: (f: string, v: string) => void;
}) {
  const c = block.content || {};
  const editableProps = (field: string) =>
    editable
      ? {
          contentEditable: true as any,
          suppressContentEditableWarning: true,
          onBlur: (e: any) => onEditText?.(field, e.currentTarget.textContent || ""),
          className: "outline-none focus:ring-2 focus:ring-red-500/50 rounded px-1",
        }
      : {};

  const cols: any[] = Array.isArray(c.columns) ? c.columns : [];
  const social: any[] = Array.isArray(c.socialLinks) ? c.socialLinks : [];
  const hasModern = cols.length > 0 || c.logoUrl || c.tagline;

  // Legacy single-line footer
  if (!hasModern) {
    return (
      <footer style={css}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p {...editableProps("text")}>{c.text || c.copyright}</p>
          <div className="flex gap-4 opacity-80">
            {(c.links || []).map((l: any, i: number) => (
              <a key={i} href={editable ? undefined : l.url} onClick={(e) => editable && e.preventDefault()}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={css}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4 space-y-3">
            <a href={editable ? undefined : "#"} onClick={(e) => editable && e.preventDefault()} className="flex items-center gap-2">
              {c.logoUrl && <img src={c.logoUrl} alt="" className="h-8 w-auto object-contain" />}
              {c.brand && <span className="font-bold text-lg" {...editableProps("brand")}>{c.brand}</span>}
            </a>
            {c.tagline && <p className="text-sm opacity-70 max-w-xs" {...editableProps("tagline")}>{c.tagline}</p>}
            {social.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {social.map((s: any, i: number) => {
                  const Icon = socialIcon[s.platform] || Twitter;
                  return (
                    <a key={i} href={editable ? undefined : s.url} onClick={(e) => editable && e.preventDefault()}
                      className="w-8 h-8 rounded-full bg-white/10 inline-flex items-center justify-center hover:bg-white/20 transition">
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {cols.map((col: any, i: number) => {
              const lines: string[] = String(col.linksText || "").split("\n").filter(Boolean);
              return (
                <div key={i}>
                  {col.title && <p className="text-xs uppercase tracking-widest opacity-60 mb-3">{col.title}</p>}
                  <ul className="space-y-2 text-sm">
                    {lines.map((ln, j) => {
                      const [label, url] = ln.split("|").map((x) => x.trim());
                      return (
                        <li key={j}>
                          <a href={editable ? undefined : (url || "#")} onClick={(e) => editable && e.preventDefault()}
                            className="opacity-80 hover:opacity-100">{label}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        {(c.copyright || c.text) && (
          <div className="mt-10 pt-6 border-t border-white/10 text-xs opacity-60 text-center" {...editableProps("copyright")}>
            {c.copyright || c.text}
          </div>
        )}
      </div>
    </footer>
  );
}


