"use client";

import "./site-demos.css";

import { useEffect, useState } from "react";

import type { Dictionary } from "@/lib/i18n";

import { useInView } from "./use-in-view";

export type DemoKind = "saas" | "restaurant" | "portfolio";

const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;

/*
 * Renderuje stronę w "wirtualnym" oknie 1280 × 800 i skaluje ją do rozmiaru ramki —
 * jak zrzut ekranu, ale z działającymi animacjami. Poza ekranem animacje są pauzowane.
 * Dema nie używają nagłówków h1–h6, żeby nie mieszać w strukturze SEO strony.
 */
export function ScaledViewport({ children }: { children: React.ReactNode }) {
  const [ref, visible] = useInView<HTMLDivElement>("100px");
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resize = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / VIEWPORT_WIDTH);
    });

    resize.observe(element);
    return () => resize.disconnect();
  }, [ref]);

  return (
    <div
      ref={ref}
      data-paused={!visible}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${VIEWPORT_WIDTH} / ${VIEWPORT_HEIGHT}` }}
      aria-hidden="true"
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          transform: `scale(${scale})`,
          opacity: scale ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function SiteDemo({ kind, t }: { kind: DemoKind; t?: Dictionary["saasDemo"] }) {
  return (
    <ScaledViewport>
      {kind === "saas" && t && <SaasDemo t={t} />}
      {kind === "restaurant" && <RestaurantDemo />}
      {kind === "portfolio" && <PortfolioDemo />}
    </ScaledViewport>
  );
}

/* ================================================== */
/* 1. LANDING PAGE SAAS                               */
/* ================================================== */

function SaasDemo({ t }: { t: Dictionary["saasDemo"] }) {
  const bars = [42, 68, 55, 80, 62, 95, 74, 88, 70, 100, 84, 92];

  return (
    <div
      className="h-full overflow-hidden text-white"
      style={{ background: "#0a0a18", fontFamily: "var(--font-sans)" }}
    >
      <div className="demo-page">
        {/* EKRAN 1 — HERO */}
        <section
          className="demo-screen px-20"
          style={{
            background:
              "radial-gradient(circle at 78% 30%, rgba(124,92,255,.35), transparent 40%), radial-gradient(circle at 20% 90%, rgba(34,211,238,.18), transparent 40%)",
          }}
        >
          <nav className="flex h-24 items-center justify-between">
            <div className="flex items-center gap-3 text-2xl font-bold">
              <span className="h-8 w-8 rounded-lg" style={{ background: "linear-gradient(135deg,#7c5cff,#22d3ee)" }} />
              nova
            </div>
            <div className="flex gap-10 text-lg text-white/60">
              {t.nav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <span className="rounded-full bg-white px-6 py-3 text-lg font-semibold text-black">{t.tryFree}</span>
          </nav>

          <div className="mt-16 grid grid-cols-[1fr_480px] items-center gap-14">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-base text-white/80">
                {t.badge}
              </span>
              <p
                className="mt-8 text-[62px] font-bold leading-[1.02] tracking-[-0.04em]"
                style={{ animation: "demo-type 18s ease-out infinite" }}
              >
                {t.headline[0]}
                <br />
                <span style={{ background: "linear-gradient(90deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", color: "transparent" }}>
                  {t.headline[1]}
                </span>
              </p>
              <p className="mt-8 max-w-lg text-2xl leading-relaxed text-white/60">
                {t.lead}
              </p>
              <div className="mt-10 flex gap-4">
                <span className="relative overflow-hidden rounded-2xl px-8 py-5 text-xl font-semibold" style={{ background: "linear-gradient(135deg,#7c5cff,#5b5cf0)" }}>
                  {t.start}
                  <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30" style={{ animation: "demo-shine 3.5s ease-in-out infinite" }} />
                </span>
                <span className="rounded-2xl border border-white/15 px-8 py-5 text-xl">{t.demo}</span>
              </div>
            </div>

            <div className="relative" style={{ animation: "demo-float 6s ease-in-out infinite" }}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-white/60">{t.revenue}</span>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-base font-semibold text-emerald-300">+128%</span>
                </div>
                <p className="mt-3 text-5xl font-bold tracking-tight">{t.amount}</p>
                <div className="mt-8 flex h-48 items-end gap-3">
                  {bars.map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 origin-bottom rounded-t-lg"
                      style={{
                        height: `${height}%`,
                        background: "linear-gradient(180deg,#22d3ee,#7c5cff)",
                        animation: `demo-bar 2.8s ease-in-out ${index * 0.12}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                className="absolute -right-8 -top-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#15152a] p-5 shadow-2xl"
                style={{ animation: "demo-toast 6s ease-in-out infinite" }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/20 text-2xl">↑</span>
                <div>
                  <p className="text-base text-white/50">{t.newOrder}</p>
                  <p className="text-xl font-semibold">{t.orderAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EKRAN 2 — FUNKCJE */}
        <section className="demo-screen px-20 pt-24">
          <p className="text-center text-lg font-semibold uppercase tracking-[0.3em] text-violet-300">{t.featuresKicker}</p>
          <p className="mx-auto mt-5 max-w-3xl text-center text-6xl font-bold tracking-[-0.03em]">{t.featuresTitle}</p>
          <div className="mt-16 grid grid-cols-3 gap-8">
            {t.features.map(([title, text], index) => ({ title, text, color: ["#7c5cff", "#22d3ee", "#f472b6"][index] })).map(({ title, text, color }, index) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-10"
                style={{ animation: `demo-rise 18s ease-out ${index * 0.2}s infinite` }}
              >
                <span className="block h-16 w-16 rounded-2xl" style={{ background: `linear-gradient(135deg, ${color}, transparent)` }} />
                <p className="mt-8 text-3xl font-semibold">{title}</p>
                <p className="mt-3 text-xl leading-relaxed text-white/55">{text}</p>
                <span className="absolute inset-y-0 left-0 w-1/4 bg-white/[0.06]" style={{ animation: `demo-shine 4s ease-in-out ${index * 0.6}s infinite` }} />
              </div>
            ))}
          </div>
          <div className="mt-20 overflow-hidden">
            <div className="flex w-max gap-20 text-3xl font-bold text-white/25" style={{ animation: "demo-marquee 14s linear infinite" }}>
              {Array.from({ length: 2 }).flatMap((_, round) =>
                ["Lumen", "orbit", "KORA", "Vektor", "pulsar", "Nordia", "fala"].map((logo) => (
                  <span key={`${round}-${logo}`}>{logo}</span>
                ))
              )}
            </div>
          </div>
        </section>

        {/* EKRAN 3 — CENNIK */}
        <section className="demo-screen px-20 pt-20">
          <p className="text-center text-6xl font-bold tracking-[-0.03em]">{t.pricingTitle}</p>
          <div className="mt-16 grid grid-cols-3 items-center gap-8">
            {t.plans.map(([name, price], index) => ({ name, price, featured: index === 1 })).map(({ name, price, featured }) => (
              <div key={name} className={`relative overflow-hidden rounded-3xl p-[2px] ${featured ? "scale-105" : ""}`}>
                {featured && (
                  <span
                    className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
                    style={{ background: "conic-gradient(from 0deg, transparent 0 60%, #7c5cff, #22d3ee, transparent 90%)", animation: "demo-spin 4s linear infinite" }}
                  />
                )}
                <div className={`relative rounded-[22px] p-10 ${featured ? "bg-[#12122a]" : "border border-white/10 bg-white/[0.03]"}`}>
                  <p className="text-2xl text-white/60">{name}</p>
                  <p className="mt-4 text-6xl font-bold">
                    {price}
                    <span className="text-2xl font-normal text-white/40"> {t.perMonth}</span>
                  </p>
                  <div className="mt-8 space-y-4 text-xl text-white/70">
                    {t.planFeatures.map((feature) => (
                      <p key={feature}>{feature}</p>
                    ))}
                  </div>
                  <span className={`mt-10 block rounded-2xl py-5 text-center text-xl font-semibold ${featured ? "bg-white text-black" : "border border-white/15"}`}>
                    {t.choose}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================== */
/* 2. RESTAURACJA                                     */
/* ================================================== */

function RestaurantDemo() {
  const serif = { fontFamily: "var(--font-serif), Georgia, serif" };

  return (
    <div className="h-full overflow-hidden" style={{ background: "#120c08", color: "#f3e6d3" }}>
      <div className="demo-page">
        {/* EKRAN 1 — HERO */}
        <section className="demo-screen">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 68% 58%, #3a2416 0 16%, transparent 16.5%), radial-gradient(circle at 68% 58%, #d9a066 0 23%, transparent 23.5%), radial-gradient(circle at 64% 54%, #ff8a4c 0 6%, transparent 12%), radial-gradient(circle at 73% 62%, #7fa650 0 4%, transparent 9%), radial-gradient(circle at 30% 30%, #5a2d12, transparent 50%), radial-gradient(circle at 90% 10%, #ff7a3d55, transparent 35%), #1b120c",
              animation: "demo-kenburns 16s ease-in-out infinite",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#120c08] via-[#120c08]/70 to-transparent" />

          <nav className="relative flex h-24 items-center justify-between px-20 text-lg">
            <span className="text-3xl" style={serif}>
              Dawar
            </span>
            <div className="flex gap-10 text-[#f3e6d3]/70">
              <span>Menu</span>
              <span>O nas</span>
              <span>Wydarzenia</span>
              <span>Kontakt</span>
            </div>
          </nav>

          <div className="relative px-20 pt-24">
            <p className="text-xl uppercase tracking-[0.35em] text-[#ff7a3d]" style={{ animation: "demo-rise 18s ease-out infinite" }}>
              Kuchnia ognia · Kraków
            </p>
            <p className="mt-6 text-[150px] leading-[0.9] tracking-[-0.03em]" style={{ ...serif, animation: "demo-rise 18s ease-out .15s infinite" }}>
              Dawar
            </p>
            <div className="mt-12 flex items-center gap-8" style={{ animation: "demo-rise 18s ease-out .3s infinite" }}>
              <span className="rounded-full bg-[#ff7a3d] px-9 py-5 text-xl font-semibold text-[#120c08]" style={{ animation: "demo-pulse-ring 1.8s ease-out infinite" }}>
                Zarezerwuj stolik
              </span>
              <span className="text-xl underline decoration-[#ff7a3d] underline-offset-8">Zobacz menu</span>
            </div>
          </div>
        </section>

        {/* EKRAN 2 — MENU */}
        <section className="demo-screen grid grid-cols-[1fr_1fr] gap-16 px-20 pt-24">
          <div>
            <p className="text-xl uppercase tracking-[0.35em] text-[#ff7a3d]">Menu degustacyjne</p>
            <p className="mt-5 text-7xl" style={serif}>
              Sezon jesień
            </p>
            <div className="mt-12 space-y-8 text-2xl">
              {[
                ["Tatar z sarny, jałowiec", "58"],
                ["Pstrąg wędzony na olsze", "64"],
                ["Kaczka z ognia, dynia", "89"],
                ["Szarlotka z ogniska", "32"],
              ].map(([dish, price], index) => (
                <div key={dish} className="flex items-end gap-4" style={{ animation: `demo-rise 18s ease-out ${index * 0.15}s infinite` }}>
                  <span>{dish}</span>
                  <span className="mb-2 flex-1 border-b-2 border-dotted border-[#f3e6d3]/25" />
                  <span className="text-[#ff7a3d]">{price} zł</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              "radial-gradient(circle at 50% 55%, #c77a3f 0 25%, #5b2e12 26% 40%, #1f140d 41%)",
              "radial-gradient(circle at 40% 40%, #9bbd6a 0 14%, #e0b07a 15% 30%, #2a1a10 31%)",
              "radial-gradient(circle at 60% 50%, #ff8a4c 0 10%, #7a3a18 11% 32%, #1a100a 33%)",
              "radial-gradient(circle at 50% 50%, #f1d7a8 0 20%, #8a5a33 21% 34%, #22150d 35%)",
            ].map((background, index) => (
              <div key={index} className="overflow-hidden rounded-3xl">
                <div className="h-full w-full" style={{ background, animation: `demo-kenburns ${10 + index * 2}s ease-in-out infinite` }} />
              </div>
            ))}
          </div>
        </section>

        {/* EKRAN 3 — REZERWACJA */}
        <section className="demo-screen flex flex-col items-center px-20 pt-24 text-center">
          <p className="text-8xl" style={serif}>
            Zarezerwuj <em className="text-[#ff7a3d]">stolik</em>
          </p>
          <p className="mt-6 text-2xl text-[#f3e6d3]/60">Wybierz dzień i godzinę — potwierdzenie SMS w minutę.</p>
          <div className="mt-14 w-[760px] rounded-[32px] border border-[#f3e6d3]/10 bg-[#f3e6d3]/[0.04] p-10">
            <div className="flex justify-between gap-3 text-xl">
              {["Pt 12", "Sob 13", "Nd 14", "Pn 15"].map((day, index) => (
                <span key={day} className={`flex-1 rounded-2xl border py-4 ${index === 1 ? "border-[#ff7a3d] text-[#ff7a3d]" : "border-[#f3e6d3]/10"}`}>
                  {day}
                </span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3 text-xl">
              {["17:00", "18:30", "19:00", "20:30"].map((hour, index) => (
                <span
                  key={hour}
                  className="rounded-2xl border border-[#f3e6d3]/10 py-4"
                  style={{ animation: `demo-select 8s steps(1) ${index * 2}s infinite` }}
                >
                  {hour}
                </span>
              ))}
            </div>
            <span className="mt-8 block rounded-2xl bg-[#ff7a3d] py-6 text-2xl font-semibold text-[#120c08]">Potwierdź rezerwację</span>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================== */
/* 3. PORTFOLIO TWÓRCY                                */
/* ================================================== */

function PortfolioDemo() {
  const tiles = [
    "linear-gradient(160deg,#ff4d2e,#ffb199)",
    "linear-gradient(200deg,#1c1c1c,#5d5d5d)",
    "linear-gradient(140deg,#c9d6ff,#e2e2e2)",
    "linear-gradient(120deg,#ffcf5c,#ff7a59)",
    "linear-gradient(180deg,#2b5876,#4e4376)",
    "linear-gradient(150deg,#d4fc79,#96e6a1)",
  ];

  return (
    <div className="relative h-full overflow-hidden" style={{ background: "#f2efe9", color: "#141414" }}>
      {/* Symulowany kursor */}
      <div className="pointer-events-none absolute left-0 top-0 z-20" style={{ animation: "demo-cursor 9s cubic-bezier(.65,0,.35,1) infinite" }}>
        <span className="grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ff4d2e] text-base font-bold uppercase tracking-widest text-white">
          Zobacz
        </span>
      </div>

      <div className="demo-page">
        {/* EKRAN 1 — MARQUEE */}
        <section className="demo-screen">
          <nav className="flex h-24 items-center justify-between px-20 text-xl">
            <span className="font-bold tracking-tight">KADR®</span>
            <div className="flex gap-10">
              <span>Prace</span>
              <span>Studio</span>
              <span>Kontakt</span>
            </div>
          </nav>
          <div className="mt-24 overflow-hidden">
            <div className="flex w-max whitespace-nowrap text-[210px] font-bold leading-none tracking-[-0.06em]" style={{ animation: "demo-marquee 16s linear infinite" }}>
              <span>Fotografia — Wideo — Kampanie —&nbsp;</span>
              <span>Fotografia — Wideo — Kampanie —&nbsp;</span>
            </div>
          </div>
          <div className="mt-20 flex items-end justify-between px-20">
            <p className="max-w-md text-2xl leading-relaxed">
              Studio produkcyjne dla marek modowych i lifestyle. Warszawa / cały świat.
            </p>
            <span className="text-2xl">(Przewiń ↓)</span>
          </div>
        </section>

        {/* EKRAN 2 — GRID */}
        <section className="demo-screen px-20 pt-16">
          <div className="flex items-end justify-between">
            <p className="text-7xl font-bold tracking-[-0.05em]">Wybrane prace</p>
            <span className="text-2xl">(06)</span>
          </div>
          <div className="mt-12 grid h-[560px] grid-cols-3 grid-rows-2 gap-6">
            {tiles.map((background, index) => (
              <div key={index} className={`relative overflow-hidden rounded-2xl ${index === 0 ? "row-span-2" : ""}`}>
                <div className="h-full w-full" style={{ background, animation: `demo-tile 9s ease-in-out ${index * 1.5}s infinite` }} />
                <span className="absolute bottom-5 left-5 rounded-full bg-white/85 px-4 py-2 text-base font-semibold">
                  {["Lookbook 26", "Kampania run", "Sesja produktowa", "Teledysk", "Editorial", "Reklama TV"][index]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* EKRAN 3 — KONTAKT */}
        <section className="demo-screen flex flex-col justify-center px-20" style={{ background: "#141414", color: "#f2efe9" }}>
          <p className="text-2xl text-[#f2efe9]/50">Masz projekt?</p>
          <p className="relative mt-4 w-fit text-[180px] font-bold leading-none tracking-[-0.06em]">
            Porozmawiajmy
            <span className="absolute -bottom-2 left-0 h-3 w-full origin-left bg-[#ff4d2e]" style={{ animation: "demo-underline 18s ease-out infinite" }} />
          </p>
          <p className="mt-16 text-3xl">hello@studiokadr.pl</p>
        </section>
      </div>
    </div>
  );
}
