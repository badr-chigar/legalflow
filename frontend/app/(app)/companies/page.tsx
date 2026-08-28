import type { Metadata } from "next";

import { CompaniesTable } from "@/components/app/companies-table";
import { PageHeader } from "@/components/app/page-header";
import { apiGetAll } from "@/lib/api";
import type { Company } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sociétés — LegalFlow",
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const [{ new: openNew }, companies] = await Promise.all([
    searchParams,
    apiGetAll<Company>("/api/companies/"),
  ]);

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Sociétés"
        description="Tous les dossiers auxquels vous avez accès."
      />
      <CompaniesTable companies={companies} openNew={openNew === "1"} />
    </div>
  );
}
