/**
 * Apparitions au défilement, en CSS (voir globals.css).
 *
 * Au démarrage, les éléments déjà visibles restent affichés tels quels ;
 * seuls ceux situés plus bas sont masqués, puis révélés par un unique
 * IntersectionObserver partagé. Sans JavaScript, ou sous « mouvements
 * réduits », tout reste visible.
 */

const SELECTOR =
  "[data-reveal]:not([data-revealed]), [data-reveal-children]:not([data-revealed]), [data-split]:not([data-split-done])";

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer?.unobserve(el);
          el.setAttribute("data-revealing", "");
          el.setAttribute("data-revealed", "");
          window.setTimeout(() => el.removeAttribute("data-revealing"), 1800);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
  }
  return observer;
}

/**
 * Prépare les apparitions de la page courante (à appeler au démarrage et
 * après chaque navigation). Lectures groupées, puis écritures groupées.
 */
export function initReveals(): void {
  window.__bsrBoot = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
  const height = window.innerHeight;
  const visible = elements.map((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < height && rect.bottom > 0 && rect.height > 0;
  });
  elements.forEach((el, index) => {
    const isSplit = el.hasAttribute("data-split");
    if (visible[index]) {
      el.setAttribute(isSplit ? "data-split-done" : "data-revealed", "");
    } else if (!isSplit) {
      getObserver().observe(el);
    }
  });
  document.documentElement.setAttribute("data-motion-ready", "");
}

declare global {
  interface Window {
    __bsrBoot?: boolean;
  }
}

/**
 * Script exécuté avant le premier rendu : réserve dès l'affichage la hauteur
 * des scènes « collantes » (classe `motion` sur <html>) afin que la mise en
 * page soit définitive immédiatement — les ancres (#realisation, #audit…)
 * tombent ainsi au bon endroit. Retiré si l'application ne démarre pas.
 */
export const motionBootScript = `(function(){try{var d=document.documentElement;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("motion");setTimeout(function(){if(!window.__bsrBoot)d.classList.remove("motion")},8000)}catch(e){}})();`;
