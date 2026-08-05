"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { linkify } from "@/components/ExpandableText";
import type {
  DesignGuideline,
  DesignGuidelineCategory,
} from "@/lib/knack";

type Props = {
  categories: DesignGuidelineCategory[];
  error?: string | null;
};

export function DesignGuidelinesGuide({ categories, error }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const searching = needle.length > 0;

    return categories
      .map((category) => {
        // While searching, always look across every category.
        if (
          !searching &&
          activeCategory !== "all" &&
          category.id !== activeCategory
        ) {
          return { ...category, guidelines: [] as DesignGuideline[] };
        }

        const guidelines = category.guidelines.filter((item) => {
          if (!searching) return true;
          const haystack = [
            item.title,
            item.description,
            item.category,
            ...item.files.map((file) => file.filename),
          ]
            .join("\n")
            .toLowerCase();
          return haystack.includes(needle);
        });

        return { ...category, guidelines };
      })
      .filter((category) => category.guidelines.length > 0);
  }, [categories, deferredQuery, activeCategory]);

  const totalVisible = filtered.reduce(
    (sum, category) => sum + category.guidelines.length,
    0,
  );
  const searching = deferredQuery.trim().length > 0;

  if (error) {
    return (
      <p className="border border-brick/30 bg-parchment/70 px-5 py-4 text-sm text-brick-deep">
        {error}
      </p>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-forest-mid">
        Design guidelines are not available right now.
      </p>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-12">
      <aside className="lg:sticky lg:top-28">
        <p className="text-xs uppercase tracking-[0.22em] text-brick">Browse</p>
        <h2 className="font-display mt-2 text-2xl text-forest-deep">
          Find a Guideline
        </h2>
        <div className="brick-rule mt-3" />

        <label className="mt-6 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-forest-mid">
            Search
          </span>
          <input
            type="text"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Roof, fencing, setbacks…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition placeholder:text-forest-mid/60 focus:border-brick"
          />
        </label>

        <nav
          className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          aria-label="Guideline categories"
        >
          <CategoryButton
            label="All"
            active={!searching && activeCategory === "all"}
            onClick={() => {
              setQuery("");
              setActiveCategory("all");
            }}
            count={categories.reduce((n, c) => n + c.guidelines.length, 0)}
          />
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              label={category.shortLabel}
              active={!searching && activeCategory === category.id}
              onClick={() => {
                setQuery("");
                setActiveCategory(category.id);
              }}
              count={category.guidelines.length}
            />
          ))}
        </nav>

        <div className="mt-8 hidden border-t border-forest/15 pt-6 lg:block">
          <p className="text-xs uppercase tracking-[0.18em] text-forest-mid">
            Related
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <Link
              href="/need-a-new-roof"
              className="text-sm text-brick transition hover:text-brick-deep"
            >
              Need a new roof? →
            </Link>
            <Link
              href="/design-guidelines-variance"
              className="btn btn-brick w-full"
            >
              Request a Variance
            </Link>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brick">
              Guidelines
            </p>
            <h2 className="font-display mt-2 text-3xl text-forest-deep">
              {searching
                ? "Search results"
                : activeCategory === "all"
                  ? "All registered standards"
                  : categories.find((c) => c.id === activeCategory)?.name ||
                    "Guidelines"}
            </h2>
            <p className="mt-2 text-sm text-forest-mid">
              {totalVisible} guideline{totalVisible === 1 ? "" : "s"}
              {searching ? ` matching “${deferredQuery.trim()}”` : ""}. Open an
              item for the full wording and downloads.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:hidden">
            <Link href="/need-a-new-roof" className="btn btn-outline">
              New roof
            </Link>
            <Link href="/design-guidelines-variance" className="btn btn-brick">
              Request a Variance
            </Link>
          </div>
        </div>

        <label className="mb-6 block lg:hidden">
          <span className="sr-only">Search guidelines</span>
          <input
            type="text"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Search roofs, fencing, setbacks…"
            autoComplete="off"
            className="w-full border border-forest/20 bg-white/70 px-3 py-2.5 text-sm text-forest-deep outline-none transition placeholder:text-forest-mid/60 focus:border-brick"
          />
        </label>

        {totalVisible === 0 ? (
          <p className="border border-forest/15 bg-white/40 px-5 py-6 text-sm text-forest-mid">
            No guidelines match that search. Try a broader term like “roof”,
            “fence”, or “setback”.
          </p>
        ) : (
          <div className="space-y-10">
            {filtered.map((category) => (
              <section key={category.id} id={category.id}>
                {searching || activeCategory === "all" ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.18em] text-brick">
                      {category.shortLabel}
                    </p>
                    <h3 className="font-display mt-1 text-2xl text-forest-deep">
                      {category.name}
                    </h3>
                    <div className="brick-rule mt-3" />
                  </>
                ) : null}

                <div
                  className={`divide-y divide-forest/15 border-y border-forest/15 ${
                    searching || activeCategory === "all" ? "mt-5" : ""
                  }`}
                >
                  {category.guidelines.map((item) => (
                    <GuidelineItem key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border px-3 py-2 text-left text-sm transition lg:w-full ${
        active
          ? "border-brick bg-brick text-cream-text"
          : "border-forest/15 bg-white/50 text-forest-deep hover:border-brick/50"
      }`}
    >
      <span className="block leading-snug">{label}</span>
      <span
        className={`mt-0.5 block text-[0.65rem] uppercase tracking-[0.14em] ${
          active ? "text-cream-text/75" : "text-forest-mid"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function GuidelineItem({ item }: { item: DesignGuideline }) {
  return (
    <details className="group py-1">
      <summary className="cursor-pointer list-none py-4 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="font-display text-xl leading-snug text-forest-deep sm:text-2xl">
              {titleCaseGuideline(item.title)}
            </h4>
            {item.description ? (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-forest-mid group-open:hidden">
                {item.description}
              </p>
            ) : null}
          </div>
          <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.16em] text-brick">
            <span className="group-open:hidden">Open</span>
            <span className="hidden group-open:inline">Close</span>
          </span>
        </div>
      </summary>

      <div className="pb-5">
        {item.description ? (
          <div className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-forest-mid">
            {linkify(item.description)}
          </div>
        ) : (
          <p className="text-sm text-forest-mid">
            No additional description is attached to this guideline.
          </p>
        )}

        {item.files.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {item.files.map((file) => (
              <a
                key={`${item.id}-${file.url}`}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
              >
                Download {shortFilename(file.filename)} →
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function titleCaseGuideline(title: string) {
  if (title !== title.toUpperCase() || title.length < 8) return title;
  return title
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortFilename(filename: string) {
  if (filename.length <= 28) return filename;
  const ext = filename.includes(".")
    ? filename.slice(filename.lastIndexOf("."))
    : "";
  return `${filename.slice(0, 20)}…${ext}`;
}
