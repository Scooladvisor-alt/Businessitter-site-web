import { cn } from "@/lib/cn";

/** Pastille de statut utilisée dans les interfaces illustratives. */
export function Chip({
  children,
  tone = "neutral",
  className,
  ...rest
}: {
  children: React.ReactNode;
  tone?: "neutral" | "aqua" | "amber" | "ember" | "sky" | "lilac" | "dim";
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const tones = {
    neutral: "border-white/12 bg-white/[0.05] text-ivory",
    aqua: "border-aqua/30 bg-aqua/10 text-aqua",
    amber: "border-amber/30 bg-amber/10 text-amber",
    ember: "border-ember/35 bg-ember/10 text-ember",
    sky: "border-sky/30 bg-sky/10 text-sky",
    lilac: "border-lilac/30 bg-lilac/10 text-lilac",
    dim: "border-white/10 bg-white/[0.03] text-dim",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10.5px] font-medium leading-none",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

/** Ligne « squelette » (contenu suggéré, jamais de fausses données chiffrées). */
export function Bar({ className }: { className?: string }) {
  return <span className={cn("skeleton-line block h-2", className)} />;
}

/** Plan de travail à taille fixe, mis à l'échelle de la scène. */
export function Artboard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute left-1/2 top-1/2 h-[400px] w-[440px] origin-center -translate-x-1/2 -translate-y-1/2 scale-[var(--scene-scale,1)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
