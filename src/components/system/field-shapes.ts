/**
 * Formations de la « poussière » d'arrière-plan : la même nuée de particules
 * prend une forme différente à chaque section (tourbillon, champ ondulant,
 * hélice, éclosion, treillis…). Les positions sont calculées une fois,
 * de façon déterministe ; chaque particule garde les mêmes tirages d'une
 * forme à l'autre, ce qui rend les métamorphoses cohérentes (des flux, pas
 * une explosion aléatoire).
 */

export const FIELD_SHAPES = [
  "nebula",
  "vortex",
  "streams",
  "wave",
  "helix",
  "bloom",
  "lattice",
  "shells",
  "halo",
  "portal",
  "horizon",
] as const;

export type FieldShape = (typeof FIELD_SHAPES)[number];

export type FieldStyle = {
  /** Couleurs de part et d'autre du dégradé. */
  colorA: string;
  colorB: string;
  /** Taille relative des particules. */
  size: number;
  /** Inclinaison de la formation (rotation autour de x, radians). */
  tilt: number;
  offsetY: number;
  scale: number;
  /** Vitesse de rotation différentielle (tourbillon). */
  swirl: number;
  /** Amplitude et vitesse de l'ondulation. */
  wave: number;
  waveSpeed: number;
};

export const FIELD_STYLES: Record<FieldShape, FieldStyle> = {
  nebula: {
    colorA: "#ffc88f",
    colorB: "#bab5f2",
    size: 1,
    tilt: 0.1,
    offsetY: 0,
    scale: 1,
    swirl: 0.05,
    wave: 0,
    waveSpeed: 0,
  },
  vortex: {
    colorA: "#ff8f68",
    colorB: "#ffc88f",
    size: 1,
    tilt: 1.05,
    offsetY: -0.3,
    scale: 1.05,
    swirl: 0.6,
    wave: 0,
    waveSpeed: 0,
  },
  streams: {
    colorA: "#bab5f2",
    colorB: "#86e6da",
    size: 0.95,
    tilt: 0.12,
    offsetY: 0,
    scale: 1,
    swirl: 0,
    wave: 0.2,
    waveSpeed: 1.1,
  },
  wave: {
    colorA: "#bab5f2",
    colorB: "#86e6da",
    size: 0.9,
    tilt: 0.55,
    offsetY: -1.3,
    scale: 1,
    swirl: 0,
    wave: 0.42,
    waveSpeed: 0.9,
  },
  helix: {
    colorA: "#ffc88f",
    colorB: "#86e6da",
    size: 1,
    tilt: 0.06,
    offsetY: 0,
    scale: 1,
    swirl: 0.22,
    wave: 0,
    waveSpeed: 0,
  },
  bloom: {
    colorA: "#f3a9b2",
    colorB: "#ffc88f",
    size: 0.95,
    tilt: 0.2,
    offsetY: 0,
    scale: 1,
    swirl: 0.08,
    wave: 0,
    waveSpeed: 0,
  },
  lattice: {
    colorA: "#f4efe6",
    colorB: "#bab5f2",
    size: 0.85,
    tilt: 0.55,
    offsetY: 0,
    scale: 1,
    swirl: 0,
    wave: 0,
    waveSpeed: 0,
  },
  shells: {
    colorA: "#86e6da",
    colorB: "#bab5f2",
    size: 0.9,
    tilt: 0.3,
    offsetY: 0,
    scale: 1,
    swirl: 0.35,
    wave: 0,
    waveSpeed: 0,
  },
  halo: {
    colorA: "#bab5f2",
    colorB: "#86e6da",
    size: 0.8,
    tilt: 0,
    offsetY: 0,
    scale: 1,
    swirl: 0.12,
    wave: 0,
    waveSpeed: 0,
  },
  portal: {
    colorA: "#ffc88f",
    colorB: "#86e6da",
    size: 0.95,
    tilt: 1.25,
    offsetY: 0,
    scale: 1,
    swirl: 0.3,
    wave: 0,
    waveSpeed: 0,
  },
  horizon: {
    colorA: "#f3a9b2",
    colorB: "#bab5f2",
    size: 0.85,
    tilt: 0.07,
    offsetY: -2.3,
    scale: 1,
    swirl: 0.05,
    wave: 0.06,
    waveSpeed: 0.6,
  },
};

/** Nombre de particules selon la puissance de l'appareil. */
export const FIELD_COUNT = { high: 5200, low: 2200 } as const;

const TAU = Math.PI * 2;
const RANDOMS = 6;

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

/** Tirages propres à chaque particule, partagés par toutes les formations. */
function particleRandoms(count: number): Float32Array {
  const rand = mulberry32(2024);
  const out = new Float32Array(count * RANDOMS);
  for (let i = 0; i < out.length; i++) out[i] = rand();
  return out;
}

/** Variable gaussienne (Box-Muller) à partir de deux tirages. */
function gauss(a: number, b: number): number {
  return Math.sqrt(-2 * Math.log(Math.max(1e-6, a))) * Math.cos(TAU * b);
}

