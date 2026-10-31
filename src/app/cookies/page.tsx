import type { Metadata } from "next";
import Link from "next/link";
import { legalInfo } from "@/content/legal";
import { analyticsId } from "@/components/consent/consent-store";
import { ConsentStatus } from "@/components/consent/ConsentStatus";
import { fr } from "@/lib/typography";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { LegalPage, LegalSection } from "@/components/pages/Legal";

export const metadata: Metadata = pageMetadata({
  title: fr("Gestion des cookies"),
  description: fr(
    "Les cookies et traceurs utilisés sur businessister.com, et la manière de gérer vos préférences.",
  ),
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: fr("Gestion des cookies"), path: "/cookies" }])} />
      <LegalPage title={fr("Gestion des cookies")} updated={legalInfo.lastUpdated}>
        <LegalSection title={fr("Qu'est-ce qu'un traceur ?")}>
          <p>
            {fr(
              "Un traceur (ou cookie) est une information déposée ou lue sur votre appareil lors de la consultation d'un site. Certains sont indispensables au fonctionnement du site ; les autres, comme la mesure d'audience ou la publicité, nécessitent votre accord préalable.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Traceurs utilisés sur ce site")}>
          {analyticsId ? (
            <p>
              {fr(
                "Ce site n'utilise aucun traceur publicitaire. Un outil de mesure d'audience peut être activé, uniquement si vous l'acceptez : rien n'est déposé avant votre choix.",
              )}
            </p>
          ) : (
            <p>
              {fr(
                "Ce site n'utilise aucun cookie publicitaire ni aucun traceur de mesure d'audience. C'est pourquoi aucun bandeau de consentement ne vous est présenté.",
              )}
            </p>
          )}
          <table>
            <thead>
              <tr>
                <th scope="col">{fr("Nom")}</th>
                <th scope="col">{fr("Finalité")}</th>
                <th scope="col">{fr("Durée")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>businessister:audit-draft</td>
                <td>
                  {fr(
                    "Conserver le besoin saisi dans « Et vous, qu'aimeriez-vous automatiser ? » pour pré-remplir le formulaire (stockage de session, indispensable).",
                  )}
                </td>
                <td>{fr("Jusqu'à la fermeture de l'onglet")}</td>
              </tr>
              {analyticsId ? (
                <>
                  <tr>
                    <td>businessister:consent</td>
                    <td>
                      {fr(
                        "Mémoriser votre choix concernant la mesure d'audience (stockage local, indispensable).",
                      )}
                    </td>
                    <td>{fr("6 mois")}</td>
                  </tr>
                  <tr>
                    <td>_ga, _ga_*</td>
                    <td>
                      {fr(
                        "Mesure d'audience (Google Analytics), déposés uniquement après votre accord.",
                      )}
                    </td>
                    <td>{fr("13 mois maximum")}</td>
                  </tr>
                </>
              ) : null}
            </tbody>
          </table>
          <ConsentStatus />
        </LegalSection>

        <LegalSection title={fr("Paramétrer votre navigateur")}>
          <p>
            {fr(
              "Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies. Cela peut toutefois affecter certaines fonctionnalités des sites que vous consultez.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("En savoir plus")}>
          <p>
            {fr("Pour connaître la manière dont vos données sont traitées, consultez la ")}
            <Link href="/confidentialite">{fr("politique de confidentialité")}</Link>
            {fr(". Vous pouvez aussi consulter les recommandations de la CNIL sur ")}
            <a
              href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
              target="_blank"
              rel="noopener noreferrer"
            >
              cnil.fr
            </a>
            .
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
