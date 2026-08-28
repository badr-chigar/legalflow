import type { Metadata } from "next";
import Link from "next/link";

import { Disclosure } from "@/components/marketing/disclosure";
import { FiletList, PageIntro, Section } from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Domiciliation — LegalFlow",
  description:
    "Une adresse professionnelle reconnue, un contrat conforme et la gestion de votre courrier scanné, sans louer de bureau.",
};

const BENEFITS = [
  [
    "Adresse reconnue",
    "Une domiciliation acceptée par le greffe et l’administration fiscale.",
  ],
  [
    "Courrier scanné",
    "Réception, numérisation et notification de votre courrier le jour même.",
  ],
  [
    "Contrat conforme sous 24 h",
    "Un contrat de domiciliation enregistrable, transmis sous un jour ouvré.",
  ],
  [
    "Sans engagement long",
    "Contrat renouvelable, résiliable avec préavis d’un mois.",
  ],
] as const;

const FAQ = [
  [
    "La domiciliation est-elle obligatoire ?",
    "Non. Vous pouvez domicilier la société à votre adresse si le bail l’autorise. La domiciliation est utile si vous n’avez pas de local commercial ou pour séparer adresse personnelle et professionnelle.",
  ],
  [
    "Puis-je recevoir des colis ?",
    "L’adresse gère le courrier administratif et recommandé. Les colis volumineux ne sont pas pris en charge.",
  ],
  [
    "Que se passe-t-il en cas de contrôle ?",
    "Le contrat de domiciliation et le registre sont conformes à la réglementation et opposables à l’administration.",
  ],
] as const;

export default function DomiciliationPage() {
  return (
    <>
      <PageIntro
        eyebrow="Service · Domiciliation"
        title="Une adresse professionnelle, sans louer de bureau."
        intro="Domiciliez le siège de votre société à une adresse reconnue, avec un contrat conforme et la gestion de votre courrier."
        actions={
          <>
            <Link href="/creer" className={buttonVariants({ size: "lg" })}>
              Domicilier ma société
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

      <Section
        n="01"
        eyebrow="Ce qui est inclus"
        title="Une domiciliation qui tient devant l’administration."
      >
        <FiletList items={BENEFITS} />
      </Section>

      <Section n="02" eyebrow="Questions fréquentes" title="Ce qu’il faut savoir.">
        <div className="border-t border-border-soft">
          {FAQ.map(([q, a]) => (
            <Disclosure key={q} summary={q}>
              {a}
            </Disclosure>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/creer" className={buttonVariants()}>
            Domicilier ma société
          </Link>
        </div>
      </Section>
    </>
  );
}
