"use client";

import { useSyncExternalStore } from "react";
import { consentStore, hasOptionalTrackers } from "./consent-store";
import { buttonClasses } from "@/components/ui/Button";
import { fr } from "@/lib/typography";

/** État actuel du consentement et accès aux préférences (page « Gestion des cookies »). */
export function ConsentStatus() {
  const choice = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    consentStore.getServerSnapshot,
  );

  if (!hasOptionalTrackers) return null;

  const label =
    choice === undefined
      ? fr("Chargement de vos préférences...")
      : choice === null
        ? fr("Aucun choix enregistré pour le moment.")
        : choice.analytics
          ? fr("Vous avez accepté la mesure d'audience.")
          : fr("Vous avez refusé la mesure d'audience.");

  return (
    <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="!mt-0 text-ivory" role="status">
        {label}
      </p>
      <button
        type="button"
        className={buttonClasses("secondary", "sm")}
        onClick={() => consentStore.openPreferences()}
      >
        {fr("Modifier mes préférences")}
      </button>
    </div>
  );
}
