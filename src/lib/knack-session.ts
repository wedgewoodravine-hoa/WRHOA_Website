export const KNACK_APP_ID = "6002c8a07f0a19001bd7ee6d";
export const KNACK_LIVE_APP_URL =
  "https://wedgewood.knack.com/wedgewood-hoa-portal";

/** Town Hall & AGM embed — same app login + scene filters as the live portal. */
const SESSION_PROBE_DIST = "dist_17";

const AGM_SCENE = "scene_268";
const TOWNHALL_VIEW = "view_728";
const AGM_VIEW = "view_786";

const POLICIES_SCENE = "scene_266";
const POLICIES_VIEW = "view_737";
const MINUTES_SCENE = "scene_443";
const MINUTES_VIEW = "view_831";

const MEMBERSHIP_SCENE = "scene_422";
const MEMBERSHIP_DETAILS_VIEW = "view_771";
const MEMBERSHIP_HOUSEHOLD_VIEW = "view_778";

const DUES_SCENE = "scene_3";
const CURRENT_DUES_VIEW = "view_4";
const PAID_DUES_VIEW = "view_34";
const DUES_PROPERTIES_VIEW = "view_139";

const ACCOUNT_SCENE = "scene_76";
const ACCOUNT_DETAILS_VIEW = "view_137";
const ACCOUNT_EDIT_SCENE = "scene_77";
const ACCOUNT_EDIT_VIEW = "view_138";
const ACCOUNT_SETTINGS_SCENE = "scene_70";
const ACCOUNT_SETTINGS_VIEW = "view_120";

const PAY_HOA_DISTRIBUTION = "dist_25";
const PAY_HOA_PAYMENT_HASH = "homeowner-portal/payment";

const DEFAULT_HOMEOWNER_PROFILES = ["profile_5", "profile_6"];
const SESSION_KEY = "wrhoa-knack-session";
const REFRESH_TOKEN_KEY = `refreshToken-${KNACK_APP_ID}`;
const REFRESH_USER_KEY = `refreshToken-user-${KNACK_APP_ID}`;
const REMEMBER_COOKIE_KEY = `${KNACK_APP_ID}-remember-me`;
/** Set on intentional sign-out so we do not rehydrate from a lingering Knack runtime. */
const LOGOUT_FLAG_KEY = "wrhoa-knack-logged-out";

export type CommunityLink = {
  url: string;
  label: string;
};

export type HoaFile = {
  url: string;
  filename: string;
};

export type TownhallAgmItem = {
  id: string;
  title: string;
  category: string;
  dateISO?: string;
  dateLabel?: string;
  message: string;
  link?: CommunityLink;
  file?: HoaFile;
};

export type TownhallAgmContent = {
  townhalls: TownhallAgmItem[];
  agms: TownhallAgmItem[];
};

export type PortalDocument = {
  id: string;
  title: string;
  category?: string;
  dateISO?: string;
  dateLabel?: string;
  file?: HoaFile;
};

export type PoliciesContent = {
  policies: PortalDocument[];
  financials: PortalDocument[];
  bylaws: PortalDocument[];
};

export type LeagueMembershipContent = {
  seasonTitle: string;
  expiresLabel: string;
  owner?: string;
  owner2?: string;
  membershipNumber?: string;
  /** Property record id for view_778 updates (inline-editable household field). */
  householdRecordId?: string;
  additionalMembers: string[];
  cardImageSrc: string;
};

export type HoaPropertySummary = {
  id: string;
  address?: string;
  totalPayableLabel?: string;
};

export type HoaDueItem = {
  id: string;
  amountLabel?: string;
  propertyLabel?: string;
  yearLabel?: string;
  earlyBirdDeadlineLabel?: string;
  dueDateLabel?: string;
  customDueDateLabel?: string;
  description?: string;
  paymentUrl: string;
};

export type HoaPaidDueItem = {
  id: string;
  propertyLabel?: string;
  yearLabel?: string;
  paypalAmountLabel?: string;
  paypalDateLabel?: string;
  chequeAmountLabel?: string;
  chequeDateLabel?: string;
};

export type PayHoaFeesContent = {
  notice: string;
  properties: HoaPropertySummary[];
  currentDues: HoaDueItem[];
  paidDues: HoaPaidDueItem[];
  account?: HomeownerAccount;
  paymentDistributionKey: string;
};

export type HomeownerAddress = {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type HomeownerAccount = {
  id: string;
  propertyLabel?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  mailingSameAsProperty: boolean;
  mailingAddress: HomeownerAddress;
  secondOwnerFirstName: string;
  secondOwnerLastName: string;
  secondOwnerPhone: string;
  communicationAgreement: boolean;
};

export type HomeownerAccountUpdate = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  mailingSameAsProperty: boolean;
  mailingAddress: HomeownerAddress;
  secondOwnerFirstName: string;
  secondOwnerLastName: string;
  secondOwnerPhone: string;
  communicationAgreement: boolean;
};

export type HomeownerCredentialsUpdate = {
  email: string;
  password?: string;
};

export type KnackSessionUser = {
  id: string;
  token: string;
  email?: string;
  profile_keys?: string[];
  values?: Record<string, unknown>;
  refreshToken?: string;
};

export type AccessDecision = "ok" | "dues" | "denied";

type KnackLinkRaw = {
  url?: string;
  label?: string | null;
};

