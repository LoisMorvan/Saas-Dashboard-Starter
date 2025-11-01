"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import type {
  ClientsListParams,
  ClientsStatusParam,
  ClientsSortParam,
} from "@/types/clients";

export type ClientsToolbarProps = {
  basePath: string;
  q?: string;
  status?: ClientsStatusParam;
  sort?: ClientsSortParam;
  pageSize?: number;
};

function buildUrl(
  basePath: string,
  current: Required<ClientsToolbarProps>,
  next: Partial<ClientsToolbarProps>
) {
  const url = new URL(basePath, "http://x");
  const p = new URLSearchParams();

  const vals: Record<string, string | undefined> = {
    q: current.q ?? "",
    status: current.status ?? "all",
    sort: current.sort ?? "created_desc",
    pageSize: String(current.pageSize ?? 10),
    ...(next.q !== undefined ? { q: next.q } : {}),
    ...(next.status !== undefined ? { status: next.status } : {}),
    ...(next.sort !== undefined ? { sort: next.sort } : {}),
    ...(next.pageSize !== undefined ? { pageSize: String(next.pageSize) } : {}),
  };

  Object.entries(vals).forEach(([k, v]) => {
    if (v !== undefined && v !== "") p.set(k, v);
  });

  url.search = p.toString();
  return `${url.pathname}${url.search}`;
}

function statusLabelOf(
  t: ReturnType<typeof useTranslations>,
  s?: ClientsStatusParam
) {
  switch (s) {
    case "prospect":
      return t("status.prospect");
    case "actif":
      return t("status.actif");
    case "inactif":
      return t("status.inactif");
    default:
      return t("status.all");
  }
}

const SORT_VALUES = [
  "created_desc",
  "created_asc",
  "name_asc",
  "name_desc",
] as const;
type SortValue = (typeof SORT_VALUES)[number];

const STATUS_VALUES = ["all", "prospect", "actif", "inactif"] as const;
type StatusValue = (typeof STATUS_VALUES)[number];

function ToolbarDesktop(props: Required<ClientsToolbarProps>) {
  const { basePath, q, status, sort, pageSize } = props;
  const t = useTranslations("clients");

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center gap-2">
        <form
          action={basePath}
          className="flex w-full max-w-sm items-center gap-2"
        >
          <Input
            name="q"
            placeholder={t("searchPlaceholder")}
            defaultValue={q}
            aria-label={t("searchAria")}
          />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="pageSize" value={pageSize} />
          <Button type="submit">{t("searchCta")}</Button>
        </form>

        <StatusDropdown
          basePath={basePath}
          current={{ q, status, sort, pageSize }}
          className="ml-2"
          label={t("filterByStatus")}
        />
      </div>

      <div className="flex items-center gap-2">
        <a
          href={buildUrl(basePath, props, {
            q: "",
            status: "all",
            sort: "created_desc",
          })}
          className={cn(
            "text-sm text-muted-foreground underline-offset-4 hover:underline"
          )}
        >
          {t("reset")}
        </a>

        <Button data-action="open-create-client">{t("newClient")}</Button>
      </div>
    </div>
  );
}

