"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { type PointerEvent, useRef, useState } from "react";

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

function Label({ children, side }: { children: string; side: "left" | "right" }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md sm:top-4",
        side === "left" ? "left-3 sm:left-4" : "right-3 sm:right-4"
      )}
    >
      {children}
    </span>
  );
}

/*
 * Miniatura w siatce portfolio: linia podziału sama jeździ w lewo i w prawo,
 * więc efekt "przed / po" widać od razu, bez klikania. Pauza poza ekranem i przy ograniczeniu ruchu.
 */
export function CompareThumb({ before, after, width, height, labels, alt }: CompareProps) {
  const [ref, inView] = useInView<HTMLDivElement>("100px");

  return (
    <div
      ref={ref}
      data-paused={!inView}
      className="compare-thumb relative w-full overflow-hidden"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image src={after} alt={alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
      <div className="compare-thumb__before absolute inset-0">
        <Image src={before} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
      </div>
      <span className="compare-thumb__line pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-lg">
          <MoveHorizontal size={15} />
        </span>
      </span>
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
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    setTouched(true);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => dragging.current && moveTo(event.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className="relative max-h-full w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      style={{ aspectRatio: `${width} / ${height}`, maxWidth: `calc((100dvh - 9rem) * ${width / height})` }}
    >
      <Image src={after} alt={alt} fill sizes="100vw" className="object-cover object-top" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before} alt="" fill sizes="100vw" className="object-cover object-top" draggable={false} />
      </div>

      <span
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_24px_rgba(0,0,0,0.6)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-xl">
          <MoveHorizontal size={18} />
        </span>
      </span>

      <Label side="left">{labels.before}</Label>
      <Label side="right">{labels.after}</Label>

      {!touched && (
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          {hint}
        </span>
      )}

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
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