type KnackFileRaw = {
  url?: string;
  filename?: string;
};

type KnackDateRaw = {
  iso_timestamp?: string;
};

type AgmRecord = {
  id: string;
  field_311_raw?: string;
  field_565_raw?: string;
  field_131_raw?: string;
  field_564_raw?: KnackDateRaw | string | null;
  field_312_raw?: KnackLinkRaw | string | null;
  field_567_raw?: KnackFileRaw | string | null;
};

type PoliciesRecord = {
  id: string;
  field_311_raw?: string;
  field_565_raw?: string;
  field_567_raw?: KnackFileRaw | string | null;
};

type MinutesRecord = {
  id: string;
  field_218_raw?: string;
  field_264_raw?: KnackDateRaw | string | null;
  field_220_raw?: KnackFileRaw | string | null;
};

type MembershipRecord = {
  id: string;
  field_165_raw?: string;
  field_169_raw?: string;
  field_597_raw?: string;
  field_603_raw?: string;
};

type DuesRecord = {
  id: string;
  field_67_raw?: unknown;
  field_64_raw?: unknown;
  field_43_raw?: unknown;
  field_44_raw?: unknown;
  field_46_raw?: KnackDateRaw | string | null;
  field_47_raw?: KnackDateRaw | string | null;
  field_160_raw?: KnackDateRaw | string | null;
  field_172_raw?: string;
  field_74_raw?: unknown;
  field_75_raw?: unknown;
  field_77_raw?: KnackDateRaw | string | null;
  field_78_raw?: KnackDateRaw | string | null;
};

type DuesPropertyRecord = {
  id: string;
  field_8_raw?: unknown;
  field_350_raw?: unknown;
};

type HomeownerRecord = {
  id: string;
  field_19_raw?: unknown;
  field_20_raw?: unknown;
  field_34_raw?: unknown;
  field_35_raw?: unknown;
  field_36_raw?: unknown;
  field_39_raw?: unknown;
  field_40_raw?: unknown;
  field_102_raw?: unknown;
  field_155_raw?: unknown;
};

type RecordsResponse<T = AgmRecord> = {
  records?: T[];
};

type SessionResponse = {
  session?: {
    refreshToken?: string;
    user?: KnackSessionUser & {
      refreshToken?: string;
    };
  };
};

type RefreshResponse = {
  authorizationToken?: string;
  token?: string;
};

const TOWNHALL_CATEGORIES = [
  "Townhall Meeting Notice",
  "Townhall Files",
] as const;

const AGM_CATEGORIES = [
  "AGM Notice",
  "AGM Minutes",
  "AGM Files",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  "Townhall Meeting Notice": "Meeting links",
  "Townhall Files": "Files & recordings",
  "AGM Notice": "Registration",
  "AGM Minutes": "Minutes",
  "AGM Files": "Files & recordings",
};

declare global {
  interface Window {
    app_id?: string;
    distribution_key?: string;
    Knack?: {
      getUserToken?: () => string | null;
      getUser?: () => Promise<KnackSessionUser | null> | KnackSessionUser | null;
      ready?: Promise<unknown> | (() => Promise<unknown>);
      logout?: () => void;
      session?: { user?: KnackSessionUser | null };
      user?: {
        get?: (key: string) => unknown;
        set?: (attrs: Record<string, unknown>) => void;
        clear?: () => void;
        toJSON?: () => KnackSessionUser;
        destroy?: (options?: {
          success?: (...args: unknown[]) => void;
          error?: (...args: unknown[]) => void;
          wait?: boolean;
        }) => void;
        id?: string | null;
        attributes?: KnackSessionUser;
      };
    };
  }
}

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] || category;
}

