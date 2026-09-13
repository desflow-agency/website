import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivacyView } from "@/components/public-site/privacy-view";
import { getDictionary, hasLocale, localeMeta } from "@/lib/i18n";
import { pageAlternates } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};

  const t = getDictionary(locale).privacyPage;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: pageAlternates(locale, "/privacy"),
    openGraph: { locale: localeMeta[locale].ogLocale, title: t.metaTitle, description: t.metaDescription },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <PrivacyView locale={locale} />;
}
