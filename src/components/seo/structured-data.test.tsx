import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { StructuredData } from "./structured-data";

type JsonLdItem = {
  "@type": string;
  image?: string;
  inLanguage?: string;
  logo?: string;
  name?: string;
  url?: string;
};

function renderStructuredData(locale: "en" | "zh") {
  const { container } = render(<StructuredData dictionary={getDictionary(locale)} locale={locale} />);
  const scriptElement = container.querySelector('script[type="application/ld+json"]');

  if (!scriptElement?.textContent) {
    throw new Error(`Expected JSON-LD script for locale ${locale}`);
  }

  return JSON.parse(scriptElement.textContent) as JsonLdItem[];
}

describe("StructuredData", () => {
  it("outputs English WebSite and Organization JSON-LD without FAQPage or WebApplication", () => {
    const structuredData = renderStructuredData("en");
    const schemaTypes = structuredData.map((structuredDataItem) => structuredDataItem["@type"]);
    const websiteSchema = structuredData.find(
      (structuredDataItem) => structuredDataItem["@type"] === "WebSite"
    );
    const organizationSchema = structuredData.find(
      (structuredDataItem) => structuredDataItem["@type"] === "Organization"
    );

    expect(schemaTypes).toEqual(["WebSite", "Organization"]);
    expect(schemaTypes).not.toContain("FAQPage");
    expect(schemaTypes).not.toContain("WebApplication");

    expect(websiteSchema).toMatchObject({
      "@type": "WebSite",
      inLanguage: "en",
      name: "Cursive Generator",
      url: "https://cursivegenerator.pro"
    });

    expect(organizationSchema).toMatchObject({
      "@type": "Organization",
      image: "https://cursivegenerator.pro/og-image.png",
      logo: "https://cursivegenerator.pro/icon.svg",
      name: "Cursive Generator",
      url: "https://cursivegenerator.pro"
    });
  });

  it("uses the Chinese canonical URL and language on the WebSite schema", () => {
    const structuredData = renderStructuredData("zh");
    const websiteSchema = structuredData.find(
      (structuredDataItem) => structuredDataItem["@type"] === "WebSite"
    );
    const organizationSchema = structuredData.find(
      (structuredDataItem) => structuredDataItem["@type"] === "Organization"
    );

    expect(websiteSchema).toMatchObject({
      "@type": "WebSite",
      inLanguage: "zh",
      name: "花体生成器",
      url: "https://cursivegenerator.pro/zh/cursive-text-generator"
    });
    expect(organizationSchema?.url).toBe("https://cursivegenerator.pro");
  });
});
