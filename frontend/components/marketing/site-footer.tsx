import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { SHELL } from "@/components/marketing/primitives";
import { cn } from "@/lib/utils";

const COLUMNS = [
  {
    title: "Services",
    links: [
      ["Création d’entreprise", "/creation-entreprise"],
      ["Domiciliation", "/domiciliation"],
      ["Secrétariat juridique", "/creation-entreprise"],
      ["Tarifs", "/tarifs"],
    ],
  },
  {
    title: "Ressources",
    links: [
      ["Guides", "/guides"],
      ["Questions fréquentes", "/#faq"],
      ["Notre histoire", "/a-propos"],
    ],
  },
  {
    title: "Entreprise",
    links: [
      ["À propos", "/a-propos"],
      ["Contact", "/contact"],
      ["Rejoindre l’équipe", "/contact"],
    ],
  },
  {
    title: "Légal",
    links: [
      ["Mentions légales", "/mentions-legales"],
      ["Conditions générales", "/mentions-legales#cgu"],
      ["Politique de confidentialité", "/mentions-legales#confidentialite"],
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-soft bg-nav-active">
      <div className={cn(SHELL, "py-14")}>
        <Link href="/" aria-label="LegalFlow — accueil" className="inline-flex">
          <Logo />
        </Link>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
              Contact
            </p>
            <address className="mt-3 space-y-2 text-sm not-italic text-ink-muted">
              <p>
                <a
                  href="mailto:contact@legalflow.example"
                  className="transition-colors hover:text-ink"
                >
                  contact@legalflow.example
                </a>
              </p>
              <p className="font-mono">+212 5 20 00 00 00</p>
              <p>Lun–Ven, 9 h – 18 h</p>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-border-soft pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            LegalFlow — projet de démonstration. Non affilié à un cabinet
            d’avocats ni à une fiduciaire agréée.
          </p>
          <p className="font-mono">© {year}</p>
        </div>
      </div>
    </footer>
  );
}
