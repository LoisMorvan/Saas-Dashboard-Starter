"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

function withSearch(pathname: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function LanguageSwitcher({
  asSidebarItem = false,
  withTitle = false,
}: {
  asSidebarItem?: boolean;
  withTitle?: boolean;
}) {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  const hrefBase = withSearch(pathname, searchParams);
  function go(to: "fr" | "en") {
    router.push(hrefBase, { locale: to });
  }

  const Trigger = asSidebarItem
    ? (props: React.ComponentProps<typeof SidebarMenuButton>) => (
        <SidebarMenuButton
          size="sm"
          className="cursor-pointer justify-start group-data-[collapsible=icon]:justify-center"
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
          <Globe className="size-4" />
          {withTitle ? (
            <span
              className={
                asSidebarItem ? "group-data-[collapsible=icon]:hidden" : ""
              }
            >
              {t("menuLabel", { default: "Langue" })}
            </span>
          ) : null}
        </Trigger>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="start" sideOffset={6}>
        <DropdownMenuRadioGroup value={locale}>
          <DropdownMenuRadioItem
            value="fr"
            onSelect={(e) => {
              e.preventDefault();
              go("fr");
            }}
            className="flex gap-2"
          >
            <span aria-hidden>🇫🇷</span>
            <span>{t("french")}</span>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem
            value="en"
            onSelect={(e) => {
              e.preventDefault();
              go("en");
            }}
            className="flex gap-2"
          >
            <span aria-hidden>🇬🇧</span>
            <span>{t("english")}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
