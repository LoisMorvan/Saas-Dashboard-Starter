import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import BrandLogo from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12">
      <section className="text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <BrandLogo />
          <Badge variant="outline">{t("badge")}</Badge>
        </div>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            <Link href="/auth/sign-up">{t("ctaPrimary")}</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/auth/login">{t("ctaSecondary")}</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{t("disclaimer")}</p>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">{t("f1.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("f1.desc")}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">{t("f2.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("f2.desc")}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">{t("f3.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("f3.desc")}</p>
        </div>
      </section>

      <section className="mt-16 rounded-lg border p-6 text-center">
        <h4 className="text-xl font-semibold">{t("bottom.title")}</h4>
        <p className="mt-2 text-sm text-muted-foreground">{t("bottom.desc")}</p>
        <div className="mt-6">
          <Button size="lg">
            <Link href="/auth/sign-up">{t("bottom.cta")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
