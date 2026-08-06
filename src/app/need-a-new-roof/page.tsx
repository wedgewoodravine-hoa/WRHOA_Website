import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Need a New Roof?",
};

export default function NeedANewRoofPage() {
  return (
    <>
      <PageHero
        eyebrow="Design Guidelines"
        title="Need a New Roof?"
        description="Roof materials are part of what keeps Wedgewood Ravine’s architectural character intact."
      />
      <ContentSection band={0} narrow className="prose-hoa">
        <div className="flex flex-wrap gap-3">
          <Link href="/design-guidelines" className="btn btn-forest">
            View All Design Guidelines
          </Link>
          <Link href="/design-guidelines-variance" className="btn btn-outline">
            Apply for a Variance
          </Link>
        </div>

        <h2 className="font-display mt-12 text-3xl text-forest-deep">
          Roof Materials
        </h2>
        <div className="brick-rule mt-4" />
        <div className="mt-6 space-y-4">
          <p>
            The roof is to be either cedar or pine shakes or shingles, or clay
            tile. Shakes or shingles must be natural earthtone colours, and
            tiles should be terra cotta, grey, or brown, not blue or green.
          </p>
          <p>
            Other roof finishes and colours will be considered if it can be shown
            by the applicant that these are in keeping with the overall
            objectives of the Design Guidelines.
          </p>
          <p>
            All roof stacks, flashings, etc., are to be painted out to match roof
            colour. All fascia board ends are to be cut within 10 degrees of
            vertical and are to be a minimum of 6&quot; deep. Rain-water leaders,
            eavestroughs and fascias should match the trim colour as selected,
            where possible.
          </p>
          <p>
            Soffits are to be prefinished metal on houses with vinyl or aluminum
            siding. On houses with wooden siding, soffits can be metal or wood.
            Overhangs on upper levels are recommended to be 1&apos;-0&quot; to
            1&apos;-6&quot;, and on lower levels are to be 2&apos;-0&quot;.
          </p>
        </div>

        <h2 className="font-display mt-14 text-3xl text-forest-deep">
          Solar Panels
        </h2>
        <div className="brick-rule mt-4" />
        <div className="mt-6 space-y-4">
          <p>
            The HOA does not restrict roof-mounted solar panels. They are not
            called out in the Design Guidelines, and separate HOA approval is
            not required for the solar installation itself. Panels should be
            affixed to the roof of your home and installed according to City of
            Edmonton and Government of Alberta permits and regulations—your
            contractor will normally handle those requirements.
          </p>
          <p>
            If your solar project also changes roofing materials (for example,
            replacing shakes under the array), that roofing work still needs a{" "}
            <Link href="/design-guidelines-variance">
              Design Guidelines Variance
            </Link>
            .
          </p>
        </div>
      </ContentSection>
    </>
  );
}
