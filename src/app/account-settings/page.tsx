import type { Metadata } from "next";
import { AccountSettingsSection } from "@/components/AccountSettingsSection";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Account Settings" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Account Settings"
        description="Update your contact information, mailing address, and login email or password."
      />
      <ContentSection band={0}>
        <AccountSettingsSection />
      </ContentSection>
    </>
  );
}
