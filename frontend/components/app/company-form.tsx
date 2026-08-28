"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LEGAL_FORM_OPTIONS } from "@/lib/format";
import type { LegalForm } from "@/lib/types";

export interface CompanyFormValues {
  name: string;
  legal_form: LegalForm;
  share_capital: string;
}

const EMPTY: CompanyFormValues = {
  name: "",
  legal_form: "SARL",
  share_capital: "",
};

export function CompanyForm({
  initial = EMPTY,
  submitLabel = "Enregistrer",
  onSubmit,
  onCancel,
}: {
  initial?: CompanyFormValues;
  submitLabel?: string;
  onSubmit: (values: CompanyFormValues) => Promise<{ ok: boolean; error?: string }>;
  onCancel?: () => void;
}) {
  const [values, setValues] = React.useState<CompanyFormValues>(initial);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CompanyFormValues, string>>
  >({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  function set<K extends keyof CompanyFormValues>(key: K, value: CompanyFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const next: typeof errors = {};
    if (values.name.trim().length < 2)
      next.name = "Indiquez la raison sociale (2 caractères minimum).";
    const capital = Number(values.share_capital);
    if (values.share_capital === "" || Number.isNaN(capital) || capital < 0)
      next.share_capital = "Indiquez un montant valide (0 ou plus).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const result = await onSubmit({
        ...values,
        name: values.name.trim(),
        share_capital: String(capital),
      });
      if (!result.ok) setFormError(result.error ?? "Enregistrement impossible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError ? (
        <p
          role="alert"
          className="rounded-control border border-danger/35 bg-danger/[0.06] px-3 py-2 text-xs font-medium text-danger"
        >
          {formError}
        </p>
      ) : null}

      <Field id="cf-name" label="Raison sociale" error={errors.name}>
        <Input
          {...fieldAria("cf-name", { error: Boolean(errors.name) })}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />
      </Field>

      <Field id="cf-form" label="Forme juridique">
        <Select
          id="cf-form"
          value={values.legal_form}
          onChange={(e) => set("legal_form", e.target.value as LegalForm)}
        >
          {LEGAL_FORM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id="cf-capital"
        label="Capital social (DH)"
        error={errors.share_capital}
      >
        <Input
          {...fieldAria("cf-capital", { error: Boolean(errors.share_capital) })}
          type="number"
          inputMode="numeric"
          min={0}
          step={100}
          value={values.share_capital}
          onChange={(e) => set("share_capital", e.target.value)}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
