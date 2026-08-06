import { site } from "@/lib/site";

export type ContactFaqLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ContactFaqItem = {
  question: string;
  answer: string;
  links?: ContactFaqLink[];
};

export type ContactRoute = {
  title: string;
  summary: string;
  href: string;
  cta: string;
  external?: boolean;
};

export const contactRoutes: ContactRoute[] = [
  {
    title: "Home Owners Association",
    summary:
      "Annual dues, design guidelines, restrictive covenants, fountain operations, and HOA common-area maintenance.",
    href: "#hoa-contact",
    cta: "Choose a contact form",
  },
  {
    title: "Community League",
    summary:
      "Parks, tennis and pickleball, gazebo bookings, community gardens, memberships, and neighbourhood events.",
    href: site.communityLeagueUrl,
    cta: "Visit wedgewoodcl.ca",
    external: true,
  },
  {
    title: "City of Edmonton",
    summary:
      "Roads, street lights, snow removal, garbage and recycling, city bylaws, dumping, and public safety.",
    href: site.city311Url,
    cta: "Report via 311",
    external: true,
  },
];

export const contactFaq: ContactFaqItem[] = [
  {
    question: "Who should I contact — HOA, Community League, or the City?",
    answer:
      "The HOA handles dues, design guidelines, covenants, the fountain, and certain common-area maintenance. The Community League runs parks, courts, gazebo bookings, gardens, and social events. The City of Edmonton handles roads, lights, snow, waste, bylaws, and city-owned land. See Who Does What for the full breakdown.",
    links: [
      { label: "Who Does What", href: "/who-does-what" },
      {
        label: "Community League",
        href: site.communityLeagueUrl,
        external: true,
      },
      { label: "City 311", href: site.city311Url, external: true },
    ],
  },
  {
    question: "Parks, tennis, pickleball, gazebo, gardens, or community events?",
    answer:
      "Those are Community League responsibilities, not the HOA. Book the gazebo, request court access, and find event details through the League site.",
    links: [
      {
        label: "Wedgewood Community League",
        href: site.communityLeagueUrl,
        external: true,
      },
      {
        label: "Tennis & Pickleball",
        href: site.tennisPickleballUrl,
        external: true,
      },
      {
        label: "Gazebo booking",
        href: site.gazeboBookingUrl,
        external: true,
      },
    ],
  },
  {
    question:
      "Potholes, street lights, snow, garbage, dumping, or city bylaws?",
    answer:
      "Contact the City of Edmonton through 311 for infrastructure, waste collection, snow on city roads, dumping, black knot fungus, and bylaw matters such as short-term rentals, noise, and RV or business vehicle parking on city property. Call emergency services for immediate safety concerns.",
    links: [
      { label: "311 Edmonton", href: site.city311Url, external: true },
    ],
  },
  {
    question: "Neighbour’s lawn, private trees, or driveway parking?",
    answer:
      "Issues on private property that fall under City bylaws (neglected yards, hazardous trees, illegal parking) should go to 311. Exterior changes that affect Wedgewood’s architectural standards are HOA design-guideline matters—use the Design Guidelines pages or the homeowner contact form.",
    links: [
      { label: "311 Edmonton", href: site.city311Url, external: true },
      { label: "Design Guidelines", href: "/design-guidelines" },
    ],
  },
  {
    question: "How do I pay my annual HOA dues?",
    answer:
      "Pay online through Pay HOA Fees using a credit or debit card. A personal PayPal account is not required. Cheque arrangements can be made with the HOA if online payment is not possible. Current amounts and deadlines are shown in the members portal when payment opens each spring.",
    links: [{ label: "Pay HOA Fees", href: "/pay-hoa-fees" }],
  },
  {
    question: "Roofs, fences, decks, or other exterior changes?",
    answer:
      "Review the Design Guidelines before starting work. Roof replacements have a dedicated page and approved materials list. If your project needs an exception, submit a Design Guidelines Variance application.",
    links: [
      { label: "Design Guidelines", href: "/design-guidelines" },
      { label: "Need a New Roof?", href: "/need-a-new-roof" },
      {
        label: "Design Guidelines Variance",
        href: "/design-guidelines-variance",
      },
    ],
  },
  {
    question: "Common areas, boulevards, fences, or the fountain?",
    answer:
      "The HOA maintains (paint only) fences, park areas, boulevards, facilities, and common walkways, and operates the fountain. Day-to-day management of parks, tennis courts, and related amenities has been assigned to the Community League—contact them for those issues.",
    links: [
      { label: "Contact the HOA", href: "/contact/homeowner" },
      {
        label: "Community League",
        href: site.communityLeagueUrl,
        external: true,
      },
    ],
  },
  {
    question: "I can’t log in or reset my HOA portal password.",
    answer:
      "Use the forgot-password link on the Pay HOA Fees / members sign-in screen and check junk mail for the reset email. If your address does not appear during signup or you still cannot get in, contact the HOA with your property address and the email you use for the account.",
    links: [
      { label: "Account Settings", href: "/account-settings" },
      { label: "Pay HOA Fees / sign in", href: "/pay-hoa-fees" },
      { label: "Contact the HOA", href: "/contact/homeowner" },
    ],
  },
  {
    question: "I’m a law office needing fee or closing confirmation.",
    answer:
      "Use the Legal / Real Estate Inquiry form on this Contact page. That form is for counsel requesting annual fee amount, payment period, paid or arrears status, and related closing documentation.",
    links: [
      {
        label: "Legal / Real Estate Inquiry",
        href: "/contact/legal",
      },
      { label: "Home Buyers & Sellers", href: "/home-buyers-sellers" },
    ],
  },
  {
    question: "What does the HOA not handle?",
    answer:
      "The HOA does not run Community League programs, city infrastructure, or municipal bylaw enforcement. If you are unsure after reading the FAQ, the Who Does What page lists typical responsibilities for the League, the HOA, and the City.",
    links: [{ label: "Who Does What", href: "/who-does-what" }],
  },
];
