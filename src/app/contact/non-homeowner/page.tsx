import type { Metadata } from "next";
import { NonHomeownerContactSection } from "@/components/ContactForms";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Non-Homeowner Contact",
};

export default function NonHomeownerContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Non-Homeowner Contact"
        description="Submit a message to the Wedgewood Ravine Home Owners Association if you are not a current homeowner."
      />
      <ContentSection band={0}>
        <NonHomeownerContactSection mode="general" />
      </ContentSection>
    </>
  );
}
