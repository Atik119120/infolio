import { CSSProperties, useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { ChevronDown, Info, AlertTriangle, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Block } from "../types";

type Common = { block: Block; css: CSSProperties; editable?: boolean; onEditText?: (f: string, v: string) => void };

const editProps = (editable: boolean | undefined, onEditText: any, field: string) =>
  editable
    ? {
        contentEditable: true as any,
        suppressContentEditableWarning: true,
        onBlur: (e: any) => onEditText?.(field, e.currentTarget.textContent || ""),
        className: "outline-none focus:ring-2 focus:ring-red-500/50 rounded px-1",
      }
    : {};

export function AccordionWidget({ block, css }: Common) {
  const [open, setOpen] = useState(0);
  return (
    <div style={css} className="max-w-3xl mx-auto px-6 space-y-2">
      {(block.content.items || []).map((it: any, i: number) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border border-current/10 rounded-xl overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold"
            >
              <span>{it.title}</span>
              <ChevronDown className={cn("w-4 h-4 transition", isOpen && "rotate-180")} />
            </button>
            {isOpen && <div className="px-5 pb-4 text-sm opacity-80">{it.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function TabsWidget({ block, css }: Common) {
  const [active, setActive] = useState(0);
  const items = block.content.items || [];
  return (
    <div style={css} className="max-w-3xl mx-auto px-6">
      <div className="flex gap-1 border-b border-current/10 mb-4" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
        {items.map((it: any, i: number) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition",
              active === i ? "border-red-600 text-red-600" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            {it.title}
          </button>
        ))}
      </div>
      <div className="text-sm opacity-90 leading-relaxed">{items[active]?.body}</div>
    </div>
  );
}

export function AlertWidget({ block, css }: Common) {
  const variant = block.content.variant || "info";
  const map: any = {
    info: { Icon: Info, bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
    success: { Icon: CheckCircle2, bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" },
    warning: { Icon: AlertTriangle, bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    error: { Icon: XCircle, bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  };
  const v = map[variant] || map.info;
  return (
    <div
      style={{ ...css, background: css.background || v.bg, color: css.color || v.color, border: `1px solid ${v.border}` }}
      className="max-w-3xl mx-auto px-5 flex items-start gap-3"
    >
      <v.Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">{block.content.title}</p>
        <p className="text-sm opacity-90 mt-0.5">{block.content.body}</p>
      </div>
    </div>
  );
}

export function IconBoxWidget({ block, css, editable, onEditText }: Common) {
  const Icon = (Icons as any)[block.content.icon] || Icons.Sparkles;
  return (
    <div style={css} className="max-w-md mx-auto px-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 text-red-600 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-2" {...editProps(editable, onEditText, "title")}>{block.content.title}</h3>
      <p className="opacity-80 text-sm" {...editProps(editable, onEditText, "body")}>{block.content.body}</p>
    </div>
  );
}

export function CounterWidget({ block, css }: Common) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const target = Number(block.content.value) || 0;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1500;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setN(Math.floor(t * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [inView, target]);
  return (
    <div ref={ref} style={css} className="px-6">
      <p className="text-5xl md:text-6xl font-bold tracking-tight">
        {n.toLocaleString()}{block.content.suffix}
      </p>
      <p className="opacity-70 mt-2 text-sm uppercase tracking-widest">{block.content.label}</p>
    </div>
  );
}

export function ProgressWidget({ block, css }: Common) {
  const val = Math.max(0, Math.min(100, Number(block.content.value) || 0));
  return (
    <div style={css} className="max-w-2xl mx-auto px-6">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium">{block.content.label}</span>
        <span className="opacity-60">{val}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-current/10 overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${val}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-red-600"
        />
      </div>
    </div>
  );
}

export function StatsWidget({ block, css }: Common) {
  return (
    <section style={css}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {(block.content.items || []).map((it: any, i: number) => (
          <div key={i}>
            <p className="text-4xl md:text-5xl font-bold">{it.value}</p>
            <p className="opacity-70 text-sm mt-1 uppercase tracking-widest">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FaqWidget({ block, css, editable, onEditText }: Common) {
  const [open, setOpen] = useState(0);
  return (
    <section style={css}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center" {...editProps(editable, onEditText, "title")}>{block.content.title}</h2>
        <div className="space-y-2">
          {(block.content.items || []).map((it: any, i: number) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold">
                  <span>{it.question}</span>
                  <ChevronDown className={cn("w-4 h-4 transition", isOpen && "rotate-180")} />
                </button>
                {isOpen && <div className="px-5 pb-4 text-sm opacity-80">{it.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaWidget({ block, css, editable, onEditText }: Common) {
  return (
    <section style={css}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-3" {...editProps(editable, onEditText, "title")}>{block.content.title}</h2>
        <p className="opacity-90 text-lg mb-8" {...editProps(editable, onEditText, "body")}>{block.content.body}</p>
        {block.content.ctaText && (
          <a href={editable ? undefined : block.content.ctaLink} onClick={(e) => editable && e.preventDefault()}
            className="inline-block bg-white text-slate-900 font-semibold px-8 py-3 rounded-full hover:scale-105 transition">
            <span {...editProps(editable, onEditText, "ctaText")}>{block.content.ctaText}</span>
          </a>
        )}
      </div>
    </section>
  );
}

export function TeamWidget({ block, css, editable, onEditText }: Common) {
  return (
    <section style={css}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-10" {...editProps(editable, onEditText, "title")}>{block.content.title}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {(block.content.members || []).map((m: any, i: number) => (
            <div key={i}>
              <img src={m.image} alt={m.name} className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
              <p className="font-semibold text-lg">{m.name}</p>
              <p className="opacity-60 text-sm">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LogosWidget({ block, css, editable, onEditText }: Common) {
  return (
    <section style={css}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-6" {...editProps(editable, onEditText, "title")}>{block.content.title}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-70">
          {(block.content.logos || []).map((l: string, i: number) => (
            <span key={i} className="text-2xl font-bold tracking-tight">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CountdownWidget({ block, css, editable, onEditText }: Common) {
  const target = new Date(block.content.target || Date.now()).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const sec = Math.floor((diff / 1000) % 60);
  const Box = ({ n, l }: { n: number; l: string }) => (
    <div className="bg-current/5 rounded-xl px-4 py-3 min-w-[72px]" style={{ background: "rgba(0,0,0,0.05)" }}>
      <p className="text-3xl font-bold tabular-nums">{String(n).padStart(2, "0")}</p>
      <p className="text-[10px] uppercase tracking-widest opacity-60">{l}</p>
    </div>
  );
  return (
    <div style={css} className="px-6">
      <p className="text-sm uppercase tracking-widest opacity-70 mb-4" {...editProps(editable, onEditText, "label")}>{block.content.label}</p>
      <div className="inline-flex gap-3">
        <Box n={d} l="Days" /><Box n={h} l="Hrs" /><Box n={m} l="Min" /><Box n={sec} l="Sec" />
      </div>
    </div>
  );
}

export function CarouselWidget({ block, css }: Common) {
  const [i, setI] = useState(0);
  const imgs: string[] = block.content.images || [];
  if (!imgs.length) return null;
  const go = (dir: number) => setI((p) => (p + dir + imgs.length) % imgs.length);
  return (
    <div style={css} className="max-w-4xl mx-auto px-6 relative">
      <div className="relative overflow-hidden rounded-2xl aspect-[16/9]">
        <motion.img
          key={i}
          src={imgs[i]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white inline-flex items-center justify-center backdrop-blur">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white inline-flex items-center justify-center backdrop-blur">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {imgs.map((_, j) => (
            <button key={j} onClick={() => setI(j)} className={cn("w-2 h-2 rounded-full transition", j === i ? "bg-white w-6" : "bg-white/50")} />
          ))}
        </div>
      </div>
    </div>
  );
}
