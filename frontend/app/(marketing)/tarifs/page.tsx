import type { Metadata } from "next";
import Link from "next/link";

import { Check, Dash, Eyebrow, PageIntro } from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tarifs — LegalFlow",
  description:
    "Trois forfaits clairs pour créer et domicilier votre société. Honoraires, frais de greffe et d’enregistrement inclus.",
};

const PLANS = [
  {
    key: "creation",
    name: "Création",
    price: "3 900 DH",
    note: "Frais de greffe et d’enregistrement inclus",
    highlight: false,
  },
  {
    key: "creation_domic",
    name: "Création + domiciliation",
    price: "5 400 DH",
    note: "1re année de domiciliation incluse",
    highlight: true,
  },
  {
    key: "surmesure",
    name: "Sur-mesure",
    price: "Sur devis",
    note: "Holdings, associés multiples, pactes",
    highlight: false,
  },
] as const;

type Cell = boolean | string;

const ROWS: { label: string; values: [Cell, Cell, Cell] }[] = [
  { label: "Certificat négatif", values: [true, true, true] },
  { label: "Rédaction des statuts par un juriste", values: [true, true, true] },
  { label: "Dépôt au greffe et immatriculation (RC)", values: [true, true, true] },
  { label: "Identifiant fiscal, ICE et affiliation CNSS", values: [true, true, true] },
  { label: "Signature électronique", values: [true, true, true] },
  { label: "Garantie anti-rejet", values: [true, true, true] },
  { label: "Domiciliation (1re année)", values: [false, true, "Option"] },
  { label: "Gestion du courrier scanné", values: [false, true, "Option"] },
  { label: "Pacte d’associés / clauses spécifiques", values: [false, false, true] },
  { label: "Juriste dédié au dossier", values: ["Standard", "Standard", "Prioritaire"] },
];

function renderCell(value: Cell, highlight: boolean) {
  if (value === true)
    return <Check className="mx-auto" tone={highlight ? "brass" : "success"} />;
  if (value === false) return <Dash />;
  return <span className="text-xs text-ink">{value}</span>;
}

export default function TarifsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tarifs"
        title="Un prix annoncé à l’avance, sans supplément en cours de dossier."
        intro="Les honoraires du juriste, les frais de greffe et d’enregistrement sont compris. Vous ne payez rien de plus jusqu’à l’immatriculation."
      />

      <section className="border-t border-border-soft">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pb-20 lg:pb-24 lg:pt-16">
          <Eyebrow>Forfaits</Eyebrow>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-[34%] py-4 pr-4 text-left align-bottom font-mono text-xs font-normal uppercase tracking-[0.14em] text-ink-muted">
                    Prestations
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.key}
                      className={`px-4 py-4 text-left align-bottom ${
                        p.highlight
                          ? "border-t-2 border-brand-brass bg-nav-active"
                          : "border-t border-border-soft"
                      }`}
                    >
                      <span className="block font-display text-lg text-ink">
                        {p.name}
                      </span>
                      <span className="mt-1 block font-mono text-sm text-ink">
                        {p.price}
                      </span>
                      <span className="mt-1 block max-w-[22ch] text-xs text-ink-muted">
                        {p.note}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      "border-b border-border-soft " +
                      (i % 2 === 1 ? "bg-nav-active/40" : "")
                    }
                  >
                    <th
                      scope="row"
                      className="py-3.5 pr-4 text-left font-normal text-ink"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, j) => (
                      <td
                        key={PLANS[j].key}
                        className={`px-4 py-3.5 text-center ${
                          PLANS[j].highlight ? "bg-nav-active" : ""
                        }`}
                      >
                        {renderCell(value, PLANS[j].highlight)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-5 pr-4" />
                  {PLANS.map((p) => (
                    <td
                      key={p.key}
                      className={`px-4 py-5 ${p.highlight ? "bg-nav-active" : ""}`}
                    >
                      <Link
                        href={p.key === "surmesure" ? "/contact" : "/creer"}
                        className={buttonVariants({
                          variant: p.highlight ? "primary" : "secondary",
                          size: "sm",
                        })}
                      >
                        {p.key === "surmesure"
                          ? "Demander un devis"
                          : "Créer mon entreprise"}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-[68ch] text-xs text-ink-muted">
            Montants indicatifs — projet de démonstration. Les taxes et frais
            administratifs réels dépendent de la forme juridique et du capital.
          </p>
        </div>
      </section>
    </>
  );
}
