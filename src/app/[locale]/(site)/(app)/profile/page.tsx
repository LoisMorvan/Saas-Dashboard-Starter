import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { UserMetadata } from "@/types/supabase";
import IdentityForm from "@/components/profile/identity-form.client";
import AvatarForm from "@/components/profile/avatar-form.client";
import PasswordForm from "@/components/profile/password-form.client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("profile");

  if (!user) return null;

  const meta = (user.user_metadata ?? {}) as UserMetadata;
  const fullName = meta.full_name || "";
  const avatarUrl = meta.avatar_url || "";

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("identity.title")}</CardTitle>
            <CardDescription>{t("identity.desc")}</CardDescription>
          </CardHeader>
          <IdentityForm
            defaultName={fullName}
            defaultEmail={user.email ?? ""}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("avatar.title")}</CardTitle>
            <CardDescription>{t("avatar.desc")}</CardDescription>
          </CardHeader>
          <AvatarForm avatarUrl={avatarUrl} />
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("password.title")}</CardTitle>
            <CardDescription>{t("password.desc")}</CardDescription>
          </CardHeader>
          <PasswordForm />
        </Card>
      </div>
    </section>
  );
}
