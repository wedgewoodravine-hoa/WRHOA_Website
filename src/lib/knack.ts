const APP_ID = "6002c8a07f0a19001bd7ee6d";
const COMMUNITY_SCENE = "scene_256";
const COMMUNITY_VIEW = "view_474";

const NEWS_SCENE = "scene_400";
const NEWS_LIST_VIEW = "view_744";
const NEWSLETTER_VIEW = "view_724";
const NEWS_DETAIL_VIEW = "view_789";
const NEWS_LINK_VIEW = "view_792";
const CALENDAR_SCENE = "scene_401";
const CALENDAR_VIEW = "view_722";

const PARK_DEVELOPMENT_SCENE = "scene_450";
const PARK_DEVELOPMENT_VIEW = "view_837";

const NEWS_LIMIT = 8;
const NEWSLETTER_LIMIT = 5;
const UPCOMING_LIMIT = 6;

const BOARD_SCENE = "scene_275";
const BOARD_VIEW = "view_508";

const GUIDELINES_SCENE = "scene_264";
const GUIDELINES_LIST_VIEW = "view_494";
const GUIDELINES_DETAIL_VIEW = "view_495";
const GUIDELINES_DETAIL_SCENE = "scene_265";

export type CommunityLink = {
  url: string;
  label: string;
};

export type CommunityAmenity = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  thumbUrl?: string;
  link?: CommunityLink;
};

export type HoaFile = {
  url: string;
  filename: string;
};

export type HoaNewsItem = {
  id: string;
  title: string;
  category: string;
  dateISO?: string;
  dateLabel?: string;
  message: string;
  link?: CommunityLink;
  file?: HoaFile;
};

export type HoaNewsletter = {
  id: string;
  title: string;
  file?: HoaFile;
};

export type HomeUpdates = {
  news: HoaNewsItem[];
  upcoming: HoaNewsItem[];
  /** True when `upcoming` is future-dated; false when showing recent dated fallback. */
  upcomingIsFuture: boolean;
  newsletters: HoaNewsletter[];
};

export type BoardMember = {
  id: string;
  position: string;
  name: string;
  bio: string;
  photoUrl?: string;
};

export type DesignGuideline = {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  description: string;
  files: HoaFile[];
};

export type DesignGuidelineCategory = {
  id: string;
  name: string;
  shortLabel: string;
  sortOrder: number;
  guidelines: DesignGuideline[];
};

type KnackImageRaw = {
  url?: string;
  thumb_url?: string;
};

type KnackLinkRaw = {
  url?: string;
  label?: string | null;
};

type KnackFileRaw = {
  url?: string;
  filename?: string;
};

type KnackDateRaw = {
  date?: string;
  iso_timestamp?: string;
  date_formatted?: string;
};

type AmenityRecord = {
  id: string;
  field_319_raw?: string;
  field_320_raw?: string;
  field_479_raw?: string;
  field_321_raw?: KnackImageRaw | string | null;
  field_480_raw?: KnackLinkRaw | string | null;
};

type NewsListRecord = {
  id: string;
  field_311_raw?: string;
  field_565_raw?: string;
  field_564_raw?: KnackDateRaw | string | null;
};

type NewsDetailRecord = {
  id: string;
  field_311_raw?: string;
  field_565_raw?: string;
  field_131_raw?: string;
  field_564_raw?: KnackDateRaw | string | null;
  field_567_raw?: KnackFileRaw | string | null;
};

type NewsLinkRecord = {
  id: string;
  field_312_raw?: KnackLinkRaw | string | null;
};

type NewsletterRecord = {
  id: string;
  field_311_raw?: string;
  field_567_raw?: KnackFileRaw | string | null;
};

type ParkDevelopmentRecord = {
  id: string;
  field_311_raw?: string;
  field_131_raw?: string;
  field_252_raw?: KnackDateRaw | string | null;
  field_312_raw?: KnackLinkRaw | string | null;
  field_567_raw?: KnackFileRaw | string | null;
};

type BoardMemberRecord = {
  id: string;
  field_406_raw?: string;
  field_412_raw?: Array<{ id?: string; identifier?: string }> | string | null;
  field_415_raw?: string;
  "field_412.field_415_raw"?: string;
  field_416_raw?: KnackImageRaw | KnackImageRaw[] | string | null;
  "field_412.field_416_raw"?: KnackImageRaw | KnackImageRaw[] | string | null;
};

