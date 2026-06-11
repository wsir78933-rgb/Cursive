import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GeneratorHeader } from "./generator-header";
import { getDictionary } from "@/lib/i18n";

describe("GeneratorHeader", () => {
  it("uses the shared favicon asset for the brand icon", () => {
    render(<GeneratorHeader dictionary={getDictionary("en")} locale="en" />);

    const brandIcon = screen.getByRole("img", { name: "Cursive Generator icon" });

    expect(brandIcon).toHaveAttribute("src", "/icon.svg");
    expect(brandIcon).toHaveClass("h-9");
    expect(brandIcon).toHaveClass("w-9");
  });
});
