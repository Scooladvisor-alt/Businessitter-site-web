import { cn } from "@/lib/cn";
import { posterGeometry } from "./poster-geometry";

type SystemPosterProps = {
  variant: "chaos" | "order";
  className?: string;
  /** Suffixe garantissant l'unicité des identifiants de dégradés. */
  idSuffix: string;
};

/**
 * Représentation statique (SVG) du système : affichée avant le chargement
 * de la scène WebGL, et à sa place si les animations sont réduites ou si
 * WebGL est indisponible. Calculée au rendu serveur, sans JavaScript.
 */
export function SystemPoster({ variant, className, idSuffix }: SystemPosterProps) {
  const g = posterGeometry(variant);
  const [x, y, w, h] = g.viewBox;
  const gradientId = `poster-${variant}-${idSuffix}`;
  const warm = variant === "chaos";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn("system-poster pointer-events-none select-none", className)}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={x}
          y1="0"
          x2={x + w}
          y2="0"
        >
          <stop offset="0" stopColor={warm ? "#ffc88f" : "#f3a9b2"} />
          <stop offset="0.5" stopColor={warm ? "#f3a9b2" : "#bab5f2"} />
          <stop offset="1" stopColor={warm ? "#bab5f2" : "#86e6da"} />
        </linearGradient>
        <radialGradient id={`${gradientId}-glow`}>
          <stop offset="0" stopColor="#fff6ea" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6ea" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={g.path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeOpacity={warm ? 0.22 : 0.3}
        strokeWidth={0.0035}
      />
      <g fill={`url(#${gradientId})`} opacity={0.85}>
        {g.nodes.map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r={node.r} />
        ))}
      </g>
      {variant === "order" ? (
        <circle cx={g.core.x} cy={g.core.y} r={0.09} fill={`url(#${gradientId}-glow)`} />
      ) : null}
    </svg>
  );
}
