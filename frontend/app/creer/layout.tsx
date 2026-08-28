import Link from "next/link";
import type { ReactNode } from "react";

export default function CreerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <header className="border-b border-border-soft bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="font-display text-lg text-ink">
            LegalFlow
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            Quitter
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
