import { Fragment } from "react";
import { cn } from "@/lib/cn";

type Part = { text: string; accent: boolean };

/**
 * Découpe une phrase en mots animables (`data-word`), en conservant la mise
 * en valeur des segments entourés d'astérisques. Le dégradé est porté par
 * chaque mot (et non par un parent), ce qui reste correct quand les mots
 * sont animés individuellement. La ponctuation rattachée par une espace
 * insécable reste solidaire du mot qui la précède.
 */
export function RichWords({ text, wordClassName }: { text: string; wordClassName?: string }) {
  const units: Part[][] = [];
  let current: Part[] | null = null;
  let breakBefore = true;

  text.split("*").forEach((segment, index) => {
    const accent = index % 2 === 1;
    segment.split(" ").forEach((piece, i) => {
      if (i > 0) breakBefore = true;
      if (!piece) return;
      if (breakBefore || !current) {
        current = [];
        units.push(current);
        breakBefore = false;
      }
      current.push({ text: piece, accent });
    });
  });

  return (
    <>
      {units.map((parts, index) => (
        <Fragment key={index}>
          <span data-word className={cn("inline-block", wordClassName)}>
            {parts.map((part, i) =>
              part.accent ? (
                <em key={i} className="accent-serif text-aube">
                  {part.text}
                </em>
              ) : (
                <Fragment key={i}>{part.text}</Fragment>
              ),
            )}
          </span>
          {index < units.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
