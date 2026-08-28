"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { requestSignature, verifySignature } from "@/lib/actions";
import { formatDateTime } from "@/lib/format";
import type { DocumentStatus } from "@/lib/types";

type Phase = "idle" | "awaiting" | "signed";

const VERIFY_MESSAGE: Record<number, string> = {
  400: "Code incorrect. Vérifiez les 6 chiffres saisis.",
  410: "Ce code a expiré. Demandez une nouvelle signature.",
  429: "Trop de tentatives. Demandez une nouvelle signature.",
};

export function SignaturePanel({
  documentId,
  status,
  signedAt: initialSignedAt,
}: {
  documentId: number;
  status: DocumentStatus;
  signedAt?: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Le serveur fait autorité : un document « signe » affiche toujours l'état
  // signé. Sinon, l'état local suit les actions de l'utilisateur.
  const [localPhase, setLocalPhase] = React.useState<Phase>("idle");
  const phase: Phase = status === "signe" ? "signed" : localPhase;

  const [debugCode, setDebugCode] = React.useState<string | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [signedAt, setSignedAt] = React.useState<string | null>(
    initialSignedAt ?? null,
  );
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [canResend, setCanResend] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function ask(resend = false) {
    setPending(true);
    setError(null);
    const result = await requestSignature(documentId);
    setPending(false);
    if (result.ok) {
      setDebugCode(result.data.otp_code_debug);
      setExpiresAt(result.data.expires_at);
      setCode("");
      setCanResend(false);
      setLocalPhase("awaiting");
      toast(resend ? "Nouveau code généré." : "Code de signature généré.", "info");
    } else {
      toast(result.error, "error");
      router.refresh();
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (code.length !== 6) return;
    setPending(true);
    setError(null);
    const result = await verifySignature(documentId, code);
    setPending(false);

    if (result.ok) {
      setSignedAt(result.signedAt);
      setLocalPhase("signed");
      toast("Document signé.", "success");
      router.refresh();
      return;
    }
    if (result.status === 409) {
      setLocalPhase("signed");
      toast("Ce document est déjà signé.", "info");
      router.refresh();
      return;
    }
    setError(VERIFY_MESSAGE[result.status] ?? "Vérification impossible. Réessayez.");
    if (result.status === 410 || result.status === 429) setCanResend(true);
  }

  if (phase === "signed") {
    return (
      <div className="rounded-card border border-border-soft bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            Signature
          </h2>
          <StatusBadge label="Signé" tone="done" />
        </div>
        <p className="mt-3 text-sm text-ink">Ce document est signé.</p>
        <p className="mt-1 text-sm text-ink-muted">
          {signedAt
            ? `Signé le ${formatDateTime(signedAt)}.`
            : "La signature a été horodatée côté serveur."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border-soft bg-surface p-5">
      <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
        Signature
      </h2>

      {phase === "idle" ? (
        <div className="mt-3">
          <p className="text-sm text-ink-muted">
            Aucune demande de signature en cours.
          </p>
          <Button className="mt-4" disabled={pending} onClick={() => ask()}>
            {pending ? "Génération…" : "Demander la signature"}
          </Button>
        </div>
      ) : null}

      {phase === "awaiting" ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-control border border-border-soft bg-nav-active p-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Code de test (dev)
            </p>
            <p className="mt-1 font-mono text-2xl tracking-[0.3em] text-ink">
              {debugCode}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              En production, ce code est envoyé par SMS / e-mail au signataire.
              {expiresAt ? ` Expire le ${formatDateTime(expiresAt)}.` : ""}
            </p>
          </div>

          <form onSubmit={verify} className="space-y-3">
            <label
              htmlFor="otp"
              className="block text-xs font-medium text-ink"
            >
              Code à 6 chiffres
            </label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="\d{6}"
              aria-invalid={error ? true : undefined}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="max-w-[12rem] font-mono text-lg tracking-[0.3em]"
            />
            {error ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button type="submit" disabled={pending || code.length !== 6}>
                {pending ? "Vérification…" : "Signer le document"}
              </Button>
              <Button
                type="button"
                variant={canResend ? "primary" : "link"}
                disabled={pending}
                onClick={() => ask(true)}
              >
                {canResend ? "Demander un nouveau code" : "Renvoyer un code"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
