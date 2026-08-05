import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Design Guidelines Variance",
};

export default function DesignGuidelinesVariancePage() {
  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Application for Substitution to Design Guidelines"
        description="Every home in Wedgewood Ravine is bound by registered Design Guidelines. Variances are considered case by case."
      />
      <ContentSection band={0} narrow>
        <div className="flex flex-wrap gap-3">
          <Link href="/design-guidelines" className="btn btn-forest">
            View Design Guidelines
          </Link>
          <Link href="/variance-application" className="btn btn-brick">
            Apply Online
          </Link>
          <a href="/documents/variance-application.pdf" className="btn btn-outline">
            Download PDF Form
          </a>
        </div>

        <div className="prose-hoa mt-10 space-y-5">
          <p>
            The Wedgewood Ravine Design Guidelines, as registered against each
            lot in the community, provide detailed specifications for home
            construction materials, fencing, and lot landscape requirements.
          </p>
          <p>
            In some instances, a homeowner may wish to install an alternative
            building material. The WRHOA has the authority and sole discretion to
            consider such substitutions and grant variances where other materials
            or finishes remain in keeping with the overall objectives of the
            Design Guidelines.
          </p>
          <p>
            No substitution is to be represented as an acceptable variance
            without written approval from the Association. The Association
            does not maintain “grandfathered” lists of previously approved
            materials; each application is reviewed on its own, address-specific
            basis.
          </p>
          <h2 className="font-display pt-4 text-2xl text-forest-deep">
            Review Process
          </h2>
          <p>
            For an alternative building material to be considered, submit a
            completed Application Form and material sample together with an
            application fee of $100.00 + GST. The WRHOA has contracted a
            third-party Design Consultant to review submissions. Incomplete
            applications will be returned.
          </p>
          <ul>
            <li>Application Form: completed, signed, and dated by all registered owners</li>
            <li>Sample Material: a sample piece of the actual material proposed</li>
            <li>Multiple Materials: maximum of two alternatives per application</li>
            <li>Application Fee: non-refundable; payment is not approval</li>
          </ul>
          <p>
            The Association will use its best efforts to respond within about two
            weeks from the date an application is deemed complete. All decisions
            are provided in writing.
          </p>
        </div>
      </ContentSection>
    </>
  );
}
