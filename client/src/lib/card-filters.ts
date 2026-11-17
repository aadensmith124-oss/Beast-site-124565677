export const CARD_ATTRIBUTE_KEYS = [
  "email",
  "phone",
  "name",
  "fullAddress",
  "dob",
  "ssn",
  "ipAddress",
  "userAgent",
] as const;

export type CardAttributeKey = (typeof CARD_ATTRIBUTE_KEYS)[number];
export type AttributePresence = "all" | "present" | "missing";
export type CardAttributeFilters = Record<CardAttributeKey, AttributePresence>;

export const EMPTY_CARD_ATTRIBUTE_FILTERS: CardAttributeFilters = {
  email: "all",
  phone: "all",
  name: "all",
  fullAddress: "all",
  dob: "all",
  ssn: "all",
  ipAddress: "all",
  userAgent: "all",
};

const US_STATES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
  "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
  "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
]);

export function extractCardState(extras: string): string {
  if (!extras) return "";

  const labelled = extras.match(/(?:^|[|,;\s])(?:state|province|region)\s*[:=]\s*([a-z .'-]+)/i)?.[1];
  if (labelled) return labelled.trim().toUpperCase();

  const fields = extras.split(/[|\t,;]/).map((field) => field.trim());
  return fields.find((field) => US_STATES.has(field.toUpperCase()))?.toUpperCase() ?? "";
}

function hasEmail(value: string) {
  return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value);
}

function hasPhone(value: string) {
  if (/\b(?:phone|mobile|telephone|tel)\b\s*[:=]/i.test(value)) return true;
  return /(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]\d{3}[\s.-]\d{4}\b/.test(value);
}

function hasName(value: string) {
  if (/\b(?:full\s*name|first\s*name|last\s*name|name)\b\s*[:=]/i.test(value)) return true;
  const fourthField = value.split(/[|\t]/)[3]?.trim();
  return Boolean(
    fourthField &&
    /^[A-Za-z][A-Za-z'’-]+(?:\s+[A-Za-z][A-Za-z'’-]+){1,3}$/.test(fourthField),
  );
}

function hasAddress(value: string) {
  if (/\b(?:full\s*)?(?:address|street address|street)\b\s*[:=]/i.test(value)) return true;
  const fifthField = value.split(/[|\t]/)[4]?.trim();
  return Boolean(
    fifthField &&
    /^\d{1,6}\s+[A-Za-z0-9.'#-]+(?:\s+[A-Za-z0-9.'#-]+){0,5}$/.test(fifthField),
  );
}

function hasDob(value: string) {
  return /\b(?:dob|date\s+of\s+birth|birthdate)\b\s*[:=]/i.test(value)
    || /\b(?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b/.test(value)
    || /\b(?:19|20)\d{2}-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[12]\d|3[01])\b/.test(value);
}

function hasSsn(value: string) {
  return /\bssn\b\s*[:=]/i.test(value) || /\b\d{3}-\d{2}-\d{4}\b/.test(value);
}

function hasIpAddress(value: string) {
  return /\b(?:ip(?:\s*address)?)\b\s*[:=]/i.test(value)
    || /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/.test(value);
}

function hasUserAgent(value: string) {
  return /\b(?:user[- ]agent|useragent)\b\s*[:=]/i.test(value)
    || /\b(?:Mozilla\/|AppleWebKit\/|Chrome\/|Firefox\/|Safari\/|Gecko\/)\b/i.test(value);
}

export function cardHasAttribute(extras: string, key: CardAttributeKey): boolean {
  const value = extras ?? "";
  if (!value.trim()) return false;

  switch (key) {
    case "email": return hasEmail(value);
    case "phone": return hasPhone(value);
    case "name": return hasName(value);
    case "fullAddress": return hasAddress(value);
    case "dob": return hasDob(value);
    case "ssn": return hasSsn(value);
    case "ipAddress": return hasIpAddress(value);
    case "userAgent": return hasUserAgent(value);
  }
}
