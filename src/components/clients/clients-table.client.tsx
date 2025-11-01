"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useTranslations } from "next-intl";
import { AddressPopover } from "./address-popover";
import { StatusBadge } from "./status-badge";
import { RowActions } from "./row-actions.client";
import type { ClientWithAddress, ClientsListParams } from "@/types/clients";
import { createClientsToolbarSlot } from "./clients-toolbar-slot";

function formatDateDDMMYYYY(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function ClientsTableClient({
  rows,
  params,
  basePath = "/dashboard/clients",
}: {
  rows: ClientWithAddress[];
  params: Required<Pick<ClientsListParams, "page" | "pageSize">> &
    Omit<ClientsListParams, "page" | "pageSize">;
  basePath?: string;
}) {
  const t = useTranslations("clients");

  const columns = React.useMemo<ColumnDef<ClientWithAddress>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("columns.name"),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "company",
        header: t("columns.company"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.company ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: t("columns.email"),
        cell: ({ row }) => row.original.email ?? "—",
      },
      {
        accessorKey: "phone",
        header: t("columns.phone"),
        cell: ({ row }) => row.original.phone ?? "—",
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "address",
        header: t("columns.address"),
        cell: ({ row }) => <AddressPopover client={row.original as any} />,
        enableSorting: false,
      },
      {
        accessorKey: "created_at",
        header: t("columns.created_at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDateDDMMYYYY(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <RowActions id={row.original.id} />,
        enableSorting: false,
      },
    ],
    [t]
  );

  const ToolbarSlot = React.useMemo(
    () =>
      createClientsToolbarSlot({
        basePath,
        q: params.q,
        status: params.status,
        sort: params.sort,
        pageSize: params.pageSize,
      }),
    [basePath, params.q, params.status, params.sort, params.pageSize]
  );

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchableColumnId={undefined}
      initialPageSize={rows.length || 10}
      showViewOptions={true}
      showPagination={false}
      ToolbarSlot={ToolbarSlot}
      getRowId={(row) => row.id}
    />
  );
}
