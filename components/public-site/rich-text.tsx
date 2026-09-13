import { Fragment } from "react";

import { cn } from "@/lib/utils";

/*
 * Zamienia *wyróżnione* fragmenty tekstu ze słownika na kursywę szeryfową.
 * Działa w komponentach serwerowych i klienckich (czysta funkcja).
 */
export function Accent({ text, className }: { text: string; className?: string }) {
  const parts = text.split("*");

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className={cn("serif-accent", className ?? "text-brand")}>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}

export function Gradient({ text }: { text: string }) {
  return <Accent text={text} className="text-gradient pr-1" />;
}

// Wstawia wartości w {nawiasy} — np. "Nie, zostaw {current}".
export function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}
