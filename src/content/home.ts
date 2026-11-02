import { frDeep } from "@/lib/typography";

/**
 * Contenus de la page d'accueil.
 * Convention : dans chaque titre, un segment entouré d'astérisques (*mot*)
 * est mis en valeur (italique à empattements, dégradé « aube ») ; chaque
 * entrée de `titleLines` est une ligne animée du titre d'ouverture.
 */

export type SceneKey = "phone" | "mail" | "docs" | "ops" | "journey" | "custom";
export type TaskIcon =
  | "phone"
  | "mail"
  | "file"
  | "copy"
  | "calendar"
  | "bell"
  | "voicemail"
  | "receipt"
  | "user"
  | "cart";
export type TaskStatus = "auto" | "review";

export const hero = frDeep({
  titleLines: ["Intégrez l'IA dans votre entreprise.", "Faites *plus avec moins*."],
});

export const problem = frDeep({
  title: "Votre entreprise mérite *mieux* que des tâches répétitives.",
  transition: "Et si tout cela pouvait fonctionner *autrement* ?",
  resolved: "Le répétitif est pris en charge.",
  resolvedAccent: "Les décisions restent *les vôtres*.",
  legend: { auto: "Pris en charge", review: "À valider par vous" },
  summary:
    "Illustration : un appel manqué devient une demande qualifiée, les e-mails sont triés, les données synchronisées, les rendez-vous confirmés et les relances envoyées. Les devis et les factures restent à valider par vous.",
  /** Le flot du quotidien (décor de la première partie). */
  noise: [
    { icon: "phone", label: "Appel manqué" },
    { icon: "mail", label: "23 e-mails non lus" },
    { icon: "file", label: "Demande de devis" },
    { icon: "bell", label: "Relance à faire" },
    { icon: "copy", label: "Ressaisie dans le tableur" },
    { icon: "calendar", label: "Rendez-vous à déplacer" },
    { icon: "voicemail", label: "Nouveau message vocal" },
    { icon: "receipt", label: "Facture à envoyer" },
    { icon: "user", label: "Fiche client à compléter" },
    { icon: "cart", label: "Commande à confirmer" },
    { icon: "mail", label: "Pièce jointe manquante" },
    { icon: "calendar", label: "Planning à refaire" },
  ] as { icon: TaskIcon; label: string }[],
  /** Le flux simplifié : à gauche à traiter, à droite pris en charge ou à valider. */
  flow: [
    { icon: "phone", from: "Appel manqué", to: "Demande qualifiée", status: "auto" },
    { icon: "mail", from: "E-mails non lus", to: "Triés et priorisés", status: "auto" },
    { icon: "file", from: "Devis à préparer", to: "Devis à valider", status: "review" },
    { icon: "copy", from: "Ressaisie", to: "Données synchronisées", status: "auto" },
    { icon: "calendar", from: "Rendez-vous à caler", to: "Créneau confirmé", status: "auto" },
    { icon: "bell", from: "Relance oubliée", to: "Relance envoyée", status: "auto" },
    { icon: "receipt", from: "Facture à envoyer", to: "Facture à valider", status: "review" },
  ] as { icon: TaskIcon; from: string; to: string; status: TaskStatus }[],
});

export const possibilities = frDeep({
  title: "Ce que l'IA peut faire *pour vous*.",
  caption: "Illustration",
  useCases: [
    { key: "mail", tab: "E-mails", title: "Vos e-mails, *triés* et préparés." },
    { key: "docs", tab: "Devis", title: "Vos devis, *prêts* à valider." },
    { key: "ops", tab: "Opérations", title: "Vos outils, *enfin* connectés." },
    { key: "journey", tab: "Relation client", title: "Vos clients, suivis *sans oubli*." },
    { key: "phone", tab: "Téléphone", title: "Vos appels, *pris en charge*." },
    { key: "custom", tab: "Sur mesure", title: "Un outil *pensé* pour votre métier." },
  ] as { key: SceneKey; tab: string; title: string }[],
  prompt: {
    title: "Et vous, qu'aimeriez\u2011vous *automatiser* ?",
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
    empty: "Décrivez d'abord une tâche, ou choisissez un exemple.",
    success: "C'est noté : votre besoin a été ajouté à votre demande d'audit.",
  },
  conclusion: "Votre entreprise est unique.\nVotre solution *aussi*.",
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
  title: "Nous commençons par *vous*.",
  steps: [
    { title: "Comprendre", text: "Un audit gratuit de votre activité." },
    { title: "Identifier", text: "Les tâches à simplifier." },
    { title: "Recommander", text: "Un rapport clair, une proposition." },
    { title: "Construire", text: "Intégration et accompagnement." },
  ],
  conclusion: "Vous gardez la main,\n*à chaque étape*.",
});

export const transformation = frDeep({
  title: "Moins de tâches manuelles.\n*Plus de temps.*",
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
  title: "Notre logiciel, déjà adopté par des *ramoneurs* en France.",
  name: "SuperCalendar",
  link: "Découvrir SuperCalendar",
});

export const about = frDeep({
  /** Première partie : le nom. */
  name: {
    title: "Businessitter, *qui veille* sur votre business.",
    pairs: [
      { word: "Baby-sitter", text: "garde vos enfants." },
      { word: "Dog-sitter", text: "s'occupe de votre chien." },
      { word: "Business*sitter*", text: "garde votre business à votre place." },
    ],
  },
  /** Seconde partie : le fondateur. */
  founder: {
    title: "Qui est *derrière* Businessitter ?",
    paragraphs: [
      "Je suis Antonin Silandre, fondateur de Businessitter et créateur de SuperCalendar. Passionné d'intelligence artificielle et d'automatisation, j'échange chaque jour avec des entrepreneurs : je sais repérer ce qui les freine, et proposer à chacun une solution vraiment adaptée.",
      "Ma priorité : votre satisfaction. Elle passe par un projet rentable — j'intègre des solutions pensées pour rapporter deux à trois fois leur coût, et apporter une vraie plus-value à votre entreprise.",
    ],
    signature: "Antonin Silandre",
    role: "Fondateur de Businessitter",
    /** Photo (dans /public). Tant que le fichier est absent, un monogramme s'affiche. */
    photo: "/brand/antonin-silandre.jpg",
    photoAlt: "Portrait d'Antonin Silandre, fondateur de Businessitter",
  },
});

export const trust = frDeep({
  title: "Une IA qui inspire *confiance*.",
  core: "Vos données",
  items: [
    {
      key: "confidentialite",
      title: "Confidentialité",
      layer: "Accès maîtrisés",
    },
    {
      key: "rgpd",
      title: "Démarche RGPD",
      layer: "Traitements définis",
    },
    {
      key: "controle",
      title: "Contrôle humain",
      layer: "Validation humaine",
    },
    {
      key: "fiabilite",
      title: "Fiabilité",
      layer: "Supervision",
    },
  ],
});

export const vision = frDeep({
  title: "Votre prochaine évolution commence peut-être par une *simple idée*.",
});

export const audit = frDeep({
  title: "Demandez votre audit *gratuit*.",
});
