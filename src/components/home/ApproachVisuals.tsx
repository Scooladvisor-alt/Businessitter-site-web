import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileBarChart2,
  ListChecks,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { approach } from "@/content/home";
import { cn } from "@/lib/cn";

const visuals = approach.visuals;

function Frame({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="surface relative overflow-hidden rounded-[var(--radius-panel)] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <p className="text-sm font-medium text-ivory">{title}</p>
        {badge}
      </div>
      <div className="pt-5">{children}</div>
    </div>
  );
}

/** Étape 01 — carnet d'audit. */
export function UnderstandVisual({ items }: { items: readonly string[] }) {
  return (
    <Frame
      title={visuals.understand.title}
      badge={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-amber">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-amber" />
          {visuals.understand.status}
        </span>
      }
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            data-v-item
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-[0.88rem] text-ivory/90"
          >
            <span className="relative flex size-5 shrink-0 items-center justify-center rounded-md border border-white/15">
              <span
                data-v-check
                className="absolute inset-0 flex items-center justify-center rounded-md bg-aqua text-ink-950"
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Étape 02 — cartographie des processus et opportunités. */
export function IdentifyVisual() {
  const v = visuals.identify;
  const highlighted = new Set([1, 2]);
  const levels = [0.82, 0.7, 0.3];
  return (
    <Frame title={v.title} badge={<ListChecks className="size-4 text-mist" aria-hidden="true" />}>
      <ol className="flex items-center justify-between gap-1">
        {v.process.map((step, i) => (
          <li key={step} className="flex flex-1 items-center gap-1 last:flex-none">
            <span className="relative flex flex-col items-center gap-2">
              <span
                data-v-node
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-2xl border text-[0.7rem] font-medium sm:size-12",
                  highlighted.has(i)
                    ? "border-amber/50 bg-amber/10 text-amber"
                    : "border-white/12 bg-white/[0.03] text-mist",
                )}
              >
                {highlighted.has(i) ? (
                  <>
                    <span
                      data-v-glow
                      className="absolute -inset-1.5 rounded-[1.2rem] border border-amber/30"
                    />
                    <Sparkles className="size-4" aria-hidden="true" />
                  </>
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span className="text-center text-[0.68rem] text-mist sm:text-[0.74rem]">{step}</span>
            </span>
            {i < v.process.length - 1 ? (
              <span aria-hidden="true" className="mb-6 h-px flex-1 bg-white/12" />
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-[0.75rem] text-amber">
        <Sparkles className="size-3.5" aria-hidden="true" />
        {v.opportunity}
      </p>
      <ul className="mt-5 space-y-3">
        {v.criteria.map((criterion, i) => (
          <li
            key={criterion}
            className="grid grid-cols-[8.5rem_1fr] items-center gap-3 text-[0.8rem] text-mist"
          >
            {criterion}
            <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <span
                data-v-meter
                className="block h-full origin-left rounded-full bg-[linear-gradient(90deg,#ffc88f,#86e6da)]"
                style={{ width: `${(levels[i] ?? 0.5) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Étape 03 — rapport d'audit et proposition. */
export function RecommendVisual({ items }: { items: readonly string[] }) {
  const v = visuals.recommend;
  const estimated = new Set([2, 4]);
  return (
    <Frame
      title={v.title}
      badge={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-aqua/30 bg-aqua/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-aqua">
          <BadgeCheck className="size-3" aria-hidden="true" />
          {v.status}
        </span>
      }
    >
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item}
            data-v-item
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
          >
            <span className="flex items-center gap-3 text-[0.86rem] text-ivory/90">
              <FileBarChart2
                className="size-4 shrink-0 text-dim"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              {item}
            </span>
            {estimated.has(i) ? (
              <span className="hidden shrink-0 rounded-full border border-lilac/30 bg-lilac/10 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-lilac sm:inline">
                {v.badge}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Étape 04 — conception, intégration et suivi. */
export function BuildVisual() {
  const v = visuals.build;
  return (
    <Frame title={v.title} badge={<RefreshCw className="size-4 text-mist" aria-hidden="true" />}>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-3 h-[calc(100%-1.5rem)] w-px bg-white/10"
        />
        <span
          data-v-progress
          aria-hidden="true"
          className="absolute left-[11px] top-3 h-[calc(100%-1.5rem)] w-px origin-top bg-[linear-gradient(to_bottom,#ffc88f,#86e6da)]"
        />
        <ol className="space-y-3">
          {v.stages.map((stage, i) => (
            <li key={stage} data-v-item className="relative flex items-center gap-4">
              <span
                className={cn(
                  "relative z-10 flex size-6 items-center justify-center rounded-full border text-[0.6rem]",
                  i === v.stages.length - 1
                    ? "border-aqua/50 bg-ink-800 text-aqua"
                    : "border-white/20 bg-ink-800 text-ivory",
                )}
              >
                {i === v.stages.length - 1 ? (
                  <RefreshCw className="size-3" aria-hidden="true" />
                ) : (
                  <Check className="size-3" strokeWidth={2.6} aria-hidden="true" />
                )}
              </span>
              <span className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[0.86rem] text-ivory/90">
                {stage}
                <ArrowRight className="size-3.5 text-dim" aria-hidden="true" />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}
