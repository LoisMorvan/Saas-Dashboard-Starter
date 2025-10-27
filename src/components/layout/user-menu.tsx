"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import type { UserMetadata } from "@/types/supabase";

export default function UserMenu() {
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("userMenu");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
      const meta = (user?.user_metadata ?? {}) as UserMetadata;
      const url = typeof meta.avatar_url === "string" ? meta.avatar_url : null;
      setAvatarUrl(url);
    });
  }, [supabase]);

  async function onLogout() {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/auth/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("open")}
          className="rounded-full p-0 h-9 w-9"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={userEmail ?? "User"}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound width={20} height={20} className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} disabled={loading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
