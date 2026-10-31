import { cta } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/motion/Reveal";

type CtaBandProps = {
  title: string;
  text: string;
  secondary?: { label: string; href: string };
};

/** Bandeau de conversion de fin de page. */
export function CtaBand({ title, text, secondary }: CtaBandProps) {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container-x">
        <Reveal className="surface border-aube relative overflow-hidden rounded-[var(--radius-stage)] px-6 py-14 text-center sm:px-12 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(186_181_242/0.2),transparent)]"
          />
          <h2 className="relative mx-auto max-w-3xl text-[clamp(1.9rem,1.2rem+2.6vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ivory">
            <RichText text={title} />
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lead text-mist">{text}</p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              {cta.primary}
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="secondary" size="lg" arrow={false}>
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
