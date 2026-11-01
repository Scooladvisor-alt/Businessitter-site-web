import { audit } from "@/content/home";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { AuditForm } from "@/components/forms/AuditForm";

/** Séquence 9 — Conversion : demande d'audit gratuit. */
export function AuditSection() {
  return (
    <section
      id="audit"
      data-backdrop="audit"
      aria-labelledby="audit-title"
      className="relative overflow-clip py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[20%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.07),transparent)]"
      />
      <div className="container-x relative">
        <header className="mx-auto max-w-6xl text-center">
          <SplitHeading
            id="audit-title"
            text={audit.title}
            className="text-headline font-medium text-ivory"
          />
        </header>

        <Reveal className="mx-auto mt-14 max-w-3xl md:mt-20" y={40}>
          <div className="surface border-aube relative rounded-[var(--radius-stage)] p-6 text-left sm:p-10">
            <AuditForm idPrefix="audit" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
