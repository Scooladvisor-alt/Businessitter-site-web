import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { ProblemSection } from "@/components/home/ProblemSection";
import { PossibilitiesSection } from "@/components/home/PossibilitiesSection";
import { ApproachSection } from "@/components/home/ApproachSection";
import { TransformationSection } from "@/components/home/TransformationSection";
import { SuperCalendarSection } from "@/components/home/SuperCalendarSection";
import { TrustSection } from "@/components/home/TrustSection";
import { AboutSection } from "@/components/home/AboutSection";
import { VisionSection } from "@/components/home/VisionSection";
import { AuditSection } from "@/components/home/AuditSection";
import { ChapterNav } from "@/components/layout/ChapterNav";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Chaque séquence est hydratée séparément : le travail est fractionné. */}
      <Hero />
      <Suspense>
        <ProblemSection />
      </Suspense>
      <Suspense>
        <PossibilitiesSection />
      </Suspense>
      <Suspense>
        <ApproachSection />
      </Suspense>
      <Suspense>
        <TransformationSection />
      </Suspense>
      <Suspense>
        <SuperCalendarSection />
      </Suspense>
      <AboutSection />
      <Suspense>
        <TrustSection />
      </Suspense>
      <Suspense>
        <VisionSection />
      </Suspense>
      <Suspense>
        <AuditSection />
      </Suspense>
      <Suspense>
        <ChapterNav />
      </Suspense>
    </>
  );
}
