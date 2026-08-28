import * as React from "react";

import { cn } from "@/lib/utils";

/** `<select>` natif stylé comme Input — bordure 1px, rayon 6px, caret dessiné. */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-9 w-full appearance-none rounded-control border border-border-soft bg-surface pl-3 pr-9 text-sm text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-slate",
        "aria-[invalid=true]:border-danger disabled:opacity-55",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));
Select.displayName = "Select";
