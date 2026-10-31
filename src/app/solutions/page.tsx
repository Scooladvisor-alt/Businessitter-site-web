import type { Metadata } from "next";
import {
  ArrowUpRight,
  Check,
  LayoutDashboard,
  Phone,
  Plug,
  Repeat,
  Route,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { solutionsPage } from "@/content/pages";
import { site } from "@/content/site";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: solutionsPage.meta.title,
  description: solutionsPage.meta.description,
  path: "/solutions",
});

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  workflow: Workflow,
  phone: Phone,
  repeat: Repeat,
  plug: Plug,
  layout: LayoutDashboard,
  route: Route,
};

export default function SolutionsPage() {
  const page = solutionsPage;
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.domainsTitle,
    itemListElement: page.domains.map((domain, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: domain.title,
        description: domain.text,
        serviceType: domain.title,
        provider: { "@id": `${site.url}/#organisation` },
      },
    })),
  };

  return (
    <>
      <JsonLd
        data={[breadcrumbJsonLd([{ name: "Solutions", path: "/solutions" }]), servicesJsonLd]}
      />
      <PageHero id="solutions" title={page.title} lead={page.lead} />

      <section aria-labelledby="domaines-title" className="relative py-12 md:py-20">
        <div className="container-x">
          <SplitHeading
            id="domaines-title"
            text={page.domainsTitle}
            className="mx-auto max-w-3xl text-center text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
          />
          <ul className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {page.domains.map((domain, index) => {
              const Icon = ICONS[domain.icon] ?? Sparkles;
              return (
                <Reveal
                  as="li"
                  key={domain.title}
                  delay={(index % 3) * 0.06}
                  className={cn(
                    "surface group relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] p-7 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-white/20",
                    (index === 0 || index === 6) && "lg:col-span-2",
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(134_230_218/0.12),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-ivory">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ivory">
                    {domain.title}
                  </h3>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-mist">{domain.text}</p>
                  <p className="mt-7 text-[0.85rem] font-medium text-dim">{page.examplesLabel}</p>
                  <ul className="mt-4 space-y-2.5">
                    {domain.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-start gap-2.5 text-[0.93rem] text-ivory/90"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-aqua"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {example}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="surface border-aube relative mx-auto mt-6 flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-panel)] p-7 text-center">
            <div className="max-w-2xl">
              <p className="text-[0.95rem] font-medium text-amber">{page.showcase.label}</p>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ivory/90">
                {page.showcase.text}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <ButtonLink href="/#realisation" variant="secondary" size="sm" arrow={false}>
                SuperCalendar
              </ButtonLink>
              <ButtonLink href={site.superCalendarUrl} variant="ghost" size="sm" external>
                {page.showcase.link}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="audience-title" className="relative py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <SplitHeading
              id="audience-title"
              text={page.audienceTitle}
              className="text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
            />
            <Reveal as="p" className="mx-auto mt-6 max-w-xl text-lead text-mist">
              {page.audienceLead}
            </Reveal>
          </div>
          <Reveal
            as="ul"
            stagger={0.08}
            className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {page.audiences.map((audience) => (
              <li
                key={audience.title}
                className="rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] p-6 text-center"
              >
                <h3 className="text-[1.15rem] font-medium tracking-[-0.02em] text-ivory">
                  {audience.title}
                </h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-mist">{audience.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="criteres-title" className="relative py-16 md:py-24">
        <div className="container-x">
          <SplitHeading
            id="criteres-title"
            text={page.criteriaTitle}
            className="mx-auto max-w-3xl text-center text-[clamp(1.9rem,1.2rem+2.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ivory"
          />
          <Reveal
            as="ol"
            stagger={0.08}
            className="mx-auto mt-12 grid max-w-6xl gap-px overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4"
          >
            {page.criteria.map((criterion) => (
              <li key={criterion.title} className="bg-ink-950 p-7 text-center">
                <h3 className="text-[1.4rem] font-medium tracking-[-0.025em] text-ivory">
                  {criterion.title}
                </h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-mist">{criterion.text}</p>
              </li>
            ))}
          </Reveal>
          <p className="mt-8 text-center text-sm text-dim">
            <Link
              href="/approche"
              className="inline-flex items-center gap-1.5 underline decoration-white/20 underline-offset-4 hover:text-ivory"
            >
              {page.cta.secondary}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title={page.cta.title}
        text={page.cta.text}
        secondary={{ label: page.cta.secondary, href: "/approche" }}
      />
    </>
  );
}
