import type { Metadata } from "next";

import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = {
  title: "Tableau de bord — LegalFlow",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-xl text-ink">Tableau de bord</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Session active pour <span className="font-mono">{user.email}</span>.
      </p>

      <div className="mt-8 rounded-card border border-border-soft bg-surface p-5">
        <p className="text-sm text-ink">
          L’authentification est en place : login, cookies httpOnly, garde de
          session et rafraîchissement du token fonctionnent de bout en bout.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Les compteurs (sociétés, documents en attente, documents signés) et le
          tableau des cinq derniers dossiers arrivent avec l’écran suivant.
        </p>
      </div>
    </div>
  );
}
