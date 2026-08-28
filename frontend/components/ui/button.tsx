import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Boutons — design-system.md §5 : plein (primary), contour (secondaire),
 * lien (tertiaire). Pas de « ghost » dégradé, pas d'ombre, rayon 6px.
 */
type Variant = "primary" | "secondary" | "link";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control " +
  "font-medium transition-colors disabled:pointer-events-none disabled:opacity-55 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-slate";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-slate text-surface hover:bg-brand-slate-hover border border-brand-slate",
  secondary:
    "bg-surface text-ink border border-border-soft hover:bg-nav-active",
  link: "text-brand-slate underline underline-offset-4 hover:text-brand-slate-hover px-0",
};

const sizes: Record<Size, string> = {
  md: "h-9 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], variant !== "link" && sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
