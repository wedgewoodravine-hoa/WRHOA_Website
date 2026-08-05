import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "Treasurer Login" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Board Access"
      title="Treasurer Login"
      description="Treasurer tools for dues and financial administration."
      embed={embeds.treasurerLogin}
    />
  );
}
