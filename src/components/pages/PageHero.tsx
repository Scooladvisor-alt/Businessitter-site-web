import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { SystemPoster } from "@/components/system/SystemPoster";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  /** Identifiant unique de la page (dégradés du visuel décoratif). */
  id: string;
};

/** En-tête des pages intérieures (animation CSS, sans dépendance au JavaScript). */
export function PageHero({ eyebrow, title, lead, children, id }: PageHeroProps) {
  return (
    <section className="relative overflow-clip pb-16 pt-[calc(var(--header-height)+4.5rem)] md:pb-24 md:pt-[calc(var(--header-height)+7.5rem)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 mask-fade-b">
        <div className="absolute -left-[15%] -top-[40%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.11),transparent)]" />
        <div className="absolute -right-[10%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.07),transparent)]" />
        <div className="bg-grid absolute inset-0 opacity-40 mask-radial" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[6%] top-1/2 -z-10 hidden -translate-y-[42%] lg:block"
      >
        <SystemPoster
          variant="order"
          idSuffix={id}
          className="h-[min(78vh,46rem)] w-auto max-w-none opacity-40"
        />
      </div>
      <div className="container-x">
        <div className="hero-fade" style={{ "--i": 0 } as React.CSSProperties}>
          <Eyebrow tone="aube">{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-7 max-w-5xl text-[clamp(2.4rem,1.2rem+4.6vw,5.6rem)] font-medium leading-[1] tracking-[-0.045em] text-ivory">
          <span className="hero-line">
            <span style={{ "--i": 1 } as React.CSSProperties}>
              <RichText text={title} />
            </span>
          </span>
        </h1>
        {lead ? (
          <p
            className="hero-fade mt-8 max-w-2xl text-lead text-mist"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {lead}
          </p>
        ) : null}
        {children ? (
          <div className="hero-fade mt-10" style={{ "--i": 4 } as React.CSSProperties}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
