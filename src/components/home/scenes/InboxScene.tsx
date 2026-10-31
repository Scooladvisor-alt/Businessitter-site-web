"use client";

import { useRef } from "react";
import { Inbox, PenLine } from "lucide-react";
import { scenes } from "@/content/home";
import { Artboard, Chip } from "./SceneParts";
import { useSceneTimeline } from "./use-scene-timeline";

const copy = scenes.mail;

type Tone = "amber" | "sky" | "aqua" | "ember" | "dim";

export function InboxScene({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneTimeline(ref, active, (tl, q) => {
    const rows = q("[data-row]");
    tl.fromTo(rows, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.1 }, 0)
      .fromTo(q("[data-scan]"), { opacity: 0, y: 0 }, { opacity: 1, duration: 0.2 }, 0.8)
      .to(q("[data-scan]"), { y: 4 * 44, duration: 2.2, ease: "none" }, 0.9)
      .to(q("[data-scan]"), { opacity: 0, duration: 0.25 }, 3.1)
      .fromTo(
        q("[data-tag]"),
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.35, stagger: 0.55, ease: "back.out(2.2)" },
        1.0,
      )
      .to(q("[data-row-archived]"), { opacity: 0.45, duration: 0.4 }, 3.4)
      .fromTo(q("[data-sorting]"), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 3.4)
      .fromTo(q("[data-draft]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 3.7)
      .fromTo(
        q("[data-draft-line]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" },
        4.1,
      )
      .to({}, { duration: 1.6 });
  });

  return (
    <div ref={ref} className="absolute inset-0">
      <Artboard>
        <div className="flex h-full flex-col gap-3">
          <div className="surface-raised relative overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
              <p className="flex items-center gap-2 text-[13px] font-medium text-ivory">
                <Inbox className="size-4 text-mist" strokeWidth={1.8} aria-hidden="true" />
                {copy.inbox}
              </p>
              <span data-sorting>
                <Chip tone="lilac">
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-lilac" />
                  {copy.sorting}
                </Chip>
              </span>
            </div>
            <ul className="relative">
              <span
                data-scan
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[44px] bg-[linear-gradient(90deg,transparent,rgb(186_181_242/0.14),transparent)] opacity-0"
              />
              {copy.messages.map((message, i) => (
                <li
                  key={i}
                  data-row
                  {...(message.tone === "dim" ? { "data-row-archived": "" } : {})}
                  className="flex h-[44px] items-center gap-3 border-b border-white/[0.05] px-4 last:border-0"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07] font-mono text-[9.5px] text-mist">
                    {message.initials}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[12.5px] text-ivory/90">
                    {message.subject}
                  </p>
                  <span data-tag>
                    <Chip tone={message.tone as Tone}>{message.tag}</Chip>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-draft className="surface-raised rounded-2xl px-4 py-3.5">
            <p className="flex items-center gap-2 text-[12px] font-medium text-ivory">
              <PenLine className="size-3.5 text-aqua" strokeWidth={2} aria-hidden="true" />
              {copy.draftTitle}
            </p>
            <p className="mt-1.5 truncate text-[12px] leading-relaxed text-mist">
              {copy.draftText}
            </p>
            <span
              data-draft-line
              aria-hidden="true"
              className="skeleton-line mt-1.5 block h-1.5 w-[72%] origin-left"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-[11px] text-amber">{copy.draftStatus}</span>
              <span className="flex gap-1.5">
                <span className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] text-mist">
                  {copy.edit}
                </span>
                <span className="rounded-full bg-ivory px-2.5 py-1 text-[11px] font-medium text-ink-950">
                  {copy.approve}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Artboard>
    </div>
  );
}
