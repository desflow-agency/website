import type { Locale } from "./config";
import { de } from "./dictionaries/de";
import { en } from "./dictionaries/en";
import { type Dictionary, pl } from "./dictionaries/pl";

export * from "./config";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { pl, en, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// Teksty banera wyboru języka — potrzebne w przeglądarce dla wszystkich języków naraz.
export const languagePrompt: Record<
  Locale,
  { detected: string; detectedByLanguage: string; question: string; yes: string; no: string; close: string }
> = {
  pl: {
    detected: "Wykryliśmy Twoją lokalizację: {country}.",
    detectedByLanguage: "Wygląda na to, że mówisz po polsku.",
    question: "Ustawić język strony na polski?",
    yes: "Tak, po polsku",
    no: "Nie, zostaw {current}",
    close: "Zamknij",
  },
  en: {
    detected: "We detected your location: {country}.",
    detectedByLanguage: "It looks like you speak English.",
    question: "Switch the website to English?",
    yes: "Yes, English please",
    no: "No, keep {current}",
    close: "Close",
  },
  de: {
    detected: "Wir haben Ihren Standort erkannt: {country}.",
    detectedByLanguage: "Es sieht so aus, als sprächen Sie Deutsch.",
    question: "Webseite auf Deutsch umstellen?",
    yes: "Ja, auf Deutsch",
    no: "Nein, bei {current} bleiben",
    close: "Schließen",
  },
};
