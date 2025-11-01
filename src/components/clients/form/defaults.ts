import type { ClientWithAddress } from "@/types/clients";
import type { ClientFormValues } from "./schema";

export function makeDefaultValues(
  initial?: ClientWithAddress | null
): ClientFormValues {
  const addr =
    (initial as any)?.client_addresses ?? (initial as any)?.address ?? null;

  return {
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    company: initial?.company ?? "",
    notes: initial?.notes ?? "",
    status: initial?.status ?? "prospect",
    address: {
      line1: addr?.line1 ?? "",
      line2: addr?.line2 ?? "",
      postal_code: addr?.postal_code ?? "",
      city: addr?.city ?? "",
      region: addr?.region ?? "",
      country: addr?.country ?? "",
    },
  };
}
