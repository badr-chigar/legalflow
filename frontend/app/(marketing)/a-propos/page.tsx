import type { Metadata } from "next";
import Link from "next/link";

import {
  FiletList,
  PageIntro,
  Section,
  SHELL,
  StatBand,
} from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notre histoire — LegalFlow",
  description:
    "LegalFlow est né en 2023 de la rencontre d’une juriste d’affaires et d’un développeur, autour d’un constat : au Maroc, créer une société reste opaque.",
};

const PRINCIPLES = [
  [
    "Transparence",
    "Un forfait annoncé, aucun supplément en cours de route.",
  ],
  [
    "Rigueur",
    "Des actes conformes à la loi 5-96, enregistrés dans les délais.",
  ],
  [
    "Un seul interlocuteur",
    "Le même juriste du début à la fin du dossier.",
  ],
] as const;

const TEAM = [
  {
    mono: "L. B.",
    role: "Responsable juridique",
    text: "Juriste d’affaires, huit ans en cabinet à Casablanca. Répond de la conformité des actes et du respect des délais d’enregistrement à la DGI.",
  },
  {
    mono: "Y. M.",
    role: "Lead produit",
    text: "Ancien formaliste au Centre Régional d’Investissement. Répond du parcours de création et de son alignement avec le guichet unique.",
  },
  {
    mono: "A. T.",
    role: "Développeur",
    text: "Répond de la plateforme, du suivi de dossier en temps réel et de la signature électronique des actes.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageIntro
        eyebrow="Notre histoire"
        title="Rendre la création d’entreprise lisible."
        accent="lisible"
        intro="LegalFlow est né en 2023 de la rencontre d’une juriste d’affaires et d’un développeur, après un constat partagé : au Maroc, créer une société reste opaque — devis flous, allers-retours au guichet, délais annoncés « en semaines ». Ils ont voulu un service où l’on sait, dès le départ, ce que l’on paie, ce que l’on reçoit et quand."
      />

      <Section
        bg="page"
        eyebrow="Mission"
        title="Un dossier de création doit être compréhensible par la personne qui le signe."
        accent="compréhensible"
      >
        <FiletList items={PRINCIPLES} />
      </Section>

      <StatBand
        items={[
          ["2023", "Année de création"],
          ["1 000+", "Dossiers accompagnés"],
          ["10 j", "Délai moyen ouvré"],
          ["6", "Formes juridiques gérées"],
        ]}
      />

      <Section
        bg="surface"
        eyebrow="L’équipe"
        title="Trois personnes, trois responsabilités."
        accent="trois responsabilités"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div
              key={m.mono}
              className="rounded-card border border-border-soft bg-page p-5"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-nav-active font-mono text-xs text-ink"
              >
                {m.mono}
              </span>
              <p className="mt-4 font-display text-base text-ink">{m.role}</p>
              <p className="mt-2 text-[15px] text-ink-muted">{m.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-t border-border-soft bg-page">
        <div className={cn(SHELL, "py-16")}>
          <div className="rounded-card border border-border-soft bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand-brass">
              Démonstration
            </p>
            <p className="mt-3 max-w-[80ch] text-[15px] text-ink-muted">
              LegalFlow est un projet de démonstration réalisé dans le cadre d’un
              entretien technique. Les données, les témoignages et l’équipe
              présentés ici sont fictifs. Le service ne réalise aucune formalité
              réelle.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border-soft bg-nav-active">
        <div className={cn(SHELL, "flex flex-wrap items-center justify-between gap-4 py-12")}>
          <p className="font-display text-lg text-ink">
            Le détail de la procédure, étape par étape.
          </p>
          <Link href="/creation-entreprise" className={buttonVariants()}>
            Voir comment nous travaillons →
          </Link>
        </div>
      </section>
    </>
  );
}
