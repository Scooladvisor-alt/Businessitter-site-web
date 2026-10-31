import { Fragment } from "react";
import { cn } from "@/lib/cn";

type RichTextProps = {
  text: string;
  /** Classes appliquées aux segments mis en valeur (*…*). */
  accentClassName?: string;
};

/**
 * Affiche un texte où les segments entourés d'astérisques sont mis en
 * valeur (italique à empattements, dégradé « aube »).
 */
export function RichText({ text, accentClassName }: RichTextProps) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className={cn("accent-serif text-aube", accentClassName)}>
            {part}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Retire les marqueurs de mise en valeur (pour les attributs, métadonnées…). */
export function plainText(text: string): string {
  return text.replace(/\*/g, "");
}
