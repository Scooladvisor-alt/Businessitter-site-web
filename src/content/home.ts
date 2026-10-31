import { frDeep } from "@/lib/typography";

/**
 * Contenus de la page d'accueil.
 * Convention : les mots entourés d'astérisques (*mot*) sont mis en valeur
 * (italique à empattements + dégradé « aube ») ; « \n » force un retour
 * à la ligne dans les titres animés ligne par ligne.
 */

export type SceneKey = "phone" | "mail" | "docs" | "ops" | "journey" | "custom";
export type TaskIcon =
  "phone" | "mail" | "file" | "copy" | "calendar" | "bell" | "voicemail" | "receipt";
export type TaskStatus = "auto" | "review";

export const hero = frDeep({
  eyebrow: "Intégration d'intelligence artificielle sur mesure",
  titleLines: [
    "Et si votre entreprise",
    "pouvait faire *bien plus*,",
    "avec moins de contraintes ?",
  ],
  subtitle:
    "Nous imaginons et intégrons des solutions d'intelligence artificielle sur mesure pour libérer votre temps, simplifier vos opérations et accélérer votre développement.",
  capabilities: [
    "Agents IA",
    "Automatisation des processus",
    "Agents téléphoniques",
    "Outils sur mesure",
  ],
  scrollCue: "Faites défiler",
  reassurance: "Audit gratuit et sans engagement",
});

export const problem = frDeep({
  eyebrow: "02 — Le constat",
  title: "Votre entreprise mérite mieux que des tâches *répétitives*.",
  lead: "Un appel pendant un rendez-vous. Des e-mails qui s'accumulent. Un devis à préparer, des informations à recopier, une relance oubliée... Chaque jour, une part précieuse de votre temps disparaît dans des tâches qui pourraient fonctionner autrement.",
  pendingLabel: "Tâches en attente",
  pendingChip: "À traiter",
  transition: "Et si tout cela pouvait fonctionner *autrement* ?",
  resolvedTitle:
    "Les tâches répétitives sont prises en charge. Les décisions importantes restent *les vôtres*.",
  resolvedLead:
    "L'objectif n'est pas de remplacer les personnes, mais de les libérer de ce qui n'exige pas leur attention, tout en gardant la main sur ce qui compte.",
  statusLabels: { auto: "Automatisé", review: "Votre validation" },
  resolvedCounters: { auto: "Pris en charge", review: "À valider par vous" },
  tasks: [
    {
      icon: "phone",
      label: "Appel entrant",
      detail: "Pendant un rendez-vous client",
      resolved: "Appel pris en charge, demande qualifiée",
      status: "auto",
    },
    {
      icon: "mail",
      label: "23 e-mails non lus",
      detail: "Dont plusieurs demandes de devis",
      resolved: "E-mails triés et priorisés",
      status: "auto",
    },
    {
      icon: "file",
      label: "Demande de devis",
      detail: "À préparer avant vendredi",
      resolved: "Devis préparé, prêt à être validé",
      status: "review",
    },
    {
      icon: "copy",
      label: "Ressaisie manuelle",
      detail: "Du tableur vers la facturation",
      resolved: "Données synchronisées",
      status: "auto",
    },
    {
      icon: "calendar",
      label: "Rendez-vous à organiser",
      detail: "Trois créneaux proposés, sans réponse",
      resolved: "Créneau confirmé au client",
      status: "auto",
    },
    {
      icon: "bell",
      label: "Relance oubliée",
      detail: "Devis envoyé il y a quinze jours",
      resolved: "Relance envoyée au bon moment",
      status: "auto",
    },
    {
      icon: "voicemail",
      label: "Message vocal",
      detail: "Un prospect à rappeler",
      resolved: "Résumé transmis, rappel planifié",
      status: "review",
    },
    {
      icon: "receipt",
      label: "Facture à envoyer",
      detail: "Intervention terminée hier",
      resolved: "Facture générée, à valider",
      status: "review",
    },
  ] as { icon: TaskIcon; label: string; detail: string; resolved: string; status: TaskStatus }[],
});

