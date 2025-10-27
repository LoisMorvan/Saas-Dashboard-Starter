import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function SiteFooter({
  withSwitchers = false,
}: {
  withSwitchers?: boolean;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 text-xs text-muted-foreground">
        <p>© {year}</p>
        {withSwitchers && (
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </footer>
  );
}
