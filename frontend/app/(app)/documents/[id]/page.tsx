import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/app/page-header";
import { SignaturePanel } from "@/components/app/signature-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ApiError, apiGet } from "@/lib/api";
import { DOC_TYPE_LABEL, DOCUMENT_STATUS, formatDateTime } from "@/lib/format";
import type { Company, LegalDocument } from "@/lib/types";

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border-soft py-2.5 last:border-b-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const doc = await apiGet<LegalDocument>(`/api/documents/${id}/`);
    return { title: `${DOC_TYPE_LABEL[doc.doc_type]} — LegalFlow` };
  } catch {
    return { title: "Document — LegalFlow" };
  }
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let doc: LegalDocument;
  try {
    doc = await apiGet<LegalDocument>(`/api/documents/${id}/`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      notFound();
    }
    throw error;
  }

  const company = await apiGet<Company>(`/api/companies/${doc.company}/`).catch(
    () => null,
  );

  const meta = DOCUMENT_STATUS[doc.status];

  return (
    <div>
      <nav className="mb-4 text-xs text-ink-muted">
        <Link href="/documents" className="hover:text-ink hover:underline">
          Documents
        </Link>
        <span className="mx-1.5">/</span>
        {company ? (
          <>
            <Link
              href={`/companies/${company.id}`}
              className="hover:text-ink hover:underline"
            >
              {company.name}
            </Link>
            <span className="mx-1.5">/</span>
          </>
        ) : null}
        <span className="text-ink">{DOC_TYPE_LABEL[doc.doc_type]}</span>
      </nav>

      <PageHeader
        title={DOC_TYPE_LABEL[doc.doc_type]}
        description={company ? `Dossier ${company.name}` : undefined}
        actions={<StatusBadge label={meta.label} tone={meta.tone} />}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,40rem)_28rem] lg:gap-10">
        <div className="min-w-0">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            Détails du document
          </h2>
          <dl className="rounded-card border border-border-soft bg-surface p-5 text-sm">
            <MetaRow label="Référence">
              <span className="font-mono">#{doc.id}</span>
            </MetaRow>
            <MetaRow label="Type">{DOC_TYPE_LABEL[doc.doc_type]}</MetaRow>
            <MetaRow label="Société">
              {company ? (
                <Link
                  href={`/companies/${company.id}`}
                  className="text-brand-slate hover:underline"
                >
                  {company.name}
                </Link>
              ) : (
                "—"
              )}
            </MetaRow>
            <MetaRow label="Créé le">
              <span className="font-mono">{formatDateTime(doc.created_at)}</span>
            </MetaRow>
            <MetaRow label="Mis à jour">
              <span className="font-mono">{formatDateTime(doc.updated_at)}</span>
            </MetaRow>
            <MetaRow label="Fichier">
              {doc.file ? (
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-slate underline underline-offset-4"
                >
                  Télécharger
                </a>
              ) : (
                <span className="text-ink-muted">Aucun</span>
              )}
            </MetaRow>
          </dl>
        </div>

        <div>
          <SignaturePanel
            documentId={doc.id}
            status={doc.status}
            signedAt={null}
          />
        </div>
      </div>
    </div>
  );
}
