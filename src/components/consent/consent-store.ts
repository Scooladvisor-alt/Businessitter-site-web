/**
 * Consentement aux traceurs non essentiels (mesure d'audience).
 * Stocké localement (localStorage), redemandé au bout de 6 mois.
 * Aucun traceur non essentiel n'est chargé tant que le choix n'est pas
 * explicitement « accepté ».
 */

export type ConsentChoice = {
  analytics: boolean;
  /** Date ISO du choix. */
  date: string;
  version: 1;
};

const STORAGE_KEY = "businessister:consent";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;

type Listener = () => void;
const listeners = new Set<Listener>();
const openListeners = new Set<Listener>();

let cache: ConsentChoice | null | undefined;

function load(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (
      parsed.version !== 1 ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.date !== "string"
    ) {
      return null;
    }
    if (Date.now() - new Date(parsed.date).getTime() > MAX_AGE_MS) return null;
    return parsed as ConsentChoice;
  } catch {
    return null;
  }
}

export const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null;
export const hasOptionalTrackers = analyticsId !== null;

export const consentStore = {
  /** `null` : aucun choix enregistré. */
  get(): ConsentChoice | null {
    if (cache === undefined) cache = load();
    return cache;
  },
  getServerSnapshot(): undefined {
    return undefined;
  },
  set(analytics: boolean) {
    cache = { analytics, date: new Date().toISOString(), version: 1 };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      /* stockage indisponible : choix conservé pour la session */
    }
    if (!analytics) clearAnalyticsCookies();
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** Demande l'ouverture du panneau de préférences. */
  openPreferences() {
    openListeners.forEach((listener) => listener());
  },
  onOpenPreferences(listener: Listener) {
    openListeners.add(listener);
    return () => {
      openListeners.delete(listener);
    };
  },
};

function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  if (analyticsId) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${analyticsId}`] = true;
  }
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim() ?? "")
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid")
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      });
    });
}
