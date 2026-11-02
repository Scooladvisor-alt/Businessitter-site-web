"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { CircleAlert, CircleCheck, LoaderCircle, Sparkles } from "lucide-react";
import {
  AUDIT_ERRORS,
  AUDIT_FIELD_ORDER,
  LIMITS,
  NETWORK_ERROR,
  SECTORS,
  sanitizeAudit,
  validateAudit,
  validateField,
  type AuditFieldErrors,
  type AuditFieldName,
  type AuditFields,
  type AuditResponse,
} from "@/lib/audit";
import { auditDraft } from "@/lib/audit-draft";
import { cn } from "@/lib/cn";
import { fr } from "@/lib/typography";
import { Button, SlidingArrow } from "@/components/ui/Button";

const copy = {
  required: fr("Tous les champs sont obligatoires, sauf le message."),
  name: { label: fr("Nom et prénom"), placeholder: fr("Prénom Nom") },
  company: { label: fr("Nom de l'entreprise"), placeholder: fr("Votre entreprise") },
  email: { label: fr("Adresse e-mail professionnelle"), placeholder: "nom@entreprise.fr" },
  phone: { label: fr("Téléphone"), placeholder: "06 12 34 56 78" },
  sector: { label: fr("Secteur d'activité"), placeholder: fr("Choisissez votre secteur") },
  message: {
    label: fr("Quelle tâche aimeriez-vous simplifier ?"),
    optional: fr("facultatif"),
    placeholder: fr(
      "Par exemple : la prise de rendez-vous, le traitement des demandes de devis, les relances...",
    ),
  },
  draftAdded: fr("Votre besoin a été ajouté à votre message."),
  consent: fr(
    "J'accepte que Businessitter utilise ces informations pour répondre à ma demande d'audit. Elles ne sont utilisées pour aucune autre finalité.",
  ),
  privacy: fr("Consulter la politique de confidentialité"),
  submit: fr("Demander mon audit gratuit"),
  submitting: fr("Envoi en cours..."),
  summaryTitle: fr("Votre demande n'a pas encore été envoyée."),
  successTitle: fr("Merci, votre demande a bien été transmise."),
  successText: fr(
    "Nous revenons vers vous pour convenir d'un premier échange. L'audit est gratuit et sans engagement.",
  ),
  again: fr("Envoyer une autre demande"),
  directContact: fr("Vous pouvez aussi nous écrire directement :"),
};

const EMPTY: AuditFields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  sector: "",
  message: "",
  consent: false,
};

type Status = "idle" | "submitting" | "success" | "error";

type AuditFormProps = {
  /** Préfixe unique des identifiants (plusieurs formulaires peuvent coexister). */
  idPrefix: string;
  className?: string;
};