export const possibilities = frDeep({
  eyebrow: "03 — Le champ des possibles",
  title: "Imaginez. Nous étudions comment le rendre *possible*.",
  subtitle: "Chaque entreprise est différente. Ses possibilités d'automatisation le sont aussi.",
  stageStatus: "Simulation",
  useCases: [
    {
      key: "phone",
      title: "Agent téléphonique intelligent",
      description:
        "Un agent capable de répondre aux appels, de qualifier les demandes, de proposer des rendez-vous et de transmettre les informations à vos outils.",
      tags: ["Réponse aux appels", "Qualification des demandes", "Prise de rendez-vous"],
    },
    {
      key: "mail",
      title: "Gestion intelligente des e-mails",
      description:
        "Un système qui analyse vos messages, identifie les demandes, prépare des réponses et automatise certains traitements selon des règles que vous définissez.",
      tags: ["Tri et priorisation", "Réponses préparées", "Règles sur mesure"],
    },
    {
      key: "docs",
      title: "Devis et documents",
      description:
        "Une solution qui collecte les informations utiles, prépare vos devis, génère vos documents et vous les transmet pour validation avant tout envoi.",
      tags: ["Collecte des données", "Documents générés", "Validation avant envoi"],
    },
    {
      key: "ops",
      title: "Automatisation des opérations",
      description:
        "Des outils qui synchronisent vos logiciels, mettent à jour vos données, déclenchent les bonnes actions au bon moment et limitent les doubles saisies.",
      tags: ["Logiciels connectés", "Données à jour", "Moins de ressaisies"],
    },
    {
      key: "journey",
      title: "Relation client",
      description:
        "Des automatisations pour les confirmations, les rappels, les suivis et les relances, afin que chaque client soit accompagné au bon moment.",
      tags: ["Confirmations", "Rappels", "Suivis et relances"],
    },
    {
      key: "custom",
      title: "Outils métiers sur mesure",
      description:
        "Des applications conçues pour répondre à un besoin précis, que les logiciels existants ne couvrent pas correctement.",
      tags: ["Pensé pour votre métier", "Interface dédiée", "Évolutif"],
    },
  ] as { key: SceneKey; title: string; description: string; tags: string[] }[],
  prompt: {
    title: "Et vous, qu'aimeriez-vous *automatiser* ?",
    description:
      "Décrivez une tâche qui vous prend du temps. Nous l'ajoutons à votre demande d'audit pour l'étudier avec vous.",
    label: "Décrivez la tâche que vous aimeriez automatiser",
    placeholder: "J'aimerais automatiser...",
    suggestionsLabel: "Exemples",
    suggestions: [
      "La prise de rendez-vous",
      "Les réponses aux demandes clients",
      "Les relances de devis",
      "La création de documents",
    ],
    submit: "Ajouter à ma demande d'audit",
    note: "Aucune analyse automatique : votre besoin sera étudié lors de l'audit gratuit.",
    empty: "Décrivez d'abord une tâche, ou choisissez un exemple.",
    success: "C'est noté. Votre besoin a été ajouté au formulaire de demande d'audit.",
  },
  conclusion: "Votre entreprise est unique. Votre solution doit l'être *aussi*.",
});

