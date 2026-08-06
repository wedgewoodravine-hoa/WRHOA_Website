export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const site = {
  name: "Wedgewood Ravine",
  fullName: "Wedgewood Ravine Home Owners Association",
  shortName: "WRHOA",
  tagline: "An architecturally controlled community nestled in South West Edmonton.",
  address: "1003 Wedgewood Blvd. NW",
  city: "Edmonton, Alberta T6M 2L5",
  homes: 491,
  communityLeagueUrl: "https://www.wedgewoodcl.ca/",
  gazeboBookingUrl: "https://www.wedgewoodcl.ca/facilities/gazebo-booking",
  tennisPickleballUrl:
    "https://www.wedgewoodcl.ca/facilities/tennis-pickleball-courts",
  city311Url: "https://311.edmonton.ca/",
  map: {
    lat: 53.480391,
    lng: -113.6469448,
    zoom: 15,
  },
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Our Community",
    href: "/our-community",
    children: [
      { label: "Wedgewood Ravine", href: "/our-community" },
      { label: "Home Buyers & Sellers", href: "/home-buyers-sellers" },
      { label: "Who Does What", href: "/who-does-what" },
      { label: "My League Membership Number", href: "/my-league-membership-number" },
      { label: "Community League", href: site.communityLeagueUrl, external: true },
      { label: "CL Admin Login", href: "/cl-admin-login" },
    ],
  },
  {
    label: "My HOA",
    href: "/my-hoa",
    children: [
      { label: "Pay HOA Fees", href: "/pay-hoa-fees" },
      { label: "Account Settings", href: "/account-settings" },
      { label: "Design Guidelines", href: "/design-guidelines" },
      { label: "Need a New Roof?", href: "/need-a-new-roof" },
      { label: "Design Guidelines Variance", href: "/design-guidelines-variance" },
      { label: "Home Buyers & Sellers", href: "/home-buyers-sellers" },
      { label: "Policies, Financials & Bylaws", href: "/policies-financials-bylaws" },
      { label: "Board Meeting Minutes", href: "/board-meeting-minutes" },
      { label: "Board Members", href: "/board-members" },
      { label: "Executive Login", href: "/executive-login" },
      { label: "Treasurer Login", href: "/treasurer-login" },
    ],
  },
  { label: "Townhall & AGM", href: "/townhall-agm" },
  { label: "Contact", href: "/contact" },
];

export type KnackScriptEmbed = {
  type: "script";
  appId: string;
  distributionKey: string;
  /** Start scene slug — synced to location.hash so SPA remounts load reliably */
  scene?: string;
};

export type KnackIframeEmbed = {
  type: "iframe";
  src: string;
  height?: number;
};

export type KnackEmbed = KnackScriptEmbed | KnackIframeEmbed;

const APP_ID = "6002c8a07f0a19001bd7ee6d";

export function knackScript(
  distributionKey: string,
  scene?: string,
): KnackScriptEmbed {
  return {
    type: "script",
    appId: APP_ID,
    distributionKey,
    ...(scene ? { scene } : {}),
  };
}

export function knackIframe(path: string, height = 1000): KnackIframeEmbed {
  return {
    type: "iframe",
    src: `https://wedgewood.knack.com/wedgewood-hoa-portal#${path}`,
    height,
  };
}

export const embeds = {
  homeNews: knackIframe("hoa-homepage-news/", 1200),
  ourCommunity: knackScript("dist_6"),
  clAdminLogin: knackScript("dist_32"),
  designGuidelines: knackIframe("design-guidelines/", 1000),
  varianceApplication: knackScript("dist_33"),
  policiesFinancialsBylaws: knackIframe("policies-bylaws-financials/", 1000),
  boardMeetingMinutes: knackIframe("public-meeting-minutes/", 1000),
  boardMembers: knackScript("dist_22"),
  executiveLogin: knackIframe("board-member-portal2/", 2000),
  treasurerLogin: knackIframe("treasurer-login/manage-dues/", 2000),
  townhallAgm: knackIframe("town-hall--agm/", 3000),
  homeownerContact: knackScript("dist_4", "contact-homeowner"),
  nonHomeownerContact: knackScript("dist_5", "contact-non-homeowner"),
  newHomeownerRegistration: knackScript("dist_34"),
  gazeboHomeowner: knackScript("dist_7"),
  gazeboNonHomeowner: knackScript("dist_8"),
  tennisPickleball: knackScript("dist_9"),
  courtAccessResident: knackScript("dist_10"),
  courtAccessNonResident: knackScript("dist_11"),
  volunteer: knackScript("dist_12"),
  events: knackScript("dist_3"),
  newsletters: knackScript("dist_19"),
  hoaNews: knackScript("dist_21"),
  boardMeetingsPrivate: knackIframe("board-member-meetings/", 1200),
} as const;

export const hoaResponsibilities = [
  "Maintain (paint only) fences, park areas, boulevards, facilities, and common walkways/areas",
  "Carry out all duties & functions under the easements, restrictive covenants & bylaws",
  "Maintain & promote the distinct nature & location of the subdivision while protecting property values",
  "Provide for recreation of members by leasing or constructing various amenities",
  "Manage and collect fees, assessments & other charges levied against lot owners",
  "Publish HOA newsletters and operate wedgewood.ca",
  "Fountain operations",
  "Note: management & supervision of park areas, tennis courts and other amenities have been assigned to the Community League",
];

export const whoDoesWhat = {
  communityLeague: [
    "Coordinate recreational and social activities",
    "Memberships",
    "Park enhancements & programs",
    "Tennis/Pickleball court maintenance/operations",
    "Community events (Light Up Wedgewood, Food Truck Days, Garage Sale, Block Parties, etc.)",
    "Gazebo bookings",
    "Fundraising (Casino)",
    "Community gardens",
    "Communications (WedgewoodCL.ca, Facebook, CommuniBee App)",
    "City of Edmonton Parks/Recreation liaison",
    "Edmonton Federation of Community League liaison",
  ],
  hoa: [
    "Maintain (paint only) fences, park areas, boulevards, facilities, in common walkways/area",
    "Carry out duties under easements, restrictive covenants & bylaws",
    "Maintain & promote the distinct nature of the subdivision and property values",
    "Manage and collect fees, assessments & other charges",
    "Publish HOA newsletters",
    "Operate wedgewood.ca",
    "Fountain operations",
  ],
  city: [
    "Manage City-owned property & assets",
    "Street & walkway lights",
    "Roads, concrete curbs, and landscaped islands",
    "Potholes, grass areas, sewers, paths",
    "Snow removal, garbage & recycle collection",
    "Black knot fungus, rental homes, dumping in the ravine",
    "City bylaws, RV & business vehicle parking complaints",
    "Emergency procedures, busing, policing & public security",
  ],
};
