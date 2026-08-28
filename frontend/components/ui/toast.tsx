"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>");
  return ctx;
}

const ACCENT: Record<ToastVariant, string> = {
  success: "before:bg-success",
  error: "before:bg-danger",
  info: "before:bg-brand-slate",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const counter = React.useRef(0);

  const toast = React.useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++counter.current;
      setItems((list) => [...list, { id, message, variant }]);
      window.setTimeout(() => {
        setItems((list) => list.filter((t) => t.id !== id));
      }, 4500);
    },
    [],
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-card border border-border-soft bg-surface py-3 pl-4 pr-8 text-sm text-ink shadow-overlay",
              "before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-['']",
              ACCENT[t.variant],
            )}
          >
            {t.message}
            <button
              type="button"
              onClick={() => setItems((list) => list.filter((x) => x.id !== t.id))}
              aria-label="Fermer"
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-ink-muted hover:text-ink"
            >
              <span aria-hidden className="text-xs leading-none">
                ✕
              </span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
