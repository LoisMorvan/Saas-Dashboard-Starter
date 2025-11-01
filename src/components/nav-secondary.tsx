"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavSecondaryItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavSecondary({
  items = [],
  components = [],
  ...props
}: {
  items?: NavSecondaryItem[];
  components?: React.ReactNode[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={`i-${item.title}`}>
              <SidebarMenuButton asChild size="sm">
                <a
                  href={item.url}
                  className="justify-start group-data-[collapsible=icon]:justify-center"
                >
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {components.map((node, idx) => (
            <SidebarMenuItem key={`c-${idx}`}>{node}</SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
