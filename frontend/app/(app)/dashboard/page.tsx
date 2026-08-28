import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiGetAll } from "@/lib/api";
import { COMPANY_STATUS, LEGAL_FORM_LABEL, formatDate } from "@/lib/format";
import type { Company, LegalDocument } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tableau de bord — LegalFlow",
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-border-soft bg-surface p-5">
      <p className="font-display text-[32px] leading-none text-ink">{value}</p>
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const [companies, documents] = await Promise.all([
    apiGetAll<Company>("/api/companies/"),
    apiGetAll<LegalDocument>("/api/documents/"),
  ]);

  const pending = documents.filter((d) => d.status !== "signe").length;
  const signed = documents.filter((d) => d.status === "signe").length;
  const recent = [...companies]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Tableau de bord"
        actions={
          <Link href="/companies?new=1" className={buttonVariants({ size: "sm" })}>
            Nouvelle société
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Sociétés" value={companies.length} />
        <Stat label="Documents à signer" value={pending} />
        <Stat label="Documents signés" value={signed} />
      </div>

      <h2 className="mb-3 mt-10 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
        5 dernières sociétés
      </h2>

      {recent.length === 0 ? (
        <p className="rounded-card border border-border-soft bg-surface p-5 text-sm text-ink-muted">
          Aucune société pour l’instant.{" "}
          <Link href="/creer" className="text-brand-slate underline underline-offset-4">
            Créer un premier dossier
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border-soft bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-ink-muted">
                <th className="px-4 py-2.5 font-medium">Raison sociale</th>
                <th className="px-4 py-2.5 font-medium">Forme</th>
                <th className="px-4 py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Créée le</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border-soft last:border-b-0 hover:bg-page"
                >
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/companies/${c.id}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-ink-muted">
                    {LEGAL_FORM_LABEL[c.legal_form]}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      label={COMPANY_STATUS[c.status].label}
                      tone={COMPANY_STATUS[c.status].tone}
                    />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                    {formatDate(c.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
