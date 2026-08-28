"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

/** Confirmation d'action destructive (suppression). */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Supprimer",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}) {
  const [pending, setPending] = React.useState(false);

  async function confirm() {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} description={message}>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          Annuler
        </Button>
        <Button
          onClick={confirm}
          disabled={pending}
          className="border-danger bg-danger hover:bg-danger/90"
        >
          {pending ? "Suppression…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
