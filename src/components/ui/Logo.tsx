import { cn } from "@/lib/cn";
import { LOGO_B_PATH, LOGO_STAR_GRADIENT, LOGO_STAR_PATH, LOGO_VIEWBOX } from "./logo-paths";

type LogoMarkProps = {
  className?: string;
  /** Suffixe garantissant l'unicité de l'identifiant du dégradé. */
  idSuffix?: string;
};

/**
 * Logo Businessister : un « B » noir, et l'étoile au dégradé « aube » qui
 * fait le lien avec toute la direction artistique. La lettre suit la
 * couleur du texte (noir par défaut, à poser sur un fond clair).
 */
export function LogoMark({ className, idSuffix = "main" }: LogoMarkProps) {
  const gradientId = `bsr-star-${idSuffix}`;
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("h-7 w-auto shrink-0 text-[#0a0a0b]", className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={LOGO_STAR_GRADIENT.x1}
          y1="0"
          x2={LOGO_STAR_GRADIENT.x2}
          y2="0"
        >
          {LOGO_STAR_GRADIENT.stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <path d={LOGO_STAR_PATH} fill={`url(#${gradientId})`} />
      <path d={LOGO_B_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  idSuffix?: string;
  showWordmark?: boolean;
};

/** Logo et nom, en noir : à poser sur une surface claire (verre clair). */
export function Logo({ className, idSuffix, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink-950", className)}>
      <LogoMark idSuffix={idSuffix} className="h-9 text-current" />
      {showWordmark ? (
        <span className="text-[1.08rem] font-semibold tracking-[-0.035em]">Businessister</span>
      ) : null}
    </span>
  );
}

/** Le logo sur une pastille de verre clair, pour les fonds sombres. */
export function LogoBadge({ className, idSuffix }: { className?: string; idSuffix?: string }) {
  return (
    <span
      className={cn(
        "glass-light inline-flex shrink-0 items-center justify-center rounded-[30%]",
        className,
      )}
    >
      <LogoMark idSuffix={idSuffix} className="h-[62%]" />
    </span>
  );
}
