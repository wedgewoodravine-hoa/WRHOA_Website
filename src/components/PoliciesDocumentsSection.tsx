"use client";

import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  fetchPoliciesDocuments,
  type PortalDocument,
  type PoliciesContent,
} from "@/lib/knack-session";

const POLICY_PROFILES = [
  "profile_5",
  "profile_6",
  "profile_19",
  "profile_70",
];

export function PoliciesDocumentsSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding
      allowedProfiles={POLICY_PROFILES}
      duesMessage="Policies, financials, and bylaws are available after HOA dues are paid in full."
      load={fetchPoliciesDocuments}
    >
      {(data) => <PoliciesGroups content={data} />}
    </HoaAuthPortal>
  );
}

function PoliciesGroups({ content }: { content: PoliciesContent }) {
  const groups: Array<{
    eyebrow: string;
    title: string;
    empty: string;
    items: PortalDocument[];
  }> = [
    {
      eyebrow: "Policies",
      title: "Policies & forms",
      empty: "No policy documents are posted right now.",
      items: content.policies,
    },
    {
      eyebrow: "Financials",
      title: "Financial statements",
      empty: "No financial documents are posted right now.",
      items: content.financials,
    },
    {
      eyebrow: "Bylaws",
      title: "Association bylaws",
      empty: "No bylaw documents are posted right now.",
      items: content.bylaws,
    },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
      {groups.map((group) => (
        <DocumentColumn key={group.eyebrow} {...group} />
      ))}
    </div>
  );
}

function DocumentColumn({
  eyebrow,
  title,
  empty,
  items,
}: {
  eyebrow: string;
  title: string;
  empty: string;
  items: PortalDocument[];
}) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.22em] text-brick">{eyebrow}</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">{title}</h3>
      <div className="brick-rule mt-3" />
      {items.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-forest-mid">{empty}</p>
      ) : (
        <ul className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
          {items.map((item) => (
            <li key={item.id}>
              {item.file ? (
                <a
                  href={item.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-white/40"
                >
                  <span className="min-w-0 text-sm leading-snug text-forest-deep">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-brick">
                    PDF →
                  </span>
                </a>
              ) : (
                <div className="py-3.5 text-sm text-forest-deep">{item.title}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
