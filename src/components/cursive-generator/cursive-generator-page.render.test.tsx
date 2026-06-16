import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fontGridProbe = vi.hoisted(() => ({
  render: vi.fn()
}));

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
vi.mock("./font-grid", async () => {
  const { memo } = await vi.importActual<typeof import("react")>("react");

  return {
    FontGrid: memo(function FontGridProbe(props: Record<string, unknown>) {
      fontGridProbe.render(props);

      return <section data-testid="font-grid-probe" />;
    })
  };
});

import { CursiveGeneratorPage } from "./cursive-generator-page";
import { getDictionary } from "@/lib/i18n";

describe("CursiveGeneratorPage render boundaries", () => {
  beforeEach(() => {
    fontGridProbe.render.mockClear();
    fontLoaderMocks.ensureGoogleFontForStyle.mockReset();
    fontLoaderMocks.ensureGoogleFontForStyle.mockResolvedValue(undefined);
    exportImageMocks.saveNodeAsPng.mockReset();
    exportImageMocks.saveNodeAsPng.mockResolvedValue(undefined);
    googleAnalyticsEventMocks.sendGAEvent.mockReset();
  });

  it("keeps the font grid out of preview-only settings updates", () => {
    render(<CursiveGeneratorPage dictionary={getDictionary("en")} locale="en" />);

    const initialFontGridRenderCount = fontGridProbe.render.mock.calls.length;

    fireEvent.click(screen.getByRole("checkbox", { name: "Transparent background" }));

    expect(fontGridProbe.render).toHaveBeenCalledTimes(initialFontGridRenderCount);
  });
});
