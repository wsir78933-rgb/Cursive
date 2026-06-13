import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots", () => {
  it("returns public robots metadata with sitemap url", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://cursivegenerator.pro/sitemap.xml"
    });
  });
});
