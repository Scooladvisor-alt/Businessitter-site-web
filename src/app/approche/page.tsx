import type { Metadata } from "next";
import { Check, ChevronDown } from "lucide-react";
import { approachPage } from "@/content/pages";
import { cta } from "@/content/site";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: approachPage.meta.title,
  description: approachPage.meta.description,
  path: "/approche",
});

const sectionTitle =
  "mx-auto max-w-5xl text-center text-[clamp(2.2rem,1.1rem+3.6vw,4.4rem)] font-medium leading-[1.03] tracking-[-0.038em] text-ivory";

export default function ApproachPage() {
  const page = approachPage;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd
        data={[breadcrumbJsonLd([{ name: "Notre approche", path: "/approche" }]), faqJsonLd]}
      />
      <PageHero id="approche" title={page.title}>
        <ButtonLink href="/contact" size="lg">
          {cta.primary}
        </ButtonLink>
      </PageHero>

      {/* Principes */}
      <section
        data-backdrop="section"
        aria-labelledby="principes-title"
        className="relative py-16 md:py-24"
      >
        <div className="container-x">
          <SplitHeading id="principes-title" text={page.principlesTitle} className={sectionTitle} />
          <Reveal
            as="ul"
            stagger={0.08}
            className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {page.principles.map((principle) => (
              <li
                key={principle.title}
                className="surface flex flex-col items-center rounded-[var(--radius-panel)] p-6 text-center"
              >
                <h3 className="text-[1.12rem] font-medium leading-snug tracking-[-0.02em] text-ivory">
                  {principle.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{principle.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Étapes détaillées */}
      <section
        data-backdrop="section"
        aria-labelledby="etapes-title"
        className="relative py-16 md:py-24"
      >
        <div className="container-x">
          <SplitHeading id="etapes-title" text={page.stepsTitle} className={sectionTitle} />
          <ol className="mx-auto mt-14 max-w-5xl space-y-5 md:mt-20">
            {page.steps.map((step, index) => (
              <Reveal
                as="li"
                key={step.number}
                className="surface relative overflow-hidden rounded-[var(--radius-stage)] p-6 sm:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(to_bottom,#ffc88f,#86e6da)]"
                />
                <div className="flex flex-col items-center text-center">
                  <span className="flex size-10 items-center justify-center rounded-full border border-white/15 text-sm tabular-nums text-ivory">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-title font-medium text-ivory">{step.title}</h3>
                </div>
                <dl className="mt-8 grid gap-6 border-t border-white/[0.07] pt-8 text-center sm:grid-cols-3">
                  {(["does", "gets", "you"] as const).map((key) => (
                    <div key={key}>
                      <dt className="text-[0.9rem] font-medium text-ivory">
                        {page.stepLabels[key]}
                      </dt>
                      <dd className="mt-2 text-[0.95rem] leading-relaxed text-mist">{step[key]}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Rapport d'audit */}
      <section
        data-backdrop="section"
        aria-labelledby="rapport-title"
        className="relative py-16 md:py-24"
      >
        <div className="container-x">
          <SplitHeading id="rapport-title" text={page.reportTitle} className={sectionTitle} />
          <Reveal as="ul" stagger={0.07} className="mx-auto mt-12 max-w-2xl space-y-3">
            {page.reportItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-aqua"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span className="text-ivory/90">{item}</span>
              </li>
            ))}
          </Reveal>
          <Reveal
            as="p"
            className="mx-auto mt-6 max-w-2xl text-center text-[0.95rem] text-lilac/90"
          >
            {page.estimateNote}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section
        data-backdrop="section"
        aria-labelledby="faq-title"
        className="relative py-16 md:py-24"
      >
        <div className="container-x">
          <SplitHeading id="faq-title" text={page.faqTitle} className={sectionTitle} />
          <Reveal className="mx-auto mt-12 max-w-3xl" stagger={0.05}>
            {page.faq.map((item) => (
              <details
                key={item.question}
                className="group border-b border-white/[0.08] py-2 first:border-t"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-4 text-[1.08rem] font-medium tracking-[-0.01em] text-ivory [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown
                    className="size-5 shrink-0 text-mist transition-transform duration-500 ease-out-expo group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 pr-10 text-[0.98rem] leading-relaxed text-mist">{item.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={page.cta.title}
        secondary={{ label: page.cta.secondary, href: "/solutions" }}
      />
    </>
  );
}
