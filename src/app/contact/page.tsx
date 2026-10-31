import type { Metadata } from "next";
import { CircleCheck, Mail, Phone } from "lucide-react";
import { contactPage } from "@/content/pages";
import { audit } from "@/content/home";
import { site } from "@/content/site";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { AuditForm } from "@/components/forms/AuditForm";

export const metadata: Metadata = pageMetadata({
  title: contactPage.meta.title,
  description: contactPage.meta.description,
  path: "/contact",
});

export default function ContactPage() {
  const page = contactPage;
  const { email, phone } = site.contact;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHero id="contact" eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <section aria-labelledby="formulaire-title" className="relative pb-24 md:pb-36">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7" y={40}>
            <div className="surface border-aube rounded-[var(--radius-stage)] p-6 sm:p-10">
              <h2 id="formulaire-title" className="text-title font-medium text-ivory">
                {page.formTitle}
              </h2>
              <AuditForm idPrefix="contact" className="mt-8" />
            </div>
          </Reveal>

          <aside className="space-y-10 lg:col-span-5">
            <Reveal>
              <h2 className="eyebrow text-dim">{page.nextTitle}</h2>
              <ol className="mt-6 space-y-6">
                {page.next.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/12 font-mono text-xs text-ivory">
                      {index + 1}
                    </span>
                    <p className="pt-1.5 text-[0.98rem] leading-relaxed text-mist">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal as="ul" className="space-y-2.5" stagger={0.06}>
              {audit.assurances.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[0.95rem] text-ivory/90">
                  <CircleCheck className="size-4 text-aqua" strokeWidth={2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </Reveal>

            {email || phone ? (
              <Reveal className="rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="eyebrow text-dim">{page.directTitle}</h2>
                <ul className="mt-5 space-y-3">
                  {email ? (
                    <li>
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center gap-3 text-ivory underline decoration-white/20 underline-offset-4 hover:decoration-aqua"
                      >
                        <Mail className="size-4 text-mist" aria-hidden="true" />
                        {email}
                      </a>
                    </li>
                  ) : null}
                  {phone ? (
                    <li>
                      <a
                        href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                        className="inline-flex items-center gap-3 text-ivory underline decoration-white/20 underline-offset-4 hover:decoration-aqua"
                      >
                        <Phone className="size-4 text-mist" aria-hidden="true" />
                        {phone}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </Reveal>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
