"use client";

import { useRef } from "react";
import {
  BellRing,
  CalendarClock,
  Check,
  FileText,
  Handshake,
  Keyboard,
  Lightbulb,
  Mail,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { transformation } from "@/content/home";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { observeOnce } from "@/lib/observe";
import { cn } from "@/lib/cn";
import { SplitHeading } from "@/components/motion/SplitHeading";

type SegmentKey = keyof typeof transformation.labels;
type Segment = { key: SegmentKey; repetitive: boolean; before: number; after: number };

const ICONS: Record<SegmentKey, LucideIcon> = {
  mail: Mail,
  input: Keyboard,
  followup: BellRing,
  quote: FileText,
  schedule: CalendarClock,
  clients: Handshake,
  field: Wrench,
  projects: Lightbulb,
  team: Users,
};

const R = 0.55; // largeur résiduelle d'une tâche répétitive prise en charge

/** Une semaine type (illustrative) : proportions avant / après. */
const WEEK: Segment[][] = [
  [
    { key: "mail", repetitive: true, before: 3, after: R },
    { key: "clients", repetitive: false, before: 2, after: 4 },
    { key: "input", repetitive: true, before: 2, after: R },
    { key: "projects", repetitive: false, before: 1.5, after: 3.2 },
  ],
  [
    { key: "quote", repetitive: true, before: 2.5, after: R },
    { key: "field", repetitive: false, before: 3, after: 5.2 },
    { key: "followup", repetitive: true, before: 1.5, after: R },
  ],
  [
    { key: "clients", repetitive: false, before: 1.5, after: 3 },
    { key: "schedule", repetitive: true, before: 2, after: R },
    { key: "mail", repetitive: true, before: 2, after: R },
    { key: "projects", repetitive: false, before: 2, after: 4.2 },
  ],
  [
    { key: "input", repetitive: true, before: 3, after: R },
    { key: "field", repetitive: false, before: 2.5, after: 4.6 },
    { key: "quote", repetitive: true, before: 1.5, after: R },
  ],
  [
    { key: "team", repetitive: false, before: 1.5, after: 2.6 },
    { key: "followup", repetitive: true, before: 2, after: R },
    { key: "clients", repetitive: false, before: 2, after: 4.2 },
    { key: "mail", repetitive: true, before: 1.5, after: R },
  ],
];

/**
 * Séquence 5 — La transformation. Une semaine de travail : au défilement,
 * les tâches répétitives se réduisent (prises en charge) et le temps
 * consacré à l'essentiel s'élargit. Illustration sans chiffres.
 */
export function TransformationSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, (context) => {
        const q = gsap.utils.selector(section);
        const board = q("[data-week]")[0] as HTMLElement | undefined;
        if (!board) return;
        const segments = q("[data-seg]") as HTMLElement[];
        const before = (el: Element) => Number((el as HTMLElement).dataset.before ?? 1);
        const after = (el: Element) => Number((el as HTMLElement).dataset.after ?? 1);

        // État « avant », posé explicitement.
        segments.forEach((segment) => gsap.set(segment, { flexGrow: before(segment) }));
        gsap.set(q("[data-warm]"), { opacity: 1 });
        gsap.set(q("[data-cool]"), { opacity: 0 });
        gsap.set(q("[data-rep-label]"), { opacity: 1 });
        gsap.set(q("[data-check]"), { opacity: 0, scale: 0.6 });
        gsap.set(q("[data-val-glow]"), { opacity: 0.4 });

        const setup = context.add("setupWeek", () => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: board, start: "top 82%", end: "center 42%", scrub: 0.6 },
          });
          q("[data-row]").forEach((row, index) => {
            const at = index * 0.06;
            const rowSegments = gsap.utils.toArray<HTMLElement>("[data-seg]", row);
            rowSegments.forEach((segment) =>
              tl.to(segment, { flexGrow: after(segment), duration: 1, ease: "power2.inOut" }, at),
            );
            tl.to(row.querySelectorAll("[data-rep-label]"), { opacity: 0, duration: 0.35 }, at)
              .to(row.querySelectorAll("[data-warm]"), { opacity: 0, duration: 0.7 }, at + 0.25)
              .to(row.querySelectorAll("[data-cool]"), { opacity: 1, duration: 0.7 }, at + 0.25)
              .to(
                row.querySelectorAll("[data-check]"),
                { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
                at + 0.65,
              )
              .to(row.querySelectorAll("[data-val-glow]"), { opacity: 1, duration: 0.8 }, at + 0.2);
          });
        }) as () => void;

        return observeOnce(board, setup, "0px 0px 100% 0px");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const labels = transformation.labels;

  return (
    <section
      ref={root}
      id="transformation"
      aria-labelledby="transformation-title"
      className="relative py-28 md:py-40"
    >
      <div className="container-x">
        <header className="mx-auto max-w-3xl text-center">
          <SplitHeading
            id="transformation-title"
            text={transformation.title}
            className="text-headline font-medium text-ivory"
          />
        </header>

        <div
          data-week
          className="surface relative mx-auto mt-14 max-w-5xl rounded-[var(--radius-stage)] p-4 sm:p-8 md:mt-20"
        >
          <p className="sr-only">{transformation.description}</p>
          <ol aria-hidden="true" className="space-y-2 sm:space-y-3">
            {WEEK.map((row, rowIndex) => (
              <li key={rowIndex} data-row className="flex items-center gap-2.5 sm:gap-4">
                <span className="w-8 shrink-0 text-right text-[0.78rem] text-dim sm:w-10 sm:text-[0.85rem]">
                  {transformation.days[rowIndex]}
                </span>
                <div className="flex h-11 min-w-0 flex-1 gap-1.5 sm:h-14 sm:gap-2">
                  {row.map((segment, index) => {
                    const Icon = ICONS[segment.key];
                    return (
                      <div
                        key={`${segment.key}-${index}`}
                        data-seg
                        data-before={segment.before}
                        data-after={segment.after}
                        style={{ flexGrow: segment.after, flexBasis: 0 }}
                        className={cn(
                          "relative flex min-w-0 items-center justify-center overflow-hidden rounded-xl border",
                          segment.repetitive ? "border-white/10" : "border-white/12",
                        )}
                      >
                        {segment.repetitive ? (
                          <>
                            <span
                              data-warm
                              className="absolute inset-0 bg-ember/[0.13] opacity-0 shadow-[inset_0_0_0_1px_rgb(255_143_104/0.3)]"
                            />
                            <span
                              data-cool
                              className="absolute inset-0 bg-aqua/[0.12] shadow-[inset_0_0_0_1px_rgb(132_228_217/0.35)]"
                            />
                            <span
                              data-rep-label
                              className="relative flex min-w-0 items-center gap-2 px-2 text-[0.8rem] text-amber opacity-0"
                            >
                              <Icon className="size-3.5 shrink-0" strokeWidth={1.8} />
                              <span className="hidden truncate sm:inline">
                                {labels[segment.key]}
                              </span>
                            </span>
                            <span
                              data-check
                              className="absolute inset-0 flex items-center justify-center text-aqua"
                            >
                              <Check className="size-3.5" strokeWidth={2.4} />
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              data-val-glow
                              className="absolute inset-0 bg-[linear-gradient(120deg,rgb(255_255_255/0.08),rgb(255_255_255/0.03))]"
                            />
                            <span className="relative flex min-w-0 items-center gap-2 px-2 text-[0.82rem] text-ivory">
                              <Icon className="size-3.5 shrink-0" strokeWidth={1.8} />
                              <span className="hidden truncate sm:inline">
                                {labels[segment.key]}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>

          <ul
            aria-hidden="true"
            className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.82rem] text-mist sm:mt-8"
          >
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-ember/50" />
              {transformation.legend.repetitive}
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-aqua/60" />
              {transformation.legend.automated}
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-ivory/40" />
              {transformation.legend.valuable}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