export async function loginToKnack(
  email: string,
  password: string,
): Promise<KnackSessionUser> {
  clearLogoutFlag();

  const res = await fetch(
    `https://api.knack.com/v1/applications/${KNACK_APP_ID}/session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Knack-Application-Id": KNACK_APP_ID,
      },
      body: JSON.stringify({ email, password, remember: true }),
    },
  );

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Invalid email or password.");
    }
    throw new Error("Unable to sign in right now. Please try again.");
  }

  const data = (await res.json()) as SessionResponse;
  const user = data.session?.user;
  if (!user?.token) {
    throw new Error("Sign-in did not return a valid session.");
  }

  const normalized = normalizeUser({
    ...user,
    email: user.email || email,
    refreshToken: user.refreshToken || data.session?.refreshToken,
  });

  // Persist + push into any already-loaded Knack runtime/embed.
  saveSession(normalized);
  await applySessionToKnackRuntime(normalized);

  return normalized;
}

/**
 * Request Knack's native password-reset email (same as the login "Forgot?" link).
 */
export async function requestKnackPasswordReset(email: string): Promise<void> {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes("@")) {
    throw new Error("Enter a valid email address.");
  }

  const res = await fetch("https://api.knack.com/v1/users/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Knack-Application-Id": KNACK_APP_ID,
      "X-Knack-REST-API-KEY": "knack",
    },
    body: JSON.stringify({
      email: { email: trimmed },
      url: KNACK_LIVE_APP_URL,
    }),
  });

  if (res.status === 429) {
    throw new Error(
      "Too many password reset attempts. Please wait and try again.",
    );
  }

  if (!res.ok) {
    throw new Error("Unable to send a password reset email right now.");
  }
}

/**
 * Resolve an existing HOA/Knack login without showing the form again.
 * Checks our saved session, Knack refresh token, Knack runtime, then remember-me cookie.
 */
export async function resolveExistingSession(): Promise<KnackSessionUser | null> {
  if (typeof window === "undefined") return null;

  // After an intentional Sign out, do not rebuild a session from Knack embeds.
  if (hasLogoutFlag()) {
    return null;
  }

  const saved = loadSession();
  if (saved?.token && hasAccessMetadata(saved)) {
    return saved;
  }

  const fromRefresh = await sessionFromRefreshToken();
  const fromCookie = readRememberMeCookie();
  const thin = fromRefresh || fromCookie || saved;

  if (thin?.token && !hasAccessMetadata(thin)) {
    const fromRuntime = await sessionFromKnackRuntime();
    if (fromRuntime?.token) {
      const merged = normalizeUser({
        ...thin,
        ...fromRuntime,
        token: fromRuntime.token || thin.token,
        refreshToken: thin.refreshToken || fromRuntime.refreshToken,
      });
      saveSession(merged);
      return merged;
    }
  }

  if (thin?.token) {
    saveSession(thin);
    return thin;
  }

  const fromRuntime = await sessionFromKnackRuntime();
  if (fromRuntime?.token) {
    saveSession(fromRuntime);
    return fromRuntime;
  }

  return null;
}

function hasAccessMetadata(user: KnackSessionUser) {
  // Empty `{}` values are common on remote login and are not useful metadata.
  const valueCount = user.values ? Object.keys(user.values).length : 0;
  return (
    readGoodStanding(user) !== null ||
    (Boolean(user.profile_keys?.length) && valueCount > 0)
  );
}

export function decideTownhallAccess(user: KnackSessionUser): AccessDecision {
  return decidePortalAccess(user, {
    requireGoodStanding: true,
    allowedProfiles: DEFAULT_HOMEOWNER_PROFILES,
  });
}

export type PortalAccessOptions = {
  requireGoodStanding?: boolean;
  allowedProfiles?: string[];
};

/**
 * Portal access helper.
 * Good-standing matches Knack page rules: block only when In Good Standing is explicitly false.
 */
export function decidePortalAccess(
  user: KnackSessionUser,
  options: PortalAccessOptions = {},
): AccessDecision {
  const allowed = new Set(options.allowedProfiles ?? DEFAULT_HOMEOWNER_PROFILES);
  const profiles = user.profile_keys ?? [];
  const standing = readGoodStanding(user);

  if (options.requireGoodStanding && standing === false) return "dues";

  if (profiles.length > 0) {
    const ok = profiles.some((profile) => allowed.has(profile));
    if (!ok) return "denied";
  }

  return user.token ? "ok" : "denied";
}

/**
 * Fill in profile / good-standing fields from the Knack runtime when missing.
 */
export async function enrichSessionUser(
  user: KnackSessionUser,
): Promise<KnackSessionUser> {
  if (hasAccessMetadata(user)) return user;

  const fromRuntime = await sessionFromKnackRuntime();
  if (!fromRuntime?.token) return user;

  return normalizeUser({
    ...user,
    ...fromRuntime,
    token: fromRuntime.token || user.token,
    refreshToken: user.refreshToken || fromRuntime.refreshToken,
  });
}

export async function fetchTownhallAgmContent(
  token: string,
): Promise<TownhallAgmContent> {
  const [townhalls, agms] = await Promise.all([
    fetchFilteredRecords(token, AGM_SCENE, TOWNHALL_VIEW, [
      ...TOWNHALL_CATEGORIES,
    ]),
    fetchFilteredRecords(token, AGM_SCENE, AGM_VIEW, [...AGM_CATEGORIES]),
  ]);

  return { townhalls, agms };
}

export async function fetchPoliciesDocuments(
  token: string,
): Promise<PoliciesContent> {
  const [policies, financials, bylaws] = await Promise.all([
    fetchPolicyCategory(token, "Policies & Forms"),
    fetchPolicyCategory(token, "Financials"),
    fetchPolicyCategory(token, "Bylaws"),
  ]);

  return { policies, financials, bylaws };
}

async function fetchPolicyCategory(token: string, category: string) {
  const filters = {
    match: "and",
    rules: [{ field: "field_565", operator: "is", value: category }],
  };

  const records = await fetchAuthenticatedRecords<PoliciesRecord>(
    token,
    POLICIES_SCENE,
    POLICIES_VIEW,
    { rows_per_page: "100", filters: JSON.stringify(filters) },
  );

  return records.map((record) => ({
    id: record.id,
    title: record.field_311_raw?.trim() || "Untitled document",
    category,
    file: parseKnackFile(record.field_567_raw),
  }));
}

export async function fetchMeetingMinutes(
  token: string,
): Promise<PortalDocument[]> {
  const records = await fetchAuthenticatedRecords<MinutesRecord>(
    token,
    MINUTES_SCENE,
    MINUTES_VIEW,
    { rows_per_page: "100" },
  );

  return records.map((record) => {
    const date = parseKnackDate(record.field_264_raw);
    return {
      id: record.id,
      title: record.field_218_raw?.trim() || "Meeting minutes",
      dateISO: date?.iso,
      dateLabel: date?.label,
      file: parseKnackFile(record.field_220_raw),
    };
  });
}

/**
 * Community League membership for the signed-in homeowner (scene_422).
 * Season title / expiry mirror the Knack details special_title copy.
 */
export async function fetchLeagueMembership(
  token: string,
): Promise<LeagueMembershipContent> {
  const [details, household] = await Promise.all([
    fetchAuthenticatedRecords<MembershipRecord>(
      token,
      MEMBERSHIP_SCENE,
      MEMBERSHIP_DETAILS_VIEW,
      { rows_per_page: "10" },
    ),
    fetchAuthenticatedRecords<MembershipRecord>(
      token,
      MEMBERSHIP_SCENE,
      MEMBERSHIP_HOUSEHOLD_VIEW,
      { rows_per_page: "25" },
    ),
  ]);

  const primary = details[0] ?? household[0];
  const householdRecord =
    (primary && household.find((record) => record.id === primary.id)) ||
    household[0];

  return {
    seasonTitle: "Wedgewood Residents Community League Membership 2026-2027",
    expiresLabel: "Expires July 31, 2027",
    owner: cleanKnackText(primary?.field_165_raw),
    owner2: cleanKnackText(primary?.field_169_raw),
    membershipNumber: cleanKnackText(primary?.field_597_raw),
    householdRecordId: householdRecord?.id,
    additionalMembers: parseMemberNames(householdRecord?.field_603_raw),
    cardImageSrc: "/images/membership-card-2026.png",
  };
}

/**
 * Persist additional household member names via the membership table's
 * inline cell editor (view_778 / field_603).
 */
export async function updateLeagueHouseholdMembers(
  token: string,
  recordId: string,
  members: string[],
): Promise<string[]> {
  const names = sanitizeMemberNames(members);
  const res = await fetch(
    `https://api.knack.com/v1/pages/${MEMBERSHIP_SCENE}/views/${MEMBERSHIP_HOUSEHOLD_VIEW}/records/${recordId}`,
    {
      method: "PUT",
      headers: {
        Authorization: authHeader(token),
        "X-Knack-Application-Id": KNACK_APP_ID,
        "X-Knack-REST-API-KEY": "knack",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field_603: formatMemberNames(names) }),
    },
  );

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }

  if (!res.ok) {
    throw new Error(`Unable to update household members (${res.status}).`);
  }

  const data = (await res.json()) as MembershipRecord & {
    record?: MembershipRecord;
  };
  const saved =
    data.record?.field_603_raw ??
    data.field_603_raw ??
    formatMemberNames(names);

  return parseMemberNames(saved);
}

