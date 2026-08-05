import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-forest/15 bg-forest-deep text-cream-text">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="font-display text-3xl tracking-wide">{site.name}</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-text/75">
            A quiet, architecturally controlled community of {site.homes} homes
            in South West Edmonton, rooted in ravine landscape and lasting
            craftsmanship.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">
            Mailing address
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream-text/80">
            {site.address}
            <br />
            {site.city}
          </p>
          <p className="mt-2 text-xs text-cream-text/55">Mail correspondence only</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Quick links</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-cream-text/80">
            <Link href="/pay-hoa-fees" className="hover:text-white">
              Pay HOA Fees
            </Link>
            <Link href="/design-guidelines" className="hover:text-white">
              Design Guidelines
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <a
              href={site.communityLeagueUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Community League
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-cream-text/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
          <span className="tracking-[0.16em] uppercase">Est. community stewardship</span>
        </div>
      </div>
    </footer>
  );
}
