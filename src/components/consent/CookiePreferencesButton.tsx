"use client";

import { consentStore, hasOptionalTrackers } from "./consent-store";

/** Bouton « Préférences cookies » (affiché seulement si des traceurs optionnels existent). */
export function CookiePreferencesButton({ className }: { className?: string }) {
  if (!hasOptionalTrackers) return null;
  return (
    <button type="button" className={className} onClick={() => consentStore.openPreferences()}>
      Préférences cookies
    </button>
  );
}
