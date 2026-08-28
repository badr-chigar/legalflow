import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Disclosure } from "@/components/marketing/disclosure";
import {
  AccentTitle,
  Check,
  Eyebrow,
  FiletList,
  Section,
  SHELL,
  StatBand,
} from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LegalFlow — Créez votre société au Maroc en ligne",
  description:
    "Certificat négatif, statuts, immatriculation au registre du commerce, identifiants fiscaux et CNSS : LegalFlow prend en charge l’ensemble du dossier de création, 100 % en ligne, avec un juriste dédié.",
};

/* =========================================================================
 * Vitrine LegalFlow — marché marocain. Copy fondée sur la procédure réelle
 * de création (OMPIC, DGI, CRI, RC, IF, ICE, CNSS). Projet de démonstration.
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
  // Dénomination / registre OMPIC
  <LineIcon key="d">
    <path d="M5 12h9l3 3h18v20H5z" />
    <path d="M5 21h30" />
  </LineIcon>,
  // Juriste / rédaction
  <LineIcon key="j">
    <circle cx="20" cy="14" r="5" />
    <path d="M9 34c0-6 5-11 11-11s11 5 11 11" />
  </LineIcon>,
  // Guichet unique / dépôt
  <LineIcon key="s">
    <path d="M6 31h28" />
    <path d="M10 31V15l10-6 10 6v16" />
    <path d="M16 31v-8h8v8" />
  </LineIcon>,
  // Remise / tampon RC
  <LineIcon key="t">
    <path d="M16 8h8v6l3 7H13l3-7z" />
    <path d="M9 30h22" />
    <path d="M14 25h12v5H14z" />
  </LineIcon>,
];

/* --------------------------------- 01 · Hero -------------------------------- */

const DELIVERABLES = [
  "Certificat négatif",
  "Statuts enregistrés",
  "Inscription au RC",
  "IF & ICE",
  "Affiliation CNSS",
];

const DOSSIER_STEPS = [
  "Brouillon",
  "En revue",
  "Déposé au greffe",
  "Immatriculée",
];
const DOSSIER_CURRENT = 1; // index de l'étape en cours

