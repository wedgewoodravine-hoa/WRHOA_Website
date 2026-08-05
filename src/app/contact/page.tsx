import type { Metadata } from "next";
import Link from "next/link";
import {
  ContactFaqSection,
  ContactRoutesSection,
} from "@/components/ContactFaqSection";
import { CommunityMap } from "@/components/CommunityMap";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
};

const contactForms = [
  {
    href: "/contact/homeowner",
    title: "Homeowner",
    description:
      "Dues, portal access, design guidelines, variances, the fountain, and other association matters.",
    featured: true,
    animation: "animate-fade-up",
  },
  {
    href: "/contact/non-homeowner",
    title: "Non-Homeowner",
    description:
      "For visitors, prospective buyers, and others who are not current Wedgewood homeowners.",
    featured: false,
    animation: "animate-fade-up-delay-1",
  },
  {
    href: "/contact/legal",
    title: "Legal / Real Estate",
    description:
      "Fee status, arrears confirmation, and closing documentation for law offices and realtors.",
    featured: false,
    animation: "animate-fade-up-delay-2",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        description="Find the right place for your question, solve common issues quickly, or send a message to the HOA."
      />

      <ContentSection band={0}>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-forest-deep sm:text-4xl">
            How can we help?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-forest-mid sm:text-base">
            Choose the form that fits your situation. For parks, courts, or city
            services, see who handles what below.
          </p>
        </div>

        <div
          id="hoa-contact"
          className="mt-10 scroll-mt-28 grid gap-4 md:grid-cols-3"
        >
          {contactForms.map((form) => (
            <Link
              key={form.href}
              href={form.href}
              className={`group flex h-full flex-col p-6 sm:p-7 ${form.animation} ${
                form.featured
                  ? "border border-brick/30 bg-forest-deep text-cream-text hover:border-gold/50"
                  : "border border-forest/12 bg-transparent transition hover:border-brick/35"
              }`}
            >
              {form.featured ? (
                <p className="text-xs uppercase tracking-[0.2em] text-gold">
                  Most common
                </p>
              ) : null}
              <h3
                className={`font-display text-2xl leading-snug ${
                  form.featured
                    ? "mt-3 text-cream-text"
                    : "text-forest-deep"
                }`}
              >
                {form.title}
              </h3>
              <div
                className={`brick-rule mt-4 ${form.featured ? "opacity-90" : ""}`}
              />
              <p
                className={`mt-4 flex-1 text-sm leading-relaxed ${
                  form.featured ? "text-cream-text/80" : "text-forest-mid"
                }`}
              >
                {form.description}
              </p>
              <span
                className={`mt-6 inline-flex w-fit items-center text-xs uppercase tracking-[0.16em] transition group-hover:translate-x-0.5 ${
                  form.featured
                    ? "bg-cream-text px-4 py-2.5 text-forest-deep group-hover:bg-parchment"
                    : "text-brick group-hover:text-brick-deep"
                }`}
              >
                Open form →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-forest-mid">
          Looking for something specific?{" "}
          <Link href="/pay-hoa-fees" className="text-brick transition hover:text-brick-deep">
            Pay dues
          </Link>
          <span className="mx-2 text-forest/30">·</span>
          <Link
            href="/design-guidelines"
            className="text-brick transition hover:text-brick-deep"
          >
            Design guidelines
          </Link>
          <span className="mx-2 text-forest/30">·</span>
          <Link href="/who-does-what" className="text-brick transition hover:text-brick-deep">
            Who does what
          </Link>
          <span className="mx-2 text-forest/30">·</span>
          <a href="#common-questions" className="text-brick transition hover:text-brick-deep">
            Common questions
          </a>
        </p>
      </ContentSection>

      <ContentSection band={1}>
        <ContactRoutesSection />
      </ContentSection>

      <ContentSection band={2}>
        <ContactFaqSection />
      </ContentSection>

      <ContentSection
        band={3}
        className="grid w-full min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12"
      >
        <div className="min-w-0">
          <h2 className="font-display text-3xl text-forest-deep">
            Mailing address
          </h2>
          <div className="brick-rule mt-4" />
          <p className="font-display mt-6 text-2xl leading-snug text-forest-deep sm:text-3xl">
            {site.address}
            <br />
            {site.city}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-forest-mid">
            Mail only—use the forms above for the fastest response. Not sure who
            handles your question? See{" "}
            <Link
              href="/who-does-what"
              className="text-brick underline decoration-brick/40 underline-offset-3 transition hover:text-brick-deep"
            >
              Who Does What
            </Link>
            .
          </p>
        </div>

        <CommunityMap caption="Neighbourhood location" />
      </ContentSection>
    </>
  );
}
