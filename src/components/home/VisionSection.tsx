"use client";

import { useRef } from "react";
import { vision } from "@/content/home";
import { gsap, MEDIA, SplitText, useGSAP } from "@/lib/gsap";
import { observeOnce } from "@/lib/observe";
import { SystemPoster } from "@/components/system/SystemPoster";

/**
 * Séquence 8 — Vision. Le système du hero réapparaît, désormais organisé ;
 * le message se révèle mot à mot au rythme du défilement.
 */
export function VisionSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, (context) => {
        const title = section.querySelector<HTMLElement>("[data-vision-title]");
        if (!title) return;
        let split: SplitText | null = null;
        // Préparé à l'approche de la séquence seulement.
        const setup = context.add("setupVision", () => {
          split = SplitText.create(title, { type: "words", wordsClass: "vision-word" });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });
          tl.fromTo(
            split.words,
            { opacity: 0.12 },
            { opacity: 1, stagger: 0.12, duration: 0.5, ease: "none" },
            0,
          )
            .fromTo(
              "[data-vision-text]",
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, stagger: 0.25, duration: 0.6 },
              ">-0.2",
            )
            .to({}, { duration: 0.4 });
        }) as () => void;
        const stop = observeOnce(section, setup, "0px 0px 120% 0px");
        return () => {
          stop();
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="vision"
      data-backdrop="vision"
      aria-labelledby="vision-title"
      className="relative h-auto motion-safe:h-[180svh]"
    >
      <div className="relative flex min-h-[100svh] items-center overflow-clip py-28 motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh] motion-safe:py-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <SystemPoster
            variant="order"
            idSuffix="vision"
            className="h-[86svh] w-auto max-w-none opacity-45"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(5_6_10/0.62)_10%,transparent_65%)]"
        />
        <div className="container-x relative text-center">
          <h2
            id="vision-title"
            data-vision-title
            className="mx-auto max-w-5xl text-[clamp(2.3rem,1.1rem+4.6vw,5.8rem)] font-medium leading-[1.02] tracking-[-0.045em] text-ivory"
          >
            {vision.title}
          </h2>
          <div className="mx-auto mt-10 max-w-2xl space-y-4 text-lead text-mist">
            {vision.paragraphs.map((paragraph) => (
              <p key={paragraph} data-vision-text>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
