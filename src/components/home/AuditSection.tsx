import { CircleCheck } from "lucide-react";
import { audit } from "@/content/home";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { AuditForm } from "@/components/forms/AuditForm";

/** Séquence 9 — Conversion : demande d'audit gratuit. */
export function AuditSection() {
  return (
    <section
      id="audit"
      aria-labelledby="audit-title"
      className="relative overflow-clip py-24 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(80rem,90vw)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.14),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[15%] bottom-0 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.08),transparent)]"
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow tone="aube">{audit.eyebrow}</Eyebrow>
          <SplitHeading
            id="audit-title"
            text={audit.title}
            className="mt-6 text-headline font-medium text-ivory"
          />
          <Reveal as="p" className="mt-6 text-lead text-mist" delay={0.1}>
            {audit.subtitle}
          </Reveal>

          <Reveal className="mt-12" delay={0.15}>
            <h3 className="eyebrow text-dim">{audit.stepsTitle}</h3>
            <ol className="mt-6 space-y-6">
              {audit.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/12 font-mono text-xs text-ivory">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-ivory">{step.title}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-mist">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as="ul" className="mt-10 space-y-2.5" stagger={0.06}>
            {audit.assurances.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[0.95rem] text-ivory/90">
                <CircleCheck className="size-4 text-aqua" strokeWidth={2} aria-hidden="true" />
                {item}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" y={40}>
          <div className="surface border-aube relative rounded-[var(--radius-stage)] p-6 sm:p-10">
            <AuditForm idPrefix="audit" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