function fibonacciDirection(index: number, total: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / Math.max(1, total - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * index;
  return [Math.cos(theta) * r, y, Math.sin(theta) * r];
}

type Writer = (
  i: number,
  u: number,
  r: (k: number) => number,
  count: number,
) => [number, number, number];

const WRITERS: Record<FieldShape, Writer> = {
  /** Nuée organique : amas diffus et poussière libre. */
  nebula: (_i, u, r) => {
    if (r(0) < 0.25) {
      return [(r(1) * 2 - 1) * 7, (r(2) * 2 - 1) * 3.6, (r(3) * 2 - 1) * 2.8 - 1];
    }
    const c = Math.floor(u * 7);
    const cx = -5 + c * (10 / 6);
    const cy = Math.sin(c * 1.7) * 1.2;
    const cz = Math.cos(c * 2.3) * 1.1 - 0.6;
    return [
      cx + gauss(r(1), r(2)) * 0.95,
      cy + gauss(r(3), r(4)) * 0.75,
      cz + gauss(r(5), r(1)) * 0.85,
    ];
  },

  /** Tourbillon à trois bras, vu en plongée. */
  vortex: (_i, _u, r) => {
    if (r(0) < 0.08) {
      return [gauss(r(1), r(2)) * 0.32, gauss(r(3), r(4)) * 0.18, gauss(r(5), r(1)) * 0.32];
    }
    const radius = 0.35 + 4.4 * Math.sqrt(r(1));
    const arm = Math.floor(r(2) * 3);
    const spread = (r(3) - 0.5) * 0.6 * (0.45 + radius * 0.12);
    const theta = arm * (TAU / 3) + radius * 0.95 + spread;
    const y = gauss(r(4), r(5)) * 0.09 * (1.25 - radius / 6);
    return [Math.cos(theta) * radius, y, Math.sin(theta) * radius];
  },

  /** Rubans parallèles : des flux devenus simples. */
  streams: (_i, u, r) => {
    const k = Math.floor(r(0) * 7);
    const x = -7.5 + 15 * u;
    const y = -2.1 + k * 0.7 + 0.32 * Math.sin(x * 0.55 + k * 1.1) + gauss(r(1), r(2)) * 0.035;
    const z = (k % 2 ? -0.7 : 0.4) + gauss(r(3), r(4)) * 0.08;
    return [x, y, z];
  },

  /** Champ ondulant : une grille de points en perspective. */
  wave: (i, _u, r, count) => {
    const columns = Math.round(Math.sqrt(count * 1.8));
    const rows = Math.ceil(count / columns);
    const gx = i % columns;
    const gz = Math.floor(i / columns);
    return [
      (gx / (columns - 1) - 0.5) * 15 + (r(0) - 0.5) * 0.02,
      0,
      (gz / Math.max(1, rows - 1) - 0.5) * 9 - 1,
    ];
  },

  /** Double hélice : une progression, étape par étape. */
  helix: (i, u, r) => {
    const R = 1.45;
    const span = 7.2;
    const turns = Math.PI * 4.4;
    if (r(0) < 0.78) {
      const strand = i % 2;
      const theta = u * turns + strand * Math.PI;
      return [
        Math.cos(theta) * R + gauss(r(1), r(2)) * 0.05,
        (u - 0.5) * span + gauss(r(3), r(4)) * 0.03,
        Math.sin(theta) * R + gauss(r(5), r(1)) * 0.05,
      ];
    }
    if (r(0) < 0.92) {
      const t = Math.round(u * 16) / 16;
      const theta = t * turns;
      const w = 1 - 2 * r(1);
      return [Math.cos(theta) * R * w, (t - 0.5) * span, Math.sin(theta) * R * w];
    }
    const radius = 2.2 + r(1);
    const theta = r(2) * TAU;
    return [Math.cos(theta) * radius, (r(3) - 0.5) * span, Math.sin(theta) * radius];
  },

  /** Éclosion : des rayons qui s'ouvrent depuis un cœur. */
  bloom: (_i, _u, r) => {
    const rays = 96;
    const ray = Math.floor(r(0) * rays);
    const [dx, dy, dz] = fibonacciDirection(ray, rays);
    const distance = 0.25 + 3 * Math.pow(r(1), 0.55);
    const jitter = 0.04 + distance * 0.012;
    return [
      dx * distance + gauss(r(2), r(3)) * jitter,
      dy * distance + gauss(r(4), r(5)) * jitter,
      dz * distance + gauss(r(3), r(1)) * jitter,
    ];
  },

  /** Treillis : un objet construit, précis. */
  lattice: (_i, _u, r) => {
    const s = 1.9;
    const n = 15;
    const snap = (value: number) => (Math.floor(value * n) / (n - 1)) * 2 - 1;
    if (r(0) < 0.24) {
      // Arêtes du cube.
      const edge = Math.floor(r(1) * 12);
      const t = (r(2) * 2 - 1) * s;
      const a = edge & 1 ? s : -s;
      const b = edge & 2 ? s : -s;
      const axis = Math.floor(edge / 4);
      if (axis === 0) return [t, a, b];
      if (axis === 1) return [a, t, b];
      return [a, b, t];
    }
    const face = Math.floor(r(1) * 6);
    const a = snap(r(2)) * s;
    const b = snap(r(3)) * s;
    const sign = face % 2 ? -s : s;
    if (face < 2) return [sign, a, b];
    if (face < 4) return [a, sign, b];
    return [a, b, sign];
  },

  /** Sphères concentriques autour d'un cœur : des couches de protection. */
  shells: (i, _u, r, count) => {
    if (r(0) < 0.05) {
      return [gauss(r(1), r(2)) * 0.16, gauss(r(3), r(4)) * 0.16, gauss(r(5), r(1)) * 0.16];
    }
    const shell = r(0) < 0.22 ? 0 : r(0) < 0.52 ? 1 : 2;
    const radius = [0.85, 1.75, 2.75][shell] as number;
    const [dx, dy, dz] = fibonacciDirection(i, count);
    const k = radius * (1 + gauss(r(2), r(3)) * 0.012);
    return [dx * k, dy * k, dz * k];
  },

  /** Halo : un anneau large et discret autour du système organisé. */
  halo: (_i, u, r) => {
    const radius = 4.4 + 1.8 * r(0);
    const theta = u * TAU * 3 + r(1) * 0.3;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const y = gauss(r(2), r(3)) * 0.06;
    const tilt = 0.37;
    return [x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)];
  },

  /** Portail : un anneau lumineux, une porte d'entrée. */
  portal: (_i, u, r) => {
    if (r(0) < 0.15) {
      const radius = 2.4 * Math.sqrt(r(1));
      const theta = r(2) * TAU;
      return [Math.cos(theta) * radius, gauss(r(3), r(4)) * 0.05, Math.sin(theta) * radius];
    }
    const R = 2.7;
    const tube = 0.13 * Math.sqrt(r(1));
    const theta = u * TAU * 5;
    const phi = r(2) * TAU;
    const ring = R + tube * Math.cos(phi);
    return [Math.cos(theta) * ring, tube * Math.sin(phi), Math.sin(theta) * ring];
  },

  /** Horizon : un disque lointain, vu presque de profil. */
  horizon: (_i, u, r) => {
    const radius = 9 * Math.sqrt(r(0));
    const theta = u * TAU * 7 + r(1) * 0.4;
    return [
      Math.cos(theta) * radius,
      gauss(r(2), r(3)) * 0.02,
      Math.sin(theta) * radius * 0.55 - 3,
    ];
  },
};

