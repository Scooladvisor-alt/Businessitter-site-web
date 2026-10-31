"use client";

import { useRef } from "react";
import { hero } from "@/content/home";
import { cta } from "@/content/site";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { SystemPoster } from "@/components/system/SystemPoster";

/**
 * Séquence 1 — Hero cinématique.
 * Le titre est animé en CSS dès le premier rendu (LCP préservé) ;
 * au défilement, le contenu s'efface pendant que le système 3D se
 * transforme : des connexions se créent, des flux s'organisent.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        tl.to("[data-hero-cue]", { autoAlpha: 0, duration: 0.08 }, 0)
          .to("[data-hero-content]", { y: -70, autoAlpha: 0.08, duration: 0.32 }, 0.04)
          .to("[data-hero-glow]", { scale: 1.25, autoAlpha: 0.35, duration: 0.6 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="accueil"
      aria-labelledby="hero-title"
      className="relative h-[100svh] motion-safe:h-[150svh]"
    >
      <div className="sticky top-0 isolate flex h-[100svh] flex-col overflow-clip">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 mask-fade-b">
          <div
            data-hero-glow
            className="absolute -left-[20%] -top-[30%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.13),transparent)]"
          />
          <div
            data-hero-glow
            className="absolute -bottom-[35%] -right-[15%] h-[90vh] w-[90vh] rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.09),transparent)]"
          />
          <div className="bg-grid absolute inset-0 opacity-50 mask-radial" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex items-end justify-center pb-[6svh] md:items-center md:justify-end md:pb-0 md:pr-[2vw]"
        >
          <SystemPoster
            variant="chaos"
            idSuffix="hero"
            className="h-[48svh] w-auto max-w-none opacity-70 md:h-[78vh] md:translate-x-[6%] md:opacity-90"
          />
        </div>

        <div
          data-hero-content
          className="container-x relative flex flex-1 flex-col justify-center pb-24 pt-[calc(var(--header-height)+2.5rem)] md:pb-20"
        >
          <p
            className="hero-fade eyebrow inline-flex items-center gap-3 text-mist"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ring rounded-full bg-aqua/60" />
              <span className="relative size-2 rounded-full bg-aqua" />
            </span>
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="mt-7 max-w-[17ch] text-display font-medium text-ivory">
            {hero.titleLines.map((line, index) => (
              <span key={line} className="hero-line">
                <span style={{ "--i": index } as React.CSSProperties}>
                  <RichText text={line} />
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-fade mt-7 max-w-[36rem] text-lead text-mist md:mt-9"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            {hero.subtitle}
          </p>

          <div
            className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-11"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <ButtonLink href="#audit" size="lg">
              {cta.primary}
            </ButtonLink>
            <ButtonLink href="#approche" variant="secondary" size="lg" arrow={false}>
              {cta.secondary}
            </ButtonLink>
          </div>

          <ul
            aria-label="Domaines d'intervention"
            className="hero-fade mt-12 hidden flex-wrap gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim sm:flex md:mt-16"
            style={{ "--i": 5 } as React.CSSProperties}
          >
            {hero.capabilities.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1 rounded-full bg-amber/80" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-hero-cue
          aria-hidden="true"
          className="absolute bottom-8 right-[clamp(1.25rem,4.2vw,3rem)] hidden md:block"
        >
          <div
            className="hero-fade flex flex-col items-end gap-3"
            style={{ "--i": 6 } as React.CSSProperties}
          >
            <span className="eyebrow text-dim">{hero.scrollCue}</span>
            <span className="relative block h-10 w-px overflow-hidden bg-white/10">
              <span className="absolute inset-0 block animate-scroll-cue bg-ivory/80" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
