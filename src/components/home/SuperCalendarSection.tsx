"use client";

import { useRef } from "react";
import {
  BellRing,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { realisation } from "@/content/home";
import { site } from "@/content/site";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { observeOnce } from "@/lib/observe";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

const FEATURE_ICONS: LucideIcon[] = [CalendarDays, UserRoundCheck, BellRing];
const HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
const TONES = {
  amber: "border-amber/35 bg-amber/15 text-amber",
  aqua: "border-aqua/35 bg-aqua/15 text-aqua",
  lilac: "border-lilac/35 bg-lilac/15 text-lilac",
} as const;

export function SuperCalendarSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, (context) => {
        const card = section.querySelector<HTMLElement>("[data-product]");
        if (!card) return;
        const setup = context.add("setupShowcase", () => {
          gsap.fromTo(
            card,
            { rotateX: 16, y: 120, scale: 0.92, opacity: 0.2, transformPerspective: 1600 },
            {
              rotateX: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top 30%", scrub: 0.8 },
            },
          );
          gsap.utils.toArray<HTMLElement>("[data-depth]", section).forEach((layer) => {
            const depth = Number(layer.dataset.depth ?? 1);
            const z = Number(layer.dataset.z ?? 0);
            gsap.fromTo(
              layer,
              { y: 40 * depth, z },
              {
                y: -30 * depth,
                z,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        }) as () => void;
        return observeOnce(section, setup, "0px 0px 120% 0px");
      });

      // Inclinaison au survol (souris uniquement).
      mm.add(`${MEDIA.motion} and (hover: hover) and (pointer: fine)`, () => {
        const stage = section.querySelector<HTMLElement>("[data-tilt-stage]");
        const target = section.querySelector<HTMLElement>("[data-tilt]");
        if (!stage || !target) return;
        const rotX = gsap.quickTo(target, "rotationX", { duration: 0.8, ease: "power3.out" });
        const rotY = gsap.quickTo(target, "rotationY", { duration: 0.8, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotY(x * 9);
          rotX(-y * 7);
        };
        const leave = () => {
          rotX(0);
          rotY(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="realisation"
      aria-labelledby="realisation-title"
      className="relative overflow-x-clip py-28 md:py-40"
    >
      <div className="container-x">
        <header className="mx-auto max-w-3xl text-center">
          <SplitHeading
            id="realisation-title"
            text={realisation.title}
            className="text-headline font-medium text-ivory"
          />
        </header>

        <article aria-labelledby="supercalendar-name" className="mt-14 md:mt-20">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[0.85rem] text-mist">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[linear-gradient(90deg,#ffc88f,#86e6da)]"
              />
              {realisation.label}
            </p>
            <h3
              id="supercalendar-name"
              className="mt-6 text-[clamp(2.6rem,1.8rem+3vw,4.6rem)] font-semibold leading-none tracking-[-0.045em] text-ivory"
            >
              {realisation.name}
            </h3>
            <p className="mt-6 text-lead text-mist">{realisation.description}</p>
            <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {realisation.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i] ?? CalendarDays;
                return (
                  <li key={feature} className="flex items-center gap-2 text-[0.95rem] text-ivory">
                    <Icon className="size-4 text-aqua" strokeWidth={1.7} aria-hidden="true" />
                    {feature}
                  </li>
                );
              })}
            </ul>
            <ButtonLink href={site.superCalendarUrl} variant="secondary" external className="mt-9">
              {realisation.link}
            </ButtonLink>
          </Reveal>

          <div data-product className="relative mx-auto mt-16 max-w-4xl md:mt-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.1),transparent)]"
            />
            <div
              data-tilt-stage
              className="relative flex items-center justify-center px-2 py-10 [perspective:1400px] sm:px-10"
            >
              <div
                data-tilt
                aria-hidden="true"
                className="relative w-full max-w-[42rem] [transform-style:preserve-3d]"
              >
                <CalendarMock />
                <div
                  data-depth="1.2"
                  data-z="60"
                  className="absolute -right-1 top-[46%] w-[13.5rem] rounded-2xl border border-white/12 bg-ink-800/95 p-3.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md [transform:translateZ(60px)] sm:-right-10"
                >
                  <p className="text-[0.72rem] font-medium text-ivory">
                    {realisation.mock.booking}
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    {realisation.mock.slots.map((slot, i) => (
                      <span
                        key={slot}
                        className={cn(
                          "rounded-lg border px-2 py-1.5 text-center text-[0.68rem] tabular-nums",
                          i === 2
                            ? "border-aqua/50 bg-aqua/15 text-aqua"
                            : "border-white/10 text-mist",
                        )}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  data-depth="2"
                  data-z="90"
                  className="absolute -left-1 -top-9 flex items-center gap-3 rounded-2xl border border-white/12 bg-ink-800/95 py-2.5 pl-2.5 pr-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md [transform:translateZ(90px)] sm:-left-12"
                >
                  <span className="flex size-8 items-center justify-center rounded-xl bg-amber/15 text-amber">
                    <BellRing className="size-4" strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-[0.74rem] font-medium text-ivory">
                      {realisation.mock.reminder}
                    </span>
                    <span className="block text-[0.68rem] text-mist">
                      {realisation.mock.reminderDetail}
                    </span>
                  </span>
                </div>
                <div
                  data-depth="1.6"
                  data-z="70"
                  className="absolute -bottom-7 left-[10%] flex items-center gap-2 rounded-full border border-white/12 bg-ink-800/95 py-2 pl-2 pr-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md [transform:translateZ(70px)]"
                >
                  <CircleCheck className="size-4 text-aqua" strokeWidth={2} />
                  <span className="text-[0.72rem] text-ivory">{realisation.mock.client}</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-[0.8rem] text-dim">{realisation.caption}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function CalendarMock() {
  const mock = realisation.mock;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <p className="flex items-center gap-2 text-[0.78rem] font-semibold tracking-[-0.01em] text-ivory">
          <span className="flex size-5 items-center justify-center rounded-md bg-[linear-gradient(135deg,#ffc88f,#86e6da)] text-[0.6rem] font-bold text-ink-950">
            S
          </span>
          {realisation.name}
        </p>
        <p className="flex items-center gap-2 text-[0.68rem] text-mist">
          <ChevronLeft className="size-3.5" />
          {mock.week}
          <ChevronRight className="size-3.5" />
        </p>
      </div>
      <div className="grid grid-cols-[2.6rem_repeat(5,1fr)] text-[0.62rem]">
        <span />
        {mock.days.map((day) => (
          <span key={day} className="border-l border-white/[0.05] py-2 text-center text-mist">
            {day}
          </span>
        ))}
        {HOURS.map((hour, row) => (
          <div key={hour} className="contents">
            <span className="border-t border-white/[0.05] px-2 py-3 text-[0.56rem] tabular-nums text-dim">
              {hour}
            </span>
            {mock.days.map((day, col) => {
              const event = mock.events.find((e) => e.day === col && e.start === row);
              return (
                <span
                  key={`${hour}-${day}`}
                  className="relative h-9 border-l border-t border-white/[0.05]"
                >
                  {event ? (
                    <span
                      className={cn(
                        "absolute inset-x-1 top-1 z-10 rounded-md border px-1.5 py-1 text-[0.58rem] font-medium leading-tight",
                        TONES[event.tone as keyof typeof TONES],
                      )}
                      style={{
                        height: `calc(${event.span * 100}% + ${(event.span - 1) * 1}px - 0.5rem)`,
                      }}
                    >
                      {event.label}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
