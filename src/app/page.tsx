import type { Metadata } from "next";

import { CursiveGeneratorPage } from "@/components/cursive-generator/cursive-generator-page";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/i18n";
import { canonicalUrls, hreflangAlternates, siteOrigin } from "@/lib/site-url";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Cursive Generator - Copy and Paste Cursive Text Fonts",
  description:
    "Use this free cursive generator to create cursive text fonts you can copy and paste for social bios, messages, documents, signatures, and images.",
  alternates: {
    canonical: canonicalUrls.en,
    languages: hreflangAlternates
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
