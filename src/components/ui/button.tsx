import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.985]",
  {
    variants: {
      variant: {
        default:
          "gradient-primary text-white border border-white/35 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.65),inset_0_-1px_1px_0_rgba(0,0,0,0.18),0_8px_22px_-4px_hsl(187_90%_45%/0.35)] hover:border-white/50 hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,0.8),0_12px_28px_-4px_hsl(187_90%_45%/0.45)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl border border-white/20 shadow-sm",
        outline:
          "border border-input bg-background/80 hover:bg-accent hover:text-accent-foreground rounded-xl shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl border border-white/15 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-11 rounded-xl px-7 text-sm md:text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