export const scenes = frDeep({
  phone: {
    caller: "Appel entrant",
    number: "06 •• •• •• 42",
    agent: "Agent IA — en ligne",
    transcript: [
      { from: "client", text: "Bonjour, je voudrais un rendez-vous pour un entretien." },
      { from: "agent", text: "Bien sûr. Je vous propose mardi à 10 h ou jeudi à 14 h." },
      { from: "client", text: "Jeudi à 14 h, c'est parfait." },
      { from: "agent", text: "C'est noté. Vous recevrez une confirmation par SMS." },
    ],
    result: "Rendez-vous créé",
    resultDetail: "Jeudi · 14:00",
    chips: ["Fiche client à jour", "Équipe informée"],
  },
  mail: {
    inbox: "Boîte de réception",
    sorting: "Tri en cours",
    messages: [
      { initials: "CL", subject: "Demande de devis — rénovation", tag: "Devis", tone: "amber" },
      { initials: "FO", subject: "Question sur ma facture", tag: "Facturation", tone: "sky" },
      {
        initials: "PR",
        subject: "Disponibilités la semaine prochaine ?",
        tag: "Rendez-vous",
        tone: "aqua",
      },
      {
        initials: "CL",
        subject: "Réclamation : retard de livraison",
        tag: "Prioritaire",
        tone: "ember",
      },
      { initials: "NW", subject: "Lettre d'information fournisseur", tag: "Classé", tone: "dim" },
    ],
    draftTitle: "Réponse préparée",
    draftText: "Bonjour, merci pour votre demande. Voici nos disponibilités pour...",
    draftStatus: "En attente de votre validation",
    approve: "Valider",
    edit: "Modifier",
  },
  docs: {
    sourceTitle: "Informations collectées",
    fields: [
      { label: "Demande", value: "Reçue par e-mail" },
      { label: "Prestation", value: "Entretien annuel" },
      { label: "Quantité", value: "2 interventions" },
      { label: "Délai", value: "Sous 15 jours" },
    ],
    documentTitle: "Devis",
    documentRef: "Brouillon",
    lines: ["Entretien annuel", "Déplacement", "Fournitures"],
    total: "Total estimé",
    status: "Prêt pour validation",
    footnote: "Validation humaine avant tout envoi",
  },
  ops: {
    hub: "Vos automatisations",
    apps: ["CRM", "Agenda", "Facturation", "Tableur", "Messagerie"],
    log: ["Nouveau client ajouté au CRM", "Rendez-vous synchronisé", "Facture créée et archivée"],
  },
  journey: {
    steps: [
      { title: "Demande reçue", message: "Merci, nous revenons vers vous rapidement." },
      { title: "Confirmation", message: "Votre rendez-vous est confirmé pour jeudi à 14 h." },
      { title: "Rappel la veille", message: "Rappel : rendez-vous demain à 14 h." },
      { title: "Suivi", message: "Comment s'est déroulée l'intervention ?" },
      { title: "Relance", message: "Votre devis est toujours disponible." },
    ],
  },
  custom: {
    appName: "Votre outil",
    nav: ["Planning", "Clients", "Interventions", "Documents"],
    cards: ["Planning du jour", "Suivi clients", "Interventions"],
    label: "Conçu pour votre métier",
  },
});

