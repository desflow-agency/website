// Nazwy i kolory statusów, priorytetów i ról w panelu admina.

export type Tone = "brand" | "mint" | "amber" | "rose" | "sky" | "neutral";

export const toneClasses: Record<Tone, { badge: string; dot: string; bar: string; soft: string }> = {
  brand: { badge: "border-brand/25 bg-brand/10 text-brand", dot: "bg-brand", bar: "bg-brand", soft: "bg-brand/10 text-brand" },
  mint: { badge: "border-mint/25 bg-mint/10 text-mint", dot: "bg-mint", bar: "bg-mint", soft: "bg-mint/10 text-mint" },
  amber: { badge: "border-amber/30 bg-amber/10 text-amber", dot: "bg-amber", bar: "bg-amber", soft: "bg-amber/10 text-amber" },
  rose: { badge: "border-rose-500/25 bg-rose-500/10 text-rose-500", dot: "bg-rose-500", bar: "bg-rose-500", soft: "bg-rose-500/10 text-rose-500" },
  sky: { badge: "border-sky-500/25 bg-sky-500/10 text-sky-500", dot: "bg-sky-500", bar: "bg-sky-500", soft: "bg-sky-500/10 text-sky-500" },
  neutral: { badge: "border-line-strong bg-ink/[0.04] text-soft", dot: "bg-faint", bar: "bg-faint", soft: "bg-ink/[0.06] text-soft" },
};

type Label = { label: string; tone: Tone };

export const messageStatuses = {
  NEW: { label: "Nowe", tone: "brand" },
  IN_PROGRESS: { label: "W trakcie", tone: "amber" },
  WAITING: { label: "Oczekuje", tone: "sky" },
  DONE: { label: "Zakończone", tone: "mint" },
  CLOSED: { label: "Zamknięte", tone: "neutral" },
} satisfies Record<string, Label>;

export type MessageStatus = keyof typeof messageStatuses;

export const messageStatusOrder = Object.keys(messageStatuses) as MessageStatus[];

export const eventStatuses = {
  PLANNED: { label: "Zaplanowane", tone: "brand" },
  IN_PROGRESS: { label: "W trakcie", tone: "amber" },
  CLIENT_REVIEW: { label: "U klienta", tone: "sky" },
  COMPLETED: { label: "Gotowe", tone: "mint" },
  CANCELLED: { label: "Anulowane", tone: "neutral" },
} satisfies Record<string, Label>;

export const eventPriorities = {
  LOW: { label: "Niski", tone: "neutral" },
  MEDIUM: { label: "Normalny", tone: "brand" },
  HIGH: { label: "Wysoki", tone: "amber" },
  URGENT: { label: "Pilny", tone: "rose" },
} satisfies Record<string, Label>;

export const roles = {
  ADMIN: { label: "Administrator", tone: "rose" },
  MANAGER: { label: "Manager", tone: "brand" },
  WORKER: { label: "Pracownik", tone: "neutral" },
} satisfies Record<string, Label>;

export function labelFor<T extends Record<string, Label>>(map: T, key: string | null | undefined): Label {
  return (key && (map as Record<string, Label>)[key]) || { label: key || "—", tone: "neutral" };
}

export function optionsFor(map: Record<string, Label>) {
  return Object.entries(map).map(([value, { label }]) => ({ value, label }));
}

export const permissionGroups = [
  {
    title: "Zgłoszenia",
    items: [
      { label: "Podgląd", value: "messages.view" },
      { label: "Edycja", value: "messages.edit" },
      { label: "Usuwanie", value: "messages.delete" },
    ],
  },
  {
    title: "Pracownicy",
    items: [
      { label: "Podgląd", value: "employees.view" },
      { label: "Edycja", value: "employees.edit" },
    ],
  },
  {
    title: "Kalendarz",
    items: [
      { label: "Podgląd", value: "calendar.view" },
      { label: "Edycja", value: "calendar.edit" },
    ],
  },
];

const dateTime = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const relative = new Intl.RelativeTimeFormat("pl-PL", { numeric: "auto" });

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "Brak daty";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Brak daty" : dateTime.format(date);
}

export function timeAgo(value?: string | Date | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "przed chwilą";
}
