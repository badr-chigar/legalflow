"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { createCompany, createDocument } from "@/lib/actions";
import { LEGAL_FORM_LABEL, LEGAL_FORM_OPTIONS, formatCapital } from "@/lib/format";
import type { LegalForm } from "@/lib/types";

const TOTAL = 4;

interface WizardData {
  name: string;
  legal_form: LegalForm;
  share_capital: string;
  headquarters: string;
  activity: string;
}

const INITIAL: WizardData = {
  name: "",
  legal_form: "SARL",
  share_capital: "10000",
  headquarters: "",
  activity: "",
};

export function CreationWizard() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState<WizardData>(INITIAL);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function set<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validateStep(current: number): boolean {
    const next: Record<string, string> = {};
    if (current === 1) {
      if (data.name.trim().length < 2)
        next.name = "Indiquez la raison sociale souhaitée.";
    }
    if (current === 2) {
      const capital = Number(data.share_capital);
      if (data.share_capital === "" || Number.isNaN(capital) || capital < 0)
        next.share_capital = "Indiquez un capital valide (0 ou plus).";
      if (data.headquarters.trim().length < 4)
        next.headquarters = "Indiquez l’adresse du siège.";
      if (data.activity.trim().length < 3)
        next.activity = "Décrivez l’activité principale.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(TOTAL, s + 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    const created = await createCompany({
      name: data.name,
      legal_form: data.legal_form,
      share_capital: String(Number(data.share_capital)),
    });
    if (!created.ok) {
      setSubmitting(false);
      setSubmitError(created.error);
      return;
    }
    // Document « statuts » en brouillon (best-effort).
    await createDocument({ company: created.data.id, doc_type: "statuts" });
    toast("Dossier créé, un juriste va le prendre en charge.", "success");
    router.push(`/companies/${created.data.id}`);
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
        Création d’entreprise · étape {step}/{TOTAL}
      </p>
      <div
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border-soft"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
      >
        <div
          className="h-full bg-brand-slate transition-all"
          style={{ width: `${(step / TOTAL) * 100}%` }}
        />
      </div>

      <div className="mt-8">
        {step === 1 ? (
          <div className="space-y-5">
            <h1 className="font-display text-xl text-ink">Votre projet</h1>
            <Field id="w-name" label="Raison sociale souhaitée" error={errors.name}>
              <Input
                {...fieldAria("w-name", { error: Boolean(errors.name) })}
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                autoFocus
                placeholder="ex. Atlas Conseil"
              />
            </Field>
            <Field id="w-form" label="Forme juridique">
              <Select
                id="w-form"
                value={data.legal_form}
                onChange={(e) => set("legal_form", e.target.value as LegalForm)}
              >
                {LEGAL_FORM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <h1 className="font-display text-xl text-ink">
              Capital et informations
            </h1>
            <Field
              id="w-capital"
              label="Capital social (DH)"
              error={errors.share_capital}
            >
              <Input
                {...fieldAria("w-capital", {
                  error: Boolean(errors.share_capital),
                })}
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                value={data.share_capital}
                onChange={(e) => set("share_capital", e.target.value)}
              />
            </Field>
            <Field
              id="w-hq"
              label="Adresse du siège"
              hint="Une domiciliation pourra être ajoutée plus tard."
              error={errors.headquarters}
            >
              <Input
                {...fieldAria("w-hq", {
                  hint: true,
                  error: Boolean(errors.headquarters),
                })}
                value={data.headquarters}
                onChange={(e) => set("headquarters", e.target.value)}
                placeholder="ex. 12 rue des Écoles, Casablanca"
              />
            </Field>
            <Field
              id="w-activity"
              label="Activité principale"
              error={errors.activity}
            >
              <Input
                {...fieldAria("w-activity", { error: Boolean(errors.activity) })}
                value={data.activity}
                onChange={(e) => set("activity", e.target.value)}
                placeholder="ex. Conseil en informatique"
              />
            </Field>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <h1 className="font-display text-xl text-ink">Récapitulatif</h1>
            <dl className="border-t border-border-soft">
              {[
                ["Raison sociale", data.name || "—"],
                ["Forme juridique", LEGAL_FORM_LABEL[data.legal_form]],
                ["Capital social", formatCapital(data.share_capital)],
                ["Siège", data.headquarters || "—"],
                ["Activité", data.activity || "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[10rem_1fr] gap-4 border-b border-border-soft py-3 text-sm"
                >
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-ink-muted">
              En validant, le dossier est créé au statut « brouillon » et un
              document « Statuts » est ajouté automatiquement.
            </p>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <h1 className="font-display text-xl text-ink">Validation</h1>
            <p className="text-sm text-ink-muted">
              Tout est prêt. Créez le dossier : il apparaîtra dans votre espace
              et un juriste le prendra en charge.
            </p>
            {submitError ? (
              <p
                role="alert"
                className="rounded-control border border-danger/35 bg-danger/[0.06] px-3 py-2 text-xs font-medium text-danger"
              >
                {submitError}
              </p>
            ) : null}
            <Button size="lg" disabled={submitting} onClick={submit}>
              {submitting ? "Création du dossier…" : "Créer le dossier"}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-border-soft pt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={goBack}
          disabled={step === 1 || submitting}
        >
          Retour
        </Button>
        {step < TOTAL ? (
          <Button type="button" onClick={goNext}>
            Continuer
          </Button>
        ) : (
          <span className="text-xs text-ink-muted">Étape finale</span>
        )}
      </div>
    </div>
  );
}
