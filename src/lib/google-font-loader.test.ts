import { describe, expect, it } from "vitest";

import { ensureGoogleFontForStyle } from "./google-font-loader";
import { textStyles, type TextStyle } from "./text-styles";

function findStyle(styleId: string): TextStyle {
  const textStyle = textStyles.find((style) => style.id === styleId);

  if (!textStyle) {
    throw new Error(`Text style not found: ${styleId}`);
  }

  return textStyle;
}

function getStylesheetLinks(): HTMLLinkElement[] {
  return Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[data-google-font-style-id]')
  );
}

describe("ensureGoogleFontForStyle", () => {
  it("does not inject a stylesheet for non-Google font styles", async () => {
    await ensureGoogleFontForStyle(findStyle("unicode-script"));
    await ensureGoogleFontForStyle(findStyle("mistral"));

    expect(getStylesheetLinks()).toHaveLength(0);
  });

  it("injects one stylesheet URL for the requested Google font style", async () => {
    const loadPromise = ensureGoogleFontForStyle(findStyle("dancing-script"));
    const [stylesheetLink] = getStylesheetLinks();

    expect(stylesheetLink.dataset.googleFontStyleId).toBe("dancing-script");
    expect(stylesheetLink.rel).toBe("stylesheet");
    expect(stylesheetLink.href).toBe(
      "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
    );

    stylesheetLink.dispatchEvent(new Event("load"));

    await expect(loadPromise).resolves.toBeUndefined();
  });

  it("deduplicates repeated requests for the same Google font style", async () => {
    const dancingScript = findStyle("dancing-script");
    const firstLoadPromise = ensureGoogleFontForStyle(dancingScript);
    const secondLoadPromise = ensureGoogleFontForStyle(dancingScript);

    expect(getStylesheetLinks()).toHaveLength(1);

    getStylesheetLinks()[0].dispatchEvent(new Event("load"));

    await expect(Promise.all([firstLoadPromise, secondLoadPromise])).resolves.toEqual([
      undefined,
      undefined
    ]);
  });

  it("rejects with the style name when the stylesheet cannot load", async () => {
    const loadPromise = ensureGoogleFontForStyle(findStyle("pacifico"));
    const stylesheetLink = document.head.querySelector<HTMLLinkElement>(
      'link[data-google-font-style-id="pacifico"]'
    );

    if (!stylesheetLink) {
      throw new Error("Pacifico stylesheet link was not created");
    }

    stylesheetLink.dispatchEvent(new Event("error"));

    await expect(loadPromise).rejects.toThrow(
      "Failed to load Google font stylesheet for Pacifico"
    );
  });
});
