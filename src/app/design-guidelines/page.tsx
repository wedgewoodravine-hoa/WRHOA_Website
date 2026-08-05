import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { DesignGuidelinesGuide } from "@/components/DesignGuidelinesGuide";
import { PageHero } from "@/components/PageHero";
import {
  fetchDesignGuidelines,
  type DesignGuidelineCategory,
} from "@/lib/knack";

export const metadata: Metadata = { title: "Design Guidelines" };

export const revalidate = 300;

export default async function Page() {
  let categories: DesignGuidelineCategory[] = [];
  let error: string | null = null;

  try {
    categories = await fetchDesignGuidelines();
  } catch {
    error = "Design guidelines could not be loaded right now.";
  }

  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Design Guidelines"
        description="Registered standards for materials, massing, fencing, and landscape. Search or browse by topic to find the rule you need."
      />
      <ContentSection band={0}>
        <aside className="mb-10 flex flex-col gap-5 border-l-4 border-brick bg-parchment/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-brick">
              Need an exception?
            </p>
            <h2 className="font-display mt-2 text-2xl text-forest-deep">
              Request a design guidelines variance
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-mid">
              If your project needs a material or finish outside the registered
              standards, apply for a variance. Each request is reviewed on its
              own merits.
            </p>
          </div>
          <Link
            href="/design-guidelines-variance"
            className="btn btn-brick shrink-0 self-start sm:self-center"
          >
            Request a Variance
          </Link>
        </aside>
        <DesignGuidelinesGuide categories={categories} error={error} />
      </ContentSection>
    </>
  );
}
