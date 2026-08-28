import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/app/page-header";
import { SignaturePanel } from "@/components/app/signature-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { ApiError, apiGet } from "@/lib/api";
import { DOC_TYPE_LABEL, DOCUMENT_STATUS, formatDateTime } from "@/lib/format";
import type { Company, LegalDocument } from "@/lib/types";

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
    <div className="max-w-3xl">
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

      <dl className="mb-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-card border border-border-soft bg-surface p-5 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-ink-muted">Référence</dt>
          <dd className="mt-0.5 font-mono text-ink">#{doc.id}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Type</dt>
          <dd className="mt-0.5 text-ink">{DOC_TYPE_LABEL[doc.doc_type]}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Créé le</dt>
          <dd className="mt-0.5 font-mono text-ink">
            {formatDateTime(doc.created_at)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Fichier</dt>
          <dd className="mt-0.5 text-ink">
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
          </dd>
        </div>
      </dl>

      <SignaturePanel
        documentId={doc.id}
        status={doc.status}
        signedAt={null}
      />
    </div>
  );
}
