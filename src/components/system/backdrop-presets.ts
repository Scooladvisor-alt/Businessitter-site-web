import type { SystemTargets } from "./system-scene";

/**
 * Mise en scène de l'arrière-plan « système », section par section.
 *
 * Chaque section porte un attribut `data-backdrop="<nom>"`. Au défilement,
 * l'état de la scène est interpolé entre les sections voisines : le système
 * part du chaos (ouverture), s'organise un peu plus à chaque séquence (chaque
 * section le voit se resserrer à son entrée puis s'assembler), atteint sa
 * forme complète sur « Vision », puis recule doucement en fin de page.
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
};

type Preset = (input: PresetInput) => BackdropState;

export const BACKDROP_KEYS = [
  "morph",
  "connect",
  "flow",
  "opacity",
  "dolly",
  "offsetX",
  "offsetY",
  "scale",
] as const satisfies readonly (keyof BackdropState)[];

/** Rotation totale liée au défilement, du haut au bas de la page (radians). */
export const SCROLL_SPIN = 1.4;

export function smooth(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cadrage centré, adapté au format de l'écran. */
function frame(aspect: number, scale: number, offsetY = 0) {
  if (aspect >= 1.25) return { offsetX: 0, offsetY, scale };
  if (aspect >= 0.85) return { offsetX: 0, offsetY, scale: scale * 0.86 };
  return { offsetX: 0, offsetY: offsetY - 0.12, scale: scale * 0.6 };
}

type AmbientOptions = {
  /** Degré d'organisation atteint dans la section. */
  morph: number;
  /** Relâchement à l'entrée de la section (le système se resserre ensuite). */
  loose: number;
  opacity: number;
  dolly: [number, number];
  scale: number;
  flow: number;
};

/** Séquence de contenu : le système s'assemble pendant la lecture. */
function ambient(options: AmbientOptions): Preset {
  return ({ p, aspect, mobile }) => ({
    morph: options.morph - options.loose * (1 - smooth(0.05, 0.65, p)),
    connect: 1,
    flow: options.flow,
    opacity: options.opacity * (mobile ? 0.85 : 1),
    dolly: lerp(options.dolly[0], options.dolly[1], smooth(0, 1, p)),
    ...frame(aspect, options.scale),
  });
}

export const PRESETS: Record<string, Preset> = {
  /** Ouverture : le chaos, au premier plan. */
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
    };
  },

  /** Le constat : encore enchevêtré ; il s'organise quand les tâches se rangent. */
  constat: ({ p, aspect, mobile }) => {
    const question = smooth(0.3, 0.38, p) * (1 - smooth(0.46, 0.54, p));
    return {
      morph: 0.12 + 0.42 * smooth(0.52, 0.85, p),
      connect: 0.8,
      flow: 0.35 + 0.5 * smooth(0.52, 0.85, p),
      opacity: (0.5 - 0.18 * question) * (mobile ? 0.85 : 1),
      dolly: lerp(0.45, 0.2, smooth(0.3, 0.9, p)),
      ...frame(aspect, 1.15),
    };
  },

  possibles: ambient({
    morph: 0.62,
    loose: 0.28,
    opacity: 0.48,
    dolly: [0.12, 0.32],
    scale: 1.25,
    flow: 0.7,
  }),

  approche: ambient({
    morph: 0.74,
    loose: 0.26,
    opacity: 0.5,
    dolly: [0.05, 0.28],
    scale: 1.1,
    flow: 0.78,
  }),

  transformation: ambient({
    morph: 0.84,
    loose: 0.24,
    opacity: 0.44,
    dolly: [0.15, 0.38],
    scale: 1.2,
    flow: 0.82,
  }),

  realisation: ambient({
    morph: 0.88,
    loose: 0,
    opacity: 0.52,
    dolly: [0.05, 0.12],
    scale: 0.95,
    flow: 0.86,
  }),

  confiance: ambient({
    morph: 0.92,
    loose: 0.18,
    opacity: 0.46,
    dolly: [0.12, 0.3],
    scale: 1.05,
    flow: 0.9,
  }),

  /** Vision : le système s'assemble entièrement, au premier plan. */
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
    };
  },

  audit: ambient({
    morph: 1,
    loose: 0.12,
    opacity: 0.4,
    dolly: [0.05, 0.22],
    scale: 1.05,
    flow: 0.72,
  }),

  /** Pied de page : le système, organisé, recule. */
  footer: ({ p, aspect, mobile }) => ({
    morph: 1,
    connect: 1,
    flow: 0.55,
    opacity: 0.36 * (mobile ? 0.85 : 1),
    dolly: lerp(0.1, -0.3, smooth(0, 1, p)),
    ...frame(aspect, 0.9),
  }),

  /** En-tête des pages intérieures. */
  "page-hero": ({ exit, aspect, mobile }) => ({
    morph: 0.3 + 0.35 * smooth(0, 1, exit),
    connect: 0.6 + 0.4 * smooth(0, 0.6, exit),
    flow: 0.5 + 0.4 * smooth(0, 0.6, exit),
    opacity: (0.78 - 0.28 * smooth(0.3, 1, exit)) * (mobile ? 0.8 : 1),
    dolly: 0.15 + 0.35 * smooth(0, 1, exit),
    ...frame(aspect, 0.95, -0.05),
  }),

  /** Section de page intérieure : s'assemble au fil de la page. */
  section: ({ p, page, aspect, mobile }) => ({
    morph: Math.min(1, 0.6 + 0.4 * page) - 0.22 * (1 - smooth(0.05, 0.65, p)),
    connect: 1,
    flow: 0.8,
    opacity: 0.46 * (mobile ? 0.85 : 1),
    dolly: lerp(0.05, 0.3, smooth(0, 1, p)),
    ...frame(aspect, 1.15),
  }),

  /** Textes légaux : présence très discrète, lecture confortable. */
  legal: ({ p, aspect }) => ({
    morph: 1,
    connect: 1,
    flow: 0.5,
    opacity: 0.22,
    dolly: lerp(0, 0.2, p),
    ...frame(aspect, 1.2),
  }),

  /** Zones sans section déclarée. */
  default: ({ page, aspect, mobile }) => ({
    morph: 0.6 + 0.4 * page,
    connect: 1,
    flow: 0.8,
    opacity: 0.42 * (mobile ? 0.85 : 1),
    dolly: 0.1 + 0.2 * page,
    ...frame(aspect, 1.15),
  }),
};

