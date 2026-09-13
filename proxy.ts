import { type NextRequest, NextResponse } from "next/server";

import {
  COUNTRY_COOKIE,
  defaultLocale,
  hasLocale,
  internalFromSlug,
  LOCALE_COOKIE,
  type Locale,
  localizePath,
  pathnames,
} from "@/lib/i18n/config";

/*
 * Routing wersji językowych:
 *  - "/" i polskie adresy (np. /polityka-prywatnosci) → wewnętrznie /pl/...
 *  - "/en/...", "/de/..." → wewnętrznie /en/..., /de/... (z tłumaczeniem slugów, np. /de/datenschutz)
 *  - "/pl/..." oraz wewnętrzne nazwy (np. /en/privacy) → przekierowanie na właściwy publiczny adres
 *  - osoba, która wybrała EN/DE, wchodząc na polski adres dostaje przekierowanie na swoją wersję
 *  - kraj z nagłówka hostingu (Vercel / Cloudflare) zapisywany w cookie — tylko do podpowiedzi języka
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [, first = ""] = pathname.split("/");

  let locale: Locale = defaultLocale;
  let slug = pathname;
  let explicitPrefix = false;

  if (hasLocale(first)) {
    locale = first;
    slug = pathname.slice(first.length + 1) || "/";
    explicitPrefix = true;
  }

  // Obrazki Open Graph generowane dla /pl muszą działać pod swoim adresem.
  if (slug.startsWith("/opengraph-image")) {
    return NextResponse.next();
  }

  const internal = internalFromSlug(locale, slug) ?? slug;
  const canonical = localizePath(locale, internal);

  // /pl/... albo nieprzetłumaczony slug (np. /en/privacy) → kanoniczny adres.
  if ((explicitPrefix && locale === defaultLocale) || (pathnames[slug] && canonical !== pathname)) {
    return redirect(request, canonical + search);
  }

  // Zapamiętany wybór języka: polski adres → wersja wybrana przez użytkownika.
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const isPageNavigation = request.method === "GET" && request.headers.get("sec-fetch-dest") === "document";

  if (!explicitPrefix && isPageNavigation && savedLocale && hasLocale(savedLocale) && savedLocale !== defaultLocale) {
    // 307: zależy od cookie, więc przeglądarka nie może zapamiętać przekierowania na stałe.
    return redirect(request, localizePath(savedLocale, internal) + search, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${internal === "/" ? "" : internal}`;
  const response = NextResponse.rewrite(url);

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country");

  if (country && country !== "XX" && request.cookies.get(COUNTRY_COOKIE)?.value !== country) {
    response.cookies.set(COUNTRY_COOKIE, country.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return response;
}

function redirect(request: NextRequest, target: string, status = 308) {
  return NextResponse.redirect(new URL(target, request.url), status);
}

export const config = {
  // Bez API, panelu admina, plików Next.js i plików statycznych (wszystko z kropką, np. .mp4, robots.txt).
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
