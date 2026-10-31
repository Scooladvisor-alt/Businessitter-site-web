"use client";

import { useRef } from "react";
import { Bot, CalendarCheck, Check, PhoneIncoming } from "lucide-react";
import { scenes } from "@/content/home";
import { cn } from "@/lib/cn";
import { Artboard, Chip } from "./SceneParts";
import { useSceneTimeline } from "./use-scene-timeline";

const copy = scenes.phone;

export function PhoneScene({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneTimeline(ref, active, (tl, q) => {
    tl.fromTo(q("[data-caller]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
      .fromTo(q("[data-status-ring]"), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 1.1)
      .fromTo(q("[data-status-live]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.2)
      .fromTo(
        q("[data-bubble]"),
        { opacity: 0, y: 12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.95 },
        1.5,
      )
      .fromTo(q("[data-result]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 5.5)
      .fromTo(
        q("[data-result-check]"),
        { scale: 0 },
        { scale: 1, duration: 0.5, ease: "back.out(2.4)" },
        5.8,
      )
      .fromTo(
        q("[data-result-chip]"),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 },
        6.1,
      )
      .to({}, { duration: 1.4 });
  });

  return (
    <div ref={ref} className="absolute inset-0">
      <Artboard>
        <div className="flex h-full flex-col gap-3">
          <div data-caller className="surface-raised flex items-center gap-3 rounded-2xl p-3.5">
            <span className="relative flex size-10 items-center justify-center rounded-full bg-aqua/12 text-aqua">
              <span className="absolute inset-0 animate-ring rounded-full border border-aqua/40" />
              <PhoneIncoming className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="grid">
                <p data-status-ring className="text-[13px] font-medium text-ivory [grid-area:1/1]">
                  {copy.caller}
                </p>
                <p
                  data-status-live
                  className="flex items-center gap-1.5 text-[13px] font-medium text-aqua [grid-area:1/1]"
                >
                  <Bot className="size-3.5" aria-hidden="true" />
                  {copy.agent}
                </p>
              </div>
              <p className="text-[11px] tabular-nums text-dim">{copy.number}</p>
            </div>
            <span aria-hidden="true" className="flex h-6 items-end gap-[3px]">
              {[0.5, 0.9, 0.6, 1, 0.7, 0.4].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] origin-bottom animate-[wave_1.1s_ease-in-out_infinite] rounded-full bg-aqua/70"
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-2 px-1">
            {copy.transcript.map((line, i) => (
              <p
                key={i}
                data-bubble
                className={cn(
                  "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-snug",
                  line.from === "agent"
                    ? "self-end rounded-br-md border border-aqua/20 bg-aqua/10 text-ivory"
                    : "self-start rounded-bl-md border border-white/8 bg-white/[0.05] text-mist",
                )}
              >
                {line.text}
              </p>
            ))}
          </div>

          <div data-result className="surface-raised rounded-2xl p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber/12 text-amber">
                <CalendarCheck className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-ivory">{copy.result}</p>
                <p className="text-[11px] tabular-nums text-mist">{copy.resultDetail}</p>
              </div>
              <span
                data-result-check
                className="flex size-7 items-center justify-center rounded-full bg-aqua text-ink-950"
              >
                <Check className="size-4" strokeWidth={2.6} aria-hidden="true" />
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              {copy.chips.map((chip) => (
                <Chip key={chip} data-result-chip tone="aqua">
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Artboard>
    </div>
  );
}
