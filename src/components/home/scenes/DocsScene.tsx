"use client";

import { useRef } from "react";
import { BadgeCheck, FileText } from "lucide-react";
import { scenes } from "@/content/home";
import { Artboard, Chip } from "./SceneParts";
import { useSceneTimeline } from "./use-scene-timeline";

const copy = scenes.docs;

export function DocsScene({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneTimeline(ref, active, (tl, q) => {
    tl.fromTo(q("[data-source]"), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5 }, 0)
      .fromTo(q("[data-doc]"), { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.5 }, 0.1)
      .fromTo(
        q("[data-field-value]"),
        { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.5,
          stagger: 0.45,
          ease: "power2.out",
        },
        0.6,
      )
      .fromTo(
        q("[data-packet]"),
        { opacity: 0, x: 0 },
        { opacity: 1, x: 112, duration: 0.55, stagger: 0.45, ease: "power2.inOut" },
        0.9,
      )
      .to(q("[data-packet]"), { opacity: 0, duration: 0.2, stagger: 0.45 }, 1.35)
      .fromTo(
        q("[data-doc-line]"),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.42 },
        1.3,
      )
      .fromTo(q("[data-total]"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 3.0)
      .fromTo(
        q("[data-stamp]"),
        { opacity: 0, scale: 1.3, rotate: -8 },
        { opacity: 1, scale: 1, rotate: -3, duration: 0.5, ease: "back.out(2)" },
        3.5,
      )
      .to({}, { duration: 1.6 });
  });

  return (
    <div ref={ref} className="absolute inset-0">
      <Artboard>
        <div className="flex h-full items-center gap-4">
          <div data-source className="surface-raised w-[176px] shrink-0 rounded-2xl p-4">
            <p className="text-[11px] font-medium text-dim">{copy.sourceTitle}</p>
            <ul className="mt-3 space-y-3">
              {copy.fields.map((field) => (
                <li key={field.label} className="relative">
                  <p className="text-[10.5px] text-dim">{field.label}</p>
                  <p data-field-value className="text-[12.5px] font-medium text-ivory">
                    {field.value}
                  </p>
                  <span
                    data-packet
                    aria-hidden="true"
                    className="absolute right-[-14px] top-1/2 size-2 -translate-y-1/2 rounded-full bg-amber opacity-0 shadow-[0_0_12px_2px_rgb(255_191_128/0.6)]"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div
            data-doc
            className="relative flex-1 rounded-2xl bg-ivory p-4 text-ink-950 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]"
          >
            <div className="flex items-start justify-between">
              <p className="flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.02em]">
                <FileText className="size-4" strokeWidth={2} aria-hidden="true" />
                {copy.documentTitle}
              </p>
              <span className="rounded-full border border-ink-950/15 px-2 py-0.5 text-[10px] font-medium text-ink-950/60">
                {copy.documentRef}
              </span>
            </div>
            <div className="mt-2 space-y-1" aria-hidden="true">
              <span className="block h-1.5 w-24 rounded-full bg-ink-950/15" />
              <span className="block h-1.5 w-16 rounded-full bg-ink-950/10" />
            </div>
            <ul className="mt-4 space-y-2 border-t border-ink-950/10 pt-3">
              {copy.lines.map((line) => (
                <li
                  key={line}
                  data-doc-line
                  className="flex items-center justify-between gap-3 text-[11.5px]"
                >
                  <span>{line}</span>
                  <span className="block h-1.5 w-12 rounded-full bg-ink-950/20" />
                </li>
              ))}
            </ul>
            <div
              data-total
              className="mt-3 flex items-center justify-between border-t border-ink-950/10 pt-3 text-[12px] font-semibold"
            >
              <span>{copy.total}</span>
              <span className="block h-2 w-16 rounded-full bg-ink-950/35" />
            </div>
            <div data-stamp className="mt-4 flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#0f7d6f] px-2.5 py-1 text-[11px] font-semibold text-[#0f7d6f]">
                <BadgeCheck className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
                {copy.status}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <Chip tone="dim">{copy.footnote}</Chip>
        </div>
      </Artboard>
    </div>
  );
}
