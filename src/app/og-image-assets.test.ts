import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Open Graph image assets", () => {
  it("provides a maintainable SVG source and PNG image for social metadata", () => {
    const publicDirectory = join(process.cwd(), "public");
    const svgPath = join(publicDirectory, "og-image.svg");
    const pngPath = join(publicDirectory, "og-image.png");

    expect(existsSync(svgPath)).toBe(true);
    expect(existsSync(pngPath)).toBe(true);
    expect(statSync(pngPath).size).toBeGreaterThan(0);
  });
});
