import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiGetAll } from "@/lib/api";
import { DOC_TYPE_LABEL, DOCUMENT_STATUS, formatDate } from "@/lib/format";
import type { Company, LegalDocument } from "@/lib/types";

export const metadata: Metadata = {
  title: "Documents — LegalFlow",
};

export default async function DocumentsPage() {
  const [documents, companies] = await Promise.all([
    apiGetAll<LegalDocument>("/api/documents/"),
    apiGetAll<Company>("/api/companies/"),
  ]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));
  const rows = [...documents].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Documents"
        description="Toutes les pièces légales des dossiers auxquels vous avez accès."
      />

      {rows.length === 0 ? (
        <p className="rounded-card border border-border-soft bg-surface p-5 text-sm text-ink-muted">
          Aucun document. Ajoutez-en un depuis une fiche société.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border-soft bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs text-ink-muted">
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Société</th>
                <th className="px-4 py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Créé le</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-border-soft last:border-b-0 hover:bg-page"
                >
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {DOC_TYPE_LABEL[d.doc_type]}
                  </td>
                  <td className="px-4 py-2.5 text-ink-muted">
                    <Link
                      href={`/companies/${d.company}`}
                      className="hover:text-ink hover:underline"
                    >
                      {companyName.get(d.company) ?? `#${d.company}`}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge
                      label={DOCUMENT_STATUS[d.status].label}
                      tone={DOCUMENT_STATUS[d.status].tone}
                    />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                    {formatDate(d.created_at)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      href={`/documents/${d.id}`}
                      className="text-xs font-medium text-brand-slate hover:underline"
                    >
                      Ouvrir
                    </Link>
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
