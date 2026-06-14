import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const { toPngMock } = vi.hoisted(() => ({
  toPngMock: vi.fn(() => Promise.resolve("data:image/png;base64,test"))
}));

vi.mock("html-to-image", () => ({
  toPng: toPngMock
}));

import { saveNodeAsPng } from "./export-image";

describe("saveNodeAsPng", () => {
  afterEach(() => {
    toPngMock.mockClear();
    vi.restoreAllMocks();
  });

  it("keeps html-to-image out of the module's static import graph", () => {
    const exportImageSource = readFileSync(
      join(process.cwd(), "src/lib/export-image.ts"),
      "utf8"
    );

    expect(exportImageSource).not.toContain('import { toPng } from "html-to-image"');
    expect(exportImageSource).toContain('import("html-to-image")');
  });

  it("renders the node to a PNG and clicks a download link", async () => {
    const node = document.createElement("div");
    const clickMock = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await saveNodeAsPng(node, "cursive.png");

    expect(toPngMock).toHaveBeenCalledWith(node, {
      cacheBust: true,
      pixelRatio: 2
    });
    expect(clickMock).toHaveBeenCalledOnce();
  });
});
