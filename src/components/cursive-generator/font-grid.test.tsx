import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { textStyles } from "@/lib/text-styles";

import { FontGrid } from "./font-grid";

describe("FontGrid", () => {
  it("adds the border treatment to every rendered font card and activates the selected card", () => {
    const visibleStyles = textStyles.slice(0, 3);

    render(
      <FontGrid
        copiedStyleId={null}
        dictionary={getDictionary("en")}
        onCopyStyle={vi.fn()}
        onPreviewStyle={vi.fn()}
        onSelectStyle={vi.fn()}
        previewTextByStyleId={() => "hello world"}
        selectedStyle={visibleStyles[1]}
        styles={visibleStyles}
      />
    );

    const fontCards = visibleStyles.map((textStyle) =>
      screen.getByRole("button", { name: textStyle.displayName }).closest("article")
    );

    for (const fontCard of fontCards) {
      expect(fontCard).toHaveClass("font-card-animated-border");
    }

    expect(fontCards[0]).not.toHaveClass("selected-font-card-border");
    expect(fontCards[1]).toHaveClass("selected-font-card-border");
    expect(fontCards[2]).not.toHaveClass("selected-font-card-border");
  });

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

  it("labels the font style grid section", () => {
    render(
      <FontGrid
        copiedStyleId={null}
        dictionary={getDictionary("en")}
        onCopyStyle={vi.fn()}
        onPreviewStyle={vi.fn()}
        onSelectStyle={vi.fn()}
        previewTextByStyleId={() => "hello world"}
        selectedStyle={textStyles[0]}
        styles={textStyles.slice(0, 3)}
      />
    );

    expect(screen.getByRole("region", { name: "Cursive font styles" })).toHaveClass(
      "grid"
    );
  });
});
