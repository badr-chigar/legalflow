"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const { toast } = useToast();
  const [values, setValues] = React.useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [sent, setSent] = React.useState(false);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = "Indiquez votre nom.";
    if (!EMAIL_RE.test(values.email.trim()))
      next.email = "Indiquez un e-mail valide.";
    if (values.message.trim().length < 10)
      next.message = "Votre message doit faire au moins 10 caractères.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Démo : pas de backend e-mail.
    console.log("[contact] message", {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
    });
    toast("Message envoyé. Nous revenons vers vous sous un jour ouvré.", "success");
    setSent(true);
    setValues({ name: "", email: "", message: "" });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-lg space-y-4">
      <Field id="c-name" label="Nom" error={errors.name}>
        <Input
          {...fieldAria("c-name", { error: Boolean(errors.name) })}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
      <Field id="c-email" label="E-mail" error={errors.email}>
        <Input
          {...fieldAria("c-email", { error: Boolean(errors.email) })}
          type="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>
      <Field id="c-message" label="Message" error={errors.message}>
        <textarea
          {...fieldAria("c-message", { error: Boolean(errors.message) })}
          rows={5}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full rounded-control border border-border-soft bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-slate aria-[invalid=true]:border-danger"
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit">Envoyer le message</Button>
        {sent ? (
          <span className="text-xs text-ink-muted">Message pris en compte.</span>
        ) : null}
      </div>
    </form>
  );
}
