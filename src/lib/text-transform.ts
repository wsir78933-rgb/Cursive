import type { TextStyle } from "./text-styles";

export function transformUnicodeText(inputText: string, textStyle: TextStyle): string {
  if (textStyle.kind !== "unicode") {
    return inputText;
  }

  if (!textStyle.unicodeMap) {
    throw new Error(`Unicode style "${textStyle.id}" is missing unicodeMap`);
  }

  return Array.from(inputText)
    .map((character) => textStyle.unicodeMap?.[character] ?? character)
    .join("");
}

export function getCopyText(inputText: string, textStyle: TextStyle): string {
  if (textStyle.kind === "unicode") {
    return transformUnicodeText(inputText, textStyle);
  }

  return inputText;
}
