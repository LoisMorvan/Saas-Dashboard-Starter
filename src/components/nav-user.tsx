"use client";

import * as React from "react";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type UserMeta = {
  avatar_url?: string | null;
  full_name?: string | null;
};

function initialsFrom(name?: string | null, email?: string | null) {
  const src = name?.trim() || email?.trim() || "";
  if (!src) return "U";
  const parts = src.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("userMenu");

  const [email, setEmail] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      setEmail(user?.email ?? null);
      const meta = (user?.user_metadata ?? {}) as UserMeta;
      setName(typeof meta.full_name === "string" ? meta.full_name : null);
      setAvatarUrl(
        typeof meta.avatar_url === "string" ? meta.avatar_url : null
      );
    });
    return () => {
      mounted = false;
    };
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

  const displayName = name || email || "User";
  const fallback = initialsFrom(name, email);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {fallback}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {name ?? email ?? "—"}
                </span>
                {name ? (
                  <span className="truncate text-xs">{email}</span>
                ) : null}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {fallback}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {name ?? email ?? "—"}
                  </span>
                  {name ? (
                    <span className="truncate text-xs">{email}</span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <Settings />
              {t("profile")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onLogout} disabled={loading}>
              <LogOut />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
