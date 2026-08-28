import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/app-shell/logout-button";
import { Sidebar } from "@/components/app-shell/sidebar";
import { getCurrentUser } from "@/lib/api";
import { ROLE_LABEL } from "@/lib/format";

const MOBILE_NAV = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/companies", label: "Sociétés" },
  { href: "/documents", label: "Documents" },
];

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/login");

  const name =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden md:block">
        <div className="sticky top-0 h-dvh">
          <Sidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border-soft bg-surface px-6 py-3 lg:px-10">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            <p className="font-mono text-xs text-ink-muted">
              {user.email} · {ROLE_LABEL[user.role]}
            </p>
          </div>
          <LogoutButton />
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border-soft bg-surface px-4 py-2 md:hidden">
          {MOBILE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-control px-3 py-1.5 text-sm text-ink-muted hover:bg-nav-active hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
