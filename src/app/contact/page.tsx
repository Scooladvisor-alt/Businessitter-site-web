import type { Metadata } from "next";
import { RichText } from "@/components/ui/RichText";
import { CircleCheck, Mail, Phone } from "lucide-react";
import { contactPage } from "@/content/pages";
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
      <PageHero id="contact" title={page.title} />

      <section
        data-backdrop="section"
        aria-labelledby="formulaire-title"
        className="relative pb-24 md:pb-36"
      >
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl" y={40}>
            <div className="surface border-aube rounded-[var(--radius-stage)] p-6 sm:p-10">
              <h2 id="formulaire-title" className="text-center text-title font-medium text-ivory">
                <RichText text={page.formTitle} />
              </h2>
              <AuditForm idPrefix="contact" className="mt-8" />
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-20 max-w-4xl text-center">
            <h2 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] font-medium tracking-[-0.03em] text-ivory">
              <RichText text={page.nextTitle} />
            </h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {page.next.map((step, index) => (
                <li key={step} className="flex flex-col items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/12 text-sm tabular-nums text-ivory">
                    {index + 1}
                  </span>
                  <p className="text-[0.95rem] leading-relaxed text-mist">{step}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal
            as="ul"
            stagger={0.06}
            className="mx-auto mt-14 flex max-w-4xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8"
          >
            {page.assurances.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[0.95rem] text-ivory/90">
                <CircleCheck className="size-4 text-aqua" strokeWidth={2} aria-hidden="true" />
                {item}
              </li>
            ))}
          </Reveal>

          {email || phone ? (
            <Reveal className="mx-auto mt-14 max-w-md rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] p-6 text-center">
              <h2 className="text-[1.1rem] font-medium text-ivory">{page.directTitle}</h2>
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
        </div>
      </section>
    </>
  );
}
