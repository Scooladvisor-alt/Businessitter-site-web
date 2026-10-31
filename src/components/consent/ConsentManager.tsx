"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { AnimatePresence, m } from "motion/react";
import { analyticsId, consentStore } from "./consent-store";
import { buttonClasses } from "@/components/ui/Button";
import { fr } from "@/lib/typography";

const copy = {
  title: fr("Votre vie privée, votre choix"),
  text: fr(
    "Avec votre accord, nous utilisons un outil de mesure d'audience pour comprendre l'utilisation du site et l'améliorer. Vous pouvez modifier votre choix à tout moment.",
  ),
  refuse: fr("Tout refuser"),
  accept: fr("Tout accepter"),
  customize: fr("Personnaliser"),
  save: fr("Enregistrer mes choix"),
  analytics: fr("Mesure d'audience"),
  analyticsText: fr(
    "Statistiques de fréquentation (Google Analytics), déposées uniquement avec votre accord.",
  ),
  essential: fr("Fonctionnement du site"),
  essentialText: fr("Mémorisation de vos préférences. Toujours actif, sans traceur publicitaire."),
  more: fr("En savoir plus"),
};

function Analytics({ id }: { id: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window['ga-disable-${id}']=false;gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

/**
 * Bandeau et panneau de consentement. Ne s'affiche que si un traceur
 * non essentiel est configuré (NEXT_PUBLIC_GA_MEASUREMENT_ID).
 */
export function ConsentManager() {
  const choice = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    consentStore.getServerSnapshot,
  );
  const [forcedOpen, setForcedOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const titleId = useId();
  const switchId = useId();

  useEffect(
    () =>
      consentStore.onOpenPreferences(() => {
        setAnalyticsChecked(consentStore.get()?.analytics ?? false);
        setCustomize(true);
        setForcedOpen(true);
      }),
    [],
  );

  if (!analyticsId) return null;

  const visible = choice === null || forcedOpen;

  const decide = (analytics: boolean) => {
    consentStore.set(analytics);
    setForcedOpen(false);
    setCustomize(false);
  };

  return (
    <>
      {choice?.analytics ? <Analytics id={analyticsId} /> : null}
      <AnimatePresence>
        {visible && choice !== undefined ? (
          <m.section
            key="consent"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="surface-raised fixed inset-x-3 bottom-3 z-[60] rounded-[var(--radius-panel)] p-5 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:p-6"
          >
            <h2 id={titleId} className="text-lg font-medium tracking-[-0.02em]">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              {copy.text}{" "}
              <Link href="/cookies" className="underline underline-offset-4 hover:text-ivory">
                {copy.more}
              </Link>
            </p>

            {customize ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm font-medium">{copy.essential}</p>
                  <p className="mt-1 text-xs leading-relaxed text-dim">{copy.essentialText}</p>
                </div>
                <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 p-4">
                  <div>
                    <label htmlFor={switchId} className="text-sm font-medium">
                      {copy.analytics}
                    </label>
                    <p className="mt-1 text-xs leading-relaxed text-dim">{copy.analyticsText}</p>
                  </div>
                  <button
                    id={switchId}
                    type="button"
                    role="switch"
                    aria-checked={analyticsChecked}
                    onClick={() => setAnalyticsChecked((value) => !value)}
                    className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300 ${analyticsChecked ? "border-aqua/60 bg-aqua/30" : "border-white/15 bg-white/[0.06]"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block size-4 rounded-full bg-ivory transition-transform duration-300 ${analyticsChecked ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={buttonClasses("secondary", "sm")}
                onClick={() => decide(false)}
              >
                {copy.refuse}
              </button>
              <button
                type="button"
                className={buttonClasses("secondary", "sm")}
                onClick={() => decide(true)}
              >
                {copy.accept}
              </button>
              {customize ? (
                <button
                  type="button"
                  className={buttonClasses("primary", "sm", "col-span-2")}
                  onClick={() => decide(analyticsChecked)}
                >
                  {copy.save}
                </button>
              ) : (
                <button
                  type="button"
                  className="col-span-2 mt-1 text-sm text-mist underline underline-offset-4 hover:text-ivory"
                  onClick={() => {
                    setAnalyticsChecked(choice?.analytics ?? false);
                    setCustomize(true);
                  }}
                >
                  {copy.customize}
                </button>
              )}
            </div>
          </m.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