function StatusDropdown({
  basePath,
  current,
  className,
  label,
}: {
  basePath: string;
  current: {
    q?: string;
    status?: ClientsStatusParam;
    sort?: ClientsSortParam;
    pageSize?: number;
  };
  className?: string;
  label: string;
}) {
  const t = useTranslations("clients");
  const status = (current.status ?? "all") as StatusValue;
  const pretty = statusLabelOf(t, status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          {label}: {pretty}
          <ChevronDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status}>
          {STATUS_VALUES.map((s) => (
            <DropdownMenuRadioItem
              key={s}
              value={s}
              onSelect={(e) => {
                e.preventDefault();
                window.location.href = buildUrl(
                  basePath,
                  {
                    basePath,
                    q: current.q ?? "",
                    status: status,
                    sort: (current.sort ?? "created_desc") as SortValue,
                    pageSize: current.pageSize ?? 10,
                  },
                  { status: s }
                );
              }}
            >
              {statusLabelOf(t, s)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToolbarMobile(props: Required<ClientsToolbarProps>) {
  const { basePath, q, status, sort, pageSize } = props;
  const t = useTranslations("clients");

  type FormState = {
    q: string;
    status: StatusValue;
    sort: SortValue;
    pageSize: number;
  };

  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = React.useState<FormState>({
    q,
    status: (status ?? "all") as StatusValue,
    sort: SORT_VALUES.includes(sort as SortValue)
      ? (sort as SortValue)
      : "created_desc",
    pageSize,
  });

  const SORT_LABELS: Record<SortValue, string> = {
    created_desc: t("sort.created_desc"),
    created_asc: t("sort.created_asc"),
    name_asc: t("sort.name_asc"),
    name_desc: t("sort.name_desc"),
  };

  function apply() {
    const href = buildUrl(basePath, props, formState);
    window.location.href = href;
  }

  function resetAll() {
    const href = buildUrl(basePath, props, {
      q: "",
      status: "all",
      sort: "created_desc",
      pageSize: 10,
    });
    window.location.href = href;
  }

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <Button
        variant="outline"
        className="w-full justify-center sm:hidden"
        onClick={() => setOpen(true)}
      >
        <Filter className="mr-2 size-4" />
        {t("filters")}
      </Button>

      <Button
        className="hidden sm:inline-flex"
        data-action="open-create-client"
      >
        {t("newClient")}
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t("filters")}</DrawerTitle>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="q">
                {t("searchPlaceholder")}
              </label>
              <Input
                id="q"
                value={formState.q}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, q: e.target.value }))
                }
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchAria")}
              />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium">{t("filterByStatus")}</div>
              <div className="flex flex-wrap gap-2">
                {STATUS_VALUES.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={formState.status === s ? "default" : "outline"}
                    className="h-8"
                    onClick={() => setFormState((st) => ({ ...st, status: s }))}
                  >
                    {statusLabelOf(t, s)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="sort">
                {t("sortBy")}
              </label>
              <select
                id="sort"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={formState.sort}
                onChange={(e) => {
                  const next = e.target.value as string;
                  setFormState((s) => ({
                    ...s,
                    sort: SORT_VALUES.includes(next as SortValue)
                      ? (next as SortValue)
                      : s.sort,
                  }));
                }}
              >
                {SORT_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {SORT_LABELS[v]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="pageSize">
                {t("pageSize")}
              </label>
              <select
                id="pageSize"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={formState.pageSize}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    pageSize: Number(e.target.value),
                  }))
                }
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DrawerFooter className="gap-2">
            <Button onClick={apply}>{t("apply")}</Button>
            <Button variant="secondary" onClick={resetAll}>
              {t("clear")}
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">
                <X className="mr-2 size-4" />
                {t("close")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function ClientsToolbar({
  basePath,
  q = "",
  status = "all",
  sort = "created_desc",
  pageSize = 10,
}: ClientsToolbarProps) {
  const isMobile = useIsMobile();

  const requiredProps: Required<ClientsToolbarProps> = {
    basePath,
    q,
    status,
    sort,
    pageSize,
  };

  return isMobile ? (
    <ToolbarMobile {...requiredProps} />
  ) : (
    <ToolbarDesktop {...requiredProps} />
  );
}

export function createClientsToolbarSlot(cfg: {
  basePath: string;
  q?: string;
  status?: ClientsListParams["status"];
  sort?: ClientsListParams["sort"];
  pageSize?: number;
}) {
  return function ClientsToolbarSlot(_props: { table?: unknown }) {
    return (
      <ClientsToolbar
        basePath={cfg.basePath}
        q={cfg.q}
        status={cfg.status}
        sort={cfg.sort}
        pageSize={cfg.pageSize}
      />
    );
  };
}
