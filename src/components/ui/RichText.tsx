import { Fragment } from "react";
import { cn } from "@/lib/cn";

type RichTextProps = {
  text: string;
  /** Classes appliquées aux segments mis en valeur (*…*). */
  accentClassName?: string;
};

/** Retours à la ligne voulus (« \n ») : rendus par un <br />, à partir de 640 px. */
function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <>
              <br className="hidden sm:inline" />
              <span className="sm:hidden"> </span>
            </>
          ) : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Affiche un texte où les segments entourés d'astérisques sont mis en
 * valeur (italique à empattements, dégradé « aube »). Un « \n » marque un
 * retour à la ligne voulu sur les écrans larges.
 */
export function RichText({ text, accentClassName }: RichTextProps) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className={cn("accent-serif text-aube", accentClassName)}>
            <Lines text={part} />
          </em>
        ) : (
          <Lines key={index} text={part} />
        ),
      )}
    </>
  );
}

/** Retire les marqueurs de mise en valeur et de retour à la ligne. */
export function plainText(text: string): string {
  return text.replace(/\*/g, "").replace(/\n/g, " ");
}
