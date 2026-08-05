import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { VolunteerSection } from "@/components/VolunteerSection";
import { fetchVolunteerOpportunities } from "@/lib/knack-forms";

export const metadata: Metadata = { title: "Volunteer" };

export default async function Page() {
  let opportunities: Awaited<ReturnType<typeof fetchVolunteerOpportunities>> =
    [];

  try {
    opportunities = await fetchVolunteerOpportunities();
  } catch {
    opportunities = [];
  }

  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Volunteer"
        description="Share your interest in serving the community."
      />
      <ContentSection band={0}>
        <VolunteerSection opportunities={opportunities} />
      </ContentSection>
    </>
  );
}
