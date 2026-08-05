import type { Metadata } from "next";
import { NonHomeownerContactSection } from "@/components/ContactForms";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Legal / Real Estate Inquiry",
};

export default function LegalContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Legal / Real Estate Inquiry"
        description="Submit requests for annual fee amount, payment period, paid or arrears status, and related closing documentation for a Wedgewood Ravine property. Support Category is pre-selected for HOA documentation requests."
      />
      <ContentSection band={0}>
        <NonHomeownerContactSection mode="legal" />
      </ContentSection>
    </>
  );
}
