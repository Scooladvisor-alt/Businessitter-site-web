import type { Metadata } from "next";
import Link from "next/link";
import { legalInfo } from "@/content/legal";
import { site } from "@/content/site";
import { fr } from "@/lib/typography";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { LegalPage, LegalSection } from "@/components/pages/Legal";

export const metadata: Metadata = pageMetadata({
  title: fr("Conditions générales d'utilisation"),
  description: fr(
    "Conditions générales d'utilisation du site businessitter.com : accès au site, demande d'audit, propriété intellectuelle, responsabilité et droit applicable.",
  ),
  path: "/cgu",
});

export default function TermsPage() {
  const info = legalInfo;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: fr("Conditions générales d'utilisation"), path: "/cgu" }])}
      />
      <LegalPage title={fr("Conditions générales *d'utilisation*")} updated={info.lastUpdated}>
        <LegalSection title={fr("1. Objet")}>
          <p>
            {fr(
              `Les présentes conditions générales d'utilisation (CGU) définissent les règles d'accès et d'utilisation du site ${site.domain}, édité par ${info.companyName}, entrepreneur individuel exerçant sous le nom commercial Businessitter (SIREN 988 933 537). Les informations relatives à l'éditeur figurent dans les `,
            )}
            <Link href="/mentions-legales">{fr("mentions légales")}</Link>.
          </p>
          <p>
            {fr(
              "Toute utilisation du site vaut acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, il vous est demandé de ne pas utiliser le site.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("2. Accès au site")}>
          <p>
            {fr(
              "Le site est accessible gratuitement à toute personne disposant d'un accès à internet. Les frais d'accès et d'équipement restent à la charge de l'utilisateur.",
            )}
          </p>
          <p>
            {fr(
              "L'éditeur s'efforce d'assurer l'accessibilité du site en continu, sans obligation de résultat. L'accès peut être suspendu, notamment pour des opérations de maintenance ou en cas de force majeure, sans que cela ouvre droit à une quelconque indemnité.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("3. Services proposés")}>
          <p>
            {fr(
              "Le site présente l'activité de Businessitter : conseil, conception, développement et intégration de solutions d'intelligence artificielle et d'outils numériques pour les entreprises. Il permet de demander un audit gratuit et sans engagement au moyen d'un formulaire.",
            )}
          </p>
          <p>
            {fr(
              "La demande d'audit ne constitue ni une commande ni un engagement. Toute prestation éventuelle fait l'objet d'une proposition écrite et d'un devis, acceptés séparément, qui fixent ses conditions (contenu, prix, délais, responsabilités). Les services s'adressent principalement aux professionnels.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("4. Utilisation du formulaire")}>
          <p>
            {fr(
              "L'utilisateur s'engage à fournir des informations exactes, à ne pas usurper l'identité d'un tiers et à ne transmettre aucun contenu illicite, injurieux, diffamatoire ou portant atteinte aux droits de tiers.",
            )}
          </p>
          <p>
            {fr(
              "Il est demandé de ne pas transmettre par le formulaire d'informations sensibles ou confidentielles qui ne seraient pas nécessaires à la demande. L'éditeur se réserve le droit de ne pas donner suite aux demandes abusives, automatisées ou manifestement sans objet.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("5. Comportements interdits")}>
          <ul>
            <li>
              {fr(
                "tenter d'accéder sans autorisation aux systèmes du site ou d'en perturber le fonctionnement ;",
              )}
            </li>
            <li>{fr("extraire ou réutiliser de façon systématique les contenus du site ;")}</li>
            <li>{fr("utiliser le site à des fins illicites ou contraires aux présentes CGU.")}</li>
          </ul>
        </LegalSection>

        <LegalSection title={fr("6. Propriété intellectuelle")}>
          <p>
            {fr(
              "L'ensemble des éléments du site (textes, visuels, logos, animations, interfaces, codes sources) est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite et pourrait constituer une contrefaçon.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("7. Contenus et responsabilité")}>
          <p>
            {fr(
              "Les informations publiées sont fournies à titre indicatif. Les exemples, interfaces et scénarios présentés sont des illustrations : ils ne constituent ni une offre contractuelle, ni une garantie de résultat. L'éditeur ne saurait être tenu responsable d'une décision prise sur la seule base de ces informations.",
            )}
          </p>
          <p>
            {fr(
              "L'éditeur ne peut être tenu responsable des dommages résultant d'une interruption du site, d'un dysfonctionnement, de l'intrusion d'un tiers ou d'une utilisation du site non conforme aux présentes CGU.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("8. Liens externes")}>
          <p>
            {fr(
              "Le site peut contenir des liens vers des sites tiers, dont SuperCalendar. L'éditeur n'est pas responsable du contenu ni des pratiques des sites qu'il ne gère pas.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("9. Données personnelles et cookies")}>
          <p>
            {fr("Les données collectées sont traitées conformément à la ")}
            <Link href="/confidentialite">{fr("politique de confidentialité")}</Link>
            {fr(". Les traceurs sont décrits sur la page ")}
            <Link href="/cookies">{fr("gestion des cookies")}</Link>.
          </p>
        </LegalSection>

        <LegalSection title={fr("10. Modification des CGU")}>
          <p>
            {fr(
              "L'éditeur peut modifier les présentes CGU à tout moment, notamment pour tenir compte d'une évolution du site ou de la réglementation. La version applicable est celle en ligne au moment de l'utilisation du site ; la date de dernière mise à jour figure en haut de cette page.",
            )}
          </p>
        </LegalSection>

        <LegalSection title={fr("11. Droit applicable et litiges")}>
          <p>
            {fr(
              "Les présentes CGU sont régies par le droit français. En cas de différend, une solution amiable sera recherchée en priorité. À défaut, les tribunaux français compétents pourront être saisis.",
            )}
          </p>
          <p>
            {fr("Pour toute question relative aux présentes conditions : ")}
            {info.email ? (
              <a href={`mailto:${info.email}`}>{info.email}</a>
            ) : (
              <Link href="/contact">{fr("page contact")}</Link>
            )}
            .
          </p>
        </LegalSection>
      </LegalPage>
    </>
  );
}
