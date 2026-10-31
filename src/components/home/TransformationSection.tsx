"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  Bot,
  CalendarCheck,
  Check,
  Hourglass,
  Keyboard,
  PhoneIncoming,
  PhoneMissed,
  Repeat2,
  Send,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { transformation } from "@/content/home";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { observeOnce } from "@/lib/observe";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

const BEFORE_ICONS: LucideIcon[] = [
  PhoneIncoming,
  PhoneMissed,
  Undo2,
  CalendarCheck,
  Keyboard,
  Send,
];
const AFTER_ICONS: LucideIcon[] = [PhoneIncoming, Bot, CalendarCheck, Check, Repeat2, Send];
/** Centre vertical des pastilles d'étape (taille 36 px). */
const NODE_CENTER = 18;

type LaneKind = "before" | "after";

export function TransformationSection() {
  const root = useRef<HTMLElement>(null);
  const [view, setView] = useState<LaneKind>("before");
  const toggleId = useId();
  const interacted = useRef(false);
  const autoAdvance = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      // — Ordinateur : les deux parcours avancent ensemble au défilement —
      mm.add({ desktop: MEDIA.desktop, motion: MEDIA.motion }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!desktop || !motion) return;
        const q = gsap.utils.selector(section);
        const track = q("[data-compare-track]")[0] as HTMLElement | undefined;
        if (!track) return;
        // La hauteur de défilement est réservée en CSS (html.motion) ; la
        // timeline n'est construite qu'à l'approche de la séquence.
        const setup = context.add("setupDesktop", () => {
          const before = q('[data-lane="before"] [data-step]');
          const after = q('[data-lane="after"] [data-step]');
          const waits = q("[data-wait]");

          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
            },
          });

          // Parcours assisté : fluide et continu.
          const segments = q('[data-lane="after"] [data-seg]');
          const orb = q("[data-after-orb]");
          tl.fromTo(
            q("[data-after-bar]"),
            { scaleX: 0 },
            { scaleX: 1, duration: 4.6, ease: "none" },
            0.2,
          ).fromTo(orb, { y: 0, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.2);
          after.forEach((step, i) => {
            const at = 0.2 + i * 0.86;
            tl.fromTo(step, { opacity: 0.12, x: 16 }, { opacity: 1, x: 0, duration: 0.5 }, at);
            const node = step.querySelector("[data-node]");
            if (node)
              tl.fromTo(
                node,
                { scale: 0.6 },
                { scale: 1, duration: 0.4, ease: "back.out(2.2)" },
                at + 0.05,
              );
            const segment = segments[i];
            if (segment) {
              tl.fromTo(segment, { scaleY: 0 }, { scaleY: 1, duration: 0.86, ease: "none" }, at).to(
                orb,
                {
                  y: () => (after[i + 1] as HTMLElement | undefined)?.offsetTop ?? 0,
                  duration: 0.86,
                  ease: "none",
                },
                at,
              );
            }
          });
          tl.fromTo(
            q('[data-summary="after"]'),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            4.8,
          ).fromTo(q("[data-after-glow]"), { opacity: 0 }, { opacity: 1, duration: 1 }, 4.6);

          // Parcours actuel : attentes, retours en arrière, ressaisies.
          tl.fromTo(
            q("[data-before-bar]"),
            { scaleX: 0 },
            { scaleX: 1, duration: 7.4, ease: "none" },
            0.2,
          );
          before.forEach((step, i) => {
            const at = 0.2 + i * 1.3;
            const wait = waits[i - 1];
            if (wait) tl.fromTo(wait, { opacity: 0 }, { opacity: 1, duration: 0.35 }, at - 0.55);
            tl.fromTo(step, { opacity: 0.12, x: -16 }, { opacity: 1, x: 0, duration: 0.5 }, at);
            if (i === 1) {
              tl.to(
                step,
                { keyframes: { x: [0, -6, 6, -4, 3, 0] }, duration: 0.6, ease: "none" },
                at + 0.5,
              );
            }
          });
          tl.fromTo(
            q("[data-loop]"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.8 },
            0.2 + 2 * 1.3 + 0.3,
          )
            .fromTo(
              q('[data-summary="before"]'),
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6 },
              7.5,
            )
            .to({}, { duration: 0.6 });
          const progress = tl.scrollTrigger?.progress ?? 0;
          tl.progress(1, true).progress(progress, true);
        }) as () => void;
        const stop = observeOnce(track, setup, "0px 0px 100% 0px");
        return () => stop();
      });

      // — Mobile : chaque parcours se déroule lorsqu'il est affiché —
      mm.add({ mobile: MEDIA.mobile, motion: MEDIA.motion }, (context) => {
        const { mobile, motion } = context.conditions as { mobile: boolean; motion: boolean };
        if (!mobile || !motion) return;
        const compare = section.querySelector("[data-compare]");
        if (!compare) return;
        const setup = context.add("setupMobile", () =>
          (["before", "after"] as const).forEach((kind) => {
            const lane = section.querySelector<HTMLElement>(`[data-lane="${kind}"]`);
            if (!lane) return;
            const q = gsap.utils.selector(lane);
            const tl = gsap.timeline({
              paused: true,
              onComplete: () => {
                // Après « Aujourd'hui », la version assistée s'affiche d'elle-même.
                if (kind === "before") gsap.delayedCall(1.4, () => autoAdvance.current());
              },
            });
            tl.fromTo(
              q("[data-step]"),
              { opacity: 0, x: kind === "before" ? -14 : 14 },
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: kind === "before" ? 0.55 : 0.3,
              },
            );
            if (kind === "before") {
              tl.fromTo(
                q("[data-wait]"),
                { opacity: 0 },
                { opacity: 1, duration: 0.3, stagger: 0.55 },
                0.2,
              ).fromTo(
                q("[data-loop]"),
                { strokeDashoffset: 1 },
                { strokeDashoffset: 0, duration: 0.6 },
                1.2,
              );
            } else {
              tl.fromTo(
                q("[data-seg]"),
                { scaleY: 0 },
                { scaleY: 1, duration: 0.3, stagger: 0.3, ease: "none" },
                0.15,
              );
            }
            tl.fromTo(
              q("[data-summary]"),
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.5 },
              ">-0.1",
            );
            lane.addEventListener("lane:show", () => tl.restart());
            if (kind === "before") {
              ScrollTrigger.create({
                trigger: compare,
                start: "top 70%",
                once: true,
                onEnter: () => tl.play(0),
              });
            }
          }),
        ) as () => void;
        return observeOnce(compare, setup, "0px 0px 100% 0px");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const select = (kind: LaneKind, byUser = true) => {
    if (byUser) interacted.current = true;
    setView(kind);
    const lane = root.current?.querySelector(`[data-lane="${kind}"]`);
    window.requestAnimationFrame(() => lane?.dispatchEvent(new Event("lane:show")));
  };

  useEffect(() => {
    autoAdvance.current = () => {
      if (!interacted.current) select("after", false);
    };
  });

  return (
    <section
      ref={root}
      id="transformation"
      aria-labelledby="transformation-title"
      className="relative py-24 md:pt-36 lg:pb-0"
    >
      <div className="container-x">
        <header className="max-w-4xl">
          <Eyebrow tone="aube">{transformation.eyebrow}</Eyebrow>
          <SplitHeading
            id="transformation-title"
            text={transformation.title}
            className="mt-6 text-headline font-medium text-ivory"
          />
          <Reveal as="p" className="mt-6 max-w-2xl text-lead text-mist" delay={0.15}>
            {transformation.subtitle}
          </Reveal>
        </header>
      </div>

      <div data-compare-track className="relative">
        <div
          data-compare
          className="relative lg:flex lg:h-[100svh] lg:items-center lg:pt-[var(--header-height)]"
        >
          <div className="container-x">
            <div
              role="group"
              aria-label={transformation.tabsLabel}
              className="mt-10 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 lg:hidden"
            >
              {(["before", "after"] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  aria-pressed={view === kind}
                  aria-controls={`${toggleId}-${kind}`}
                  onClick={() => select(kind)}
                  className={cn(
                    "min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-300",
                    view === kind
                      ? kind === "after"
                        ? "bg-ivory text-ink-950"
                        : "bg-ember/90 text-ink-950"
                      : "text-mist hover:text-ivory",
                  )}
                >
                  {transformation[kind].label}
                </button>
              ))}
            </div>

            <div className="surface relative mt-6 overflow-hidden rounded-[var(--radius-stage)] lg:mt-0 lg:grid lg:grid-cols-2">
              <div
                data-after-glow
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 top-1/2 hidden h-[120%] w-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.12),transparent)] lg:block"
              />
              <Lane kind="before" id={`${toggleId}-before`} hidden={view !== "before"} />
              <Lane kind="after" id={`${toggleId}-after`} hidden={view !== "after"} />
            </div>

            <p className="mt-5 text-center text-sm text-dim">{transformation.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lane({ kind, id, hidden }: { kind: LaneKind; id: string; hidden: boolean }) {
  const lane = transformation[kind];
  const before = kind === "before";
  const titleId = `${id}-title`;

  return (
    <div
      id={id}
      data-lane={kind}
      role="group"
      aria-labelledby={titleId}
      className={cn(
        "relative p-5 sm:p-8 lg:block lg:p-10",
        before ? "lg:border-r lg:border-white/[0.07]" : "",
        hidden ? "max-lg:hidden" : "",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            id={titleId}
            className={cn(
              "text-[1.35rem] font-medium tracking-[-0.025em]",
              before ? "text-ivory" : "text-ivory",
            )}
          >
            {lane.label}
          </h3>
          <p
            className={cn(
              "mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em]",
              before ? "text-ember" : "text-aqua",
            )}
          >
            {lane.caption}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="mt-2 hidden h-1 w-24 overflow-hidden rounded-full bg-white/[0.07] lg:block"
        >
          <span
            data-before-bar={before ? "" : undefined}
            data-after-bar={before ? undefined : ""}
            className={cn(
              "block h-full origin-left rounded-full",
              before ? "bg-ember/80" : "bg-[linear-gradient(90deg,#ffc88f,#86e6da)]",
            )}
          />
        </span>
      </div>

      <LaneSteps kind={kind} />

      <p
        data-summary={kind}
        className={cn(
          "mt-6 rounded-2xl border px-4 py-3 text-[0.9rem] leading-relaxed",
          before
            ? "border-ember/20 bg-ember/[0.06] text-mist"
            : "border-aqua/25 bg-aqua/[0.07] text-ivory",
        )}
      >
        {lane.summary}
      </p>
    </div>
  );
}

function LaneSteps({ kind }: { kind: LaneKind }) {
  const lane = transformation[kind];
  const before = kind === "before";
  const icons = before ? BEFORE_ICONS : AFTER_ICONS;
  const listRef = useRef<HTMLOListElement>(null);
  const loopRef = useRef<SVGSVGElement>(null);

  // Boucle « le client rappelle » : de l'étape 3 vers l'étape 1.
  useLayoutEffect(() => {
    if (!before) return;
    const list = listRef.current;
    const loop = loopRef.current;
    if (!list || !loop) return;
    const place = () => {
      const items = list.querySelectorAll<HTMLElement>("[data-step]");
      const first = items[0];
      const third = items[2];
      if (!first || !third) return;
      loop.style.top = `${first.offsetTop + NODE_CENTER}px`;
      loop.style.height = `${third.offsetTop - first.offsetTop}px`;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [before]);

  return (
    <div className="relative mt-8">
      {!before ? (
        <span
          data-after-orb
          aria-hidden="true"
          className="absolute left-[13px] z-20 hidden size-[9px] rounded-full bg-ivory shadow-[0_0_16px_5px_rgb(134_230_218/0.75)] lg:block"
          style={{ top: NODE_CENTER - 4.5 }}
        />
      ) : (
        <svg
          ref={loopRef}
          aria-hidden="true"
          className="pointer-events-none absolute -left-7 hidden w-6 overflow-visible text-ember/70 sm:block"
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
        >
          <path
            data-loop
            d="M40 100 C 0 100, 0 0, 40 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="1"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      <ol ref={listRef} className="relative">
        {lane.steps.map((step, i) => {
          const Icon = icons[i] ?? Check;
          const friction = before && step.tag;
          const last = i === lane.steps.length - 1;
          return (
            <li
              key={step.text}
              data-step
              className="relative flex items-start gap-4 pb-6 pr-12 last:pb-0"
            >
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[17px] top-[18px] h-full w-px",
                    before ? "border-l border-dashed border-white/15" : "bg-white/[0.08]",
                  )}
                >
                  {!before ? (
                    <span
                      data-seg
                      className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,#ffc88f,#86e6da)] shadow-[0_0_12px_1px_rgb(134_230_218/0.6)]"
                    />
                  ) : null}
                </span>
              ) : null}
              {before && i > 0 ? (
                <span
                  data-wait
                  aria-hidden="true"
                  className="absolute -top-4 left-[28px] flex size-5 items-center justify-center text-dim"
                >
                  <Hourglass className="size-3" aria-hidden="true" />
                </span>
              ) : null}
              <span
                data-node
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border",
                  before
                    ? friction
                      ? "border-ember/40 bg-ink-900 text-ember"
                      : "border-white/15 bg-ink-900 text-mist"
                    : "border-aqua/45 bg-ink-900 text-aqua",
                )}
              >
                <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-1.5">
                <p className="text-[0.98rem] leading-snug text-ivory">{step.text}</p>
                {step.tag ? (
                  <span
                    className={cn(
                      "mt-1.5 inline-flex rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em]",
                      before
                        ? i <= 2
                          ? "border-ember/35 bg-ember/10 text-ember"
                          : "border-amber/30 bg-amber/10 text-amber"
                        : "border-aqua/30 bg-aqua/10 text-aqua",
                    )}
                  >
                    {step.tag}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
