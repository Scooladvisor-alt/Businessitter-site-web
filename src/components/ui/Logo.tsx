import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  /** Suffixe garantissant l'unicité de l'identifiant du dégradé. */
  idSuffix?: string;
};

/**
 * Monogramme Businessister : un « b » (l'entreprise) accompagné d'un point
 * lumineux en orbite (le partenaire qui l'accompagne).
 */
export function LogoMark({ className, idSuffix = "main" }: LogoMarkProps) {
  const gradientId = `bsr-mark-${idSuffix}`;
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc88f" />
          <stop offset="0.55" stopColor="#f3a9b2" />
          <stop offset="1" stopColor="#86e6da" />
        </linearGradient>
      </defs>
      <rect x="4" y="3" width="4.6" height="26" rx="2.3" fill="currentColor" />
      <circle cx="16.2" cy="19.6" r="7.1" fill="none" stroke="currentColor" strokeWidth="4.6" />
      <circle cx="25.7" cy="6.5" r="3.3" fill={`url(#${gradientId})`} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  idSuffix?: string;
  showWordmark?: boolean;
};

export function Logo({ className, idSuffix, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ivory", className)}>
      <LogoMark idSuffix={idSuffix} className="size-7" />
      {showWordmark ? (
        <span className="text-[1.08rem] font-semibold tracking-[-0.035em]">Businessister</span>
      ) : null}
    </span>
  );
}
