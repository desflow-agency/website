import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionPageView } from "@/components/public-site/section-page-view";
import { hasLocale } from "@/lib/i18n";
import { sectionPageMetadata } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return sectionPageMetadata(locale, "contact");
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <SectionPageView locale={locale} section="contact" />;
}
