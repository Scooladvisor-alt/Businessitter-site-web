import type { SystemTargets } from "./system-scene";
import type { FieldShape } from "./field-shapes";

/**
 * Mise en scène de l'arrière-plan, section par section.
 *
 * Chaque section porte un attribut `data-backdrop="<nom>"`. Deux couches :
 *  - le « système » (réseau de nœuds et de liaisons) : chaos à l'ouverture,
 *    il s'efface pendant le parcours puis réapparaît, organisé, sur Vision ;
 *  - une nuée de particules qui change de formation à chaque section
 *    (tourbillon, champ ondulant, hélice, éclosion, treillis…), avec son
 *    propre mouvement, ses couleurs et une intensité pilotée au défilement.
 */

export type BackdropState = Omit<SystemTargets, "spin">;

export type PresetInput = {
  /** Avancée du milieu de l'écran dans la section (0 → 1). */
  p: number;
  /** Passage complet : 0 quand la section entre par le bas, 1 quand elle sort par le haut. */
  pass: number;
  /** Défilement depuis le haut de la section, rapporté à sa hauteur (0 → 1). */
  exit: number;
  /** Avancée sur toute la page (0 → 1). */
  page: number;
  /** Rapport largeur / hauteur de la fenêtre. */
  aspect: number;
  mobile: boolean;
  /** Rang de la section parmi celles qui portent le même nom. */
  index: number;
};

type PresetResult = BackdropState & { shape: FieldShape };
type Preset = (input: PresetInput) => PresetResult;

export const BACKDROP_KEYS = [
  "morph",
  "connect",
  "flow",
  "opacity",
  "dolly",
  "offsetX",
  "offsetY",
  "scale",
  "fieldOpacity",
  "fieldEnergy",
  "fieldScale",
] as const satisfies readonly (keyof BackdropState)[];

/** Rotation totale liée au défilement, du haut au bas de la page (radians). */
export const SCROLL_SPIN = 1.4;

