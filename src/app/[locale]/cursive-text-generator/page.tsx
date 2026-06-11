import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

export default async function CursiveTextGeneratorRoute({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const dictionary = getDictionary(locale);

  return <CursiveGeneratorPage dictionary={dictionary} locale={locale} />;
}
