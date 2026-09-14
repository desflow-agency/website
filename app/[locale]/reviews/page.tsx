import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionPageView } from "@/components/public-site/section-page-view";
import { hasLocale } from "@/lib/i18n";
import { sectionPageMetadata } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/reviews">): Promise<Metadata> {
  const { locale } = await params;
  return sectionPageMetadata(locale, "reviews");
}

export default async function ReviewsPage({ params }: PageProps<"/[locale]/reviews">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <SectionPageView locale={locale} section="reviews" />;
}
