import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "Gazebo Booking: Resident" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Gazebo Booking"
      title="Resident Gazebo Booking"
      embed={embeds.gazeboHomeowner}
    />
  );
}
