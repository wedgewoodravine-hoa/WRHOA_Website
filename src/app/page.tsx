import Image from "next/image";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { HomeUpdatesSection } from "@/components/HomeUpdatesSection";
import { SectionBand } from "@/components/SectionBand";
import { fetchHomeUpdates, type HomeUpdates } from "@/lib/knack";
import { site } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  let updates: HomeUpdates = {
    news: [],
    upcoming: [],
    upcomingIsFuture: true,
    newsletters: [],
  };
  let updatesError: string | null = null;

  try {
    updates = await fetchHomeUpdates();
  } catch {
    updatesError = "Community updates could not be loaded right now.";
  }

  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden md:min-h-[75svh]">
        <div className="absolute inset-0">
          <Image
            src="/images/FountainNEW.jpg"
            alt="Wedgewood Ravine fountain with brick pillars and evergreen backdrop"
            fill
            priority
            className="hero-ken object-cover brightness-[1.06] contrast-[1.05]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(44, 33, 27, 0.58) 0%, rgba(44, 33, 27, 0.32) 32%, rgba(44, 33, 27, 0.1) 52%, transparent 72%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-12 md:min-h-[75svh] lg:px-8 lg:pb-14">
          <div className="hero-copy-glow max-w-3xl">
            <h1 className="hero-text-shadow animate-fade-up font-display text-5xl leading-[0.95] text-cream-text sm:text-6xl md:text-7xl">
              {site.name}
            </h1>
            <p className="hero-text-shadow animate-fade-up-delay-1 mt-4 max-w-xl text-base leading-relaxed text-cream-text/90 sm:text-lg">
              A quiet, well-kept community of {site.homes} homes, shaped by
              ravine landscape, brick craftsmanship, and lasting architectural
              character.
            </p>
            <div className="animate-fade-up-delay-2 mt-7 flex flex-wrap gap-3">
              <Link href="/my-hoa" className="btn btn-brick tracking-[0.16em]">
                Enter My HOA
              </Link>
              <Link href="/our-community" className="btn btn-ghost tracking-[0.16em]">
                Explore the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContentSection
        band={0}
        className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-brick">The place</p>
          <h2 className="font-display mt-3 text-3xl text-forest-deep sm:text-4xl">
            Distinct by design.
          </h2>
          <div className="brick-rule mt-5" />
          <p className="prose-hoa mt-6 max-w-xl text-base">
            Wedgewood Ravine is a beautiful, quiet, well-kept community in South
            West Edmonton. Homes are bound by design guidelines that protect the
            neighborhood&apos;s character, from cedar and clay roofs to carefully
            considered materials and a landscape that still feels like a ravine
            settlement.
          </p>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden border border-forest/15 shadow-[0_24px_60px_rgba(28,23,20,0.12)]">
          <Image
            src="/images/hero-aerial.jpg"
            alt="Aerial view of the Wedgewood Ravine fountain plaza"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </ContentSection>

      <SectionBand band="forest-deep" className="text-cream-text">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              title: "Pay HOA Fees",
              body: "Manage dues online through the homeowner portal.",
              href: "/pay-hoa-fees",
            },
            {
              title: "Design Guidelines",
              body: "Review materials, roofing, and exterior standards.",
              href: "/design-guidelines",
            },
            {
              title: "Contact the Board",
              body: "Reach HOA representatives as a resident or buyer.",
              href: "/contact",
            },
          ].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-white/10 bg-white/5 p-6 transition hover:border-gold/50 hover:bg-white/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-gold">
                Resident tools
              </div>
              <h3 className="font-display mt-3 text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-text/75">
                {item.body}
              </p>
              <span className="mt-5 inline-block text-xs uppercase tracking-[0.16em] text-clay transition group-hover:translate-x-1">
                Continue →
              </span>
            </Link>
          ))}
        </div>
      </SectionBand>

      <ContentSection band={1}>
        <HomeUpdatesSection updates={updates} error={updatesError} />
      </ContentSection>
    </>
  );
}
