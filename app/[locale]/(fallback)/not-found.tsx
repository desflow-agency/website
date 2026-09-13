import { locale as rootLocale } from "next/root-params";

import { NotFoundView } from "@/components/public-site/not-found-view";
import { defaultLocale, getDictionary, hasLocale } from "@/lib/i18n";

// 404 w języku wersji, w której ktoś się zgubił (np. /de/cokolwiek → po niemiecku).
export default async function NotFound() {
  const value = await rootLocale();
  const locale = value && hasLocale(value) ? value : defaultLocale;

  return (
    <>
      <title>{`${getDictionary(locale).notFound.metaTitle} | desflow`}</title>
      <NotFoundView locale={locale} />
    </>
  );
}
