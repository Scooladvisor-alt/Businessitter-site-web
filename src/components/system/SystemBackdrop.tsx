"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import type { SystemQuality, SystemScene } from "./system-scene";
import { backdropState, SCROLL_SPIN, type BackdropAnchor } from "./backdrop-presets";

function detectQuality(): SystemQuality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  const small = window.matchMedia("(max-width: 767px)").matches;
  return cores <= 4 || memory <= 4 || small ? "low" : "high";
}

function shouldSkip(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

/** Sections visibles de la page courante qui déclarent une mise en scène. */
function collectAnchors(): BackdropAnchor[] {
  const scrollY = window.scrollY;
  return Array.from(document.querySelectorAll<HTMLElement>("[data-backdrop]"))
    .filter((el) => el.getClientRects().length > 0)
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        name: el.dataset.backdrop ?? "section",
        top: rect.top + scrollY,
        height: rect.height,
      };
    })
    .sort((a, b) => a.top - b.top);
}

/**
 * Arrière-plan WebGL commun à tout le site : le « système » Businessitter
 * accompagne la lecture de bout en bout, piloté par le défilement (états
 * déclarés par section via `data-backdrop`). Démarré après le premier rendu,
 * jamais chargé en mouvements réduits ou en mode « économie de données » :
 * les visuels SVG statiques restent alors affichés.
 */
export function SystemBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);
  const refreshRef = useRef<(() => void) | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || shouldSkip()) return;

    // Un canvas neuf à chaque montage : jamais de contexte WebGL déjà libéré.
    const canvas = document.createElement("canvas");
    canvas.className = "system-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.ready = "false";

    let disposed = false;
    let scene: SystemScene | null = null;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      const { SystemScene } = await import("./system-scene");
      if (disposed) return;
      host.appendChild(canvas);

      try {
        scene = new SystemScene(canvas, detectQuality());
      } catch {
        return; // WebGL indisponible : les visuels SVG restent affichés.
      }
      const instance = scene;
      let anchors = collectAnchors();
      let first = true;
      let frame = 0;

      const compute = () => {
        frame = 0;
        const docHeight = document.documentElement.scrollHeight;
        const viewport = { width: window.innerWidth, height: window.innerHeight, docHeight };
        const { state, shape } = backdropState(anchors, window.scrollY, viewport);
        const page = window.scrollY / Math.max(1, docHeight - viewport.height);
        // Premier calcul appliqué sans transition (la scène apparaît en fondu).
        instance.setTargets({ ...state, spin: page * SCROLL_SPIN }, first);
        instance.setFieldShape(shape, first);
        // Formation courante (lisible par les tests et les outils de diagnostic).
        if (document.documentElement.dataset.backdropShape !== shape) {
          document.documentElement.dataset.backdropShape = shape;
        }
        first = false;
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(compute);
      };
      const recollect = () => {
        anchors = collectAnchors();
        schedule();
      };
      refreshRef.current = () => requestAnimationFrame(() => requestAnimationFrame(recollect));

      const onResize = () => {
        instance.resize();
        recollect();
      };
      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        instance.setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          -((event.clientY / window.innerHeight) * 2 - 1),
        );
      };
      const onLeave = () => instance.releasePointer();
      const onVisibility = () => (document.hidden ? instance.stop() : compute());

      // La hauteur de la page change (contenus dépliés, polices, sections
      // hydratées) : les positions des sections sont relevées à nouveau.
      const resizeObserver = new ResizeObserver(() => recollect());
      resizeObserver.observe(document.body);

      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      ScrollTrigger.addEventListener("refresh", recollect);

      instance.onContextLost = () => {
        delete document.documentElement.dataset.system;
        canvas.dataset.ready = "false";
      };

      compute();
      requestAnimationFrame(() => {
        if (disposed) return;
        canvas.dataset.ready = "true";
        document.documentElement.dataset.system = "webgl";
      });

      cleanups.push(() => {
        cancelAnimationFrame(frame);
        refreshRef.current = null;
        resizeObserver.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", onVisibility);
        ScrollTrigger.removeEventListener("refresh", recollect);
      });
    };

    // Démarrage à la première interaction (ou après un court délai) : le
    // chargement initial reste léger, les visuels SVG assurent la continuité.
    const wakeEvents = [
      "pointermove",
      "pointerdown",
      "wheel",
      "touchstart",
      "keydown",
      "scroll",
    ] as const;
    let idleHandle = 0;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      wakeEvents.forEach((name) => window.removeEventListener(name, start));
      window.clearTimeout(fallback);
      idleHandle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(() => void boot(), { timeout: 900 })
          : window.setTimeout(() => void boot(), 120);
    };
    wakeEvents.forEach((name) => window.addEventListener(name, start, { passive: true }));
    const fallback = window.setTimeout(start, 3800);

    return () => {
      disposed = true;
      wakeEvents.forEach((name) => window.removeEventListener(name, start));
      window.clearTimeout(fallback);
      if (idleHandle && typeof window.cancelIdleCallback === "function")
        window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
      cleanups.forEach((fn) => fn());
      scene?.dispose();
      scene = null;
      delete document.documentElement.dataset.system;
      delete document.documentElement.dataset.backdropShape;
      canvas.remove();
    };
  }, []);

  // Changement de page : les sections de la nouvelle page sont relevées.
  useEffect(() => {
    refreshRef.current?.();
  }, [pathname]);

  return <div ref={hostRef} aria-hidden="true" />;
}
