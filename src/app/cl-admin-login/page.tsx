import type { Metadata } from "next";
import { PortalPage } from "@/components/PortalPage";
import { embeds } from "@/lib/site";

export const metadata: Metadata = { title: "CL Admin Login" };

export default function Page() {
  return (
    <PortalPage
      eyebrow="Community League"
      title="CL Admin Login"
      description="Administration access for Community League operators."
      embed={embeds.clAdminLogin}
    />
  );
}
