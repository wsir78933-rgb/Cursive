import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("global card border styles", () => {
  it("uses an opaque inner mask so animated borders do not show inside cards", () => {
    expect(globalsCss).toContain(".font-card-animated-border::after");
    expect(globalsCss).toContain("background: #ffffff;");
    expect(globalsCss).not.toContain("background: inherit;");
  });
});
