"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { type CSSProperties, type PointerEvent, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { useInView } from "./use-in-view";

type CompareProps = {
  before: string;
  after: string;
  width: number;
  height: number;
  labels: { before: string; after: string };
  alt: string;
};

/*
 * Podział "przed / po" robiony samymi transformacjami (translateX), a nie clip-path ani left:
 * przeglądarka tylko przesuwa gotowe warstwy na GPU, więc na telefonie nic nie miga ani nie przycina.
 *  - warstwa "przed" jest przesunięta w lewo i ucina się na linii podziału,
 *  - obrazek w środku jest przesunięty z powrotem, więc stoi w miejscu,
 *  - linia to pełnej szerokości warstwa przesunięta o pozycję podziału.
 */
const layer = "absolute inset-0 will-change-transform [backface-visibility:hidden]";

function Label({ children, side }: { children: string; side: "left" | "right" }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white sm:top-4",
        side === "left" ? "left-3 sm:left-4" : "right-3 sm:right-4"
      )}
    >
      {children}
    </span>
  );
}

function Handle({ size }: { size: "sm" | "lg" }) {
  return (
    <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <span
        className={cn(
          "absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg",
          size === "sm" ? "h-8 w-8" : "h-11 w-11"
        )}
      >
        <MoveHorizontal size={size === "sm" ? 15 : 18} />
      </span>
    </span>
  );
}

// Miniatura w siatce portfolio: linia podziału sama jeździ w lewo i w prawo. Pauza poza ekranem.
export function CompareThumb({ before, after, width, height, labels, alt }: CompareProps) {
  const [ref, inView] = useInView<HTMLDivElement>("100px");
  const sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw";

  return (
    <div ref={ref} data-paused={!inView} className="relative w-full overflow-hidden" style={{ aspectRatio: `${width} / ${height}` }}>
      <Image src={after} alt={alt} fill sizes={sizes} className="object-cover object-top" />

      <div className={cn(layer, "compare-thumb__clip overflow-hidden")}>
        <div className={cn(layer, "compare-thumb__image")}>
          <Image src={before} alt="" fill sizes={sizes} className="object-cover object-top" />
        </div>
      </div>

      <div className={cn(layer, "compare-thumb__line pointer-events-none")}>
        <Handle size="sm" />
      </div>

      <Label side="left">{labels.before}</Label>
      <Label side="right">{labels.after}</Label>
    </div>
  );
}

// Pełny podgląd: suwak przeciągany myszą / palcem albo strzałkami z klawiatury.
export function CompareSlider({ before, after, width, height, labels, alt, hint, ariaLabel }: CompareProps & { hint: string; ariaLabel: string }) {
  const [position, setPosition] = useState(50);
  const [touched, setTouched] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const rect = rectRef.current;
    if (!rect) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    setTouched(true);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    // Wymiary liczone raz na początku przeciągania, a nie przy każdym ruchu palca.
    rectRef.current = frameRef.current?.getBoundingClientRect() ?? null;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  const stop = () => {
    dragging.current = false;
  };

  const shift = (value: number): CSSProperties => ({ transform: `translate3d(${value}%, 0, 0)` });

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => dragging.current && moveTo(event.clientX)}
      onPointerUp={stop}
      onPointerCancel={stop}
      className="relative max-h-full w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] outline-offset-4 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-brand"
      style={{ aspectRatio: `${width} / ${height}`, maxWidth: `calc((100dvh - 9rem) * ${width / height})` }}
    >
      <Image src={after} alt={alt} fill sizes="100vw" className="object-cover object-top" draggable={false} />

      <div className={cn(layer, "overflow-hidden")} style={shift(position - 100)}>
        <div className={layer} style={shift(100 - position)}>
          <Image src={before} alt="" fill sizes="100vw" className="object-cover object-top" draggable={false} />
        </div>
      </div>

      <div className={cn(layer, "pointer-events-none")} style={shift(position)}>
        <Handle size="lg" />
      </div>

      <Label side="left">{labels.before}</Label>
      <Label side="right">{labels.after}</Label>

      {!touched && (
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 px-3.5 py-1.5 text-xs font-medium text-white">
          {hint}
        </span>
      )}

      {/* Tylko dla klawiatury i czytników ekranu — dotyk i mysz obsługuje ramka, żeby dwa źródła się nie "biły". */}
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(position)}
        aria-label={ariaLabel}
        onChange={(event) => {
          setPosition(Number(event.target.value));
          setTouched(true);
        }}
        className="sr-only"
      />
    </div>
  );
}
