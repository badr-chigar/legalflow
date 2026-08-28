/** Articles de démonstration pour /guides (contenu fictif, non juridique). */

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingMinutes: number;
  body: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: "sarl-ou-sas-comment-choisir",
    title: "SARL ou SAS : comment choisir la forme de sa société",
    excerpt:
      "Gouvernance, entrée d’associés, régime social du dirigeant : les critères qui font pencher la balance.",
    date: "2026-07-30",
    readingMinutes: 6,
    body: [
      "Le choix entre SARL et SAS structure la vie de la société pour des années. La SARL offre un cadre légal détaillé qui rassure les projets à plusieurs associés proches ; la SAS laisse aux statuts le soin d’organiser la gouvernance, ce qui convient aux tours de table successifs.",
      "Le régime social du dirigeant diffère : le gérant majoritaire de SARL relève du régime des indépendants, le président de SAS est assimilé salarié. Cette différence pèse sur le coût des cotisations et sur la couverture.",
      "Pour un premier projet sans levée de fonds prévue, la SARL suffit dans la plupart des cas. Dès qu’une entrée d’investisseurs est envisagée, la souplesse de la SAS devient un atout.",
      "Dans tous les cas, la forme peut être adaptée par la suite ; mieux vaut cependant partir sur des statuts cohérents avec le projet à deux ou trois ans.",
    ],
  },
  {
    slug: "certificat-negatif-mode-demploi",
    title: "Le certificat négatif, mode d’emploi",
    excerpt:
      "Ce document réserve votre dénomination. Voici ce qu’il couvre, sa durée de validité et les erreurs à éviter.",
    date: "2026-07-12",
    readingMinutes: 4,
    body: [
      "Le certificat négatif atteste qu’une dénomination n’est pas déjà utilisée ou protégée. Il conditionne le dépôt du dossier d’immatriculation.",
      "Sa validité est limitée dans le temps : passé ce délai sans immatriculation, la réservation tombe et la démarche doit être refaite.",
      "Les refus les plus fréquents portent sur des noms trop proches d’une marque existante ou sur des termes réglementés. Prévoir deux ou trois variantes fait gagner du temps.",
    ],
  },
  {
    slug: "capital-social-combien-mettre",
    title: "Capital social : combien mettre à la création ?",
    excerpt:
      "Il n’existe pas de minimum légal pour une SARL ou une SAS, mais le montant envoie un signal.",
    date: "2026-06-28",
    readingMinutes: 5,
    body: [
      "Aucun minimum n’est imposé pour la SARL et la SAS. Un capital d’un dirham est juridiquement possible mais rarement pertinent.",
      "Le capital sert de première réserve de trésorerie et de repère pour les partenaires : banques, bailleurs et fournisseurs le consultent.",
      "Un montant cohérent avec les besoins des premiers mois — quelques dizaines de milliers de dirhams pour une activité de services — constitue un point d’équilibre courant.",
      "Le capital peut être libéré partiellement à la constitution, le solde étant appelé plus tard selon les statuts.",
    ],
  },
  {
    slug: "creer-sa-societe-depuis-l-etranger",
    title: "Créer sa société au Maroc depuis l’étranger",
    excerpt:
      "Procuration, signature à distance, compte bancaire : le parcours pour les non-résidents.",
    date: "2026-06-05",
    readingMinutes: 7,
    body: [
      "La création à distance repose sur une procuration donnée à un mandataire local, qui dépose le dossier au greffe pour votre compte.",
      "La signature des actes se fait électroniquement ; les pièces sont horodatées et opposables.",
      "L’ouverture du compte bancaire professionnel demande souvent une visioconférence avec la banque et l’envoi de justificatifs certifiés.",
      "La domiciliation résout la question de l’adresse du siège tant qu’aucun local n’est loué sur place.",
    ],
  },
  {
    slug: "apres-l-immatriculation-les-obligations",
    title: "Après l’immatriculation : les premières obligations",
    excerpt:
      "Registre du commerce obtenu, la société doit encore tenir quelques rendez-vous administratifs.",
    date: "2026-05-20",
    readingMinutes: 5,
    body: [
      "Une fois le registre du commerce délivré, la société existe et peut facturer. Restent des formalités récurrentes à ne pas manquer.",
      "Les déclarations fiscales périodiques et les cotisations sociales démarrent dès le premier exercice, même en l’absence de chiffre d’affaires.",
      "La tenue des assemblées et le dépôt des comptes annuels structurent la vie juridique : un secrétariat juridique évite les oublis.",
      "Conserver l’ensemble des actes dans un espace unique facilite les contrôles et les demandes de financement.",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
