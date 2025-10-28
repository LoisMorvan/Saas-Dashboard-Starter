"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export default function Breadcrumbs({ className }: Props) {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const t = useTranslations("breadcrumbs");

  const all = pathname.split("/").filter(Boolean);
  const withoutLocale = all[0] === locale ? all.slice(1) : all;
  const segments = withoutLocale.filter(
    (s) => !(s.startsWith("(") && s.endsWith(")"))
  );

  const effective = segments.length === 0 ? ["dashboard"] : segments;

  const labelFor = (seg: string) => {
    const key = seg.toLowerCase();
    try {
      return t(key as string);
    } catch {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  const crumbs = effective.map((seg, i) => {
    const base = `/${locale}`;
    const path = "/" + effective.slice(0, i + 1).join("/");
    const href = base + path;
    return {
      href,
      label: labelFor(seg),
      last: i === effective.length - 1,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-sm text-muted-foreground overflow-x-auto whitespace-nowrap",
        className
      )}
    >
      {crumbs.map((c, i) => (
        <span key={c.href}>
          {i > 0 && <span className="mx-2">/</span>}
          <Link
            href={c.href}
            className={
              c.last ? "font-medium text-foreground" : "hover:underline"
            }
            aria-current={c.last ? "page" : undefined}
          >
            {c.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
