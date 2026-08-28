import type {
  CompanyStatus,
  DocType,
  DocumentStatus,
  LegalForm,
  UserRole,
} from "@/lib/types";

/* Libellés FR + tons de statut. Source des libellés : choices Django. */

export type StatusTone = "muted" | "progress" | "done";

export const LEGAL_FORM_LABEL: Record<LegalForm, string> = {
  SAS: "SAS",
  SASU: "SASU",
  SARL: "SARL",
  EURL: "EURL",
  SCI: "SCI",
  MICRO: "Micro-entreprise",
};

export const LEGAL_FORM_OPTIONS = (
  Object.keys(LEGAL_FORM_LABEL) as LegalForm[]
).map((value) => ({ value, label: LEGAL_FORM_LABEL[value] }));

export const DOC_TYPE_LABEL: Record<DocType, string> = {
  statuts: "Statuts",
  m0: "Formulaire M0",
  dnc: "Déclaration de non-condamnation",
  beneficiaires: "Registre des bénéficiaires effectifs",
};

export const DOC_TYPE_OPTIONS = (Object.keys(DOC_TYPE_LABEL) as DocType[]).map(
  (value) => ({ value, label: DOC_TYPE_LABEL[value] }),
);

export const COMPANY_STATUS: Record<
  CompanyStatus,
  { label: string; tone: StatusTone }
> = {
  brouillon: { label: "Brouillon", tone: "muted" },
  en_revue: { label: "En revue", tone: "progress" },
  depose: { label: "Déposé au greffe", tone: "progress" },
  immatricule: { label: "Immatriculé", tone: "done" },
};

/** Ordre du workflow société — pour la timeline et le select. */
export const COMPANY_STATUS_FLOW: CompanyStatus[] = [
  "brouillon",
  "en_revue",
  "depose",
  "immatricule",
];

export const DOCUMENT_STATUS: Record<
  DocumentStatus,
  { label: string; tone: StatusTone }
> = {
  brouillon: { label: "Brouillon", tone: "muted" },
  soumis: { label: "Soumis", tone: "progress" },
  valide: { label: "Validé", tone: "done" },
  signe: { label: "Signé", tone: "done" },
};

export const ROLE_LABEL: Record<UserRole, string> = {
  client: "Client",
  juriste: "Juriste",
  admin: "Administrateur",
};

/** juriste / admin peuvent piloter le statut d'une société. */
export function canManageWorkflow(role: UserRole): boolean {
  return role === "juriste" || role === "admin";
}

const capitalFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatCapital(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";
  return `${capitalFormatter.format(n)} DH`;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFormatter.format(d);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateTimeFormatter.format(d);
}
