import type { Locale } from "@/lib/i18n";
import { canonicalUrls } from "@/lib/site-url";

type StructuredDataDictionary = {
  brand: string;
  hero: {
    description: string;
  };
  faq: {
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
};

type StructuredDataProps = {
  dictionary: StructuredDataDictionary;
  locale: Locale;
};

export function StructuredData({ dictionary, locale }: StructuredDataProps) {
  const canonicalUrl = canonicalUrls[locale];
  const jsonLdItems = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: dictionary.brand,
      url: canonicalUrl,
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      inLanguage: locale,
      description: dictionary.hero.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: canonicalUrl,
      inLanguage: locale,
      mainEntity: dictionary.faq.items.map((faqItem) => ({
        "@type": "Question",
        name: faqItem.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqItem.answer
        }
      }))
    }
  ];

  return <script type="application/ld+json">{JSON.stringify(jsonLdItems)}</script>;
}
