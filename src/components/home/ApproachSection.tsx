"use client";

import { useRef } from "react";
import { approach } from "@/content/home";
import { cta } from "@/content/site";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { observeLine } from "@/lib/observe";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StepArt } from "./StepArt";

/** Seuils de progression de la ligne auxquels chaque étape s'allume. */
const THRESHOLDS = [0.02, 0.34, 0.67, 0.98];

/**
 * Séquence 4 — Notre approche. Quatre étapes centrées, reliées par une
 * ligne lumineuse qui progresse au défilement ; chaque étape atteinte
 * s'allume et joue sa petite illustration.
 */
export function ApproachSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
      const list = section.querySelector<HTMLElement>("[data-steps]");
      const mm = gsap.matchMedia();

      // Ordinateur : la ligne horizontale guide la lecture.
      mm.add({ desktop: MEDIA.desktop, motion: MEDIA.motion }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!desktop || !motion || !list) return;
        const reach = (progress: number) =>
          steps.forEach((step, index) =>
            step.toggleAttribute("data-reached", progress >= (THRESHOLDS[index] ?? 1)),
          );
        gsap.fromTo(
          "[data-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 72%",
              end: "bottom 58%",
              scrub: 0.5,
              onUpdate: (self) => reach(self.progress),
              onRefresh: (self) => reach(self.progress),
            },
          },
        );
      });

      // Mobile : chaque étape s'allume en passant le milieu de l'écran.
      mm.add({ mobile: MEDIA.mobile, motion: MEDIA.motion }, (context) => {
        const { mobile, motion } = context.conditions as { mobile: boolean; motion: boolean };
        if (!mobile || !motion) return;
        return observeLine(steps, 0.7, (entry) => {
          const reached =
            entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.7;
          entry.target.toggleAttribute("data-reached", reached);
        });
      });

      // Sans animation : tout est affiché.
      mm.add(MEDIA.reduced, () => {
        steps.forEach((step) => step.setAttribute("data-reached", ""));
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="approche"
      aria-labelledby="approche-title"
      className="relative overflow-clip py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.06),transparent)]"
      />
      <div className="container-x relative">
        <header className="mx-auto max-w-3xl text-center">
          <SplitHeading
            id="approche-title"
            text={approach.title}
            className="text-headline font-medium text-ivory"
          />
          <Reveal as="p" className="mx-auto mt-6 max-w-xl text-lead text-mist" delay={0.1}>
            {approach.subtitle}
          </Reveal>
        </header>

        <ol
          data-steps
          className="relative mx-auto mt-16 grid max-w-6xl gap-4 md:mt-24 lg:grid-cols-4 lg:gap-8"
        >
          <span
            aria-hidden="true"
            className="absolute left-[calc((100%-6rem)/8)] right-[calc((100%-6rem)/8)] top-[2.75rem] hidden h-px bg-white/10 lg:block"
          />
          <span
            data-line
            aria-hidden="true"
            className="absolute left-[calc((100%-6rem)/8)] right-[calc((100%-6rem)/8)] top-[2.75rem] hidden h-px origin-left bg-[linear-gradient(90deg,#ffc88f,#f3a9b2_35%,#bab5f2_65%,#86e6da)] shadow-[0_0_14px_1px_rgb(186_181_242/0.55)] lg:block"
          />

          {approach.steps.map((step, index) => (
            <li
              key={step.title}
              data-step
              className="group/step relative flex flex-col items-center text-center"
            >
              <span className="relative z-10 flex size-[5.5rem] items-center justify-center rounded-full border border-white/12 bg-ink-950 transition-[border-color,box-shadow] duration-700 group-data-[reached]/step:border-aqua/50 group-data-[reached]/step:shadow-[0_0_40px_-6px_rgb(134_230_218/0.5)]">
                <StepArt index={index} />
              </span>
              <h3 className="mt-6 text-[1.45rem] font-medium tracking-[-0.025em] text-ivory">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[17rem] text-[0.98rem] leading-relaxed text-mist">
                {step.text}
              </p>
              {index < approach.steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="mt-8 block h-10 w-px bg-[linear-gradient(to_bottom,rgb(255_255_255/0.2),transparent)] lg:hidden"
                />
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-24 flex flex-col items-center text-center md:mt-32">
          <Reveal
            as="p"
            className="max-w-3xl text-[clamp(1.75rem,1.1rem+2.4vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ivory"
          >
            {approach.conclusion}
          </Reveal>
          <Reveal className="mt-10" delay={0.15}>
            <ButtonLink href="#audit" size="lg">
              {cta.primary}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
