import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { localeRequestHeaderName } from "@/lib/locale-routing";
import RootLayout from "./layout";

vi.mock("next/headers", () => ({
  headers: vi.fn()
}));

import { headers } from "next/headers";

describe("RootLayout", () => {
  beforeEach(() => {
    vi.mocked(headers).mockReset();
  });

  it("uses the Chinese html lang for Chinese routes", async () => {
    vi.mocked(headers).mockResolvedValue(
      new Headers([[localeRequestHeaderName, "zh"]]) as Awaited<ReturnType<typeof headers>>
    );

    const layoutElement = await RootLayout({
      children: <main />
    });

    expect(layoutElement.props.lang).toBe("zh");
  });

  it("falls back to English html lang when no route locale exists", async () => {
    vi.mocked(headers).mockResolvedValue(new Headers() as Awaited<ReturnType<typeof headers>>);

    const layoutElement = await RootLayout({
      children: <main />
    });

    expect(layoutElement.props.lang).toBe("en");
  });
});
