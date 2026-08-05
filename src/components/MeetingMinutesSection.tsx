"use client";

import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  fetchMeetingMinutes,
  type PortalDocument,
} from "@/lib/knack-session";

const MINUTES_PROFILES = [
  "profile_5",
  "profile_6",
  "profile_19",
  "profile_67",
  "profile_70",
];

export function MeetingMinutesSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding={false}
      allowedProfiles={MINUTES_PROFILES}
      description="Enter the email and password for your HOA portal account to view public board meeting minutes."
      load={fetchMeetingMinutes}
    >
      {(items) => <MinutesList items={items} />}
    </HoaAuthPortal>
  );
}

function MinutesList({ items }: { items: PortalDocument[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-forest-mid">
        No public meeting minutes are posted right now.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-forest/15 border-y border-forest/15">
      {items.map((item) => (
        <li key={item.id}>
          {item.file ? (
            <a
              href={item.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 py-4 transition hover:bg-white/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="min-w-0">
                {item.dateLabel ? (
                  <time
                    dateTime={item.dateISO}
                    className="text-xs uppercase tracking-[0.18em] text-forest-mid"
                  >
                    {item.dateLabel}
                  </time>
                ) : null}
                <p className="mt-1 text-sm font-medium leading-snug text-forest-deep sm:text-base">
                  {item.title}
                </p>
              </div>
              <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-brick">
                Download PDF →
              </span>
            </a>
          ) : (
            <div className="py-4">
              {item.dateLabel ? (
                <time
                  dateTime={item.dateISO}
                  className="text-xs uppercase tracking-[0.18em] text-forest-mid"
                >
                  {item.dateLabel}
                </time>
              ) : null}
              <p className="mt-1 text-sm font-medium text-forest-deep">
                {item.title}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
