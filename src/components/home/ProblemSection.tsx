"use client";

import { useRef } from "react";
import {
  BellRing,
  CalendarClock,
  Check,
  Copy,
  FileText,
  Mail,
  PhoneIncoming,
  Receipt,
  UserCheck,
  Voicemail,
  type LucideIcon,
} from "lucide-react";
import { problem, type TaskIcon } from "@/content/home";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { whenIdle } from "@/lib/observe";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";

const ICONS: Record<TaskIcon, LucideIcon> = {
  phone: PhoneIncoming,
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
  { x: -0.2, y: -0.3, r: -6 },
  { x: 0.2, y: -0.25, r: 5 },
  { x: -0.04, y: -0.09, r: 3 },
  { x: 0.25, y: 0.03, r: -4 },
  { x: -0.25, y: 0.1, r: 7 },
  { x: 0.07, y: 0.22, r: -6 },
  { x: -0.13, y: 0.34, r: 4 },
  { x: 0.27, y: 0.34, r: -8 },
];

const CHAOS_MOBILE: Spot[] = [
  { x: -0.2, y: -0.3, r: -7 },
  { x: 0.18, y: -0.2, r: 6 },
  { x: -0.06, y: -0.06, r: 3 },
  { x: 0.22, y: 0.06, r: -5 },
  { x: -0.22, y: 0.14, r: 8 },
  { x: 0.08, y: 0.24, r: -6 },
  { x: -0.14, y: 0.33, r: 5 },
  { x: 0.2, y: 0.36, r: -9 },
];

