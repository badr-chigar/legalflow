import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion — LegalFlow",
};

const TRACKED = [
  [
    "Sociétés",
    "De la rédaction des statuts à l’immatriculation.",
  ],
  [
    "Documents",
    "Statuts, procès-verbaux, registre des bénéficiaires effectifs.",
  ],
  [
    "Signatures",
    "Validation par code à usage unique, horodatée.",
  ],
] as const;

const DOSSIER_STEPS = ["Brouillon", "En revue", "Déposé", "Immatriculée"];
const DOSSIER_CURRENT = 1;

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

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* Panneau de marque — le seul aplat sombre plein assumé. */}
      <aside className="flex flex-col gap-10 bg-brand-slate p-8 text-page lg:justify-between lg:gap-0 lg:p-14">
        <div className="flex items-center justify-between gap-4">
          <Logo variant="full" tone="invert" />
          <Link
            href="/"
            className="text-xs text-page/70 transition-colors hover:text-page"
          >
            ← Retour au site
          </Link>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-brass">
            Espace professionnel
          </p>
          <h2 className="mt-3 max-w-[18ch] font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] sm:text-[32px]">
            Votre dossier, du premier acte à l’immatriculation.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] text-page/70">
            Suivez chaque société pas à pas : rédaction des actes, enregistrement
            à la DGI, dépôt au guichet unique et signature électronique.
          </p>
          <p className="mt-2 hidden max-w-[46ch] text-[15px] text-page/70 lg:block">
            Un seul espace pour vos formalités et celles de vos clients.
          </p>

          {/* Aperçu de dossier — masqué sur mobile. */}
          <div className="mt-8 hidden rounded-card border border-page/15 bg-page/5 p-5 lg:block">
            <div className="flex items-baseline justify-between border-b border-page/15 pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-page/60">
                Dossier
              </span>
              <span className="font-mono text-xs text-page">
                Atlas Conseil · SARLAU
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                {DOSSIER_STEPS.map((_, i) => (
                  <div key={i} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={
                        i === DOSSIER_CURRENT
                          ? "h-2.5 w-2.5 shrink-0 rounded-full bg-brand-brass"
                          : i < DOSSIER_CURRENT
                            ? "h-2.5 w-2.5 shrink-0 rounded-full bg-page"
                            : "h-2.5 w-2.5 shrink-0 rounded-full border border-page/30"
                      }
                    />
                    {i < DOSSIER_STEPS.length - 1 ? (
                      <span
                        className={
                          i < DOSSIER_CURRENT
                            ? "h-[3px] flex-1 rounded-full bg-brand-brass"
                            : "h-px flex-1 bg-page/20"
                        }
                      />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between gap-1">
                {DOSSIER_STEPS.map((label, i) => (
                  <span
                    key={label}
                    className={
                      "flex-1 text-center text-[10px] leading-[1.25] first:text-left last:text-right " +
                      (i === DOSSIER_CURRENT
                        ? "font-medium text-brand-brass"
                        : i < DOSSIER_CURRENT
                          ? "text-page"
                          : "text-page/50")
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <dl className="hidden border-t border-page/15 lg:block">
          {TRACKED.map(([term, desc]) => (
            <div
              key={term}
              className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-page/15 py-3"
            >
              <dt className="text-xs font-medium text-page">{term}</dt>
              <dd className="text-xs text-page/70">{desc}</dd>
            </div>
          ))}
        </dl>
      </aside>

      {/* Panneau formulaire. */}
      <div className="flex items-center justify-center bg-page p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-[26px] font-semibold tracking-[-0.015em] text-ink sm:text-[28px]">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Accédez à votre espace avec vos identifiants LegalFlow.
          </p>

          <div className="mt-8">
            <LoginForm
              next={next}
              showDemo={process.env.NODE_ENV === "development"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
