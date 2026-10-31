"use client";

import { useRef } from "react";
import { Calendar, Check, Mail, Receipt, Table2, Users } from "lucide-react";
import { scenes } from "@/content/home";
import { LogoMark } from "@/components/ui/Logo";
import { Artboard } from "./SceneParts";
import { useSceneTimeline } from "./use-scene-timeline";

const copy = scenes.ops;
const ICONS = [Users, Calendar, Receipt, Table2, Mail];

const HUB = { x: 220, y: 150 };
const TILES = [
  { x: 220, y: 42 },
  { x: 372, y: 112 },
  { x: 322, y: 236 },
  { x: 118, y: 236 },
  { x: 68, y: 112 },
];
/** Trajets des données : (application source → cœur → application cible). */
const ROUTES: [number, number][] = [
  [4, 0],
  [0, 1],
  [1, 2],
];

export function OpsScene({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useSceneTimeline(ref, active, (tl, q) => {
    const packets = q("[data-packet]");
    tl.fromTo(
      q("[data-hub]"),
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" },
      0,
    )
      .fromTo(
        q("[data-tile]"),
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.08 },
        0.2,
      )
      .fromTo(
        q("[data-link]"),
        { strokeDashoffset: 160 },
        { strokeDashoffset: 0, duration: 0.8, stagger: 0.06, ease: "power2.out" },
        0.4,
      );

    ROUTES.forEach(([from, to], i) => {
      const start = 1.4 + i * 1.25;
      const a = TILES[from] as { x: number; y: number };
      const b = TILES[to] as { x: number; y: number };
      const packet = packets[i];
      if (!packet) return;
      tl.set(packet, { x: a.x, y: a.y, opacity: 0 }, start)
        .to(packet, { opacity: 1, duration: 0.12 }, start)
        .to(packet, { x: HUB.x, y: HUB.y, duration: 0.5, ease: "power2.in" }, start)
        .to(packet, { x: b.x, y: b.y, duration: 0.5, ease: "power2.out" }, start + 0.55)
        .to(packet, { opacity: 0, duration: 0.15 }, start + 1.02)
        .fromTo(
          q(`[data-tile-pulse="${to}"]`),
          { opacity: 0.9, scale: 1 },
          { opacity: 0, scale: 1.6, duration: 0.6 },
          start + 1,
        )
        .fromTo(
          q(`[data-log="${i}"]`),
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4 },
          start + 1.05,
        );
    });
    tl.to({}, { duration: 1.5 });
  });

  return (
    <div ref={ref} className="absolute inset-0">
      <Artboard>
        <svg aria-hidden="true" className="absolute inset-0 h-[290px] w-full" viewBox="0 0 440 290">
          <defs>
            <linearGradient id="ops-link" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffc88f" stopOpacity="0.55" />
              <stop offset="1" stopColor="#86e6da" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {TILES.map((tile, i) => (
            <g key={i}>
              <line
                x1={HUB.x}
                y1={HUB.y}
                x2={tile.x}
                y2={tile.y}
                stroke="rgb(255 255 255 / 0.07)"
                strokeWidth="1"
              />
              <line
                data-link
                x1={HUB.x}
                y1={HUB.y}
                x2={tile.x}
                y2={tile.y}
                stroke="url(#ops-link)"
                strokeWidth="1.2"
                strokeDasharray="160"
              />
            </g>
          ))}
        </svg>

        <div
          data-hub
          className="absolute flex size-[76px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[22px] border border-white/15 bg-ink-800 text-ivory shadow-[0_0_60px_-10px_rgb(134_230_218/0.45)]"
          style={{ left: HUB.x, top: HUB.y }}
        >
          <LogoMark idSuffix="ops" className="size-7" />
          <span className="mt-1 px-1 text-center text-[8.5px] leading-tight text-mist">
            {copy.hub}
          </span>
        </div>

        {TILES.map((tile, i) => {
          const Icon = ICONS[i] ?? Users;
          return (
            <div
              key={copy.apps[i]}
              data-tile
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-white/10 bg-ink-700/90 px-3 py-2 text-[11.5px] text-ivory"
              style={{ left: tile.x, top: tile.y }}
            >
              <span
                data-tile-pulse={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-xl border border-aqua/60 opacity-0"
              />
              <Icon className="size-3.5 text-mist" strokeWidth={1.8} aria-hidden="true" />
              {copy.apps[i]}
            </div>
          );
        })}

        {ROUTES.map((_, i) => (
          <span
            key={i}
            data-packet
            aria-hidden="true"
            className="absolute left-0 top-0 -ml-1 -mt-1 size-2 rounded-full bg-ivory opacity-0 shadow-[0_0_14px_3px_rgb(134_230_218/0.75)]"
          />
        ))}

        <ul className="absolute inset-x-6 bottom-2 space-y-1.5">
          {copy.log.map((entry, i) => (
            <li
              key={entry}
              data-log={i}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 font-mono text-[10.5px] text-mist"
            >
              <Check className="size-3 text-aqua" strokeWidth={2.6} aria-hidden="true" />
              {entry}
            </li>
          ))}
        </ul>
      </Artboard>
    </div>
  );
}
