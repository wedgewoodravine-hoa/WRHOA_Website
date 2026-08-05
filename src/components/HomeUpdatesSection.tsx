"use client";

import { ExpandableText } from "@/components/ExpandableText";
import type { HoaNewsItem, HoaNewsletter, HomeUpdates } from "@/lib/knack";

type Props = {
  updates: HomeUpdates;
  error?: string | null;
};

export function HomeUpdatesSection({ updates, error }: Props) {
  const { news, upcoming, upcomingIsFuture, newsletters } = updates;
  const hasContent = news.length > 0 || upcoming.length > 0 || newsletters.length > 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.7fr)] lg:gap-14">
      <div>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brick">Updates</p>
            <h2 className="font-display mt-2 text-3xl text-forest-deep">
              Community news
            </h2>
            <div className="brick-rule mt-4" />
          </div>
          <p className="max-w-md text-sm text-forest-mid">
            Notices and announcements from the HOA portal.
          </p>
        </div>

        {error ? (
          <p className="border border-brick/30 bg-parchment/70 px-5 py-4 text-sm text-brick-deep">
            {error}
          </p>
        ) : null}

        {!error && !hasContent ? (
          <p className="text-sm text-forest-mid">
            No community updates are available right now.
          </p>
        ) : null}

        {news.length > 0 ? (
          <div className="divide-y divide-forest/15 border-y border-forest/15">
            {news.map((item, index) => (
              <NewsItem key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : null}
      </div>

      <aside className="flex flex-col gap-10 lg:pt-2">
        <UpcomingPanel items={upcoming} isFuture={upcomingIsFuture} />
        <NewslettersPanel items={newsletters} />
      </aside>
    </div>
  );
}

function NewsItem({ item, index }: { item: HoaNewsItem; index: number }) {
  return (
    <article
      className="py-6 first:pt-5 last:pb-5"
      style={{ animationDelay: `${Math.min(index, 5) * 0.06}s` }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {item.dateLabel ? (
          <time
            dateTime={item.dateISO}
            className="text-xs uppercase tracking-[0.18em] text-forest-mid"
          >
            {item.dateLabel}
          </time>
        ) : null}
        <span className="text-xs uppercase tracking-[0.18em] text-brick">
          {item.category}
        </span>
      </div>
      <h3 className="font-display mt-2 text-2xl leading-snug text-forest-deep">
        {item.title}
      </h3>
      {item.message ? (
        <ExpandableText text={item.message} className="mt-3 max-w-2xl" />
      ) : null}
      {(item.link || item.file) && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {item.link ? (
            <a
              href={item.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
            >
              {item.link.label} →
            </a>
          ) : null}
          {item.file ? (
            <a
              href={item.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
            >
              Download PDF →
            </a>
          ) : null}
        </div>
      )}
    </article>
  );
}

function UpcomingPanel({
  items,
  isFuture,
}: {
  items: HoaNewsItem[];
  isFuture: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-brick">Calendar</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">
        {isFuture ? "Upcoming" : "Recent dates"}
      </h3>
      <div className="brick-rule mt-3" />

      {items.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-forest-mid">
          No dated events right now. Check back as new notices are posted.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="w-14 shrink-0 pt-0.5 text-center">
                <div className="text-[0.65rem] uppercase tracking-[0.16em] text-brick">
                  {monthLabel(item.dateISO)}
                </div>
                <div className="font-display text-2xl leading-none text-forest-deep">
                  {dayLabel(item.dateISO)}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] text-forest-mid">
                  {item.category}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-forest-deep">
                  {item.title}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewslettersPanel({ items }: { items: HoaNewsletter[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-brick">Files</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">Newsletters</h3>
      <div className="brick-rule mt-3" />
      <ul className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.file!.url}
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
          </li>
        ))}
      </ul>
    </div>
  );
}

function monthLabel(iso?: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    timeZone: "America/Edmonton",
  }).format(new Date(iso));
}

function dayLabel(iso?: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    timeZone: "America/Edmonton",
  }).format(new Date(iso));
}
