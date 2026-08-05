import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { NewHomeownerRegistrationSection } from "@/components/NewHomeownerRegistrationSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "New Homeowner Registration" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Welcome"
        title="New Homeowner Registration"
        description="Register with the HOA to receive your welcome package."
      />
      <ContentSection band={0}>
        <NewHomeownerRegistrationSection />
      </ContentSection>
    </>
  );
}
