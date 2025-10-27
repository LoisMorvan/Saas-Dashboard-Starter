import BrandLogo from "@/components/brand-logo";
import Breadcrumbs from "@/components/layout/topbar-breadcrumbs";
import UserMenu from "@/components/layout/user-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import MobileSidebar from "@/components/layout/mobile-sidebar";

export default function Topbar() {
  return (
    <header className="flex h-14 items-center border-b px-4">
      <div className="flex items-center gap-3 flex-1">
        <MobileSidebar />
        <BrandLogo href="/dashboard" />
        <div className="hidden md:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
