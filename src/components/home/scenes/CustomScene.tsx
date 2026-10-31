"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { scenes } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";
import { Artboard, Bar, Chip } from "./SceneParts";
import { useSceneTimeline } from "./use-scene-timeline";

const copy = scenes.custom;

export function CustomScene({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneTimeline(ref, active, (tl, q) => {
    tl.fromTo(
      q("[data-window]"),
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.5 },
      0,
    )
      .fromTo(
        q("[data-sidebar]"),
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55 },
        0.3,
      )
      .fromTo(
        q("[data-nav]"),
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 },
        0.55,
      )
      .fromTo(q("[data-topbar]"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.45 }, 0.6)
      .fromTo(
        q("[data-card]"),
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: "back.out(1.6)" },
        0.9,
      )
      .fromTo(
        q("[data-chart]"),
        { strokeDashoffset: 420 },
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
        1.4,
      )
      .fromTo(q("[data-chart-area]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.2)
      .fromTo(
        q("[data-row]"),
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.12 },
        1.9,
      )
      .fromTo(
        q("[data-label]"),
        { opacity: 0, y: 10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" },
        2.9,
      )
      .to({}, { duration: 1.6 });
  });

  return (
    <div ref={ref} className="absolute inset-0">
      <Artboard>
        <div
          data-window
          className="surface-raised absolute inset-x-0 top-4 flex h-[340px] overflow-hidden rounded-2xl"
        >
          <aside
            data-sidebar
            className="flex w-[110px] shrink-0 flex-col gap-1 border-r border-white/8 bg-white/[0.02] p-3"
          >
            <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-ivory">
              <LogoMark idSuffix="custom" className="size-4" />
              {copy.appName}
            </div>
            {copy.nav.map((item, i) => (
              <span
                key={item}
                data-nav
                className={`rounded-lg px-2 py-1.5 text-[10.5px] ${i === 0 ? "bg-white/[0.08] text-ivory" : "text-dim"}`}
              >
                {item}
              </span>
            ))}
          </aside>
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-3.5">
            <div data-topbar className="flex items-center justify-between">
              <Bar className="w-24" />
              <span className="size-6 rounded-full bg-[linear-gradient(135deg,#ffc88f,#86e6da)] opacity-80" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {copy.cards.map((card, i) => (
                <div
                  key={card}
                  data-card
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-2.5"
                >
                  <p className="text-[9.5px] text-dim">{card}</p>
                  <Bar className={`mt-2 h-2.5 ${i === 1 ? "w-10" : "w-12"}`} />
                </div>
              ))}
            </div>
            <div
              data-card
              className="relative h-[92px] rounded-xl border border-white/8 bg-white/[0.03] p-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 280 80"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="custom-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#86e6da" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#86e6da" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="custom-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#ffc88f" />
                    <stop offset="1" stopColor="#86e6da" />
                  </linearGradient>
                </defs>
                <path
                  data-chart-area
                  d="M0 62 C 30 58, 48 40, 76 44 S 120 60, 150 38 S 210 18, 236 26 S 270 14, 280 10 L 280 80 L 0 80 Z"
                  fill="url(#custom-area)"
                />
                <path
                  data-chart
                  d="M0 62 C 30 58, 48 40, 76 44 S 120 60, 150 38 S 210 18, 236 26 S 270 14, 280 10"
                  fill="none"
                  stroke="url(#custom-line)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="420"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div className="space-y-1.5">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  data-row
                  className="flex items-center gap-2 rounded-lg bg-white/[0.025] px-2 py-1.5"
                >
                  <span className="size-2 rounded-full bg-aqua/70" />
                  <Bar className="w-20" />
                  <Bar className="ml-auto w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div data-label className="absolute bottom-3 right-4">
          <Chip tone="amber">
            <Sparkles className="size-3" aria-hidden="true" />
            {copy.label}
          </Chip>
        </div>
      </Artboard>
    </div>
  );
}
