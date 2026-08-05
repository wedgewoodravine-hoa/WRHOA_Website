import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "Newsletters" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Updates"
      title="Newsletters"
      description="HOA newsletters and community notices."
      embed={embeds.newsletters}
    />
  );
}
