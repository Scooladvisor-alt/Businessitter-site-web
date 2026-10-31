/**
 * Informations juridiques de l'éditeur — À COMPLÉTER avant la mise en ligne.
 *
 * Aucune information n'est inventée : chaque valeur `null` est affichée sur
 * les pages légales sous la forme d'un repère « À compléter », et un bandeau
 * signale que la page est en cours de finalisation tant que des informations
 * obligatoires manquent.
 */

export type LegalInfo = {
  /** Dénomination sociale ou nom de l'entrepreneur. */
  companyName: string | null;
  /** Forme juridique (SAS, SARL, EI, micro-entreprise…). */
  legalForm: string | null;
  /** Capital social (sociétés uniquement). */
  shareCapital: string | null;
  /** Adresse du siège social ou de l'établissement. */
  address: string | null;
  /** Immatriculation : RCS/RNE + numéro SIREN. */
  registration: string | null;
  /** Numéro de TVA intracommunautaire, s'il existe. */
  vatNumber: string | null;
  /** Directeur ou directrice de la publication. */
  publicationDirector: string | null;
  /** Adresse e-mail de contact. */
  email: string | null;
  /** Téléphone de contact. */
  phone: string | null;
  /** Adresse dédiée aux demandes relatives aux données personnelles. */
  privacyEmail: string | null;
  /** Durée de conservation des demandes d'audit sans suite. */
  prospectRetention: string | null;
  /** Hébergeur du site. */
  host: {
    name: string;
    website: string;
    /** Adresse postale de l'hébergeur (à reprendre des mentions de Vercel). */
    address: string | null;
  };
  /** Date de dernière mise à jour des pages légales. */
  lastUpdated: string;
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || null;

export const legalInfo: LegalInfo = {
  companyName: null,
  legalForm: null,
  shareCapital: null,
  address: null,
  registration: null,
  vatNumber: null,
  publicationDirector: null,
  email: contactEmail,
  phone: contactPhone,
  privacyEmail: contactEmail,
  prospectRetention: null,
  host: {
    name: "Vercel Inc.",
    website: "https://vercel.com",
    address: null,
  },
  lastUpdated: "31 octobre 2026",
};

/** Indique si des informations légales obligatoires restent à compléter. */
export const legalInfoIncomplete = [
  legalInfo.companyName,
  legalInfo.legalForm,
  legalInfo.address,
  legalInfo.registration,
  legalInfo.publicationDirector,
  legalInfo.email,
  legalInfo.host.address,
].some((value) => value === null);
