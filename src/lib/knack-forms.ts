import { AuthExpiredError, KNACK_APP_ID } from "@/lib/knack-session";
import {
  HOMEOWNER_CONTACT_SCENE,
  HOMEOWNER_CONTACT_VIEW,
  NON_HOMEOWNER_CONTACT_SCENE,
  NON_HOMEOWNER_CONTACT_VIEW,
} from "@/lib/contact-forms";

const REGISTRATION_SCENE = "scene_440";
const REGISTRATION_VIEW = "view_815";
const VOLUNTEER_SCENE = "scene_263";
const VOLUNTEER_FORM_VIEW = "view_491";
const VOLUNTEER_LIST_VIEW = "view_490";

const VARIANCE_SCENE = "scene_429";
const VARIANCE_FORM_VIEW = "view_794";
const VARIANCE_PAYMENT_DISTRIBUTION = "dist_33";
const VARIANCE_PAYMENT_HASH = "variance-application-form/formcharge-payment";
/** Application fee: $100 + $5 GST */
const VARIANCE_FEE_AMOUNT = "105.00";

const DUES_SCENE = "scene_3";
const DUES_PROPERTIES_VIEW = "view_139";
const ACCOUNT_SCENE = "scene_76";
const ACCOUNT_DETAILS_VIEW = "view_137";

const knackHeaders = {
  "X-Knack-Application-Id": KNACK_APP_ID,
  "X-Knack-REST-API-KEY": "knack",
  "Content-Type": "application/json",
};

export type KnackConnectionOption = {
  id: string;
  label: string;
};

export type VolunteerOpportunity = {
  id: string;
  title: string;
  description: string;
  linkUrl?: string;
  linkLabel?: string;
};

export type FormAddress = {
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type NonHomeownerContactPayload = {
  category: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  represent?: string;
  clientNameOnTitle?: string;
  purchaserName?: string;
  closingDate?: string;
  lawOfficeName?: string;
  confirmations?: string[];
};

export type HomeownerContactPayload = {
  category: string;
  message: string;
  propertyId?: string;
  email?: string;
  phone?: string;
};

export type RegistrationPayload = {
  owner1First: string;
  owner1Last: string;
  phone: string;
  email: string;
  temporaryPassword: string;
  owner2First: string;
  owner2Last: string;
  owner2Phone: string;
  closingDate: string;
  propertyAddress: FormAddress;
  mailingSameAsProperty: boolean;
  mailingAddress: FormAddress;
  emailConsent: boolean;
};

export type VolunteerSignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
  opportunityIds: string[];
};

export type VarianceApplicationContext = {
  properties: KnackConnectionOption[];
  preferredEmail: string;
  homeowner1: string;
  homeowner2: string;
};

export type VarianceApplicationPayload = {
  propertyId: string;
  preferredEmail: string;
  homeowner1: string;
  homeowner2: string;
  existingRoof: string;
  proposedRoof: string;
  roofMakeModel: string;
  otherMaterial: string;
  existingOther: string;
  proposedOther: string;
  otherMakeModel: string;
  signature1: Blob;
  signature2?: Blob | null;
  date1: string;
  date2?: string;
};

export type VarianceApplicationResult = {
  id: string;
  applicationNumber: string;
  paymentUrl: string;
  paymentDistributionKey: string;
  feeLabel: string;
};

export type VariancePaymentStatus = "unpaid" | "pending" | "complete" | "failed";

export type VarianceApplicationStatus = {
  applicationNumber: string;
  paymentStatus: VariancePaymentStatus;
};

type RecordsResponse<T> = {
  records?: T[];
  total_records?: number;
};

type PropertyRecord = {
  id: string;
  field_8_raw?: unknown;
};

type VolunteerListRecord = {
  id: string;
  field_432_raw?: string;
  field_433_raw?: string;
  field_436_raw?: { url?: string; label?: string } | string | null;
};

type PropertyConnectionRecord = KnackConnectionOption & {
  identifier?: string;
};