type GuidelineListRecord = {
  id: string;
  field_255_raw?: string;
  field_292_raw?: Array<{ id?: string; identifier?: string }> | string | null;
};

type GuidelineDetailRecord = {
  id: string;
  field_255_raw?: string;
  field_291_raw?: string;
  field_256_raw?: KnackFileRaw | string | null;
  field_365_raw?: KnackFileRaw | string | null;
};

type KnackRecordsResponse<T> = {
  records?: T[];
  total_records?: number;
};

const CATEGORY_ORDER = [
  "Location",
  "Amenities",
  "Area Facilities",
  "Area Schools",
  "Community Safety",
];

const knackHeaders = {
  "X-Knack-Application-Id": APP_ID,
  "X-Knack-REST-API-KEY": "knack",
};

async function knackGet<T>(path: string, params?: Record<string, string>) {
  const url = new URL(`https://api.knack.com/v1/pages/${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, {
    headers: knackHeaders,
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Knack request failed (${res.status}) for ${path}`);
  }

  return (await res.json()) as T;
}

export async function fetchCommunityAmenities(): Promise<CommunityAmenity[]> {
  const data = await knackGet<KnackRecordsResponse<AmenityRecord>>(
    `${COMMUNITY_SCENE}/views/${COMMUNITY_VIEW}/records`,
    { rows_per_page: "100" },
  );
  return (data.records ?? []).map(normalizeAmenity);
}

export async function fetchBoardMembers(): Promise<BoardMember[]> {
  const data = await knackGet<KnackRecordsResponse<BoardMemberRecord>>(
    `${BOARD_SCENE}/views/${BOARD_VIEW}/records`,
    { rows_per_page: "50" },
  );
  return (data.records ?? []).map(normalizeBoardMember);
}

export async function fetchDesignGuidelines(): Promise<DesignGuidelineCategory[]> {
  const list = await knackGet<KnackRecordsResponse<GuidelineListRecord>>(
    `${GUIDELINES_SCENE}/views/${GUIDELINES_LIST_VIEW}/records`,
    { rows_per_page: "100" },
  );

  const records = list.records ?? [];
  const details = await Promise.all(
    records.map(async (record) => {
      try {
        const detail = await knackGet<GuidelineDetailRecord>(
          `${GUIDELINES_DETAIL_SCENE}/views/${GUIDELINES_DETAIL_VIEW}/records/${record.id}`,
        );
        return normalizeGuideline(record, detail);
      } catch {
        return normalizeGuideline(record, null);
      }
    }),
  );

  return groupGuidelinesByCategory(details);
}

export function groupGuidelinesByCategory(items: DesignGuideline[]) {
  const groups = new Map<string, DesignGuidelineCategory>();

  for (const item of items) {
    const key = item.categoryId || item.category;
    const existing = groups.get(key);
    if (existing) {
      existing.guidelines.push(item);
      continue;
    }

    groups.set(key, {
      id: key,
      name: item.category,
      shortLabel: shortCategoryLabel(item.category),
      sortOrder: categorySortOrder(item.category),
      guidelines: [item],
    });
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      guidelines: [...group.guidelines].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { numeric: true }),
      ),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export async function fetchParkDevelopmentUpdates(): Promise<HoaNewsItem[]> {
  const data = await knackGet<KnackRecordsResponse<ParkDevelopmentRecord>>(
    `${PARK_DEVELOPMENT_SCENE}/views/${PARK_DEVELOPMENT_VIEW}/records`,
    { rows_per_page: "50" },
  );

  return (data.records ?? []).map(normalizeParkDevelopmentItem);
}

export async function fetchHomeUpdates(): Promise<HomeUpdates> {
  const [listData, newsletterData, calendarData] = await Promise.all([
    knackGet<KnackRecordsResponse<NewsListRecord>>(
      `${NEWS_SCENE}/views/${NEWS_LIST_VIEW}/records`,
      { rows_per_page: "25" },
    ),
    knackGet<KnackRecordsResponse<NewsletterRecord>>(
      `${NEWS_SCENE}/views/${NEWSLETTER_VIEW}/records`,
      { rows_per_page: String(NEWSLETTER_LIMIT) },
    ),
    knackGet<KnackRecordsResponse<NewsListRecord>>(
      `${CALENDAR_SCENE}/views/${CALENDAR_VIEW}/records`,
      { rows_per_page: "50" },
    ).catch(() => ({ records: [] as NewsListRecord[] })),
  ]);

  const listRecords = listData.records ?? [];
  const featuredIds = listRecords.slice(0, NEWS_LIMIT).map((record) => record.id);

  const detailed = await Promise.all(
    featuredIds.map(async (id) => {
      try {
        return await fetchNewsDetails(id);
      } catch {
        const fallback = listRecords.find((record) => record.id === id);
        return fallback ? normalizeNewsListItem(fallback) : null;
      }
    }),
  );

  const news = detailed.filter((item): item is HoaNewsItem => Boolean(item));
  const newsletters = (newsletterData.records ?? [])
    .map(normalizeNewsletter)
    .filter((item) => Boolean(item.file));

  const calendarItems = (calendarData.records ?? []).map(normalizeNewsListItem);
  const { items: upcoming, isFuture: upcomingIsFuture } = buildUpcoming(
    news,
    calendarItems,
    listRecords,
  );

  return { news, upcoming, upcomingIsFuture, newsletters };
}

