import type { Metadata } from "next";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { ParkDevelopmentSection } from "@/components/ParkDevelopmentSection";
import {
  fetchParkDevelopmentUpdates,
  type HoaNewsItem,
} from "@/lib/knack";

export const metadata: Metadata = { title: "Surplus Site Development" };

export const revalidate = 300;

export default async function Page() {
  let updates: HoaNewsItem[] = [];
  let error: string | null = null;

  try {
    updates = await fetchParkDevelopmentUpdates();
  } catch {
    error = "Development updates could not be loaded right now.";
  }

  return (
    <>
      <PageHero
        eyebrow="Our Community"
        title="Surplus Site Development"
        description="News, updates, and links about the townhouse development on the school surplus site park area."
      />
      <ContentSection band={0}>
        <ParkDevelopmentSection updates={updates} error={error} />
      </ContentSection>
    </>
  );
}
