import { describe, expect, test } from "vitest";

import { getDictionary } from "@/lib/i18n";
import type { CopyMode, PlatformRecommendation } from "@/lib/style-compatibility";

import { getCopyModeLabel, getPlatformLabel } from "./style-labels";

describe("style label helpers", () => {
  test.each<[CopyMode, string]>([
    ["copyable", "Copyable"],
    ["preview-only", "Preview only"]
  ])("returns English copy mode label for %s", (copyMode, expectedLabel) => {
    expect(getCopyModeLabel(copyMode, getDictionary("en"))).toBe(expectedLabel);
  });

  test.each<[PlatformRecommendation, string]>([
    ["social", "Best for Instagram/TikTok/Youtube"],
    ["google-docs", "Best for Google Docs"],
    ["google-docs-installable", "Installable Google font"],
    ["ms-word", "Best for MS Word"],
    ["general", "General preview style"]
  ])("returns English platform label for %s", (platformRecommendation, expectedLabel) => {
    expect(getPlatformLabel(platformRecommendation, getDictionary("en"))).toBe(expectedLabel);
  });
});
