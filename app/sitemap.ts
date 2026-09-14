import type { MetadataRoute } from "next";

import { locales, localizePath } from "@/lib/i18n/config";
import { languageAlternates } from "@/lib/i18n/seo";
import { isVideo, projects } from "@/lib/portfolio";
import { contentUpdated, siteConfig } from "@/lib/site";

const absolute = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

// Obrazki pokazywane na danej stronie — Google może je zaindeksować w Grafice.
const portfolioImages = projects.filter((project) => !isVideo(project.media)).map((project) => absolute(project.media));
const websitePosters = ["www-hypecube-net", "advicebot-info", "dawar-zary-pl"].map((name) =>
  absolute(`/websites/${name}.webp`)
);

type Page = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  lastModified: string;
  images?: string[];
};

const pages: Page[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", lastModified: contentUpdated, images: [...websitePosters, ...portfolioImages] },
  { path: "/offer", priority: 0.9, changeFrequency: "monthly", lastModified: contentUpdated },
  { path: "/websites", priority: 0.9, changeFrequency: "monthly", lastModified: contentUpdated, images: websitePosters },
  { path: "/portfolio", priority: 0.8, changeFrequency: "monthly", lastModified: contentUpdated, images: portfolioImages },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly", lastModified: contentUpdated },
  { path: "/reviews", priority: 0.6, changeFrequency: "monthly", lastModified: contentUpdated },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly", lastModified: contentUpdated },
  { path: "/locations", priority: 0.6, changeFrequency: "yearly", lastModified: contentUpdated },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly", lastModified: siteConfig.policyUpdated },
];

// Każda strona w każdym języku, z adresami pozostałych wersji (hreflang) i obrazkami.
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: absolute(localizePath(locale, page.path)),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(page.path)).map(([lang, path]) => [lang, absolute(path)])
        ),
      },
      ...(page.images ? { images: page.images } : {}),
    }))
  );
}
