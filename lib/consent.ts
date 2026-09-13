// Zgoda na cookies analityczne (Google Analytics). Zapisywana w przeglądarce, bez serwera.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XJ9FE0BJNJ";

const STORAGE_KEY = "desflow-consent";
const CHANGE_EVENT = "desflow:consent-change";
const OPEN_EVENT = "desflow:consent-open";

export type Consent = { analytics: boolean; date: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const consent: Consent = { analytics, date: new Date().toISOString() };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {}

  if (!analytics) revokeAnalytics();
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: consent }));
}

export function onConsentChange(listener: (consent: Consent) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

// Link "Ustawienia cookies" w stopce otwiera baner ponownie.
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(listener: () => void) {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}

// Wycofanie zgody: blokada wysyłki danych i usunięcie cookies _ga*.
function revokeAnalytics() {
  window[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });

  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];

  document.cookie
    .split("; ")
    .map((row) => row.split("=")[0])
    .filter((name) => name.startsWith("_ga"))
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; path=/; max-age=0${domain ? `; domain=${domain}` : ""}`;
      });
    });
}
