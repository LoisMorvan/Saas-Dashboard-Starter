import * as React from "react";
import { getTranslations } from "next-intl/server";
import { createClient as createSupabase } from "@/lib/supabase/server";
import { ClientsTableClient } from "@/components/clients/clients-table.client";
import { PaginationServer } from "@/components/clients/pagination-server";
import type {
  ClientsListParams,
  ClientWithAddress,
  ClientsStatusParam,
  ClientsSortParam,
} from "@/types/clients";
import { ClientControllerClient } from "@/components/clients/client-controller.client";
import { ClientsEmpty } from "@/components/clients/clients-empty";

function parseParams(
  searchParams: Record<string, string | string[] | undefined>
): Required<Pick<ClientsListParams, "page" | "pageSize">> &
  Omit<ClientsListParams, "page" | "pageSize"> {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const statusRaw =
    typeof searchParams.status === "string" ? searchParams.status : "all";
  const status: ClientsStatusParam = [
    "all",
    "prospect",
    "actif",
    "inactif",
  ].includes(statusRaw)
    ? (statusRaw as ClientsStatusParam)
    : "all";

  const sortRaw =
    typeof searchParams.sort === "string" ? searchParams.sort : "created_desc";
  const sort: ClientsSortParam = [
    "created_desc",
    "created_asc",
    "name_asc",
    "name_desc",
  ].includes(sortRaw)
    ? (sortRaw as ClientsSortParam)
    : "created_desc";

  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(searchParams.pageSize ?? 10) || 10)
  );

  return { q, status, sort, page, pageSize };
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("clients");
  const sp = await searchParams;
  const { q, status, sort, page, pageSize } = parseParams(sp);

  const supabase = await createSupabase();

  let query = supabase
    .from("clients")
    .select("*, client_addresses:client_addresses(*)", { count: "exact" });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (q) {
    const like = `%${q}%`;
    query = query.or(
      [
        `name.ilike.${like}`,
        `email.ilike.${like}`,
        `phone.ilike.${like}`,
        `company.ilike.${like}`,
      ].join(",")
    );
  }

  switch (sort) {
    case "name_asc":
      query = query.order("name", { ascending: true, nullsFirst: false });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false, nullsFirst: false });
      break;
    case "created_asc":
      query = query.order("created_at", { ascending: true, nullsFirst: false });
      break;
    case "created_desc":
    default:
      query = query.order("created_at", {
        ascending: false,
        nullsFirst: false,
      });
      break;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-lg font-semibold">
          {t("title", { default: "Clients" })}
        </h1>
        <p className="text-destructive mt-2">Erreur: {error.message}</p>
      </div>
    );
  }

  const rows = (data ?? []) as ClientWithAddress[];
  const total = count ?? 0;

  const otherParams = { q, status, sort, pageSize };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">
        {t("title", { default: "Clients" })}
      </h1>

      {total === 0 ? (
        <>
          <ClientsEmpty />
          <ClientController initialRows={rows} />
        </>
      ) : (
        <>
          <ClientsTableClient
            rows={rows}
            params={{ q, status, sort, page, pageSize }}
            basePath="/dashboard/clients"
          />
          <PaginationServer
            basePath="/dashboard/clients"
            total={total}
            page={page}
            pageSize={pageSize}
            otherParams={{ q, status, sort, pageSize }}
          />
          <ClientController initialRows={rows} />
        </>
      )}
    </div>
  );
}

/* ------------------------------ Client controller ------------------------------ */

function ClientController({
  initialRows,
}: {
  initialRows: ClientWithAddress[];
}) {
  // Ce composant est client-side mais déclaré ici (RSC). On le force en client :
  // 1) Soit tu crées un fichier séparé client: src/components/clients/client-controller.client.tsx
  // 2) Soit on le garde inline avec "use client"

  return <ClientControllerClient initialRows={initialRows} />;
}
