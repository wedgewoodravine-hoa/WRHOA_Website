import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { site, whoDoesWhat } from "@/lib/site";

export const metadata: Metadata = {
  title: "Who Does What",
};

const columns = [
  {
    title: "Community League",
    items: whoDoesWhat.communityLeague,
    href: site.communityLeagueUrl,
    cta: "Visit wedgewoodcl.ca",
    external: true,
  },
  {
    title: "Home Owners Association",
    items: whoDoesWhat.hoa,
    href: "/contact",
    cta: "Contact the HOA",
    external: false,
  },
  {
    title: "City of Edmonton",
    items: whoDoesWhat.city,
    href: site.city311Url,
    cta: "Report via 311",
    external: true,
  },
];

export default function WhoDoesWhatPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Community"
        title="Who Does What in Wedgewood Ravine"
        description="A practical guide to which group handles what, so residents know where to turn."
      />
      <ContentSection band={0}>
        <p className="mb-10 max-w-3xl text-forest-mid">
          This is not an exhaustive list of each group&apos;s responsibilities.
          Canada Post is responsible for mailboxes and snow removal around the
          mailbox area.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {columns.map((column) => (
            <article
              key={column.title}
              className="border border-forest/12 bg-white/40 p-6"
            >
              <h2 className="font-display text-2xl text-forest-deep">
                {column.title}
              </h2>
              <div className="brick-rule mt-4" />
              {column.external ? (
                <a
                  href={column.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
                >
                  {column.cta} →
                </a>
              ) : (
                <Link
                  href={column.href}
                  className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
                >
                  {column.cta} →
                </Link>
              )}
              <ul className="mt-6">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-forest/10 py-3.5 text-[0.95rem] leading-relaxed text-forest-mid last:border-b-0 last:pb-0 first:pt-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ContentSection>
    </>
  );
}