function mapPropertyOptions(
  records: PropertyConnectionRecord[],
): KnackConnectionOption[] {
  return records
    .map((record) => ({
      id: record.id,
      label: record.identifier?.trim() || record.label || "Property",
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
}

async function fetchPropertyConnections(
  search?: string,
): Promise<KnackConnectionOption[]> {
  const url = new URL(
    `https://api.knack.com/v1/scenes/${NON_HOMEOWNER_CONTACT_SCENE}/views/${NON_HOMEOWNER_CONTACT_VIEW}/connections/field_115`,
  );
  url.searchParams.set("rows_per_page", "1000");
  // This connection lookup ignores `filters` and returns every property.
  // `search` matches the address identifier.
  if (search) url.searchParams.set("search", search);

  const res = await fetch(url.toString(), { headers: knackHeaders });
  if (!res.ok) {
    throw new Error(`Unable to load properties (${res.status}).`);
  }

  const data = (await res.json()) as RecordsResponse<PropertyConnectionRecord>;
  return mapPropertyOptions(data.records ?? []);
}

export async function searchContactProperties(
  query: string,
): Promise<KnackConnectionOption[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  return fetchPropertyConnections(trimmed);
}

/** Every property that can be chosen on a contact form, not only the signed-in homeowner's. */
export async function fetchContactPropertyOptions(): Promise<
  KnackConnectionOption[]
> {
  return fetchPropertyConnections();
}

export async function fetchHomeownerContactProperties(
  token: string,
): Promise<KnackConnectionOption[]> {
  const url = new URL(
    `https://api.knack.com/v1/pages/${DUES_SCENE}/views/${DUES_PROPERTIES_VIEW}/records`,
  );
  url.searchParams.set("rows_per_page", "25");

  const res = await fetch(url.toString(), {
    headers: {
      ...knackHeaders,
      Authorization: token.startsWith("Bearer ") ? token : token,
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }
  if (!res.ok) {
    throw new Error(`Unable to load your properties (${res.status}).`);
  }

  const data = (await res.json()) as RecordsResponse<PropertyRecord>;
  return (data.records ?? []).map((record) => ({
    id: record.id,
    label: formatAddressLabel(record.field_8_raw) || "Your property",
  }));
}

export async function submitNonHomeownerContact(
  input: NonHomeownerContactPayload,
): Promise<void> {
  const payload: Record<string, unknown> = {
    field_114: input.category,
    field_471: {
      first: input.firstName.trim(),
      last: input.lastName.trim(),
    },
    field_472: { email: input.email.trim() },
    field_473: knackPhonePayload(input.phone),
    field_113: input.message.trim(),
  };

  if (input.propertyId) {
    payload.field_115 = input.propertyId;
  }

  if (input.represent) payload.field_665 = input.represent;
  if (input.clientNameOnTitle?.trim()) {
    payload.field_660 = input.clientNameOnTitle.trim();
  }
  if (input.purchaserName?.trim()) {
    payload.field_661 = input.purchaserName.trim();
  }
  if (input.closingDate?.trim()) {
    payload.field_662 = input.closingDate.trim();
  }
  if (input.lawOfficeName?.trim()) {
    payload.field_663 = input.lawOfficeName.trim();
  }
  if (input.confirmations && input.confirmations.length > 0) {
    payload.field_664 = input.confirmations;
  }

  await createViewRecord(
    NON_HOMEOWNER_CONTACT_SCENE,
    NON_HOMEOWNER_CONTACT_VIEW,
    payload,
  );
}

export async function submitHomeownerContact(
  token: string,
  input: HomeownerContactPayload,
): Promise<void> {
  const payload: Record<string, unknown> = {
    field_114: input.category,
    field_113: input.message.trim(),
  };

  if (input.propertyId) {
    payload.field_115 = input.propertyId;
  }
  if (input.email?.trim()) {
    payload.field_472 = { email: input.email.trim() };
  }
  if (input.phone?.trim()) {
    payload.field_473 = knackPhonePayload(input.phone);
  }

  await createViewRecord(
    HOMEOWNER_CONTACT_SCENE,
    HOMEOWNER_CONTACT_VIEW,
    payload,
    token,
  );
}

export async function submitNewHomeownerRegistration(
  input: RegistrationPayload,
): Promise<void> {
  const payload: Record<string, unknown> = {
    field_666: input.owner1First.trim(),
    field_667: input.owner1Last.trim(),
    field_668: knackPhonePayload(input.phone),
    field_669: { email: input.email.trim() },
    field_670: input.temporaryPassword,
    field_671: input.owner2First.trim(),
    field_672: input.owner2Last.trim(),
    field_674: knackAddressPayload(input.propertyAddress),
    field_675: input.mailingSameAsProperty,
    field_677: input.emailConsent,
    field_678: knackDatePayload(input.closingDate),
  };

  if (input.owner2Phone.trim()) {
    payload.field_673 = knackPhonePayload(input.owner2Phone);
  }
  if (!input.mailingSameAsProperty) {
    payload.field_676 = knackAddressPayload(input.mailingAddress);
  }

  await createViewRecord(REGISTRATION_SCENE, REGISTRATION_VIEW, payload);
}

export async function fetchVolunteerOpportunities(): Promise<
  VolunteerOpportunity[]
> {
  const url = new URL(
    `https://api.knack.com/v1/pages/${VOLUNTEER_SCENE}/views/${VOLUNTEER_LIST_VIEW}/records`,
  );
  url.searchParams.set("rows_per_page", "50");

  const res = await fetch(url.toString(), {
    headers: knackHeaders,
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Unable to load volunteer opportunities (${res.status}).`);
  }

  const data = (await res.json()) as RecordsResponse<VolunteerListRecord>;
  return (data.records ?? []).map((record) => {
    const link =
      record.field_436_raw && typeof record.field_436_raw === "object"
        ? record.field_436_raw
        : null;
    return {
      id: record.id,
      title: record.field_432_raw?.trim() || "Volunteer opportunity",
      description: stripHtml(record.field_433_raw || ""),
      linkUrl: link?.url,
      linkLabel: link?.label?.trim() || link?.url,
    };
  });
}

export async function submitVolunteerSignup(
  input: VolunteerSignupPayload,
): Promise<void> {
  const payload: Record<string, unknown> = {
    field_450: {
      first: input.firstName.trim(),
      last: input.lastName.trim(),
    },
    field_449: input.opportunityIds,
    field_451: { email: input.email.trim() },
    field_452: knackPhonePayload(input.phone),
    field_453: input.note.trim(),
  };

  await createViewRecord(VOLUNTEER_SCENE, VOLUNTEER_FORM_VIEW, payload);
}

export async function fetchVarianceApplicationContext(
  token: string,
): Promise<VarianceApplicationContext> {
  const [properties, accounts] = await Promise.all([
    fetchAuthenticatedJson<RecordsResponse<PropertyRecord>>(
      token,
      `pages/${DUES_SCENE}/views/${DUES_PROPERTIES_VIEW}/records?rows_per_page=25`,
    ),
    fetchAuthenticatedJson<
      RecordsResponse<{
        id: string;
        field_19_raw?: unknown;
        field_20_raw?: unknown;
        field_39_raw?: unknown;
      }>
    >(
      token,
      `pages/${ACCOUNT_SCENE}/views/${ACCOUNT_DETAILS_VIEW}/records?rows_per_page=5`,
    ),
  ]);

  const account = accounts.records?.[0];
  const name1 = formatPersonName(account?.field_19_raw);
  const name2 = formatPersonName(account?.field_39_raw);
  const email = parseEmailValue(account?.field_20_raw);

  return {
    properties: (properties.records ?? []).map((record) => ({
      id: record.id,
      label: formatAddressLabel(record.field_8_raw) || "Your property",
    })),
    preferredEmail: email,
    homeowner1: name1,
    homeowner2: name2,
  };
}

export async function submitVarianceApplication(
  token: string,
  input: VarianceApplicationPayload,
): Promise<VarianceApplicationResult> {
  const signature1Id = await uploadKnackImage(
    token,
    input.signature1,
    "variance-signature-1.png",
  );
  const signature2Id = input.signature2
    ? await uploadKnackImage(
        token,
        input.signature2,
        "variance-signature-2.png",
      )
    : null;

  const payload: Record<string, unknown> = {
    field_632: { email: input.preferredEmail.trim() },
    field_623: input.homeowner1.trim(),
    field_624: input.homeowner2.trim(),
    field_612: input.propertyId,
    field_614: input.existingRoof.trim(),
    field_615: input.proposedRoof.trim(),
    field_616: input.roofMakeModel.trim(),
    field_617: input.otherMaterial.trim(),
    field_618: input.existingOther.trim(),
    field_619: input.proposedOther.trim(),
    field_620: input.otherMakeModel.trim(),
    field_621: signature1Id,
    field_627: knackDatePayload(input.date1),
    field_611: VARIANCE_FEE_AMOUNT,
  };

  if (signature2Id) {
    payload.field_622 = signature2Id;
  }
  if (input.date2?.trim()) {
    payload.field_628 = knackDatePayload(input.date2);
  }

  // The public "knack" API key runs this form's emails immediately. The live
  // checkout uses renderer-session, which holds those rules until payment.
  const record = await createVarianceRecord(token, payload);

  const id = String(record.id || "");
  if (!id) {
    throw new Error("Variance application was created without a record id.");
  }

  const applicationNumber = await resolveVarianceApplicationNumber(
    token,
    id,
    record,
  );

  return {
    id,
    applicationNumber,
    paymentUrl: `${VARIANCE_PAYMENT_HASH}/${id}/`,
    paymentDistributionKey: VARIANCE_PAYMENT_DISTRIBUTION,
    feeLabel: "Application Fee: $100.00 + $5.00 GST = $105.00",
  };
}

const VARIANCE_STATUS_VIEWS = [
  ["scene_434", "view_804"],
  ["scene_429", "view_794"],
  ["scene_433", "view_800"],
  ["scene_371", "view_799"],
] as const;

export async function fetchVarianceApplicationStatus(
  token: string,
  recordId: string,
): Promise<VarianceApplicationStatus> {
  let applicationNumber = "";
  let paymentStatus: VariancePaymentStatus = "unpaid";

  for (const [scene, view] of VARIANCE_STATUS_VIEWS) {
    const record = await readVarianceRecord(token, scene, view, recordId);
    if (!record) continue;
    applicationNumber ||= readApplicationNumber(record);
    paymentStatus = preferPaymentStatus(
      paymentStatus,
      readPaymentStatus(record),
    );
    if (applicationNumber && paymentStatus === "complete") break;
  }

  return { applicationNumber, paymentStatus };
}

async function resolveVarianceApplicationNumber(
  token: string,
  recordId: string,
  created: Record<string, unknown>,
) {
  const immediate = readApplicationNumber(created);
  if (immediate) return immediate;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (attempt > 0) {
      await wait(400);
    }
    const status = await fetchVarianceApplicationStatus(token, recordId);
    if (status.applicationNumber) return status.applicationNumber;
  }

  return "";
}

async function createVarianceRecord(
  token: string,
  payload: Record<string, unknown>,
) {
  const sceneUrl = `https://api.knack.com/v1/scenes/${VARIANCE_SCENE}/views/${VARIANCE_FORM_VIEW}/records?format=both`;
  const pageUrl = `https://api.knack.com/v1/pages/${VARIANCE_SCENE}/views/${VARIANCE_FORM_VIEW}/records`;
  const livePayload = {
    ...payload,
    url: typeof window === "undefined" ? "" : window.location.href,
    crumbtrail: {},
  };

  try {
    const live = await postViewRecord(sceneUrl, livePayload, token, "renderer");
    if (live.ok) return live.record;
    // 401/403/404/400: renderer session was rejected or the route differs.
    // 5xx may already have saved the record, so do not submit again.
    if (live.status >= 500) throw live.error;
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
  }

  const scene = await postViewRecord(sceneUrl, payload, token, "knack");
  if (scene.ok) return scene.record;
  if (scene.expired) throw new AuthExpiredError();
  if (scene.status !== 404) throw scene.error;

  const legacy = await postViewRecord(pageUrl, payload, token, "knack");
  if (legacy.ok) return legacy.record;
  if (legacy.expired) throw new AuthExpiredError();
  throw legacy.error;
}

async function readVarianceRecord(
  token: string,
  scene: string,
  view: string,
  recordId: string,
) {
  const headers = {
    ...knackHeaders,
    Authorization: token.startsWith("Bearer ") ? token : token,
  };
  const urls = [
    `https://api.knack.com/v1/scenes/${scene}/views/${view}/records/${recordId}?format=both`,
    `https://api.knack.com/v1/pages/${scene}/views/${view}/records/${recordId}?format=both`,
  ];

  for (const url of urls) {
    const res = await fetch(url, { headers });
    if (res.status === 404) continue;
    if (res.status === 401 || res.status === 403) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as {
      record?: Record<string, unknown>;
    } & Record<string, unknown>;
    return data.record ?? data;
  }

  return null;
}

function varianceRequestHeaders(
  token: string,
  mode: "renderer" | "knack",
): Record<string, string> {
  const authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  if (mode === "knack" || typeof window === "undefined") {
    return {
      ...knackHeaders,
      Authorization: authorization,
    };
  }

  let timezone = "America/Edmonton";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || timezone;
  } catch {
    // Keep the Edmonton default.
  }

  return {
    "Content-Type": "application/json",
    "X-Knack-Application-Id": KNACK_APP_ID,
    "X-Knack-REST-API-Key": "renderer-session",
    Authorization: authorization,
    "x-knack-new-builder": "true",
    "knack-client-timezone": timezone,
    "x-knack-live-app-version": "v2",
    "x-knack-live-app-origin-hostname": window.location.hostname,
    "x-knack-live-app-origin-pathname": window.location.pathname,
    "x-knack-live-app-embedded": "true",
  };
}

async function postViewRecord(
  url: string,
  payload: Record<string, unknown>,
  token: string,
  mode: "renderer" | "knack",
): Promise<
  | { ok: true; record: Record<string, unknown> }
  | { ok: false; status: number; expired: boolean; error: Error }
> {
  const res = await fetch(url, {
    method: "POST",
    headers: varianceRequestHeaders(token, mode),
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const data = (await res.json()) as {
      record?: Record<string, unknown>;
    } & Record<string, unknown>;
    return { ok: true, record: data.record ?? data };
  }

  const message = await readKnackError(res);
  return {
    ok: false,
    status: res.status,
    expired: res.status === 401 || res.status === 403,
    error: new Error(message || `Unable to submit form (${res.status}).`),
  };
}

export function emptyAddress(): FormAddress {
  return {
    street: "",
    street2: "",
    city: "Edmonton",
    state: "AB",
    zip: "",
    country: "Canada",
  };
}

async function createViewRecord(
  scene: string,
  view: string,
  payload: Record<string, unknown>,
  token?: string,
): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = { ...knackHeaders };
  if (token) {
    headers.Authorization = token.startsWith("Bearer ") ? token : token;
  }

  const res = await fetch(
    `https://api.knack.com/v1/pages/${scene}/views/${view}/records`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    },
  );

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }

  if (!res.ok) {
    const message = await readKnackError(res);
    throw new Error(message || `Unable to submit form (${res.status}).`);
  }

  const data = (await res.json()) as {
    record?: Record<string, unknown>;
  } & Record<string, unknown>;
  return data.record ?? data;
}

async function uploadKnackImage(
  token: string,
  blob: Blob,
  filename: string,
): Promise<string> {
  const body = new FormData();
  body.append("files", blob, filename);

  const res = await fetch(
    `https://api.knack.com/v1/applications/${KNACK_APP_ID}/assets/image/upload`,
    {
      method: "POST",
      headers: {
        Authorization: token.startsWith("Bearer ") ? token : token,
        "X-Knack-Application-Id": KNACK_APP_ID,
        "X-Knack-REST-API-KEY": "knack",
      },
      body,
    },
  );

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }

  if (!res.ok) {
    throw new Error(`Unable to upload signature (${res.status}).`);
  }

  const data = (await res.json()) as {
    id?: string;
    file?: { id?: string };
  };
  const id = data.id || data.file?.id;
  if (!id) {
    throw new Error("Signature upload did not return a file id.");
  }
  return id;
}

async function fetchAuthenticatedJson<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`https://api.knack.com/v1/${path}`, {
    headers: {
      ...knackHeaders,
      Authorization: token.startsWith("Bearer ") ? token : token,
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new AuthExpiredError();
  }
  if (!res.ok) {
    throw new Error(`Unable to load form data (${res.status}).`);
  }
  return (await res.json()) as T;
}

async function readKnackError(res: Response) {
  try {
    const data = (await res.json()) as {
      errors?: Array<{ message?: string }>;
      message?: string;
      error?: string;
    };
    return (
      data.errors?.[0]?.message ||
      data.message ||
      data.error ||
      undefined
    );
  } catch {
    return undefined;
  }
}

function knackPhonePayload(phone: string) {
  const trimmed = phone.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  return {
    full: trimmed,
    number: digits || trimmed,
  };
}

function knackAddressPayload(address: FormAddress) {
  return {
    street: address.street.trim(),
    street2: address.street2.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    zip: address.zip.trim(),
    country: address.country.trim() || "Canada",
  };
}

function knackDatePayload(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // Prefer HTML date input (yyyy-mm-dd) → Knack mm/dd/yyyy
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    return { date: `${iso[2]}/${iso[3]}/${iso[1]}` };
  }

  return { date: trimmed };
}

function formatAddressLabel(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const row = value as {
      street?: string;
      street2?: string;
      city?: string;
      state?: string;
      zip?: string;
      full?: string;
    };
    if (row.full?.trim()) return row.full.trim();
    return [row.street, row.street2, row.city, row.state, row.zip]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(", ");
  }
  return "";
}

function formatPersonName(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const row = value as { first?: string; middle?: string; last?: string };
    return [row.first, row.middle, row.last]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function parseEmailValue(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const row = value as { email?: string };
    return row.email?.trim() || "";
  }
  return "";
}

function readApplicationNumber(record: Record<string, unknown>) {
  const candidates = [record.field_613_raw, record.field_613];
  for (const candidate of candidates) {
    const text = readKnackScalar(candidate);
    if (!text || isKnackRecordId(text)) continue;
    return text;
  }
  return "";
}

function readPaymentStatus(
  record: Record<string, unknown>,
): VariancePaymentStatus {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(record)) {
    if (!key.includes("field_51") && !key.includes("field_625")) continue;
    parts.push(readKnackScalar(value));
  }
  const blob = parts.join(" ").toLowerCase();
  if (blob.includes("failed")) return "failed";
  if (blob.includes("complete")) return "complete";
  if (blob.includes("pending")) return "pending";

  const connection = record.field_625_raw ?? record.field_625;
  if (Array.isArray(connection) && connection.length > 0) return "pending";
  if (connection && typeof connection === "object") return "pending";
  return "unpaid";
}

function preferPaymentStatus(
  current: VariancePaymentStatus,
  next: VariancePaymentStatus,
): VariancePaymentStatus {
  if (current === "complete" || next === "complete") return "complete";
  if (current === "failed" || next === "failed") return "failed";
  if (current === "pending" || next === "pending") return "pending";
  return "unpaid";
}

function readKnackScalar(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    return value
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map((item) => readKnackScalar(item)).filter(Boolean).join(" ");
  }
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    for (const key of ["identifier", "number", "value", "full"]) {
      if (row[key] != null) {
        const text = readKnackScalar(row[key]);
        if (text) return text;
      }
    }
  }
  return "";
}

function isKnackRecordId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