export function smooth(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Échelle des formations selon le format de l'écran. */
function fit(aspect: number) {
  if (aspect >= 1.25) return 1;
  if (aspect >= 0.85) return 0.86;
  return 0.62;
}

/** Cadrage centré du réseau, adapté au format de l'écran. */
function frame(aspect: number, scale: number, offsetY = 0) {
  if (aspect >= 1.25) return { offsetX: 0, offsetY, scale };
  if (aspect >= 0.85) return { offsetX: 0, offsetY, scale: scale * 0.86 };
  return { offsetX: 0, offsetY: offsetY - 0.12, scale: scale * 0.6 };
}

/** Réseau effacé (les paramètres restent cohérents pour les transitions). */
function quiet(aspect: number, dolly: number, opacity = 0) {
  return { morph: 0.6, connect: 1, flow: 0.6, opacity, dolly, ...frame(aspect, 1) };
}

type FormationOptions = {
  shape: FieldShape;
  opacity: number;
  energy: number | ((p: number) => number);
  dolly: [number, number];
  scale?: (p: number) => number;
};

/** Section de contenu : une formation de particules, le réseau effacé. */
function formation(options: FormationOptions): Preset {
  return ({ p, aspect, mobile }) => ({
    ...quiet(aspect, lerp(options.dolly[0], options.dolly[1], smooth(0, 1, p))),
    shape: options.shape,
    fieldOpacity: options.opacity * (mobile ? 0.85 : 1),
    fieldEnergy: typeof options.energy === "function" ? options.energy(p) : options.energy,
    fieldScale: fit(aspect) * (options.scale ? options.scale(p) : 1),
  });
}

/** Formations successives des sections de pages intérieures. */
const SECTION_SHAPES: FieldShape[] = ["wave", "helix", "bloom", "shells", "lattice", "streams"];

export const PRESETS: Record<string, Preset> = {
  /** Ouverture : le système en chaos, au premier plan, dans une nuée diffuse. */
  hero: ({ exit, aspect, mobile }) => {
    let layout = { offsetX: 0, offsetY: -0.1, scale: 1.05 };
    if (aspect < 0.85) layout = { offsetX: 0, offsetY: -0.25, scale: 0.6 };
    else if (aspect < 1.25) layout = { offsetX: 0, offsetY: -0.1, scale: 0.9 };
    return {
      opacity: (1 - 0.45 * smooth(0.55, 1, exit)) * (mobile ? 0.78 : 1),
      morph: 0.24 * smooth(0.18, 0.95, exit),
      connect: 0.22 + 0.78 * smooth(0.02, 0.6, exit),
      flow: smooth(0.1, 0.6, exit),
      dolly: 0.6 * smooth(0, 1, exit),
      ...layout,
      shape: "nebula",
      fieldOpacity: (0.36 + 0.2 * smooth(0.3, 1, exit)) * (mobile ? 0.85 : 1),
      fieldEnergy: 0.4,
      fieldScale: fit(aspect),
    };
  },

  /**
   * Le constat : un tourbillon qui s'emballe avec le flot des tâches, ralentit
   * pendant la question, puis se dénoue en rubans parallèles (flux simples).
   */
  constat: ({ p, aspect, mobile }) => {
    const pressure = smooth(0.15, 0.41, p);
    const question = smooth(0.42, 0.46, p) * (1 - smooth(0.56, 0.59, p));
    const resolved = p > 0.58;
    return {
      ...quiet(aspect, lerp(0.45, 0.2, smooth(0.3, 0.9, p)), 0.3 * (1 - smooth(0, 0.22, p))),
      morph: 0.15,
      connect: 0.8,
      flow: 0.4,
      shape: resolved ? "streams" : "vortex",
      fieldOpacity: (resolved ? 0.7 : 0.62 - 0.25 * question) * (mobile ? 0.85 : 1),
      fieldEnergy: resolved ? 0.7 : 0.4 + 1.1 * pressure - 1.2 * question,
      fieldScale: fit(aspect),
    };
  },

  /** Le champ des possibles : littéralement, un champ qui ondule. */
  possibles: formation({
    shape: "wave",
    opacity: 0.72,
    energy: (p) => 0.45 + 0.5 * p,
    dolly: [0.1, 0.3],
  }),

  /** L'approche : une double hélice, étape par étape. */
  approche: formation({
    shape: "helix",
    opacity: 0.7,
    energy: (p) => 0.5 + 0.4 * p,
    dolly: [0.05, 0.25],
  }),

  /** La transformation : une éclosion qui s'ouvre au fil du défilement. */
  transformation: formation({
    shape: "bloom",
    opacity: 0.66,
    energy: 0.5,
    dolly: [0.1, 0.3],
    scale: (p) => 0.62 + 0.5 * smooth(0.05, 0.75, p),
  }),

  /** La réalisation : un treillis net, un objet construit. */
  realisation: formation({ shape: "lattice", opacity: 0.62, energy: 0.5, dolly: [0.05, 0.15] }),

  /** À propos : des rubans calmes, une présence humaine. */
  apropos: formation({ shape: "streams", opacity: 0.55, energy: 0.45, dolly: [0.05, 0.2] }),

  /** La confiance : des couches concentriques autour d'un cœur. */
  confiance: formation({
    shape: "shells",
    opacity: 0.66,
    energy: (p) => 0.4 + 0.4 * p,
    dolly: [0.1, 0.25],
  }),

  /** Vision : le système réapparaît et s'assemble entièrement, cerné d'un halo. */
  vision: ({ pass, aspect, mobile }) => {
    const presence = smooth(0.05, 0.3, pass) * (1 - smooth(0.8, 1, pass));
    const scale = aspect >= 1.25 ? 0.95 : Math.min(1, Math.max(0.5, aspect * 0.92));
    return {
      morph: 0.3 + 0.7 * smooth(0.04, 0.55, pass),
      connect: 1,
      flow: 0.95,
      opacity: (0.4 + 0.45 * presence) * (mobile ? 0.82 : 1),
      dolly: 0.1 + 0.25 * smooth(0.1, 0.8, pass),
      offsetX: 0,
      offsetY: 0,
      scale,
      shape: "halo",
      fieldOpacity: (0.3 + 0.2 * presence) * (mobile ? 0.85 : 1),
      fieldEnergy: 0.5,
      fieldScale: fit(aspect),
    };
  },

  /** L'audit : un anneau, une porte d'entrée. */
  audit: ({ p, aspect, mobile }) => ({
    ...quiet(aspect, lerp(0.05, 0.2, smooth(0, 1, p)), 0.12),
    morph: 1,
    shape: "portal",
    fieldOpacity: 0.62 * (mobile ? 0.85 : 1),
    fieldEnergy: 0.5,
    fieldScale: fit(aspect),
  }),

  /** Pied de page : un horizon calme. */
  footer: ({ p, aspect, mobile }) => ({
    ...quiet(aspect, lerp(0.1, -0.2, smooth(0, 1, p))),
    morph: 1,
    shape: "horizon",
    fieldOpacity: 0.6 * (mobile ? 0.85 : 1),
    fieldEnergy: 0.4,
    fieldScale: fit(aspect),
  }),

  /** En-tête des pages intérieures : le système, dans une nuée. */
  "page-hero": ({ exit, aspect, mobile }) => ({
    morph: 0.3 + 0.35 * smooth(0, 1, exit),
    connect: 0.6 + 0.4 * smooth(0, 0.6, exit),
    flow: 0.5 + 0.4 * smooth(0, 0.6, exit),
    opacity: (0.78 - 0.28 * smooth(0.3, 1, exit)) * (mobile ? 0.8 : 1),
    dolly: 0.15 + 0.35 * smooth(0, 1, exit),
    ...frame(aspect, 0.95, -0.05),
    shape: "nebula",
    fieldOpacity: 0.42 * (mobile ? 0.85 : 1),
    fieldEnergy: 0.4,
    fieldScale: fit(aspect),
  }),

  /** Section de page intérieure : une formation différente à chaque section. */
  section: ({ p, aspect, mobile, index }) => ({
    ...quiet(aspect, lerp(0.05, 0.25, smooth(0, 1, p))),
    shape: SECTION_SHAPES[index % SECTION_SHAPES.length] as FieldShape,
    fieldOpacity: 0.6 * (mobile ? 0.85 : 1),
    fieldEnergy: 0.55,
    fieldScale: fit(aspect),
  }),

  /** Textes légaux : présence très discrète, lecture confortable. */
  legal: ({ p, aspect }) => ({
    ...quiet(aspect, lerp(0, 0.15, p)),
    shape: "horizon",
    fieldOpacity: 0.32,
    fieldEnergy: 0.3,
    fieldScale: fit(aspect),
  }),

  /** Zones sans section déclarée. */
  default: ({ aspect }) => ({
    ...quiet(aspect, 0.15),
    shape: "wave",
    fieldOpacity: 0.5,
    fieldEnergy: 0.5,
    fieldScale: fit(aspect),
  }),
};

export type BackdropAnchor = { name: string; top: number; height: number };

export type BackdropFrame = { state: BackdropState; shape: FieldShape };

/**
 * État de la scène pour une position de défilement : moyenne pondérée des
 * sections proches du milieu de l'écran (fondu sur ±30 % de sa hauteur) ;
 * la formation est celle de la section dominante.
 */
export function backdropState(
  anchors: readonly BackdropAnchor[],
  scrollY: number,
  viewport: { width: number; height: number; docHeight: number },
): BackdropFrame {
  const vh = viewport.height;
  const focus = scrollY + vh * 0.5;
  const fade = vh * 0.3;
  const aspect = viewport.width / Math.max(1, vh);
  const mobile = viewport.width < 768;
  const page = Math.min(1, Math.max(0, scrollY / Math.max(1, viewport.docHeight - vh)));
  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  const sum = Object.fromEntries(BACKDROP_KEYS.map((key) => [key, 0])) as BackdropState;
  let total = 0;
  const dominant = { shape: "nebula" as FieldShape, weight: 0 };
  const add = (result: PresetResult, weight: number) => {
    for (const key of BACKDROP_KEYS) sum[key] += result[key] * weight;
    total += weight;
    if (weight > dominant.weight) {
      dominant.weight = weight;
      dominant.shape = result.shape;
    }
  };

  const seen = new Map<string, number>();
  for (const anchor of anchors) {
    const index = seen.get(anchor.name) ?? 0;
    seen.set(anchor.name, index + 1);
    const bottom = anchor.top + anchor.height;
    const weight =
      smooth(anchor.top - fade, anchor.top + fade, focus) *
      (1 - smooth(bottom - fade, bottom + fade, focus));
    if (weight < 0.0001) continue;
    const preset = PRESETS[anchor.name] ?? PRESETS.section;
    if (!preset) continue;
    add(
      preset({
        p: clamp((focus - anchor.top) / Math.max(1, anchor.height)),
        pass: clamp((scrollY + vh - anchor.top) / Math.max(1, anchor.height + vh)),
        exit: clamp((scrollY - anchor.top) / Math.max(1, anchor.height)),
        page,
        aspect,
        mobile,
        index,
      }),
      weight,
    );
  }

  const fallback = PRESETS.default;
  if (total < 1 && fallback) {
    const input = { p: 0, pass: 0, exit: 0, page, aspect, mobile, index: 0 };
    add(fallback(input), 1 - total);
  }
  for (const key of BACKDROP_KEYS) sum[key] /= Math.max(1, total);
  return { state: sum, shape: dominant.shape };
}
