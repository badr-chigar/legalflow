/**
 * Types des réponses de l'API LegalFlow (Django REST Framework).
 * Dérivés des serializers : accounts/serializers.py, companies/serializers.py,
 * documents/serializers.py. À régénérer si l'API change
 * (`python manage.py spectacular --file openapi-schema.yml`).
 */

// --- Pagination DRF (PageNumberPagination, PAGE_SIZE = 20) ------------------
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Comptes --------------------------------------------------------------
export type UserRole = "client" | "juriste" | "admin";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// --- Sociétés ----------------------------------------------------------------
export type LegalForm = "SAS" | "SASU" | "SARL" | "EURL" | "SCI" | "MICRO";

export type CompanyStatus =
  | "brouillon"
  | "en_revue"
  | "depose"
  | "immatricule";

export interface Company {
  id: number;
  owner: number;
  owner_email: string;
  name: string;
  legal_form: LegalForm;
  /** DecimalField sérialisé en chaîne par DRF. */
  share_capital: string;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

export interface CompanyInput {
  name: string;
  legal_form: LegalForm;
  share_capital: string;
}

// --- Documents -------------------------------------------------------------
export type DocType = "statuts" | "m0" | "dnc" | "beneficiaires";

export type DocumentStatus = "brouillon" | "soumis" | "valide" | "signe";

export interface LegalDocument {
  id: number;
  company: number;
  doc_type: DocType;
  status: DocumentStatus;
  file: string | null;
  created_at: string;
  updated_at: string;
}

// --- Signature (OTP) ------------------------------------------------------
export type SignatureStatus = "en_attente" | "signe" | "expire";

export interface SignatureRequest {
  id: number;
  document: number;
  status: SignatureStatus;
  attempts: number;
  created_at: string;
  expires_at: string;
  signed_at: string | null;
}

/** Réponse de POST /api/documents/{id}/request-signature/ (201). */
export interface SignatureRequestCreated extends SignatureRequest {
  /** Exposé uniquement en dev (DEBUG) — à retirer en production. */
  otp_code_debug: string;
}

// --- Server actions ------------------------------------------------------
export type ActionResult<T = null> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Résultat de la vérification OTP — le statut HTTP porte le motif. */
export type VerifyResult =
  | { ok: true; signedAt: string | null }
  | { ok: false; status: number; reason: string };
