import { describe, expect, test } from "vitest";

import { getCopyMode, getPlatformRecommendation } from "./style-compatibility";
import { textStyles } from "./text-styles";

function findStyle(styleId: string) {
  const textStyle = textStyles.find((style) => style.id === styleId);

  if (!textStyle) {
    throw new Error(`Text style not found: ${styleId}`);
  }

  return textStyle;
}

describe("style compatibility", () => {
  test("marks Unicode styles as copyable", () => {
    expect(getCopyMode(findStyle("unicode-script"))).toBe("copyable");
  });

  test("marks font styles as preview-only", () => {
    expect(getCopyMode(findStyle("dancing-script"))).toBe("preview-only");
  });

  test("recommends social platforms for Unicode styles", () => {
    expect(getPlatformRecommendation(findStyle("unicode-script"))).toBe("social");
  });

  test("recommends Word for Word-filtered styles", () => {
    expect(getPlatformRecommendation(findStyle("brush-script-mt"))).toBe("ms-word");
  });
});
