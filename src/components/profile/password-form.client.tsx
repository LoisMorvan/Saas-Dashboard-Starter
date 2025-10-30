"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { push } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { updatePasswordAction } from "@/app/[locale]/(site)/(app)/profile/actions";
import { cn } from "@/lib/utils";

export default function PasswordForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("profile.password");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        const formEl = e.currentTarget;
        const fd = new FormData(formEl);

        start(async () => {
          const res = await updatePasswordAction(fd);
          if (res.ok) {
            push({ kind: "success", message: t("updated") });
            formEl.reset();
          } else {
            if (res.code === "password_mismatch")
              setError(t("errors.passwordMismatch"));
            else if (res.code === "weak_password")
              setError(t("errors.weakPassword"));
            else setError(t("errors.generic"));
          }
        });
      }}
    >
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">{t("new")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={t("newPh")}
            required
            minLength={6}
            aria-invalid={!!error}
            className={cn(
              !!error && "border-red-500 focus-visible:ring-red-500"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password_confirm">{t("confirm")}</Label>
          <Input
            id="password_confirm"
            name="password_confirm"
            type="password"
            placeholder={t("confirmPh")}
            required
            minLength={6}
            aria-invalid={!!error}
            className={cn(
              !!error && "border-red-500 focus-visible:ring-red-500"
            )}
          />
        </div>

        {error && <p className="md:col-span-2 text-xs text-red-600">{error}</p>}

        <p className="md:col-span-2 text-[11px] text-muted-foreground">
          {t("note")}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={pending} type="submit">
          {t("update")}
        </Button>
      </CardFooter>
    </form>
  );
}