export const approach = frDeep({
  eyebrow: "04 — Notre approche",
  title: "Nous ne commençons pas par une solution. Nous commençons par *vous*.",
  subtitle:
    "Avant de parler d'intelligence artificielle, nous prenons le temps de comprendre votre activité, vos méthodes de travail et vos ambitions.",
  steps: [
    {
      number: "01",
      label: "Comprendre",
      title: "Audit gratuit de votre entreprise.",
      description: "Nous échangeons avec vous pour comprendre :",
      list: [
        "Votre activité",
        "Vos clients",
        "Vos méthodes de travail",
        "Vos outils numériques",
        "Vos difficultés",
        "Vos tâches répétitives",
        "Vos priorités",
      ],
      note: null,
    },
    {
      number: "02",
      label: "Identifier",
      title: "Détecter les opportunités concrètes.",
      description:
        "Nous analysons vos processus et recherchons les tâches qui pourraient être simplifiées, automatisées ou assistées par l'IA. Nous évaluons leur faisabilité, leur intérêt économique et leurs contraintes.",
      list: [],
      note: null,
    },
    {
      number: "03",
      label: "Recommander",
      title: "Un rapport d'audit gratuit et une proposition personnalisée.",
      description:
        "Nous synthétisons les opportunités identifiées. Lorsque cela est pertinent, nous vous proposons un projet adapté à votre entreprise, qui précise :",
      list: [
        "Le fonctionnement envisagé",
        "Les outils concernés",
        "Les bénéfices attendus",
        "Les limites et conditions de réussite",
        "Les coûts estimés",
        "Les étapes de réalisation",
      ],
      note: "Les gains éventuels sont présentés comme des estimations argumentées, jamais comme des résultats garantis.",
    },
    {
      number: "04",
      label: "Construire et accompagner",
      title: "De l'idée à son intégration.",
      description:
        "Après validation de la proposition, nous concevons, développons, testons et intégrons la solution dans votre environnement. Nous accompagnons sa prise en main et définissons avec vous les modalités de suivi adaptées au projet.",
      list: [],
      note: null,
    },
  ] as {
    number: string;
    label: string;
    title: string;
    description: string;
    list: string[];
    note: string | null;
  }[],
  visuals: {
    understand: { title: "Carnet d'audit", status: "Échange en cours" },
    identify: {
      title: "Cartographie des processus",
      process: ["Demande", "Devis", "Planning", "Intervention", "Facture"],
      opportunity: "Opportunités repérées",
      criteria: ["Faisabilité", "Intérêt économique", "Contraintes"],
    },
    recommend: { title: "Rapport d'audit", badge: "Estimation argumentée", status: "Gratuit" },
    build: {
      title: "Mise en œuvre",
      stages: ["Conception", "Développement", "Tests", "Intégration", "Prise en main", "Suivi"],
    },
  },
  conclusion: "Une technologie adaptée à votre entreprise. *Jamais l'inverse.*",
});

export const transformation = frDeep({
  eyebrow: "05 — La transformation",
  title: "Moins d'opérations manuelles. Plus de temps pour *avancer*.",
  subtitle:
    "Prenons une situation simple : un client souhaite prendre rendez-vous. Voici comment le même parcours peut évoluer.",
  before: {
    label: "Aujourd'hui",
    caption: "Un processus fragmenté",
    steps: [
      { text: "Un client appelle.", tag: null },
      { text: "Personne ne répond.", tag: "Appel manqué" },
      { text: "Le client rappelle.", tag: "Effort pour le client" },
      { text: "Un collaborateur vérifie l'agenda.", tag: "Manuel" },
      { text: "Il saisit les informations.", tag: "Ressaisie" },
      { text: "Il envoie une confirmation.", tag: "Manuel" },
    ],
    summary:
      "Dans ce scénario : un appel manqué, deux appels pour le client et trois opérations manuelles.",
  },
  after: {
    label: "Avec un agent IA",
    caption: "Un processus assisté",
    steps: [
      { text: "Le client appelle.", tag: null },
      { text: "Un agent IA prend en charge sa demande.", tag: "Prise en charge" },
      { text: "Il consulte les disponibilités.", tag: "Agenda connecté" },
      {
        text: "Il prépare ou confirme le rendez-vous selon les règles définies.",
        tag: "Vos règles",
      },
      { text: "Les outils sont synchronisés.", tag: "Automatique" },
      { text: "Une confirmation est envoyée.", tag: "Envoyée" },
    ],
    summary:
      "Dans ce scénario : aucune ressaisie, et une validation humaine possible aux étapes que vous jugez sensibles.",
  },
  tabsLabel: "Comparer les deux parcours",
  note: "Illustration d'un scénario type. Chaque situation est étudiée au cas par cas lors de l'audit.",
});

