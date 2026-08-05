import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CommunityMap } from "@/components/CommunityMap";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";
import {
  fetchCommunityAmenities,
  groupAmenitiesByCategory,
  type CommunityAmenity,
} from "@/lib/knack";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Community",
};

export const revalidate = 300;

export default async function OurCommunityPage() {
  let amenities: CommunityAmenity[] = [];
  let error: string | null = null;

  try {
    amenities = await fetchCommunityAmenities();
  } catch {
    error = "Community amenities could not be loaded right now.";
  }

  const groups = groupAmenitiesByCategory(amenities);
  const location = amenities.find((item) => item.category === "Location");
  const amenityGroups = groups.filter(([category]) => category !== "Location");

  return (
    <>
      <PageHero
        eyebrow="Our Community"
        title="Welcome to Wedgewood Ravine"
        description="A quiet, architecturally controlled neighborhood shaped by ravine landscape, shared amenities, and lasting community stewardship."
      />

      <ContentSection
        band={0}
        className="grid w-full min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14"
      >
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.22em] text-brick">
            Location
          </p>
          <h2 className="font-display mt-3 text-3xl text-forest-deep sm:text-4xl">
            {location?.name ?? site.name}
          </h2>
          <div className="brick-rule mt-5" />
          {location?.description ? (
            <p className="mt-6 max-w-prose text-base leading-relaxed text-forest-mid">
              {location.description}
            </p>
          ) : (
            <p className="mt-6 max-w-prose text-base leading-relaxed text-forest-mid">
              {site.homes} homes in South West Edmonton, close to ravine trails,
              parks, and the everyday places that make neighborhood life easy.
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/who-does-what" className="btn btn-forest">
              Who Does What
            </Link>
            <Link href="/home-buyers-sellers" className="btn btn-outline">
              Buyers & Sellers
            </Link>
          </div>
        </div>

        <CommunityMap />
      </ContentSection>

      {error ? (
        <ContentSection band={1}>
          <p className="border border-brick/30 bg-parchment/70 px-5 py-4 text-sm text-brick-deep">
            {error}
          </p>
        </ContentSection>
      ) : null}

      {amenityGroups.map(([category, items], index) => (
        <ContentSection key={category} band={index + 1}>
          <div className="mb-8 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-brick">
              Explore
            </p>
            <h2 className="font-display mt-2 text-3xl text-forest-deep sm:text-4xl">
              {category}
            </h2>
            <div className="brick-rule mt-4" />
          </div>

          {category === "Amenities" ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <AmenityFeature key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-forest/15 border-y border-forest/15 bg-white/35">
              {items.map((item) => (
                <AmenityRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </ContentSection>
      ))}

      <ContentSection
        band="forest-deep"
        className="flex flex-col gap-6 text-cream-text sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            Community League
          </p>
          <h2 className="font-display mt-2 text-3xl">
            Events, courts, and neighborhood life
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-text/75">
            Recreation programming, court access, and many shared amenities are
            coordinated through the Wedgewood Community League.
          </p>
        </div>
        <a
          href={site.communityLeagueUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
        >
          Visit WedgewoodCL.ca
        </a>
      </ContentSection>
    </>
  );
}

function AmenityFeature({ item }: { item: CommunityAmenity }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden border border-forest/12 bg-mist/40">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-brick/15" />
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-2xl text-forest-deep">{item.name}</h3>
        {item.description ? (
          <p className="mt-2 text-sm leading-relaxed text-forest-mid">
            {item.description}
          </p>
        ) : null}
        {item.link ? (
          <a
            href={item.link.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
          >
            {item.link.label} →
          </a>
        ) : null}
      </div>
    </article>
  );
}

function AmenityRow({ item }: { item: CommunityAmenity }) {
  const content = (
    <>
      <div className="min-w-0">
        <h3 className="font-display text-xl text-forest-deep sm:text-2xl">
          {item.name}
        </h3>
        {item.description ? (
          <p className="mt-1 text-sm leading-relaxed text-forest-mid">
            {item.description}
          </p>
        ) : null}
      </div>
      {item.link ? (
        <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-brick">
          {item.link.label === item.name ? "Visit" : item.link.label} →
        </span>
      ) : null}
    </>
  );

  if (item.link) {
    return (
      <a
        href={item.link.url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-2 px-3 py-5 transition hover:bg-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      {content}
    </div>
  );
}
