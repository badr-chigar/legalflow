import type { ReactNode } from "react";

import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

export { Reveal };

/* --------------------------------------------------------------------------
 * Primitives de la vitrine — direction éditoriale-institutionnelle.
 * Épine dorsale : numéro de section en laiton + eyebrow mono collant,
 * titres Fraunces généreux, colonnes de lecture ~68ch, filets 1px.
 * ------------------------------------------------------------------------ */

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
  intro,
  children,
  contentClassName,
}: {
  id?: string;
  /** Numéro éditorial, ex. "02". Affiché en laiton. */
  n?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  contentClassName?: string;
}) {
  return (
    <section id={id} className="border-t border-border-soft">
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-6 px-6 py-16 sm:py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-3">
          <div className="flex items-baseline gap-3 lg:sticky lg:top-20 lg:flex-col lg:items-start lg:gap-2">
            {n ? (
              <span className="font-mono text-sm text-brand-brass">{n}</span>
            ) : null}
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        </div>

        <div className={cn("lg:col-span-8 lg:col-start-4", contentClassName)}>
          <Reveal>
            <h2 className="max-w-[16ch] text-balance font-display text-[34px] leading-[1.1] text-ink sm:text-[42px]">
              {title}
            </h2>
            {intro ? (
              <p className="mt-5 max-w-[68ch] text-base text-ink-muted">{intro}</p>
            ) : null}
            {children ? <div className="mt-10">{children}</div> : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Ouverture de page secondaire (hero-lite). */
export function PageIntro({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-border-soft">
      <div className="mx-auto max-w-6xl px-6 pb-14 pt-16 sm:pt-20 lg:pb-16 lg:pt-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-[20ch] text-balance font-display text-[38px] leading-[1.05] text-ink sm:text-[52px]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-[64ch] text-base text-ink-muted">{intro}</p>
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
  return (
    <section className="border-t border-border-soft bg-surface">
      <div className="mx-auto grid max-w-6xl divide-y divide-border-soft px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map(([value, label]) => (
          <div key={label} className="py-8 sm:px-8 sm:py-10 sm:first:pl-0">
            <p className="font-display text-[40px] leading-none text-ink">
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
          className="grid gap-1 border-b border-border-soft py-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8"
        >
          <dt className="font-display text-base text-ink">{term}</dt>
          <dd className="max-w-[60ch] text-sm text-ink-muted">{desc}</dd>
        </div>
      ))}
    </dl>
  );
}
