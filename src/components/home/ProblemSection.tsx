"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  BellRing,
  CalendarClock,
  Check,
  Copy,
  FileText,
  Mail,
  PhoneMissed,
  Receipt,
  ShoppingBag,
  UserCheck,
  UserRound,
  Voicemail,
  type LucideIcon,
} from "lucide-react";
import { problem, type TaskIcon } from "@/content/home";
import { gsap, MEDIA, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const ICONS: Record<TaskIcon, LucideIcon> = {
  phone: PhoneMissed,
  mail: Mail,
  file: FileText,
  copy: Copy,
  calendar: CalendarClock,
  bell: BellRing,
  voicemail: Voicemail,
  receipt: Receipt,
  user: UserRound,
  cart: ShoppingBag,
};

type Row = {
  /** Position verticale (fraction de la scène, depuis son centre). */
  y: number;
  rot: number;
  scale: number;
  alpha: number;
  /** Durée d'un cycle complet du défilé (s). */
  duration: number;
  reverse: boolean;
  /** Premier élément du défilé (variété entre les rangées). */
  start: number;
  /** Rangée apparaissant pendant l'accumulation. */
  late: boolean;
};

/** Éléments par rangée (chaque rangée en montre une sélection différente). */
const ROW_ITEMS = 8;

/** Les rangées du flot du quotidien : inclinées, croisées, à des vitesses différentes. */
const ROWS: Row[] = [
  {
    y: -0.36,
    rot: -10,
    scale: 0.84,
    alpha: 0.5,
    duration: 64,
    reverse: false,
    start: 0,
    late: true,
  },
  {
    y: -0.19,
    rot: 6,
    scale: 0.96,
    alpha: 0.78,
    duration: 52,
    reverse: true,
    start: 4,
    late: false,
  },
  { y: 0, rot: -3, scale: 1.08, alpha: 0.9, duration: 70, reverse: false, start: 8, late: true },
  { y: 0.19, rot: 9, scale: 0.92, alpha: 0.7, duration: 58, reverse: true, start: 2, late: false },
  { y: 0.36, rot: -7, scale: 1, alpha: 0.62, duration: 66, reverse: false, start: 6, late: true },
];

/** Découpe une phrase en mots animables (les espaces insécables sont conservés). */
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span data-word className="inline-block">
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function NoisePill({ icon, label }: { icon: TaskIcon; label: string }) {
  const Icon = ICONS[icon];
  return (
    <span className="flex h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/10 bg-ink-900/85 py-1 pl-1.5 pr-4 text-[0.92rem] text-ivory/90 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.9)] sm:h-12 sm:text-[0.98rem]">
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-ember/12 text-ember">
        <Icon className="size-4" strokeWidth={1.8} />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-ember ring-2 ring-ink-900" />
      </span>
      {label}
    </span>
  );
}

type FlowState = "pending" | "auto" | "review";

function FlowPill({ icon, label, state }: { icon: TaskIcon; label: string; state: FlowState }) {
  const Icon = state === "auto" ? Check : state === "review" ? UserCheck : ICONS[icon];
  return (
    <span
      className={cn(
        "flex h-10 w-[10.5rem] shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-3 text-[0.8rem] sm:h-11 sm:w-[13.5rem] sm:gap-2.5 sm:text-[0.9rem]",
        state === "pending" && "border-white/10 bg-ink-900/90 text-ivory/90",
        state === "auto" && "border-aqua/30 bg-[rgb(14_30_32/0.92)] text-ivory",
        state === "review" && "border-amber/35 bg-[rgb(34_28_22/0.92)] text-ivory",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          state === "pending" && "bg-ember/12 text-ember",
          state === "auto" && "bg-aqua/15 text-aqua",
          state === "review" && "bg-amber/15 text-amber",
        )}
      >
        <Icon className="size-3.5" strokeWidth={state === "auto" ? 2.4 : 1.9} />
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}

/**
 * Séquence 2 — Le constat. Scène « collante » en trois temps :
 * le flot du quotidien (des rangées de sollicitations qui s'accumulent et
 * s'accélèrent), la question (tout ralentit), puis un seul flux simple qui
 * traverse une passerelle : le répétitif en sort pris en charge, les
 * décisions en sortent « à valider par vous ».
 */
export function ProblemSection() {
  const root = useRef<HTMLElement>(null);
  // Le flot décoratif n'est rendu qu'à l'approche de la séquence : la page
  // reste légère au chargement (rien à hydrater tant qu'il n'est pas utile).
  const [noiseReady, setNoiseReady] = useState(false);

  useEffect(() => {
    const section = root.current;
    if (!section || noiseReady) return;
    if (window.matchMedia(MEDIA.reduced).matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setNoiseReady(true);
      },
      { rootMargin: "0px 0px 30% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [noiseReady]);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.reduced, () => {
        section.dataset.motion = "off";
        return () => delete section.dataset.motion;
      });

      mm.add(MEDIA.motion, () => {
        // Préparée à l'approche de la séquence seulement (voir noiseReady).
        if (!noiseReady) return;
        const q = gsap.utils.selector(section);
        const track = q("[data-stage-track]")[0] as HTMLElement | undefined;
        const stage = q("[data-stage]")[0] as HTMLElement | undefined;
        const band = q("[data-pipe-band]")[0] as HTMLElement | undefined;
        if (!track || !stage || !band) return;

        const rows = q("[data-noise-row]") as HTMLElement[];
        const noise = (q("[data-noise-track]") as HTMLElement[]).flatMap((el) =>
          el.getAnimations(),
        );
        const pipe = (q("[data-pipe-track]") as HTMLElement[]).flatMap((el) => el.getAnimations());

        // Les deux moitiés du flux défilent exactement ensemble.
        const now = document.timeline.currentTime;
        pipe.forEach((animation) => {
          animation.startTime = now;
          animation.pause();
        });

        const speed = { rate: 1 };
        const applyRate = () => noise.forEach((animation) => (animation.playbackRate = speed.rate));
        let noiseOn = true;
        let pipeOn = false;
        let visible = false;
        let progress = 0;
        // Les défilés ne tournent que lorsque la scène est à l'écran.
        const sync = () => {
          const wantNoise = visible && progress < 0.8;
          if (wantNoise !== noiseOn) {
            noise.forEach((animation) => (wantNoise ? animation.play() : animation.pause()));
            noiseOn = wantNoise;
          }
          const wantPipe = visible && progress > 0.5;
          if (wantPipe !== pipeOn) {
            pipe.forEach((animation) => (wantPipe ? animation.play() : animation.pause()));
            pipeOn = wantPipe;
          }
        };

        const watch = ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            sync();
          },
        });
        visible = watch.isActive;
        sync();

        let built: gsap.Context | null = null;

        const build = () => {
          built?.revert();
          built = gsap.context(() => {
            const height = stage.offsetHeight;
            const stageRect = stage.getBoundingClientRect();
            const bandRect = band.getBoundingClientRect();
            const pipeY =
              bandRect.top + bandRect.height / 2 - (stageRect.top + stageRect.height / 2);
            const row = (i: number) => ROWS[i % ROWS.length] as Row;
            const late = rows.filter((_, i) => row(i).late);

            const questionWords = q("[data-question] [data-word]");
            const resolvedWords = q("[data-text-b] [data-word]");
            const accentWords = q("[data-text-b2] [data-word]");

            // États initiaux, posés explicitement.
            gsap.set(rows, {
              y: (i) => row(i).y * height,
              rotation: (i) => row(i).rot,
              scale: (i) => row(i).scale,
              opacity: (i) => (row(i).late ? 0 : row(i).alpha),
            });
            gsap.set(q("[data-veil]"), { opacity: 0.85 });
            gsap.set(q("[data-text-a]"), { opacity: 1, y: 0, filter: "blur(0px)" });
            gsap.set(q("[data-question]"), { opacity: 1, y: 0, filter: "blur(0px)" });
            gsap.set(questionWords, { opacity: 0, y: 18, filter: "blur(10px)" });
            gsap.set([...resolvedWords, ...accentWords], {
              opacity: 0,
              y: 14,
              filter: "blur(8px)",
            });
            gsap.set(q("[data-pipe]"), { opacity: 0 });
            gsap.set(q("[data-pipe-line]"), { scaleX: 0 });
            gsap.set(q("[data-gate]"), { opacity: 0, scale: 0.4 });
            gsap.set(q("[data-legend]"), { opacity: 0, y: 8 });
            speed.rate = 1;
            applyRate();

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: track,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                  progress = self.progress;
                  sync();
                },
              },
            });

            // 1. Le flot du quotidien s'épaissit et s'accélère.
            tl.to(
              late,
              {
                opacity: (_, el: HTMLElement) => row(rows.indexOf(el)).alpha,
                duration: 0.7,
                stagger: 0.6,
              },
              0.2,
            )
              .to(rows, { scale: (i) => row(i).scale * 1.12, duration: 3 }, 0)
              .to(speed, { rate: 2.8, duration: 3, ease: "power1.in", onUpdate: applyRate }, 0)
              .to(q("[data-veil]"), { opacity: 1, duration: 1 }, 0)
              .to(
                q("[data-text-a]"),
                { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.6, ease: "power1.in" },
                2.5,
              );

            // 2. Tout ralentit ; la question se pose.
            tl.to(speed, { rate: 0.06, duration: 1.1, ease: "power2.out", onUpdate: applyRate }, 3)
              .to(rows, { opacity: 0.14, duration: 1 }, 3.05)
              .to(
                questionWords,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.45,
                  stagger: 0.08,
                  ease: "power2.out",
                },
                3.4,
              )
              .to(
                q("[data-question]"),
                { opacity: 0, y: -36, filter: "blur(8px)", duration: 0.35, ease: "power1.in" },
                4.95,
              );

            // 3. Les rangées convergent en un seul flux, simple et lisible.
            tl.to(
              rows,
              {
                rotation: 0,
                y: pipeY,
                scale: 0.9,
                duration: 1.2,
                stagger: 0.06,
                ease: "power2.inOut",
              },
              5,
            )
              .to(rows, { opacity: 0, duration: 0.6, stagger: 0.06 }, 5.55)
              .to(speed, { rate: 0.7, duration: 1.2, onUpdate: applyRate }, 5)
              .to(q("[data-pipe]"), { opacity: 1, duration: 0.6 }, 5.22)
              .to(q("[data-pipe-line]"), { scaleX: 1, duration: 0.8, ease: "power2.out" }, 5.22)
              .to(
                q("[data-gate]"),
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
                5.25,
              )
              .to(
                resolvedWords,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.45,
                  stagger: 0.07,
                  ease: "power2.out",
                },
                5.1,
              )
              .to(
                accentWords,
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.45,
                  stagger: 0.07,
                  ease: "power2.out",
                },
                5.8,
              )
              .to(q("[data-legend]"), { opacity: 1, y: 0, duration: 0.5 }, 6.4)
              .to({}, { duration: 0.9 });
          }, section);
        };

        build();

        // Recalcul complet si la largeur change (positions relatives à la scène).
        let width = window.innerWidth;
        let timer = 0;
        const onResize = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (window.innerWidth === width) return;
            width = window.innerWidth;
            build();
            ScrollTrigger.refresh();
          }, 200);
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          window.clearTimeout(timer);
          watch.kill();
          built?.revert();
          noise.forEach((animation) => {
            animation.playbackRate = 1;
            animation.play();
          });
          pipe.forEach((animation) => animation.play());
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [noiseReady], revertOnUpdate: true },
  );

  const noiseItems = problem.noise;
  const flow = problem.flow;

  return (
    <section
      ref={root}
      id="constat"
      data-backdrop="constat"
      data-problem
      aria-labelledby="constat-title"
      className="relative"
    >
      <div data-stage-track className="relative">
        <div
          data-stage
          className="relative flex flex-col items-center gap-14 overflow-clip py-24 md:gap-16 md:py-32"
        >
          {/* Le flot du quotidien (décor animé). */}
          <div
            data-noise
            data-motion-only
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {(noiseReady ? ROWS : []).map((row, index) => {
              const items = [
                ...noiseItems.slice(row.start),
                ...noiseItems.slice(0, row.start),
              ].slice(0, ROW_ITEMS);
              return (
                <div
                  key={index}
                  data-noise-row
                  data-late={row.late ? "" : undefined}
                  className="absolute left-1/2 top-1/2 w-[150vw] -translate-x-1/2 -translate-y-1/2 will-change-transform"
                  style={{
                    transform: `translateY(${row.y * 100}svh) rotate(${row.rot}deg) scale(${row.scale})`,
                  }}
                >
                  <div
                    data-noise-track
                    className="flex w-max gap-3 sm:gap-4"
                    style={{
                      animation: `noise-flow ${row.duration}s linear infinite`,
                      animationDirection: row.reverse ? "reverse" : "normal",
                    }}
                  >
                    {[...items, ...items, ...items].map((item, i) => (
                      <NoisePill key={i} icon={item.icon} label={item.label} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            data-veil
            data-motion-only
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_34%_at_center,rgb(5_6_10/0.94)_30%,rgb(5_6_10/0.55)_65%,transparent)]"
          />

          {/* 1. Le constat. */}
          <div data-slot="center" className="container-x relative">
            <div data-text-a className="mx-auto max-w-4xl text-center">
              <h2 id="constat-title" className="text-headline font-medium text-ivory">
                {problem.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lead text-mist">{problem.lead}</p>
            </div>
          </div>

          {/* 2. La question (mise en scène animée uniquement). */}
          <div data-slot="question" data-motion-only className="container-x">
            <p
              data-question
              className="mx-auto max-w-4xl text-center text-[clamp(2rem,1.2rem+3.4vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ivory"
            >
              <Words text={problem.transition} />
            </p>
          </div>

          {/* 3. La réponse. */}
          <div data-slot="top" className="container-x relative">
            <div className="mx-auto max-w-4xl text-center text-[clamp(1.75rem,1.1rem+2.6vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.035em]">
              <p data-text-b className="text-ivory">
                <Words text={problem.resolved} />
              </p>
              <p data-text-b2 className="text-amber">
                <Words text={problem.resolvedAccent} />
              </p>
            </div>
          </div>

          <div data-slot="pipe" className="relative w-full">
            <div data-pipe aria-hidden="true">
              <div data-pipe-band className="relative h-16 w-full sm:h-20">
                <div
                  data-pipe-line
                  className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgb(255_143_104/0.45)_22%,rgb(255_143_104/0.6)_50%,rgb(134_230_218/0.6)_50%,rgb(134_230_218/0.45)_78%,transparent)]"
                />
                {(["pending", "done"] as const).map((side) => (
                  <div
                    key={side}
                    className={cn(
                      "absolute inset-0 overflow-hidden",
                      side === "pending"
                        ? "[clip-path:inset(0_50%_0_0)]"
                        : "[clip-path:inset(0_0_0_50%)]",
                    )}
                  >
                    <div
                      data-pipe-track
                      className="absolute left-0 top-0 flex h-full w-max items-center gap-3 sm:gap-4"
                      style={{ animation: "pipe-flow 46s linear infinite" }}
                    >
                      {(noiseReady ? [...flow, ...flow, ...flow] : flow).map((item, i) => (
                        <FlowPill
                          key={i}
                          icon={item.icon}
                          label={side === "pending" ? item.from : item.to}
                          state={side === "pending" ? "pending" : item.status}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div
                  data-gate
                  className="absolute left-1/2 top-1/2 -ml-16 -mt-14 flex h-28 w-32 items-center justify-center"
                >
                  <span className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(134_230_218/0.16),transparent)]" />
                  <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgb(134_230_218/0.85),transparent)]" />
                  <span className="relative size-3 rounded-full bg-ivory shadow-[0_0_0_5px_rgb(134_230_218/0.16),0_0_26px_4px_rgb(134_230_218/0.7)]" />
                </div>
              </div>
            </div>
            <ul
              data-legend
              aria-hidden="true"
              className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.85rem] text-mist"
            >
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-aqua" />
                {problem.legend.auto}
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber" />
                {problem.legend.review}
              </li>
            </ul>
            <p className="sr-only">{problem.summary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
