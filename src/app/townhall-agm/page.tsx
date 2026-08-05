import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { TownhallAgmSection } from "@/components/TownhallAgmSection";

export const metadata: Metadata = { title: "Townhall & AGM" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Townhall and Annual General Meetings"
        description="Agendas, materials, and information for Townhall and AGM sessions."
      />
      <ContentSection band={0}>
        <TownhallAgmSection />
      </ContentSection>
    </>
  );
}
