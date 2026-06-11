import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn()
}));

import { redirect } from "next/navigation";
import LocaleHomePage from "./page";

describe("LocaleHomePage", () => {
  beforeEach(() => {
    vi.mocked(redirect).mockReset();
  });

  it("redirects English locale home to the English generator page", async () => {
    await LocaleHomePage({
      params: Promise.resolve({ locale: "en" })
    });

    expect(redirect).toHaveBeenCalledWith("/en/cursive-text-generator");
  });

  it("redirects Chinese locale home to the Chinese generator page", async () => {
    await LocaleHomePage({
      params: Promise.resolve({ locale: "zh" })
    });

    expect(redirect).toHaveBeenCalledWith("/zh/cursive-text-generator");
  });
});
