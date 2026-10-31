import { NextResponse } from "next/server";
import {
  AUDIT_ERRORS,
  MAX_FILL_TIME_MS,
  MIN_FILL_TIME_MS,
  sanitizeAudit,
  validateAudit,
  type AuditErrorCode,
  type AuditFieldErrors,
  type AuditResponse,
} from "@/lib/audit";
import { deliverAuditRequest, getDeliveryChannels } from "@/lib/server/delivery";
import { rateLimit } from "@/lib/server/rate-limit";

const MAX_BODY_BYTES = 16 * 1024;

function fail(
  status: number,
  code: AuditErrorCode,
  extra: { errors?: AuditFieldErrors; headers?: HeadersInit; contactEmail?: string | null } = {},
) {
  const body: AuditResponse = {
    ok: false,
    code,
    message: AUDIT_ERRORS[code],
    ...(extra.errors ? { errors: extra.errors } : {}),
    ...(extra.contactEmail ? { contactEmail: extra.contactEmail } : {}),
  };
  return NextResponse.json(body, { status, headers: extra.headers });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "inconnu";
}

/**
 * Réception d'une demande d'audit gratuit.
 * La demande n'est confirmée au visiteur que si elle a réellement été
 * transmise par au moins un canal configuré (e-mail ou webhook).
 */
export async function POST(request: Request) {
  // Requêtes provenant d'un autre site : refusées.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return fail(403, "rejected");
    } catch {
      return fail(403, "rejected");
    }
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "bad_request");
  }

  const limit = rateLimit(`audit:${clientIp(request)}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return fail(429, "rate_limited", {
      headers: { "Retry-After": String(limit.retryAfterSeconds) },
    });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail(400, "bad_request");
  }
  if (raw.length > MAX_BODY_BYTES) return fail(413, "bad_request");

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fail(400, "bad_request");
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "bad_request");
  }

  // Protection antispam : champ piège et délai de remplissage.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return fail(400, "rejected");
  }
  const startedAt = Number(payload.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || startedAt <= 0 || elapsed < -60_000) {
    return fail(400, "rejected");
  }
  if (elapsed < MIN_FILL_TIME_MS) return fail(400, "too_fast");
  if (elapsed > MAX_FILL_TIME_MS) return fail(400, "expired");

  const result = validateAudit(sanitizeAudit(payload));
  if (!result.ok) return fail(422, "validation", { errors: result.errors });

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;

  if (getDeliveryChannels().length === 0) {
    console.error(
      "[audit] Aucun canal de transmission configuré (RESEND_API_KEY/AUDIT_EMAIL_TO/AUDIT_EMAIL_FROM ou AUDIT_WEBHOOK_URL). La demande n'a pas été transmise.",
    );
    return fail(503, "not_configured", { contactEmail });
  }

  const { delivered } = await deliverAuditRequest(result.data, {
    submittedAt: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
    source: request.headers.get("referer") ?? "businessister.com",
  });

  if (delivered === 0) return fail(502, "delivery_failed", { contactEmail });

  const ok: AuditResponse = { ok: true };
  return NextResponse.json(ok, { status: 200 });
}
