import type { Metadata } from "next";

import { PageIntro } from "@/components/marketing/primitives";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — LegalFlow",
  description: "Une question sur la création ou la domiciliation ? Écrivez-nous.",
};

const COORDS = [
  ["E-mail", "contact@legalflow.example"],
  ["Téléphone", "+212 5 20 00 00 00"],
  ["Horaires", "Lun–ven, 9 h – 18 h (heure du Maroc)"],
] as const;

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Parlez de votre projet à un juriste."
        intro="Décrivez votre situation en quelques lignes ; nous revenons vers vous sous un jour ouvré."
      />
      <section className="border-t border-border-soft">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pb-20 lg:pb-24 lg:pt-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
            <ContactForm />

          <aside>
            <dl className="border-t border-border-soft">
              {COORDS.map(([k, v]) => (
                <div
                  key={k}
                  className="border-b border-border-soft py-3 text-sm"
                >
                  <dt className="text-xs text-ink-muted">{k}</dt>
                  <dd className="mt-0.5 text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 font-mono text-xs text-ink-muted">
              Projet de démonstration : le formulaire n’envoie pas d’e-mail, il
              journalise le message dans la console du navigateur.
            </p>
          </aside>
          </div>
        </div>
      </section>
    </>
  );
}
