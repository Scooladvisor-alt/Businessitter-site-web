import { cn } from "@/lib/cn";
import {
  LOGO_B_PATH,
  LOGO_STAR_GRADIENT,
  LOGO_STAR_PATH,
  LOGO_VIEWBOX,
  WORDMARK_ACCENT_GRADIENT,
  WORDMARK_ACCENT_PATH,
  WORDMARK_INK_PATH,
  WORDMARK_STAR_GRADIENT,
  WORDMARK_STAR_PATH,
  WORDMARK_VIEWBOX,
} from "./logo-paths";

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
};

/**
 * Logotype horizontal (« B », « usines » en noir, « sitter » au dégradé) :
 * à poser sur une surface claire (verre clair).
 */
export function Logo({ className, idSuffix = "main" }: LogoProps) {
  const star = `bsr-wm-star-${idSuffix}`;
  const accent = `bsr-wm-accent-${idSuffix}`;
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-auto shrink-0", className)}
    >
      <defs>
        {(
          [
            [star, WORDMARK_STAR_GRADIENT],
            [accent, WORDMARK_ACCENT_GRADIENT],
          ] as const
        ).map(([id, gradient]) => (
          <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={gradient.x1}
            y1="0"
            x2={gradient.x2}
            y2="0"
          >
            {gradient.stops.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        ))}
      </defs>
      <path d={WORDMARK_STAR_PATH} fill={`url(#${star})`} fillRule="evenodd" />
      <path d={WORDMARK_INK_PATH} fill="#0a0a0b" fillRule="evenodd" />
      <path d={WORDMARK_ACCENT_PATH} fill={`url(#${accent})`} fillRule="evenodd" />
    </svg>
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
