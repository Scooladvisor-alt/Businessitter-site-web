import { createSystemData, SYSTEM_QUALITY } from "./system-data";

/**
 * Projection 2D du système (même caméra que la scène WebGL), utilisée par
 * le poster SVG statique et par l'image Open Graph.
 */

const CAMERA_Z = 10.5;
const FOCAL = 1 / Math.tan((19 * Math.PI) / 180);
const ROT_X = 0.12;
const ROT_Y = -0.35;

export type PosterGeometry = {
  viewBox: [number, number, number, number];
  path: string;
  nodes: { x: number; y: number; r: number }[];
  core: { x: number; y: number };
};

const round = (value: number) => Math.round(value * 1000) / 1000;

function project(x: number, y: number, z: number): [number, number, number] {
  const cy = Math.cos(ROT_Y);
  const sy = Math.sin(ROT_Y);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(ROT_X);
  const sx = Math.sin(ROT_X);
  const y2 = y * cx - z1 * sx;
  const z2 = y * sx + z1 * cx;
  const depth = CAMERA_Z - z2;
  return [(x1 * FOCAL) / depth, (-y2 * FOCAL) / depth, depth];
}

const cache = new Map<string, PosterGeometry>();

export function posterGeometry(variant: "chaos" | "order"): PosterGeometry {
  const cached = cache.get(variant);
  if (cached) return cached;

  const data = createSystemData(SYSTEM_QUALITY.poster);
  const source = variant === "chaos" ? data.chaos : data.order;
  const edges = variant === "chaos" ? data.chaosEdges : data.orderEdges;

  const projected = Array.from({ length: data.count }, (_, i) =>
    project(source[i * 3] ?? 0, source[i * 3 + 1] ?? 0, source[i * 3 + 2] ?? 0),
  );

  const xs = projected.map((p) => p[0]);
  const ys = projected.map((p) => p[1]);
  const pad = 0.08;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const width = Math.max(...xs) + pad - minX;
  const height = Math.max(...ys) + pad - minY;

  let path = "";
  for (let e = 0; e < edges.length; e += 2) {
    const a = projected[edges[e] as number];
    const b = projected[edges[e + 1] as number];
    if (!a || !b) continue;
    path += `M${round(a[0])} ${round(a[1])}L${round(b[0])} ${round(b[1])}`;
  }

  const geometry: PosterGeometry = {
    viewBox: [round(minX), round(minY), round(width), round(height)],
    path,
    nodes: projected.map(([x, y, depth], i) => ({
      x: round(x),
      y: round(y),
      r: round(((data.size[i] ?? 1) * 0.0062 * CAMERA_Z) / depth),
    })),
    core: { x: round(projected[0]?.[0] ?? 0), y: round(projected[0]?.[1] ?? 0) },
  };
  cache.set(variant, geometry);
  return geometry;
}

/** Version texte (SVG autonome), pour les images générées. */
export function posterSvg(variant: "chaos" | "order", opacity = 1): string {
  const g = posterGeometry(variant);
  const [x, y, w, h] = g.viewBox;
  const warm = variant === "chaos";
  const stops = warm ? ["#ffc88f", "#f3a9b2", "#bab5f2"] : ["#f3a9b2", "#bab5f2", "#86e6da"];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" opacity="${opacity}"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${x}" y1="0" x2="${x + w}" y2="0"><stop offset="0" stop-color="${stops[0]}"/><stop offset="0.5" stop-color="${stops[1]}"/><stop offset="1" stop-color="${stops[2]}"/></linearGradient></defs><path d="${g.path}" fill="none" stroke="url(#g)" stroke-opacity="0.35" stroke-width="0.004"/><g fill="url(#g)">${g.nodes
    .map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}"/>`)
    .join("")}</g></svg>`;
}
