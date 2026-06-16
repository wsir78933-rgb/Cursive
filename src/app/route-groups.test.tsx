import React from "react";
import { describe, expect, it } from "vitest";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import EnglishRootLayout from "./(en)/layout";
import ChineseRootLayout from "./(zh)/layout";

describe("route group root layouts", () => {
  it("renders the English route tree with an English html shell", () => {
    const layoutElement = EnglishRootLayout({
      children: <main />
    });

    expect(layoutElement.props.lang).toBe("en");
    expect(layoutElement.props.suppressHydrationWarning).toBe(true);
  });

  it("renders the Chinese route tree with a Chinese html shell", () => {
    const layoutElement = ChineseRootLayout({
      children: <main />
    });

    expect(layoutElement.props.lang).toBe("zh");
    expect(layoutElement.props.suppressHydrationWarning).toBe(true);
  });

  it("loads analytics scripts in both root layouts", () => {
    const englishLayoutElement = EnglishRootLayout({ children: <main /> });
    const chineseLayoutElement = ChineseRootLayout({ children: <main /> });

    expect(getBodyChildTypes(englishLayoutElement)).toContain(GoogleAnalytics);
    expect(getBodyChildTypes(chineseLayoutElement)).toContain(GoogleAnalytics);
    expect(getBodyChildTypes(englishLayoutElement)).toContain(MicrosoftClarity);
    expect(getBodyChildTypes(chineseLayoutElement)).toContain(MicrosoftClarity);
  });
});

function getBodyChildTypes(layoutElement: React.ReactElement) {
  const bodyElement = React.Children.toArray(layoutElement.props.children)[0] as React.ReactElement;

  return React.Children.toArray(bodyElement.props.children).map(
    (child) => (child as React.ReactElement).type
  );
}
