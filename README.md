# Businessister — site web

Site vitrine immersif de **Businessister** (conseil, intégration et développement de solutions
d'intelligence artificielle pour les entreprises), conçu comme une expérience narrative pilotée
par le défilement, avec un objectif de conversion unique : **la demande d'audit gratuit**.

- **Next.js 16** (App Router, Cache Components) · **React 19** · **TypeScript strict**
- **Tailwind CSS 4** (système de design « Encre & Aube » défini dans `src/app/globals.css`)
- **GSAP** (ScrollTrigger, SplitText) · **Motion for React** · **Lenis** (défilement fluide)
- **Three.js** pour la scène 3D du « système » (chargée en différé, avec repli SVG)
- **Lucide** pour les icônes · aucune dépendance à Framer

---

## Démarrage rapide

Prérequis : Node.js **20.9 ou plus récent**.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Le site est alors disponible sur http://localhost:3000.

| Script              | Rôle                                  |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Serveur de développement              |
| `npm run build`     | Compilation de production             |
| `npm start`         | Serveur de production (après `build`) |
| `npm run lint`      | Analyse ESLint                        |
| `npm run typecheck` | Vérification TypeScript               |
| `npm run format`    | Mise en forme Prettier                |

---

## Parcours de la page d'accueil

La page d'accueil raconte une transformation en neuf séquences :
**complexité → compréhension → possibilités → solutions → sérénité**.

Un même fil visuel accompagne tout le site, en arrière-plan WebGL piloté par le défilement :

- le **système** (réseau de nœuds et de liaisons) : en chaos à l'ouverture, il s'efface pendant
  le parcours puis réapparaît, entièrement organisé, sur « Vision » ;
- une **nuée de particules** qui change de formation à chaque section, avec ses propres couleurs
  et son propre mouvement : nébuleuse (ouverture), tourbillon qui s'emballe puis se dénoue en
  rubans (constat), champ ondulant (possibles), double hélice (approche), éclosion
  (transformation), treillis (réalisation), sphères concentriques (confiance), halo (vision),
  anneau (audit), horizon (pied de page).

Chaque section déclare sa mise en scène avec `data-backdrop="<nom>"` (réglages dans
`src/components/system/backdrop-presets.ts`, formes dans `field-shapes.ts`) ; les pages
intérieures utilisent `page-hero`, `section` (une formation différente par section) et `legal`.

| #   | Séquence (ancre)                      | Mise en scène                                                                                               |
| --- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | Ouverture (`#accueil`)                | Titre centré sur le système 3D (WebGL) ; au défilement, des connexions se créent, des flux s'organisent     |
| 2   | Le constat (`#constat`)               | Le flot des sollicitations s'accumule et s'accélère, la question, puis un seul flux traverse une passerelle |
| 3   | Les possibles (`#possibles`)          | Vitrine à onglets : six interfaces animées en lecture automatique + « Qu'aimeriez-vous automatiser ? »      |
| 4   | Notre approche (`#approche`)          | Quatre étapes reliées par une ligne lumineuse, chacune avec une petite illustration animée                  |
| 5   | La transformation (`#transformation`) | Une semaine type : les tâches répétitives se réduisent, le temps utile s'élargit (sans chiffres)            |
| 6   | Réalisation (`#realisation`)          | Une carte compacte : SuperCalendar, déjà utilisé par des professionnels, et un lien discret                 |
| 7   | Confiance (`#confiance`)              | Infrastructure en couches (accès, traitements, validation humaine, supervision)                             |
| 8   | Vision (`#vision`)                    | Le système de l'ouverture réapparaît, organisé ; texte révélé mot à mot                                     |
| 9   | Audit gratuit (`#audit`)              | Formulaire de demande d'audit                                                                               |

Pages complémentaires : `/approche`, `/solutions`, `/contact`, `/mentions-legales`,
`/confidentialite`, `/cookies`, ainsi qu'une page 404 personnalisée.

---

## Structure du projet

```
src/
├── app/                     Routes (App Router), métadonnées, sitemap, robots, images OG
│   ├── api/audit/route.ts   Réception des demandes d'audit
│   └── globals.css          Système de design, utilitaires et règles d'animation CSS
├── content/                 TOUS les textes du site (séparés de la présentation)
│   ├── site.ts              Identité, navigation, coordonnées, chapitres
│   ├── home.ts              Page d'accueil (9 séquences)
│   ├── pages.ts             Notre approche, Solutions, Contact, 404
│   └── legal.ts             Informations juridiques — À COMPLÉTER
├── components/
│   ├── home/                Séquences de la page d'accueil (+ scenes/ : mini-interfaces)
│   ├── system/              Arrière-plan WebGL (tout le site), réglages par section, SVG de repli
│   ├── forms/               Formulaire de demande d'audit
│   ├── consent/             Consentement aux traceurs optionnels
│   ├── layout/              En-tête, pied de page, indicateur de chapitres
│   ├── motion/              Révélations au défilement (Reveal, SplitHeading)
│   ├── pages/               En-têtes de pages, bandeau d'appel à l'action, pages légales
│   └── ui/                  Boutons, logo, textes enrichis…
├── hooks/                   Requêtes média (réduction des mouvements)
└── lib/                     Validation, typographie française, GSAP, envoi, SEO…
assets/fonts/                Polices (licence OFL) utilisées pour l'image Open Graph
```

---

## Modifier les contenus

Tous les textes visibles se trouvent dans `src/content/`. Il suffit de modifier ces fichiers :

- **Mise en valeur** : dans chaque titre, un segment entouré d'astérisques, par exemple
  `"Faites *bien plus*."`, s'affiche en italique à empattements avec le dégradé « aube » de la
  marque — le même dégradé que les boutons principaux. Un `\n` marque un retour à la ligne voulu
  sur les écrans larges (`"Moins de tâches manuelles.\n*Plus de temps.*"`).
- **Pas de sous-titres** : chaque section tient en un titre court et direct ; le détail est
  porté par les visuels, les cartes et les pages intérieures.

### Logo et matières

- **Logo** : le « B » noir et son étoile au dégradé « aube », vectorisés depuis le fichier
  fourni : `public/brand/businessister-logo.svg` (fichier autonome) et
  `src/components/ui/logo-paths.ts` (tracés utilisés par le composant `Logo`, les icônes et
  l'image de partage). La lettre étant noire, elle est toujours posée sur une surface claire.
- **« Liquid glass »** (`src/app/globals.css`) : `glass-light` (verre clair : en-tête flottant,
  pastilles du logo, carte SuperCalendar), `surface` / `surface-raised` / `glass` (verre sombre
  des cartes), `btn-aube` (bouton principal glacé) et `btn-glass` (boutons secondaires, onglets,
  puces). Pas de lignes de séparation : le site reste ouvert, d'une section à l'autre.
- **Typographie française** : les contenus passent par `fr()` / `frDeep()` (`src/lib/typography.ts`),
  qui posent automatiquement les espaces insécables (avant `: ; ! ?`, dans les guillemets) et
  l'apostrophe typographique. Écrivez simplement `"Et si … ?"`.
- **Titres du hero** : un élément du tableau `titleLines` correspond à une ligne animée.

---

## Formulaire de demande d'audit

Le formulaire (accueil `#audit` et page `/contact`) envoie les données à la route `POST /api/audit`,
qui les **valide côté serveur** puis les transmet par un ou plusieurs canaux :

| Canal   | Variables                                                | Remarques                                                                                     |
| ------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| E-mail  | `RESEND_API_KEY`, `AUDIT_EMAIL_TO`, `AUDIT_EMAIL_FROM`   | Via l'API [Resend](https://resend.com). L'expéditeur doit appartenir à un domaine vérifié.    |
| Webhook | `AUDIT_WEBHOOK_URL`, `AUDIT_WEBHOOK_SECRET` (facultatif) | JSON en POST (Make, Zapier, n8n, CRM…). Signature `X-Businessister-Signature: sha256=<HMAC>`. |

Comportement garanti :

- **Aucun canal configuré** → réponse `503` et message explicite à l'écran. Le site n'affiche
  **jamais** une confirmation si la demande n'a pas réellement été transmise.
- **Échec de tous les canaux** → réponse `502` et message d'erreur.
- **Protection antispam** : champ piège invisible, délai minimal de remplissage, vérification de
  l'origine de la requête, taille maximale, limitation à 5 envois par adresse IP et par
  10 minutes (en mémoire, par instance ; pour une limitation mutualisée, brancher un stockage
  partagé comme Upstash Redis dans `src/lib/server/rate-limit.ts`).
- Validation identique côté navigateur et côté serveur (`src/lib/audit.ts`), messages d'erreur
  explicites, récapitulatif des erreurs, état de chargement, confirmation après envoi.

Exemple de charge utile reçue par le webhook :

```json
{
  "type": "audit_request",
  "submittedAt": "31/10/2026 14:05:12",
  "source": "https://businessister.com/",
  "data": {
    "name": "…",
    "company": "…",
    "email": "…",
    "phone": "…",
    "sector": "…",
    "message": "…",
    "consent": true
  }
}
```

La zone « Et vous, qu'aimeriez-vous automatiser ? » ne réalise **aucune analyse automatique** :
elle pré-remplit simplement le message du formulaire (stockage de session du navigateur).

---

## Cookies et mesure d'audience

Par défaut, le site **n'utilise aucun traceur non essentiel** : aucun bandeau n'est affiché.
Si `NEXT_PUBLIC_GA_MEASUREMENT_ID` est renseigné, un bandeau de consentement apparaît
(« Tout refuser » et « Tout accepter » au même niveau, personnalisation possible), et Google
Analytics n'est chargé **qu'après acceptation**. Le choix est conservé six mois et modifiable
depuis le pied de page et la page `/cookies`. La politique de sécurité du contenu (CSP) n'autorise
les domaines de Google que dans ce cas.

---

## Déploiement sur Vercel

1. Poussez le dépôt sur GitHub, puis dans Vercel : **Add New… → Project** et importez le dépôt.
   Le framework Next.js est détecté automatiquement (commande `next build`, aucun réglage requis).
2. Dans **Settings → Environment Variables**, ajoutez les variables de `.env.example`
   (au minimum `NEXT_PUBLIC_SITE_URL` et un canal de réception des demandes), pour les
   environnements _Production_ et _Preview_.
3. Déployez. Testez le formulaire sur l'URL de prévisualisation.
4. **Domaine `businessister.com`** : dans **Settings → Domains**, ajoutez `businessister.com`
   et `www.businessister.com`, choisissez le domaine principal (redirection de l'autre vers
   lui), puis créez chez votre registraire les enregistrements DNS indiqués par Vercel —
   généralement un enregistrement `A` pour le domaine racine (`76.76.21.21`) et un `CNAME`
   pour `www` (`cname.vercel-dns.com`). Le certificat HTTPS est émis automatiquement.
5. Si le domaine principal diffère de `https://businessister.com`, mettez à jour
   `NEXT_PUBLIC_SITE_URL` puis redéployez (les variables publiques sont intégrées au build).

En-têtes de sécurité appliqués (`next.config.ts`) : Content-Security-Policy,
Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
Permissions-Policy.

---

## À compléter avant la mise en ligne

Aucune information juridique ou commerciale n'a été inventée. Les éléments manquants sont
signalés sur le site par un repère visible **« À compléter »** :

- [ ] **Informations légales** dans `src/content/legal.ts` : dénomination, forme juridique,
      capital, siège, immatriculation (RCS/RNE + SIREN), TVA, direction de la publication,
      adresse postale de l'hébergeur (voir les mentions légales de Vercel), durée de conservation
      des demandes d'audit (la CNIL recommande au plus 3 ans après le dernier contact pour les
      prospects).
- [ ] **Coordonnées** : `NEXT_PUBLIC_CONTACT_EMAIL` (et éventuellement `NEXT_PUBLIC_CONTACT_PHONE`).
- [ ] **Canal de réception** des demandes (Resend et/ou webhook), puis un envoi de test réel.
- [ ] **Politique de confidentialité** : compléter le service de réception des demandes
      (destinataires) et faire valider les bases légales et durées de conservation.
- [ ] **URL de SuperCalendar** (`NEXT_PUBLIC_SUPERCALENDAR_URL`, par défaut `https://supercalendar.fr`).
- [ ] Mettre à jour `lastUpdated` (`src/content/legal.ts`) et `updatedAt` (`src/content/site.ts`).

---

## Accessibilité, animations et performances

- **Mouvements réduits** (`prefers-reduced-motion`) : aucune animation de défilement, pas de
  défilement fluide, pas de scène WebGL ; une version statique complète et cohérente s'affiche.
- **Scène 3D** (une seule pour tout le site, conservée d'une page à l'autre) : chargée à la
  première interaction (ou après un court délai), jamais en mode « économie de données » ;
  repli automatique sur un visuel SVG si WebGL est indisponible ; 30 images/s sur les appareils
  modestes ; rendu suspendu lorsque l'onglet est masqué.
- Scène « collante » en `position: sticky` (pas d'épinglage JavaScript coûteux), apparitions
  en CSS via un seul `IntersectionObserver`, animations préparées à l'approche des séquences.
- Navigation au clavier (lien d'évitement, menu mobile avec piégeage par `inert`, touche Échap),
  focus visibles, HTML sémantique, contrastes AA, formulaires étiquetés et messages d'erreur liés.
- Mesures Lighthouse obtenues en local : **ordinateur 100 / 100 / 100 / 100** (performance,
  accessibilité, bonnes pratiques, SEO) ; **mobile** (simulation 4G lente + processeur ralenti) :
  performance d'environ 90 sur l'accueil et les pages intérieures, 100 dans les trois autres
  catégories, CLS nul.

SEO : métadonnées par page, URL canoniques, Open Graph et image de partage générée,
`sitemap.xml`, `robots.txt`, manifeste, données structurées (Organization, WebSite,
BreadcrumbList, FAQPage, Service).

---

## Licences des ressources tierces

- Polices Inter Tight, Instrument Serif et JetBrains Mono : SIL Open Font License 1.1
  (textes de licence dans `assets/fonts/`).
- Icônes Lucide : licence ISC.
- GSAP : licence standard « no charge » de GreenSock (usage commercial autorisé).
- Three.js, Lenis, Motion : licence MIT.
