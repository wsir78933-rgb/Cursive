import type { getDictionary } from "@/lib/i18n";
import type {
  CopyMode,
  PlatformRecommendation
} from "@/lib/style-compatibility";

type Dictionary = ReturnType<typeof getDictionary>;

export function getCopyModeLabel(copyMode: CopyMode, dictionary: Dictionary): string {
  return copyMode === "copyable"
    ? dictionary.styleStatus.copyable
    : dictionary.styleStatus.previewOnly;
}

export function getPlatformLabel(
  platformRecommendation: PlatformRecommendation,
  dictionary: Dictionary
): string {
  if (platformRecommendation === "social") {
    return dictionary.styleStatus.bestForSocial;
  }

  if (platformRecommendation === "google-docs") {
    return dictionary.styleStatus.bestForGoogleDocs;
  }

  if (platformRecommendation === "google-docs-installable") {
    return dictionary.styleStatus.bestForInstallable;
  }

  if (platformRecommendation === "ms-word") {
    return dictionary.styleStatus.bestForWord;
  }

  return dictionary.styleStatus.bestForGeneral;
}
