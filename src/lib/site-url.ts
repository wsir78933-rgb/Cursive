export const siteOrigin = "https://cursivegenerator.pro";

export const englishCanonicalPath = "/";
export const chineseCanonicalPath = "/zh/cursive-text-generator";

export const canonicalUrls = {
  en: `${siteOrigin}${englishCanonicalPath}`,
  zh: `${siteOrigin}${chineseCanonicalPath}`
} as const;

export const hreflangAlternates = {
  en: canonicalUrls.en,
  zh: canonicalUrls.zh,
  "x-default": canonicalUrls.en
} as const;
