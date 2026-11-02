import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";
const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

/**
 * Content Security Policy (sans nonce, compatible avec le rendu statique).
 * Les domaines Google Analytics ne sont autorisés que si un identifiant de
 * mesure est configuré ; les scripts ne sont de toute façon chargés qu'après
 * consentement explicite (voir src/components/consent).
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
  // Vercel Web Analytics : servi par le site lui-même en production
  // (/_vercel/insights/script.js) ; script de débogage externe en développement.
  isDev ? "https://va.vercel-scripts.com" : "",
  analyticsEnabled ? "https://www.googletagmanager.com" : "",
  isPreview ? "https://vercel.live" : "",
];

const connectSrc = [
  "'self'",
  analyticsEnabled
    ? "https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com"
    : "",
  isPreview ? "https://vercel.live wss://ws-us3.pusher.com" : "",
];

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc.filter(Boolean).join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${analyticsEnabled ? " https://*.google-analytics.com https://www.googletagmanager.com" : ""}${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
  "font-src 'self'",
  `connect-src ${connectSrc.filter(Boolean).join(" ")}`,
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
