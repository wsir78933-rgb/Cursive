import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn()
}));

import { permanentRedirect } from "next/navigation";
import ChineseHomeRedirectPage from "./page";

describe("ChineseHomeRedirectPage", () => {
  beforeEach(() => {
    vi.mocked(permanentRedirect).mockReset();
  });

  it("permanently redirects the Chinese locale home to the Chinese generator page", () => {
    ChineseHomeRedirectPage();

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).toHaveBeenCalledWith("/zh/cursive-text-generator");
  });
});
