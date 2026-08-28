"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { CompanyForm } from "@/components/app/company-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { createDocument, updateCompany } from "@/lib/actions";
import {
  COMPANY_STATUS,
  COMPANY_STATUS_FLOW,
  DOC_TYPE_LABEL,
  DOC_TYPE_OPTIONS,
  DOCUMENT_STATUS,
  LEGAL_FORM_LABEL,
  formatDate,
} from "@/lib/format";
import type { Company, DocType, LegalDocument } from "@/lib/types";

export function CompanyDetail({
  company,
  documents,
  canManageWorkflow,
}: {
  company: Company;
  documents: LegalDocument[];
  canManageWorkflow: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [statusPending, setStatusPending] = React.useState(false);
  const [showAddDoc, setShowAddDoc] = React.useState(false);
  const [newDocType, setNewDocType] = React.useState<DocType>("statuts");
  const [addPending, setAddPending] = React.useState(false);
  const [addError, setAddError] = React.useState<string | null>(null);

  async function handleInfoSubmit(values: Parameters<typeof updateCompany>[1]) {
    const result = await updateCompany(company.id, values);
    if (result.ok) {
      toast("Informations enregistrées.", "success");
      router.refresh();
    }
    return result;
  }

  async function handleStatusChange(status: string) {
    setStatusPending(true);
    const result = await updateCompany(company.id, {
      status: status as Company["status"],
    });
    setStatusPending(false);
    if (result.ok) {
      toast(`Statut : ${COMPANY_STATUS[result.data.status].label}.`, "success");
      router.refresh();
    } else {
      toast(result.error, "error");
    }
  }

  async function handleAddDoc(event: React.FormEvent) {
    event.preventDefault();
    setAddError(null);
    setAddPending(true);
    const result = await createDocument({
      company: company.id,
      doc_type: newDocType,
    });
    setAddPending(false);
    if (result.ok) {
      setShowAddDoc(false);
      setNewDocType("statuts");
      toast("Document ajouté.", "success");
      router.refresh();
    } else {
      setAddError(result.error);
    }
  }

  return (
    <>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      <div className="min-w-0 space-y-10">
        <section>
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            Informations
          </h2>
          <div className="max-w-2xl rounded-card border border-border-soft bg-surface p-5">
            <div>
              <CompanyForm
                initial={{
                  name: company.name,
                  legal_form: company.legal_form,
                  share_capital: String(Number(company.share_capital)),
                }}
                submitLabel="Enregistrer"
                onSubmit={handleInfoSubmit}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
              Documents du dossier
            </h2>
            <Button size="sm" onClick={() => setShowAddDoc(true)}>
              Ajouter un document
            </Button>
          </div>

          {documents.length === 0 ? (
            <p className="rounded-card border border-border-soft bg-surface p-5 text-sm text-ink-muted">
              Aucun document rattaché à ce dossier.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-card border border-border-soft bg-surface">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-left text-xs text-ink-muted">
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Statut</th>
                    <th className="px-4 py-2.5 font-medium">Créé le</th>
                    <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-border-soft last:border-b-0 hover:bg-page"
                    >
                      <td className="px-4 py-2.5 font-medium text-ink">
                        {DOC_TYPE_LABEL[d.doc_type]}
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
        </section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-8 lg:h-max lg:self-start">
        <div className="rounded-card border border-border-soft bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            Statut du dossier
          </p>
          <div className="mt-3">
            {canManageWorkflow ? (
              <Select
                aria-label="Statut du dossier"
                value={company.status}
                disabled={statusPending}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                {COMPANY_STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {COMPANY_STATUS[s].label}
                  </option>
                ))}
              </Select>
            ) : (
              <StatusBadge
                label={COMPANY_STATUS[company.status].label}
                tone={COMPANY_STATUS[company.status].tone}
              />
            )}
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {canManageWorkflow
              ? "brouillon → en revue → déposé → immatriculé"
              : "Seul un juriste peut faire évoluer le statut."}
          </p>
        </div>

        <div className="rounded-card border border-border-soft bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            Détails
          </p>
          <dl className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Forme</dt>
              <dd className="text-ink">
                {LEGAL_FORM_LABEL[company.legal_form]}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Propriétaire</dt>
              <dd className="truncate text-right font-mono text-ink">
                {company.owner_email}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Créée le</dt>
              <dd className="font-mono text-ink">
                {formatDate(company.created_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Mise à jour</dt>
              <dd className="font-mono text-ink">
                {formatDate(company.updated_at)}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>

      <Modal
        open={showAddDoc}
        onClose={() => setShowAddDoc(false)}
        title="Ajouter un document"
        description="Le document est créé au statut « brouillon »."
      >
        <form onSubmit={handleAddDoc} className="space-y-4">
          {addError ? (
            <p
              role="alert"
              className="rounded-control border border-danger/35 bg-danger/[0.06] px-3 py-2 text-xs font-medium text-danger"
            >
              {addError}
            </p>
          ) : null}
          <Field id="doc-type" label="Type de document">
            <Select
              id="doc-type"
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value as DocType)}
            >
              {DOC_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddDoc(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addPending}>
              {addPending ? "Ajout…" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
