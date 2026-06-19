import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const expectedOpenGraphImageDimensions = {
  width: 1200,
  height: 630
} as const;

function readPngDimensions(pngPath: string) {
  const pngHeaderBytes = readFileSync(pngPath);

  return {
    width: pngHeaderBytes.readUInt32BE(16),
    height: pngHeaderBytes.readUInt32BE(20)
  };
}

function expectOpenGraphImageAsset(svgPath: string, pngPath: string) {
  expect(existsSync(svgPath)).toBe(true);
  expect(existsSync(pngPath)).toBe(true);
  expect(statSync(pngPath).size).toBeGreaterThan(0);
  expect(readPngDimensions(pngPath)).toEqual(expectedOpenGraphImageDimensions);

  const svgMarkup = readFileSync(svgPath, "utf8");

  expect(svgMarkup).toContain('width="1200"');
  expect(svgMarkup).toContain('height="630"');
}

describe("Open Graph image assets", () => {
  it("provides English and Chinese 1200x630 social metadata images", () => {
    const publicDirectory = join(process.cwd(), "public");
    const englishSvgPath = join(publicDirectory, "og-image.svg");
    const englishPngPath = join(publicDirectory, "og-image.png");
    const chineseSvgPath = join(publicDirectory, "og-image-zh.svg");
    const chinesePngPath = join(publicDirectory, "og-image-zh.png");

    expectOpenGraphImageAsset(englishSvgPath, englishPngPath);
    expectOpenGraphImageAsset(chineseSvgPath, chinesePngPath);
  });
});
