// Dane wspólne dla strony publicznej, metadanych i danych strukturalnych (JSON-LD).
// Trzymane poza komponentami "use client", żeby dało się ich używać po stronie serwera.

export const siteConfig = {
  name: "desflow",
  legalName: "desflow",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://desflow.pl").replace(/\/$/, ""),
  email: "kontakt@desflow.pl",
  /*
   * UZUPEŁNIJ PRZED PUBLIKACJĄ — dane wymagane w polityce prywatności (RODO, art. 13).
   * Puste pola są widoczne na stronie polityki jako żółte znaczniki [UZUPEŁNIJ].
   */
  legal: {
    companyName: "desflow.pl", // pełna nazwa firmy / imię i nazwisko przedsiębiorcy, np. "desflow Jan Kowalski"
  },
  policyUpdated: "2026-09-13",
  socials: {
    youtube: "https://www.youtube.com/@desflowpl",
    tiktok: "https://www.tiktok.com/@desflow.pl",
  },
} as const;

// Miasta, w których stacjonujemy (spotkania na miejscu). Pracujemy też online w całej Polsce.
export const locations = [
  { key: "szczecin", name: "Szczecin" },
  { key: "zielonaGora", name: "Zielona Góra" },
  { key: "zary", name: "Żary" },
] as const;

// Kotwice sekcji w menu (etykiety są w słownikach lib/i18n/dictionaries).
export const navSections = ["offer", "websites", "portfolio", "reviews", "faq", "locations"] as const;
export type NavSection = (typeof navSections)[number];
