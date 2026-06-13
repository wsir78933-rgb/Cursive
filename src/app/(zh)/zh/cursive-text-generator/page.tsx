import type { Metadata } from "next";

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/i18n";
import { canonicalUrls, hreflangAlternates, siteOrigin } from "@/lib/site-url";

const dictionary = getDictionary("zh");
const chineseTitle = dictionary.title;
const chineseDescription = "输入文本，选择花体样式，复制、预览或保存为 PNG。";
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Cursive Generator - Create Cursive Text Online for Free"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: chineseTitle,
  description: chineseDescription,
  alternates: {
    canonical: canonicalUrls.zh,
    languages: hreflangAlternates
  },
  openGraph: {
    title: chineseTitle,
    description: chineseDescription,
    url: canonicalUrls.zh,
    siteName: "Cursive Generator",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title: chineseTitle,
    description: chineseDescription,
    images: [ogImage.url]
  }
};

export default function ChineseCursiveTextGeneratorPage() {
  return (
    <>
      <StructuredData dictionary={dictionary} locale="zh" />
      <CursiveGeneratorPage dictionary={dictionary} locale="zh" />
    </>
  );
}
