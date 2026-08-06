import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import { hoaResponsibilities } from "@/lib/site";

export const metadata: Metadata = {
  title: "My HOA",
};

const links = [
  { href: "/pay-hoa-fees", label: "Pay HOA Fees" },
  { href: "/account-settings", label: "Account Settings" },
  { href: "/design-guidelines", label: "Design Guidelines" },
  { href: "/policies-financials-bylaws", label: "Policies, Financials & Bylaws" },
  { href: "/townhall-agm", label: "Town Hall & AGM" },
  { href: "/board-meeting-minutes", label: "Board Meeting Minutes" },
  { href: "/board-members", label: "Board Members" },
];

export default function MyHoaPage() {
  return (
    <>
      <PageHero
        eyebrow="My HOA"
        title="Wedgewood Ravine Homeowners Association"
        description="Resources for residents, board materials, and the day-to-day stewardship of our community."
      />
      <ContentSection band={0} className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between border border-forest/15 bg-white/50 px-4 py-3 text-sm uppercase tracking-[0.12em] text-forest-deep transition hover:border-brick/40 hover:bg-parchment/60"
            >
              <span>{link.label}</span>
              <span className="text-brick">→</span>
            </Link>
          ))}
        </aside>
        <div className="prose-hoa">
          <p>
            We are thankful for the residents who volunteer their time on the
            Homeowners Association, Community League, and special committees.
            Your involvement makes our community stronger. If you are interested
            in serving on the executive or a committee, please{" "}
            <Link href="/contact">contact us</Link>.
          </p>
          <h2 className="font-display mt-10 text-3xl text-forest-deep">
            HOA Responsibilities
          </h2>
          <div className="brick-rule mt-4" />
          <ul className="mt-6">
            {hoaResponsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </ContentSection>
    </>
  );
}
