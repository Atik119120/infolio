import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import type { BlockStyle } from "../types";
import { cn } from "@/lib/utils";

const variants: Record<string, Variants> = {
  "fade-up":    { hidden: { opacity: 0, y: 32 },  visible: { opacity: 1, y: 0 } },
  "fade-down":  { hidden: { opacity: 0, y: -32 }, visible: { opacity: 1, y: 0 } },
  "fade-left":  { hidden: { opacity: 0, x: 32 },  visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  "zoom-in":    { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  "zoom-out":   { hidden: { opacity: 0, scale: 1.15 }, visible: { opacity: 1, scale: 1 } },
  "flip":       { hidden: { opacity: 0, rotateX: 90 }, visible: { opacity: 1, rotateX: 0 } },
  "blur":       { hidden: { opacity: 0, filter: "blur(12px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
};

const hoverClass: Record<string, string> = {
  lift:   "transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl",
  grow:   "transition-transform duration-300 hover:scale-[1.03]",
  shrink: "transition-transform duration-300 hover:scale-[0.97]",
  tilt:   "transition-transform duration-300 hover:rotate-1 hover:scale-[1.02]",
  glow:   "transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.45)]",
};

export function AnimationWrapper({
  style,
  children,
  enabled = true,
}: {
  style: BlockStyle;
  children: ReactNode;
  enabled?: boolean;
}) {
  const anim = style.animation && style.animation !== "none" ? style.animation : null;
  const hover = style.hoverEffect && style.hoverEffect !== "none" ? style.hoverEffect : null;
  const opacity = style.opacity;

  if (!enabled || (!anim && !hover && opacity == null)) {
    return <>{children}</>;
  }

  const className = cn(hover && hoverClass[hover]);
  const baseStyle = opacity != null ? { opacity } : undefined;

  if (!anim) {
    return <div className={className} style={baseStyle}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={baseStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants[anim]}
      transition={{
        duration: style.animationDuration ?? 0.6,
        delay: style.animationDelay ?? 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
