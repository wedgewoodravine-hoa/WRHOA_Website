import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "Tennis & Pickleball" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Amenities"
      title="Tennis & Pickleball"
      description="Court information and access for Wedgewood Ravine."
      embed={embeds.tennisPickleball}
    />
  );
}
