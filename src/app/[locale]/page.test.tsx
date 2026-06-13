import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn(),
  redirect: vi.fn()
}));

import { permanentRedirect, redirect } from "next/navigation";
import LocaleHomePage from "./page";

describe("LocaleHomePage", () => {
  beforeEach(() => {
    vi.mocked(permanentRedirect).mockReset();
    vi.mocked(redirect).mockReset();
  });

  it("permanently redirects English locale home to root path", async () => {
    await LocaleHomePage({
      params: Promise.resolve({ locale: "en" })
    });

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).toHaveBeenCalledWith("/");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("permanently redirects Chinese locale home to the Chinese generator page", async () => {
    await LocaleHomePage({
      params: Promise.resolve({ locale: "zh" })
    });

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).toHaveBeenCalledWith("/zh/cursive-text-generator");
    expect(redirect).not.toHaveBeenCalled();
  });
});
