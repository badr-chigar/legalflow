import type { Metadata } from "next";

import { PageIntro } from "@/components/marketing/primitives";

export const metadata: Metadata = {
  title: "Mentions légales — LegalFlow",
  description: "Informations légales du projet de démonstration LegalFlow.",
};

const SECTIONS = [
  {
    id: "mentions",
    title: "Mentions légales",
    paragraphs: [
      "LegalFlow est un projet de démonstration à but pédagogique. Il ne s’agit pas d’un service commercial et il n’est affilié à aucun cabinet d’avocats ni à aucune autorité.",
      "Éditeur : projet LegalFlow (démonstration). Hébergement : environnement de développement local. Directeur de publication : l’auteur du projet.",
    ],
  },
  {
    id: "cgu",
    title: "Conditions d’utilisation",
    paragraphs: [
      "L’accès à la plateforme est réservé à des fins de test. Les données saisies peuvent être supprimées à tout moment sans préavis.",
      "Aucune prestation juridique n’est fournie. Les contenus et parcours reproduisent une legaltech à titre d’illustration.",
    ],
  },
  {
    id: "confidentialite",
    title: "Politique de confidentialité",
    paragraphs: [
      "Les informations de compte servent uniquement à l’authentification pendant la démonstration. Elles ne sont ni revendues ni transmises à des tiers.",
      "Les jetons de session sont stockés dans des cookies strictement nécessaires au fonctionnement.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "Seuls des cookies techniques sont utilisés : jeton d’accès et jeton de rafraîchissement. Aucun cookie de mesure d’audience ni de publicité n’est déposé.",
    ],
  },
] as const;

export default function MentionsLegalesPage() {
  return (
    <>
      <PageIntro eyebrow="Informations légales" title="Mentions légales" />
      <section className="border-t border-border-soft">
        <div className="mx-auto max-w-[72ch] px-6 pb-16 pt-12 sm:pb-20 lg:pt-16">
          <div className="space-y-12">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="border-t border-border-soft pt-6 font-display text-lg text-ink">
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {s.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="max-w-[68ch] text-base leading-[1.7] text-ink-muted"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
