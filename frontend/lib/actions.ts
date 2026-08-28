"use server";

import { revalidatePath } from "next/cache";

import { ApiError, apiDelete, apiPatch, apiPost } from "@/lib/api";
import type {
  ActionResult,
  Company,
  CompanyStatus,
  DocType,
  LegalDocument,
  LegalForm,
  SignatureRequestCreated,
  VerifyResult,
} from "@/lib/types";

function fail(error: unknown): { ok: false; error: string } {
  if (error instanceof ApiError) return { ok: false, error: error.detail };
  return { ok: false, error: "Le service est momentanément indisponible." };
}

function revalidateCompanies(id?: number) {
  revalidatePath("/dashboard");
  revalidatePath("/companies");
  if (id) revalidatePath(`/companies/${id}`);
}

/* ------------------------------- Sociétés ------------------------------ */

export async function createCompany(input: {
  name: string;
  legal_form: LegalForm;
  share_capital: string;
}): Promise<ActionResult<Company>> {
  try {
    const company = await apiPost<Company>("/api/companies/", {
      name: input.name.trim(),
      legal_form: input.legal_form,
      share_capital: input.share_capital || "0",
    });
    revalidateCompanies(company.id);
    return { ok: true, data: company };
  } catch (error) {
    return fail(error);
  }
}

export async function updateCompany(
  id: number,
  patch: Partial<{
    name: string;
    legal_form: LegalForm;
    share_capital: string;
    status: CompanyStatus;
  }>,
): Promise<ActionResult<Company>> {
  try {
    const company = await apiPatch<Company>(`/api/companies/${id}/`, patch);
    revalidateCompanies(id);
    return { ok: true, data: company };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteCompany(id: number): Promise<ActionResult> {
  try {
    await apiDelete(`/api/companies/${id}/`);
    revalidateCompanies();
    return { ok: true, data: null };
  } catch (error) {
    return fail(error);
  }
}

/* ------------------------------ Documents ----------------------------- */

export async function createDocument(input: {
  company: number;
  doc_type: DocType;
}): Promise<ActionResult<LegalDocument>> {
  try {
    const doc = await apiPost<LegalDocument>("/api/documents/", {
      company: input.company,
      doc_type: input.doc_type,
    });
    revalidatePath("/dashboard");
    revalidatePath("/documents");
    revalidatePath(`/companies/${input.company}`);
    return { ok: true, data: doc };
  } catch (error) {
    return fail(error);
  }
}

export async function requestSignature(
  documentId: number,
): Promise<ActionResult<SignatureRequestCreated>> {
  try {
    const sig = await apiPost<SignatureRequestCreated>(
      `/api/documents/${documentId}/request-signature/`,
    );
    return { ok: true, data: sig };
  } catch (error) {
    return fail(error);
  }
}

export async function verifySignature(
  documentId: number,
  code: string,
): Promise<VerifyResult> {
  try {
    const data = await apiPost<{ detail: string; signed_at: string | null }>(
      `/api/documents/${documentId}/verify-signature/`,
      { code },
    );
    revalidatePath("/dashboard");
    revalidatePath("/companies");
    revalidatePath(`/documents/${documentId}`);
    return { ok: true, signedAt: data.signed_at ?? null };
  } catch (error) {
    if (error instanceof ApiError) {
      const reason =
        typeof (error.data as { detail?: unknown })?.detail === "string"
          ? (error.data as { detail: string }).detail
          : "";
      return { ok: false, status: error.status, reason };
    }
    return { ok: false, status: 0, reason: "network" };
  }
}
