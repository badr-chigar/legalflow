import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Disclosure } from "@/components/marketing/disclosure";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LegalFlow — Créez et pilotez votre société en ligne",
  description:
    "Création d’entreprise, domiciliation et secrétariat juridique sur une seule plateforme. Actes rédigés par des juristes, suivi en temps réel, forfait tout inclus.",
};

/* --------------------------------------------------------------------------
 * Page publique « client ». Reprend les sections de mylegal.ma, refaites
 * avec le système de design LegalFlow (design-system.md). Copy de démo.
 * ------------------------------------------------------------------------ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
      {children}
    </p>
  );
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border-soft">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-xl text-ink">
          {title}
        </h2>
        {intro ? (
          <p className="mt-3 max-w-2xl text-sm text-ink-muted">{intro}</p>
        ) : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 text-success", className)}
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

function Dash() {
  return <span className="text-ink-muted">–</span>;
}

/* ----------------------------- 1. Hero ---------------------------------- */

const INCLUDED = [
  "Certificat négatif",
  "Statuts rédigés et enregistrés",
  "Immatriculation au registre du commerce",
  "Identifiant fiscal (IF)",
  "Identifiant commun de l’entreprise (ICE)",
  "Affiliation CNSS",
];

function Hero() {
  return (
    <section className="border-b border-border-soft">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <Eyebrow>Accompagnement juridique · 100 % en ligne</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-[30px] leading-tight text-ink sm:text-[40px]">
            Créez et pilotez votre société sans passer par le guichet.
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-muted">
            Création d’entreprise, domiciliation et secrétariat juridique réunis
            sur une seule plateforme. Des juristes rédigent vos actes, vous
            suivez chaque étape en temps réel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Créer mon entreprise
            </Link>
            <Link
              href="/tarifs"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-8 border-t border-border-soft pt-4 font-mono text-xs text-ink-muted">
            + de 1 000 dossiers accompagnés · Satisfait ou remboursé
          </p>
        </div>

        <div className="rounded-card border border-border-soft bg-surface p-6">
          <Eyebrow>Compris dans le forfait création</Eyebrow>
          <ul className="mt-4">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-border-soft py-2.5 text-sm text-ink last:border-b-0"
              >
                <Check className="mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ 2. Bandeau confiance ------------------------- */

const TRUST = [
  "Statuts rédigés par des juristes",
  "Signature électronique conforme",
  "Forfait tout inclus, sans surprise",
  "Suivi en temps réel",
  "Garantie anti-rejet",
];

function TrustBar() {
  return (
    <section className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-5">
        {TRUST.map((item) => (
          <span key={item} className="text-xs text-ink-muted">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- 3. Services ----------------------------- */

function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title="Une plateforme, trois services."
      intro="Le même interlocuteur vous suit de la constitution à la vie courante de la société."
    >
      <div className="max-w-3xl border-t border-border-soft">
        <Disclosure summary="Création d’entreprise" defaultOpen>
          <ul className="space-y-2">
            {[
              "Procédure 100 % en ligne, sans déplacement.",
              "Un juriste dédié à votre dossier.",
              "Prise en charge de A à Z : certificat négatif, statuts, RC, IF, ICE, CNSS.",
              "Garantie anti-rejet : nous corrigeons et redéposons sans frais.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <Check className="mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Disclosure>
        <Disclosure summary="Domiciliation">
          Une adresse professionnelle reconnue, un contrat conforme et la gestion
          de votre courrier scanné, sans louer de bureau.
        </Disclosure>
        <Disclosure summary="Secrétariat juridique">
          Assemblées, procès-verbaux, dépôts annuels et mises à jour statutaires
          suivis par la même équipe, tout au long de la vie de la société.
        </Disclosure>
      </div>
    </Section>
  );
}

/* --------------------------- 4. Pourquoi nous ------------------------- */

const PILLARS = [
  [
    "Simplicité",
    "Un formulaire guidé, aucune connaissance juridique requise.",
  ],
  [
    "Fiabilité",
    "Chaque acte est relu par un juriste avant dépôt au greffe.",
  ],
  [
    "Tarif transparent",
    "Un forfait annoncé à l’avance, honoraires et frais inclus.",
  ],
  [
    "Accompagnement",
    "Un interlocuteur unique, joignable jusqu’à l’immatriculation.",
  ],
];

function WhyUs() {
  return (
    <Section
      id="pourquoi"
      eyebrow="Pourquoi LegalFlow"
      title="La création d’entreprise, sans friction."
    >
      <dl className="max-w-3xl border-t border-border-soft">
        {PILLARS.map(([term, desc]) => (
          <div
            key={term}
            className="grid gap-1 border-b border-border-soft py-4 sm:grid-cols-[12rem_1fr] sm:gap-6"
          >
            <dt className="text-sm font-medium text-ink">{term}</dt>
            <dd className="text-sm text-ink-muted">{desc}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* ------------------------ 5. Comment ça marche ----------------------- */

const STEPS = [
  [
    "01",
    "Vérification du nom",
    "Nous déposons la demande de certificat négatif et réservons votre dénomination.",
  ],
  [
    "02",
    "Rédaction des actes",
    "Statuts, formulaires et annexes préparés par un juriste, validés avec vous.",
  ],
  [
    "03",
    "Signature électronique",
    "Vous signez en ligne par code à usage unique ; les pièces sont horodatées.",
  ],
  [
    "04",
    "Dépôt et immatriculation",
    "Dépôt au greffe, obtention du RC, de l’IF, de l’ICE et de l’affiliation CNSS.",
  ],
];

function HowItWorks() {
  return (
    <Section
      id="etapes"
      eyebrow="Comment ça marche"
      title="Les étapes, du nom à l’immatriculation."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
        <ol className="border-t border-border-soft">
          {STEPS.map(([num, title, desc]) => (
            <li
              key={num}
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border-soft py-5"
            >
              <span className="font-mono text-sm text-ink-muted">{num}</span>
              <div>
                <p className="font-display text-base text-ink">{title}</p>
                <p className="mt-1 text-sm text-ink-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="h-fit rounded-card border border-border-soft bg-surface p-5">
          <Eyebrow>Délai moyen</Eyebrow>
          <p className="mt-2 font-display text-lg text-ink">
            Société livrée en 10 jours ouvrés
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            À compter de la validation de vos pièces. Le certificat négatif
            dépend du délai de l’administration.
          </p>
        </aside>
      </div>
    </Section>
  );
}

/* ------------------------- 6. Domiciliation ------------------------- */

const DOMICILIATION = [
  [
    "Adresse reconnue",
    "Une domiciliation acceptée par le greffe et l’administration fiscale.",
  ],
  [
    "Courrier scanné",
    "Votre courrier est réceptionné, numérisé et notifié le jour même.",
  ],
  [
    "Contrat conforme sous 24 h",
    "Un contrat de domiciliation enregistrable, transmis sous un jour ouvré.",
  ],
];

function Domiciliation() {
  return (
    <Section
      id="domiciliation"
      eyebrow="Domiciliation"
      title="Une adresse professionnelle, sans louer de bureau."
    >
      <dl className="max-w-3xl border-t border-border-soft">
        {DOMICILIATION.map(([term, desc]) => (
          <div
            key={term}
            className="grid gap-1 border-b border-border-soft py-4 sm:grid-cols-[16rem_1fr] sm:gap-6"
          >
            <dt className="text-sm font-medium text-ink">{term}</dt>
            <dd className="text-sm text-ink-muted">{desc}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/login" className={buttonVariants()}>
          Domicilier ma société
        </Link>
        <Link
          href="/tarifs"
          className={buttonVariants({ variant: "secondary" })}
        >
          Voir les tarifs
        </Link>
      </div>
    </Section>
  );
}

/* --------------------- 7. MRE & investisseurs --------------------- */

const MRE = [
  "Aucun déplacement au Maroc requis.",
  "Procuration et signature à distance.",
  "Comptes rendus par visioconférence.",
  "Domiciliation incluse dès la création.",
  "Assistance à l’ouverture du compte bancaire professionnel.",
  "Documents bilingues français / arabe.",
];

function Mre() {
  return (
    <Section
      id="mre"
      eyebrow="MRE & investisseurs"
      title="Créez votre société au Maroc, depuis n’importe où."
    >
      <ul className="max-w-2xl border-t border-border-soft">
        {MRE.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border-b border-border-soft py-3 text-sm text-ink"
          >
            <Check className="mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link href="/contact" className={buttonVariants()}>
          Parler à un juriste
        </Link>
      </div>
    </Section>
  );
}

/* ----------------------- 8. Accompagnement ---------------------- */

function Support() {
  return (
    <Section
      id="accompagnement"
      eyebrow="Accompagnement"
      title="Un seul interlocuteur pour toutes vos formalités."
    >
      <div className="max-w-2xl border-t border-border-soft">
        <p className="border-b border-border-soft py-4 text-sm text-ink-muted">
          Un juriste dédié, joignable par WhatsApp, e-mail ou téléphone aux
          heures ouvrées.
        </p>
        <p className="border-b border-border-soft py-4 text-sm text-ink-muted">
          Un suivi continu, de la réservation du nom jusqu’à la remise du
          registre du commerce.
        </p>
      </div>
      <div className="mt-8">
        <Link
          href="/contact"
          className={buttonVariants({ variant: "secondary" })}
        >
          Contacter l’équipe
        </Link>
      </div>
    </Section>
  );
}

/* ------------------------- 9. Comparatif ----------------------- */

const COMPARISON: [string, ReactNode, ReactNode][] = [
  ["Démarches en ligne", <Check key="a" />, <Dash key="b" />],
  ["Tarif annoncé à l’avance", <Check key="a" />, <Dash key="b" />],
  ["Suivi en temps réel", <Check key="a" />, <Dash key="b" />],
  ["Délai indicatif", "10 jours ouvrés", "3 à 6 semaines"],
  ["Documents conformes garantis", <Check key="a" />, <Check key="b" />],
  ["Domiciliation incluse", <Check key="a" />, <Dash key="b" />],
];

function Comparison() {
  return (
    <Section
      id="comparatif"
      eyebrow="Comparatif"
      title="Le même résultat juridique, sans les rendez-vous."
    >
      <div className="max-w-3xl overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-border-soft text-left">
              <th className="py-3 pr-4 font-medium text-ink-muted">Critère</th>
              <th className="px-4 py-3 font-medium text-ink">LegalFlow</th>
              <th className="py-3 pl-4 font-medium text-ink-muted">
                Cabinet traditionnel
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map(([label, ours, theirs]) => (
              <tr key={label} className="border-b border-border-soft">
                <th
                  scope="row"
                  className="py-3 pr-4 text-left font-normal text-ink"
                >
                  {label}
                </th>
                <td className="px-4 py-3 text-ink">{ours}</td>
                <td className="py-3 pl-4 text-ink-muted">{theirs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ------------------------ 10. Témoignages --------------------- */

const TESTIMONIALS = [
  [
    "J’ai déclaré mes pièces un dimanche soir. Le certificat négatif est arrivé deux jours après, le reste a suivi sans que j’aie à me déplacer.",
    "SB",
    "Sofia B.",
    "Agence de design, Casablanca",
  ],
  [
    "Le juriste a repris mes statuts point par point avant le dépôt. Aucun aller-retour avec le greffe, ce qui m’avait coûté un mois lors de ma première société.",
    "KT",
    "Karim T.",
    "Société d’import, Tanger",
  ],
  [
    "Je vis à l’étranger et je pensais devoir prendre l’avion. Tout s’est fait par procuration et visioconférence, domiciliation comprise.",
    "NE",
    "Nadia E.",
    "Conseil en informatique, Lyon",
  ],
];

function Testimonials() {
  return (
    <Section
      id="temoignages"
      eyebrow="Témoignages"
      title="Des entrepreneurs comme vous."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map(([quote, initials, name, role]) => (
          <figure
            key={name}
            className="flex flex-col rounded-card border border-border-soft bg-surface p-5"
          >
            <blockquote className="flex-1 text-sm text-ink">
              « {quote} »
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-nav-active font-mono text-xs text-ink"
              >
                {initials}
              </span>
              <span className="text-xs">
                <span className="block font-medium text-ink">{name}</span>
                <span className="block text-ink-muted">{role}</span>
              </span>
            </figcaption>
            <p className="mt-3 font-mono text-xs text-ink-muted">Avis vérifié</p>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- 11. FAQ ------------------------- */

const FAQ = [
  [
    "Quel est le délai réel pour immatriculer une société ?",
    "Comptez en moyenne 10 jours ouvrés entre la validation de vos pièces et l’obtention du registre du commerce. Le certificat négatif conditionne le démarrage et dépend de l’administration.",
  ],
  [
    "Que comprend le prix affiché ?",
    "Le forfait inclut les honoraires du juriste, la rédaction des actes, les frais de greffe et d’enregistrement, et la première année de domiciliation. Aucun supplément n’est ajouté en cours de dossier.",
  ],
  [
    "Quels documents me sont remis à la fin ?",
    "Statuts signés, certificat négatif, modèle J du registre du commerce, identifiant fiscal, ICE et attestation d’affiliation CNSS, réunis dans votre espace client.",
  ],
  [
    "La domiciliation est-elle obligatoire ?",
    "Non. Vous pouvez domicilier la société à votre adresse si le bail l’autorise. La domiciliation par LegalFlow reste utile si vous n’avez pas de local commercial.",
  ],
  [
    "Que couvre la garantie satisfait ou remboursé ?",
    "Si le dossier est rejeté pour une erreur de rédaction de notre part, nous corrigeons et redéposons sans frais. Si vous renoncez avant le dépôt, les honoraires versés vous sont remboursés.",
  ],
];

function Faq() {
  return (
    <Section
      id="faq"
      eyebrow="Questions fréquentes"
      title="Ce que les entrepreneurs nous demandent."
    >
      <div className="max-w-3xl border-t border-border-soft">
        {FAQ.map(([q, a]) => (
          <Disclosure key={q} summary={q}>
            {a}
          </Disclosure>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------- 12. CTA final --------------------- */

function FinalCta() {
  return (
    <section className="bg-brand-slate">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-surface/70">
          Parlons de votre projet
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-xl text-surface sm:text-[26px]">
          Une question avant de vous lancer ?
        </h2>
        <p className="mt-3 max-w-xl text-sm text-surface/80">
          Un juriste vous rappelle et vérifie la faisabilité de votre projet,{" "}
          <span className="text-brand-brass">sans engagement</span>.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-control bg-surface px-5 text-base font-medium text-brand-slate transition-colors hover:bg-page"
          >
            Créer mon entreprise
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-control border border-surface/30 px-5 text-base font-medium text-surface transition-colors hover:bg-surface/10"
          >
            Contacter l’équipe
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Page ------------------------- */

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <WhyUs />
      <HowItWorks />
      <Domiciliation />
      <Mre />
      <Support />
      <Comparison />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
