import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number, locale: "pl" | "en" | "de" = "pl") {
  const intlLocale = { pl: "pl-PL", en: "en-GB", de: "de-DE" }[locale];
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

// [nazwa PL, opis PL, cena "od" w PLN (null = wycena indywidualna), ikona, rabat w %, cena "do" w PLN (null = bez górnej granicy)]
// Nazwy i opisy w innych językach: lib/i18n/dictionaries (services.items, ta sama kolejność).
export const services = [
  [
    "Grafika komputerowa",
    "Profesjonalne grafiki reklamowe, identyfikacja wizualna oraz materiały marketingowe.",
    50,
    "Sparkles",
    0,
    null,
  ],
  [
    "Montaż video",
    "Dynamiczny montaż filmów reklamowych, rolek oraz materiałów social media.",
    150,
    "Play",
    0,
    500,
  ],
  [
    "Social Media",
    "Prowadzenie profili, przygotowanie contentu i zwiększanie zasięgów.",
    250,
    "Target",
    40,
    null,
  ],
  [
    "Strony internetowe",
    "Nowoczesne, szybkie strony i landing page z animacjami, zoptymalizowane pod SEO.",
    null,
    "Code2",
    0,
    null,
  ],
] as const;

// Przedział cen, np. "150–500 zł".
export function moneyRange(min: number, max: number, locale: "pl" | "en" | "de" = "pl") {
  const intlLocale = { pl: "pl-PL", en: "en-GB", de: "de-DE" }[locale];
  const format = new Intl.NumberFormat(intlLocale, { style: "currency", currency: "PLN", maximumFractionDigits: 0 });
  return typeof format.formatRange === "function" ? format.formatRange(min, max) : `${money(min, locale)} – ${money(max, locale)}`;
}

export function finalPrice(price: number, discount: number) {
  return price * (1 - discount / 100);
}