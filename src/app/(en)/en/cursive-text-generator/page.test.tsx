import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  permanentRedirect: vi.fn()
}));

import { permanentRedirect } from "next/navigation";
import EnglishCursiveTextGeneratorRedirectPage from "./page";

describe("EnglishCursiveTextGeneratorRedirectPage", () => {
  beforeEach(() => {
    vi.mocked(permanentRedirect).mockReset();
  });

  it("permanently redirects the legacy English generator route to the root path", () => {
    EnglishCursiveTextGeneratorRedirectPage();

    expect(permanentRedirect).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).toHaveBeenCalledWith("/");
  });
});
