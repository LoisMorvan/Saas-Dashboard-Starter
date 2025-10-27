import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const locale = await getLocale();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user.email ? `Hey, ${user.email}!` : "Hey!"}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href="/auth/login" locale={locale}>
        <Button size="sm" variant="outline">
          Sign in
        </Button>
      </Link>
      <Link href="/auth/sign-up" locale={locale}>
        <Button size="sm" variant="default">
          Sign up
        </Button>
      </Link>
    </div>
  );
}
