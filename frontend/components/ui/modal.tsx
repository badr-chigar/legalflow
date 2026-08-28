"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Modale basée sur `<dialog>` natif : backdrop, ESC, piège de focus gérés
 * par le navigateur. Seule ombre portée autorisée avec les toasts (§4).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100vw-2rem)] max-w-md rounded-card border border-border-soft bg-surface p-0 text-ink shadow-overlay backdrop:bg-ink/30",
        className,
      )}
    >
      {open ? (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg text-ink">{title}</h2>
              {description ? (
                <p className="mt-1 text-sm text-ink-muted">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-nav-active hover:text-ink"
            >
              <span aria-hidden className="text-base leading-none">
                ✕
              </span>
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
