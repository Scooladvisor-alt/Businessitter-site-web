import type { Metadata } from "next";
import Link from "next/link";
import { legalInfo } from "@/content/legal";
import { site } from "@/content/site";
import { fr } from "@/lib/typography";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { LegalPage, LegalSection, Value } from "@/components/pages/Legal";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: fr(
    "Mentions légales du site businessitter.com : éditeur, hébergement, propriété intellectuelle et responsabilité.",
  ),
  path: "/mentions-legales",
});

export default function LegalNoticePage() {
  const info = legalInfo;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Mentions légales", path: "/mentions-legales" }])} />
      <LegalPage title={fr("Mentions *légales*")} updated={info.lastUpdated}>
        <LegalSection title={fr("Éditeur du site")}>
          <p>{fr(`Le site ${site.domain} est édité par :`)}</p>
          <dl>
            <div>
              <dt>{fr("Éditeur")}</dt>
              <dd>
                <Value value={info.companyName} label={fr("nom de l'éditeur")} />
                {fr(", exerçant sous le nom commercial Businessitter")}
              </dd>
            </div>
            <div>
              <dt>{fr("Forme juridique")}</dt>
              <dd>
                <Value value={info.legalForm} label={fr("forme juridique")} />
              </dd>
            </div>
            {info.shareCapital ? (
              <div>
                <dt>{fr("Capital social")}</dt>
                <dd>{info.shareCapital}</dd>
              </div>
            ) : null}
            <div>
              <dt>{fr("Adresse")}</dt>
              <dd>
                <Value value={info.address} label={fr("adresse")} />
              </dd>
            </div>
            <div>
              <dt>{fr("Immatriculation")}</dt>
              <dd>
                <Value value={info.registration} label={fr("RCS ou RNE et numéro SIREN")} />
              </dd>
            </div>
            {info.vatNumber ? (
              <div>
                <dt>{fr("TVA intracommunautaire")}</dt>
                <dd>{info.vatNumber}</dd>
              </div>
            ) : null}
            <div>
              <dt>{fr("Activité")}</dt>
              <dd>{fr("Conseil, programmation et intégration de solutions informatiques")}</dd>
            </div>
            <div>
              <dt>{fr("Adresse e-mail")}</dt>
              <dd>
                {info.email ? (
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                ) : (
                  <Value value={null} label={fr("adresse e-mail")} />
                )}
              </dd>
            </div>
            {info.phone ? (
              <div>
                <dt>{fr("Téléphone")}</dt>
                <dd>{info.phone}</dd>
              </div>
            ) : null}
            <div>
              <dt>{fr("Direction de la publication")}</dt>
              <dd>
                <Value
                  value={info.publicationDirector}
                  label={fr("nom de la personne responsable")}
                />
              </dd>
            </div>
          </dl>
        </LegalSection>

        <LegalSection title={fr("Hébergement")}>
          <p>{fr("Le site est hébergé par :")}</p>
          <dl>
            <div>
              <dt>{fr("Hébergeur")}</dt>
              <dd>{info.host.name}</dd>
            </div>
            <div>
              <dt>{fr("Adresse")}</dt>
              <dd>
                <Value value={info.host.address} label={fr("adresse postale de l'hébergeur")} />
              </dd>
            </div>
            <div>
              <dt>{fr("Site internet")}</dt>
              <dd>
                <a href={info.host.website} target="_blank" rel="noopener noreferrer">
                  {info.host.website.replace(/^https:\/\//, "")}
                </a>
              </dd>
            </div>
          </dl>
        </LegalSection>

        <LegalSection title={fr("Propriété intellectuelle")}>
          <p>
            {fr(
              "La structure du site, ses textes, éléments graphiques, animations et codes sources sont protégés par le droit de la propriété intellectuelle. Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation préalable écrite de l'éditeur est interdite.",
            )}
          </p>
          <p>
            {fr(
              "Le nom Businessitter, son logo et le nom SuperCalendar sont la propriété de l'éditeur. Les polices de caractères Inter Tight et Instrument Serif sont distribuées sous licence SIL Open Font License ; les icônes proviennent de la bibliothèque Lucide, distribuée sous licence ISC.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Contenus et illustrations")}>
          <p>
            {fr(
              "Les informations publiées sur ce site sont fournies à titre indicatif. Les interfaces, scénarios et exemples présentés sont des représentations illustratives destinées à expliquer des possibilités : ils ne constituent ni une offre contractuelle, ni un engagement de résultat. Chaque projet fait l'objet d'une étude spécifique.",
            )}
          </p>
          <p>
            {fr(
              "L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées, mais ne peut garantir l'absence d'erreur ou d'omission.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Liens externes")}>
          <p>
            {fr(
              "Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Données personnelles et cookies")}>
          <p>
            {fr("Le traitement des données personnelles est décrit dans la ")}
            <Link href="/confidentialite">{fr("politique de confidentialité")}</Link>
            {fr(". L'utilisation des traceurs est détaillée sur la page ")}
            <Link href="/cookies">{fr("gestion des cookies")}</Link>
            {fr(", et les règles d'utilisation du site dans les ")}
            <Link href="/cgu">{fr("conditions générales d'utilisation")}</Link>.
          </p>
        </LegalSection>

        <LegalSection title={fr("Droit applicable")}>
          <p>
            {fr(
              "Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français sont compétents.",
            )}
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
