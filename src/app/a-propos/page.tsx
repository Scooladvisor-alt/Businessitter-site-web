import type { Metadata } from "next";
import { fr } from "@/lib/typography";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { AboutSection } from "@/components/home/AboutSection";
import { CtaBand } from "@/components/pages/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description: fr(
    "Businessitter veille sur votre business : découvrez l'origine du nom et Antonin Silandre, fondateur de Businessitter et créateur de SuperCalendar.",
  ),
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "À propos", path: "/a-propos" }])} />
      <AboutSection />
      <CtaBand
        title={fr("Parlons de *votre entreprise*.")}
        secondary={{ label: fr("Découvrir notre approche"), href: "/approche" }}
      />
    </>
  );
}
