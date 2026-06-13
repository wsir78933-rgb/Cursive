import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn()
}));

import { permanentRedirect } from "next/navigation";
import EnglishHomeRedirectPage from "./page";

describe("EnglishHomeRedirectPage", () => {
  beforeEach(() => {
    vi.mocked(permanentRedirect).mockReset();
  });

  it("permanently redirects the English locale home to the root path", () => {
    EnglishHomeRedirectPage();

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).toHaveBeenCalledWith("/");
  });
});
