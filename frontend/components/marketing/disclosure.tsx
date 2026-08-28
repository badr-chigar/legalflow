import type { ReactNode } from "react";

/**
 * Divulgation (accordéon) — `<details>` natif, sans JavaScript.
 * Filet 1px, marqueur mono « + » qui pivote en « × » à l'ouverture.
 */
export function Disclosure({
  summary,
  defaultOpen = false,
  children,
}: {
  summary: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border-soft">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-sm font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span
          aria-hidden
          className="shrink-0 font-mono text-base leading-none text-ink-muted transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-sm text-ink-muted">{children}</div>
    </details>
  );
}