/**
 * Homeowner account details (scene_76 / view_137) for profile & login settings.
 */
export async function fetchHomeownerAccount(
  token: string,
): Promise<HomeownerAccount> {
  const accountRecords = await fetchAuthenticatedRecords<HomeownerRecord>(
    token,
    ACCOUNT_SCENE,
    ACCOUNT_DETAILS_VIEW,
    { rows_per_page: "5" },
  );

  const record = accountRecords[0];
  if (!record) {
    throw new Error("No homeowner account record was found for this login.");
  }

  return normalizeHomeownerAccount(record);
}

/**
 * Homeowner dues portal (scene_3) — current/paid dues and linked properties.
 * PayPal checkout remains on the Knack payment scene via dist_25.
 */
export async function fetchPayHoaFeesContent(
  token: string,
): Promise<PayHoaFeesContent> {
  const [properties, current, paid, account] = await Promise.all([
    fetchAuthenticatedRecords<DuesPropertyRecord>(
      token,
      DUES_SCENE,
      DUES_PROPERTIES_VIEW,
      { rows_per_page: "25" },
    ),
    fetchAuthenticatedRecords<DuesRecord>(token, DUES_SCENE, CURRENT_DUES_VIEW, {
      rows_per_page: "50",
    }),
    fetchAuthenticatedRecords<DuesRecord>(token, DUES_SCENE, PAID_DUES_VIEW, {
      rows_per_page: "50",
    }),
    fetchHomeownerAccount(token).catch(() => undefined),
  ]);

  return {
    notice:
      "WRHOA mandatory annual dues are $450.00 including GST for May 1, 2026–April 30, 2027 ($350.00 including GST per property if payment is received on or before May 31, 2026). All dues must be paid by June 30, 2026 to avoid further action.",
    properties: properties.map((record) => ({
      id: record.id,
      address: parseAddress(record.field_8_raw),
      totalPayableLabel: formatMoney(record.field_350_raw),
    })),
    currentDues: current.map((record) => ({
      id: record.id,
      amountLabel:
        formatMoney(record.field_67_raw) || formatMoney(record.field_64_raw),
      propertyLabel: parseConnectionLabel(record.field_43_raw),
      yearLabel: parseConnectionLabel(record.field_44_raw),
      earlyBirdDeadlineLabel: parseKnackDate(record.field_46_raw)?.label,
      dueDateLabel: parseKnackDate(record.field_47_raw)?.label,
      customDueDateLabel: parseKnackDate(record.field_160_raw)?.label,
      description: cleanKnackText(record.field_172_raw),
      paymentUrl: paymentHashForDue(record.id),
    })),
    paidDues: paid.map((record) => ({
      id: record.id,
      propertyLabel: parseConnectionLabel(record.field_43_raw),
      yearLabel: parseConnectionLabel(record.field_44_raw),
      paypalAmountLabel: formatMoney(record.field_74_raw),
      paypalDateLabel: parseKnackDate(record.field_77_raw)?.label,
      chequeAmountLabel: formatMoney(record.field_75_raw),
      chequeDateLabel: parseKnackDate(record.field_78_raw)?.label,
    })),
    account,
    paymentDistributionKey: PAY_HOA_DISTRIBUTION,
  };
}

