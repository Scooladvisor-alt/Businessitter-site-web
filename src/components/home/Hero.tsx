"use client";

import { useRef } from "react";
import { hero } from "@/content/home";
import { cta } from "@/content/site";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { SystemPoster } from "@/components/system/SystemPoster";

/**
 * Séquence 1 — Ouverture. Titre centré sur le système 3D ; au défilement,
 * le texte s'efface pendant que des connexions se créent et que des flux
 * s'organisent. Le titre est animé en CSS dès le premier rendu.
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
        tl.to("[data-hero-cue]", { opacity: 0, duration: 0.08 }, 0)
          .to("[data-hero-content]", { y: -60, scale: 0.96, opacity: 0.06, duration: 0.34 }, 0.04)
          .to("[data-hero-veil]", { opacity: 0.4, duration: 0.34 }, 0.04);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="accueil"
      data-backdrop="hero"
      aria-labelledby="hero-title"
      className="relative h-[100svh] motion-safe:h-[150svh]"
    >
      <div className="sticky top-0 isolate flex h-[100svh] items-center justify-center overflow-clip">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 mask-fade-b">
          <div className="absolute left-1/2 top-[-38%] h-[85vh] w-[85vh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.12),transparent)]" />
          <div className="absolute bottom-[-45%] left-1/2 h-[90vh] w-[130vh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.08),transparent)]" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        >
          <SystemPoster
            variant="chaos"
            idSuffix="hero"
            className="h-[64svh] w-auto max-w-none opacity-60 md:h-[86vh]"
          />
        </div>

        <div
          data-hero-veil
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_42%_at_center,rgb(5_6_10/0.78),transparent)]"
        />

        <div
          data-hero-content
          className="container-x relative flex flex-col items-center pt-[var(--header-height)] text-center"
        >
          <h1 id="hero-title" className="text-display font-medium text-ivory">
            {hero.titleLines.map((line, index) => (
              <span key={line} className="hero-line">
                <span style={{ "--i": index } as React.CSSProperties}>
                  <RichText text={line} />
                </span>
              </span>
            ))}
          </h1>

          <div
            className="hero-fade mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row md:mt-14"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <ButtonLink href="#audit" size="lg" className="w-full sm:w-auto">
              {cta.primary}
            </ButtonLink>
            <ButtonLink
              href="#approche"
              variant="secondary"
              size="lg"
              arrow={false}
              className="w-full sm:w-auto"
            >
              {cta.secondary}
            </ButtonLink>
          </div>
        </div>

        <div
          data-hero-cue
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <div className="hero-fade" style={{ "--i": 6 } as React.CSSProperties}>
            <span className="relative block h-12 w-px overflow-hidden bg-white/10">
              <span className="absolute inset-0 block animate-scroll-cue bg-ivory/70" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