export function groupAmenitiesByCategory(items: CommunityAmenity[]) {
  const groups = new Map<string, CommunityAmenity[]>();

  for (const item of items) {
    const key = item.category || "Other";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return [...groups.entries()].sort(([a], [b]) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b);
  });
}

async function fetchNewsDetails(id: string): Promise<HoaNewsItem> {
  const [detail, link] = await Promise.all([
    knackGet<NewsDetailRecord>(
      `scene_427/views/${NEWS_DETAIL_VIEW}/records/${id}`,
    ),
    knackGet<NewsLinkRecord>(
      `scene_427/views/${NEWS_LINK_VIEW}/records/${id}`,
    ).catch(() => null),
  ]);

  const date = parseKnackDate(detail.field_564_raw);
  const file = parseKnackFile(detail.field_567_raw);
  const linkRaw =
    link?.field_312_raw && typeof link.field_312_raw === "object"
      ? link.field_312_raw
      : null;

  return {
    id: detail.id,
    title: detail.field_311_raw?.trim() || "Untitled update",
    category: detail.field_565_raw?.trim() || "HOA News",
    dateISO: date?.iso,
    dateLabel: date?.label,
    message: stripHtml(detail.field_131_raw || ""),
    link: linkRaw?.url
      ? {
          url: linkRaw.url,
          label: linkRaw.label?.trim() || "Open link",
        }
      : undefined,
    file,
  };
}

function buildUpcoming(
  news: HoaNewsItem[],
  calendarItems: HoaNewsItem[],
  listRecords: NewsListRecord[],
) {
  const byId = new Map<string, HoaNewsItem>();

  for (const item of [...calendarItems, ...news]) {
    if (item.dateISO) byId.set(item.id, item);
  }

  // Include dated list items beyond the featured detail set
  for (const record of listRecords) {
    if (byId.has(record.id)) continue;
    const item = normalizeNewsListItem(record);
    if (item.dateISO) byId.set(item.id, item);
  }

  const dated = [...byId.values()].filter((item) => Boolean(item.dateISO));
  const todayKey = edmontonDateKey(new Date());

  const future = dated
    .filter((item) => {
      const key = edmontonDateKey(new Date(item.dateISO!));
      return Boolean(key) && key >= todayKey;
    })
    .sort((a, b) => dateTime(a.dateISO!) - dateTime(b.dateISO!));

  if (future.length > 0) {
    return { items: future.slice(0, UPCOMING_LIMIT), isFuture: true };
  }

  const recent = dated
    .sort((a, b) => dateTime(b.dateISO!) - dateTime(a.dateISO!))
    .slice(0, UPCOMING_LIMIT);

  return { items: recent, isFuture: false };
}

function dateTime(iso: string) {
  return new Date(iso).getTime();
}

function normalizeNewsListItem(record: NewsListRecord): HoaNewsItem {
  const date = parseKnackDate(record.field_564_raw);
  return {
    id: record.id,
    title: record.field_311_raw?.trim() || "Untitled update",
    category: record.field_565_raw?.trim() || "HOA News",
    dateISO: date?.iso,
    dateLabel: date?.label,
    message: "",
  };
}

function normalizeNewsletter(record: NewsletterRecord): HoaNewsletter {
  return {
    id: record.id,
    title: record.field_311_raw?.trim() || "Newsletter",
    file: parseKnackFile(record.field_567_raw),
  };
}

