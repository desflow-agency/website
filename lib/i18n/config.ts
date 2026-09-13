// Konfiguracja wersji językowych. Używana przez proxy.ts, layouty, sitemapę i komponenty klienta.

export const locales = ["pl", "en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

export const LOCALE_COOKIE = "desflow-locale";
export const COUNTRY_COOKIE = "desflow-country";
export const PROMPT_STORAGE_KEY = "desflow-lang-prompt";

export const localeMeta: Record<Locale, { name: string; ogLocale: string; htmlLang: string; flag: "pl" | "de" | "gb" }> = {
  pl: { name: "Polski", ogLocale: "pl_PL", htmlLang: "pl", flag: "pl" },
  en: { name: "English", ogLocale: "en_GB", htmlLang: "en", flag: "gb" },
  de: { name: "Deutsch", ogLocale: "de_DE", htmlLang: "de", flag: "de" },
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/*
 * Wewnętrzne ścieżki (foldery w app/[locale]) → publiczne adresy w każdym języku.
 * Strona główna nie potrzebuje wpisu. Polski jest bez prefiksu (/), pozostałe mają /en i /de.
 */
export const pathnames: Record<string, Record<Locale, string>> = {
  "/privacy": {
    pl: "/polityka-prywatnosci",
    en: "/privacy-policy",
    de: "/datenschutz",
  },
};

export type InternalPath = "/" | keyof typeof pathnames;

export function localizePath(locale: Locale, internalPath: string = "/") {
  const slug = pathnames[internalPath]?.[locale] ?? internalPath;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  if (slug === "/") return prefix || "/";
  return `${prefix}${slug}`;
}

// Publiczny slug (bez prefiksu języka) → wewnętrzna ścieżka.
export function internalFromSlug(locale: Locale, slug: string) {
  for (const [internal, localized] of Object.entries(pathnames)) {
    if (localized[locale] === slug) return internal;
  }
  return null;
}

// Kraj → sugerowany język strony.
export function localeForCountry(country: string | null | undefined): Locale {
  const code = (country || "").toUpperCase();
  if (code === "PL") return "pl";
  if (["DE", "AT", "CH", "LI"].includes(code)) return "de";
  return "en";
}
