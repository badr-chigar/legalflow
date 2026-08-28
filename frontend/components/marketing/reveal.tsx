"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Apparition au scroll : fondu + léger translateY, une seule fois.
 * L'état visuel est piloté par une classe CSS (pas de setState), et
 * `prefers-reduced-motion` est géré dans globals.css.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("reveal-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
