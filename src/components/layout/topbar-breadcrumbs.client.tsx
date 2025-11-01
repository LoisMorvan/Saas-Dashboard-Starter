"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function capitalize(s: string) {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function TopbarBreadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumbs");

  const parts = React.useMemo(() => {
    const segs = (pathname || "/").split("/").filter(Boolean);
    if (segs[0] === locale) segs.shift();
    return segs;
  }, [pathname, locale]);

  const labelFor = React.useCallback(
    (seg: string) => {
      switch (seg) {
        case "dashboard":
          return t("dashboard");
        case "clients":
          return t("clients");
        case "profile":
          return t("profile");
        default:
          return capitalize(seg.replace(/[-_]+/g, " "));
      }
    },
    [t]
  );

  const hrefForIndex = (i: number) => {
    const base = `/${locale}`;
    const partial = parts.slice(0, i + 1).join("/");
    return `${base}/${partial}`;
  };

  if (parts.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parts.map((seg, i) => {
          const isLast = i === parts.length - 1;
          const href = hrefForIndex(i);
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem
                className={i === 0 ? "hidden md:block" : undefined}
              >
                {isLast ? (
                  <BreadcrumbPage>{labelFor(seg)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{labelFor(seg)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? (
                <BreadcrumbSeparator
                  className={i === 0 ? "hidden md:block" : undefined}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
