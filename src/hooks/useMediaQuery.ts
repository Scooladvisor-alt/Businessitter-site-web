"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Abonnement à une requête média, sans écart d'hydratation :
 * le rendu serveur utilise `serverValue`, puis la vraie valeur s'applique.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** `true` si l'utilisateur préfère réduire les animations (vrai par défaut côté serveur). */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