export function paymentHashForDue(recordId: string) {
  return `${PAY_HOA_PAYMENT_HASH}/${recordId}/`;
}

export async function updateHomeownerAccount(
  token: string,
  recordId: string,
  update: HomeownerAccountUpdate,
): Promise<HomeownerAccount> {
  const payload: Record<string, unknown> = {
    field_19: {
      first: update.firstName.trim(),
      last: update.lastName.trim(),
    },
    field_36: knackPhonePayload(update.phone),
    field_20: { email: update.email.trim() },
    field_102: update.mailingSameAsProperty,
    field_39: {
      first: update.secondOwnerFirstName.trim(),
      last: update.secondOwnerLastName.trim(),
    },
    field_155: update.communicationAgreement,
  };

  const secondPhone = knackPhonePayload(update.secondOwnerPhone);
  if (secondPhone !== "") {
    payload.field_40 = secondPhone;
  }

  if (!update.mailingSameAsProperty) {
    payload.field_35 = knackAddressPayload(update.mailingAddress);
  }

  const res = await fetch(
    `https://api.knack.com/v1/pages/${ACCOUNT_EDIT_SCENE}/views/${ACCOUNT_EDIT_VIEW}/records/${recordId}`,
    {
      method: "PUT",
      headers: {
        Authorization: authHeader(token),
        "X-Knack-Application-Id": KNACK_APP_ID,
        "X-Knack-REST-API-KEY": "knack",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }

  if (!res.ok) {
    throw new Error(`Unable to update account information (${res.status}).`);
  }

  const data = (await res.json()) as HomeownerRecord & {
    record?: HomeownerRecord;
  };
  const record = data.record ?? data;
  return normalizeHomeownerAccount({ ...record, id: record.id || recordId });
}

export async function updateHomeownerCredentials(
  token: string,
  recordId: string,
  update: HomeownerCredentialsUpdate,
): Promise<void> {
  const payload: Record<string, unknown> = {
    field_20: { email: update.email.trim() },
  };
  if (update.password?.trim()) {
    payload.field_21 = update.password.trim();
  }

  const res = await fetch(
    `https://api.knack.com/v1/pages/${ACCOUNT_SETTINGS_SCENE}/views/${ACCOUNT_SETTINGS_VIEW}/records/${recordId}`,
    {
      method: "PUT",
      headers: {
        Authorization: authHeader(token),
        "X-Knack-Application-Id": KNACK_APP_ID,
        "X-Knack-REST-API-KEY": "knack",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }

  if (!res.ok) {
    throw new Error(`Unable to update login details (${res.status}).`);
  }
}

export function saveSession(user: KnackSessionUser) {
  if (typeof window === "undefined") return;

  clearLogoutFlag();

  const payload = {
    id: user.id,
    token: user.token,
    email: user.email,
    profile_keys: user.profile_keys,
    values: user.values,
    refreshToken: user.refreshToken,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  // Migrate away from the older sessionStorage key.
  sessionStorage.removeItem("wrhoa-knack-agm-session");

  writeRememberMeCookie(user);

  if (user.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
    localStorage.setItem(REFRESH_USER_KEY, user.id);
  }
}

export function loadSession(): KnackSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) ||
      sessionStorage.getItem("wrhoa-knack-agm-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as KnackSessionUser;
    if (!parsed?.token) return null;
    return normalizeUser(parsed);
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  markLoggedOut();
  // Tear down Knack while tokens may still be present, then clear local storage.
  void clearKnackRuntimeSession({ ensureLoaded: true }).finally(() => {
    clearLocalSessionArtifacts();
    clearKnackMounts();
  });
}

/**
 * Full sign-out: tell Knack to log out (loading the runtime if needed), then
 * clear our local session artifacts so embeds cannot rehydrate the login.
 */
export async function logoutSession() {
  if (typeof window === "undefined") return;
  markLoggedOut();
  // Logout Knack first while refresh/remember tokens still exist so the runtime
  // can identify and destroy the active user. REST-gated pages often never
  // load Knack; ensureLoaded fixes Sign out leaving Knack still authenticated.
  await clearKnackRuntimeSession({ ensureLoaded: true });
  clearLocalSessionArtifacts();
  clearKnackMounts();
}

function markLoggedOut() {
  try {
    sessionStorage.setItem(LOGOUT_FLAG_KEY, "1");
  } catch {
    // ignore
  }
}

function clearLogoutFlag() {
  try {
    sessionStorage.removeItem(LOGOUT_FLAG_KEY);
  } catch {
    // ignore
  }
}

function hasLogoutFlag() {
  try {
    return sessionStorage.getItem(LOGOUT_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

function clearLocalSessionArtifacts() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("wrhoa-knack-agm-session");
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_USER_KEY);

  // Knack may store multiple refreshToken* keys across distributions.
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("refreshToken")) {
      localStorage.removeItem(key);
    }
  }

  clearRememberMeCookie();
  clearKnackAppCookies();
  clearPaymentHash();
}

export async function syncKnackRuntimeSession(user: KnackSessionUser) {
  await applySessionToKnackRuntime(user);
}

async function applySessionToKnackRuntime(user: KnackSessionUser) {
  if (typeof window === "undefined") return;

  // Ensure tokens Knack embeds read are present before runtime sync.
  if (user.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
    localStorage.setItem(REFRESH_USER_KEY, user.id);
  }
  writeRememberMeCookie(user);

  if (!window.Knack) return;

  try {
    // Drop any previous runtime identity first.
    await destroyKnackUser();
  } catch {
    // ignore
  }

  const payload = {
    id: user.id,
    token: user.token,
    email: user.email,
    profile_keys: user.profile_keys,
    values: user.values,
    refreshToken: user.refreshToken,
  };

  if (!window.Knack.session) {
    window.Knack.session = { user: payload };
  } else {
    window.Knack.session.user = payload;
  }

  if (window.Knack.user?.set) {
    window.Knack.user.set(payload);
  }
  if (window.Knack.user) {
    window.Knack.user.id = user.id;
  }
}

async function clearKnackRuntimeSession(options?: { ensureLoaded?: boolean }) {
  if (typeof window === "undefined") return;

  if (options?.ensureLoaded && !window.Knack) {
    try {
      await ensureKnackLoader();
    } catch {
      // Continue with local cleanup even if the loader fails.
    }
  }

  if (window.Knack) {
    try {
      await destroyKnackUser();
    } catch {
      // ignore
    }

    if (window.Knack.session) {
      window.Knack.session.user = null;
    }
    if (window.Knack.user?.clear) {
      window.Knack.user.clear();
    }
    if (window.Knack.user) {
      window.Knack.user.id = null;
    }
    if (typeof window.Knack.logout === "function") {
      try {
        window.Knack.logout();
      } catch {
        // ignore
      }
    }
  }

  clearKnackMounts();
}

function clearKnackMounts() {
  document.querySelectorAll<HTMLElement>('[id^="knack-"]').forEach((node) => {
    node.replaceChildren();
  });
}

function destroyKnackUser() {
  return new Promise<void>((resolve) => {
    const destroy = window.Knack?.user?.destroy;
    if (!destroy) {
      resolve();
      return;
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    try {
      destroy.call(window.Knack?.user, {
        success: done,
        error: done,
        wait: true,
      });
      window.setTimeout(done, 1500);
    } catch {
      done();
    }
  });
}

function clearKnackAppCookies() {
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const name = part.split("=")[0]?.trim();
    if (!name) continue;
    if (name.includes(KNACK_APP_ID) || name.endsWith("-remember-me")) {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    }
  }
}

function clearPaymentHash() {
  const hash = window.location.hash || "";
  if (
    hash.includes("homeowner-portal") ||
    hash.includes("knack-password") ||
    hash.includes("payment/")
  ) {
    const path = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", path);
  }
}

async function sessionFromRefreshToken(): Promise<KnackSessionUser | null> {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userId = localStorage.getItem(REFRESH_USER_KEY);
  if (!refresh) return null;

  const res = await fetch(
    `https://api.knack.com/v1/applications/${KNACK_APP_ID}/refresh-token/verify`,
    {
      method: "GET",
      headers: {
        "X-Knack-Application-Id": KNACK_APP_ID,
        "X-Knack-REST-API-KEY": "knack",
        refresh,
      },
    },
  );

  if (!res.ok) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_USER_KEY);
    return null;
  }

  const data = (await res.json()) as RefreshResponse;
  const token = data.authorizationToken || data.token;
  if (!token) return null;

  return normalizeUser({
    id: userId || "unknown",
    token,
    refreshToken: refresh,
  });
}

async function sessionFromKnackRuntime(): Promise<KnackSessionUser | null> {
  try {
    await ensureKnackLoader();
  } catch {
    return null;
  }

  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    const user = readUserFromKnackGlobal();
    if (user?.token) return user;
    await wait(250);
  }

  return readUserFromKnackGlobal();
}

