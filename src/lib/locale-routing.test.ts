import { describe, expect, it } from "vitest";

import { getLocaleFromPathname, localeRequestHeaderName } from "./locale-routing";

describe("getLocaleFromPathname", () => {
  it("reads Chinese locale from localized routes", () => {
    expect(getLocaleFromPathname("/zh/cursive-text-generator")).toBe("zh");
  });

  it("falls back to English for root and unsupported route prefixes", () => {
    expect(getLocaleFromPathname("/")).toBe("en");
    expect(getLocaleFromPathname("/fr/cursive-text-generator")).toBe("en");
  });
});

describe("localeRequestHeaderName", () => {
  it("provides the request header shared by middleware and root layout", () => {
    expect(localeRequestHeaderName).toBe("x-cursive-generator-locale");
  });
});
