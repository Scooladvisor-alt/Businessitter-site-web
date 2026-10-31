import { frDeep } from "@/lib/typography";

/**
 * Contenus de la page d'accueil.
 * Convention : un segment entouré d'astérisques (*mot*) est mis en valeur
 * (réservé au titre principal) ; chaque entrée de `titleLines` est une
 * ligne animée du titre d'ouverture.
 */

export type SceneKey = "phone" | "mail" | "docs" | "ops" | "journey" | "custom";
export type TaskIcon =
  "phone" | "mail" | "file" | "copy" | "calendar" | "bell" | "voicemail" | "receipt";
export type TaskStatus = "auto" | "review";

export const hero = frDeep({
  titleLines: [
    "Et si votre entreprise",
    "pouvait faire *bien plus*,",
    "avec moins de contraintes ?",
  ],
  subtitle:
    "Des solutions d'intelligence artificielle sur mesure, pour libérer votre temps et simplifier vos opérations.",
});

export const problem = frDeep({
  title: "Votre entreprise mérite mieux que des tâches répétitives.",
  lead: "Appels, e-mails, devis, relances... Chaque jour, des heures disparaissent.",
  transition: "Et si tout cela pouvait fonctionner autrement ?",
  resolvedTitle: "Le répétitif est pris en charge. Les décisions restent les vôtres.",
  pending: "tâches en attente",
  pendingOne: "tâche en attente",
  resolved: { auto: "prises en charge", review: "à valider par vous" },
  statusLabels: { pending: "À traiter", auto: "Automatisé", review: "À valider" },
  tasks: [
    {
      icon: "phone",
      label: "Appel manqué",
      detail: "Pendant un rendez-vous",
      resolved: "Demande qualifiée",
      status: "auto",
    },
    {
      icon: "mail",
      label: "23 e-mails non lus",
      detail: "Dont plusieurs devis",
      resolved: "Triés et priorisés",
      status: "auto",
    },
    {
      icon: "file",
      label: "Devis à préparer",
      detail: "Avant vendredi",
      resolved: "Prêt à être validé",
      status: "review",
    },
    {
      icon: "copy",
      label: "Ressaisie",
      detail: "Du tableur à la facturation",
      resolved: "Données synchronisées",
      status: "auto",
    },
    {
      icon: "calendar",
      label: "Rendez-vous à caler",
      detail: "Trois créneaux sans réponse",
      resolved: "Créneau confirmé",
      status: "auto",
    },
    {
      icon: "bell",
      label: "Relance oubliée",
      detail: "Devis envoyé il y a 15 jours",
      resolved: "Relance envoyée",
      status: "auto",
    },
    {
      icon: "voicemail",
      label: "Message vocal",
      detail: "Un prospect à rappeler",
      resolved: "Résumé transmis",
      status: "review",
    },
    {
      icon: "receipt",
      label: "Facture à envoyer",
      detail: "Intervention terminée",
      resolved: "Générée, à valider",
      status: "review",
    },
  ] as { icon: TaskIcon; label: string; detail: string; resolved: string; status: TaskStatus }[],
});

export const possibilities = frDeep({
  title: "Imaginez. Nous étudions comment le rendre possible.",
  subtitle: "Chaque entreprise est différente. Ses possibilités aussi.",
  caption: "Illustration",
  useCases: [
    {
      key: "mail",
      tab: "E-mails",
      title: "Gestion intelligente des e-mails",
      description:
        "Les messages triés, les demandes identifiées, les réponses préparées selon vos règles.",
    },
    {
      key: "docs",
      tab: "Devis",
      title: "Devis et documents",
      description:
        "Les informations collectées, le document généré, puis soumis à votre validation.",
    },
    {
      key: "ops",
      tab: "Opérations",
      title: "Automatisation des opérations",
      description: "Vos logiciels synchronisés, vos données à jour, sans double saisie.",
    },
    {
      key: "journey",
      tab: "Relation client",
      title: "Relation client",
      description: "Confirmations, rappels, suivis et relances envoyés au bon moment.",
    },
    {
      key: "phone",
      tab: "Téléphone",
      title: "Accueil téléphonique",
      description: "Les appels pris en charge, les demandes qualifiées, les rendez-vous proposés.",
    },
    {
      key: "custom",
      tab: "Sur mesure",
      title: "Outils métiers sur mesure",
      description:
        "Une application pensée pour un besoin que les logiciels existants couvrent mal.",
    },
  ] as { key: SceneKey; tab: string; title: string; description: string }[],
  prompt: {
    title: "Et vous, qu'aimeriez-vous automatiser ?",
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
    note: "Nous l'étudierons avec vous lors de l'audit gratuit.",
    empty: "Décrivez d'abord une tâche, ou choisissez un exemple.",
    success: "C'est noté : votre besoin a été ajouté à votre demande d'audit.",
  },
  conclusion: "Votre entreprise est unique. Votre solution doit l'être aussi.",
});

