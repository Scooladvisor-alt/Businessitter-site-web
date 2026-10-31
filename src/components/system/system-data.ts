/**
 * Données du « système » Businessister — générées de façon déterministe
 * (même graine → même structure côté serveur et navigateur).
 *
 * Deux états pour chaque nœud :
 *  - « chaos » : un nuage organique, enchevêtré (la complexité du quotidien) ;
 *  - « ordre » : un système orbital lisible — un cœur (l'entreprise),
 *    six modules (les automatisations) et leurs satellites, deux orbites.
 */

export type SystemConfig = {
  satellitesPerHub: number;
  outer: number;
  seed?: number;
};

export type SystemData = {
  count: number;
  chaos: Float32Array;
  order: Float32Array;
  size: Float32Array;
  seed: Float32Array;
  /** x : teinte à l'état « chaos », y : teinte à l'état « ordre » (0 ambre → 1 aqua). */
  tone: Float32Array;
  kind: Uint8Array;
  chaosEdges: Uint16Array;
  orderEdges: Uint16Array;
};

export const HUBS = 6;
const HUB_RADIUS = 2.45;
const TILT = (21 * Math.PI) / 180;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type Vec3 = [number, number, number];

function rotateX([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateZ([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c - y * s, x * s + y * c, z];
}

function ringPoint(radius: number, angle: number): Vec3 {
  return [radius * Math.cos(angle), 0, radius * Math.sin(angle)];
}

function fibonacciSphere(index: number, total: number, radius: number): Vec3 {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / Math.max(1, total - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * index;
  return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius];
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function createSystemData({ satellitesPerHub, outer, seed = 11 }: SystemConfig): SystemData {
  const rand = mulberry32(seed);
  const count = 1 + HUBS + HUBS * satellitesPerHub + outer;

  const chaos: Vec3[] = [];
  const order: Vec3[] = [];
  const size = new Float32Array(count);
  const seeds = new Float32Array(count);
  const tone = new Float32Array(count * 2);
  const kind = new Uint8Array(count);

  // — État « ordre » —
  // Cœur
  order.push([0, 0, 0]);
  kind[0] = 2;
  size[0] = 4.2;

  // Modules (hubs) sur une orbite inclinée
  const hubs: Vec3[] = [];
  for (let h = 0; h < HUBS; h++) {
    const angle = (h / HUBS) * Math.PI * 2 + Math.PI / 12;
    const p = rotateX(ringPoint(HUB_RADIUS, angle), TILT);
    hubs.push(p);
    order.push(p);
    const i = 1 + h;
    kind[i] = 1;
    size[i] = 2.7;
  }

  // Satellites : petites sphères autour de chaque module
  for (let h = 0; h < HUBS; h++) {
    const hub = hubs[h] as Vec3;
    for (let s = 0; s < satellitesPerHub; s++) {
      const local = fibonacciSphere(s, satellitesPerHub, 0.52);
      order.push([hub[0] + local[0], hub[1] + local[1], hub[2] + local[2]]);
      const i = order.length - 1;
      kind[i] = 0;
      size[i] = 1.05 + rand() * 0.45;
    }
  }

  // Deux orbites extérieures croisées (gyroscope)
  const ringA = Math.round(outer * 0.58);
  const ringB = outer - ringA;
  for (let k = 0; k < ringA; k++) {
    const angle = (k / ringA) * Math.PI * 2;
    order.push(rotateX(ringPoint(3.55, angle), TILT));
    const i = order.length - 1;
    size[i] = 0.75 + rand() * 0.4;
  }
  for (let k = 0; k < ringB; k++) {
    const angle = (k / ringB) * Math.PI * 2;
    order.push(
      rotateZ(rotateX(ringPoint(3.05, angle), (74 * Math.PI) / 180), (-28 * Math.PI) / 180),
    );
    const i = order.length - 1;
    size[i] = 0.75 + rand() * 0.4;
  }

  // — État « chaos » —
  const clusters: Vec3[] = Array.from({ length: 6 }, () => [
    (rand() * 2 - 1) * 3.4,
    (rand() * 2 - 1) * 1.7,
    (rand() * 2 - 1) * 1.6,
  ]);
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      chaos.push([0.4, -0.1, 0.3]);
      continue;
    }
    if (rand() < 0.68) {
      const c = clusters[Math.floor(rand() * clusters.length)] as Vec3;
      chaos.push([
        c[0] + gaussian(rand) * 0.75,
        c[1] + gaussian(rand) * 0.55,
        c[2] + gaussian(rand) * 0.6,
      ]);
    } else {
      chaos.push([(rand() * 2 - 1) * 4.3, (rand() * 2 - 1) * 2.3, (rand() * 2 - 1) * 2.1]);
    }
  }

  // Graines (décalage temporel de la métamorphose) et teintes
  for (let i = 0; i < count; i++) {
    seeds[i] = rand();
    tone[i * 2] = rand() * 0.42; // chaos : tons chauds
    const k = kind[i];
    tone[i * 2 + 1] = k === 2 ? 0.02 : k === 1 ? 0.45 + rand() * 0.1 : 0.62 + rand() * 0.38;
  }
  seeds[0] = 0;

  // — Liaisons « chaos » : plus proches voisins (réseau enchevêtré) —
  const chaosPairs = new Set<string>();
  const chaosEdges: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = chaos[i] as Vec3;
    const nearest: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const d = distance(a, chaos[j] as Vec3);
      if (d < 1.7) nearest.push({ j, d });
    }
    nearest.sort((x, y) => x.d - y.d);
    const links = 1 + (rand() < 0.55 ? 1 : 0) + (rand() < 0.2 ? 1 : 0);
    for (const { j } of nearest.slice(0, links)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (chaosPairs.has(key)) continue;
      chaosPairs.add(key);
      chaosEdges.push(i, j);
    }
  }

  // — Liaisons « ordre » : structure lisible —
  const orderEdges: number[] = [];
  for (let h = 0; h < HUBS; h++) {
    orderEdges.push(0, 1 + h); // cœur → module
    orderEdges.push(1 + h, 1 + ((h + 1) % HUBS)); // anneau des modules
  }
  const satStart = 1 + HUBS;
  for (let h = 0; h < HUBS; h++) {
    const base = satStart + h * satellitesPerHub;
    for (let s = 0; s < satellitesPerHub; s++) {
      const i = base + s;
      if (s % 2 === 0) orderEdges.push(1 + h, i); // module → satellite
      // maillage local : deux voisins les plus proches dans le module
      const a = order[i] as Vec3;
      const local: { j: number; d: number }[] = [];
      for (let t = 0; t < satellitesPerHub; t++) {
        const j = base + t;
        if (j <= i) continue;
        local.push({ j, d: distance(a, order[j] as Vec3) });
      }
      local.sort((x, y) => x.d - y.d);
      for (const { j } of local.slice(0, 2)) orderEdges.push(i, j);
    }
  }
  const outerStart = satStart + HUBS * satellitesPerHub;
  for (let k = 0; k < ringA; k++) {
    orderEdges.push(outerStart + k, outerStart + ((k + 1) % ringA));
  }
  for (let k = 0; k < ringB; k++) {
    orderEdges.push(outerStart + ringA + k, outerStart + ringA + ((k + 1) % ringB));
  }
  for (let h = 0; h < HUBS; h++) {
    // module → point le plus proche de l'orbite extérieure
    const hub = hubs[h] as Vec3;
    let best = outerStart;
    let bestD = Infinity;
    for (let k = 0; k < ringA; k++) {
      const d = distance(hub, order[outerStart + k] as Vec3);
      if (d < bestD) {
        bestD = d;
        best = outerStart + k;
      }
    }
    orderEdges.push(1 + h, best);
  }

  const flat = (list: Vec3[]) => {
    const out = new Float32Array(list.length * 3);
    list.forEach((p, i) => out.set(p, i * 3));
    return out;
  };

  return {
    count,
    chaos: flat(chaos),
    order: flat(order),
    size,
    seed: seeds,
    tone,
    kind,
    chaosEdges: Uint16Array.from(chaosEdges),
    orderEdges: Uint16Array.from(orderEdges),
  };
}

/** Configurations prédéfinies selon la puissance de l'appareil. */
export const SYSTEM_QUALITY = {
  high: { satellitesPerHub: 14, outer: 104 },
  low: { satellitesPerHub: 9, outer: 64 },
  poster: { satellitesPerHub: 6, outer: 40 },
} as const satisfies Record<string, SystemConfig>;
