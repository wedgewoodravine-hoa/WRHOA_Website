import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { LeagueMembershipSection } from "@/components/LeagueMembershipSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "My League Membership Number" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Our Community"
        title="My League Membership Number"
        description="Look up your Community League membership number. Sign in with your HOA account; access requires dues paid in full."
      />
      <ContentSection band={0}>
        <LeagueMembershipSection />
      </ContentSection>
    </>
  );
}
