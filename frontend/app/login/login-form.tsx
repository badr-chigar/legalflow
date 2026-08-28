"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  "h-11 text-[15px] focus-visible:outline-none focus-visible:border-brand-slate focus-visible:ring-2 focus-visible:ring-brand-slate/30";

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginForm({
  next,
  showDemo = false,
}: {
  next: string;
  showDemo?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
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
      nextErrors.email = "Cet e-mail n’est pas valide.";
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
        setFormError(
          res.status === 401
            ? "E-mail ou mot de passe incorrect."
            : (data?.detail ?? "Connexion impossible. Réessayez."),
        );
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
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={formError ? "login-error" : undefined}
      className="space-y-5"
    >
      {formError ? (
        <div
          id="login-error"
          role="alert"
          className="rounded-control border border-danger/40 bg-danger/5 px-3 py-2 text-sm text-danger"
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
          className={INPUT_CLASS}
        />
      </Field>

      <Field
        id="password"
        label="Mot de passe"
        error={errors.password}
        labelAction={
          <button
            type="button"
            onClick={() =>
              toast("Fonction non disponible sur la démonstration.", "info")
            }
            className="text-xs text-brand-slate hover:underline"
          >
            Mot de passe oublié ?
          </button>
        }
      >
        <Input
          {...fieldAria("password", { error: Boolean(errors.password) })}
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? (
          <>
            <Spinner />
            Connexion…
          </>
        ) : (
          "Se connecter"
        )}
      </Button>

      <p className="border-t border-border-soft pt-4 text-sm text-ink-muted">
        Pas encore de dossier ?{" "}
        <Link
          href="/creer"
          className="font-medium text-brand-slate hover:underline"
        >
          Créer mon entreprise
        </Link>
      </p>

      {showDemo ? (
        <div className="rounded-control border border-border-soft bg-nav-active p-3 font-mono text-[11px] leading-relaxed text-ink-muted [word-break:break-word]">
          Démo — client.demo@legalflow.test / juriste.demo@legalflow.test · mot
          de passe : demo-passphrase-2026
        </div>
      ) : null}
    </form>
  );
}
