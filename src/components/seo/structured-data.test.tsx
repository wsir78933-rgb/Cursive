import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { StructuredData } from "./structured-data";

function renderStructuredData(locale: "en" | "zh") {
  const { container } = render(<StructuredData dictionary={getDictionary(locale)} locale={locale} />);
  const scriptElement = container.querySelector('script[type="application/ld+json"]');

  if (!scriptElement?.textContent) {
    throw new Error(`Expected JSON-LD script for locale ${locale}`);
  }

  return JSON.parse(scriptElement.textContent) as Array<{
    url: string;
    mainEntity?: Array<{
      name: string;
    }>;
  }>;
}

describe("StructuredData", () => {
  it("uses the English canonical URL and FAQ question", () => {
    const structuredData = renderStructuredData("en");

    expect(structuredData[0].url).toBe("https://cursivegenerator.pro/");
    expect(structuredData[1].url).toBe("https://cursivegenerator.pro/");
    expect(structuredData[1].mainEntity?.[0].name).toBe(
      "Which cursive text styles can I copy and paste?"
    );
  });

  it("uses the Chinese canonical URL and FAQ question", () => {
    const structuredData = renderStructuredData("zh");

    expect(structuredData[0].url).toBe("https://cursivegenerator.pro/zh/cursive-text-generator");
    expect(structuredData[1].url).toBe("https://cursivegenerator.pro/zh/cursive-text-generator");
    expect(structuredData[1].mainEntity?.[0].name).toBe("哪些样式复制后还是花体？");
  });
});
