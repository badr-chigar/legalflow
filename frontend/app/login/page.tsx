import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion — LegalFlow",
};

const TRACKED = [
  ["Sociétés", "De la rédaction des statuts à l’immatriculation."],
  ["Documents", "Statuts, M0, DNC, registre des bénéficiaires."],
  ["Signatures", "Validation par code à usage unique, horodatée."],
] as const;

/** N'accepte qu'un chemin interne (anti open-redirect). */
function safeNext(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/dashboard";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = safeNext((await searchParams).next);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  return (
    <main className="grid min-h-dvh lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
      {/* Volet institutionnel — identité, pas décor. */}
      <aside className="flex flex-col border-b border-border-soft bg-page px-6 py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
          Espace professionnel
        </p>
        <p className="mt-2 font-display text-xl text-ink">LegalFlow</p>
        <p className="mt-3 max-w-sm text-sm text-ink-muted">
          L’accompagnement à la création d’entreprise : dossiers de société,
          pièces légales et signature électronique, au même endroit.
        </p>

        <div className="mt-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            Dans votre espace
          </p>
          <dl className="mt-3 border-t border-border-soft">
            {TRACKED.map(([term, desc]) => (
              <div
                key={term}
                className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border-soft py-2.5"
              >
                <dt className="text-xs font-medium text-ink">{term}</dt>
                <dd className="text-xs text-ink-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-auto pt-10 font-mono text-xs text-ink-muted">
          API · {apiUrl}
        </p>
      </aside>

      {/* Volet formulaire — surface blanche, aucune ombre. */}
      <div className="flex items-center justify-center bg-surface px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-xl text-ink">Connexion</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Accédez à votre espace avec vos identifiants LegalFlow.
          </p>

          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </main>
  );
}
