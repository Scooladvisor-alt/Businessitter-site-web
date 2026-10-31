const NBSP = " "; // espace insécable
const NNBSP = " "; // espace fine insécable

/**
 * Applique les règles de la typographie française à un texte :
 * apostrophe typographique, espaces insécables avant « ; ! ? : »,
 * espaces fines à l'intérieur des guillemets et points de suspension.
 */
export function fr(input: string): string {
  return input
    .replace(/'/g, "’")
    .replace(/\.\.\./g, "…")
    .replace(/[   ]+([;!?])/g, `${NNBSP}$1`)
    .replace(/[   ]+:/g, `${NBSP}:`)
    .replace(/«[   ]*/g, `«${NNBSP}`)
    .replace(/[   ]*»/g, `${NNBSP}»`);
}

type DeepReadonly<T> = T extends (infer R)[]
  ? readonly DeepReadonly<R>[]
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/**
 * Applique `fr()` à toutes les chaînes d'un objet de contenu.
 * Les clés « href », « url », « id », « icon » et « key » sont préservées.
 */
const PRESERVED_KEYS = new Set(["href", "url", "id", "icon", "key", "anchor"]);

export function frDeep<T>(value: T, key?: string): DeepReadonly<T> {
  if (typeof value === "string") {
    return (key && PRESERVED_KEYS.has(key) ? value : fr(value)) as DeepReadonly<T>;
  }
  if (Array.isArray(value)) {
    return value.map((item) => frDeep(item, key)) as DeepReadonly<T>;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = frDeep(v, k);
    }
    return out as DeepReadonly<T>;
  }
  return value as DeepReadonly<T>;
}
