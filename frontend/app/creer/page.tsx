import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CreationWizard } from "@/components/app/creation-wizard";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = {
  title: "Créer mon entreprise — LegalFlow",
};

export default async function CreerPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/login?next=/creer");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <CreationWizard />
    </div>
  );
}
