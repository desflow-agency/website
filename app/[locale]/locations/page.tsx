import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionPageView } from "@/components/public-site/section-page-view";
import { hasLocale } from "@/lib/i18n";
import { sectionPageMetadata } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/locations">): Promise<Metadata> {
  const { locale } = await params;
  return sectionPageMetadata(locale, "locations");
}

export default async function LocationsPage({ params }: PageProps<"/[locale]/locations">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <SectionPageView locale={locale} section="locations" />;
}
