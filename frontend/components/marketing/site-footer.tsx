import Link from "next/link";

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
      ["Modèles de statuts", "/guides"],
      ["Glossaire juridique", "/guides"],
    ],
  },
  {
    title: "Entreprise",
    links: [
      ["À propos", "/contact"],
      ["Contact", "/contact"],
      ["Espace client", "/login"],
    ],
  },
  {
    title: "Légal",
    links: [
      ["Mentions légales", "/guides"],
      ["Conditions d’utilisation", "/guides"],
      ["Confidentialité", "/guides"],
      ["Cookies", "/guides"],
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-border-soft pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            LegalFlow — projet de démonstration. Non affilié à un cabinet
            d’avocats.
          </p>
          <p className="font-mono">© {year}</p>
        </div>
      </div>
    </footer>
  );
}
