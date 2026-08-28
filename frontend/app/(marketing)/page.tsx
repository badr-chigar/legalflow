import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Disclosure } from "@/components/marketing/disclosure";
import {
  Check,
  Dash,
  Eyebrow,
  Reveal,
  Section,
  StatBand,
} from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "LegalFlow — Créez et pilotez votre société en ligne",
  description:
    "Création d’entreprise, domiciliation et secrétariat juridique sur une seule plateforme. Actes rédigés par des juristes, suivi en temps réel, forfait tout inclus.",
};

/* =========================================================================
 * Vitrine LegalFlow — direction éditoriale-institutionnelle.
 * Fraunces généreux, épine dorsale numérotée en laiton, filets 1px,
 * papier chaud #FBFAF7, une seule bande sombre (CTA final).
 * ======================================================================= */

/* --- Schémas dessinés main (trait 1.5px, pas d'icônes de librairie) ----- */

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-ink"
    >
      {children}
    </svg>
  );
}

const STEP_ICONS = [
  // Dossier
  <LineIcon key="d">
    <path d="M5 12h9l3 3h18v20H5z" />
    <path d="M5 21h30" />
  </LineIcon>,
  // Juriste
  <LineIcon key="j">
    <circle cx="20" cy="14" r="5" />
    <path d="M9 34c0-6 5-11 11-11s11 5 11 11" />
  </LineIcon>,
  // Signature
  <LineIcon key="s">
    <path d="M6 31h22" />
    <path d="M9 27c3-9 5 5 8-1s4 4 7-3" />
    <path d="M27 13l4 4-9 9-5 1 1-5z" />
  </LineIcon>,
  // Tampon (RC)
  <LineIcon key="t">
    <path d="M16 8h8v6l3 7H13l3-7z" />
    <path d="M9 30h22" />
    <path d="M14 25h12v5H14z" />
  </LineIcon>,
];

/* --------------------------------- Hero -------------------------------- */

const INCLUDED = [
  "Certificat négatif",
  "Statuts rédigés et enregistrés",
  "Immatriculation au registre du commerce",
  "Identifiant fiscal, ICE et affiliation CNSS",
];

const DOSSIER_STEPS = ["Brouillon", "En revue", "Déposé", "Immatriculé"];
const DOSSIER_CURRENT = 1; // index de l'étape en cours

