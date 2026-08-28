"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Logo } from "@/components/brand/logo";
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
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color] duration-200 motion-reduce:transition-none",
        solid
          ? "border-b border-border-soft bg-surface/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[84rem] items-center justify-between gap-6 px-6 lg:px-12 2xl:max-w-[90rem]">
        <Link href="/" aria-label="LegalFlow — accueil" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-sm transition-colors hover:text-brand-slate hover:decoration-brand-brass hover:underline hover:decoration-1 hover:underline-offset-[6px]",
                isActive(item.href) ? "text-ink" : "text-ink-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="text-sm text-ink-muted transition-colors hover:text-brand-slate"
          >
            Se connecter
          </Link>
          <Link href="/creer" className={buttonVariants({ size: "sm" })}>
            Créer mon entreprise
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-control border border-border-soft bg-surface text-ink lg:hidden"
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
              href="/creer"
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