export type BackdropAnchor = { name: string; top: number; height: number };

/**
 * État de la scène pour une position de défilement : moyenne pondérée des
 * sections proches du milieu de l'écran (fondu sur ±30 % de sa hauteur).
 */
export function backdropState(
  anchors: readonly BackdropAnchor[],
  scrollY: number,
  viewport: { width: number; height: number; docHeight: number },
): BackdropState {
  const vh = viewport.height;
  const focus = scrollY + vh * 0.5;
  const fade = vh * 0.3;
  const aspect = viewport.width / Math.max(1, vh);
  const mobile = viewport.width < 768;
  const page = Math.min(1, Math.max(0, scrollY / Math.max(1, viewport.docHeight - vh)));
  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  const sum = Object.fromEntries(BACKDROP_KEYS.map((key) => [key, 0])) as BackdropState;
  let total = 0;
  const add = (state: BackdropState, weight: number) => {
    for (const key of BACKDROP_KEYS) sum[key] += state[key] * weight;
    total += weight;
  };

  for (const anchor of anchors) {
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
      }),
      weight,
    );
  }

  if (total < 1 && PRESETS.default) {
    add(PRESETS.default({ p: 0, pass: 0, exit: 0, page, aspect, mobile }), 1 - total);
  }
  for (const key of BACKDROP_KEYS) sum[key] /= Math.max(1, total);
  return sum;
}
