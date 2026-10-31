"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, scrollToTarget, setLenis } from "@/lib/scroll";
import { initReveals } from "@/lib/reveal";

/**
 * Défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
 * — désactivé si l'utilisateur préfère réduire les animations ;
 * — sur écran tactile, le défilement natif est conservé ;
 * — les liens d'ancre de la page courante défilent en douceur.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (reduced.matches || lenis) return;
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    };

    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      tick = null;
      setLenis(null);
    };

    const onPreferenceChange = () => (reduced.matches ? stop() : start());

    start();
    reduced.addEventListener("change", onPreferenceChange);
    return () => {
      reduced.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  // Liens d'ancre vers la page courante : défilement fluide + focus.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;
      event.preventDefault();
      // Double rAF : laisse React fermer un éventuel menu avant de défiler.
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          if (scrollToTarget(id)) {
            window.history.pushState(window.history.state, "", url.hash);
          }
        }),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Après chaque navigation (hors premier affichage, déjà pris en charge par
  // ScrollTrigger au chargement) : recalcul des déclencheurs et ancre éventuelle.
  const firstRender = useRef(true);
  useEffect(() => {
    const isFirst = firstRender.current;
    firstRender.current = false;
    let timer = 0;
    const scrollToHash = (attempt = 0) => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      // La page peut encore être masquée (navigation conservée) : on réessaie.
      if (!target || target.getClientRects().length === 0) {
        if (attempt < 30) timer = window.setTimeout(() => scrollToHash(attempt + 1), 50);
        return;
      }
      scrollToTarget(target, { focus: false, immediate: true });
    };
    const frame = window.requestAnimationFrame(() => {
      initReveals();
      getLenis()?.resize();
      if (!isFirst) ScrollTrigger.refresh();
      timer = window.setTimeout(() => scrollToHash(), isFirst ? 120 : 60);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
