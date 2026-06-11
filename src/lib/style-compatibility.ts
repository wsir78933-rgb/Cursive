import type { StyleFilter, TextStyle } from "./text-styles";

export type CopyMode = "copyable" | "preview-only";

export type PlatformRecommendation =
  | "social"
  | "google-docs"
  | "google-docs-installable"
  | "ms-word"
  | "general";

export function getCopyMode(textStyle: TextStyle): CopyMode {
  return textStyle.kind === "unicode" ? "copyable" : "preview-only";
}

export function getPlatformRecommendation(textStyle: TextStyle): PlatformRecommendation {
  if (hasFilter(textStyle, "social")) {
    return "social";
  }

  if (hasFilter(textStyle, "google-docs-installable")) {
    return "google-docs-installable";
  }

  if (hasFilter(textStyle, "google-docs-default")) {
    return "google-docs";
  }

  if (hasFilter(textStyle, "ms-word")) {
    return "ms-word";
  }

  return "general";
}

function hasFilter(textStyle: TextStyle, filter: StyleFilter): boolean {
  return textStyle.filters.includes(filter);
}
