import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fontLoaderMocks = vi.hoisted(() => ({
  ensureGoogleFontForStyle: vi.fn(() => Promise.resolve())
}));

const exportImageMocks = vi.hoisted(() => ({
  saveNodeAsPng: vi.fn(() => Promise.resolve())
}));

const googleAnalyticsEventMocks = vi.hoisted(() => ({
  sendGAEvent: vi.fn()
}));

vi.mock("@/lib/google-font-loader", () => fontLoaderMocks);
vi.mock("@/lib/export-image", () => exportImageMocks);
vi.mock("@next/third-parties/google", () => googleAnalyticsEventMocks);

import { CursiveGeneratorPage } from "./cursive-generator-page";
import { getDictionary } from "@/lib/i18n";
import { filterTextStyles } from "@/lib/text-styles";

function mockClipboardWriteText(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText }
  });
}

describe("CursiveGeneratorPage", () => {
  beforeEach(() => {
    fontLoaderMocks.ensureGoogleFontForStyle.mockReset();
    fontLoaderMocks.ensureGoogleFontForStyle.mockResolvedValue(undefined);
    exportImageMocks.saveNodeAsPng.mockReset();
    exportImageMocks.saveNodeAsPng.mockResolvedValue(undefined);
    googleAnalyticsEventMocks.sendGAEvent.mockReset();
  });

  it("shows clear feedback when clipboard copy fails", async () => {
    mockClipboardWriteText(vi.fn().mockRejectedValue(new Error("permission denied")));

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument();
    });
    expect(googleAnalyticsEventMocks.sendGAEvent).not.toHaveBeenCalled();
  });

  it("sends a GA4 event after a successful main copy", async () => {
    mockClipboardWriteText(vi.fn().mockResolvedValue(undefined));

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(googleAnalyticsEventMocks.sendGAEvent).toHaveBeenCalledWith(
        "event",
        "copy_cursive_text",
        {
          copy_position: 1,
          style_category: "unicode",
          style_name: "Unicode Script"
        }
      );
    });
  });

  it("sends a GA4 event after a successful copy without user text", async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    const privateInputText = "private@example.com";
    mockClipboardWriteText(clipboardWriteText);

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    fireEvent.change(screen.getByLabelText("Your text"), {
      target: { value: privateInputText }
    });
    fireEvent.click(screen.getByRole("button", { name: "Copy this style: Unicode Bold" }));

    await waitFor(() => {
      expect(googleAnalyticsEventMocks.sendGAEvent).toHaveBeenCalledWith(
        "event",
        "copy_cursive_text",
        {
          copy_position: 2,
          style_category: "unicode",
          style_name: "Unicode Bold"
        }
      );
    });

    const analyticsEventParameters = googleAnalyticsEventMocks.sendGAEvent.mock.calls[0]?.[2];
    expect(JSON.stringify(analyticsEventParameters)).not.toContain(privateInputText);
    expect(Object.keys(analyticsEventParameters)).not.toEqual(
      expect.arrayContaining(["text", "input_text", "user_text", "email"])
    );
  });

  it("keeps copied feedback when GA4 event reporting fails", async () => {
    const ga4EventError = new Error("GA down");
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    googleAnalyticsEventMocks.sendGAEvent.mockImplementation(() => {
      throw ga4EventError;
    });
    mockClipboardWriteText(vi.fn().mockResolvedValue(undefined));

    try {
      render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

      fireEvent.click(screen.getByRole("button", { name: "Copy" }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to send GA4 copy event.",
        ga4EventError
      );
    } finally {
      consoleWarnSpy.mockRestore();
    }
  });

  it("uses one full accessible name for each filter button", () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Instagram/TikTok/Youtube" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Google Docs (Default)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Google Docs (Installable)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MS Word" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Social Instagram/ })).not.toBeInTheDocument();
  });

  it("uses the selected style font family in the text input", () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Mistral" }));

    expect(screen.getByLabelText("Your text")).toHaveStyle({
      fontFamily: "Mistral, cursive"
    });
  });

  it("loads every Google font for visible style cards", async () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    const expectedGoogleFontIds = filterTextStyles("all")
      .filter((textStyle) => textStyle.kind === "google-font")
      .map((textStyle) => textStyle.id);
    const expectedNonGoogleFontIds = filterTextStyles("all")
      .filter((textStyle) => textStyle.kind !== "google-font")
      .map((textStyle) => textStyle.id);

    await waitFor(() => {
      expect(getLoadedStyleIds()).toEqual(expect.arrayContaining(expectedGoogleFontIds));
    });
    expect(getLoadedStyleIds()).not.toEqual(expect.arrayContaining(expectedNonGoogleFontIds));
  });

  it("loads Google fonts when filters make them visible", async () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Instagram/TikTok/Youtube" }));
    fontLoaderMocks.ensureGoogleFontForStyle.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Google Docs (Installable)" }));

    await waitFor(() => {
      expect(fontLoaderMocks.ensureGoogleFontForStyle).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "dancing-script",
          kind: "google-font"
        })
      );
    });
  });

  it("handles failed visible font preloads without an unhandled rejection", async () => {
    mockClipboardWriteText(vi.fn());
    const googleFontPreloadError = new Error("font failed");
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    fontLoaderMocks.ensureGoogleFontForStyle.mockRejectedValueOnce(googleFontPreloadError);

    try {
      render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          "Failed to preload Google font for visible style dancing-script (Dancing Script).",
          googleFontPreloadError
        );
      });
    } finally {
      consoleWarnSpy.mockRestore();
    }
  });

  it("loads a selected Google font and waits for it before saving PNG output", async () => {
    mockClipboardWriteText(vi.fn());
    let resolveFontLoad: () => void = () => {};
    const fontLoadPromise = new Promise<void>((resolve) => {
      resolveFontLoad = resolve;
    });
    fontLoaderMocks.ensureGoogleFontForStyle.mockReturnValue(fontLoadPromise);

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Dancing Script" }));

    await waitFor(() => {
      expect(fontLoaderMocks.ensureGoogleFontForStyle).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "dancing-script",
          kind: "google-font"
        })
      );
    });
    expect(screen.getByLabelText("Your text").style.fontFamily).toContain("Dancing Script");
    expect(screen.getByTestId("main-style-preview-output").style.fontFamily).toContain(
      "Dancing Script"
    );
    expect(screen.getByTestId("png-export-output").style.fontFamily).toContain(
      "Dancing Script"
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(exportImageMocks.saveNodeAsPng).not.toHaveBeenCalled();

    resolveFontLoad();

    await waitFor(() => {
      expect(exportImageMocks.saveNodeAsPng).toHaveBeenCalledWith(
        screen.getByTestId("png-export-output"),
        "cursive-generator-dancing-script.png"
      );
    });
  });

  it("uses a multiline text area with a non-blocking suggested character count", () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    const textInput = screen.getByLabelText("Your text");

    expect(textInput.tagName).toBe("TEXTAREA");
    expect(screen.getByText("11 / Suggested 60 characters or fewer")).toHaveClass("text-slate-500");

    fireEvent.change(textInput, {
      target: { value: "a".repeat(61) }
    });

    expect(textInput).toHaveValue("a".repeat(61));
    expect(screen.getByText("61 / Suggested 60 characters or fewer")).toHaveClass("text-amber-700");
  });

  it("uses localized Chinese suggested character count text", () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("zh")} locale="zh" />);

    expect(screen.getByText("11 / 建议 60 字以内")).toBeInTheDocument();
  });

  it("uses a transparent background checkbox to control preview and PNG backgrounds", async () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    const transparentBackgroundCheckbox = screen.getByRole("checkbox", {
      name: "Transparent background"
    });

    expect(transparentBackgroundCheckbox).not.toBeChecked();
    expect(screen.getByTestId("png-export-output").style.backgroundColor).toBe(
      "rgb(255, 255, 255)"
    );

    fireEvent.click(transparentBackgroundCheckbox);
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    expect(transparentBackgroundCheckbox).toBeChecked();
    await waitFor(() => {
      expect(screen.getByTestId("png-export-output").style.backgroundColor).toBe("transparent");
    });
    expect(screen.getByTestId("style-preview-output").style.backgroundColor).toBe("transparent");
  });

  it("keeps the PNG export node at a fixed width and wraps long text", () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    const exportOutput = screen.getByTestId("png-export-output");

    expect(exportOutput.style.boxSizing).toBe("border-box");
    expect(exportOutput.style.width).toBe("620px");
    expect(exportOutput.style.maxWidth).toBe("620px");
    expect(exportOutput.style.overflowWrap).toBe("anywhere");
    expect(exportOutput.style.wordBreak).toBe("break-word");
    expect(exportOutput.style.whiteSpace).toBe("pre-wrap");
  });

  it("forces long preview text to wrap inside the preview dialog", async () => {
    mockClipboardWriteText(vi.fn());

    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    const longInputText = "123456789012345678901234567890123456";
    fireEvent.change(screen.getByLabelText("Your text"), {
      target: { value: longInputText }
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    const dialog = await screen.findByRole("dialog");
    const previewOutput = within(dialog).getByTestId("style-preview-output");
    const previewText = within(previewOutput).getByText(longInputText);

    expect(previewText).toHaveClass("max-w-full");
    expect(previewText).toHaveClass("whitespace-pre-wrap");
    expect(previewText.className).toContain("[overflow-wrap:anywhere]");
    expect(previewText.className).toContain("[word-break:break-word]");
  });
});

function getLoadedStyleIds(): string[] {
  return fontLoaderMocks.ensureGoogleFontForStyle.mock.calls.map(([textStyle]) => textStyle.id);
}
