import { TriangleAlert } from "lucide-react";
import { legalInfoIncomplete } from "@/content/legal";
import { cn } from "@/lib/cn";
import { RichText } from "@/components/ui/RichText";
import { fr } from "@/lib/typography";

/** Valeur légale, ou repère visible « À compléter » si elle manque. */
export function Value({ value, label }: { value: string | null | undefined; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-amber/50 bg-amber/10 px-1.5 py-0.5 text-[0.85em] text-amber">
      {fr(`À compléter : ${label}`)}
    </span>
  );
}

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article
      data-backdrop="legal"
      className="pb-24 pt-[calc(var(--header-height)+4rem)] md:pb-36 md:pt-[calc(var(--header-height)+6rem)]"
    >
      <div className="container-x">
        <header className="mx-auto max-w-5xl text-center">
          <h1 className="text-[clamp(2.4rem,1.2rem+4.4vw,5.2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ivory">
            <span className="hero-line">
              <span style={{ "--i": 1 } as React.CSSProperties}>
                <RichText text={title} />
              </span>
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
              className="hero-fade mt-8 flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/[0.07] p-4 text-left text-[0.92rem] leading-relaxed text-ivory/90"
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
        <div className="legal-prose mx-auto mt-14 max-w-3xl md:mt-20">{children}</div>
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
    <section className={cn("py-8 first:pt-0", className)}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