export function AuditForm({ idPrefix, className }: AuditFormProps) {
  const [values, setValues] = useState<AuditFields>(EMPTY);
  const [errors, setErrors] = useState<AuditFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<{ message: string; email?: string | null } | null>(
    null,
  );
  const [draftNotice, setDraftNotice] = useState(false);
  const startedAt = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const id = (field: string) => `${idPrefix}-${field}`;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Pré-remplissage depuis « Et vous, qu'aimeriez-vous automatiser ? ».
  useEffect(() => {
    const apply = (text: string) => {
      if (!text) return;
      setValues((current) => {
        const existing = current.message.trim();
        if (existing.includes(text)) return current;
        const message = existing ? `${existing}\n${text}` : text;
        return { ...current, message: message.slice(0, LIMITS.message) };
      });
      setErrors((current) => ({ ...current, message: undefined }));
      setDraftNotice(true);
    };
    const unsubscribe = auditDraft.subscribe(apply);
    const initial = window.setTimeout(() => apply(auditDraft.get()), 0);
    return () => {
      window.clearTimeout(initial);
      unsubscribe();
    };
  }, []);

  const update = <K extends AuditFieldName>(field: K, value: AuditFields[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: validateField(field, sanitizeAudit(next)),
      }));
    }
  };

  const blur = (field: AuditFieldName) => {
    const value = values[field];
    if (typeof value === "string" && value.trim() === "" && !errors[field]) return;
    setErrors((previous) => ({
      ...previous,
      [field]: validateField(field, sanitizeAudit(values)),
    }));
  };

  const focusFirstError = (fieldErrors: AuditFieldErrors) => {
    const first = AUDIT_FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) document.getElementById(id(first))?.focus();
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    setServerError(null);

    const clean = sanitizeAudit(values);
    const result = validateAudit(clean);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("error");
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...clean,
          website: honeypotRef.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const data = (await response.json().catch(() => null)) as AuditResponse | null;

      if (response.ok && data?.ok) {
        setStatus("success");
        setValues(EMPTY);
        setDraftNotice(false);
        auditDraft.clear();
        window.requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      if (data && !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
          focusFirstError(data.errors);
        }
        setServerError({ message: data.message, email: data.contactEmail });
      } else {
        setServerError({ message: AUDIT_ERRORS.delivery_failed });
      }
      setStatus("error");
    } catch {
      setServerError({ message: NETWORK_ERROR });
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrors({});
    setServerError(null);
    startedAt.current = Date.now();
  };

  const errorList = AUDIT_FIELD_ORDER.filter((field) => errors[field]);
  const submitting = status === "submitting";

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[28rem] flex-col items-start justify-center"
            role="status"
          >
            <m.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.4, 0.64, 1] }}
              className="flex size-14 items-center justify-center rounded-full bg-aqua text-ink-950 shadow-[0_0_50px_-6px_rgb(134_230_218/0.7)]"
            >
              <CircleCheck className="size-7" strokeWidth={2} aria-hidden="true" />
            </m.span>
            <h3
              ref={successRef}
              tabIndex={-1}
              className="mt-8 text-title font-medium text-ivory focus:outline-none"
            >
              {copy.successTitle}
            </h3>
            <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-mist">
              {copy.successText}
            </p>
            <Button variant="secondary" className="mt-8" onClick={reset}>
              {copy.again}
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            onSubmit={submit}
            noValidate
            aria-busy={submitting}
            className="space-y-5"
          >
            <p className="text-sm text-dim">{copy.required}</p>

            {errorList.length > 0 ? (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                className="rounded-2xl border border-ember/30 bg-ember/[0.07] p-4 focus:outline-none"
              >
                <p className="flex items-center gap-2 text-sm font-medium text-ivory">
                  <CircleAlert className="size-4 text-ember" aria-hidden="true" />
                  {copy.summaryTitle}
                </p>
                <ul className="mt-2 space-y-1 pl-6 text-sm">
                  {errorList.map((field) => (
                    <li key={field}>
                      <a
                        href={`#${id(field)}`}
                        className="text-ember underline underline-offset-4 hover:text-ivory"
                      >
                        {errors[field]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id={id("name")}
                label={copy.name.label}
                error={errors.name}
                input={(props) => (
                  <input
                    {...props}
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    placeholder={copy.name.placeholder}
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    onBlur={() => blur("name")}
                    required
                  />
                )}
              />
              <Field
                id={id("company")}
                label={copy.company.label}
                error={errors.company}
                input={(props) => (
                  <input
                    {...props}
                    type="text"
                    name="company"
                    autoComplete="organization"
                    maxLength={LIMITS.company}
                    placeholder={copy.company.placeholder}
                    value={values.company}
                    onChange={(event) => update("company", event.target.value)}
                    onBlur={() => blur("company")}
                    required
                  />
                )}
              />
              <Field
                id={id("email")}
                label={copy.email.label}
                error={errors.email}
                input={(props) => (
                  <input
                    {...props}
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={LIMITS.email}
                    placeholder={copy.email.placeholder}
                    value={values.email}
                    onChange={(event) => update("email", event.target.value)}
                    onBlur={() => blur("email")}
                    required
                  />
                )}
              />
              <Field
                id={id("phone")}
                label={copy.phone.label}
                error={errors.phone}
                input={(props) => (
                  <input
                    {...props}
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={LIMITS.phone}
                    placeholder={copy.phone.placeholder}
                    value={values.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    onBlur={() => blur("phone")}
                    required
                  />
                )}
              />
            </div>

            <Field
              id={id("sector")}
              label={copy.sector.label}
              error={errors.sector}
              input={(props) => (
                <div className="relative">
                  <select
                    {...props}
                    name="sector"
                    value={values.sector}
                    onChange={(event) => update("sector", event.target.value)}
                    onBlur={() => blur("sector")}
                    required
                    className={cn(
                      props.className,
                      "appearance-none pr-11",
                      !values.sector && "text-dim!",
                    )}
                  >
                    <option value="" disabled>
                      {copy.sector.placeholder}
                    </option>
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector} className="bg-ink-900 text-ivory">
                        {sector}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mist"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            />

            <Field
              id={id("message")}
              label={
                <>
                  {copy.message.label} <span className="text-dim">({copy.message.optional})</span>
                </>
              }
              error={errors.message}
              hint={
                <span className="flex items-center justify-between gap-3">
                  <AnimatePresence>
                    {draftNotice ? (
                      <m.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-aqua"
                      >
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        {copy.draftAdded}
                      </m.span>
                    ) : (
                      <span />
                    )}
                  </AnimatePresence>
                  <span className="tabular-nums">
                    {values.message.length.toLocaleString("fr-FR")} /{" "}
                    {LIMITS.message.toLocaleString("fr-FR")}
                  </span>
                </span>
              }
              input={(props) => (
                <textarea
                  {...props}
                  name="message"
                  rows={4}
                  maxLength={LIMITS.message}
                  placeholder={copy.message.placeholder}
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  onBlur={() => blur("message")}
                  className={cn(
                    props.className,
                    "h-auto min-h-[7.5rem] resize-y py-3.5 leading-relaxed",
                  )}
                />
              )}
            />

            {/* Champ piège pour les robots : invisible et ignoré par les personnes. */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor={id("website")}>Ne pas remplir ce champ</label>
              <input
                ref={honeypotRef}
                id={id("website")}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div>
              <div className="flex items-start gap-3">
                <span className="relative mt-0.5 flex size-5 shrink-0">
                  <input
                    id={id("consent")}
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={(event) => {
                      update("consent", event.target.checked);
                      if (event.target.checked)
                        setErrors((previous) => ({ ...previous, consent: undefined }));
                    }}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? id("consent-error") : undefined}
                    required
                    className={cn(
                      "peer size-5 cursor-pointer appearance-none rounded-md border bg-white/[0.03] transition-colors checked:border-aqua checked:bg-aqua",
                      errors.consent ? "border-ember/70" : "border-white/25",
                    )}
                  />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="pointer-events-none absolute inset-0 m-auto size-3.5 text-ink-950 opacity-0 peer-checked:opacity-100"
                  >
                    <path
                      d="M3.5 8.5l3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <label
                  htmlFor={id("consent")}
                  className="cursor-pointer text-[0.88rem] leading-relaxed text-mist"
                >
                  {copy.consent}{" "}
                  <Link
                    href="/confidentialite"
                    className="text-ivory underline decoration-white/30 underline-offset-4 hover:decoration-aqua"
                  >
                    {copy.privacy}
                  </Link>
                  .
                </label>
              </div>
              {errors.consent ? (
                <p
                  id={id("consent-error")}
                  className="mt-2 flex items-center gap-1.5 pl-8 text-sm text-ember"
                >
                  <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                  {errors.consent}
                </p>
              ) : null}
            </div>

            <div aria-live="polite">
              {serverError ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-ember/30 bg-ember/[0.07] p-4 text-sm leading-relaxed text-ivory"
                >
                  <p className="flex items-start gap-2">
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden="true" />
                    {serverError.message}
                  </p>
                  {serverError.email ? (
                    <p className="mt-2 pl-6 text-mist">
                      {copy.directContact}{" "}
                      <a
                        href={`mailto:${serverError.email}`}
                        className="text-ivory underline underline-offset-4"
                      >
                        {serverError.email}
                      </a>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group/btn relative inline-flex h-14 w-full items-center justify-center gap-3 rounded-full btn-aube px-7 text-base font-medium text-ink-950 transition-[background-position,box-shadow,transform] duration-700 ease-out-expo active:scale-[0.99] disabled:cursor-progress disabled:opacity-80 sm:w-auto"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  {copy.submitting}
                </>
              ) : (
                <>
                  {copy.submit}
                  <SlidingArrow />
                </>
              )}
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type FieldInputProps = {
  id: string;
  className: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

function Field({
  id,
  label,
  error,
  hint,
  input,
}: {
  id: string;
  label: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
  input: (props: FieldInputProps) => React.ReactNode;
}) {
  const controlId = id;
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={controlId} className="mb-2 block text-[0.88rem] text-mist">
        {label}
      </label>
      {input({
        id: controlId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        className: cn(
          "block h-12 w-full rounded-xl border bg-[linear-gradient(180deg,rgb(5_6_10/0.55),rgb(255_255_255/0.03))] px-4 text-[1rem] text-ivory shadow-[inset_0_2px_5px_rgb(0_0_0/0.35),inset_0_-1px_0_rgb(255_255_255/0.05)] placeholder:text-dim/80 transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/25 focus:border-aqua/60 focus:shadow-[inset_0_2px_5px_rgb(0_0_0/0.35),0_0_0_4px_rgb(134_230_218/0.12)] focus:outline-none",
          error ? "border-ember/60" : "border-white/12",
        ),
      })}
      {error ? (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-sm text-ember">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
      {hint ? (
        <div id={hintId} className="mt-2 text-xs text-dim">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
