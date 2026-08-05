/** Knack contact form metadata (from WRHOA Members Area app). */

export type KnackPrefill = {
  viewKey: string;
  values: Record<string, string | string[]>;
};

export const NON_HOMEOWNER_CONTACT_VIEW = "view_456";
export const HOMEOWNER_CONTACT_VIEW = "view_458";

export const NON_HOMEOWNER_CONTACT_SCENE = "scene_248";
export const HOMEOWNER_CONTACT_SCENE = "scene_249";

/** Support Category (field_114) option for lawyer / realtor closing requests. */
export const LEGAL_DOCUMENTATION_CATEGORY =
  "HOA Documentation Requests (Lawyers & Real Estate)";

export const COMMUNITY_LEAGUE_CATEGORY =
  "Community League (park, tennis court, playground, etc.)";

export const SUPPORT_CATEGORIES = [
  "Restrictive Covenant & Design Guidelines",
  "Annual Fee Payment",
  COMMUNITY_LEAGUE_CATEGORY,
  "City Bylaws",
  LEGAL_DOCUMENTATION_CATEGORY,
  "Website Technical Support",
  "Lawn Maintenance",
  "Other",
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

export const LEGAL_REPRESENT_OPTIONS = [
  "Seller",
  "Purchaser",
  "Seller and Purchaser",
] as const;

export const LEGAL_CONFIRMATION_OPTIONS = [
  "Encumbrance/HOA Fees",
  "Fiscal Year",
  "Arrears (if any)",
  "Confirmation if fees are paid in full",
  "Variance Approvals (if applicable)",
] as const;

export const LEGAL_CONTACT_PREFILL: KnackPrefill = {
  viewKey: NON_HOMEOWNER_CONTACT_VIEW,
  values: {
    field_114: LEGAL_DOCUMENTATION_CATEGORY,
  },
};

export function isLegalDocumentationCategory(category: string) {
  return category === LEGAL_DOCUMENTATION_CATEGORY;
}

export function isCommunityLeagueCategory(category: string) {
  return category === COMMUNITY_LEAGUE_CATEGORY;
}
