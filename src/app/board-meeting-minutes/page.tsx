import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { MeetingMinutesSection } from "@/components/MeetingMinutesSection";

export const metadata: Metadata = { title: "Board Meeting Minutes" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Board Meeting Minutes"
        description="Public minutes from HOA board meetings. Sign in with your HOA account to view and download."
      />
      <ContentSection band={0}>
        <MeetingMinutesSection />
      </ContentSection>
    </>
  );
}
