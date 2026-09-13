"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { onConsentChange, readConsent } from "@/lib/consent";
import { languagePrompt } from "@/lib/i18n";
import {
  COUNTRY_COOKIE,
  hasLocale,
  LOCALE_COOKIE,
  type Locale,
  localeForCountry,
  localeMeta,
  PROMPT_STORAGE_KEY,
} from "@/lib/i18n/config";

import { Flag } from "./flags";
import { rememberLocale, switchLocale } from "./locale-actions";
import { format } from "./rich-text";

// Strefa czasowa → kraj (gdy hosting nie podał kraju w nagłówku). Bez zewnętrznych usług i bez wysyłania IP.
const TIMEZONE_COUNTRY: Record<string, string> = {
  "Europe/Warsaw": "PL",
  "Europe/Berlin": "DE",
  "Europe/Busingen": "DE",
  "Europe/Vienna": "AT",
  "Europe/Zurich": "CH",
  "Europe/Vaduz": "LI",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Amsterdam": "NL",
  "Europe/Prague": "CZ",
  "Europe/Paris": "FR",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Los_Angeles": "US",
};

type Detection = { suggested: Locale; country: string | null };

function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function detect(): Detection {
  let country = readCookie(COUNTRY_COOKIE) ?? null;

  if (!country) {
    try {
      country = TIMEZONE_COUNTRY[Intl.DateTimeFormat().resolvedOptions().timeZone] ?? null;
    } catch {}
  }

  if (!country) {
    const region = navigator.languages
      .map((language) => language.split("-")[1])
      .find((part) => part && part.length === 2);
    country = region?.toUpperCase() ?? null;
  }

  if (country) return { suggested: localeForCountry(country), country };

  // Brak kraju — decyduje język przeglądarki.
  const language = navigator.language.slice(0, 2).toLowerCase();
  return { suggested: hasLocale(language) ? language : "en", country: null };
}

export function LanguagePrompt({ locale, internalPath }: { locale: Locale; internalPath: string }) {
  const [detection, setDetection] = useState<Detection | null>(null);

  useEffect(() => {
    try {
      if (readCookie(LOCALE_COOKIE) || localStorage.getItem(PROMPT_STORAGE_KEY)) return;
    } catch {
      return;
    }

    const result = detect();
    if (result.suggested === locale) return;

    let timer: number | undefined;
    const show = (delay: number) => {
      timer = window.setTimeout(() => setDetection(result), delay);
    };

    if (readConsent()) {
      show(1400);
      return () => window.clearTimeout(timer);
    }

    const unsubscribe = onConsentChange(() => {
      unsubscribe();
      show(700);
    });

    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [locale]);

  const dismiss = () => {
    rememberLocale(locale);
    setDetection(null);
  };

  const suggested = detection?.suggested;
  const t = suggested ? languagePrompt[suggested] : null;

  let countryName = detection?.country ?? "";
  if (detection?.country && suggested) {
    try {
      countryName = new Intl.DisplayNames([suggested], { type: "region" }).of(detection.country) ?? detection.country;
    } catch {}
  }

  return (
    <AnimatePresence>
      {detection && suggested && t && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-labelledby="language-prompt-title"
          lang={localeMeta[suggested].htmlLang}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-3 bottom-3 z-[150] mx-auto max-w-md overflow-hidden rounded-3xl border border-line-strong bg-panel/90 p-5 shadow-float backdrop-blur-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/25 blur-3xl" />

          <button
            type="button"
            onClick={dismiss}
            aria-label={t.close}
            className="absolute right-3 top-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full text-faint transition hover:bg-ink/5 hover:text-fg"
          >
            <X size={16} />
          </button>

          <div className="relative flex gap-4">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-ink/[0.04]">
              <Globe2 size={20} className="text-brand" />
              <Flag
                code={localeMeta[suggested].flag}
                className="absolute -bottom-1 -right-1 h-3.5 w-5 rounded-[2px] shadow-[0_0_0_2px_var(--color-panel)]"
              />
            </span>

            <div className="min-w-0 pr-6">
              <p id="language-prompt-title" className="text-sm leading-6 text-soft">
                {detection.country ? format(t.detected, { country: countryName }) : t.detectedByLanguage}
              </p>
              <p className="mt-0.5 font-semibold tracking-tight">{t.question}</p>
            </div>
          </div>

          <div className="relative mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => switchLocale(suggested, internalPath)}
              className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-fg px-4 text-sm font-semibold text-canvas transition hover:shadow-[0_8px_30px_rgba(139,140,255,0.35)]"
            >
              <Flag code={localeMeta[suggested].flag} className="h-3 w-[18px] rounded-[2px]" />
              {t.yes}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="h-10 flex-1 cursor-pointer rounded-full border border-line-strong px-4 text-sm font-medium text-soft transition hover:bg-ink/5 hover:text-fg"
            >
              {format(t.no, { current: localeMeta[locale].name })}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
