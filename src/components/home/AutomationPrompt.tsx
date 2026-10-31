"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { CircleCheck, Plus } from "lucide-react";
import { possibilities } from "@/content/home";
import { auditDraft } from "@/lib/audit-draft";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { scrollToTarget } from "@/lib/scroll";
import { fr } from "@/lib/typography";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";

const copy = possibilities.prompt;
const PREFIX = fr("J'aimerais automatiser");

function toSentence(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (/^j[’']aimerais automatiser/i.test(trimmed)) return trimmed;
  const lower = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  return `${PREFIX} ${lower}`;
}

/** Machine à écrire décorative affichée tant que le champ est vide. */
function useTypewriter(words: readonly string[], enabled: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!enabled) return;
    let word = 0;
    let char = 0;
    let deleting = false;
    let timer: number;
    const tick = () => {
      const current = (words[word] ?? "").toLowerCase();
      if (!deleting) {
        char += 1;
        setText(current.slice(0, char));
        if (char >= current.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1600);
          return;
        }
        timer = window.setTimeout(tick, 55);
      } else {
        char -= 1;
        setText(current.slice(0, Math.max(0, char)));
        if (char <= 0) {
          deleting = false;
          word = (word + 1) % words.length;
          timer = window.setTimeout(tick, 380);
          return;
        }
        timer = window.setTimeout(tick, 26);
      }
    };
    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, [words, enabled]);
  return text;
}

export function AutomationPrompt() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "empty" | "added">("idle");
  const [focused, setFocused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();
  const noteId = useId();
  const statusId = useId();

  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(Boolean(entry?.isIntersecting)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const typed = useTypewriter(copy.suggestions, visible && !reduced && !focused && value === "");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.trim()) {
      setStatus("empty");
      inputRef.current?.focus();
      return;
    }
    auditDraft.set(toSentence(value));
    setStatus("added");
    window.setTimeout(() => {
      scrollToTarget("audit", { focus: false });
      window.setTimeout(
        () => document.getElementById("audit-message")?.focus({ preventScroll: true }),
        1500,
      );
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      className="surface border-aube relative overflow-hidden rounded-[var(--radius-stage)] p-6 sm:p-10 lg:p-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(186_181_242/0.18),transparent)]"
      />
      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h3 className="text-title font-medium text-ivory">
            <RichText text={copy.title} />
          </h3>
          <p className="mt-4 text-[1rem] leading-relaxed text-mist">{copy.description}</p>
          <p id={noteId} className="mt-6 flex items-start gap-2 text-sm text-dim">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber" />
            {copy.note}
          </p>
        </div>

        <form onSubmit={submit} className="lg:col-span-7" noValidate>
          <label htmlFor={inputId} className="sr-only">
            {copy.label}
          </label>
          <div className="relative rounded-[1.4rem] border border-white/12 bg-ink-950/60 transition-colors focus-within:border-aqua/50">
            <textarea
              ref={inputRef}
              id={inputId}
              rows={3}
              maxLength={500}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={focused || reduced ? copy.placeholder : ""}
              aria-describedby={`${noteId} ${statusId}`}
              aria-invalid={status === "empty" || undefined}
              className="block w-full resize-none rounded-[1.4rem] bg-transparent px-5 pb-4 pt-5 text-[1.05rem] leading-relaxed text-ivory placeholder:text-dim focus:outline-none"
            />
            {!focused && !reduced && value === "" ? (
              <p
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-5 text-[1.05rem] leading-relaxed text-dim"
              >
                {PREFIX} <span className="text-mist">{typed}</span>
                <span className="ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] animate-pulse-soft bg-aqua" />
              </p>
            ) : null}
          </div>

          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            role="group"
            aria-label={copy.suggestionsLabel}
          >
            {copy.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setValue(toSentence(suggestion) + ".");
                  setStatus("idle");
                  inputRef.current?.focus();
                }}
                className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 text-[0.85rem] text-mist transition-colors hover:border-white/25 hover:text-ivory"
              >
                <Plus
                  className="size-3.5 text-dim transition-colors group-hover:text-aqua"
                  aria-hidden="true"
                />
                {suggestion}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" size="md" arrow>
              {copy.submit}
            </Button>
            <div id={statusId} role="status" aria-live="polite" className="min-h-6 text-sm">
              <AnimatePresence mode="wait">
                {status === "added" ? (
                  <m.p
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-aqua"
                  >
                    <CircleCheck className="size-4" aria-hidden="true" />
                    {copy.success}
                  </m.p>
                ) : status === "empty" ? (
                  <m.p
                    key="empty"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-amber"
                  >
                    {copy.empty}
                  </m.p>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
