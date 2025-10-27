import { getTranslations } from "next-intl/server";
import BrandLogo from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth/auth-button";

export default async function SiteHeader() {
  const tApp = await getTranslations("app");
  return (
    <header className="w-full border-b border-b-foreground/10">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-3">
          <BrandLogo title={tApp("title")} />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
