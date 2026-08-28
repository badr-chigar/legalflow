import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Champ texte — bordure 1px nette, rayon 6px, pas d'ombre (§4).
 * L'état erreur passe `aria-invalid` → bordure #B23B3B.
 */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-9 w-full rounded-control border border-border-soft bg-surface px-3 text-sm text-ink",
      "placeholder:text-ink-muted/70",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-slate",
      "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:outline-danger",
      "disabled:opacity-55",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
