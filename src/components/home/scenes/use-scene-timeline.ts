"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, MEDIA } from "@/lib/gsap";

type Builder = (tl: gsap.core.Timeline, q: (selector: string) => Element[]) => void;

/**
 * Boucle d'animation d'une scène illustrative, créée à sa première
 * activation seulement (rien n'est préparé tant que la scène n'est pas
 * affichée). Sous « mouvements réduits », l'état final reste affiché.
 */
export function useSceneTimeline(
  scope: RefObject<HTMLElement | null>,
  active: boolean,
  build: Builder,
  { repeatDelay = 1.8 }: { repeatDelay?: number } = {},
) {
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const context = useRef<gsap.Context | null>(null);
  const builder = useRef(build);

  useEffect(() => {
    builder.current = build;
  });

  useEffect(() => {
    if (!active) {
      timeline.current?.pause();
      return;
    }
    if (window.matchMedia(MEDIA.reduced).matches || !scope.current) return;
    if (!timeline.current) {
      context.current = gsap.context(() => {
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay });
        builder.current(tl, gsap.utils.selector(scope.current));
        tl.progress(1, true).progress(0, true);
        timeline.current = tl;
      }, scope.current);
    }
    timeline.current?.play(0);
  }, [active, scope, repeatDelay]);

  useEffect(
    () => () => {
      context.current?.revert();
      context.current = null;
      timeline.current = null;
    },
    [],
  );
}
