import { realisation } from "@/content/home";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Séquence 6 — Réalisation. Une preuve concrète, en une seule carte :
 * SuperCalendar, conçu par Businessister et déjà utilisé sur le terrain.
 */
export function SuperCalendarSection() {
  return (
    <section
      id="realisation"
      data-backdrop="realisation"
      aria-labelledby="realisation-title"
      className="relative py-16 md:py-24"
    >
      <div className="container-x">
        <Reveal className="surface border-aube relative mx-auto max-w-2xl overflow-hidden rounded-[var(--radius-stage)] px-6 py-10 text-center sm:px-12 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.14),transparent)]"
          />
          <p className="relative inline-flex items-center gap-2.5 text-[1.05rem] font-semibold tracking-[-0.02em] text-ivory">
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-[0.6rem] bg-[linear-gradient(135deg,#ffc88f,#86e6da)] text-[0.85rem] font-bold text-ink-950 shadow-[0_8px_24px_-8px_rgb(255_200_143/0.6)]"
            >
              S
            </span>
            {realisation.name}
          </p>
          <h2 id="realisation-title" className="relative mt-5 text-title font-medium text-ivory">
            {realisation.title}
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-[1rem] leading-relaxed text-mist">
            {realisation.description}
          </p>
          <ButtonLink
            href={site.superCalendarUrl}
            external
            variant="secondary"
            size="sm"
            className="relative mt-7"
          >
            {realisation.link}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
