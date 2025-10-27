"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login", { locale });
  };

  return (
    <Button onClick={logout} loading={loading}>
      {t("logout", { default: "Logout" })}
    </Button>
  );
}
