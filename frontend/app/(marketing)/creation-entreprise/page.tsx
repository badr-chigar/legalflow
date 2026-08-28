import type { Metadata } from "next";
import Link from "next/link";

import { Disclosure } from "@/components/marketing/disclosure";
import { FiletList, PageIntro, Section } from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Création d’entreprise — LegalFlow",
  description:
    "Constituez votre société 100 % en ligne : certificat négatif, statuts, immatriculation au registre du commerce, IF, ICE et CNSS.",
};

const PILLARS = [
  [
    "Procédure en ligne",
    "Un parcours guidé en quatre étapes ; aucun déplacement, aucune connaissance juridique requise.",
  ],
  [
    "Juriste dédié",
    "La même personne rédige vos actes, répond à vos questions et suit le dépôt.",
  ],
  [
    "Prise en charge A→Z",
    "Certificat négatif, statuts, formulaire M0, RC, identifiant fiscal, ICE et affiliation CNSS.",
  ],
  [
    "Garantie anti-rejet",
    "Si le greffe rejette le dossier pour une erreur de notre part, nous corrigeons et redéposons sans frais.",
  ],
] as const;

const STEPS = [
  ["Vérification du nom", "Demande de certificat négatif et réservation de la dénomination."],
  ["Rédaction des actes", "Statuts et annexes préparés par un juriste, validés avec vous."],
  ["Signature électronique", "Signature par code à usage unique ; pièces horodatées."],
  ["Dépôt et immatriculation", "Dépôt au greffe, obtention du RC, de l’IF, de l’ICE et de la CNSS."],
] as const;

const FAQ = [
  [
    "Quelle forme juridique choisir ?",
    "La SARL convient à la plupart des projets à plusieurs associés ; la SAS offre plus de souplesse statutaire ; la micro-entreprise vise l’activité individuelle simple. Le juriste vous oriente selon votre situation.",
  ],
  [
    "Quel capital social minimum ?",
    "Il n’y a pas de minimum légal pour une SARL ou une SAS ; le capital doit rester cohérent avec l’activité. Il peut être libéré partiellement à la constitution.",
  ],
  [
    "Combien de temps pour être immatriculé ?",
    "En moyenne 10 jours ouvrés après validation des pièces. Le certificat négatif dépend du délai de l’administration.",
  ],
  [
    "Puis-je créer depuis l’étranger ?",
    "Oui. La signature se fait à distance et une procuration permet de finaliser le dépôt sans venir sur place.",
  ],
] as const;

export default function CreationEntreprisePage() {
  return (
    <>
      <PageIntro
        eyebrow="Service · Création d’entreprise"
        title="Constituez votre société sans passer par le guichet."
        intro="Un juriste rédige et dépose l’intégralité de votre dossier. Vous suivez l’avancement en temps réel, de la réservation du nom jusqu’au registre du commerce."
        actions={
          <>
            <Link href="/creer" className={buttonVariants({ size: "lg" })}>
              Créer mon entreprise
            </Link>
            <Link
              href="/tarifs"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Voir les tarifs
            </Link>
          </>
        }
      />

      <Section n="01" eyebrow="Ce que vous obtenez" title="Un dossier complet, relu et déposé.">
        <FiletList items={PILLARS} />
      </Section>

      <Section n="02" eyebrow="Déroulé" title="Les étapes, du nom à l’immatriculation.">
        <ol className="relative border-t border-border-soft">
          <span
            aria-hidden
            className="absolute left-[15px] top-9 bottom-9 w-px bg-border-soft"
          />
          {STEPS.map(([title, desc], i) => (
            <li
              key={title}
              className="relative grid grid-cols-[2rem_1fr] gap-4 border-b border-border-soft py-7"
            >
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border-soft bg-page font-mono text-xs text-brand-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-lg text-ink">{title}</p>
                <p className="mt-1.5 max-w-[52ch] text-sm text-ink-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section n="03" eyebrow="Questions fréquentes" title="Avant de vous lancer.">
        <div className="border-t border-border-soft">
          {FAQ.map(([q, a]) => (
            <Disclosure key={q} summary={q}>
              {a}
            </Disclosure>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/creer" className={buttonVariants()}>
            Créer mon entreprise
          </Link>
        </div>
      </Section>
    </>
  );
}