function Hero() {
  return (
    <section className="border-b border-border-soft bg-nav-active">
      <div className={cn(SHELL, "pb-10 pt-16 lg:pb-12 lg:pt-20")}>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-brand-brass">01</span>
          <Eyebrow>Accompagnement juridique</Eyebrow>
        </div>

        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_27rem] xl:gap-20">
          <div>
            <h1 className="max-w-[16ch] text-balance font-display text-[clamp(2.75rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
              Créez votre société{" "}
              <span className="text-brand-slate">au Maroc</span> sans passer par
              le guichet.
            </h1>
            <p className="mt-6 max-w-[58ch] text-base text-ink-muted sm:text-lg">
              Certificat négatif, statuts, immatriculation au registre du
              commerce, identifiants fiscaux et CNSS : LegalFlow prend en charge
              l’ensemble du dossier, 100 % en ligne, avec un juriste dédié.
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
              Société livrée en 10 jours ouvrés
              <span className="mx-2 text-brand-brass">·</span>
              Satisfait ou remboursé
            </p>
          </div>

          {/* Aperçu de dossier — seule ombre portée autorisée avec les toasts. */}
          <div className="rounded-card border border-border-soft bg-surface p-6 shadow-overlay">
            <div className="flex items-baseline justify-between border-b border-border-soft pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Dossier
              </span>
              <span className="font-mono text-xs text-ink">
                Atlas Conseil · SARLAU
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center">
                {DOSSIER_STEPS.map((_, i) => (
                  <div key={i} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        i === DOSSIER_CURRENT
                          ? "bg-brand-slate ring-2 ring-brand-brass/50"
                          : i < DOSSIER_CURRENT
                            ? "bg-brand-slate"
                            : "border border-border-soft bg-surface",
                      )}
                    />
                    {i < DOSSIER_STEPS.length - 1 ? (
                      <span
                        className={
                          i < DOSSIER_CURRENT
                            ? "h-[3px] flex-1 rounded-full bg-brand-brass"
                            : "h-px flex-1 bg-border-soft"
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
                    className={cn(
                      "flex-1 text-center text-[10px] leading-[1.25] first:text-left last:text-right",
                      i === DOSSIER_CURRENT
                        ? "font-medium text-brand-slate"
                        : i < DOSSIER_CURRENT
                          ? "text-ink"
                          : "text-ink-muted",
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <dl className="mt-5 space-y-2 border-t border-border-soft pt-4 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Prochaine étape</dt>
                <dd className="text-right font-medium text-ink">
                  Signature des statuts
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Délai estimé</dt>
                <dd className="text-right font-mono text-ink">8 jours ouvrés</dd>
              </div>
            </dl>

            <ul className="mt-4 border-t border-border-soft pt-4">
              {DELIVERABLES.map((item) => (
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

/* ----------------------------- Bande confiance ---------------------- */

const TRUST = [
  "Statuts rédigés par des juristes",
  "Signature électronique",
  "Forfait tout inclus",
  "Suivi en temps réel",
  "Garantie anti-rejet",
];

function TrustBar() {
  return (
    <section className="bg-surface">
      <div className={cn(SHELL, "flex flex-wrap items-center gap-x-3 gap-y-2 py-4")}>
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

/* --------------------------------- 02 · Services ----------------------- */

function Services() {
  return (
    <Section
      id="services"
      n="02"
      bg="page"
      tight
      eyebrow="Services"
      title="Trois services, un seul interlocuteur."
      accent="un seul interlocuteur"
      intro="Le même juriste vous suit de la constitution de la société jusqu’à ses obligations courantes."
    >
      <div className="border-t border-border-soft">
        <Disclosure summary="Création d’entreprise" defaultOpen>
          Nous constituons votre société de la réservation du nom jusqu’à
          l’immatriculation. Vous choisissez la forme (SARL, SARLAU, SAS, SASU),
          vous renseignez les associés et la gérance ; un juriste rédige les
          statuts, les fait enregistrer à la DGI et dépose le dossier au guichet
          unique du CRI. Vous recevez le certificat négatif, les statuts
          enregistrés, le modèle J du registre du commerce, l’IF, l’ICE et
          l’attestation d’affiliation CNSS.
        </Disclosure>
        <Disclosure summary="Domiciliation">
          Une adresse professionnelle à Casablanca, sans louer de local. Contrat
          de domiciliation écrit et enregistré, opposable au greffe, à la DGI et
          à votre banque. Réception et numérisation du courrier, notification le
          jour même.
        </Disclosure>
        <Disclosure summary="Secrétariat juridique">
          Après la création : assemblées générales, procès-verbaux, mise à jour
          des statuts, dépôt des comptes annuels, tenue du registre des
          bénéficiaires effectifs. Un juriste suit vos obligations et vous alerte
          avant chaque échéance.
        </Disclosure>
      </div>
    </Section>
  );
}

/* ------------------------------- 03 · Pourquoi ------------------------- */

const PILLARS = [
  [
    "Un seul interlocuteur",
    "Un juriste dédié suit votre dossier de la réservation du nom jusqu’à la remise du registre du commerce.",
  ],
  [
    "Documents conformes",
    "Les actes sont rédigés selon la loi 5-96 et enregistrés à la DGI dans le délai de 30 jours.",
  ],
  [
    "Tarif tout inclus",
    "Un forfait annoncé à l’avance : honoraires, frais d’enregistrement et de greffe compris. Aucun supplément en cours de dossier.",
  ],
  [
    "Garantie anti-rejet",
    "Si une administration refuse le dossier pour une erreur de notre part, nous le corrigeons ou nous vous remboursons.",
  ],
] as const;

function WhyUs() {
  return (
    <Section
      id="pourquoi"
      n="03"
      bg="surface"
      eyebrow="Pourquoi LegalFlow"
      title="Un dossier que vous comprenez de bout en bout."
      accent="de bout en bout"
    >
      <FiletList items={PILLARS} />
    </Section>
  );
}

/* --------------------------- 04 · Comment ça marche ------------------- */

const STEPS = [
  [
    "Vérification du nom",
    "Nous déposons la demande de certificat négatif auprès de l’OMPIC et réservons votre dénomination pour 90 jours.",
  ],
  [
    "Rédaction et enregistrement des actes",
    "Un juriste rédige les statuts et le procès-verbal de gérance, les fait signer électroniquement, puis les enregistre à la Direction Générale des Impôts.",
  ],
  [
    "Dépôt au guichet unique",
    "Le dossier complet est déposé au Centre Régional d’Investissement : immatriculation au registre du commerce, identifiants fiscaux et affiliation CNSS en une seule démarche.",
  ],
  [
    "Remise du dossier",
    "Vous recevez le modèle J du registre du commerce, l’IF, l’ICE et l’attestation CNSS. Votre société peut ouvrir son compte bancaire définitif.",
  ],
] as const;

function HowItWorks() {
  return (
    <Section
      id="etapes"
      n="04"
      bg="page"
      eyebrow="Comment ça marche"
      title="Du nom réservé au registre du commerce."
      accent="registre du commerce"
    >
      <ol className="relative border-t border-border-soft">
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
                <p className="mt-1.5 text-[15px] text-ink-muted">{desc}</p>
              </div>
              <span className="hidden shrink-0 sm:block">{STEP_ICONS[i]}</span>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------- 05 · Domiciliation ------------------- */

const DOMICILIATION = [
  [
    "Adresse opposable",
    "Reconnue par le greffe, la DGI et les banques.",
  ],
  [
    "Courrier géré",
    "Réception au nom de la société, numérisation et notification le jour même.",
  ],
  [
    "Contrat conforme",
    "Contrat de domiciliation écrit et enregistré, transmis sous un jour ouvré.",
  ],
] as const;

function Domiciliation() {
  return (
    <Section
      id="domiciliation"
      n="05"
      bg="surface"
      eyebrow="Domiciliation"
      title="Une adresse professionnelle, sans louer de local."
      accent="adresse professionnelle"
    >
      <FiletList items={DOMICILIATION} />
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

/* --------------------- 06 · MRE & investisseurs --------------------- */

const MRE = [
  "Procédure entièrement à distance, sans venir au Maroc.",
  "Signature électronique des statuts.",
  "Juriste dédié joignable par e-mail, téléphone ou WhatsApp.",
  "Domiciliation professionnelle incluse en option.",
  "Suivi du dossier en temps réel.",
  "Dossier complet prêt pour l’ouverture du compte bancaire.",
];

function Mre() {
  return (
    <Section
      id="mre"
      n="06"
      bg="page"
      eyebrow="MRE & investisseurs"
      title="Constituez votre société depuis l’étranger."
      accent="depuis l’étranger"
    >
      <ul className="border-t border-border-soft">
        {MRE.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 border-b border-border-soft py-3.5 text-[15px] text-ink"
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

/* ----------------------- 07 · Accompagnement ---------------------- */

function Support() {
  return (
    <Section
      id="accompagnement"
      n="07"
      bg="surface"
      eyebrow="Accompagnement"
      title="Le même juriste, du premier appel au dépôt des comptes."
      accent="Le même juriste"
    >
      <FiletList
        items={[
          [
            "Joignable",
            "Un juriste dédié, aux heures ouvrées, par les canaux que vous utilisez : e-mail, téléphone ou WhatsApp.",
          ],
          [
            "Continu",
            "De la réservation du nom au dépôt des comptes annuels, le suivi ne change pas d’interlocuteur.",
          ],
        ]}
      />
      <div className="mt-8">
        <Link href="/contact" className={buttonVariants({ variant: "secondary" })}>
          Contacter l’équipe
        </Link>
      </div>
    </Section>
  );
}

/* --------------------------- 08 · Comparatif ---------------------- */

const COMPARISON: [string, string, string][] = [
  ["Démarches", "100 % en ligne", "rendez-vous et dépôts en personne"],
  [
    "Tarif",
    "forfait annoncé à l’avance",
    "devis variable, suppléments fréquents",
  ],
  [
    "Suivi",
    "statut du dossier en temps réel",
    "par téléphone, aux horaires du cabinet",
  ],
  ["Délai annoncé", "en jours ouvrés", "en semaines, sans engagement"],
  [
    "Enregistrement DGI",
    "dans le délai de 30 jours, garanti",
    "selon la charge du cabinet",
  ],
  ["Domiciliation", "incluse en option", "prestataire tiers à trouver"],
];

function Comparison() {
  return (
    <section id="comparatif" className="border-t border-border-soft bg-page">
      <div
        className={cn(
          SHELL,
          "grid gap-y-8 py-16 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-14 lg:py-20 xl:gap-20",
        )}
      >
        <div className="lg:sticky lg:top-24 lg:h-max lg:self-start">
          <div className="flex items-baseline gap-3 lg:block">
            <span className="font-mono text-sm text-brand-brass lg:mb-1 lg:block">
              08
            </span>
            <Eyebrow>Comparatif</Eyebrow>
          </div>
          <h2 className="mt-3 max-w-[16ch] text-balance font-display text-[clamp(2rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink lg:mt-4">
            <AccentTitle
              text="Le même résultat, sans les rendez-vous."
              accent="sans les rendez-vous"
            />
          </h2>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-[15px]">
            <thead className="sticky top-16 z-20 bg-page">
              <tr className="border-y border-border-soft text-left">
                <th className="w-[24%] py-3 pr-4 font-mono text-xs font-normal uppercase tracking-[0.14em] text-ink-muted">
                  Critère
                </th>
                <th className="border-t-2 border-brand-brass bg-nav-active px-4 py-3 font-display text-base text-ink">
                  LegalFlow
                </th>
                <th className="py-3 pl-4 font-mono text-xs font-normal uppercase tracking-[0.14em] text-ink-muted">
                  Fiduciaire classique
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
                  <td className="bg-nav-active px-4 py-3.5 font-medium text-ink">
                    {ours}
                  </td>
                  <td className="py-3.5 pl-4 text-ink-muted">{theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ 09 · Notre histoire (teaser) --------------------- */

function StoryTeaser() {
  return (
    <Section
      id="histoire"
      n="09"
      bg="surface"
      eyebrow="Notre histoire"
      title="Né d’un constat simple : personne ne comprenait sa facture."
      accent="personne ne comprenait sa facture"
    >
      <div className="border-t border-border-soft pt-6">
        <p className="text-[15px] text-ink-muted">
          LegalFlow a été lancé en 2023 par une juriste d’affaires et un
          développeur, après un constat partagé : au Maroc, créer une société
          reste opaque — devis flous, allers-retours au guichet, délais annoncés
          « en semaines ».
        </p>
        <p className="mt-3 text-[15px] text-ink-muted">
          Nous avons construit un service où l’on sait, dès le départ, ce que
          l’on paie, ce que l’on reçoit et quand.
        </p>
        <Link
          href="/a-propos"
          className="mt-6 inline-block text-sm font-medium text-brand-slate hover:underline"
        >
          Lire notre histoire →
        </Link>
      </div>
    </Section>
  );
}

/* ------------------------ 10 · Témoignages --------------------- */

const TESTIMONIALS = [
  [
    "J’ai renseigné les associés et la gérance un dimanche soir. Le certificat négatif de l’OMPIC est arrivé deux jours après, et le dépôt au CRI a suivi sans que j’aie à me déplacer.",
    "SB",
    "S. B.",
    "Agence de design, Casablanca",
  ],
  [
    "Le juriste a repris les statuts article par article avant l’enregistrement à la DGI. Aucun aller-retour avec le greffe, ce qui m’avait coûté un mois lors de ma première société.",
    "KT",
    "K. T.",
    "Import-export, Tanger",
  ],
  [
    "Je vis à l’étranger et je pensais devoir prendre l’avion. Tout s’est fait par signature électronique et visioconférence, domiciliation comprise. J’ai reçu le modèle J sans quitter Lyon.",
    "NE",
    "N. E.",
    "Conseil IT · MRE, Lyon",
  ],
];

function Testimonials() {
  return (
    <Section
      id="temoignages"
      n="10"
      bg="page"
      eyebrow="Témoignages"
      title="Des créateurs de société, au Maroc et ailleurs."
      accent="au Maroc et ailleurs"
    >
      <div className="space-y-12">
        {TESTIMONIALS.map(([quote, initials, name, role]) => (
          <figure key={name} className="border-t-2 border-brand-brass pt-6">
            <blockquote className="max-w-[58ch] font-display text-lg font-normal leading-[1.45] text-ink">
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
                Retour client · projet de démonstration
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------- 11 · FAQ ------------------------- */

const FAQ = [
  [
    "Quel est le délai réel ?",
    "Comptez 5 à 10 jours ouvrés entre la validation de votre dossier et l’obtention du registre du commerce, selon la réactivité de la banque pour l’attestation de blocage du capital et la charge du greffe.",
  ],
  [
    "Qu’est-ce que le forfait comprend ?",
    "Les honoraires du juriste, la rédaction et l’enregistrement des statuts à la DGI, les frais du certificat négatif, les frais de greffe et l’obtention des identifiants fiscaux et CNSS. La domiciliation est en option.",
  ],
  [
    "Quels documents vais-je recevoir ?",
    "Le certificat négatif, les statuts enregistrés, le procès-verbal de gérance, le modèle J du registre du commerce, l’attestation d’IF et d’ICE, et l’attestation d’affiliation CNSS.",
  ],
  [
    "Faut-il un capital minimum ?",
    "Non. Depuis la loi 24-10, aucun capital minimum n’est exigé pour une SARL ou une SARLAU. Un dépôt en banque avec attestation de blocage reste requis lorsque le capital atteint 100 000 DH.",
  ],
  [
    "La domiciliation est-elle obligatoire ?",
    "Non. Vous pouvez domicilier la société à une adresse dont vous disposez (bail enregistré au nom de la société) ou recourir à un domiciliataire agréé.",
  ],
  [
    "Que couvre la garantie satisfait ou remboursé ?",
    "Si le dossier est rejeté par une administration pour une erreur de rédaction de notre part, nous le corrigeons sans frais ; si nous ne pouvons pas aboutir, nous vous remboursons les honoraires.",
  ],
];

function Faq() {
  return (
    <Section
      id="faq"
      n="11"
      bg="surface"
      eyebrow="Questions fréquentes"
      title="Ce que les créateurs de société nous demandent."
      accent="créateurs de société"
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

/* ------------------------- 12 · CTA final --------------------- */

function FinalCta() {
  return (
    <section className="bg-brand-slate">
      <div
        className={cn(
          SHELL,
          "grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:py-20",
        )}
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-page/70">
            Parlons de votre projet
          </p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-[clamp(2rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-page">
            Une question avant de vous lancer ?
          </h2>
          <p className="mt-5 max-w-[54ch] text-base text-page/80">
            Un juriste vérifie la faisabilité de votre projet,{" "}
            <span className="text-brand-brass">sans engagement</span>.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href="/creer"
            className="inline-flex h-11 items-center justify-center rounded-control bg-page px-5 text-base font-medium text-brand-slate transition-colors hover:bg-surface"
          >
            Créer mon entreprise
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-control border border-page/30 px-5 text-base font-medium text-page transition-colors hover:bg-page/10"
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
      <StoryTeaser />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
