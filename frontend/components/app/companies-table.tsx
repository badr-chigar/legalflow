"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { CompanyForm } from "@/components/app/company-form";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { createCompany, deleteCompany } from "@/lib/actions";
import {
  COMPANY_STATUS,
  LEGAL_FORM_LABEL,
  formatCapital,
  formatDate,
} from "@/lib/format";
import type { Company } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "name" | "legal_form" | "share_capital" | "status" | "created_at";

const HEADERS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Raison sociale" },
  { key: "legal_form", label: "Forme" },
  { key: "share_capital", label: "Capital" },
  { key: "status", label: "Statut" },
  { key: "created_at", label: "Créée le" },
];

export function CompaniesTable({
  companies,
  openNew = false,
}: {
  companies: Company[];
  openNew?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({
    key: "created_at",
    dir: -1,
  });
  const [showNew, setShowNew] = React.useState(openNew);
  const [toDelete, setToDelete] = React.useState<Company | null>(null);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? companies.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            LEGAL_FORM_LABEL[c.legal_form].toLowerCase().includes(q) ||
            COMPANY_STATUS[c.status].label.toLowerCase().includes(q),
        )
      : companies;

    const sorted = [...filtered].sort((a, b) => {
      let cmp: number;
      if (sort.key === "share_capital") {
        cmp = Number(a.share_capital) - Number(b.share_capital);
      } else if (sort.key === "status") {
        cmp = COMPANY_STATUS[a.status].label.localeCompare(
          COMPANY_STATUS[b.status].label,
        );
      } else {
        cmp = String(a[sort.key]).localeCompare(String(b[sort.key]), "fr");
      }
      return cmp * sort.dir;
    });
    return sorted;
  }, [companies, query, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 },
    );
  }

  async function handleCreate(values: Parameters<typeof createCompany>[0]) {
    const result = await createCompany(values);
    if (result.ok) {
      setShowNew(false);
      toast("Société créée.", "success");
      router.push(`/companies/${result.data.id}`);
    }
    return result;
  }

  async function handleDelete() {
    if (!toDelete) return;
    const result = await deleteCompany(toDelete.id);
    setToDelete(null);
    if (result.ok) {
      toast("Société supprimée.", "success");
      router.refresh();
    } else {
      toast(result.error, "error");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input
          type="search"
          placeholder="Rechercher une société…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button size="sm" onClick={() => setShowNew(true)}>
          Nouvelle société
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-border-soft bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-soft text-left text-xs text-ink-muted">
              {HEADERS.map((h) => (
                <th
                  key={h.key}
                  className={cn(
                    "px-4 py-2.5 font-medium",
                    h.key === "share_capital" && "text-right",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(h.key)}
                    className="inline-flex items-center gap-1 hover:text-ink"
                  >
                    {h.label}
                    <span aria-hidden className="text-[10px] text-ink-muted">
                      {sort.key === h.key ? (sort.dir === 1 ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                </th>
              ))}
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-ink-muted"
                >
                  {companies.length === 0
                    ? "Aucune société. Créez le premier dossier."
                    : "Aucun résultat pour cette recherche."}
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border-soft last:border-b-0 hover:bg-page"
                >
                  <td className="px-4 py-2.5 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-2.5 text-ink-muted">
                    {LEGAL_FORM_LABEL[c.legal_form]}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs text-ink-muted">
                    {formatCapital(c.share_capital)}
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
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/companies/${c.id}`)}
                        className="text-xs font-medium text-brand-slate hover:underline"
                      >
                        Ouvrir
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(c)}
                        className="text-xs font-medium text-danger hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className={cn("mt-3 text-xs text-ink-muted", rows.length === 0 && "hidden")}>
        {rows.length} société{rows.length > 1 ? "s" : ""}
        {query ? ` · filtré sur « ${query} »` : ""}
      </p>

      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Nouvelle société"
        description="Le dossier sera créé au statut « brouillon »."
      >
        <CompanyForm
          submitLabel="Créer le dossier"
          onSubmit={handleCreate}
          onCancel={() => setShowNew(false)}
        />
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer cette société ?"
        message={
          toDelete
            ? `« ${toDelete.name} » et ses documents seront définitivement supprimés.`
            : ""
        }
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
