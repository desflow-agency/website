import type { Metadata } from "next";

import { type SectionPage, siteConfig } from "@/lib/site";

import { defaultLocale, hasLocale, type Locale, localeMeta, locales, localizePath } from "./config";
import { getDictionary } from "./index";

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

// Metadane podstrony sekcji (np. /oferta, /en/services).
export function sectionPageMetadata(locale: string, section: SectionPage): Metadata {
  if (!hasLocale(locale)) return {};

  const page = getDictionary(locale).pages.items[section];
  const path = `/${section}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: pageAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: localeMeta[locale].ogLocale,
      url: localizePath(locale, path),
      title: page.metaTitle,
      description: page.metaDescription,
    },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription },
  };
}
