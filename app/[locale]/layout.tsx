import "../globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getDictionary, hasLocale, localeMeta, locales, localizePath } from "@/lib/i18n";
import { pageAlternates } from "@/lib/i18n/seo";
import { siteConfig } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

import { fontClassName } from "../fonts";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};

  const t = getDictionary(locale).meta;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: t.description,
    keywords: t.keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: pageAlternates(locale, "/"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((other) => other !== locale).map((other) => localeMeta[other].ogLocale),
      url: localizePath(locale, "/"),
      siteName: siteConfig.name,
      title: t.shortTitle,
      description: t.description,
    },
    twitter: {
      card: "summary_large_image",
      title: t.shortTitle,
      description: t.description,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#07070b",
  colorScheme: "dark light",
};

export default async function SiteRootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={localeMeta[locale].htmlLang} data-theme="dark" suppressHydrationWarning className={fontClassName}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
