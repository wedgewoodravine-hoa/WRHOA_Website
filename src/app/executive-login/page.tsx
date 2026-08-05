import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "Executive Login" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Board Access"
      title="Executive Login"
      description="Secure portal for board members."
      embed={embeds.executiveLogin}
    />
  );
}
