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
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { mapSupabaseErrorToKey } from "@/lib/auth-errors";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations("auth.forgot");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const origin = window.location.origin;
      const prefix = locale === "fr" ? "" : `/${locale}`;
      const redirectTo = `${origin}${prefix}/auth/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      const key = mapSupabaseErrorToKey(err);
      const msg =
        key === "invalidEmail"
          ? t("errors.invalidEmail")
          : key === "userNotFound"
          ? t("errors.userNotFound")
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
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("sent.title")}</CardTitle>
            <CardDescription>{t("sent.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("sent.body")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} noValidate>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("email.label")}</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
              <div className="mt-4 text-center text-sm">
                {t("hasAccount")}{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                  locale={locale}
                >
                  {t("login")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
