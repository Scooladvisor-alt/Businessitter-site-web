"use client";

import { useRef } from "react";
import {
  BellRing,
  CalendarClock,
  Check,
  Copy,
  FileText,
  Mail,
  PhoneMissed,
  Receipt,
  UserCheck,
  Voicemail,
  type LucideIcon,
} from "lucide-react";
import { problem, type TaskIcon } from "@/content/home";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const ICONS: Record<TaskIcon, LucideIcon> = {
  phone: PhoneMissed,
  mail: Mail,
  file: FileText,
  copy: Copy,
  calendar: CalendarClock,
  bell: BellRing,
  voicemail: Voicemail,
  receipt: Receipt,
};

type Spot = { x: number; y: number; r: number };

/** Positions « en vrac » (fractions du plateau, depuis son centre). */
const CHAOS_DESKTOP: Spot[] = [
  { x: -0.3, y: -0.16, r: -6 },
  { x: 0.02, y: -0.2, r: 4 },
  { x: 0.3, y: -0.12, r: 7 },
  { x: -0.35, y: 0.06, r: 5 },
  { x: -0.06, y: 0.02, r: -3 },
  { x: 0.25, y: 0.1, r: -6 },
  { x: -0.18, y: 0.32, r: 8 },
  { x: 0.15, y: 0.34, r: -5 },
];

const CHAOS_MOBILE: Spot[] = [
  { x: -0.2, y: -0.2, r: -7 },
  { x: 0.18, y: -0.14, r: 6 },
  { x: -0.12, y: -0.02, r: 4 },
  { x: 0.2, y: 0.08, r: -5 },
  { x: -0.18, y: 0.26, r: 7 },
  { x: 0.14, y: 0.34, r: -6 },
];

/** Nombre de tâches déjà présentes à l'arrivée sur la séquence. */
const VISIBLE_AT_START = 3;

/**
 * Séquence 2 — Le constat. Scène « collante » (position: sticky) :
 * les tâches s'accumulent, la question est posée, puis tout se range.
 * Les états initiaux sont posés explicitement à l'hydratation : la scène
 * n'est jamais vide et ne dépend d'aucune préparation différée.
 */
