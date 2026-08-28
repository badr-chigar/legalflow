import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyDetail } from "@/components/app/company-detail";
import { ApiError, apiGet, apiGetAll, getCurrentUser } from "@/lib/api";
import { LEGAL_FORM_LABEL, canManageWorkflow } from "@/lib/format";
import type { Company, LegalDocument } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const company = await apiGet<Company>(`/api/companies/${id}/`);
    return { title: `${company.name} — LegalFlow` };
  } catch {
    return { title: "Société — LegalFlow" };
  }
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let company: Company;
  try {
    company = await apiGet<Company>(`/api/companies/${id}/`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      notFound();
    }
    throw error;
  }

  const [allDocs, user] = await Promise.all([
    apiGetAll<LegalDocument>("/api/documents/"),
    getCurrentUser(),
  ]);
  const documents = allDocs
    .filter((d) => d.company === company.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div>
      <nav className="mb-4 text-xs text-ink-muted">
        <Link href="/companies" className="hover:text-ink hover:underline">
          Sociétés
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{company.name}</span>
      </nav>

      <div className="mb-6 border-b border-border-soft pb-4">
        <h1 className="font-display text-xl text-ink">{company.name}</h1>
        <p className="mt-1 font-mono text-xs text-ink-muted">
          {LEGAL_FORM_LABEL[company.legal_form]} · dossier #{company.id}
        </p>
      </div>

      <CompanyDetail
        company={company}
        documents={documents}
        canManageWorkflow={canManageWorkflow(user.role)}
      />
    </div>
  );
}
