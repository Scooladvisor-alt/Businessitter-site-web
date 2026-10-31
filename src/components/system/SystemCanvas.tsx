"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import type { SystemQuality, SystemScene, SystemTargets } from "./system-scene";

type Layout = Pick<SystemTargets, "offsetX" | "offsetY" | "scale">;

function smooth(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function layoutFor(phase: "hero" | "vision", width: number, height: number): Layout {
  const aspect = width / Math.max(1, height);
  if (phase === "hero") {
    if (aspect >= 1.25) return { offsetX: 1.6, offsetY: -0.05, scale: 1 };
    if (aspect >= 0.85) return { offsetX: 0.7, offsetY: -0.55, scale: 0.82 };
    return { offsetX: 0.15, offsetY: -1.45, scale: 0.58 };
  }
  if (aspect >= 1.25) return { offsetX: 0, offsetY: 0, scale: 0.95 };
  return { offsetX: 0, offsetY: 0, scale: Math.min(1, Math.max(0.5, aspect * 0.92)) };
}

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

type SystemCanvasProps = {
  /** Identifiant de la section d'ouverture (état « chaos »). */
  heroId: string;
  /** Identifiant de la section de conclusion (état « organisé »). */
  visionId: string;
};

/**
 * Canvas WebGL fixe, partagé par le hero et la séquence « Vision ».
 * Chargé après le premier rendu (import dynamique, période d'inactivité),
 * jamais chargé en mode « mouvements réduits » ou « économie de données » :
 * les posters SVG statiques restent alors affichés.
 */
export function SystemCanvas({ heroId, visionId }: SystemCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || shouldSkip()) return;

    // Un canvas neuf à chaque montage : une page conservée puis réaffichée
    // ne réutilise jamais un contexte WebGL déjà libéré.
    const canvas = document.createElement("canvas");
    canvas.className = "system-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.ready = "false";

    let disposed = false;
    let scene: SystemScene | null = null;
    const cleanups: (() => void)[] = [];

    const boot = async () => {
      const heroEl = document.getElementById(heroId);
      const visionEl = document.getElementById(visionId);
      if (!heroEl || !visionEl) return;

      const { SystemScene } = await import("./system-scene");
      if (disposed) return;
      host.appendChild(canvas);

      try {
        scene = new SystemScene(canvas, detectQuality());
      } catch {
        return; // WebGL indisponible : le poster SVG reste affiché.
      }
      const instance = scene;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      let hero: ScrollTrigger | null = null;
      let vision: ScrollTrigger | null = null;

      const compute = () => {
        if (!hero || !vision) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const hp = hero.progress;
        const vp = vision.progress;
        let targets: Omit<Partial<SystemTargets>, "opacity">;
        let opacity: number;
        let layout: Layout;

        if (vp > 0 && vp < 1) {
          layout = layoutFor("vision", w, h);
          opacity = smooth(0, 0.3, vp) * (1 - smooth(0.8, 1, vp)) * (mobile ? 0.7 : 0.85);
          targets = {
            morph: 0.3 + 0.7 * smooth(0.04, 0.55, vp),
            connect: 1,
            flow: 0.95,
            dolly: 0.1 + 0.25 * smooth(0.1, 0.8, vp),
          };
        } else if (hp < 1) {
          layout = layoutFor("hero", w, h);
          opacity = (1 - smooth(0.58, 0.96, hp)) * (mobile ? 0.75 : 1);
          targets = {
            morph: 0.24 * smooth(0.18, 0.95, hp),
            connect: 0.22 + 0.78 * smooth(0.02, 0.6, hp),
            flow: smooth(0.1, 0.6, hp),
            dolly: 0.6 * smooth(0, 1, hp),
          };
        } else {
          instance.setTargets({ opacity: 0 });
          return;
        }

        // Invisible : la mise en scène est appliquée sans transition.
        const hidden = instance.currentOpacity < 0.02;
        instance.setTargets({ ...layout, ...targets }, hidden);
        instance.setTargets({ opacity });
      };

      hero = ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        onUpdate: compute,
        onToggle: compute,
        onRefresh: compute,
      });
      vision = ScrollTrigger.create({
        trigger: visionEl,
        start: "top bottom",
        end: "bottom top",
        onUpdate: compute,
        onToggle: compute,
        onRefresh: compute,
      });

      const onResize = () => {
        instance.resize();
        compute();
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

      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);

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
        hero?.kill();
        vision?.kill();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", onVisibility);
      });
    };

    // Démarrage à la première interaction (ou après un court délai) : le
    // chargement initial reste léger, le poster SVG assure la continuité.
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
      canvas.remove();
    };
  }, [heroId, visionId]);

  return <div ref={hostRef} aria-hidden="true" />;
}
