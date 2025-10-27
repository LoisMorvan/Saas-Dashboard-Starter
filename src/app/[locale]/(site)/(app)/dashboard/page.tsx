import { getTranslations } from "next-intl/server";

export default async function DashboardHomePage() {
  const t = await getTranslations("dashboard");
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t("welcome")}</h2>
      <p className="text-sm text-muted-foreground">{t("intro")}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">{t("cards.clients.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("cards.clients.desc")}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">{t("cards.quickstart.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("cards.quickstart.desc")}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">{t("cards.theme.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("cards.theme.desc")}
          </p>
        </div>
      </div>
    </section>
  );
}