export function ProblemSection() {
  const root = useRef<HTMLElement>(null);
  const autoCount = problem.tasks.filter((task) => task.status === "auto").length;
  const reviewCount = problem.tasks.length - autoCount;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add({ desktop: MEDIA.desktop, motion: MEDIA.motion }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;

        // Mise en scène préparée pendant une période d'inactivité, bien avant
        // que la séquence n'apparaisse (elle suit un hero de 150svh).
        const setup = context.add("setupProblem", () => {
          section.dataset.motion = "on";
          const stage = section.querySelector<HTMLElement>("[data-stage]");
          const board = section.querySelector<HTMLElement>("[data-board]");
          const grid = section.querySelector<HTMLElement>("[data-grid]");
          const counterEl = section.querySelector<HTMLElement>("[data-counter]");
          const cards = gsap.utils
            .toArray<HTMLElement>("[data-card]", section)
            .filter((card) => card.offsetParent !== null);
          if (!stage || !board || !grid) return;

          const setCount = (selector: string, value: number) => {
            const el = section.querySelector<HTMLElement>(selector);
            if (el) el.textContent = String(value);
          };
          const autoVisible = cards.filter((card) => card.dataset.status === "auto").length;
          setCount("[data-count-auto]", autoVisible);
          setCount("[data-count-review]", cards.length - autoVisible);

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

          const track = section.querySelector<HTMLElement>("[data-stage-track]") ?? section;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          });

          // 1. Les tâches s'accumulent.
          tl.fromTo(
            cards,
            { x: dx, y: dy, rotation: (i) => spot(i).r, opacity: 0, scale: 0.82 },
            {
              x: dx,
              y: dy,
              rotation: (i) => spot(i).r,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.42,
              ease: "back.out(1.7)",
            },
            0,
          );
          const counter = { n: 0 };
          tl.to(
            counter,
            {
              n: cards.length,
              duration: 0.42 * (cards.length - 1) + 0.5,
              onUpdate: () => {
                if (counterEl) counterEl.textContent = String(Math.floor(counter.n + 0.35));
              },
            },
            0,
          );
          tl.fromTo("[data-glow-warm]", { opacity: 0 }, { opacity: 1, duration: 3.6 }, 0.2);

          // 2. La tension, puis la question.
          tl.to(cards, { rotation: (i) => spot(i).r * 1.7, duration: 0.6, ease: "sine.inOut" }, 3.9)
            .to("[data-text-a]", { opacity: 0, y: -28, duration: 0.6 }, 4.4)
            .to(cards, { opacity: 0.18, duration: 0.6 }, 4.5)
            .to("[data-hud-pending]", { opacity: 0, duration: 0.4 }, 4.6)
            .fromTo(
              "[data-phrase]",
              { opacity: 0, y: 32 },
              { opacity: 1, y: 0, duration: 0.7 },
              4.75,
            )
            .to("[data-phrase]", { opacity: 0, y: -32, duration: 0.6 }, 6.2);

          // 3. Tout se réorganise ; vous gardez la main.
          tl.to(
            cards,
            {
              x: 0,
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.09,
              ease: "power3.inOut",
            },
            6.35,
          )
            .to("[data-detail]", { opacity: 0, duration: 0.3, stagger: 0.09 }, 7.05)
            .fromTo(
              "[data-resolved]",
              { opacity: 0, y: 6 },
              { opacity: 1, y: 0, duration: 0.4, stagger: 0.09 },
              7.15,
            )
            .to("[data-chip-pending]", { opacity: 0, duration: 0.25, stagger: 0.09 }, 7.1)
            .fromTo(
              "[data-chip-resolved]",
              { opacity: 0, scale: 0.7 },
              { opacity: 1, scale: 1, duration: 0.35, stagger: 0.09, ease: "back.out(2)" },
              7.2,
            )
            .to("[data-glow-warm]", { opacity: 0, duration: 1 }, 6.5)
            .fromTo("[data-glow-cool]", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 6.7)
            .fromTo(
              "[data-text-b]",
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8 },
              7.45,
            )
            .fromTo(
              "[data-hud-resolved]",
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.5 },
              7.7,
            )
            .to({}, { duration: 0.9 });
          // Pré-rendu complet : chaque élément reçoit son état initial, même
          // ceux dont l'animation commence plus tard (cascades).
          const progress = tl.scrollTrigger?.progress ?? 0;
          tl.progress(1, true).progress(progress, true);
        }) as () => void;

        const cancel = whenIdle(setup, 900);
        return () => {
          cancel();
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
      <div className="container-x pb-4 pt-24 lg:hidden">
        <ProblemIntro titleId="constat-title" />
      </div>

      <div data-stage-track className="relative">
        <div data-stage className="relative overflow-clip">
          <div aria-hidden="true" data-motion-only className="pointer-events-none absolute inset-0">
            <div
              data-glow-warm
              className="absolute right-[-10%] top-1/2 h-[90vh] w-[90vh] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_143_104/0.16),transparent)] opacity-0"
            />
            <div
              data-glow-cool
              className="absolute right-[-10%] top-1/2 h-[90vh] w-[90vh] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.13),transparent)] opacity-0"
            />
          </div>

          <div className="container-x flex h-full flex-col pb-24 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0 [[data-motion=on]_&]:pb-6 [[data-motion=on]_&]:pt-[calc(var(--header-height)+1.25rem)] lg:[[data-motion=on]_&]:py-0">
            <div data-text-stack className="flex flex-col gap-10 lg:col-span-5">
              <div data-text-a className="hidden lg:block">
                <ProblemIntro titleId="constat-title-lg" />
              </div>

              <p
                data-phrase
                className="text-[clamp(2rem,1.2rem+3.6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ivory"
              >
                <RichText text={problem.transition} />
              </p>

              <div data-text-b>
                <p className="text-[clamp(1.6rem,1.1rem+2.1vw,3rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ivory">
                  <RichText text={problem.resolvedTitle} />
                </p>
                <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-mist md:text-lead lg:mt-6 [@media(max-height:720px)]:max-lg:[[data-motion=on]_&]:hidden">
                  {problem.resolvedLead}
                </p>
              </div>
            </div>

            <div
              data-board
              className="relative mt-12 flex-1 lg:col-span-7 lg:mt-0 lg:flex lg:h-full lg:items-center [[data-motion=on]_&]:mt-4 [[data-motion=on]_&]:flex [[data-motion=on]_&]:items-end lg:[[data-motion=on]_&]:items-center"
            >
              <div
                aria-hidden="true"
                data-motion-only
                className="absolute left-0 top-0 flex items-center gap-3 lg:top-[12%]"
              >
                <div
                  data-hud-pending
                  className="surface flex items-center gap-3 rounded-full py-2 pl-3 pr-4"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ring rounded-full bg-ember/60" />
                    <span className="relative size-2 rounded-full bg-ember" />
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mist">
                    {problem.pendingLabel}
                  </span>
                  <span data-counter className="font-mono text-sm tabular-nums text-ivory">
                    0
                  </span>
                </div>
                <div
                  data-hud-resolved
                  className="surface absolute left-0 top-0 flex items-center gap-4 whitespace-nowrap rounded-full py-2 pl-3 pr-4 opacity-0"
                >
                  <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mist">
                    <span className="size-2 rounded-full bg-aqua" />
                    {problem.resolvedCounters.auto}
                    <span data-count-auto className="text-sm text-ivory">
                      {autoCount}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mist">
                    <span className="size-2 rounded-full bg-amber" />
                    {problem.resolvedCounters.review}
                    <span data-count-review className="text-sm text-ivory">
                      {reviewCount}
                    </span>
                  </span>
                </div>
              </div>

              <ul
                data-grid
                aria-label="Exemples de tâches du quotidien"
                className="relative grid w-full grid-cols-2 gap-2 sm:gap-3"
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
                      <div className="surface-raised flex h-full items-start gap-3 rounded-2xl p-3 sm:p-4">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 hidden size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-ivory sm:flex"
                        >
                          <Icon className="size-4" strokeWidth={1.6} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.82rem] font-medium leading-snug text-ivory sm:text-[0.92rem]">
                            {task.label}
                          </p>
                          <div className="mt-1 grid text-[0.74rem] leading-snug sm:text-[0.8rem]">
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
                          <div className="mt-2.5 grid justify-items-start">
                            <span
                              data-chip-pending
                              data-motion-only
                              className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ember [grid-area:1/1] sm:text-[0.62rem]"
                            >
                              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
                              {problem.pendingChip}
                            </span>
                            <span
                              data-chip-resolved
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] [grid-area:1/1] sm:text-[0.62rem]",
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemIntro({ titleId }: { titleId: string }) {
  return (
    <>
      <Eyebrow>{problem.eyebrow}</Eyebrow>
      <h2 id={titleId} className="mt-5 text-headline font-medium text-ivory lg:mt-7">
        <RichText text={problem.title} />
      </h2>
      <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-mist md:text-lead lg:mt-7">
        {problem.lead}
      </p>
    </>
  );
}