export const realisation = frDeep({
  eyebrow: "06 — Réalisation",
  title: "Des idées qui deviennent des *outils*.",
  intro:
    "Concevoir des outils opérationnels, utilisés au quotidien par des professionnels : c'est aussi notre métier.",
  label: "Une création Businessister",
  name: "SuperCalendar",
  description:
    "Une solution de gestion des rendez-vous et de suivi client conçue pour les professionnels du ramonage, utilisée par plusieurs professionnels en France.",
  features: ["Prise de rendez-vous", "Suivi client", "Rappels automatisés"],
  link: "Découvrir SuperCalendar",
  caption: "Représentation illustrative de l'interface.",
  mock: {
    week: "Semaine en cours",
    days: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
    events: [
      { day: 0, start: 1, span: 2, label: "Ramonage", tone: "amber" },
      { day: 1, start: 3, span: 2, label: "Entretien poêle", tone: "aqua" },
      { day: 2, start: 0, span: 2, label: "Ramonage", tone: "amber" },
      { day: 2, start: 4, span: 1, label: "Visite", tone: "lilac" },
      { day: 3, start: 2, span: 2, label: "Débistrage", tone: "aqua" },
      { day: 4, start: 1, span: 1, label: "Ramonage", tone: "amber" },
      { day: 4, start: 3, span: 2, label: "Entretien", tone: "lilac" },
    ],
    booking: "Nouveau rendez-vous",
    slots: ["09:00", "10:30", "14:00", "15:30"],
    reminder: "Rappel envoyé",
    reminderDetail: "Rendez-vous demain à 9 h",
    client: "Fiche client mise à jour",
  },
});

export const trust = frDeep({
  eyebrow: "07 — Confiance",
  title: "L'innovation n'a de valeur que lorsqu'elle inspire *confiance*.",
  subtitle:
    "Intégrer l'IA dans une entreprise implique des responsabilités. Nous les prenons en compte dès la conception.",
  core: "Vos données",
  items: [
    {
      key: "confidentialite",
      title: "Confidentialité",
      layer: "Accès maîtrisés",
      description:
        "Nous prenons en compte la sensibilité de vos données professionnelles et définissons, pour chaque projet, les mesures de protection adaptées.",
    },
    {
      key: "rgpd",
      title: "RGPD",
      layer: "Traitements définis",
      description:
        "Les exigences de protection des données sont intégrées dès la conception, selon les responsabilités et obligations applicables à chaque projet.",
    },
    {
      key: "controle",
      title: "Contrôle humain",
      layer: "Validation humaine",
      description:
        "Des validations humaines sont prévues lorsque les opérations le nécessitent. Les décisions importantes restent les vôtres.",
    },
    {
      key: "fiabilite",
      title: "Fiabilité",
      layer: "Supervision",
      description:
        "Nous concevons des automatisations testées, supervisables et adaptées aux contraintes réelles de votre entreprise.",
    },
  ],
});

export const vision = frDeep({
  eyebrow: "08 — Vision",
  title: "Votre prochaine évolution commence peut-être par une simple idée.",
  paragraphs: [
    "Une tâche qui vous fait perdre du temps. Un processus trop complexe. Une idée que vous n'avez jamais pu concrétiser.",
    "Parlons-en. Nous étudierons ensemble ce que la technologie peut réellement changer.",
  ],
  signature: "Moins de tâches répétitives. Plus de temps pour l'essentiel.",
});

export const audit = frDeep({
  eyebrow: "09 — Audit gratuit",
  title: "Et si nous parlions de votre *entreprise* ?",
  subtitle:
    "Un premier échange pour comprendre vos besoins, identifier des opportunités et envisager des solutions concrètes. Gratuitement et sans engagement.",
  stepsTitle: "Comment se déroule l'audit",
  steps: [
    {
      title: "Vous nous présentez votre activité",
      text: "Quelques informations suffisent pour préparer notre premier échange.",
    },
    {
      title: "Nous analysons vos processus",
      text: "Nous identifions avec vous les tâches qui pourraient être simplifiées.",
    },
    {
      title: "Vous recevez votre rapport d'audit",
      text: "Accompagné, lorsque c'est pertinent, d'une proposition personnalisée.",
    },
  ],
  assurances: [
    "Gratuit et sans engagement",
    "Aucune obligation de donner suite",
    "Informations utilisées uniquement pour votre demande",
  ],
});
