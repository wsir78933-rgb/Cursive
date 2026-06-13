import { permanentRedirect } from "next/navigation";

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

export default async function CursiveTextGeneratorRoute({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  if (locale === "en") {
    permanentRedirect("/");
  }

  const dictionary = getDictionary(locale);

  return (
    <>
      <StructuredData dictionary={dictionary} locale={locale} />
      <CursiveGeneratorPage dictionary={dictionary} locale={locale} />
    </>
  );
}
