"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard } from "lucide-react";

function NavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/60"
      )}
    >
      {children}
    </Link>
  );
}

export default function ClientSideNav({ version }: { version: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href) ?? false;

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col p-3">
      <div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
        Navigation
      </div>
      <div className="space-y-1">
        <NavLink href="/dashboard" isActive={isActive("/dashboard")}>
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          href="/dashboard/clients"
          isActive={isActive("/dashboard/clients")}
        >
          <Users className="h-4 w-4" />
          <span>Clients</span>
        </NavLink>
      </div>

      <div className="mt-auto pt-3 text-xs text-muted-foreground">
        <div className="rounded-md border px-3 py-2">v{version}</div>
      </div>
    </div>
  );
}