function readUserFromKnackGlobal(): KnackSessionUser | null {
  const knack = window.Knack;
  if (!knack) return null;

  const token =
    (typeof knack.getUserToken === "function" ? knack.getUserToken() : null) ||
    knack.session?.user?.token ||
    (knack.user?.get?.("token") as string | undefined) ||
    knack.user?.attributes?.token;

  if (!token || typeof token !== "string") return null;

  const sessionUser = knack.session?.user;
  const jsonUser = knack.user?.toJSON?.();
  const attrs = knack.user?.attributes;

  const merged = normalizeUser({
    id:
      sessionUser?.id ||
      jsonUser?.id ||
      attrs?.id ||
      (knack.user?.id as string) ||
      "unknown",
    token,
    email: sessionUser?.email || jsonUser?.email || attrs?.email,
    profile_keys:
      sessionUser?.profile_keys || jsonUser?.profile_keys || attrs?.profile_keys,
    values: sessionUser?.values || jsonUser?.values || attrs?.values,
  });

  return merged;
}

function ensureKnackLoader(): Promise<void> {
  if (window.Knack) return Promise.resolve();

  window.app_id = KNACK_APP_ID;
  window.distribution_key = SESSION_PROBE_DIST;

  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-knack-session="${KNACK_APP_ID}"]`,
  );
  if (existing) {
    return waitForKnack(8000);
  }

  // Hidden mount point required by Knack loader.
  let mount = document.getElementById(`knack-${SESSION_PROBE_DIST}`);
  if (!mount) {
    mount = document.createElement("div");
    mount.id = `knack-${SESSION_PROBE_DIST}`;
    mount.setAttribute("aria-hidden", "true");
    mount.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;clip:rect(0,0,0,0);";
    document.body.appendChild(mount);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://loader.knack.com/${KNACK_APP_ID}/${SESSION_PROBE_DIST}/knack.js`;
    script.async = true;
    script.dataset.knackSession = KNACK_APP_ID;
    script.onload = () => {
      waitForKnack(8000).then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error("Knack loader failed"));
    document.body.appendChild(script);
  });
}

