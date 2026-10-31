/**
 * Observateurs d'intersection légers : ils remplacent ScrollTrigger pour
 * les simples apparitions (aucune mesure de mise en page forcée au
 * chargement, coût quasi nul pour le thread principal).
 */

/** Exécute `callback` une seule fois, lorsque l'élément entre dans la zone visible. */
export function observeOnce(
  element: Element,
  callback: () => void,
  rootMargin = "0px 0px -12% 0px",
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        callback();
      }
    },
    { rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

/**
 * Observe le franchissement d'une ligne horizontale virtuelle située à
 * `ratio` de la hauteur de la fenêtre (0 = haut, 1 = bas).
 */
export function observeLine(
  elements: Element[],
  ratio: number,
  callback: (entry: IntersectionObserverEntry) => void,
): () => void {
  const top = Math.round(ratio * 100);
  const observer = new IntersectionObserver((entries) => entries.forEach(callback), {
    rootMargin: `-${top}% 0px -${100 - top}% 0px`,
  });
  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

/** Exécute `callback` lors d'une période d'inactivité du navigateur. */
export function whenIdle(callback: () => void, timeout = 1200): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 200);
  return () => window.clearTimeout(handle);
}
