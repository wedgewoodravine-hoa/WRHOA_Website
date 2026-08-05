import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { VarianceApplicationSection } from "@/components/VarianceApplicationSection";

export const metadata: Metadata = { title: "Variance Application" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Design Guidelines"
        title="Variance Application"
        description="Submit an online application for a Design Guidelines variance."
      />
      <ContentSection band={0}>
        <VarianceApplicationSection />
      </ContentSection>
    </>
  );
}