function waitForKnack(timeoutMs: number) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const tick = () => {
      if (window.Knack) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Knack runtime timed out"));
        return;
      }
      window.setTimeout(tick, 100);
    };
    tick();
  });
}

function readRememberMeCookie(): KnackSessionUser | null {
  try {
    const raw = getCookie(REMEMBER_COOKIE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      user?: { id?: string; token?: string; utility_key?: string };
    };
    if (!parsed.user?.token) return null;
    return normalizeUser({
      id: parsed.user.id || "unknown",
      token: parsed.user.token,
    });
  } catch {
    return null;
  }
}

function writeRememberMeCookie(user: KnackSessionUser) {
  const value = encodeURIComponent(
    JSON.stringify({
      application: { id: KNACK_APP_ID },
      user: {
        id: user.id,
        token: user.token,
      },
    }),
  );
  // 14 days — matches Knack remember-me duration.
  document.cookie = `${REMEMBER_COOKIE_KEY}=${value}; path=/; max-age=${14 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearRememberMeCookie() {
  document.cookie = `${REMEMBER_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

function getCookie(name: string) {
  const prefix = `${name}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

function normalizeUser(
  user: KnackSessionUser & { refreshToken?: string },
): KnackSessionUser {
  return {
    id: user.id,
    token: user.token,
    email: user.email || readEmailFromValues(user),
    profile_keys: user.profile_keys,
    values: user.values,
    refreshToken: user.refreshToken,
  };
}

function readEmailFromValues(user: KnackSessionUser) {
  const values = user.values ?? {};
  const candidates = [values.field_20, values["field_20"], values.email];
  for (const value of candidates) {
    if (typeof value === "string" && value.includes("@")) return value;
    if (value && typeof value === "object") {
      const email = (value as { email?: string }).email;
      if (typeof email === "string" && email.includes("@")) return email;
    }
  }
  return undefined;
}

async function fetchFilteredRecords(
  token: string,
  scene: string,
  view: string,
  categories: string[],
) {
  const filters = {
    match: "or",
    rules: categories.map((value) => ({
      field: "field_565",
      operator: "is",
      value,
    })),
  };

  const records = await fetchAuthenticatedRecords<AgmRecord>(token, scene, view, {
    rows_per_page: "50",
    filters: JSON.stringify(filters),
  });

  return records
    .map((record) => normalizeRecord(record, categories))
    .filter((item) => categories.includes(item.category));
}

async function fetchAuthenticatedRecords<T>(
  token: string,
  scene: string,
  view: string,
  params: Record<string, string>,
): Promise<T[]> {
  const url = new URL(
    `https://api.knack.com/v1/pages/${scene}/views/${view}/records`,
  );
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader(token),
      "X-Knack-Application-Id": KNACK_APP_ID,
      "X-Knack-REST-API-KEY": "knack",
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }

  if (!res.ok) {
    throw new Error(`Unable to load materials (${res.status}).`);
  }

  const data = (await res.json()) as RecordsResponse<T>;
  return data.records ?? [];
}

function authHeader(token: string) {
  return token.startsWith("Bearer ") ? token : token;
}

function parseKnackFile(value: KnackFileRaw | string | null | undefined) {
  if (!value || typeof value !== "object" || !value.url) return undefined;
  return {
    url: value.url,
    filename: value.filename?.trim() || "Download file",
  };
}

function normalizeRecord(
  record: AgmRecord,
  fallbackCategories: string[],
): TownhallAgmItem {
  const date = parseKnackDate(record.field_564_raw);
  const link =
    record.field_312_raw && typeof record.field_312_raw === "object"
      ? record.field_312_raw
      : null;
  const file = parseKnackFile(record.field_567_raw);

  const category =
    record.field_565_raw?.trim() ||
    fallbackCategories[0] ||
    "HOA Communication";

  return {
    id: record.id,
    title: record.field_311_raw?.trim() || "Untitled",
    category,
    dateISO: date?.iso,
    dateLabel: date?.label,
    message: stripHtml(record.field_131_raw || ""),
    link: link?.url
      ? {
          url: link.url,
          label: link.label?.trim() || "Open link",
        }
      : undefined,
    file,
  };
}

function readGoodStanding(user: KnackSessionUser): boolean | null {
  const values = user.values ?? {};
  const direct = [
    values["profile_5-field_271"],
    values.field_271,
    values["field_271"],
  ];

  for (const value of direct) {
    const parsed = parseKnackBoolean(value);
    if (parsed !== null) return parsed;
  }

  for (const value of Object.values(values)) {
    if (!value || typeof value !== "object") continue;
    const nested = value as Record<string, unknown>;
    const parsed = parseKnackBoolean(
      nested.field_271 ?? nested["field_271"] ?? nested["profile_5-field_271"],
    );
    if (parsed !== null) return parsed;
  }

  return null;
}

function parseKnackBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (["true", "yes", "1", "on"].includes(normalized)) return true;
    if (["false", "no", "0", "off"].includes(normalized)) return false;
  }
  return null;
}

function parseKnackDate(value: KnackDateRaw | string | null | undefined) {
  if (!value || typeof value !== "object") return null;
  const iso = value.iso_timestamp?.trim();
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    iso,
    label: new Intl.DateTimeFormat("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Edmonton",
    }).format(parsed),
  };
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function cleanKnackText(value: string | null | undefined) {
  if (!value) return undefined;
  const cleaned = stripHtml(value);
  return cleaned || undefined;
}

function parseConnectionLabel(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") return cleanKnackText(value);
  if (Array.isArray(value)) {
    const labels = value
      .map((item) => {
        if (!item || typeof item !== "object") return undefined;
        const row = item as { identifier?: string; label?: string };
        return cleanKnackText(row.identifier || row.label);
      })
      .filter((label): label is string => Boolean(label));
    return labels.length ? labels.join(", ") : undefined;
  }
  if (typeof value === "object") {
    const row = value as { identifier?: string; label?: string };
    return cleanKnackText(row.identifier || row.label);
  }
  return undefined;
}

function parseAddress(value: unknown): string | undefined {
  const parts = parseAddressParts(value);
  if (!parts) return undefined;
  return formatAddressLine(parts) || undefined;
}

function parseAddressParts(value: unknown): HomeownerAddress | null {
  if (!value) return null;
  if (typeof value === "string") {
    const cleaned = cleanKnackText(value);
    if (!cleaned) return null;
    return {
      street: cleaned,
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "Canada",
    };
  }
  if (typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  return {
    street: readString(row.street) || readString(row.address) || "",
    street2: readString(row.street2) || readString(row.street_2) || "",
    city: readString(row.city) || "",
    state: readString(row.state) || readString(row.province) || "",
    zip: readString(row.zip) || readString(row.postal_code) || "",
    country: readString(row.country) || "Canada",
  };
}

function formatAddressLine(address: HomeownerAddress) {
  return [
    address.street,
    address.street2,
    [address.city, address.state].filter(Boolean).join(", "),
    address.zip,
    address.country && address.country !== "Canada" ? address.country : "",
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

function emptyAddress(): HomeownerAddress {
  return {
    street: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "Canada",
  };
}

function normalizeHomeownerAccount(record: HomeownerRecord): HomeownerAccount {
  const name = parseName(record.field_19_raw);
  const second = parseName(record.field_39_raw);
  return {
    id: record.id,
    propertyLabel: parseConnectionLabel(record.field_34_raw),
    firstName: name.first,
    lastName: name.last,
    phone: parsePhone(record.field_36_raw),
    email: parseEmail(record.field_20_raw),
    mailingSameAsProperty: parseKnackBoolean(record.field_102_raw) ?? true,
    mailingAddress: parseAddressParts(record.field_35_raw) || emptyAddress(),
    secondOwnerFirstName: second.first,
    secondOwnerLastName: second.last,
    secondOwnerPhone: parsePhone(record.field_40_raw),
    communicationAgreement: parseKnackBoolean(record.field_155_raw) ?? true,
  };
}

function parseName(value: unknown) {
  if (!value) return { first: "", last: "" };
  if (typeof value === "string") {
    const parts = value.trim().split(/\s+/);
    return {
      first: parts[0] || "",
      last: parts.slice(1).join(" "),
    };
  }
  if (typeof value === "object") {
    const row = value as { first?: string; last?: string; middle?: string };
    return {
      first: readString(row.first),
      last: readString(row.last),
    };
  }
  return { first: "", last: "" };
}

function parsePhone(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return stripHtml(value);
  if (typeof value === "object") {
    const row = value as {
      full?: string;
      formatted?: string;
      number?: string;
    };
    return (
      readString(row.full) ||
      readString(row.formatted) ||
      readString(row.number)
    );
  }
  return "";
}

function parseEmail(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const row = value as { email?: string };
    return readString(row.email);
  }
  return "";
}

function knackPhonePayload(phone: string) {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const digits = trimmed.replace(/\D/g, "");
  // Knack phone fields expect `full` + `number` (not `formatted`).
  return {
    full: trimmed,
    number: digits || trimmed,
  };
}

function knackAddressPayload(address: HomeownerAddress) {
  return {
    street: address.street.trim(),
    street2: address.street2.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    zip: address.zip.trim(),
    country: address.country.trim() || "Canada",
  };
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatMoney(value: unknown) {
  const amount = parseMoney(value);
  if (amount === null) return undefined;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

function parseMoney(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value && typeof value === "object") {
    const row = value as { amount?: unknown; value?: unknown };
    return parseMoney(row.amount ?? row.value);
  }
  return null;
}

function parseMemberNames(value: string | null | undefined) {
  const cleaned = cleanKnackText(value);
  if (!cleaned) return [];
  return sanitizeMemberNames(cleaned.split(/[,;\n]+/));
}

function sanitizeMemberNames(names: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const name of names) {
    const trimmed = name.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

function formatMemberNames(names: string[]) {
  return sanitizeMemberNames(names).join(", ");
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export class AuthExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "AuthExpiredError";
  }
}
