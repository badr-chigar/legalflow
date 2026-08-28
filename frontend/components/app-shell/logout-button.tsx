"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="rounded-control border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-nav-active disabled:opacity-55"
    >
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
