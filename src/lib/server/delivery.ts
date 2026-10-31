import { createHmac } from "node:crypto";
import type { AuditFields } from "@/lib/audit";

/**
 * Transmission des demandes d'audit.
 *
 * Deux canaux configurables par variables d'environnement (voir README) :
 *  - e-mail via l'API Resend : RESEND_API_KEY, AUDIT_EMAIL_TO, AUDIT_EMAIL_FROM ;
 *  - webhook HTTP (Make, Zapier, n8n, CRM…) : AUDIT_WEBHOOK_URL,
 *    AUDIT_WEBHOOK_SECRET (facultatif, signature HMAC SHA-256).
 *
 * Si aucun canal n'est configuré, la demande n'est PAS considérée comme
 * transmise : la route API répond par une erreur explicite.
 */

type Channel = {
  name: "email" | "webhook";
  send: (request: AuditFields, meta: DeliveryMeta) => Promise<void>;
};

export type DeliveryMeta = {
  submittedAt: string;
  source: string;
};

const TIMEOUT_MS = 10_000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rows(request: AuditFields): [string, string][] {
  return [
    ["Nom et prénom", request.name],
    ["Entreprise", request.company],
    ["E-mail", request.email],
    ["Téléphone", request.phone],
    ["Secteur d'activité", request.sector],
    ["Tâche à simplifier", request.message || "—"],
  ];
}

function emailChannel(): Channel | null {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.AUDIT_EMAIL_TO;
  const from = process.env.AUDIT_EMAIL_FROM;
  if (!apiKey || !to || !from) return null;

  return {
    name: "email",
    async send(request, meta) {
      const lines = rows(request);
      const text = [
        "Nouvelle demande d'audit gratuit",
        "",
        ...lines.map(([label, value]) => `${label} : ${value}`),
        "",
        `Reçue le ${meta.submittedAt} depuis ${meta.source}`,
      ].join("\n");

      const html = `<!doctype html><html lang="fr"><body style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5">
<h1 style="font-size:20px;margin:0 0 16px">Nouvelle demande d'audit gratuit</h1>
<table cellpadding="8" style="border-collapse:collapse;font-size:14px">${lines
        .map(
          ([label, value]) =>
            `<tr><th align="left" style="border-bottom:1px solid #eee;color:#555;font-weight:600;vertical-align:top">${escapeHtml(label)}</th><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}</table>
<p style="font-size:12px;color:#777;margin-top:20px">Reçue le ${escapeHtml(meta.submittedAt)} depuis ${escapeHtml(meta.source)}</p>
</body></html>`;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: to
            .split(",")
            .map((address) => address.trim())
            .filter(Boolean),
          reply_to: request.email,
          subject: `Demande d'audit — ${request.company}`,
          text,
          html,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Resend a répondu ${response.status} ${detail.slice(0, 300)}`);
      }
    },
  };
}

function webhookChannel(): Channel | null {
  const url = process.env.AUDIT_WEBHOOK_URL;
  if (!url) return null;
  const secret = process.env.AUDIT_WEBHOOK_SECRET;

  return {
    name: "webhook",
    async send(request, meta) {
      const body = JSON.stringify({
        type: "audit_request",
        submittedAt: meta.submittedAt,
        source: meta.source,
        data: {
          name: request.name,
          company: request.company,
          email: request.email,
          phone: request.phone,
          sector: request.sector,
          message: request.message,
          consent: request.consent,
        },
      });

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "Businessister-Site/1.0",
      };
      if (secret) {
        headers["X-Businessister-Signature"] =
          "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Le webhook a répondu ${response.status}`);
      }
    },
  };
}

export function getDeliveryChannels(): Channel[] {
  return [emailChannel(), webhookChannel()].filter(
    (channel): channel is Channel => channel !== null,
  );
}

/**
 * Envoie la demande sur tous les canaux configurés.
 * Retourne le nombre de canaux ayant réussi.
 */
export async function deliverAuditRequest(
  request: AuditFields,
  meta: DeliveryMeta,
): Promise<{ delivered: number; failed: string[] }> {
  const channels = getDeliveryChannels();
  const results = await Promise.allSettled(channels.map((channel) => channel.send(request, meta)));
  const failed: string[] = [];
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const name = channels[index]?.name ?? "inconnu";
      failed.push(name);
      console.error(`[audit] Échec de transmission (${name}) :`, result.reason);
    }
  });
  return { delivered: results.length - failed.length, failed };
}
