import type { Metadata } from "next";

import { normalizeLocale, getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const dictionary = getDictionary(locale);

  return {
    title:
      locale === "zh"
        ? dictionary.title
        : "Cursive Generator - Copy and Paste Cursive Text Fonts",
    description:
      locale === "zh"
        ? "输入文本，选择花体样式，复制、预览或保存为 PNG。"
        : "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images."
  };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
