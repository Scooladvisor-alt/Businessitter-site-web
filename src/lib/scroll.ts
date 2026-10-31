import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

function headerOffset(): number {
  if (typeof window === "undefined") return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed * (value.includes("rem") ? rem : 1) : 72;
}

/**
 * Fait défiler la page jusqu'à un élément (défilement fluide si Lenis est
 * actif, natif sinon), puis place le focus sur la cible pour les lecteurs
 * d'écran et la navigation au clavier.
 */
export function scrollToTarget(
  target: string | HTMLElement,
  options: { focus?: boolean; offset?: number; immediate?: boolean } = {},
): boolean {
  if (typeof window === "undefined") return false;
  const element =
    typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : target;
  if (!element) return false;

  const offset = -(options.offset ?? headerOffset() + 12);
  const reduced =
    options.immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const focus = () => {
    if (options.focus === false) return;
    const focusable = element.matches("[tabindex], a, button, input, select, textarea")
      ? element
      : null;
    if (!focusable && !element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1");
    }
    (focusable ?? element).focus({ preventScroll: true });
  };

  // Cible absolue calculée depuis la position native (et non depuis l'état
  // interne de Lenis, qui peut être en retard après une navigation).
  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY + offset);

  if (lenisInstance) {
    // Les dimensions de la page ont pu changer (navigation, scènes collantes).
    lenisInstance.resize();
    lenisInstance.scrollTo(top, {
      duration: 1.4,
      immediate: reduced,
      force: true,
      onComplete: focus,
    });
    if (reduced) focus();
  } else {
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    window.setTimeout(focus, reduced ? 0 : 600);
  }
  return true;
}
