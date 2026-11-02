import type { Metadata } from "next";
import Link from "next/link";
import { legalInfo } from "@/content/legal";
import { analyticsId } from "@/components/consent/consent-store";
import { fr } from "@/lib/typography";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { LegalPage, LegalSection, Value } from "@/components/pages/Legal";

export const metadata: Metadata = pageMetadata({
  title: fr("Politique de confidentialité"),
  description: fr(
    "Comment Businessitter traite les données personnelles collectées sur son site : finalités, bases légales, destinataires, durées de conservation et droits des personnes.",
  ),
  path: "/confidentialite",
});

export default function PrivacyPage() {
  const info = legalInfo;
  const contact = info.privacyEmail ?? info.email;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: fr("Politique de confidentialité"), path: "/confidentialite" },
        ])}
      />
      <LegalPage
        title={fr("Politique de *confidentialité*")}
        updated={info.lastUpdated}
        intro={
          <p>
            {fr(
              "Cette politique explique comment les données personnelles collectées sur ce site sont traitées, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.",
            )}
          </p>
        }
      >
        <LegalSection title={fr("Responsable du traitement")}>
          <dl>
            <div>
              <dt>{fr("Responsable")}</dt>
              <dd>
                <Value value={info.companyName} label={fr("dénomination de l'éditeur")} />
              </dd>
            </div>
            <div>
              <dt>{fr("Adresse")}</dt>
              <dd>
                <Value value={info.address} label={fr("adresse")} />
              </dd>
            </div>
            <div>
              <dt>{fr("Contact")}</dt>
              <dd>
                {contact ? (
                  <a href={`mailto:${contact}`}>{contact}</a>
                ) : (
                  <Value value={null} label={fr("adresse e-mail dédiée")} />
                )}
              </dd>
            </div>
          </dl>
        </LegalSection>

        <LegalSection title={fr("Données collectées")}>
          <h3>{fr("Formulaire de demande d'audit")}</h3>
          <p>
            {fr(
              "Lorsque vous demandez un audit, nous collectons les informations que vous saisissez :",
            )}
          </p>
          <ul>
            <li>{fr("nom et prénom ;")}</li>
            <li>{fr("nom de l'entreprise ;")}</li>
            <li>{fr("adresse e-mail professionnelle ;")}</li>
            <li>{fr("numéro de téléphone ;")}</li>
            <li>{fr("secteur d'activité ;")}</li>
            <li>{fr("le message que vous choisissez de rédiger (facultatif).")}</li>
          </ul>
          <p>
            {fr("Merci de ne pas transmettre d'informations sensibles dans le champ de message.")}
          </p>
          <h3>{fr("Données techniques")}</h3>
          <p>
            {fr(
              "Lors de la consultation du site, l'hébergeur traite des données techniques nécessaires à son fonctionnement et à sa sécurité, comme l'adresse IP et les journaux de connexion.",
            )}
          </p>
          <h3>{fr("Stockage local dans votre navigateur")}</h3>
          <p>
            {fr(
              "Le besoin que vous saisissez dans la zone « Et vous, qu'aimeriez-vous automatiser ? » est conservé uniquement dans votre navigateur (stockage de session) afin de pré-remplir le formulaire. Il est effacé à la fermeture de l'onglet et n'est transmis que si vous envoyez le formulaire.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Finalités et bases légales")}>
          <ul>
            <li>
              <strong>{fr("Répondre à votre demande d'audit")}</strong>
              {fr(
                " et échanger avec vous à ce sujet : mesures précontractuelles prises à votre demande (article 6, paragraphe 1, b du RGPD). Votre accord est recueilli lors de l'envoi du formulaire.",
              )}
            </li>
            <li>
              <strong>{fr("Assurer la sécurité et le bon fonctionnement du site")}</strong>
              {fr(
                ", notamment la protection contre les envois abusifs : intérêt légitime (article 6, paragraphe 1, f du RGPD).",
              )}
            </li>
            {analyticsId ? (
              <li>
                <strong>{fr("Mesurer l'audience du site")}</strong>
                {fr(
                  " : votre consentement (article 6, paragraphe 1, a du RGPD), que vous pouvez retirer à tout moment.",
                )}
              </li>
            ) : null}
          </ul>
          <p>
            {fr(
              "Vos données ne sont ni vendues, ni utilisées à des fins de prospection sans votre accord.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Destinataires")}>
          <p>
            {fr(
              "Les données sont destinées aux seules personnes habilitées de l'éditeur. Elles peuvent être traitées par des prestataires techniques agissant pour son compte (sous-traitants) :",
            )}
          </p>
          <ul>
            <li>{fr(`${info.host.name}, pour l'hébergement du site ;`)}</li>
            <li>
              {fr(
                "le service de messagerie ou d'automatisation utilisé pour acheminer les demandes envoyées depuis le formulaire (par exemple Resend pour l'envoi d'e-mails) ;",
              )}
            </li>
            {analyticsId ? (
              <li>
                {fr("Google Ireland Limited, pour la mesure d'audience, si vous l'acceptez.")}
              </li>
            ) : null}
          </ul>
          <p>
            {fr(
              "Certains prestataires peuvent être établis hors de l'Union européenne, notamment aux États-Unis. Le cas échéant, ces transferts doivent être encadrés par des garanties appropriées, comme une décision d'adéquation ou des clauses contractuelles types de la Commission européenne.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Durées de conservation")}>
          <ul>
            <li>
              {fr("Demandes d'audit sans suite : ")}
              <Value value={info.prospectRetention} label={fr("durée de conservation")} />
              {fr(" ;")}
            </li>
            <li>
              {fr(
                "Demandes donnant lieu à une relation contractuelle : pendant la durée de la relation, puis selon les obligations légales applicables ;",
              )}
            </li>
            <li>
              {fr(
                "Choix relatifs aux traceurs : six mois, après quoi votre choix vous est de nouveau demandé.",
              )}
            </li>
          </ul>
        </LegalSection>

        <LegalSection title={fr("Vos droits")}>
          <p>
            {fr(
              "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement de vos données, ainsi que d'un droit à la portabilité. Lorsque le traitement repose sur votre consentement, vous pouvez le retirer à tout moment. Vous pouvez également définir des directives relatives au sort de vos données après votre décès.",
            )}
          </p>
          <p>
            {fr("Pour exercer vos droits, écrivez à ")}
            {contact ? (
              <a href={`mailto:${contact}`}>{contact}</a>
            ) : (
              <Value value={null} label={fr("adresse e-mail dédiée")} />
            )}
            {fr(". Une preuve d'identité pourra vous être demandée en cas de doute raisonnable.")}
          </p>
          <p>
            {fr(
              "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL : ",
            )}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              www.cnil.fr
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title={fr("Sécurité")}>
          <p>
            {fr(
              "Les échanges avec le site sont chiffrés (HTTPS). Des mesures techniques et organisationnelles adaptées sont mises en œuvre pour protéger vos données contre la perte, l'accès non autorisé ou la divulgation.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("Cookies et traceurs")}>
          <p>
            {fr("L'utilisation des traceurs est détaillée sur la page ")}
            <Link href="/cookies">{fr("gestion des cookies")}</Link>.
          </p>
        </LegalSection>

        <LegalSection title={fr("Modifications")}>
          <p>
            {fr(
              "Cette politique peut évoluer, notamment en cas de changement des traitements ou de la réglementation. La date de dernière mise à jour figure en haut de cette page.",
            )}
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
