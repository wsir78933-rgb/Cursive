import type { Metadata } from "next";

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/i18n";
import { canonicalUrls, hreflangAlternates, siteOrigin } from "@/lib/site-url";

const dictionary = getDictionary("en");

const englishTitle = "Cursive Generator - Create Cursive Text Online for Free";
const englishDescription =
  "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images.";
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: englishTitle
};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: englishTitle,
  description: englishDescription,
  alternates: {
    canonical: canonicalUrls.en,
    languages: hreflangAlternates
  },
  openGraph: {
    title: englishTitle,
    description: englishDescription,
    url: canonicalUrls.en,
    siteName: "Cursive Generator",
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    title: englishTitle,
    description: englishDescription,
    images: [ogImage.url]
  }
};

export default function HomePage() {
  return (
    <>
      <StructuredData dictionary={dictionary} locale="en" />
      <CursiveGeneratorPage dictionary={dictionary} locale="en" />
    </>
  );
}
