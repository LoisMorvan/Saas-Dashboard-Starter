"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { mapSupabaseErrorToKey } from "@/lib/auth-errors";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth.update");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/auth/login?reset=success", { locale });
    } catch (err: unknown) {
      const key = mapSupabaseErrorToKey(err);
      const msg =
        key === "weakPassword"
          ? t("errors.weakPassword")
          : key === "sessionExpired"
          ? t("errors.sessionExpired")
          : key === "rateLimited"
          ? t("errors.rateLimited")
          : t("errors.unknown");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">{t("password.label")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("password.placeholder")}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                  className={cn(
                    !!error && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {t("error", { message: error })}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? t("cta.loading") : t("cta.submit")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
