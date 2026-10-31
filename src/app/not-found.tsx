import type { Metadata } from "next";
import { notFoundPage } from "@/content/pages";
import { cta } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { SystemPoster } from "@/components/system/SystemPoster";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      data-backdrop="page-hero"
      className="relative flex min-h-[100svh] items-center overflow-clip pb-20 pt-[calc(var(--header-height)+3rem)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <SystemPoster
          variant="chaos"
          idSuffix="not-found"
          className="h-[80svh] w-auto max-w-none opacity-30"
        />
      </div>
      <div className="container-x relative flex flex-col items-center text-center">
        <p className="hero-fade text-sm text-dim" style={{ "--i": 0 } as React.CSSProperties}>
          Erreur 404
        </p>
        <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,1.2rem+4.6vw,5.6rem)] font-medium leading-[1] tracking-[-0.045em] text-ivory">
          <span className="hero-line">
            <span style={{ "--i": 1 } as React.CSSProperties}>
              <RichText text={notFoundPage.title} />
            </span>
          </span>
        </h1>
        <p
          className="hero-fade mx-auto mt-8 max-w-xl text-lead text-mist"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {notFoundPage.text}
        </p>
        <div
          className="hero-fade mt-10 flex flex-col items-center gap-3 sm:flex-row"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <ButtonLink href="/" size="lg">
            {notFoundPage.home}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg" arrow={false}>
            {cta.primary}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
