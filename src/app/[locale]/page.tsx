import { redirect } from "next/navigation";

import { normalizeLocale } from "@/lib/i18n";

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  redirect(`/${locale}/cursive-text-generator`);
}
