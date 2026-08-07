"use client";

import { ExpandableText } from "@/components/ExpandableText";
import type { HoaNewsItem } from "@/lib/knack";

type Props = {
  updates: HoaNewsItem[];
  error?: string | null;
};

export function ParkDevelopmentSection({ updates, error }: Props) {
  const links = uniqueLinks(updates);
  const files = uniqueFiles(updates);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.7fr)] lg:gap-14">
      <div>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-brick">
            Updates
          </p>
          <h2 className="font-display mt-2 text-3xl text-forest-deep sm:text-4xl">
            Development news
          </h2>
          <div className="brick-rule mt-4" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid">
            Notices and announcements about the townhouse development.
          </p>
        </div>

        {error ? (
          <p className="border border-brick/30 bg-parchment/70 px-5 py-4 text-sm text-brick-deep">
            {error}
          </p>
        ) : null}

        {!error && updates.length === 0 ? (
          <p className="text-sm text-forest-mid">
            No development updates are available right now.
          </p>
        ) : null}

        {updates.length > 0 ? (
          <div className="divide-y divide-forest/15 border-y border-forest/15">
            {updates.map((item, index) => (
              <UpdateItem key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : null}
      </div>

      <aside className="flex flex-col gap-10 lg:pt-2">
        <LinksPanel links={links} />
        <FilesPanel files={files} />
      </aside>
    </div>
  );
}

function UpdateItem({ item, index }: { item: HoaNewsItem; index: number }) {
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

function LinksPanel({
  links,
}: {
  links: Array<{ url: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-brick">Resources</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">Links</h3>
      <div className="brick-rule mt-3" />

      {links.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-forest-mid">
          Related links will appear here as they are posted with updates.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
          {links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-white/40"
              >
                <span className="min-w-0 text-sm leading-snug text-forest-deep">
                  {link.label}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-brick">
                  Open →
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilesPanel({
  files,
}: {
  files: Array<{ url: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-brick">Files</p>
      <h3 className="font-display mt-2 text-2xl text-forest-deep">Downloads</h3>
      <div className="brick-rule mt-3" />

      {files.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-forest-mid">
          Documents will appear here as they are posted with updates.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
          {files.map((file) => (
            <li key={file.url}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-4 py-3.5 transition hover:bg-white/40"
              >
                <span className="min-w-0 text-sm leading-snug text-forest-deep">
                  {file.label}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-brick">
                  PDF →
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function uniqueLinks(updates: HoaNewsItem[]) {
  const seen = new Set<string>();
  const links: Array<{ url: string; label: string }> = [];

  for (const item of updates) {
    if (!item.link?.url || seen.has(item.link.url)) continue;
    seen.add(item.link.url);
    links.push({
      url: item.link.url,
      label: item.link.label === "Open link" ? item.title : item.link.label,
    });
  }

  return links;
}

function uniqueFiles(updates: HoaNewsItem[]) {
  const seen = new Set<string>();
  const files: Array<{ url: string; label: string }> = [];

  for (const item of updates) {
    if (!item.file?.url || seen.has(item.file.url)) continue;
    seen.add(item.file.url);
    files.push({
      url: item.file.url,
      label: item.title,
    });
  }

  return files;
}
