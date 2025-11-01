"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import {
  type ClientInput,
  type ClientsListParams,
  type ActionResult,
  type ClientWithAddress,
} from "@/types/clients";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.email("Email invalide").optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(["prospect", "actif", "inactif"]).optional(),
  address: z
    .object({
      line1: z.string().min(1, "Ligne 1 requise"),
      line2: z.string().optional().nullable(),
      postal_code: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      region: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export async function listClientsAction(
  params: ClientsListParams
): Promise<ActionResult<ClientWithAddress[]>> {
  const supabase = await createSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, code: "invalid" };

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("clients")
    .select("*, client_addresses(*)", { count: "exact" })
    .eq("user_id", userData.user.id);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.q && params.q.trim().length > 0) {
    const search = params.q.toLowerCase();
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`
    );
  }

  switch (params.sort) {
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    case "created_asc":
      query = query.order("created_at", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) return { ok: false, code: "unknown", message: error.message };

  return {
    ok: true,
    client: (data as ClientWithAddress[]) ?? [],
    count: count ?? 0,
  };
}

export async function createClientAction(
  input: ClientInput
): Promise<ActionResult<ClientWithAddress>> {
  const supabase = await createSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, code: "invalid" };

  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid payload";
    return { ok: false, code: "invalid", message: first };
  }

  const { address, ...clientData } = parsed.data;

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...clientData, user_id: userData.user.id })
    .select()
    .single();

  if (error?.message?.includes("ux_clients_user_email")) {
    return { ok: false, code: "emailUnique" };
  }
  if (error) return { ok: false, code: "unknown", message: error.message };

  if (address) {
    const { error: addrError } = await supabase
      .from("client_addresses")
      .insert({ client_id: data.id, ...address });
    if (addrError)
      return { ok: false, code: "unknown", message: addrError.message };
  }

  revalidatePath("/dashboard/clients");
  return { ok: true, client: data as ClientWithAddress };
}

export async function updateClientAction(
  id: string,
  input: ClientInput
): Promise<ActionResult<ClientWithAddress>> {
  const supabase = await createSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, code: "invalid" };

  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid payload";
    return { ok: false, code: "invalid", message: first };
  }

  const { address, ...clientData } = parsed.data;

  const { data, error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select()
    .single();

  if (error?.message?.includes("ux_clients_user_email")) {
    return { ok: false, code: "emailUnique" };
  }
  if (error) return { ok: false, code: "unknown", message: error.message };

  if (address) {
    const { error: addrError } = await supabase
      .from("client_addresses")
      .upsert({ client_id: id, ...address }, { onConflict: "client_id" });
    if (addrError)
      return { ok: false, code: "unknown", message: addrError.message };
  }

  revalidatePath("/dashboard/clients");
  return { ok: true, client: data as ClientWithAddress };
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { ok: false, code: "invalid" };

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) return { ok: false, code: "unknown", message: error.message };

  revalidatePath("/dashboard/clients");
  return { ok: true };
}
