"use client";

import { useEffect, useRef, useState } from "react";
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
import { MEDIA } from "@/lib/gsap";
import { observeLine } from "@/lib/observe";
import { cn } from "@/lib/cn";
import { scrollToTarget } from "@/lib/scroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
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

export function PossibilitiesSection() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const useCases = possibilities.useCases;
  const current = useCases[active] ?? useCases[0];

  // Mise à l'échelle du plan de travail des scènes.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / ARTBOARD.width, height / ARTBOARD.height, 1.32);
      el.style.setProperty("--scene-scale", String(Math.max(0.5, scale * 0.94)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cas d'usage actif : celui qui franchit une ligne virtuelle de la fenêtre.
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-usecase]"));
    const desktop = window.matchMedia(MEDIA.desktop);
    let stopLine = () => {};
    const bind = () => {
      stopLine();
      stopLine = observeLine(steps, desktop.matches ? 0.55 : 0.78, (entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      });
    };
    bind();
    desktop.addEventListener("change", bind);

    const container = section.querySelector("[data-usecases]");
    const visibility = new IntersectionObserver(([entry]) =>
      setInView(Boolean(entry?.isIntersecting)),
    );
    if (container) visibility.observe(container);

    return () => {
      stopLine();
      desktop.removeEventListener("change", bind);
      visibility.disconnect();
    };
  }, []);

  const goTo = (index: number) => {
    const key = useCases[index]?.key;
    if (key) scrollToTarget(`possible-${key}`, { focus: false, offset: window.innerHeight * 0.3 });
  };

  return (
    <section
      ref={root}
      id="possibles"
      aria-labelledby="possibles-title"
      className="relative overflow-x-clip py-24 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[8vh] h-[70vh] w-[110vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(186_181_242/0.07),transparent)]"
      />
      <div className="container-x relative">
        <header className="max-w-4xl">
          <Eyebrow tone="aube">{possibilities.eyebrow}</Eyebrow>
          <SplitHeading
            id="possibles-title"
            text={possibilities.title}
            className="mt-6 text-headline font-medium text-ivory"
          />
          <Reveal as="p" className="mt-6 max-w-2xl text-lead text-mist" delay={0.15}>
            {possibilities.subtitle}
          </Reveal>
        </header>

        <div data-usecases className="relative mt-14 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Scène collante */}
          <div className="sticky top-[var(--header-height)] z-10 -mx-[clamp(1.25rem,4.2vw,3rem)] bg-ink-950 px-[clamp(1.25rem,4.2vw,3rem)] pb-4 pt-3 lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-var(--header-height)-3rem)] lg:self-start lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-10 h-10 bg-gradient-to-b from-ink-950 to-transparent lg:hidden"
            />
            <div className="flex h-[min(54svh,440px)] flex-col lg:h-full">
              <nav aria-label="Cas d'usage" className="mb-3 lg:mb-5">
                <ol className="relative flex items-center justify-between gap-1 lg:gap-2">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-white/10"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 h-px origin-left -translate-y-1/2 bg-[linear-gradient(90deg,#ffc88f,#86e6da)] transition-transform duration-700 ease-out-expo"
                    style={{
                      width: "calc(100% - 2rem)",
                      transform: `translateY(-50%) scaleX(${useCases.length > 1 ? active / (useCases.length - 1) : 1})`,
                    }}
                  />
                  {useCases.map((useCase, index) => {
                    const Icon = ICONS[useCase.key];
                    const isActive = index === active;
                    return (
                      <li key={useCase.key} className="relative">
                        <button
                          type="button"
                          onClick={() => goTo(index)}
                          aria-current={isActive ? "step" : undefined}
                          aria-label={useCase.title}
                          className={cn(
                            "relative flex size-9 items-center justify-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-500 lg:size-11",
                            isActive
                              ? "border-aqua/60 bg-ink-800 text-ivory shadow-[0_0_30px_-4px_rgb(134_230_218/0.6)]"
                              : index < active
                                ? "border-white/20 bg-ink-900 text-mist hover:text-ivory"
                                : "border-white/10 bg-ink-900 text-dim hover:text-ivory",
                          )}
                        >
                          <Icon
                            className="size-4 lg:size-[18px]"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div
                data-stage-frame
                data-reveal=""
                aria-hidden="true"
                className="surface relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-stage)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 lg:px-5">
                  <p className="flex min-w-0 items-center gap-2 text-[0.8rem] text-ivory lg:text-sm">
                    <span className="font-mono text-[0.7rem] text-dim">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{current?.title}</span>
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-mist">
                    <span className="size-1.5 animate-pulse-soft rounded-full bg-aqua" />
                    {possibilities.stageStatus}
                  </span>
                </div>
                <div ref={viewport} className="relative min-h-0 flex-1">
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
              </div>
            </div>
          </div>

          {/* Cas d'usage */}
          <ol className="relative mt-6 lg:order-1 lg:col-span-5 lg:mt-0">
            {useCases.map((useCase, index) => {
              const Icon = ICONS[useCase.key];
              const isActive = index === active;
              return (
                <li
                  key={useCase.key}
                  id={`possible-${useCase.key}`}
                  data-usecase
                  data-index={index}
                  className="flex min-h-[68svh] items-center py-10 lg:min-h-[86vh] lg:py-0"
                >
                  <div
                    data-usecase-content
                    data-reveal-children=""
                    className="relative pl-5"
                    style={{ "--reveal-stagger": "0.08s" } as React.CSSProperties}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-1 left-0 top-1 w-px origin-top transition-[transform,background-color] duration-700 ease-out-expo",
                        isActive
                          ? "scale-y-100 bg-[linear-gradient(to_bottom,#ffc88f,#86e6da)]"
                          : "scale-y-100 bg-white/10 lg:scale-y-50",
                      )}
                    />
                    <p className="flex items-center gap-3 font-mono text-xs tracking-[0.14em] text-dim">
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border transition-colors duration-700",
                          isActive ? "border-aqua/50 text-aqua" : "border-white/12 text-ivory",
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(useCases.length).padStart(2, "0")}
                    </p>
                    <h3
                      className={cn(
                        "mt-6 text-title font-medium transition-colors duration-700",
                        isActive ? "text-ivory" : "text-ivory lg:text-mist",
                      )}
                    >
                      {useCase.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-4 max-w-md text-[1.02rem] leading-relaxed transition-colors duration-700",
                        isActive ? "text-mist" : "text-mist lg:text-dim",
                      )}
                    >
                      {useCase.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {useCase.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.8rem] text-mist"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-16 md:mt-28">
          <Reveal>
            <AutomationPrompt />
          </Reveal>
        </div>

        <Reveal
          as="p"
          className="mx-auto mt-24 max-w-4xl text-center text-[clamp(1.75rem,1.1rem+2.6vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ivory md:mt-36"
        >
          <RichText text={possibilities.conclusion} />
        </Reveal>
      </div>
    </section>
  );
}
