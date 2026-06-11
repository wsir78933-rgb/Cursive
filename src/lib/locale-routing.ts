import { normalizeLocale, type Locale } from "./i18n";

export const localeRequestHeaderName = "x-cursive-generator-locale";

export function getLocaleFromPathname(pathname: string): Locale {
  const firstPathSegment = pathname.split("/").filter(Boolean)[0];

  return normalizeLocale(firstPathSegment);
}
