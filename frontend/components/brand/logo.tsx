import { cn } from "@/lib/utils";

/**
 * Logo LegalFlow — SVG inline, monochrome.
 * Mark : document au coin replié (dog-ear) + une ligne « signée » horizontale.
 * Wordmark : Fraunces 600, « Legal » en encre, « Flow » en ardoise.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d="M4.25 2.5h7.5L16 6.75v8.75a2 2 0 0 1-2 2H4.25a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2Z" />
      <path d="M11.75 2.5v4.25H16" />
      <path d="M5.75 12.75h8.5" />
    </svg>
  );
}

export function Logo({
  variant = "full",
  tone = "default",
  className,
}: {
  variant?: "full" | "mark";
  /** `invert` : tout en clair, pour un fond sombre. */
  tone?: "default" | "invert";
  className?: string;
}) {
  if (variant === "mark") {
    return <LogoMark className={className} />;
  }
  const invert = tone === "invert";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.01em]",
        className,
      )}
    >
      <LogoMark className={invert ? "text-page" : "text-brand-slate"} />
      <span className={invert ? "text-page" : "text-ink"}>
        Legal
        <span className={invert ? "text-brand-brass" : "text-brand-slate"}>
          Flow
        </span>
      </span>
    </span>
  );
}
