import { frDeep } from "@/lib/typography";

/** Contenus des pages « Notre approche », « Solutions », « Contact » et 404. */

export const approachPage = frDeep({
  meta: {
    title: "Notre approche : de l'audit gratuit à l'intégration de l'IA",
    description:
      "Comprendre, identifier, recommander, construire : découvrez la démarche Businessister pour intégrer l'intelligence artificielle dans votre entreprise, à partir d'un audit gratuit et sans engagement.",
  },
  title: "Comprendre avant de *construire*.",
  principlesTitle: "Nos *principes*",
  principles: [
    {
      title: "Le problème avant la technologie",
      text: "Nous ne vendons pas une technologie. Nous cherchons à résoudre un problème.",
    },
    {
      title: "Des solutions utiles et mesurables",
      text: "Chaque recommandation s'appuie sur un intérêt concret pour votre activité, estimé et argumenté.",
    },
    {
      title: "La transparence sur les limites",
      text: "Toute idée n'est pas automatiquement réalisable. Nous vous le disons clairement, et nous expliquons pourquoi.",
    },
    {
      title: "Une intégration progressive",
      text: "Nous privilégions des étapes maîtrisées, qui s'intègrent à vos outils et à vos habitudes de travail.",
    },
    {
      title: "L'humain garde la main",
      text: "Les décisions importantes restent les vôtres. Des validations humaines sont prévues là où elles sont nécessaires.",
    },
  ],
  stepsTitle: "De l'audit à l'*intégration*",
  stepLabels: {
    does: "Ce que nous faisons",
    gets: "Ce que vous obtenez",
    you: "Votre implication",
  },
  steps: [
    {
      number: "01",
      title: "Audit gratuit de votre entreprise",
      does: "Un échange pour découvrir votre activité, vos clients, vos méthodes de travail, vos outils numériques, vos difficultés, vos tâches répétitives et vos priorités.",
      gets: "Une vision partagée de votre fonctionnement et de vos attentes.",
      you: "Un échange avec vous et, si vous le souhaitez, avec les personnes concernées par les tâches étudiées.",
    },
    {
      number: "02",
      title: "Détecter les opportunités concrètes",
      does: "L'analyse de vos processus pour repérer les tâches qui pourraient être simplifiées, automatisées ou assistées par l'IA, puis l'évaluation de leur faisabilité, de leur intérêt économique et de leurs contraintes.",
      gets: "Une liste d'opportunités concrètes et hiérarchisées.",
      you: "Quelques précisions sur vos outils et vos méthodes, si nécessaire.",
    },
    {
      number: "03",
      title: "Un rapport d'audit et une proposition personnalisée",
      does: "La synthèse des opportunités identifiées dans un rapport d'audit gratuit et, lorsque cela est pertinent, une proposition de projet adaptée à votre entreprise.",
      gets: "Un rapport clair et, le cas échéant, une proposition détaillant le fonctionnement envisagé, les outils concernés, les bénéfices attendus, les limites et conditions de réussite, les coûts estimés et les étapes de réalisation.",
      you: "Vous décidez librement de la suite à donner.",
    },
    {
      number: "04",
      title: "De l'idée à son intégration",
      does: "La conception, le développement, les tests et l'intégration de la solution dans votre environnement, puis l'accompagnement à sa prise en main.",
      gets: "Une solution opérationnelle, intégrée à vos outils, et des modalités de suivi définies avec vous.",
      you: "Votre validation aux étapes clés du projet.",
    },
  ],
  reportTitle: "Le rapport d'*audit*",
  reportItems: [
    "Une synthèse de votre fonctionnement actuel",
    "Les tâches et processus qui pourraient être simplifiés",
    "Les opportunités les plus pertinentes, hiérarchisées",
    "Les limites, contraintes et conditions de réussite identifiées",
    "Lorsque cela est pertinent, une proposition de projet personnalisée et chiffrée",
  ],
  estimateNote:
    "Les bénéfices sont présentés comme des estimations argumentées, jamais comme des résultats garantis.",
  faqTitle: "Questions *fréquentes*",
  faq: [
    {
      question: "L'audit est-il vraiment gratuit ?",
      answer:
        "Oui. L'audit et le rapport qui l'accompagne sont gratuits et sans engagement. Si une proposition vous est faite, vous restez libre d'y donner suite ou non.",
    },
    {
      question: "Faut-il des connaissances techniques ?",
      answer:
        "Non. Nous partons de votre activité et de vos difficultés, pas de la technologie. Chaque recommandation est expliquée simplement.",
    },
    {
      question: "Devrai-je changer mes logiciels ?",
      answer:
        "Pas nécessairement. Nous privilégions l'intégration avec vos outils existants lorsque c'est possible. Si un outil sur mesure est plus adapté, nous vous expliquons pourquoi.",
    },
    {
      question: "Toutes les tâches peuvent-elles être automatisées ?",
      answer:
        "Non, et ce n'est pas l'objectif. Certaines tâches gagnent à être automatisées, d'autres à être simplement assistées, d'autres encore doivent rester entièrement humaines. L'audit sert précisément à faire la différence.",
    },
    {
      question: "Comment nos données sont-elles prises en compte ?",
      answer:
        "La confidentialité de vos informations est intégrée dès la conception. Les mesures de protection et les obligations liées au RGPD sont définies pour chaque projet, selon la nature des données traitées.",
    },
    {
      question: "Mon entreprise est-elle trop petite pour ce type de démarche ?",
      answer:
        "Non. Notre démarche s'adresse aussi bien aux artisans et aux PME qu'aux structures plus importantes. Ce qui compte, c'est l'intérêt concret d'une solution pour votre activité.",
    },
  ],
  cta: {
    title: "Commençons par *votre entreprise*.",
    secondary: "Découvrir nos solutions",
  },
});

