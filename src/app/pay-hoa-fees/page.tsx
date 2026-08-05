import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { PayHoaFeesSection } from "@/components/PayHoaFeesSection";

export const metadata: Metadata = { title: "Pay HOA Fees" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Pay HOA Fees"
        description="Review outstanding association dues and pay securely online with PayPal. Sign in with your HOA account to get started."
      />
      <ContentSection band={0}>
        <PayHoaFeesSection />
      </ContentSection>
    </>
  );
}
