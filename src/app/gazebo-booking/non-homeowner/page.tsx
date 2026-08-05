import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "Gazebo Booking: Non-Resident" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Gazebo Booking"
      title="Non-Resident Gazebo Booking"
      embed={embeds.gazeboNonHomeowner}
    />
  );
}
