"use client";

import { useRef } from "react";
import { gsap, MEDIA, SplitText, useGSAP } from "@/lib/gsap";
import { observeOnce } from "@/lib/observe";
import { RichText } from "@/components/ui/RichText";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
  delay?: number;
};

/**
 * Titre révélé ligne par ligne (lignes masquées). Masqué en CSS jusqu'à
 * son approche, puis découpé et animé : aucune mesure au chargement.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  id,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, (context) => {
        let split: SplitText | null = null;
        let played = false;
        const reveal = context.add("reveal", () => {
          // Déjà visible au démarrage : aucune animation.
          if (el.hasAttribute("data-split-done")) return;
          split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            linesClass: "split-line",
            onSplit(self) {
              el.setAttribute("data-split-done", "");
              if (played) return;
              played = true;
              return gsap.from(self.lines, {
                yPercent: 112,
                duration: 1.25,
                delay,
                stagger: 0.09,
                ease: "expo.out",
              });
            },
          });
        }) as () => void;
        const stop = observeOnce(el, reveal, "0px 0px -8% 0px");
        return () => {
          stop();
          split?.revert();
        };
      });
      return () => {
        mm.revert();
        el.setAttribute("data-split-done", "");
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-split="">
      <RichText text={text} />
    </Tag>
  );
}
