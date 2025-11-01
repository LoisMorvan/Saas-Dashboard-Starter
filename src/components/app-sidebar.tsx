"use client";

import * as React from "react";
import { LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useTranslations } from "next-intl";
import { NavSecondary } from "@/components/nav-secondary";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  const items = React.useMemo(
    () => [
      {
        title: t("dashboard"),
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive:
          !!pathname?.startsWith("/dashboard") &&
          !pathname?.startsWith("/dashboard/clients"),
        items: [{ title: t("overview"), url: "/dashboard" }],
      },
      {
        title: t("clients"),
        url: "/dashboard/clients",
        icon: Users,
        isActive: !!pathname?.startsWith("/dashboard/clients"),
        items: [{ title: t("allClients"), url: "/dashboard/clients" }],
      },
    ],
    [pathname, t]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            { name: "Acme Inc", logo: LayoutDashboard, plan: "Enterprise" },
            { name: "Acme Corp.", logo: Users, plan: "Startup" },
          ]}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} />
        <NavSecondary
          className="mt-auto"
          items={[]}
          components={[
            <ThemeSwitcher key="theme" asSidebarItem withTitle />,
            <LanguageSwitcher key="lang" asSidebarItem withTitle />,
          ]}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
