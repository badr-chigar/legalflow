import type { StatusTone } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Statut = pastille colorée + libellé texte (design-system.md §5).
 * Jamais la couleur seule.
 */
const DOT: Record<StatusTone, string> = {
  muted: "bg-ink-muted",
  progress: "bg-brand-slate",
  done: "bg-success",
};

export function StatusBadge({
  label,
  tone,
  className,
}: {
  label: string;
  tone: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[tone])}
      />
      {label}
    </span>
  );
}
