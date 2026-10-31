"use client";

import { useRef } from "react";
import { Eye, Fingerprint, Scale, UserCheck, type LucideIcon } from "lucide-react";
import { trust } from "@/content/home";
import { gsap, MEDIA, useGSAP } from "@/lib/gsap";
import { observeOnce } from "@/lib/observe";
import { SplitHeading } from "@/components/motion/SplitHeading";

const ICONS: LucideIcon[] = [Fingerprint, Scale, UserCheck, Eye];

/** Couches de l'infrastructure (de l'intérieur vers l'extérieur). */
const LAYERS = [
  { size: 210, radius: 44 },
  { size: 290, radius: 60 },
  { size: 370, radius: 76 },
  { size: 450, radius: 92 },
];
const C = 240;

export function TrustSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      // Animations continues (balayage, flux) actives seulement à l'écran.
      const visibility = new IntersectionObserver(([entry]) =>
        section.classList.toggle("is-inview", Boolean(entry?.isIntersecting)),
      );
      visibility.observe(section);

      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, (context) => {
        const q = gsap.utils.selector(section);
        const infra = q("[data-infra]")[0];
        // Timeline préparée à l'approche, jouée à l'entrée dans la fenêtre.
        const build = context.add("buildInfra", () => {
          const tl = gsap.timeline();
          tl.from(
            q("[data-core]"),
            { scale: 0.6, opacity: 0, duration: 1, ease: "expo.out", transformOrigin: "50% 50%" },
            0,
          )
            .fromTo(
              q("[data-layer-shape]"),
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.4, stagger: 0.18, ease: "power3.inOut" },
              0.2,
            )
            .from(q("[data-layer-label]"), { opacity: 0, y: 8, duration: 0.6, stagger: 0.18 }, 0.8)
            .from(
              q("[data-layer-node]"),
              {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.04,
                ease: "back.out(2)",
                transformOrigin: "50% 50%",
              },
              1,
            )
            .from(q("[data-flow]"), { opacity: 0, duration: 0.6 }, 1.6);
        }) as () => void;
        return infra ? observeOnce(infra, build, "0px 0px -20% 0px") : undefined;
      });
      return () => {
        visibility.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="confiance"
      data-backdrop="confiance"
      data-trust
      aria-labelledby="confiance-title"
      className="group/trust relative overflow-clip py-24 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-20%] top-1/3 h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.07),transparent)]"
      />
      <div className="container-x relative">
        <header className="mx-auto max-w-3xl text-center">
          <SplitHeading
            id="confiance-title"
            text={trust.title}
            className="text-headline font-medium text-ivory"
          />
        </header>

        <div className="mt-14 flex flex-col items-center gap-16 md:mt-20">
          <div data-infra className="relative mx-auto w-full max-w-[26rem]" aria-hidden="true">
            <svg viewBox="0 0 480 480" className="h-auto w-full overflow-visible">
              <defs>
                <linearGradient id="trust-stroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffc88f" />
                  <stop offset="0.5" stopColor="#bab5f2" />
                  <stop offset="1" stopColor="#86e6da" />
                </linearGradient>
                <radialGradient id="trust-core">
                  <stop offset="0" stopColor="#86e6da" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#86e6da" stopOpacity="0" />
                </radialGradient>
              </defs>

              {LAYERS.map((layer, i) => {
                const x = C - layer.size / 2;
                const index = i + 1;
                const outer = i === LAYERS.length - 1;
                return (
                  <g key={layer.size} data-layer={index} className="trust-layer">
                    <rect
                      x={x}
                      y={x}
                      width={layer.size}
                      height={layer.size}
                      rx={layer.radius}
                      fill="none"
                      stroke="rgb(255 255 255 / 0.08)"
                      strokeWidth="1"
                    />
                    <rect
                      data-layer-shape
                      className="trust-shape"
                      x={x}
                      y={x}
                      width={layer.size}
                      height={layer.size}
                      rx={layer.radius}
                      fill="none"
                      stroke="url(#trust-stroke)"
                      strokeWidth="1.3"
                      pathLength={1}
                      strokeDasharray={outer ? "0.012 0.01" : "1"}
                    />
                    {[
                      [x + layer.radius * 0.29, x + layer.radius * 0.29],
                      [x + layer.size - layer.radius * 0.29, x + layer.radius * 0.29],
                      [x + layer.radius * 0.29, x + layer.size - layer.radius * 0.29],
                      [x + layer.size - layer.radius * 0.29, x + layer.size - layer.radius * 0.29],
                    ].map(([cx, cy], n) => (
                      <circle
                        key={n}
                        data-layer-node
                        cx={cx}
                        cy={cy}
                        r={2.6}
                        className="trust-node"
                        fill={n % 2 ? "#86e6da" : "#ffc88f"}
                      />
                    ))}
                    <text
                      data-layer-label
                      x={C}
                      y={x - 9}
                      textAnchor="middle"
                      className="trust-label fill-current text-[12px] text-dim"
                    >
                      {trust.items[i]?.layer}
                    </text>
                  </g>
                );
              })}

              {/* Supervision : balayage lumineux sur l'enveloppe extérieure */}
              <rect
                x={C - 225}
                y={C - 225}
                width={450}
                height={450}
                rx={92}
                fill="none"
                stroke="#f4f1ea"
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.06 0.94"
                className="trust-anim trust-scan"
              />

              {/* Cœur : vos données */}
              <g data-core>
                <circle cx={C} cy={C} r={92} fill="url(#trust-core)" />
                <rect
                  x={C - 52}
                  y={C - 52}
                  width={104}
                  height={104}
                  rx={30}
                  fill="#12151e"
                  stroke="rgb(255 255 255 / 0.16)"
                />
                <g
                  transform={`translate(${C - 12} ${C - 22})`}
                  stroke="#f4f1ea"
                  strokeWidth="1.6"
                  fill="none"
                >
                  <ellipse cx="12" cy="5" rx="10" ry="4" />
                  <path d="M2 5v12c0 2.2 4.5 4 10 4s10-1.8 10-4V5" />
                  <path d="M2 11c0 2.2 4.5 4 10 4s10-1.8 10-4" />
                </g>
                <text
                  x={C}
                  y={C + 32}
                  textAnchor="middle"
                  className="fill-ivory text-[11px] font-medium"
                >
                  {trust.core}
                </text>
              </g>

              {/* Flux entrant : contrôle humain avant traitement */}
              <g data-flow>
                <line
                  x1={12}
                  y1={C}
                  x2={C - 56}
                  y2={C}
                  stroke="rgb(255 255 255 / 0.1)"
                  strokeDasharray="3 5"
                />
                <line
                  x1={C + 56}
                  y1={C}
                  x2={468}
                  y2={C}
                  stroke="rgb(255 255 255 / 0.1)"
                  strokeDasharray="3 5"
                />
                <g transform={`translate(${C - 185} ${C})`}>
                  <circle
                    r={13}
                    fill="#12151e"
                    stroke="#ffbf80"
                    strokeOpacity="0.7"
                    className="trust-anim trust-checkpoint"
                  />
                  <g
                    transform="translate(-6 -6)"
                    stroke="#ffbf80"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <circle cx="5" cy="3.5" r="2.6" />
                    <path d="M0.5 11c0.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4" />
                    <path d="M8.5 8.5l1.6 1.6 2.6-3" />
                  </g>
                </g>
                <circle
                  cx={12}
                  cy={C}
                  r={4}
                  fill="#ffc88f"
                  className="trust-anim trust-packet-in"
                />
                <circle
                  cx={C + 56}
                  cy={C}
                  r={4}
                  fill="#86e6da"
                  className="trust-anim trust-packet-out"
                />
              </g>
            </svg>
          </div>

          <ul
            data-commitments
            data-reveal-children=""
            style={{ "--reveal-stagger": "0.1s", "--reveal-y": "40px" } as React.CSSProperties}
            className="grid w-full max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {trust.items.map((item, i) => {
              const Icon = ICONS[i] ?? Eye;
              return (
                <li
                  key={item.key}
                  data-commitment
                  data-card={i + 1}
                  className="surface group/card relative flex flex-col items-center rounded-[var(--radius-panel)] p-6 text-center transition-[border-color,background-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-white/20 sm:p-7"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-ivory transition-colors duration-500 group-hover/card:border-aqua/40 group-hover/card:text-aqua">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-[1.3rem] font-medium tracking-[-0.02em] text-ivory">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-mist">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
