import { RichText } from "@/components/ui/RichText";
import { SystemPoster } from "@/components/system/SystemPoster";

type PageHeroProps = {
  title: string;
  lead?: string;
  children?: React.ReactNode;
  /** Identifiant unique de la page (dégradés du visuel décoratif). */
  id: string;
};

/** En-tête centré des pages intérieures (animation CSS, sans JavaScript). */
export function PageHero({ title, lead, children, id }: PageHeroProps) {
  return (
    <section
      data-backdrop="page-hero"
      className="relative isolate overflow-clip pb-16 pt-[calc(var(--header-height)+5rem)] text-center md:pb-24 md:pt-[calc(var(--header-height)+8rem)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 mask-fade-b">
        <div className="absolute left-1/2 top-[-45%] h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.11),transparent)]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <SystemPoster
          variant="order"
          idSuffix={id}
          className="h-[min(80vh,44rem)] w-auto max-w-none opacity-25"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_45%_at_center,rgb(5_6_10/0.7),transparent)]"
      />
      <div className="container-x flex flex-col items-center">
        <h1 className="max-w-4xl text-[clamp(2.4rem,1.2rem+4.6vw,5.6rem)] font-medium leading-[1] tracking-[-0.045em] text-ivory">
          <span className="hero-line">
            <span style={{ "--i": 0 } as React.CSSProperties}>
              <RichText text={title} />
            </span>
          </span>
        </h1>
        {lead ? (
          <p
            className="hero-fade mt-8 max-w-2xl text-lead text-mist"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {lead}
          </p>
        ) : null}
        {children ? (
          <div className="hero-fade mt-10" style={{ "--i": 3 } as React.CSSProperties}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
