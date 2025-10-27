"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

function withSearch(pathname: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function LanguageSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  const hrefBase = withSearch(pathname, searchParams);

  function go(to: "fr" | "en") {
    router.push(hrefBase, { locale: to });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("switch")}
          title={t("switch")}
        >
          <Globe className="size-4 text-muted-foreground" />
          <span className="sr-only">{t("switch")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="start">
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
