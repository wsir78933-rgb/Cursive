import type { Metadata } from "next";

import { normalizeLocale, getDictionary } from "@/lib/i18n";
import { canonicalUrls, hreflangAlternates, siteOrigin } from "@/lib/site-url";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const dictionary = getDictionary(locale);

  const title =
    locale === "zh"
      ? dictionary.title
      : "Cursive Generator - Copy and Paste Cursive Text Fonts";
  const description =
    locale === "zh"
      ? "输入文本，选择花体样式，复制、预览或保存为 PNG。"
      : "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images.";
  const canonicalUrl = locale === "zh" ? canonicalUrls.zh : canonicalUrls.en;
  const ogImage = {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Cursive Generator - Copy and Paste Cursive Text Fonts"
  };

  return {
    metadataBase: new URL(siteOrigin),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Cursive Generator",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url]
    }
  };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
