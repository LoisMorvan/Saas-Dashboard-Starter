import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <section className="mx-auto w-full max-w-5xl p-5">
      <h2 className="mb-4 text-xl font-medium">{t("nextsteps.title")}</h2>
    </section>
  );
}
