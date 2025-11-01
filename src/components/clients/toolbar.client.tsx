"use client";

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
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ClientsToolbarProps = {
  basePath: string;
  q?: string;
  status?: "all" | "prospect" | "actif" | "inactif";
  sort?: "created_desc" | "created_asc" | "name_asc" | "name_desc";
  pageSize?: number;
};

export function ClientsToolbar({
  basePath,
  q = "",
  status = "all",
  sort = "created_desc",
  pageSize = 10,
}: ClientsToolbarProps) {
  const t = useTranslations("clients");

  function buildUrl(next: Partial<ClientsToolbarProps>) {
    const url = new URL(basePath, "http://x");
    const p = new URLSearchParams();
    const vals: Record<string, string | undefined> = {
      q,
      status,
      sort,
      pageSize: String(pageSize),
      ...(next.q !== undefined ? { q: next.q } : {}),
      ...(next.status !== undefined ? { status: next.status } : {}),
      ...(next.sort !== undefined ? { sort: next.sort } : {}),
      ...(next.pageSize !== undefined
        ? { pageSize: String(next.pageSize) }
        : {}),
    };
    Object.entries(vals).forEach(([k, v]) => {
      if (v !== undefined && v !== "") p.set(k, v);
    });
    url.search = p.toString();
    return `${url.pathname}${url.search}`;
  }

  function statusLabel(s: string) {
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
          statusLabel={statusLabel}
        />
      </div>

      <div className="flex items-center gap-2">
        <a
          href={buildUrl({ q: "", status: "all", sort: "created_desc" })}
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
  statusLabel,
}: {
  basePath: string;
  current: { q?: string; status?: string; sort?: string; pageSize?: number };
  className?: string;
  label: string;
  statusLabel: (s: string) => string;
}) {
  const status = current.status ?? "all";

  function buildUrl(next: Partial<typeof current>) {
    const url = new URL(basePath, "http://x");
    const p = new URLSearchParams();
    const vals: Record<string, string | undefined> = {
      q: current.q ?? "",
      status,
      sort: current.sort ?? "created_desc",
      pageSize: String(current.pageSize ?? 10),
      ...(next.q !== undefined ? { q: next.q } : {}),
      ...(next.status !== undefined ? { status: next.status } : {}),
      ...(next.sort !== undefined ? { sort: next.sort } : {}),
      ...(next.pageSize !== undefined
        ? { pageSize: String(next.pageSize) }
        : {}),
    };
    Object.entries(vals).forEach(([k, v]) => {
      if (v !== undefined && v !== "") p.set(k, v);
    });
    url.search = p.toString();
    return `${url.pathname}${url.search}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          {label}: {statusLabel(status)}
          <ChevronDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status}>
          {(["all", "prospect", "actif", "inactif"] as const).map((s) => (
            <DropdownMenuRadioItem
              key={s}
              value={s}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = buildUrl({ status: s });
              }}
            >
              {statusLabel(s)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