export const solutionsPage = frDeep({
  meta: {
    title: "Solutions d'intelligence artificielle pour les entreprises",
    description:
      "Agents IA, agents téléphoniques et conversationnels, automatisation des processus, intégration de l'IA à vos logiciels et outils sur mesure : les domaines d'intervention de Businessister.",
  },
  title: "Des solutions d'IA *sur mesure*.",
  domainsTitle: "Nos domaines d'*intervention*",
  examplesLabel: "Exemples d'applications",
  domains: [
    {
      icon: "sparkles",
      title: "Intelligence artificielle générative",
      text: "Rédaction assistée, synthèse de documents, recherche dans vos contenus internes : l'IA générative peut alléger de nombreuses tâches, à condition d'être encadrée et adaptée à vos usages.",
      examples: [
        "Synthèse de comptes rendus et de documents",
        "Assistant de rédaction aligné sur votre ton",
        "Recherche dans votre documentation interne",
      ],
    },
    {
      icon: "workflow",
      title: "Agents IA autonomes et semi-autonomes",
      text: "Des agents capables d'enchaîner plusieurs actions — analyser une demande, consulter vos outils, préparer une réponse — avec le niveau d'autonomie que vous choisissez et des validations humaines aux étapes clés.",
      examples: [
        "Qualification des demandes entrantes",
        "Préparation de dossiers",
        "Suivi de tâches récurrentes",
      ],
    },
    {
      icon: "phone",
      title: "Agents conversationnels et téléphoniques",
      text: "Des assistants qui répondent à vos clients par téléphone, sur votre site ou par message, comprennent leurs demandes et les orientent, y compris lorsque vous n'êtes pas disponible.",
      examples: [
        "Accueil téléphonique et prise de rendez-vous",
        "Réponses aux questions fréquentes",
        "Orientation vers le bon interlocuteur",
      ],
    },
    {
      icon: "repeat",
      title: "Automatisation des processus métiers",
      text: "Relances, confirmations, mises à jour, transferts de données : nous automatisons les enchaînements répétitifs pour fiabiliser vos opérations au quotidien.",
      examples: [
        "Relances de devis et de factures",
        "Confirmations et rappels de rendez-vous",
        "Traitement des formulaires entrants",
      ],
    },
    {
      icon: "plug",
      title: "Intégration de l'IA à vos logiciels",
      text: "Plutôt que de tout remplacer, nous connectons l'IA à vos outils existants — CRM, agenda, messagerie, facturation — lorsque leurs possibilités techniques le permettent.",
      examples: [
        "Connexion entre vos logiciels",
        "Mise à jour automatique de vos données",
        "Assistants intégrés à vos outils",
      ],
    },
    {
      icon: "layout",
      title: "Développement d'outils sur mesure",
      text: "Lorsqu'aucun logiciel existant ne répond correctement à votre besoin, nous concevons un outil dédié, pensé pour votre métier et pour celles et ceux qui l'utilisent.",
      examples: ["Applications métiers", "Portails clients", "Tableaux de bord opérationnels"],
    },
    {
      icon: "route",
      title: "Optimisation des processus",
      text: "Avant d'automatiser, il faut parfois simplifier. Nous vous aidons à clarifier vos méthodes de travail pour que la technologie s'appuie sur des bases solides.",
      examples: [
        "Cartographie de vos processus",
        "Identification des points de friction",
        "Hiérarchisation des chantiers",
      ],
    },
  ] as { icon: string; title: string; text: string; examples: string[] }[],
  showcase: {
    title: "SuperCalendar, notre logiciel déjà adopté par des *ramoneurs*.",
    link: "Découvrir SuperCalendar",
  },
  audienceTitle: "Pour quelles *entreprises* ?",
  audiences: [
    {
      title: "Artisans et TPE",
      text: "Moins de temps au téléphone et dans l'administratif, plus de temps sur le terrain.",
    },
    {
      title: "PME",
      text: "Des processus plus fluides entre vos équipes, vos outils et vos clients.",
    },
    {
      title: "Professions libérales",
      text: "Une organisation allégée pour vous concentrer sur votre expertise.",
    },
    {
      title: "Entreprises plus importantes",
      text: "Des projets ciblés, intégrés à votre système d'information et à vos contraintes.",
    },
  ],
  criteriaTitle: "Comment nous choisissons la *bonne solution*",
  criteria: [
    { title: "Utile", text: "Elle répond à un problème réel, identifié avec vous." },
    { title: "Réaliste", text: "Elle est faisable avec vos outils et vos contraintes." },
    { title: "Mesurable", text: "Ses bénéfices attendus sont estimés et argumentés." },
    { title: "Maîtrisée", text: "Vous gardez la main sur les décisions importantes." },
  ],
  cta: {
    title: "Une tâche qui vous pèse ? *Parlons-en.*",
    secondary: "Découvrir notre approche",
  },
});

export const contactPage = frDeep({
  meta: {
    title: "Contact et demande d'audit gratuit",
    description:
      "Demandez votre audit gratuit et sans engagement : un premier échange pour comprendre vos besoins, identifier des opportunités et envisager des solutions d'IA concrètes.",
  },
  title: "Parlons de *votre entreprise*.",
  formTitle: "Demande d'audit *gratuit*",
  directTitle: "Nous écrire directement",
  nextTitle: "Après votre *demande*",
  assurances: ["Gratuit et sans engagement", "Aucune obligation de donner suite"],
  next: [
    "Nous revenons vers vous.",
    "Nous échangeons sur votre activité.",
    "Vous recevez votre rapport d'audit.",
  ],
});

export const notFoundPage = frDeep({
  title: "Cette page s'est *égarée*.",
  home: "Retour à l'accueil",
});
