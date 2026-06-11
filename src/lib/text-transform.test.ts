import { describe, expect, it } from "vitest";

import { getCopyText, transformUnicodeText } from "./text-transform";
import { textStyles } from "./text-styles";

describe("transformUnicodeText", () => {
  it("converts lowercase and uppercase letters while preserving spaces", () => {
    const unicodeScript = textStyles.find((style) => style.id === "unicode-script");

    expect(unicodeScript).toBeDefined();
    expect(transformUnicodeText("Hello world", unicodeScript!)).toBe(
      "ℋ𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹"
    );
  });

  it("preserves numbers, punctuation, emoji, and unmapped non-Latin text", () => {
    const unicodeScript = textStyles.find((style) => style.id === "unicode-script");

    expect(unicodeScript).toBeDefined();
    expect(transformUnicodeText("Hi 2026! 你好 ✨", unicodeScript!)).toBe(
      "ℋ𝒾 2026! 你好 ✨"
    );
  });
});

describe("getCopyText", () => {
  it("copies transformed Unicode text for Unicode styles", () => {
    const unicodeBold = textStyles.find((style) => style.id === "unicode-bold");

    expect(unicodeBold).toBeDefined();
    expect(getCopyText("hello world", unicodeBold!)).toBe("𝓱𝓮𝓵𝓵𝓸 𝔀𝓸𝓻𝓵𝓭");
  });

  it("copies original text for font preview styles", () => {
    const dancingScript = textStyles.find((style) => style.id === "dancing-script");

    expect(dancingScript).toBeDefined();
    expect(getCopyText("hello world", dancingScript!)).toBe("hello world");
  });
});
