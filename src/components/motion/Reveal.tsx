type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "ul" | "ol" | "article" | "span" | "header" | "footer";
  /** Décalage vertical initial (px). */
  y?: number;
  /** Retard (s). */
  delay?: number;
  /** Anime les enfants directs en cascade (intervalle en s). */
  stagger?: number;
};

/**
 * Révélation progressive à l'entrée dans la fenêtre (opacité + translation),
 * entièrement en CSS et pilotée par `initReveals()`. Le contenu reste présent
 * pour les lecteurs d'écran, visible sans JavaScript et sous
 * `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 28,
  delay = 0,
  stagger,
}: RevealProps) {
  const style = {
    "--reveal-y": `${y}px`,
    "--reveal-delay": `${delay}s`,
    ...(stagger ? { "--reveal-stagger": `${stagger}s` } : {}),
  } as React.CSSProperties;

  return (
    <Tag
      className={className}
      style={style}
      {...(stagger ? { "data-reveal-children": "" } : { "data-reveal": "" })}
    >
      {children}
    </Tag>
  );
}
