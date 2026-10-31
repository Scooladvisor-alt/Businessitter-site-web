import { TriangleAlert } from "lucide-react";
import { legalInfoIncomplete } from "@/content/legal";
import { cn } from "@/lib/cn";
import { fr } from "@/lib/typography";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Valeur légale, ou repère visible « À compléter » si elle manque. */
export function Value({ value, label }: { value: string | null | undefined; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-amber/50 bg-amber/10 px-1.5 py-0.5 font-mono text-[0.78em] text-amber">
      {fr(`À compléter : ${label}`)}
    </span>
  );
}

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="pb-24 pt-[calc(var(--header-height)+4rem)] md:pb-36 md:pt-[calc(var(--header-height)+6rem)]">
      <div className="container-x">
        <header className="max-w-3xl">
          <div className="hero-fade" style={{ "--i": 0 } as React.CSSProperties}>
            <Eyebrow tone="aube">{eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-6 text-[clamp(2.2rem,1.3rem+3.4vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ivory">
            <span className="hero-line">
              <span style={{ "--i": 1 } as React.CSSProperties}>{title}</span>
            </span>
          </h1>
          <p
            className="hero-fade mt-5 text-sm text-dim"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {fr(`Dernière mise à jour : ${updated}`)}
          </p>
          {legalInfoIncomplete ? (
            <p
              role="note"
              className="hero-fade mt-8 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/[0.07] p-4 text-[0.92rem] leading-relaxed text-ivory/90"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
              {fr(
                "Page en cours de finalisation : certaines informations juridiques de l'entreprise restent à compléter avant la mise en ligne définitive.",
              )}
            </p>
          ) : null}
          {intro ? (
            <div
              className="hero-fade mt-8 text-lead text-mist"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              {intro}
            </div>
          ) : null}
        </header>
        <div className="legal-prose mt-14 max-w-3xl md:mt-20">{children}</div>
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("border-t border-white/[0.08] py-10 first:border-t-0 first:pt-0", className)}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
}