export const scenes = frDeep({
  phone: {
    caller: "Appel entrant",
    number: "06 •• •• •• 42",
    agent: "Assistant — en ligne",
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
  title: "Nous ne commençons pas par une solution. Nous commençons par vous.",
  subtitle: "Avant de parler de technologie, nous prenons le temps de comprendre votre activité.",
  steps: [
    {
      title: "Comprendre",
      text: "Un audit gratuit de votre activité, de vos outils et de vos priorités.",
    },
    {
      title: "Identifier",
      text: "Les tâches qui peuvent être simplifiées, automatisées ou assistées.",
    },
    {
      title: "Recommander",
      text: "Un rapport clair, des estimations argumentées et, si c'est pertinent, une proposition sur mesure.",
    },
    {
      title: "Construire",
      text: "Conception, intégration, tests, puis accompagnement à la prise en main.",
    },
  ],
  conclusion: "Une technologie adaptée à votre entreprise. Jamais l'inverse.",
});

export const transformation = frDeep({
  title: "Moins d'opérations manuelles. Plus de temps pour avancer.",
  days: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
  labels: {
    mail: "E-mails",
    input: "Saisie",
    followup: "Relances",
    quote: "Devis",
    schedule: "Agenda",
    clients: "Clients",
    field: "Terrain",
    projects: "Projets",
    team: "Équipe",
  },
  legend: {
    repetitive: "Tâches répétitives",
    automated: "Prises en charge",
    valuable: "Temps pour l'essentiel",
  },
  description:
    "Illustration : au fil du défilement, le temps consacré aux tâches répétitives se réduit au profit du temps consacré aux clients, au terrain et aux projets.",
});

export const realisation = frDeep({
  title: "Des idées qui deviennent des outils.",
  label: "Une création Businessister",
  name: "SuperCalendar",
  description:
    "Une solution de gestion des rendez-vous et de suivi client conçue pour les professionnels du ramonage, utilisée par plusieurs professionnels en France.",
  features: ["Prise de rendez-vous", "Suivi client", "Rappels automatisés"],
  link: "Découvrir SuperCalendar",
  caption: "Représentation illustrative de l'interface",
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
  title: "L'innovation n'a de valeur que lorsqu'elle inspire confiance.",
  core: "Vos données",
  items: [
    {
      key: "confidentialite",
      title: "Confidentialité",
      layer: "Accès maîtrisés",
      description: "Des mesures de protection adaptées à la sensibilité de vos données.",
    },
    {
      key: "rgpd",
      title: "RGPD",
      layer: "Traitements définis",
      description: "La protection des données intégrée dès la conception de chaque projet.",
    },
    {
      key: "controle",
      title: "Contrôle humain",
      layer: "Validation humaine",
      description: "Des validations humaines là où les décisions le nécessitent.",
    },
    {
      key: "fiabilite",
      title: "Fiabilité",
      layer: "Supervision",
      description: "Des automatisations testées, supervisées et adaptées à votre réalité.",
    },
  ],
});

export const vision = frDeep({
  title: "Votre prochaine évolution commence peut-être par une simple idée.",
  paragraphs: [
    "Une tâche qui vous fait perdre du temps. Un processus trop complexe. Une idée jamais concrétisée.",
    "Parlons-en.",
  ],
});

export const audit = frDeep({
  title: "Et si nous parlions de votre entreprise ?",
  subtitle:
    "Un premier échange, gratuit et sans engagement, pour identifier ce qui peut réellement changer.",
  steps: [
    "Vous présentez votre activité",
    "Nous analysons vos processus",
    "Vous recevez votre rapport d'audit",
  ],
});
