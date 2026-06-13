import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { textStyles } from "@/lib/text-styles";

import { FontGrid } from "./font-grid";

describe("FontGrid", () => {
  it("uses five columns on extra-wide desktop screens", () => {
    render(
      <FontGrid
        copiedStyleId={null}
        dictionary={getDictionary("en")}
        onCopyStyle={vi.fn()}
        onPreviewStyle={vi.fn()}
        onSelectStyle={vi.fn()}
        previewTextByStyleId={() => "hello world"}
        selectedStyle={textStyles[0]}
        styles={textStyles.slice(0, 5)}
      />
    );

    const firstCardButton = screen.getByRole("button", { name: textStyles[0].displayName });
    const fontGrid = firstCardButton.closest("section");

    expect(fontGrid).toHaveClass("xl:grid-cols-5");
    expect(fontGrid).not.toHaveClass("xl:grid-cols-4");
  });
});
