import Link from "next/link";
import {
  contactFaq,
  contactRoutes,
  type ContactFaqItem,
  type ContactFaqLink,
  type ContactRoute,
} from "@/lib/contact-faq";

export function ContactRoutesSection() {
  return (
    <div>
      <h2 className="font-display text-3xl text-forest-deep sm:text-4xl">
        Who should you contact?
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid sm:text-base">
        Many messages sent to the HOA belong with the Community League or the
        City of Edmonton. Choosing the right contact gets your request handled
        sooner.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
        {contactRoutes.map((route) => (
          <RouteColumn key={route.title} route={route} />
        ))}
      </div>
    </div>
  );
}

export function ContactFaqSection() {
  return (
    <div id="common-questions" className="scroll-mt-28">
      <h2 className="font-display text-3xl text-forest-deep sm:text-4xl">
        Common questions
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-mid sm:text-base">
        Expand a question for next steps and links to the right form or agency.
      </p>

      <div className="mt-8 divide-y divide-forest/12 border-y border-forest/12">
        {contactFaq.map((item) => (
          <FaqItem key={item.question} item={item} />
        ))}
      </div>
    </div>
  );
}

function RouteColumn({ route }: { route: ContactRoute }) {
  const ctaClassName =
    "mt-5 inline-block text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep";

  const body = (
    <>
      <h3 className="font-display text-2xl text-forest-deep">{route.title}</h3>
      <div className="brick-rule mt-4" />
      <p className="mt-4 text-sm leading-relaxed text-forest-mid">
        {route.summary}
      </p>
      <span className={ctaClassName}>{route.cta} →</span>
    </>
  );

  const className = "group block";

  if (route.external) {
    return (
      <a
        href={route.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  if (route.href.startsWith("#")) {
    return (
      <a href={route.href} className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link href={route.href} className={className}>
      {body}
    </Link>
  );
}

function FaqItem({ item }: { item: ContactFaqItem }) {
  return (
    <details className="group transition-colors hover:bg-forest/[0.03]">
      <summary className="cursor-pointer list-none px-1 py-4 outline-none marker:content-none sm:px-2 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display min-w-0 text-lg leading-snug text-forest-deep sm:text-xl">
            {item.question}
          </h3>
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-base leading-none text-brick transition group-open:rotate-45"
          >
            +
          </span>
        </div>
      </summary>

      <div className="max-w-3xl px-1 pb-5 sm:px-2">
        <p className="text-sm leading-relaxed text-forest-mid">{item.answer}</p>
        {item.links && item.links.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {item.links.map((link) => (
              <FaqLink key={`${item.question}-${link.href}`} link={link} />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function FaqLink({ link }: { link: ContactFaqLink }) {
  const className =
    "text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label} →
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label} →
    </Link>
  );
}
