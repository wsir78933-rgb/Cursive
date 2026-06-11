import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FontCard } from "./font-card";
import { getDictionary } from "@/lib/i18n";
import { textStyles } from "@/lib/text-styles";

describe("FontCard", () => {
  it("clips long preview samples inside the card", () => {
    const longPreviewText = "abcdefghijklmnopqrstuvwxyz";

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText={longPreviewText}
        textStyle={textStyles[0]}
      />
    );

    expect(screen.getByText(longPreviewText)).toHaveClass("overflow-hidden");
    expect(screen.getByText(longPreviewText)).not.toHaveClass("overflow-visible");
  });

  it("uses concise accessible name for the main select button", () => {
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[0]}
      />
    );

    expect(screen.getByRole("button", { name: "Unicode Script" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Recommended platforms/ })).not.toBeInTheDocument();
  });

  it("does not show extra copyable status inside copyable cards", () => {
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[0]}
      />
    );

    expect(screen.queryByText("Copyable")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Copyable")).not.toBeInTheDocument();
  });

  it("does not show extra preview-only status inside preview-only cards", () => {
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[2]}
      />
    );

    expect(screen.queryByText("Preview only")).not.toBeInTheDocument();
  });

  it("uses preview action for preview-only font cards", () => {
    const onPreview = vi.fn();

    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={onPreview}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[2]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Preview: Dancing Script" }));

    expect(
      screen.queryByRole("button", { name: "Copy this style: Dancing Script" })
    ).not.toBeInTheDocument();
    expect(onPreview).toHaveBeenCalledWith(textStyles[2]);
  });

  it("shows recommended platform icons for unicode cards", () => {
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[0]}
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
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[6]}
      />
    );

    expect(screen.getByRole("img", { name: "Recommended platforms: Google" })).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-google")).toBeInTheDocument();
  });

  it("shows the recommended platform icon for Word cards", () => {
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={false}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[4]}
      />
    );

    expect(screen.getByRole("img", { name: "Recommended platforms: Word" })).toBeInTheDocument();
    expect(screen.getByTestId("source-icon-word")).toBeInTheDocument();
  });

  it("uses a darker selected surface with white selected content", () => {
    render(
      <FontCard
        dictionary={getDictionary("en")}
        isCopied={false}
        isSelected={true}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSelect={vi.fn()}
        previewText="hello world"
        textStyle={textStyles[6]}
      />
    );

    const selectButton = screen.getByRole("button", { name: textStyles[6].displayName });
    const selectedCard = selectButton.closest("article");
    const selectedSourceIcon = screen.getByRole("img", { name: "Recommended platforms: Google" });

    expect(selectedCard).toHaveClass("bg-[#087565]");
    expect(selectedCard).toHaveClass("border-[#087565]");
    expect(selectedSourceIcon).toHaveClass("text-white");
    expect(screen.getByText("hello world")).toHaveClass("text-white");
    expect(screen.getByText(textStyles[6].displayName)).toHaveClass("text-white");
  });
});
