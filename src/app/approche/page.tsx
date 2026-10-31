import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { approachPage } from "@/content/pages";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { cta } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: approachPage.meta.title,
  description: approachPage.meta.description,
  path: "/approche",
});

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
      <PageHero id="approche" eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
        <ButtonLink href="/contact" size="lg">
          {cta.primary}
        </ButtonLink>
      </PageHero>

      {/* Principes */}
      <section aria-labelledby="principes-title" className="relative py-16 md:py-24">
        <div className="container-x">
          <SplitHeading
            id="principes-title"
            text={page.principlesTitle}
            className="max-w-3xl text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
          />
          <Reveal as="ol" stagger={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {page.principles.map((principle, index) => (
              <li
                key={principle.title}
                className="surface flex flex-col rounded-[var(--radius-panel)] p-6"
              >
                <span className="font-mono text-xs text-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-[1.15rem] font-medium leading-snug tracking-[-0.02em] text-ivory">
                  {principle.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{principle.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Étapes détaillées */}
      <section aria-labelledby="etapes-title" className="relative py-16 md:py-24">
        <div className="container-x">
          <SplitHeading
            id="etapes-title"
            text={page.stepsTitle}
            className="max-w-3xl text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
          />
          <ol className="relative mt-14 space-y-6 md:mt-20">
            {page.steps.map((step) => (
              <Reveal
                as="li"
                key={step.number}
                className="surface relative overflow-hidden rounded-[var(--radius-stage)] p-6 sm:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(to_bottom,#ffc88f,#86e6da)]"
                />
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-4">
                    <p className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-dim">{step.number}</span>
                      <span className="eyebrow text-amber">{step.label}</span>
                    </p>
                    <h3 className="mt-4 text-title font-medium text-ivory">{step.title}</h3>
                  </div>
                  <dl className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
                    {(["does", "gets", "you"] as const).map((key) => (
                      <div key={key}>
                        <dt className="eyebrow text-dim">{page.stepLabels[key]}</dt>
                        <dd className="mt-3 text-[0.97rem] leading-relaxed text-mist">
                          {step[key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Rapport d'audit */}
      <section aria-labelledby="rapport-title" className="relative py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SplitHeading
              id="rapport-title"
              text={page.reportTitle}
              className="text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
            />
            <Reveal as="p" className="mt-6 text-lead text-mist">
              {page.reportLead}
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal as="ul" stagger={0.07} className="space-y-3">
              {page.reportItems.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
                >
                  <span className="mt-0.5 font-mono text-xs text-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ivory/90">{item}</span>
                </li>
              ))}
            </Reveal>
            <Reveal
              as="p"
              className="mt-6 border-l border-lilac/40 pl-4 text-[0.95rem] leading-relaxed text-lilac/90"
            >
              {page.estimateNote}
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="relative py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SplitHeading
              id="faq-title"
              text={page.faqTitle}
              className="text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
            />
          </div>
          <Reveal className="lg:col-span-8" stagger={0.05}>
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
        text={page.cta.text}
        secondary={{ label: page.cta.secondary, href: "/solutions" }}
      />
    </>
  );
}
