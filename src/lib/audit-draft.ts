/**
 * Brouillon de besoin saisi dans la zone « Et vous, qu'aimeriez-vous
 * automatiser ? ». Il pré-remplit le message du formulaire de demande
 * d'audit (aucune analyse automatique n'est effectuée).
 * Persistance : sessionStorage (durée de l'onglet uniquement).
 */

const STORAGE_KEY = "businessister:audit-draft";

type Listener = (value: string) => void;

let current: string | null = null;
const listeners = new Set<Listener>();

function read(): string {
  if (current !== null) return current;
  try {
    current = window.sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    current = "";
  }
  return current;
}

export const auditDraft = {
  get(): string {
    if (typeof window === "undefined") return "";
    return read();
  },
  set(value: string) {
    current = value;
    try {
      if (value) window.sessionStorage.setItem(STORAGE_KEY, value);
      else window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible : le brouillon reste en mémoire */
    }
    listeners.forEach((listener) => listener(value));
  },
  clear() {
    auditDraft.set("");
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
