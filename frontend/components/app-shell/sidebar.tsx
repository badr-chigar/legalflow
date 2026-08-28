"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Barre latérale gauche fixe (design-system.md §5).
 * Item actif : fond #F1EEE8 + barre #1F3A5F à gauche.
 */
const NAV = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/companies", label: "Sociétés" },
  { href: "/documents", label: "Documents" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 border-r border-border-soft bg-surface px-3 py-5">
      <div className="px-3 pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          LegalFlow
        </p>
      </div>
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-control px-3 py-2 text-sm transition-colors",
              active
                ? "bg-nav-active font-medium text-ink"
                : "text-ink-muted hover:bg-nav-active/60 hover:text-ink",
            )}
          >
            {active ? (
              <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-brand-slate" />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
