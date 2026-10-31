import { audit } from "@/content/home";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { AuditForm } from "@/components/forms/AuditForm";

/** Séquence 9 — Conversion : demande d'audit gratuit. */
export function AuditSection() {
  return (
    <section
      id="audit"
      aria-labelledby="audit-title"
      className="relative overflow-clip py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(80rem,90vw)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.14),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[20%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.07),transparent)]"
      />
      <div className="container-x relative">
        <header className="mx-auto max-w-3xl text-center">
          <SplitHeading
            id="audit-title"
            text={audit.title}
            className="text-headline font-medium text-ivory"
          />
          <Reveal as="p" className="mx-auto mt-6 max-w-xl text-lead text-mist" delay={0.1}>
            {audit.subtitle}
          </Reveal>
        </header>

        <Reveal
          as="ol"
          stagger={0.08}
          className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
        >
          {audit.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3 text-[0.95rem] text-ivory/90">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-[0.8rem] tabular-nums text-ivory">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-3xl" y={40}>
          <div className="surface border-aube relative rounded-[var(--radius-stage)] p-6 text-left sm:p-10">
            <AuditForm idPrefix="audit" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
