import { defaultLocale, type Locale, localeMeta, locales, localizePath } from "./config";

// Adresy hreflang dla danej wewnętrznej ścieżki (np. "/" albo "/privacy").
export function languageAlternates(internalPath = "/") {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeMeta[locale].htmlLang, localizePath(locale, internalPath)])),
    "x-default": localizePath(defaultLocale, internalPath),
  };
}

export function pageAlternates(locale: Locale, internalPath = "/") {
  return {
    canonical: localizePath(locale, internalPath),
    languages: languageAlternates(internalPath),
  };
}
