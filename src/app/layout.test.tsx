import React from "react";
import { describe, expect, it } from "vitest";

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders a static English html shell without reading request headers", () => {
    const layoutElement = RootLayout({
      children: <main />
    });

    expect(layoutElement.props.lang).toBe("en");
    expect(layoutElement.props.suppressHydrationWarning).toBe(true);
  });
});
