"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Params = Record<string, string | number | undefined>;

function hrefWith(basePath: string, params: Params) {
  const url = new URL(basePath, "http://x");
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, String(v));
  });
  url.search = q.toString();
  return `${url.pathname}${url.search}`;
}

export function PaginationServer({
  basePath,
  total,
  page,
  pageSize,
  otherParams,
  maxButtons = 7,
}: {
  basePath: string;
  total: number;
  page: number;
  pageSize: number;
  otherParams: Params;
  maxButtons?: number;
}) {
  const t = useTranslations("clients");
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  const pages = React.useMemo(() => {
    const res: number[] = [];
    if (pageCount <= maxButtons) {
      for (let i = 1; i <= pageCount; i++) res.push(i);
      return res;
    }
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(pageCount, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }, [page, pageCount, maxButtons]);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm text-muted-foreground">
        {t("pagination.summary", { total, page, pageCount })}
      </div>

      <div className="flex items-center gap-1">
        <a
          href={hrefWith(basePath, {
            ...otherParams,
            page: Math.max(1, page - 1),
          })}
          className={cn(
            "px-3 py-1 rounded-md border text-sm",
            page <= 1 && "pointer-events-none opacity-50"
          )}
        >
          {t("pagination.prev")}
        </a>

        {pages[0] > 1 && <span className="px-2">…</span>}

        {pages.map((p) => (
          <a
            key={p}
            href={hrefWith(basePath, { ...otherParams, page: p })}
            className={cn(
              "px-3 py-1 rounded-md border text-sm",
              p === page && "bg-primary text-primary-foreground"
            )}
          >
            {p}
          </a>
        ))}

        {pages[pages.length - 1] < pageCount && <span className="px-2">…</span>}

        <a
          href={hrefWith(basePath, {
            ...otherParams,
            page: Math.min(pageCount, page + 1),
          })}
          className={cn(
            "px-3 py-1 rounded-md border text-sm",
            page >= pageCount && "pointer-events-none opacity-50"
          )}
        >
          {t("pagination.next")}
        </a>
      </div>
    </div>
  );
}
