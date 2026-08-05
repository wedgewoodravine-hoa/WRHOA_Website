import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Home Buyers & Sellers",
};

export default function HomeBuyersSellersPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Community"
        title="Information for Home Buyers & Sellers"
        description="Whether you're selling your home or just moving in, this page outlines what you need to do and how to stay connected with our community."
      />
      <ContentSection band={0} className="grid gap-10 md:grid-cols-2">
        <article className="border border-forest/12 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-3xl text-forest-deep">
            Selling a Home in Wedgewood?
          </h2>
          <div className="brick-rule mt-4" />
          <div className="prose-hoa mt-6 space-y-4">
            <p>
              If you&apos;re in the process of <strong>selling your property</strong>,
              your <strong>lawyer</strong> must submit a formal request for
              HOA-related information using the{" "}
              <Link href="/contact/legal">Legal / Real Estate Inquiry</Link>{" "}
              form.
            </p>
            <p>
              <strong>Why must my lawyer complete the HOA documentation request?</strong>
            </p>
            <p>
              When a property in Wedgewood is being sold, the Association is often
              asked to confirm:
            </p>
            <ul>
              <li>Annual dues and whether they have been paid in full</li>
              <li>Any outstanding arrears on the account</li>
              <li>Architectural variance approvals (if applicable)</li>
              <li>Whether there are any HOA-related encumbrances on title</li>
            </ul>
            <p>
              Completing this form allows WRHOA to provide official written
              confirmation to the law office and helps avoid delays at closing.
            </p>
          </div>
        </article>

        <article className="border border-forest/12 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-3xl text-forest-deep">
            Just Bought a Home in Wedgewood?
          </h2>
          <div className="brick-rule mt-4" />
          <div className="prose-hoa mt-6 space-y-4">
            <p>
              Welcome to the community! To complete your membership with the
              Wedgewood Ravine HOA and receive your <strong>welcome package</strong>,
              we need some basic homeowner information.
            </p>
            <p>
              <strong>What you need to do:</strong>
            </p>
            <ol>
              <li>
                If you&apos;re purchasing a property, your lawyer must submit a
                formal request for HOA-related information using the{" "}
                <Link href="/contact/legal">Legal / Real Estate Inquiry</Link>{" "}
                form.
              </li>
              <li>
                Complete the{" "}
                <Link href="/new-homeowner-registration">
                  New Homeowner Registration Form
                </Link>
                .
              </li>
              <li>
                Once we receive your form, we&apos;ll send you a Welcome Package
                with the details you need as a new member.
              </li>
            </ol>
          </div>
        </article>
      </ContentSection>
    </>
  );
}
