import { fr, frDeep } from "@/lib/typography";

/**
 * Configuration générale du site.
 * Les coordonnées affichées sont lues depuis les variables d'environnement
 * publiques (voir .env.example) : rien n'est inventé si elles sont absentes.
 */

function normalizeUrl(value: string | undefined): string {
  const url = (value ?? "").trim().replace(/\/+$/, "");
  return url || "https://businessister.com";
}

export const site = {
  name: "Businessister",
  domain: "businessister.com",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "fr_FR",
  language: "fr-FR",
  title: fr(
    "Businessister — Intégration d'intelligence artificielle sur mesure pour les entreprises",
  ),
  description: fr(
    "Businessister imagine, développe et intègre des solutions d'intelligence artificielle sur mesure : agents IA, agents téléphoniques, automatisation des processus et outils métiers. Audit gratuit et sans engagement.",
  ),
  tagline: fr("L'intelligence artificielle doit s'adapter à votre entreprise. Pas l'inverse."),
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || null,
  },
  /** Date de dernière mise à jour des contenus (plan du site). */
  updatedAt: "2026-10-31",
  /** Réalisation présentée sur la page d'accueil (URL à valider). */
  superCalendarUrl: process.env.NEXT_PUBLIC_SUPERCALENDAR_URL?.trim() || "https://supercalendar.fr",
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: readonly NavItem[] = frDeep([
  { label: "Notre approche", href: "/approche" },
  { label: "Solutions", href: "/solutions" },
  { label: "Réalisation", href: "/#realisation" },
  { label: "Contact", href: "/contact" },
]);

export const legalNav: readonly NavItem[] = frDeep([
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "Gestion des cookies", href: "/cookies" },
]);

export const footerNav: readonly NavItem[] = frDeep([
  { label: "Accueil", href: "/" },
  { label: "Notre approche", href: "/approche" },
  { label: "Solutions", href: "/solutions" },
  { label: "Réalisation", href: "/#realisation" },
  { label: "Contact", href: "/contact" },
]);

export const cta = frDeep({
  primary: "Demander mon audit gratuit",
  secondary: "Découvrir notre approche",
  short: "Audit gratuit",
});

/** Chapitres de la page d'accueil (indicateur de progression). */
export const chapters = frDeep([
  { id: "accueil", label: "Accueil" },
  { id: "constat", label: "Le constat" },
  { id: "possibles", label: "Les possibles" },
  { id: "approche", label: "Notre approche" },
  { id: "transformation", label: "La transformation" },
  { id: "realisation", label: "Réalisation" },
  { id: "confiance", label: "Confiance" },
  { id: "vision", label: "Vision" },
  { id: "audit", label: "Audit gratuit" },
]);
