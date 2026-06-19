import type { Locale } from "@/lib/i18n";
import { canonicalUrls, siteOrigin } from "@/lib/site-url";

type StructuredDataDictionary = {
  brand: string;
  hero: {
    description: string;
  };
};

type StructuredDataProps = {
  dictionary: StructuredDataDictionary;
  locale: Locale;
};

export function StructuredData({ dictionary, locale }: StructuredDataProps) {
  const canonicalUrl = canonicalUrls[locale];
  const organizationLogoUrl = `${siteOrigin}/icon.svg`;
  const organizationImageUrl = `${siteOrigin}/og-image.png`;
  const jsonLdItems = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dictionary.brand,
      url: canonicalUrl,
      inLanguage: locale,
      description: dictionary.hero.description
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Cursive Generator",
      url: siteOrigin,
      logo: organizationLogoUrl,
      image: organizationImageUrl
    }
  ];

  return <script type="application/ld+json">{JSON.stringify(jsonLdItems)}</script>;
}
