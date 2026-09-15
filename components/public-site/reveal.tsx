"use client";

import { type CSSProperties, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/*
 * Wjazd elementu przy przewijaniu — sam CSS + jeden IntersectionObserver, bez framer-motion.
 * Serwer wysyła element widoczny. Dopiero po starcie skryptu elementy poniżej ekranu dostają
 * data-reveal="hidden" i pokazują się, gdy do nich dojedziesz. To, co jest już na ekranie, zostaje widoczne.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
  }
  return observer;
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || element.dataset.reveal === "shown") return;

    if (!element.dataset.reveal) {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.dataset.reveal = "shown";
        return;
      }
      element.dataset.reveal = "hidden";
    }

    const io = getObserver();
    io.observe(element);
    return () => io.unobserve(element);
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  kicker,
  title,
  description,
  id,
}: {
  kicker: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
}) {
  return (
    <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="kicker">{kicker}</p>
        <h2 id={id} className="title-lg mt-5 text-balance">
          {title}
        </h2>
      </div>
      {description && <p className="max-w-sm text-[15px] leading-7 text-soft">{description}</p>}
    </Reveal>
  );
}
