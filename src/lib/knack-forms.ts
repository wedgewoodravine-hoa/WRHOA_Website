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

export async function searchContactProperties(
  query: string,
): Promise<KnackConnectionOption[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const filters = JSON.stringify([
    {
      field: "field_8",
      operator: "contains",
      value: trimmed.toUpperCase(),
    },
  ]);

  const url = new URL(
    `https://api.knack.com/v1/scenes/${NON_HOMEOWNER_CONTACT_SCENE}/views/${NON_HOMEOWNER_CONTACT_VIEW}/connections/field_115`,
  );
  url.searchParams.set("rows_per_page", "25");
  url.searchParams.set("filters", filters);

  const res = await fetch(url.toString(), { headers: knackHeaders });
  if (!res.ok) {
    throw new Error(`Unable to search properties (${res.status}).`);
  }

  const data = (await res.json()) as RecordsResponse<KnackConnectionOption & {
    identifier?: string;
  }>;

  return (data.records ?? []).map((record) => ({
    id: record.id,
    label: record.identifier?.trim() || record.label || "Property",
  }));
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

  const record = await createViewRecord(
    VARIANCE_SCENE,
    VARIANCE_FORM_VIEW,
    payload,
    token,
  );

  const id = String(record.id || "");
  if (!id) {
    throw new Error("Variance application was created without a record id.");
  }

  const applicationNumber =
    readString(record.field_613_raw) ||
    readString(record.field_613) ||
    id;

  return {
    id,
    applicationNumber,
    paymentUrl: `${VARIANCE_PAYMENT_HASH}/${id}/`,
    paymentDistributionKey: VARIANCE_PAYMENT_DISTRIBUTION,
    feeLabel: "Application Fee: $100.00 + $5.00 GST = $105.00",
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

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
