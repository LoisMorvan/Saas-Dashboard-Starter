"use client";

import type { ClientsListParams } from "@/types/clients";
import { ClientsToolbar } from "./toolbar.client";

type Cfg = {
  basePath: string;
  q?: string;
  status?: ClientsListParams["status"];
  sort?: ClientsListParams["sort"];
  pageSize?: number;
};

export function createClientsToolbarSlot(cfg: Cfg) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function ClientsToolbarSlot(_props: { table?: unknown }) {
    return <ClientsToolbar {...cfg} />;
  };
}
