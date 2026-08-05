import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { PoliciesDocumentsSection } from "@/components/PoliciesDocumentsSection";

export const metadata: Metadata = { title: "Policies, Financials & Bylaws" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Policies, Financials & Bylaws"
        description="Governing documents and financial materials for the Association. Sign in with your HOA account; access requires dues paid in full."
      />
      <ContentSection band={0}>
        <PoliciesDocumentsSection />
      </ContentSection>
    </>
  );
}
