"use client";

import { useRef } from "react";
import { approach } from "@/content/home";
import { cta } from "@/content/site";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { observeLine, observeOnce } from "@/lib/observe";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { BuildVisual, IdentifyVisual, RecommendVisual, UnderstandVisual } from "./ApproachVisuals";

export function ApproachSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, (context) => {
        const timeline = section.querySelector<HTMLElement>("[data-timeline]");
        if (!timeline) return;

        // La ligne lumineuse progresse avec la lecture (préparée à l'approche).
        const fill = section.querySelector("[data-line-fill]");
        if (fill) gsap.set(fill, { scaleY: 0 });
        const setupLine = context.add("setupLine", () => {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: timeline,
                start: "top 62%",
                end: "bottom 62%",
                scrub: 0.5,
              },
            },
          );
        }) as () => void;
        const stopLineSetup = observeOnce(timeline, setupLine, "0px 0px 100% 0px");

        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
        const timelines = new Map<Element, gsap.core.Timeline>();
        const prepare = context.add("prepareStep", (step: HTMLElement) => {
          if (timelines.has(step)) return timelines.get(step);
          const q = gsap.utils.selector(step);
          const tl = gsap.timeline({ paused: true });
          const from = (selector: string, vars: gsap.TweenVars, position: number) => {
            const targets = q(selector);
            if (targets.length > 0) tl.from(targets, vars, position);
          };
          from(
            "[data-step-text] > *",
            { opacity: 0, y: 30, duration: 1, stagger: 0.07, ease: "expo.out" },
            0,
          );
          from(
            "[data-step-visual]",
            { opacity: 0, y: 50, rotateX: 8, duration: 1.3, ease: "expo.out" },
            0.1,
          );
          from(
            "[data-v-item]",
            { opacity: 0, x: -14, duration: 0.6, stagger: 0.08, ease: "power3.out" },
            0.45,
          );
          from(
            "[data-v-check]",
            { scale: 0, duration: 0.4, stagger: 0.12, ease: "back.out(2.4)" },
            0.8,
          );
          from(
            "[data-v-node]",
            { opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.1, ease: "back.out(1.8)" },
            0.4,
          );
          from("[data-v-glow]", { opacity: 0, scale: 1.4, duration: 0.6, stagger: 0.15 }, 1.0);
          from(
            "[data-v-meter]",
            { scaleX: 0, duration: 1, stagger: 0.12, ease: "power3.out" },
            1.0,
          );
          from("[data-v-progress]", { scaleY: 0, duration: 1.6, ease: "power2.inOut" }, 0.6);
          tl.progress(1, true).progress(0, true);
          timelines.set(step, tl);
          return tl;
        }) as (step: HTMLElement) => gsap.core.Timeline | undefined;

        // Chaque étape est préparée juste avant d'entrer dans la fenêtre…
        const stopPrepare = steps.map((step) =>
          observeOnce(step, () => prepare(step), "0px 0px 30% 0px"),
        );

        // …et s'anime lorsque la ligne lumineuse l'atteint.
        const stopLine = observeLine(steps, 0.62, (entry) => {
          const step = entry.target as HTMLElement;
          const reached =
            entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.62;
          step.toggleAttribute("data-reached", reached);
          if (reached) prepare(step)?.play();
        });
        return () => {
          stopLine();
          stopLineSetup();
          stopPrepare.forEach((stop) => stop());
        };
      });

      // Sans animation : toutes les étapes sont « atteintes ».
      mm.add(MEDIA.reduced, () => {
        section
          .querySelectorAll("[data-step]")
          .forEach((step) => step.setAttribute("data-reached", ""));
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
      className="relative overflow-clip py-24 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[20%] top-[20%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.07),transparent)]"
      />
      <div className="container-x relative">
        <header className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow tone="aube">{approach.eyebrow}</Eyebrow>
            <SplitHeading
              id="approche-title"
              text={approach.title}
              className="mt-6 text-headline font-medium text-ivory"
            />
          </div>
          <Reveal as="p" className="text-lead text-mist lg:col-span-4 lg:self-end" delay={0.2}>
            {approach.subtitle}
          </Reveal>
        </header>

        <ol data-timeline className="relative mt-20 md:mt-28">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[15px] top-0 w-px bg-white/[0.08] md:left-[23px]"
          />
          <span
            data-line-fill
            aria-hidden="true"
            className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-[linear-gradient(to_bottom,#ffc88f,#f3a9b2_35%,#bab5f2_65%,#86e6da)] shadow-[0_0_14px_1px_rgb(186_181_242/0.55)] md:left-[23px]"
          />

          {approach.steps.map((step, index) => (
            <li
              key={step.number}
              data-step
              className="group/step relative grid gap-10 pb-20 pl-12 last:pb-0 md:pb-32 md:pl-20 lg:grid-cols-12 lg:gap-14"
            >
              <span
                aria-hidden="true"
                className="absolute left-[7px] top-1 flex size-[17px] items-center justify-center rounded-full border border-white/20 bg-ink-950 transition-[border-color,box-shadow] duration-700 group-data-[reached]/step:border-aqua/70 group-data-[reached]/step:shadow-[0_0_22px_2px_rgb(134_230_218/0.55)] md:left-[15px]"
              >
                <span className="size-[7px] rounded-full bg-white/25 transition-colors duration-700 group-data-[reached]/step:bg-aqua" />
              </span>

              <div data-step-text className="lg:col-span-5">
                <p className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-dim">{step.number}</span>
                  <span className="eyebrow text-amber">{step.label}</span>
                </p>
                <h3 className="mt-5 text-title font-medium text-ivory">{step.title}</h3>
                <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-mist">
                  {step.description}
                </p>
                {step.list.length > 0 && index !== 0 && index !== 2 ? (
                  <ul className="mt-5 space-y-2">
                    {step.list.map((item) => (
                      <li key={item} className="text-mist">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {step.list.length > 0 && (index === 0 || index === 2) ? (
                  <ul className="sr-only">
                    {step.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {step.note ? (
                  <p className="mt-6 max-w-lg border-l border-lilac/40 pl-4 text-[0.92rem] leading-relaxed text-lilac/90">
                    {step.note}
                  </p>
                ) : null}
              </div>

              <div
                data-step-visual
                className="lg:col-span-6 lg:col-start-7 [perspective:1200px]"
                aria-hidden="true"
              >
                {index === 0 ? <UnderstandVisual items={step.list} /> : null}
                {index === 1 ? <IdentifyVisual /> : null}
                {index === 2 ? <RecommendVisual items={step.list} /> : null}
                {index === 3 ? <BuildVisual /> : null}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-24 flex flex-col items-center text-center md:mt-36">
          <Reveal
            as="p"
            className="max-w-4xl text-[clamp(1.75rem,1.1rem+2.6vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ivory"
          >
            <RichText text={approach.conclusion} />
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
