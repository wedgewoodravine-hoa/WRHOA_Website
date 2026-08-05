import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection } from "@/components/ContentSection";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Gazebo Booking" };

export default function GazeboBookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Amenities"
        title="Gazebo Booking"
        description="Reserve the community gazebo. Residents and non-residents follow different booking paths."
      />
      <ContentSection band={0} className="grid gap-6 md:grid-cols-2">
        <Link
          href="/gazebo-booking/homeowner"
          className="group border border-forest/15 bg-white/45 p-8 transition hover:border-brick/40"
        >
          <h2 className="font-display text-3xl text-forest-deep">
            I&apos;m a Resident
          </h2>
          <p className="mt-4 text-sm text-forest-mid">
            Book the gazebo as a Wedgewood Ravine homeowner or resident.
          </p>
          <span className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-brick transition group-hover:translate-x-1">
            Continue →
          </span>
        </Link>
        <Link
          href="/gazebo-booking/non-homeowner"
          className="group border border-forest/15 bg-white/45 p-8 transition hover:border-brick/40"
        >
          <h2 className="font-display text-3xl text-forest-deep">
            I&apos;m Not a Resident
          </h2>
          <p className="mt-4 text-sm text-forest-mid">
            Request a booking if you live outside Wedgewood Ravine.
          </p>
          <span className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-brick transition group-hover:translate-x-1">
            Continue →
          </span>
        </Link>
      </ContentSection>
    </>
  );
}
