"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  next: string;
}

export function LoginForm({ next }: Props) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Saisissez votre e-mail.";
    else if (!EMAIL_RE.test(email.trim()))
      nextErrors.email = "Cet e-mail n'est pas valide.";
    if (!password) nextErrors.password = "Saisissez votre mot de passe.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { detail?: string }
          | null;
        setFormError(data?.detail ?? "Connexion impossible. Réessayez.");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setFormError("Serveur injoignable. Vérifiez votre connexion.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError ? (
        <div
          role="alert"
          className="rounded-control border border-danger/35 bg-danger/[0.06] px-3 py-2.5 text-xs font-medium text-danger"
        >
          {formError}
        </div>
      ) : null}

      <Field id="email" label="Adresse e-mail" error={errors.email}>
        <Input
          {...fieldAria("email", { error: Boolean(errors.email) })}
          type="email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field id="password" label="Mot de passe" error={errors.password}>
        <Input
          {...fieldAria("password", { error: Boolean(errors.password) })}
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