export function ProblemSection() {
  const root = useRef<HTMLElement>(null);
  const autoCount = problem.tasks.filter((task) => task.status === "auto").length;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add({ desktop: MEDIA.desktop, motion: MEDIA.motion }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        section.dataset.motion = "on";

        const q = gsap.utils.selector(section);
        const track = q("[data-stage-track]")[0] as HTMLElement | undefined;
        const board = q("[data-board]")[0] as HTMLElement | undefined;
        const grid = q("[data-grid]")[0] as HTMLElement | undefined;
        const counterEl = q("[data-counter]")[0] as HTMLElement | undefined;
        if (!track || !board || !grid) return;

        let built: gsap.Context | null = null;

        const build = () => {
          built?.revert();
          built = gsap.context(() => {
            const cards = (q("[data-card]") as HTMLElement[]).filter(
              (card) => card.offsetParent !== null,
            );
            const spots = desktop ? CHAOS_DESKTOP : CHAOS_MOBILE;
            const spot = (i: number) => spots[i % spots.length] as Spot;
            const dx = (i: number) => {
              const card = cards[i] as HTMLElement;
              const center = grid.offsetLeft + card.offsetLeft + card.offsetWidth / 2;
              return board.offsetWidth * (0.5 + spot(i).x) - center;
            };
            const dy = (i: number) => {
              const card = cards[i] as HTMLElement;
              const center = grid.offsetTop + card.offsetTop + card.offsetHeight / 2;
              return board.offsetHeight * (0.5 + spot(i).y) - center;
            };

            const visible = cards.slice(0, VISIBLE_AT_START);
            const incoming = cards.slice(VISIBLE_AT_START);
            const autoVisible = cards.filter((card) => card.dataset.status === "auto").length;
            const setText = (selector: string, value: number) => {
              const el = q(selector)[0];
              if (el) el.textContent = String(value);
            };
            setText("[data-count-auto]", autoVisible);
            setText("[data-count-review]", cards.length - autoVisible);
            if (counterEl) counterEl.textContent = String(visible.length);

            // États initiaux, posés explicitement.
            gsap.set(cards, { x: dx, y: dy, rotation: (i) => spot(i).r, opacity: 1, scale: 1 });
            gsap.set(incoming, { opacity: 0, scale: 0.8 });
            gsap.set(q("[data-resolved]"), { opacity: 0, y: 6 });
            gsap.set(q("[data-chip-resolved]"), { opacity: 0, scale: 0.8 });
            gsap.set(q("[data-chip-pending]"), { opacity: 1 });
            gsap.set(q("[data-detail]"), { opacity: 1 });
            gsap.set(q("[data-text-a]"), { opacity: 1, y: 0 });
            gsap.set(q("[data-phrase]"), { opacity: 0, y: 24 });
            gsap.set(q("[data-text-b]"), { opacity: 0, y: 24 });
            gsap.set(q("[data-hud-pending]"), { opacity: 1 });
            gsap.set(q("[data-hud-resolved]"), { opacity: 0, y: 6 });
            gsap.set(q("[data-glow-warm]"), { opacity: 0.35 });
            gsap.set(q("[data-glow-cool]"), { opacity: 0 });

            const counter = { n: visible.length };
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.7 },
            });

            // 1. Les tâches s'accumulent.
            tl.to(
              incoming,
              { opacity: 1, scale: 1, duration: 0.5, stagger: 0.3, ease: "back.out(1.7)" },
              0.05,
            )
              .to(
                counter,
                {
                  n: cards.length,
                  duration: 0.3 * incoming.length + 0.3,
                  onUpdate: () => {
                    if (counterEl) counterEl.textContent = String(Math.round(counter.n));
                  },
                },
                0.05,
              )
              .to(q("[data-glow-warm]"), { opacity: 1, duration: 1.6 }, 0);

            // 2. La tension, puis la question.
            tl.to(
              cards,
              { rotation: (i) => spot(i).r * 1.6, duration: 0.5, ease: "sine.inOut" },
              1.7,
            )
              .to(q("[data-text-a]"), { opacity: 0, y: -24, duration: 0.5 }, 2)
              .to(cards, { opacity: 0.12, duration: 0.5 }, 2.05)
              .to(q("[data-hud-pending]"), { opacity: 0, duration: 0.3 }, 2.05)
              .to(q("[data-phrase]"), { opacity: 1, y: 0, duration: 0.6 }, 2.3)
              .to(q("[data-phrase]"), { opacity: 0, y: -24, duration: 0.5 }, 3.3);

            // 3. Tout se range ; vous gardez la main.
            tl.to(
              cards,
              {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.05,
                ease: "power3.inOut",
              },
              3.4,
            )
              .to(q("[data-detail]"), { opacity: 0, duration: 0.25, stagger: 0.05 }, 3.9)
              .to(q("[data-resolved]"), { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 }, 4)
              .to(q("[data-chip-pending]"), { opacity: 0, duration: 0.2, stagger: 0.05 }, 3.95)
              .to(
                q("[data-chip-resolved]"),
                { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" },
                4.05,
              )
              .to(q("[data-glow-warm]"), { opacity: 0, duration: 0.8 }, 3.5)
              .to(q("[data-glow-cool]"), { opacity: 1, duration: 1 }, 3.6)
              .to(q("[data-text-b]"), { opacity: 1, y: 0, duration: 0.6 }, 4.2)
              .to(q("[data-hud-resolved]"), { opacity: 1, y: 0, duration: 0.4 }, 4.4)
              .to({}, { duration: 0.8 });
          }, section);
        };

        build();

        // Recalcul complet si la largeur change (les positions dépendent du plateau).
        let width = window.innerWidth;
        let timer = 0;
        const onResize = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (window.innerWidth === width) return;
            width = window.innerWidth;
            build();
            ScrollTrigger.refresh();
          }, 200);
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          window.clearTimeout(timer);
          built?.revert();
          delete section.dataset.motion;
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="constat"
      data-problem
      aria-labelledby="constat-title"
      className="relative"
    >
      <div data-stage-track className="relative">
        <div
          data-stage
          className="relative flex flex-col items-center overflow-clip py-24 md:py-32 [[data-motion=on]_&]:pb-6 [[data-motion=on]_&]:pt-[calc(var(--header-height)+1.5rem)] md:[[data-motion=on]_&]:pb-10"
        >
          <div
            data-headline
            className="container-x flex max-w-4xl flex-col items-center gap-8 text-center"
          >
            <div data-text-a>
              <h2 id="constat-title" className="text-headline font-medium text-ivory">
                {problem.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lead text-mist">{problem.lead}</p>
            </div>
            <p
              data-phrase
              data-motion-only
              className="self-center text-[clamp(2rem,1.2rem+3.4vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ivory"
            >
              {problem.transition}
            </p>
            <p
              data-text-b
              className="self-center text-[clamp(1.75rem,1.1rem+2.6vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ivory"
            >
              {problem.resolvedTitle}
            </p>
          </div>

          <div
            data-board
            className="relative mt-12 flex w-full max-w-6xl items-center justify-center px-[clamp(1.25rem,4.2vw,3rem)] [[data-motion=on]_&]:mt-6 [[data-motion=on]_&]:min-h-0 [[data-motion=on]_&]:flex-1"
          >
            <div
              aria-hidden="true"
              data-motion-only
              className="pointer-events-none absolute inset-0"
            >
              <div
                data-glow-warm
                className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_143_104/0.16),transparent)]"
              />
              <div
                data-glow-cool
                className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.13),transparent)]"
              />
            </div>

            <div
              aria-hidden="true"
              data-motion-only
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
            >
              <p
                data-hud-pending
                className="surface flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.82rem] text-mist"
              >
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ring rounded-full bg-ember/60" />
                  <span className="relative size-2 rounded-full bg-ember" />
                </span>
                <span data-counter className="font-medium tabular-nums text-ivory">
                  {problem.tasks.length}
                </span>
                {problem.pending}
              </p>
              <p
                data-hud-resolved
                className="surface absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.82rem] text-mist"
              >
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-aqua" />
                  <span data-count-auto className="font-medium tabular-nums text-ivory">
                    {autoCount}
                  </span>
                  {problem.resolved.auto}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber" />
                  <span data-count-review className="font-medium tabular-nums text-ivory">
                    {problem.tasks.length - autoCount}
                  </span>
                  {problem.resolved.review}
                </span>
              </p>
            </div>

            <ul
              data-grid
              aria-label="Exemples de tâches du quotidien"
              className="relative grid w-full max-w-5xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4"
            >
              {problem.tasks.map((task, index) => {
                const Icon = ICONS[task.icon];
                const automated = task.status === "auto";
                return (
                  <li
                    key={task.label}
                    data-card
                    data-status={task.status}
                    className={cn(
                      "relative will-change-transform",
                      index >= 6 && "max-lg:[[data-motion=on]_&]:hidden",
                    )}
                  >
                    <div className="surface-raised flex h-full flex-col rounded-2xl p-3 text-left sm:p-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-ivory"
                        >
                          <Icon className="size-3.5" strokeWidth={1.7} />
                        </span>
                        <p className="text-[0.84rem] font-medium leading-tight text-ivory sm:text-[0.9rem]">
                          {task.label}
                        </p>
                      </div>
                      <div className="mt-2 grid text-[0.76rem] leading-snug sm:text-[0.8rem]">
                        <p data-detail className="text-dim [grid-area:1/1]">
                          {task.detail}
                        </p>
                        <p
                          data-resolved
                          className={cn(
                            "mt-1 [[data-motion=on]_&]:mt-0 [[data-motion=on]_&]:[grid-area:1/1]",
                            automated ? "text-aqua" : "text-amber",
                          )}
                        >
                          {task.resolved}
                        </p>
                      </div>
                      <div className="mt-3 grid justify-items-start">
                        <span
                          data-chip-pending
                          data-motion-only
                          className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 text-[0.7rem] font-medium text-ember [grid-area:1/1]"
                        >
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                          {problem.statusLabels.pending}
                        </span>
                        <span
                          data-chip-resolved
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium [grid-area:1/1]",
                            automated
                              ? "border-aqua/30 bg-aqua/10 text-aqua"
                              : "border-amber/30 bg-amber/10 text-amber",
                          )}
                        >
                          {automated ? (
                            <Check aria-hidden="true" className="size-3" strokeWidth={2.4} />
                          ) : (
                            <UserCheck aria-hidden="true" className="size-3" strokeWidth={2} />
                          )}
                          {problem.statusLabels[task.status]}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
