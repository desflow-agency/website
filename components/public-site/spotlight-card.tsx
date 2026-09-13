"use client";

import { cn } from "@/lib/utils";

// Karta z poświatą podążającą za kursorem (bez re-renderów — zmienne CSS ustawiane bezpośrednio).
export function SpotlightCard({
  as: Tag = "article",
  className,
  children,
}: {
  as?: "article" | "div" | "li";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn("surface spotlight", className)}
      onPointerMove={(event: React.PointerEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </Tag>
  );
}
