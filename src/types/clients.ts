export type ClientStatus = "prospect" | "actif" | "inactif";

export type ClientRow = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
};

export type AddressRow = {
  id: string;
  client_id: string;
  line1: string;
  line2: string | null;
  postal_code: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
};

export type AddressInput = {
  line1: string;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
};

export type ClientInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  notes?: string | null;
  address?: AddressInput | null;
  status?: ClientStatus;
};

export type ClientWithAddress = ClientRow & {
  address?: AddressRow | null;
};

export type ClientsStatusParam = "all" | ClientStatus;
export type ClientsSortParam =
  | "created_desc"
  | "created_asc"
  | "name_asc"
  | "name_desc";

export type ClientsListParams = {
  q?: string;
  status?: ClientsStatusParam;
  page?: number;
  pageSize?: number;
  sort?: ClientsSortParam;
};

export type ActionOk<T = unknown> = { ok: true; client?: T; count?: number };
export type ActionErr = {
  ok: false;
  code: "emailUnique" | "invalid" | "unknown";
  message?: string;
};
export type ActionResult<T = unknown> = ActionOk<T> | ActionErr;

export function isRecordObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function formatAddressShort(
  a?: Pick<AddressRow, "city" | "postal_code" | "country"> | null
) {
  if (!a) return "";
  const parts = [a.postal_code, a.city].filter(Boolean).join(" ");
  return [parts, a.country].filter(Boolean).join(" • ");
}

export function formatAddressFull(a?: AddressRow | null) {
  if (!a) return "";
  const l1 = a.line1;
  const l2 = a.line2;
  const city = [a.postal_code, a.city].filter(Boolean).join(" ");
  const reg = a.region;
  const c = a.country;
  return [l1, l2, city, reg, c].filter(Boolean).join("\n");
}
