"use client";

import Link from "next/link";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/creation-entreprise", label: "Création d’entreprise" },
  { href: "/domiciliation", label: "Domiciliation" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/guides", label: "Guides" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="font-display text-lg text-ink"
          onClick={() => setOpen(false)}
        >
          LegalFlow
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            Se connecter
          </Link>
          <Link href="/login" className={buttonVariants({ size: "sm" })}>
            Créer mon entreprise
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-control border border-border-soft text-ink lg:hidden"
        >
          <span aria-hidden className="text-base leading-none">
            {open ? "✕" : "≡"}
          </span>
        </button>
      </div>

      {open ? (
        <div
          id="site-menu"
          className="border-t border-border-soft bg-surface px-6 py-4 lg:hidden"
        >
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border-soft py-2.5 text-sm text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              Se connecter
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), "w-full")}
            >
              Créer mon entreprise
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
