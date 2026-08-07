import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "School Surplus Site" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Our Community"
      title="School Surplus Site"
      description="News, updates, and links about the proposed townhouse development on the school surplus site park area."
      embed={embeds.schoolSurplusSite}
    />
  );
}
