import type { Metadata } from "next";
import {
  HomeownerContactSection,
} from "@/components/ContactForms";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Homeowner Contact",
};

export default function HomeownerContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Homeowner Contact"
        description="Submit a message to the Wedgewood Ravine Home Owners Association."
      />
      <ContentSection band={0}>
        <HomeownerContactSection />
      </ContentSection>
    </>
  );
}
