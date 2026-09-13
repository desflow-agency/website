import type { MetadataRoute } from "next";

import { locales, localizePath } from "@/lib/i18n/config";
import { languageAlternates } from "@/lib/i18n/seo";
import { siteConfig } from "@/lib/site";

const pages = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
] as const;

const absolute = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

// Każda strona w każdym języku, z adresami pozostałych wersji (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: absolute(localizePath(locale, page.path)),
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(page.path)).map(([lang, path]) => [lang, absolute(path)])
        ),
      },
    }))
  );
}
