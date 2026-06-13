import { describe, expect, it } from "vitest";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("returns exactly the public sitemap urls", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://cursivegenerator.pro",
      "https://cursivegenerator.pro/zh/cursive-text-generator"
    ]);
    expect(urls).not.toContain("https://cursivegenerator.pro/en/cursive-text-generator");
  });

  it("sets weekly change metadata for every sitemap entry", () => {
    const entries = sitemap();

    for (const entry of entries) {
      expect(entry.changeFrequency).toBe("weekly");
      expect(entry.priority).toBe(1);
      expect(entry.lastModified).toEqual(new Date("2026-06-11T00:00:00.000Z"));
    }
  });
});