function normalizeParkDevelopmentItem(
  record: ParkDevelopmentRecord,
): HoaNewsItem {
  const date = parseKnackDate(record.field_252_raw);
  const linkRaw =
    record.field_312_raw && typeof record.field_312_raw === "object"
      ? record.field_312_raw
      : null;

  return {
    id: record.id,
    title: record.field_311_raw?.trim() || "Untitled update",
    category: "Park Development",
    dateISO: date?.iso,
    dateLabel: date?.label,
    message: cleanMultilineText(record.field_131_raw || ""),
    link: linkRaw?.url
      ? {
          url: linkRaw.url,
          label: linkRaw.label?.trim() || "Open link",
        }
      : undefined,
    file: parseKnackFile(record.field_567_raw),
  };
}

/** Prefer these URLs over Knack when City of Edmonton pages move. */
const AMENITY_LINK_OVERRIDES: Record<string, string> = {
  "Callingwood Arena":
    "https://www.edmonton.ca/activities_parks_recreation/arenas",
};

function normalizeAmenity(record: AmenityRecord): CommunityAmenity {
  const image =
    record.field_321_raw && typeof record.field_321_raw === "object"
      ? record.field_321_raw
      : null;
  const link =
    record.field_480_raw && typeof record.field_480_raw === "object"
      ? record.field_480_raw
      : null;
  const name = record.field_319_raw?.trim() || "Untitled";
  const overrideUrl = AMENITY_LINK_OVERRIDES[name];
  const resolvedUrl = overrideUrl || link?.url;

  return {
    id: record.id,
    name,
    description: stripHtml(record.field_320_raw || ""),
    category: record.field_479_raw?.trim() || "Other",
    imageUrl: image?.url,
    thumbUrl: image?.thumb_url || image?.url,
    link: resolvedUrl
      ? {
          url: resolvedUrl,
          label: link?.label?.trim() || name || "Learn more",
        }
      : undefined,
  };
}

function normalizeBoardMember(record: BoardMemberRecord): BoardMember {
  const connected = Array.isArray(record.field_412_raw)
    ? record.field_412_raw[0]
    : null;
  const photoRaw =
    record["field_412.field_416_raw"] ?? record.field_416_raw ?? null;
  const photo = Array.isArray(photoRaw)
    ? photoRaw[0]
    : photoRaw && typeof photoRaw === "object"
      ? photoRaw
      : null;
  const bioRaw =
    record["field_412.field_415_raw"] ?? record.field_415_raw ?? "";

  return {
    id: record.id,
    position: record.field_406_raw?.trim() || "Board member",
    name: connected?.identifier?.trim() || "Board member",
    bio: cleanMultilineText(
      typeof bioRaw === "string" ? bioRaw : String(bioRaw || ""),
    ),
    photoUrl: photo?.url || photo?.thumb_url,
  };
}

function normalizeGuideline(
  listRecord: GuidelineListRecord,
  detail: GuidelineDetailRecord | null,
): DesignGuideline {
  const categoryRaw = Array.isArray(listRecord.field_292_raw)
    ? listRecord.field_292_raw[0]
    : null;
  const files = [
    parseKnackFile(detail?.field_256_raw),
    parseKnackFile(detail?.field_365_raw),
  ].filter((file): file is HoaFile => Boolean(file));

  return {
    id: listRecord.id,
    title:
      detail?.field_255_raw?.trim() ||
      listRecord.field_255_raw?.trim() ||
      "Untitled guideline",
    category: categoryRaw?.identifier?.trim() || "Other guidelines",
    categoryId: categoryRaw?.id,
    description: cleanMultilineText(detail?.field_291_raw || ""),
    files,
  };
}

function shortCategoryLabel(category: string) {
  const cleaned = category.replace(/^\d+(\.\d+)?\s*/, "").trim();
  const shortcuts: Record<string, string> = {
    "Design Guideline Objectives": "Objectives",
    "City of Edmonton Standards": "City standards",
    "Building Massing and Siting": "Massing & siting",
    Materials: "Materials",
    Landscaping: "Landscaping",
    "Other Important Guidelines": "Other",
    "Approval Process": "Approval",
    "Guideline & Compliance Documents": "Documents",
  };
  return shortcuts[cleaned] || cleaned;
}

function categorySortOrder(category: string) {
  const match = category.match(/^(\d+)/);
  if (match) return Number(match[1]);
  return 100;
}

function cleanMultilineText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

function parseKnackFile(value: KnackFileRaw | string | null | undefined) {
  if (!value || typeof value !== "object" || !value.url) return undefined;
  return {
    url: value.url,
    filename: value.filename?.trim() || "Download file",
  };
}

function edmontonDateKey(date: Date) {
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
