"use client";

import { LOCALE_COOKIE, type Locale, localizePath, PROMPT_STORAGE_KEY } from "@/lib/i18n/config";

// Zapamiętuje wybór języka (cookie czyta proxy) i przechodzi na odpowiednią wersję strony.
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

  try {
    localStorage.setItem(PROMPT_STORAGE_KEY, "done");
  } catch {}
}

export function switchLocale(locale: Locale, internalPath: string) {
  rememberLocale(locale);
  window.location.assign(localizePath(locale, internalPath) + window.location.hash);
}
