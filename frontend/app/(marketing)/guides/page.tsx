import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/marketing/primitives";
import { formatDate } from "@/lib/format";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides — LegalFlow",
  description:
    "Repères pratiques sur la création et la vie juridique d’une société. Contenu de démonstration.",
};

export default function GuidesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Guides"
        title="Des repères clairs pour décider sans jargon."
        intro="Articles courts sur les choix qui reviennent le plus souvent. Contenu de démonstration, sans valeur de conseil juridique."
      />
      <section className="border-t border-border-soft">
        <div className="mx-auto w-full max-w-[84rem] px-6 lg:px-12 2xl:max-w-[90rem] pb-16 pt-12 sm:pb-20 lg:pb-24 lg:pt-16">
        <ul className="border-t border-border-soft">
          {GUIDES.map((g) => (
            <li key={g.slug} className="border-b border-border-soft py-6">
              <p className="font-mono text-xs text-ink-muted">
                {formatDate(g.date)} · {g.readingMinutes} min de lecture
              </p>
              <h2 className="mt-2 font-display text-lg text-ink">
                <Link href={`/guides/${g.slug}`} className="hover:underline">
                  {g.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{g.excerpt}</p>
              <Link
                href={`/guides/${g.slug}`}
                className="mt-3 inline-block text-xs font-medium text-brand-slate hover:underline"
              >
                Lire l’article
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </section>
    </>
  );
}
