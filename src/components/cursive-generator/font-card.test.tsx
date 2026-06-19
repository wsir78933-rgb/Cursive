import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FontCard } from "./font-card";
import { getDictionary } from "@/lib/i18n";
import { textStyles } from "@/lib/text-styles";

function findTextStyleById(styleId: string) {
  const textStyle = textStyles.find((style) => style.id === styleId);

  if (!textStyle) {
    throw new Error(`Text style not found: ${styleId}`);
  }

  return textStyle;
}

describe("FontCard", () => {
  it("clips long preview samples inside the card", () => {
    const longPreviewText = "abcdefghijklmnopqrstuvwxyz";
    const unicodeScriptStyle = findTextStyleById("unicode-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText={longPreviewText}
        textStyle={unicodeScriptStyle}
      />
    );

    expect(screen.getByText(longPreviewText)).toHaveClass("overflow-hidden");
    expect(screen.getByText(longPreviewText)).not.toHaveClass("overflow-visible");
  });

  it("adds the animated border treatment to each font card", () => {
    const unicodeScriptStyle = findTextStyleById("unicode-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={unicodeScriptStyle}
      />
    );

    const fontCard = screen.getByRole("button", { name: "Unicode Script" }).closest("article");

    expect(fontCard).toHaveClass("font-card-animated-border");
  });

  it("renders the style name as visible card text", () => {
    const onSelect = vi.fn();
    const unicodeScriptStyle = findTextStyleById("unicode-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={onSelect}
        previewText="hello world"
        textStyle={unicodeScriptStyle}
      />
    );

    const selectButton = screen.getByRole("button", { name: "Unicode Script" });

    expect(selectButton).toBeInTheDocument();
    expect(screen.getByText("Unicode Script")).toBeVisible();
    expect(screen.queryByRole("button", { name: /Recommended platforms/ })).not.toBeInTheDocument();

    fireEvent.click(selectButton);

    expect(onSelect).toHaveBeenCalledWith(unicodeScriptStyle);
  });

  it("renders font family names as visible text for preview font cards", () => {
    const visibleFontStyles = [
      findTextStyleById("dancing-script"),
      findTextStyleById("pacifico"),
      findTextStyleById("brush-script-mt")
    ];

    for (const textStyle of visibleFontStyles) {
      const { unmount } = render(
        <FontCard
          dictionary={getDictionary("en")}
          isCopied={false}
          isSelected={false}
          onCopy={vi.fn()}
          onPreview={vi.fn()}
          onSelect={vi.fn()}
          previewText="hello world"
          textStyle={textStyle}
        />
      );

      expect(screen.getByText(textStyle.displayName)).toBeVisible();

      unmount();
    }
  });

  it("does not show extra copyable status inside copyable cards", () => {
    const unicodeScriptStyle = findTextStyleById("unicode-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={unicodeScriptStyle}
      />
    );

    expect(screen.queryByText("Copyable")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Copyable")).not.toBeInTheDocument();
  });

  it("does not show extra preview-only status inside preview-only cards", () => {
    const dancingScriptStyle = findTextStyleById("dancing-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={dancingScriptStyle}
      />
    );

    expect(screen.queryByText("Preview only")).not.toBeInTheDocument();
  });

  it("uses preview action for preview-only font cards", () => {
    const onPreview = vi.fn();
    const dancingScriptStyle = findTextStyleById("dancing-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={onPreview}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={dancingScriptStyle}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Preview: Dancing Script" }));

    expect(
      screen.queryByRole("button", { name: "Copy this style: Dancing Script" })
    ).not.toBeInTheDocument();
    expect(onPreview).toHaveBeenCalledWith(dancingScriptStyle);
  });

  it("shows recommended platform icons for unicode cards", () => {
    const unicodeScriptStyle = findTextStyleById("unicode-script");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={unicodeScriptStyle}
      />
    );

    expect(
      screen.getByRole("img", { name: "Recommended platforms: Instagram, TikTok, YouTube" })
    ).toHaveClass("text-ink");
    expect(screen.getByTestId("source-icon-instagram")).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-tiktok")).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-youtube")).toBeInTheDocument();
  });

  it("shows the recommended platform icon for Google cards", () => {
    const pacificoStyle = findTextStyleById("pacifico");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={pacificoStyle}
      />
    );

    expect(screen.getByRole("img", { name: "Recommended platforms: Google" })).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-google")).toBeInTheDocument();
  });

  it("shows the recommended platform icon for Word cards", () => {
    const brushScriptStyle = findTextStyleById("brush-script-mt");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={brushScriptStyle}
      />
    );

    expect(screen.getByRole("img", { name: "Recommended platforms: Word" })).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-word")).toBeInTheDocument();
  });

  it("uses only a selected border effect without turning the card surface green", () => {
    const pacificoStyle = findTextStyleById("pacifico");

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={true}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={pacificoStyle}
      />
    );

    const selectButton = screen.getByRole("button", { name: pacificoStyle.displayName });
    const selectedCard = selectButton.closest("article");
    const selectedSourceIcon = screen.getByRole("img", { name: "Recommended platforms: Google" });

    expect(selectedCard).toHaveClass("bg-white/90");
    expect(selectedCard).not.toHaveClass("bg-[#087565]");
    expect(selectedCard).toHaveClass("border-[#087565]");
    expect(selectedCard).toHaveClass("selected-font-card-border");
    expect(selectButton).toHaveAttribute("aria-pressed", "true");
    expect(selectedSourceIcon).toHaveClass("text-ink");
    expect(screen.getByText("hello world")).toHaveClass("text-ink");
    expect(screen.getByText(pacificoStyle.displayName)).toBeVisible();
  });
});