function Hero() {
  return (
    <section className="border-b border-border-soft">
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-10 px-6 py-16 sm:py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <Eyebrow>Accompagnement juridique · 100 % en ligne</Eyebrow>
          <h1 className="mt-5 max-w-[19ch] text-balance font-display text-[42px] leading-[1.05] text-ink sm:text-[54px]">
            Créez et pilotez votre société sans passer par le guichet.
          </h1>
          <p className="mt-6 max-w-[52ch] text-base text-ink-muted sm:text-lg">
            Création d’entreprise, domiciliation et secrétariat juridique réunis
            sur une seule plateforme. Des juristes rédigent vos actes ; vous
            suivez chaque étape en temps réel.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/creer" className={buttonVariants({ size: "lg" })}>
              Créer mon entreprise
            </Link>
            <Link
              href="/tarifs"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-10 border-t border-border-soft pt-4 font-mono text-xs text-ink-muted">
            + de 1 000 dossiers accompagnés
            <span className="mx-2 text-brand-brass">·</span>
            Satisfait ou remboursé
          </p>
        </div>

        {/* Aperçu de dossier — seule ombre portée autorisée avec les toasts. */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-card border border-border-soft bg-surface p-6 shadow-overlay">
            <div className="flex items-baseline justify-between border-b border-border-soft pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Dossier
              </span>
              <span className="font-mono text-xs text-ink">
                SARL · Atlas Conseil
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center">
                {DOSSIER_STEPS.map((_, i) => (
                  <div key={i} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={
                        i <= DOSSIER_CURRENT
                          ? "h-2.5 w-2.5 shrink-0 rounded-full bg-brand-slate"
                          : "h-2.5 w-2.5 shrink-0 rounded-full border border-border-soft bg-surface"
                      }
                    />
                    {i < DOSSIER_STEPS.length - 1 ? (
                      <span
                        className={
                          i < DOSSIER_CURRENT
                            ? "h-px flex-1 bg-brand-slate"
                            : "h-px flex-1 bg-border-soft"
                        }
                      />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                {DOSSIER_STEPS.map((label, i) => (
                  <span
                    key={label}
                    className={
                      "text-[11px] " +
                      (i === DOSSIER_CURRENT
                        ? "font-medium text-brand-slate"
                        : i < DOSSIER_CURRENT
                          ? "text-ink"
                          : "text-ink-muted")
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <ul className="mt-6 border-t border-border-soft pt-4">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 py-1.5 text-sm text-ink"
                >
                  <Check className="mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[11px] text-ink-muted">
              Compris dans le forfait création
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Bandeau confiance ---------------------- */

const TRUST = [
  "Statuts rédigés par des juristes",
  "Signature électronique conforme",
  "Forfait tout inclus",
  "Suivi en temps réel",
  "Garantie anti-rejet",
];

function TrustBar() {
  return (
    <section className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-6 py-5">
        {TRUST.map((item, i) => (
          <span key={item} className="flex items-center text-xs text-ink-muted">
            {i > 0 ? (
              <span className="mr-3 text-brand-brass" aria-hidden>
                ·
              </span>
            ) : null}
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- 01 Services ----------------------- */

function Services() {
  return (
    <Section
      id="services"
      n="01"
      eyebrow="Services"
      title="Une plateforme, trois services."
      intro="Le même interlocuteur vous suit de la constitution à la vie courante de la société."
    >
      <div className="border-t border-border-soft">
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

/* ------------------------------- 02 Pourquoi ------------------------- */

const PILLARS = [
  ["Simplicité", "Un formulaire guidé, aucune connaissance juridique requise."],
  ["Fiabilité", "Chaque acte est relu par un juriste avant dépôt au greffe."],
  [
    "Tarif transparent",
    "Un forfait annoncé à l’avance, honoraires et frais inclus.",
  ],
  [
    "Accompagnement",
    "Un interlocuteur unique, joignable jusqu’à l’immatriculation.",
  ],
] as const;

function WhyUs() {
  return (
    <Section
      id="pourquoi"
      n="02"
      eyebrow="Pourquoi LegalFlow"
      title="La création d’entreprise, sans friction."
    >
      <dl className="border-t border-border-soft">
        {PILLARS.map(([term, desc]) => (
          <div
            key={term}
            className="grid gap-1 border-b border-border-soft py-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-8"
          >
            <dt className="font-display text-base text-ink">{term}</dt>
            <dd className="max-w-[58ch] text-sm text-ink-muted">{desc}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* --------------------------- 03 Comment ça marche ------------------- */

const STEPS = [
  [
    "Vérification du nom",
    "Nous déposons la demande de certificat négatif et réservons votre dénomination.",
  ],
  [
    "Rédaction des actes",
    "Statuts, formulaires et annexes préparés par un juriste, validés avec vous.",
  ],
  [
    "Signature électronique",
    "Vous signez en ligne par code à usage unique ; les pièces sont horodatées.",
  ],
  [
    "Dépôt et immatriculation",
    "Dépôt au greffe, obtention du RC, de l’IF, de l’ICE et de l’affiliation CNSS.",
  ],
] as const;

function HowItWorks() {
  return (
    <Section
      id="etapes"
      n="03"
      eyebrow="Comment ça marche"
      title="Les étapes, du nom à l’immatriculation."
    >
      <ol className="relative border-t border-border-soft">
        {/* rail continu */}
        <span
          aria-hidden
          className="absolute left-[15px] top-9 bottom-9 w-px bg-border-soft sm:left-[19px]"
        />
        {STEPS.map(([title, desc], i) => (
          <li
            key={title}
            className="relative grid grid-cols-[2rem_1fr] gap-4 border-b border-border-soft py-7 sm:grid-cols-[2.5rem_1fr] sm:gap-6"
          >
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border-soft bg-page font-mono text-xs text-brand-brass sm:h-10 sm:w-10 sm:text-sm">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-display text-lg text-ink">{title}</p>
                <p className="mt-1.5 max-w-[52ch] text-sm text-ink-muted">
                  {desc}
                </p>
              </div>
              <span className="hidden shrink-0 sm:block">{STEP_ICONS[i]}</span>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------- 04 Domiciliation ------------------- */

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
] as const;

function Domiciliation() {
  return (
    <Section
      id="domiciliation"
      n="04"
      eyebrow="Domiciliation"
      title="Une adresse professionnelle, sans louer de bureau."
    >
      <dl className="border-t border-border-soft">
        {DOMICILIATION.map(([term, desc]) => (
          <div
            key={term}
            className="grid gap-1 border-b border-border-soft py-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"
          >
            <dt className="font-display text-base text-ink">{term}</dt>
            <dd className="max-w-[58ch] text-sm text-ink-muted">{desc}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/creer" className={buttonVariants()}>
          Domicilier ma société
        </Link>
        <Link href="/tarifs" className={buttonVariants({ variant: "secondary" })}>
          Voir les tarifs
        </Link>
      </div>
    </Section>
  );
}

/* --------------------- 05 MRE & investisseurs --------------------- */

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
      n="05"
      eyebrow="MRE & investisseurs"
      title="Créez votre société au Maroc, depuis n’importe où."
    >
      <ul className="border-t border-border-soft">
        {MRE.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border-b border-border-soft py-3.5 text-sm text-ink"
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

/* ----------------------- 06 Accompagnement ---------------------- */

function Support() {
  return (
    <Section
      id="accompagnement"
      n="06"
      eyebrow="Accompagnement"
      title="Un seul interlocuteur pour toutes vos formalités."
    >
      <dl className="border-t border-border-soft">
        <div className="border-b border-border-soft py-5">
          <dt className="font-display text-base text-ink">Joignable</dt>
          <dd className="mt-1 max-w-[58ch] text-sm text-ink-muted">
            Un juriste dédié, par WhatsApp, e-mail ou téléphone aux heures
            ouvrées.
          </dd>
        </div>
        <div className="border-b border-border-soft py-5">
          <dt className="font-display text-base text-ink">Continu</dt>
          <dd className="mt-1 max-w-[58ch] text-sm text-ink-muted">
            Un suivi de la réservation du nom jusqu’à la remise du registre du
            commerce.
          </dd>
        </div>
      </dl>
      <div className="mt-8">
        <Link href="/contact" className={buttonVariants({ variant: "secondary" })}>
          Contacter l’équipe
        </Link>
      </div>
    </Section>
  );
}

/* --------------------------- 07 Comparatif ---------------------- */

const COMPARISON: [string, ReactNode, ReactNode][] = [
  ["Démarches en ligne", <Check key="a" tone="brass" />, <Dash key="b" />],
  ["Tarif annoncé à l’avance", <Check key="a" tone="brass" />, <Dash key="b" />],
  ["Suivi en temps réel", <Check key="a" tone="brass" />, <Dash key="b" />],
  ["Délai indicatif", "10 jours ouvrés", "3 à 6 semaines"],
  [
    "Documents conformes garantis",
    <Check key="a" tone="brass" />,
    <Check key="b" tone="brass" />,
  ],
  ["Domiciliation incluse", <Check key="a" tone="brass" />, <Dash key="b" />],
];

function Comparison() {
  return (
    <section id="comparatif" className="border-t border-border-soft">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-brand-brass">07</span>
          <Eyebrow>Comparatif</Eyebrow>
        </div>
        <Reveal>
          <h2 className="mt-4 max-w-[18ch] text-balance font-display text-[34px] leading-[1.1] text-ink sm:text-[42px]">
            Le même résultat juridique, sans les rendez-vous.
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead className="sticky top-14 z-20 bg-page">
                <tr className="border-y border-border-soft text-left">
                  <th className="w-[46%] py-3 pr-4 font-mono text-xs font-normal uppercase tracking-[0.14em] text-ink-muted">
                    Critère
                  </th>
                  <th className="border-t-2 border-brand-brass bg-nav-active px-4 py-3 font-display text-base text-ink">
                    LegalFlow
                  </th>
                  <th className="py-3 pl-4 font-mono text-xs font-normal uppercase tracking-[0.14em] text-ink-muted">
                    Cabinet traditionnel
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([label, ours, theirs], i) => (
                  <tr
                    key={label}
                    className={
                      "border-b border-border-soft " +
                      (i % 2 === 1 ? "bg-nav-active/40" : "")
                    }
                  >
                    <th
                      scope="row"
                      className="py-3.5 pr-4 text-left font-normal text-ink"
                    >
                      {label}
                    </th>
                    <td className="bg-nav-active px-4 py-3.5 text-ink">{ours}</td>
                    <td className="py-3.5 pl-4 text-ink-muted">{theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------ 08 Témoignages --------------------- */

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
      n="08"
      eyebrow="Témoignages"
      title="Des entrepreneurs comme vous."
    >
      <div className="space-y-12">
        {TESTIMONIALS.map(([quote, initials, name, role]) => (
          <figure key={name} className="border-t-2 border-brand-brass pt-6">
            <blockquote className="max-w-[56ch] font-display text-lg font-normal leading-[1.45] text-ink">
              « {quote} »
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-center gap-3">
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
              <span className="ml-auto font-mono text-xs text-ink-muted">
                Avis vérifié
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- 09 FAQ ------------------------- */

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
      n="09"
      eyebrow="Questions fréquentes"
      title="Ce que les entrepreneurs nous demandent."
    >
      <div className="border-t border-border-soft">
        {FAQ.map(([q, a]) => (
          <Disclosure key={q} summary={q}>
            {a}
          </Disclosure>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------- CTA final --------------------- */

function FinalCta() {
  return (
    <section className="bg-brand-slate">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-surface/70">
          Parlons de votre projet
        </p>
        <h2 className="mt-5 max-w-[16ch] text-balance font-display text-[34px] leading-[1.08] text-surface sm:text-[46px]">
          Une question avant de vous lancer ?
        </h2>
        <p className="mt-5 max-w-[54ch] text-base text-surface/80">
          Un juriste vous rappelle et vérifie la faisabilité de votre projet,{" "}
          <span className="text-brand-brass">sans engagement</span>.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/creer"
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

/* ------------------------------ Page ----------------------- */

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <WhyUs />
      <HowItWorks />
      <StatBand
        items={[
          ["10 j", "Délai moyen ouvré"],
          ["1 000+", "Dossiers accompagnés"],
          ["0", "Déplacement requis"],
        ]}
      />
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
