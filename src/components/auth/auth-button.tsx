import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = await getTranslations("auth");
  const locale = await getLocale();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href="/auth/login"
        locale={locale}
        className={buttonVariants({ size: "sm", variant: "outline" })}
      >
        {t("signIn")}
      </Link>
      <Link
        href="/auth/sign-up"
        locale={locale}
        className={buttonVariants({ size: "sm", variant: "default" })}
      >
        {t("signUp")}
      </Link>
    </div>
  );
}
