import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import Topbar from "@/components/layout/topbar";
import Sidebar from "@/components/layout/sidebar";
import Breadcrumbs from "@/components/layout/topbar-breadcrumbs";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();
  if (!user) redirect({ href: "/auth/login", locale });

  return (
    <div className="grid grid-rows-[56px_auto_1fr] md:grid-rows-[56px_1fr] md:grid-cols-[240px_1fr]">
      <div className="md:col-span-2">
        <Topbar />
      </div>

      <div className="md:hidden border-b px-4 py-2">
        <Breadcrumbs />
      </div>

      <aside className="hidden md:block border-r bg-background">
        <Sidebar />
      </aside>

      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
