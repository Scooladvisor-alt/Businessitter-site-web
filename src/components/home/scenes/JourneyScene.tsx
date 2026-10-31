"use client";

import { useRef } from "react";
import { Check, MessageSquare } from "lucide-react";
import { scenes } from "@/content/home";
import { Artboard } from "./SceneParts";
import { useSceneTimeline } from "./use-scene-timeline";

const copy = scenes.journey;
const STEP_GAP = 72;

export function JourneyScene({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneTimeline(ref, active, (tl, q) => {
    const steps = copy.steps.length;
    tl.fromTo(q("[data-step]"), { opacity: 0.25 }, { opacity: 0.25, duration: 0.01 }, 0)
      .fromTo(q("[data-check]"), { scale: 0 }, { scale: 0, duration: 0.01 }, 0)
      .fromTo(q("[data-message]"), { opacity: 0, x: 18 }, { opacity: 0, x: 18, duration: 0.01 }, 0)
      .fromTo(
        q("[data-progress]"),
        { scaleY: 0 },
        { scaleY: 1, duration: 0.95 * (steps - 1), ease: "none" },
        0.4,
      )
      .fromTo(
        q("[data-runner]"),
        { y: 0 },
        { y: STEP_GAP * (steps - 1), duration: 0.95 * (steps - 1), ease: "none" },
        0.4,
      );
    copy.steps.forEach((_, i) => {
      const at = 0.4 + i * 0.95;
      tl.to(q(`[data-step="${i}"]`), { opacity: 1, duration: 0.25 }, at)
        .to(q(`[data-check="${i}"]`), { scale: 1, duration: 0.35, ease: "back.out(2.4)" }, at)
        .to(q(`[data-message="${i}"]`), { opacity: 1, x: 0, duration: 0.45 }, at + 0.05);
    });
    tl.to({}, { duration: 1.6 });
  });

  return (
    <div ref={ref} className="absolute inset-0">
      <Artboard>
        <div
          className="absolute left-6 top-6"
          style={{ height: STEP_GAP * (copy.steps.length - 1) }}
        >
          <span aria-hidden="true" className="absolute left-[13px] top-0 h-full w-px bg-white/10" />
          <span
            data-progress
            aria-hidden="true"
            className="absolute left-[13px] top-0 h-full w-px origin-top bg-[linear-gradient(to_bottom,#ffc88f,#86e6da)]"
          />
          <span
            data-runner
            aria-hidden="true"
            className="absolute left-[9px] top-[-4px] size-[9px] rounded-full bg-ivory shadow-[0_0_14px_4px_rgb(134_230_218/0.7)]"
          />
        </div>
        <ol className="absolute inset-x-6 top-6">
          {copy.steps.map((step, i) => (
            <li
              key={step.title}
              className="absolute inset-x-0 flex items-start gap-4"
              style={{ top: i * STEP_GAP - 13 }}
            >
              <span
                data-step={i}
                className="relative flex size-[27px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink-800"
              >
                <span
                  data-check={i}
                  className="flex size-[19px] items-center justify-center rounded-full bg-aqua text-ink-950"
                >
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
              </span>
              <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-1">
                <p
                  data-step={i}
                  className="w-[104px] shrink-0 text-[12.5px] font-medium text-ivory"
                >
                  {step.title}
                </p>
                <p
                  data-message={i}
                  className="flex items-start gap-2 rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[11.5px] leading-snug text-mist"
                >
                  <MessageSquare
                    className="mt-0.5 size-3 shrink-0 text-aqua"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {step.message}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Artboard>
    </div>
  );
}
