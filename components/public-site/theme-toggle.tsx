"use client";

import { useEffect, useId, useState } from "react";
import { flushSync } from "react-dom";

import { THEME_STORAGE_KEY, type Theme, themeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

const DURATION = 1100;
const LITE_DURATION = 750;
const SPARK_COLORS = ["#8b8cff", "#5ee6cf", "#ffb547", "#ff5fa2", "#ffffff"];

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}

  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", themeColors[theme]);
  });
}

/*
 * Efekt przejścia:
 *  1. nowy motyw "odsłania się" kołem rosnącym od przycisku (clip-path),
 *  2. stary motyw w tle oddala się, rozmywa i ciemnieje,
 *  3. nad wszystkim: tęczowy pierścień fali na krawędzi koła, błysk i iskry.
 *
 * Na telefonach i słabszych urządzeniach wersja lżejsza: bez rozmyć (filter: blur) i z mniejszą liczbą iskier —
 * pełnoekranowe rozmycie potrafi przyciąć animację i całą stronę.
 */
function isLiteDevice() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 8;
  return coarse || window.innerWidth < 768 || cores <= 4;
}

function switchTheme(next: Theme, originX: number, originY: number, onApplied: () => void) {
  const root = document.documentElement;
  const lite = isLiteDevice();
  const duration = lite ? LITE_DURATION : DURATION;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    applyTheme(next);
    onApplied();
    return;
  }

  if (!document.startViewTransition) {
    // Płynna zmiana kolorów wszystkich elementów jest zbyt ciężka dla telefonu — tam zmiana od razu.
    if (lite) {
      applyTheme(next);
      onApplied();
      return;
    }

    root.classList.add("theme-fade");
    applyTheme(next);
    onApplied();
    window.setTimeout(() => root.classList.remove("theme-fade"), 600);
    return;
  }

  const radius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  );

  const fx = createEffectsLayer(originX, originY, radius, lite, duration);

  const transition = document.startViewTransition(() => {
    flushSync(() => {
      applyTheme(next);
      onApplied();
    });
    document.body.appendChild(fx);
  });

  transition.ready.then(() => {
    const easing = "cubic-bezier(0.76, 0, 0.24, 1)";

    root.animate(
      {
        clipPath: [
          `circle(0px at ${originX}px ${originY}px)`,
          `circle(${radius}px at ${originX}px ${originY}px)`,
        ],
      },
      { duration, easing, pseudoElement: "::view-transition-new(root)", fill: "both" }
    );

    if (lite) return;

    root.animate(
      {
        transform: ["scale(1) rotate(0deg)", "scale(0.9) rotate(-1.5deg)"],
        filter: ["blur(0px) brightness(1)", "blur(10px) brightness(0.45)"],
        transformOrigin: [`${originX}px ${originY}px`, `${originX}px ${originY}px`],
      },
      { duration: DURATION, easing, pseudoElement: "::view-transition-old(root)", fill: "both" }
    );
  });

  transition.finished.finally(() => fx.remove());
}

function createEffectsLayer(x: number, y: number, radius: number, lite: boolean, duration: number) {
  const layer = document.createElement("div");
  layer.className = lite ? "theme-fx theme-fx--lite" : "theme-fx";
  layer.setAttribute("aria-hidden", "true");
  layer.style.setProperty("--fx-x", `${x}px`);
  layer.style.setProperty("--fx-y", `${y}px`);
  layer.style.setProperty("--fx-r", `${radius}px`);
  layer.style.setProperty("--fx-duration", `${duration}ms`);

  const glow = document.createElement("span");
  glow.className = "theme-fx__glow";
  const ring = document.createElement("span");
  ring.className = "theme-fx__ring";
  const flash = document.createElement("span");
  flash.className = "theme-fx__flash";
  if (lite) {
    layer.append(ring, flash);
  } else {
    layer.append(glow, ring, flash);
  }

  // Iskry: okrągłe drobinki + promienie strzelające na zewnątrz.
  const count = lite ? 12 : 34;
  for (let index = 0; index < count; index++) {
    const spark = document.createElement("span");
    const isRay = index % 3 === 0;
    const angle = (index / count) * 360 + Math.random() * 14;
    const distance = 140 + Math.random() * 360;
    const radians = (angle * Math.PI) / 180;

    spark.className = isRay ? "theme-fx__spark theme-fx__spark--ray" : "theme-fx__spark";
    spark.style.setProperty("--color", SPARK_COLORS[index % SPARK_COLORS.length]);
    spark.style.setProperty("--delay", `${Math.random() * 90}ms`);
    spark.style.setProperty("--life", `${650 + Math.random() * 450}ms`);

    if (isRay) {
      // Promień jest obrócony, więc przesuwamy go wzdłuż własnej osi.
      spark.style.setProperty("--angle", `${angle}deg`);
      spark.style.setProperty("--size", `${18 + Math.random() * 26}px`);
      spark.style.setProperty("--dx", "0px");
      spark.style.setProperty("--dy", `${-distance * 1.2}px`);
    } else {
      spark.style.setProperty("--size", `${3 + Math.random() * 6}px`);
      spark.style.setProperty("--dx", `${Math.sin(radians) * distance}px`);
      spark.style.setProperty("--dy", `${-Math.cos(radians) * distance}px`);
    }

    layer.append(spark);
  }

  return layer;
}

type ThemeText = { toLight: string; toDark: string; change: string; light: string; dark: string };

export function ThemeToggle({ className, t }: { className?: string; t: ThemeText }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [busy, setBusy] = useState(false);
  const maskId = `theme-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Kilka przełączników (desktop / mobile) — wszystkie śledzą atrybut na <html>.
  useEffect(() => {
    // Gdy strona renderuje się w przeglądarce (np. 404), skrypt startowy z <head> się nie wykona — nadrabiamy tutaj.
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if ((stored === "light" || stored === "dark") && document.documentElement.dataset.theme !== stored) {
        document.documentElement.dataset.theme = stored;
      }
    } catch {}

    setTheme(readTheme());

    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const next: Theme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={(event) => {
        if (busy) return;

        const target: Theme = readTheme() === "light" ? "dark" : "light";
        const rect = event.currentTarget.getBoundingClientRect();
        // Klawiatura (Enter/Spacja) nie ma współrzędnych kursora — wtedy środek przycisku.
        const x = event.clientX || rect.left + rect.width / 2;
        const y = event.clientY || rect.top + rect.height / 2;

        setBusy(true);
        switchTheme(target, x, y, () => setTheme(target));
        window.setTimeout(() => setBusy(false), DURATION);
      }}
      aria-label={theme ? (next === "light" ? t.toLight : t.toDark) : t.change}
      title={theme ? (next === "light" ? t.light : t.dark) : undefined}
      className={cn(
        "group relative grid h-10 w-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border border-line-strong bg-ink/[0.04] text-fg transition-colors hover:bg-ink/[0.09]",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-radial from-brand/35 to-transparent to-70% opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <svg viewBox="0 0 24 24" width="20" height="20" className="relative" aria-hidden="true">
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle className="theme-icon__cut" cx="17" cy="7" r="5.5" fill="black" />
        </mask>

        <circle className="theme-icon__core" cx="12" cy="12" r="5" fill="currentColor" mask={`url(#${maskId})`} />

        <g className="theme-icon__rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.4" y2="4.6" />
        </g>
      </svg>
    </button>
  );
}
