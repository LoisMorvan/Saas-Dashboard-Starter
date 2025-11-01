"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ClientsEmpty() {
  const t = useTranslations("clients.empty");
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("desc")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Button data-action="open-create-client">{t("cta")}</Button>
      </CardContent>
    </Card>
  );
}
