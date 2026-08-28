import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/lib/format";
import { GUIDES, getGuide } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  return guide
    ? { title: `${guide.title} — Guides LegalFlow`, description: guide.excerpt }
    : { title: "Guide introuvable — LegalFlow" };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article>
      <div className="mx-auto max-w-[72ch] px-6 py-16 sm:py-20">
        <nav className="text-xs text-ink-muted">
          <Link href="/guides" className="hover:text-ink hover:underline">
            Guides
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{guide.title}</span>
        </nav>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
          {formatDate(guide.date)} · {guide.readingMinutes} min de lecture
        </p>
        <h1 className="mt-3 max-w-[20ch] text-balance font-display text-[32px] leading-[1.08] text-ink sm:text-[44px]">
          {guide.title}
        </h1>

        <div className="mt-10 space-y-5 border-t border-border-soft pt-8">
          {guide.body.map((p, i) => (
            <p key={i} className="max-w-[68ch] text-base leading-[1.7] text-ink">
              {p}
            </p>
          ))}
        </div>

        <p className="mt-10 border-t border-border-soft pt-6 text-xs text-ink-muted">
          Article de démonstration. Ne constitue pas un conseil juridique
          personnalisé.
        </p>
      </div>
    </article>
  );
}