export type FieldData = {
  count: number;
  /** xyz : direction d'écart pendant la métamorphose ; w : retard (0 → 1). */
  rand: Float32Array;
  /** x : taille ; y : position dans le dégradé de couleurs. */
  info: Float32Array;
  shape: (name: FieldShape) => Float32Array;
};

export function createFieldData(count: number): FieldData {
  const randoms = particleRandoms(count);
  const rand = new Float32Array(count * 4);
  const info = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const base = i * RANDOMS;
    const g = (k: number) => randoms[base + k] as number;
    const [dx, dy, dz] = fibonacciDirection(Math.floor(g(0) * 997), 997);
    const amount = 0.35 + 0.65 * g(1);
    rand[i * 4] = dx * amount;
    rand[i * 4 + 1] = dy * amount;
    rand[i * 4 + 2] = dz * amount;
    rand[i * 4 + 3] = g(2);
    info[i * 2] = g(3) < 0.03 ? 2.2 + g(4) * 0.8 : 0.5 + g(4) * 1.1;
    info[i * 2 + 1] = Math.min(1, (i / count) * 0.75 + g(5) * 0.25);
  }

  const cache = new Map<FieldShape, Float32Array>();
  const shape = (name: FieldShape) => {
    const cached = cache.get(name);
    if (cached) return cached;
    const out = new Float32Array(count * 3);
    const write = WRITERS[name];
    for (let i = 0; i < count; i++) {
      const base = i * RANDOMS;
      // Décalage des tirages par forme : variété sans perdre la cohérence.
      const r = (k: number) => randoms[base + ((k + name.length) % RANDOMS)] as number;
      const [x, y, z] = write(i, i / count, r, count);
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z;
    }
    cache.set(name, out);
    return out;
  };

  return { count, rand, info, shape };
}

/** Rotation différentielle + ondulation : identiques au shader (voir system-scene). */
export function fieldMotion(
  x: number,
  y: number,
  z: number,
  swirlPhase: number,
  waveAmp: number,
  wavePhase: number,
): [number, number, number] {
  const radius = Math.hypot(x, z);
  const a = swirlPhase / (0.7 + radius);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const nx = c * x - s * z;
  const nz = s * x + c * z;
  const ny = y + waveAmp * Math.sin(nx * 0.85 + wavePhase) * Math.cos(nz * 0.7 + wavePhase * 0.6);
  return [nx, ny, nz];
}
