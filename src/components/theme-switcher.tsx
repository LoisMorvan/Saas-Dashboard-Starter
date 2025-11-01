"use client";

import * as React from "react";
import { useEffect, useState, forwardRef } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function ThemeSwitcher({
  asSidebarItem = false,
  withTitle = false,
}: {
  asSidebarItem?: boolean;
  withTitle?: boolean;
}) {
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const ICON_SIZE = 16;
  const current = resolvedTheme ?? theme ?? "system";
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Laptop;

  const Trigger = asSidebarItem
    ? (props: React.ComponentProps<typeof SidebarMenuButton>) => (
        <SidebarMenuButton
          size="sm"
          className={
            "cursor-pointer justify-start group-data-[collapsible=icon]:justify-center"
          }
          {...props}
        />
      )
    : (props: React.ComponentProps<typeof Button>) => (
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("switch")}
          title={t("switch")}
          {...props}
        />
      );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Trigger>
          <Icon size={ICON_SIZE} />
          {withTitle ? (
            <span
              className={
                asSidebarItem ? "group-data-[collapsible=icon]:hidden" : ""
              }
            >
              {t("menuLabel", { default: "Thème" })}
            </span>
          ) : null}
        </Trigger>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="start" sideOffset={6}>
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(value) => setTheme(value)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} />
            <span>{t("light")}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} />
            <span>{t("dark")}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} />
            <span>{t("system")}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
