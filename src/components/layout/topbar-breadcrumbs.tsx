"use client";

import { usePathname, Link } from "@/i18n/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname() || "";
  const ix = pathname.indexOf("/dashboard");
  const base = ix >= 0 ? pathname.slice(ix) : pathname;
  const parts = base.split("/").filter(Boolean);

  const crumbs = parts.length === 0 ? ["dashboard"] : parts;

  return (
    <nav className="text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
      {crumbs.map((p, i) => {
        const href = "/" + crumbs.slice(0, i + 1).join("/");
        const label = p.charAt(0).toUpperCase() + p.slice(1);
        const isLast = i === crumbs.length - 1;
        return (
          <span key={href}>
            {i > 0 && <span className="mx-2">/</span>}
            <Link
              href={href}
              className={
                isLast ? "font-medium text-foreground" : "hover:underline"
              }
            >
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
