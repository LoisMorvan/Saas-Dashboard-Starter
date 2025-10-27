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
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { mapSupabaseErrorToKey } from "@/lib/auth-errors";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nextPath = searchParams.get("next") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push(nextPath, { locale });
    } catch (err: unknown) {
      const key = mapSupabaseErrorToKey(err);
      const msg =
        key === "invalidCredentials"
          ? t("errors.invalidCredentials")
          : key === "emailNotConfirmed"
          ? t("errors.emailNotConfirmed")
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
          <form onSubmit={handleLogin} noValidate>
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
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("password.label")}</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    locale={locale}
                  >
                    {t("forgot")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
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
              {t("noAccount")}{" "}
              <Link
                href={`/auth/sign-up?next=${encodeURIComponent(nextPath)}`}
                className="underline underline-offset-4"
                locale={locale}
              >
                {t("signup")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
