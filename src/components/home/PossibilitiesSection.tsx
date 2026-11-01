"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Blocks,
  HeartHandshake,
  Mails,
  PhoneCall,
  ReceiptText,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { possibilities, type SceneKey } from "@/content/home";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { RichText } from "@/components/ui/RichText";
import { AutomationPrompt } from "./AutomationPrompt";
import { PhoneScene } from "./scenes/PhoneScene";
import { InboxScene } from "./scenes/InboxScene";
import { DocsScene } from "./scenes/DocsScene";
import { OpsScene } from "./scenes/OpsScene";
import { JourneyScene } from "./scenes/JourneyScene";
import { CustomScene } from "./scenes/CustomScene";

const ICONS: Record<SceneKey, LucideIcon> = {
  phone: PhoneCall,
  mail: Mails,
  docs: ReceiptText,
  ops: Workflow,
  journey: HeartHandshake,
  custom: Blocks,
};

const SCENES: Record<SceneKey, React.ComponentType<{ active: boolean }>> = {
  phone: PhoneScene,
  mail: InboxScene,
  docs: DocsScene,
  ops: OpsScene,
  journey: JourneyScene,
  custom: CustomScene,
};

const ARTBOARD = { width: 440, height: 400 };
/** Durée d'affichage de chaque scène en lecture automatique (ms). */
const DURATION = 7500;

/**
 * Séquence 3 — Le champ des possibles. Vitrine centrée : six cas d'usage,
 * chacun illustré par une interface animée. Lecture automatique tant que la
 * scène est visible (pause au survol, au focus et en mouvements réduits).
 */
export function PossibilitiesSection() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const tablist = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const panelId = useId();
  const useCases = possibilities.useCases;
  const autoplay = inView && !paused && !reduced;

  // Mise à l'échelle du plan de travail des scènes.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / ARTBOARD.width, height / ARTBOARD.height, 1.4);
      el.style.setProperty("--scene-scale", String(Math.max(0.5, scale * 0.92)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Les animations ne tournent que si la scène est à l'écran.
  useEffect(() => {
    const frame = root.current?.querySelector("[data-stage-frame]");
    if (!frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Lecture automatique.
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % useCases.length),
      DURATION,
    );
    return () => window.clearTimeout(timer);
  }, [autoplay, active, useCases.length]);

  // L'onglet actif reste visible dans la barre (défilement horizontal seulement).
  useEffect(() => {
    const list = tablist.current;
    const tab = tabs.current[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.clientWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, reduced]);

  const select = (index: number, focus = false) => {
    const next = (index + useCases.length) % useCases.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: useCases.length - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target, true);
  };

  return (
    <section
      ref={root}
      id="possibles"
      data-backdrop="possibles"
      aria-labelledby="possibles-title"
      className="relative overflow-x-clip py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[30%] h-[70vh] w-[110vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(186_181_242/0.07),transparent)]"
      />
      <div className="container-x relative">
        <header className="mx-auto max-w-6xl text-center">
          <SplitHeading
            id="possibles-title"
            text={possibilities.title}
            className="text-headline font-medium text-ivory"
          />
        </header>

        <div
          className="mt-14 md:mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={tablist}
            role="tablist"
            aria-label="Exemples de solutions"
            onKeyDown={onKeyDown}
            className="-mx-[clamp(1.25rem,4.2vw,3rem)] flex gap-2 overflow-x-auto px-[clamp(1.25rem,4.2vw,3rem)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {useCases.map((useCase, index) => {
              const Icon = ICONS[useCase.key];
              const selected = index === active;
              return (
                <button
                  key={useCase.key}
                  ref={(el) => {
                    tabs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${panelId}-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-[0.9rem] transition-colors duration-300",
                    selected
                      ? "border-white/20 bg-white/[0.08] text-ivory"
                      : "border-white/[0.08] text-mist hover:border-white/15 hover:text-ivory",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
                  {useCase.tab}
                  {selected && autoplay ? (
                    <span
                      key={`progress-${active}`}
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-0 h-px origin-left animate-[tab-progress_7.5s_linear_forwards] bg-[linear-gradient(90deg,#ffc88f,#86e6da)]"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${panelId}-tab-${active}`}
            className="mx-auto mt-8 max-w-5xl"
          >
            <div
              data-stage-frame
              data-reveal=""
              aria-hidden="true"
              className="surface relative aspect-[4/5] overflow-hidden rounded-[var(--radius-stage)] sm:aspect-[16/11] lg:aspect-[16/9]"
            >
              <div ref={viewport} className="absolute inset-0">
                <div className="bg-grid absolute inset-0 opacity-40 mask-radial" />
                {useCases.map((useCase, index) => {
                  const Scene = SCENES[useCase.key];
                  const isActive = index === active;
                  return (
                    <div
                      key={useCase.key}
                      data-scene-active={isActive && inView ? "" : undefined}
                      className={cn(
                        "scene absolute inset-0 transition-[opacity,visibility,transform] duration-700 ease-out-expo",
                        isActive ? "visible opacity-100" : "invisible scale-[0.97] opacity-0",
                      )}
                    >
                      <Scene active={isActive && inView} />
                    </div>
                  );
                })}
              </div>
              <span className="absolute bottom-3 right-4 text-[0.72rem] text-dim">
                {possibilities.caption}
              </span>
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl text-center">
              {useCases.map((useCase, index) => {
                const isActive = index === active;
                return (
                  <div
                    key={useCase.key}
                    aria-hidden={!isActive}
                    className={cn(
                      "transition-[opacity,transform] duration-500 ease-out-expo [grid-area:1/1]",
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0",
                    )}
                  >
                    <h3 className="text-[clamp(1.6rem,1.2rem+1.5vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ivory">
                      <RichText text={useCase.title} />
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-3xl md:mt-36">
          <AutomationPrompt />
        </div>

        <Reveal
          as="p"
          className="mx-auto mt-24 max-w-5xl text-balance text-center text-[clamp(2rem,1.1rem+3.2vw,4rem)] font-medium leading-[1.04] tracking-[-0.038em] text-ivory md:mt-36"
        >
          <RichText text={possibilities.conclusion} />
        </Reveal>
      </div>
    </section>
  );
}
