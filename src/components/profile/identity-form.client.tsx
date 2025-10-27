"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useFlash } from "@/components/ui/flash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { updateProfileAction } from "@/app/[locale]/(site)/(app)/profile/actions";
import { cn } from "@/lib/utils";

export default function IdentityForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("profile.identity");
  const { push } = useFlash();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const res = await updateProfileAction(fd);
          if (res.ok) {
            push({ kind: "success", message: t("updated") });
          } else {
            setError(t("errors.generic"));
          }
        });
      }}
    >
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t("fullName")}</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={defaultName}
            placeholder={t("fullNamePh")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="you@example.com"
            required
            aria-invalid={!!error}
            className={cn(
              !!error && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <p className="text-[11px] text-muted-foreground">{t("note")}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={pending} type="submit">
          {t("save")}
        </Button>
      </CardFooter>
    </form>
  );
}
