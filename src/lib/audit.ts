/**
 * Demande d'audit — schéma, validation et messages partagés
 * entre le formulaire (client) et la route API (serveur).
 */

import { fr } from "./typography";

export const SECTORS = [
  "Artisanat et bâtiment",
  "Commerce et distribution",
  "Services aux entreprises",
  "Professions libérales",
  "Santé et bien-être",
  "Immobilier",
  "Industrie et production",
  "Transport et logistique",
  "Hôtellerie et restauration",
  "Éducation et formation",
  "Association ou collectivité",
  "Autre secteur",
].map(fr);

export const LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  phone: 32,
  message: 2000,
} as const;

/** Délai minimal (ms) entre l'affichage du formulaire et son envoi. */
export const MIN_FILL_TIME_MS = 2500;
/** Durée de validité (ms) d'un formulaire affiché. */
export const MAX_FILL_TIME_MS = 1000 * 60 * 60 * 12;

export type AuditFields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  message: string;
  consent: boolean;
};

export type AuditFieldName = keyof AuditFields;
export type AuditFieldErrors = Partial<Record<AuditFieldName, string>>;

/** Corps JSON envoyé par le formulaire. */
export type AuditPayload = AuditFields & {
  /** Champ piège invisible : doit rester vide. */
  website: string;
  /** Horodatage (ms) de l'affichage du formulaire. */
  startedAt: number;
};

export type AuditErrorCode =
  | "validation"
  | "not_configured"
  | "rate_limited"
  | "too_fast"
  | "expired"
  | "rejected"
  | "delivery_failed"
  | "bad_request";

export type AuditResponse =
  | { ok: true }
  | {
      ok: false;
      code: AuditErrorCode;
      message: string;
      errors?: AuditFieldErrors;
      contactEmail?: string | null;
    };

export const AUDIT_MESSAGES = {
  name: fr("Indiquez votre nom et votre prénom."),
  company: fr("Indiquez le nom de votre entreprise."),
  email: fr("Indiquez une adresse e-mail valide, par exemple nom@entreprise.fr."),
  phone: fr("Indiquez un numéro de téléphone valide, par exemple 06 12 34 56 78."),
  sector: fr("Sélectionnez votre secteur d'activité."),
  message: fr(
    `Votre message ne doit pas dépasser ${LIMITS.message.toLocaleString("fr-FR")} caractères.`,
  ),
  consent: fr("Votre accord est nécessaire pour que nous puissions traiter votre demande."),
  tooLong: (max: number) => fr(`Ce champ ne doit pas dépasser ${max} caractères.`),
} as const;

export const AUDIT_ERRORS: Record<AuditErrorCode, string> = {
  validation: fr("Certains champs sont à compléter ou à corriger."),
  not_configured: fr(
    "Le service de réception des demandes n'est pas encore configuré : votre demande n'a pas pu être transmise.",
  ),
  rate_limited: fr(
    "Plusieurs demandes ont déjà été envoyées depuis votre connexion. Merci de réessayer dans quelques minutes.",
  ),
  too_fast: fr(
    "Votre demande a été envoyée un peu trop rapidement. Patientez quelques secondes, puis réessayez.",
  ),
  expired: fr("Ce formulaire a expiré. Rechargez la page, puis renouvelez votre demande."),
  rejected: fr("Votre demande n'a pas pu être validée. Rechargez la page, puis réessayez."),
  delivery_failed: fr(
    "Votre demande n'a pas pu être transmise en raison d'une erreur technique. Merci de réessayer dans quelques instants.",
  ),
  bad_request: fr("La demande reçue est invalide. Rechargez la page, puis réessayez."),
};

export const NETWORK_ERROR = fr(
  "La connexion a échoué. Vérifiez votre connexion internet, puis réessayez.",
);

const EMAIL_RE = /^[^\s@"<>()[\],;:]+@[^\s@"<>()[\],;:]+\.[^\s@"<>()[\],;:]{2,}$/;
const PHONE_RE = /^\+?[0-9]{8,15}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "").replace(/^00/, "+");
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Supprime les caractères de contrôle et normalise les espaces. */
function clean(value: unknown, multiline = false): string {
  const text = asString(value)
    .normalize("NFC")
    .replace(
      multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g,
      "",
    );
  return multiline
    ? text
        .replace(/\r\n?/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : text.replace(/\s+/g, " ").trim();
}

export function validateField(field: AuditFieldName, fields: AuditFields): string | undefined {
  switch (field) {
    case "name": {
      const v = fields.name;
      if (v.length < 2) return AUDIT_MESSAGES.name;
      if (v.length > LIMITS.name) return AUDIT_MESSAGES.tooLong(LIMITS.name);
      return undefined;
    }
    case "company": {
      const v = fields.company;
      if (v.length < 2) return AUDIT_MESSAGES.company;
      if (v.length > LIMITS.company) return AUDIT_MESSAGES.tooLong(LIMITS.company);
      return undefined;
    }
    case "email": {
      const v = fields.email;
      if (!v || v.length > LIMITS.email || !EMAIL_RE.test(v)) return AUDIT_MESSAGES.email;
      return undefined;
    }
    case "phone": {
      const v = fields.phone;
      if (!v || v.length > LIMITS.phone || !PHONE_RE.test(normalizePhone(v)))
        return AUDIT_MESSAGES.phone;
      return undefined;
    }
    case "sector":
      return SECTORS.includes(fields.sector) ? undefined : AUDIT_MESSAGES.sector;
    case "message":
      return fields.message.length > LIMITS.message ? AUDIT_MESSAGES.message : undefined;
    case "consent":
      return fields.consent === true ? undefined : AUDIT_MESSAGES.consent;
  }
}

export const AUDIT_FIELD_ORDER: AuditFieldName[] = [
  "name",
  "company",
  "email",
  "phone",
  "sector",
  "message",
  "consent",
];

/** Nettoie des données brutes (formulaire ou JSON) en champs typés. */
export function sanitizeAudit(input: Record<string, unknown>): AuditFields {
  return {
    name: clean(input.name),
    company: clean(input.company),
    email: clean(input.email).toLowerCase(),
    phone: clean(input.phone),
    sector: clean(input.sector),
    message: clean(input.message, true),
    consent: input.consent === true || input.consent === "on" || input.consent === "true",
  };
}

export function validateAudit(
  fields: AuditFields,
): { ok: true; data: AuditFields } | { ok: false; errors: AuditFieldErrors } {
  const errors: AuditFieldErrors = {};
  for (const field of AUDIT_FIELD_ORDER) {
    const error = validateField(field, fields);
    if (error) errors[field] = error;
  }
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data: fields };
}
