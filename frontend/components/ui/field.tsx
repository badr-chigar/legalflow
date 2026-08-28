import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Rangée de formulaire : label au-dessus, aide dessous, erreur en #B23B3B
 * avec icône (design-system.md §5). Un champ par ligne.
 */
interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ id, label, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-xs font-medium text-danger"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M8 1.5 15 14H1L8 1.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M8 6v3.2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="8" cy="11.4" r="0.9" fill="currentColor" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** ids ARIA à passer au champ pour lier aide + erreur. */
export function fieldAria(id: string, opts: { hint?: boolean; error?: boolean }) {
  const described = [
    opts.hint ? `${id}-hint` : null,
    opts.error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    "aria-describedby": described || undefined,
    "aria-invalid": opts.error ? true : undefined,
  } as const;
}
