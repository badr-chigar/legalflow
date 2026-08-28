import type { ReactNode } from "react";

import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

export { Reveal };

/* --------------------------------------------------------------------------
 * Primitives de la vitrine — direction éditoriale-institutionnelle.
 * Épine dorsale : numéro de section en laiton + eyebrow mono, titre Fraunces
 * et intro dans une colonne gauche collante ; contenu pleine largeur à droite.
 * ------------------------------------------------------------------------ */

/** Conteneur commun : pleine largeur exploitée, respire sur très grand écran. */
export const SHELL =
  "mx-auto w-full max-w-[84rem] px-6 lg:px-12 2xl:max-w-[90rem]";

/** Fonds de section pleine largeur (alternance, séparés par un filet). */
export type SectionBg = "page" | "surface" | "warm";
export const SECTION_BG: Record<SectionBg, string> = {
  page: "bg-page",
  surface: "bg-surface",
  warm: "bg-nav-active",
};

/** Met un mot-clé du titre en `brand-slate`. */
export function AccentTitle({
  text,
  accent,
}: {
  text: string;
  accent?: string;
}) {
  if (accent && text.includes(accent)) {
    const i = text.indexOf(accent);
    return (
      <>
        {text.slice(0, i)}
        <span className="text-brand-slate">{accent}</span>
        {text.slice(i + accent.length)}
      </>
    );
  }
  return <>{text}</>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-muted">
      {children}
    </p>
  );
}

export function Section({
  id,
  n,
  eyebrow,
  title,
  accent,
  intro,
  children,
  bg = "page",
  tight = false,
}: {
  id?: string;
  /** Numéro éditorial, ex. "02". Affiché en laiton. */
  n?: string;
  eyebrow: string;
  title: string;
  /** Mot-clé du titre passé en brand-slate. */
  accent?: string;
  intro?: string;
  children?: ReactNode;
  bg?: SectionBg;
  /** Réduit le padding haut — pour la section qui suit le hero. */
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("border-t border-border-soft", SECTION_BG[bg])}
    >
      <div
        className={cn(
          SHELL,
          "grid gap-y-8 pb-16 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-14 lg:pb-20 xl:gap-20",
          tight ? "pt-8 lg:pt-10" : "pt-16 lg:pt-20",
        )}
      >
        <div className="lg:sticky lg:top-24 lg:h-max lg:self-start">
          <div className="flex items-baseline gap-3 lg:block">
            {n ? (
              <span className="font-mono text-sm text-brand-brass lg:mb-1 lg:block">
                {n}
              </span>
            ) : null}
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-3 max-w-[16ch] text-balance font-display text-[clamp(2rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink lg:mt-4">
            <AccentTitle text={title} accent={accent} />
          </h2>
          {intro ? (
            <p className="mt-4 max-w-[44ch] text-[15px] text-ink-muted">
              {intro}
            </p>
          ) : null}
        </div>

        <div className="min-w-0">
          <Reveal>{children}</Reveal>
        </div>
      </div>
    </section>
  );
}

/** Ouverture de page secondaire (hero-lite). */
export function PageIntro({
  eyebrow,
  title,
  accent,
  intro,
  actions,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-border-soft">
      <div className={cn(SHELL, "pb-12 pt-16 lg:pb-14 lg:pt-20")}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-[22ch] text-balance font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
          <AccentTitle text={title} accent={accent} />
        </h1>
        {intro ? (
          <p className="mt-6 max-w-[68ch] text-base text-ink-muted">{intro}</p>
        ) : null}
        {actions ? (
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}

/** Bande de statistiques — gros chiffres Fraunces sur filets. */
export function StatBand({
  items,
}: {
  items: readonly (readonly [string, string])[];
}) {
  const cols =
    items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
  return (
    <section className="border-t border-border-soft bg-nav-active">
      <div
        className={cn(
          SHELL,
          "grid divide-y divide-border-soft sm:divide-x sm:divide-y-0",
          cols,
        )}
      >
        {items.map(([value, label]) => (
          <div
            key={label}
            className="py-8 sm:px-8 sm:py-10 sm:first:pl-0 lg:first:pl-0"
          >
            <p className="font-display text-[44px] font-semibold leading-none tracking-[-0.015em] text-ink">
              {value}
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Check({
  className,
  tone = "success",
}: {
  className?: string;
  tone?: "success" | "brass";
}) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "shrink-0",
        tone === "brass" ? "text-brand-brass" : "text-success",
        className,
      )}
    >
      <path
        d="m3 8.5 3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dash() {
  return <span className="text-ink-muted">–</span>;
}

/** Filet à listes clé / valeur (piliers, avantages…). */
export function FiletList({
  items,
}: {
  items: readonly (readonly [string, string])[];
}) {
  return (
    <dl className="border-t border-border-soft">
      {items.map(([term, desc]) => (
        <div
          key={term}
          className="grid gap-1 border-b border-border-soft py-5 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10"
        >
          <dt className="font-display text-base text-ink">{term}</dt>
          <dd className="text-[15px] text-ink-muted">{desc}</dd>
        </div>
      ))}
    </dl>
  );
}
