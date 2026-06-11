import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { getDictionary } from "@/lib/i18n";
import { textStyles } from "@/lib/text-styles";

import { StylePreviewPanel } from "./style-preview-panel";

function findStyle(styleId: string) {
  const textStyle = textStyles.find((style) => style.id === styleId);

  if (!textStyle) {
    throw new Error(`Text style not found: ${styleId}`);
  }

  return textStyle;
}

describe("StylePreviewPanel", () => {
  test("renders selected style, preview text, and copyable hint", () => {
    render(
      <StylePreviewPanel
        copyLabel="Copy"
        dictionary={getDictionary("en")}
        fontSize={48}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSave={vi.fn()}
        previewText="𝒽𝑒𝓁𝓁𝑜"
        selectedStyle={findStyle("unicode-script")}
        textColor="#1c2430"
        transparentBackground={false}
      />
    );

    expect(screen.getByText("Selected style")).toBeInTheDocument();
    expect(screen.getByText("Unicode Script")).toBeInTheDocument();
    expect(screen.getByText("𝒽𝑒𝓁𝓁𝑜")).toBeInTheDocument();
    expect(screen.getByText("Copyable")).toBeInTheDocument();
    expect(
      screen.getByText("Copy this Unicode cursive text for social apps, bios, and messages.")
    ).toBeInTheDocument();
  });

  test("calls action handlers", () => {
    const handleCopy = vi.fn();
    const handleSave = vi.fn();
    const handlePreview = vi.fn();

    render(
      <StylePreviewPanel
        copyLabel="Copy"
        dictionary={getDictionary("en")}
        fontSize={48}
        onCopy={handleCopy}
        onPreview={handlePreview}
        onSave={handleSave}
        previewText="hello"
        selectedStyle={findStyle("dancing-script")}
        textColor="#1c2430"
        transparentBackground
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    expect(handleCopy).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handlePreview).toHaveBeenCalledTimes(1);
  });

  test("forces long preview text to wrap inside the preview card", () => {
    const longPreviewText = "dasdasdasdasdadasdasdasdasdasdasdas";

    render(
      <StylePreviewPanel
        copyLabel="Copy"
        dictionary={getDictionary("en")}
        fontSize={48}
        onCopy={vi.fn()}
        onPreview={vi.fn()}
        onSave={vi.fn()}
        previewText={longPreviewText}
        selectedStyle={findStyle("unicode-script")}
        textColor="#1c2430"
        transparentBackground={false}
      />
    );

    const previewText = screen.getByText(longPreviewText);

    expect(previewText).toHaveClass("max-w-full");
    expect(previewText).toHaveClass("whitespace-pre-wrap");
    expect(previewText.className).toContain("[overflow-wrap:anywhere]");
    expect(previewText.className).toContain("[word-break:break-word]");
  });
});
