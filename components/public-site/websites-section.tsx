"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Gauge,
  Maximize2,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Dictionary } from "@/lib/i18n";

import { BrowserFrame } from "./browser-frame";
import { SectionHeader } from "./reveal";
import { Gradient } from "./rich-text";
import { type DemoKind, SiteDemo } from "./site-demos";
import { useInView, usePrefersReducedMotion } from "./use-in-view";

/*
 * JAK DODAĆ PRAWDZIWĄ REALIZACJĘ
 * ─────────────────────────────
 * media.kind:
 *  - "video"  → nagranie ekranu (najlepsze do pokazania animacji): 8–15 s, 1280×800,
 *               bez dźwięku, zapętlone. Pliki w /public/websites: .webm (VP9/AV1) + .mp4 (H.264)
 *               + poster .webp (pierwsza klatka). Odtwarzane dopiero, gdy są na ekranie.
 *  - "scroll" → długi zrzut całej strony (.webp, szerokość 1280 px) — "przewija się" sam.
 *  - "demo"   → koncept renderowany w kodzie (components/public-site/site-demos.tsx).
 *
 * Nagranie zrobisz poleceniem: npm run record -- https://klient.pl --name klient
 *
 * url      → link "Odwiedź stronę".
 * embed    → true tylko, gdy strona pozwala na osadzenie (brak X-Frame-Options: DENY/SAMEORIGIN).
 *            Wtedy pełny podgląd ładuje stronę na żywo z przełącznikiem komputer / telefon.
 * duration → jak długo (ms) projekt jest pokazywany przed przejściem do kolejnego.
 */

type ShowcaseMedia =
  | { kind: "demo"; demo: DemoKind }
  | { kind: "video"; mp4: string; webm?: string; poster: string }
  | { kind: "scroll"; image: string };

type WebsitesText = Dictionary["websites"];
type ShowcaseId = keyof WebsitesText["items"];

type Showcase = {
  id: ShowcaseId;
  title: string;
  address: string;
  url?: string;
  embed?: boolean;
  duration?: number;
  concept?: boolean;
  media: ShowcaseMedia;
};

const showcases: Showcase[] = [
  {
    id: "hypecube",
    title: "HypeCube",
    address: "hypecube.net",
    url: "https://www.hypecube.net",
    embed: true,
    duration: 20000,
    media: {
      kind: "video",
      webm: "/websites/www-hypecube-net.webm",
      mp4: "/websites/www-hypecube-net.mp4",
      poster: "/websites/www-hypecube-net.webp",
    },
  },
  {
    id: "advicebot",
    title: "AdviceBot",
    address: "advicebot.info",
    url: "https://advicebot.info",
    duration: 20000,
    media: {
      kind: "video",
      webm: "/websites/advicebot-info.webm",
      mp4: "/websites/advicebot-info.mp4",
      poster: "/websites/advicebot-info.webp",
    },
  },
  {
    id: "dawar",
    title: "Dawar Żary",
    address: "dawar-zary.pl",
    url: "https://dawar-zary.pl",
    duration: 20000,
    media: {
      kind: "video",
      webm: "/websites/dawar-zary-pl.webm",
      mp4: "/websites/dawar-zary-pl.mp4",
      poster: "/websites/dawar-zary-pl.webp",
    },
  },
];

const AUTOPLAY_MS = 9000;

const highlightIcons = [Sparkles, Gauge, Search];

export function WebsitesSection({ t }: { t: WebsitesText }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState<Showcase | null>(null);
  const [sectionRef, inView] = useInView<HTMLElement>();
  const reducedMotion = usePrefersReducedMotion();

  const active = showcases[activeIndex];
  const autoplay = !reducedMotion && !preview;
  const paused = hovered || !inView;

  const next = () => setActiveIndex((index) => (index + 1) % showcases.length);

  return (
    <section
      ref={sectionRef}
      id="websites"
      aria-labelledby="websites-title"
      className="section relative border-t border-line"
    >
      <div className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-strong/15 blur-[140px]" />

      <div className="container-site">
        <SectionHeader
          id="websites-title"
          kicker={t.kicker}
          title={
            <>
              <Gradient text={t.titleLine1} />
              <br className="hidden sm:block" /> {t.titleLine2}
            </>
          }
          description={t.description}
        />

        <div
          className="mt-14 grid gap-6 lg:grid-cols-[340px_1fr] lg:gap-10"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* LISTA PROJEKTÓW */}
          <div
            role="tablist"
            aria-label={t.tablistAria}
            className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {showcases.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`showcase-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls="showcase-panel"
                  onClick={() => setActiveIndex(index)}
                  className={`group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-300 sm:w-[46%] lg:w-full ${
                    isActive
                      ? "border-line-strong bg-ink/[0.05]"
                      : "cursor-pointer border-line bg-transparent hover:bg-ink/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.concept && (
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
                        {t.concept}
                      </span>
                    )}
                  </div>

                  <p className={`mt-4 text-lg font-semibold tracking-tight ${isActive ? "text-fg" : "text-soft group-hover:text-fg"}`}>
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-faint">{t.items[item.id].type}</p>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden overflow-hidden text-sm leading-6 text-soft lg:block"
                      >
                        <span className="block pt-3">{t.items[item.id].description}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* PASEK POSTĘPU AUTOPLAY */}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink/[0.04]">
                    {isActive && (
                      <span
                        key={`${activeIndex}-${autoplay}`}
                        className="absolute inset-0 origin-left bg-linear-to-r from-brand to-mint"
                        style={
                          autoplay
                            ? {
                                animation: `demo-progress ${item.duration ?? AUTOPLAY_MS}ms linear forwards`,
                                animationPlayState: paused ? "paused" : "running",
                              }
                            : undefined
                        }
                        onAnimationEnd={(event) => {
                          if (event.animationName === "demo-progress") next();
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* PODGLĄD */}
          <div
            id="showcase-panel"
            role="tabpanel"
            aria-labelledby={`showcase-tab-${active.id}`}
            className="min-w-0"
          >
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-linear-to-br from-brand/20 via-transparent to-mint/10 blur-2xl" />

              <BrowserFrame address={active.address}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ShowcaseMediaView item={active} t={t} />
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setPreview(active)}
                  aria-label={`${t.openPreviewAria} ${active.title}`}
                  className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/80"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">{t.fullPreview}</span>
                </button>
              </BrowserFrame>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {t.items[active.id].tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line bg-ink/[0.02] px-3 py-1.5 text-xs text-soft">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-5">
                {active.url && (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-soft transition-colors hover:text-fg"
                  >
                    {t.visit} {active.address}
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                <a href="#contact" className="group inline-flex items-center gap-2 text-sm font-semibold text-fg">
                  {t.wantThis}
                  <ArrowUpRight size={16} className="text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-soft lg:hidden">{t.items[active.id].description}</p>
          </div>
        </div>

        {/* ATUTY */}
        <ul className="mt-16 grid gap-3 sm:grid-cols-3">
          {t.highlights.map(([title, text], index) => ({ title, text, Icon: highlightIcons[index] ?? Sparkles })).map(({ Icon, title, text }) => (
            <li key={title} className="surface flex gap-4 rounded-2xl p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {preview && <PreviewModal item={preview} t={t} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ShowcaseMediaView({ item, t }: { item: Showcase; t: WebsitesText }) {
  const { media } = item;

  if (media.kind === "demo") {
    return <SiteDemo kind={media.demo} />;
  }

  if (media.kind === "video") {
    return <ShowcaseVideo media={media} label={`${t.videoAria} ${item.title}`} />;
  }

  return <ScrollingScreenshot image={media.image} alt={`${t.screenshotAlt} ${item.title}`} />;
}

function ShowcaseVideo({
  media,
  label,
}: {
  media: Extract<ShowcaseMedia, { kind: "video" }>;
  label: string;
}) {
  const [ref, inView] = useInView<HTMLVideoElement>("200px");

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, ref]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={media.poster}
      aria-label={label}
      className="block aspect-[16/10] w-full object-cover object-top"
    >
      {media.webm && <source src={media.webm} type="video/webm" />}
      <source src={media.mp4} type="video/mp4" />
    </video>
  );
}

function ScrollingScreenshot({ image, alt }: { image: string; alt: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("100px");

  return (
    <div ref={ref} data-paused={!inView} className="aspect-[16/10] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="demo-scroll-image h-full w-full"
      />
    </div>
  );
}

function PreviewModal({ item, t, onClose }: { item: Showcase; t: WebsitesText; onClose: () => void }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.previewAria}: ${item.title}`}
      className="fixed inset-0 z-[300] flex flex-col bg-black/85 p-3 backdrop-blur-xl sm:p-6"
      onClick={onClose}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 pb-3 text-white" onClick={(event) => event.stopPropagation()}>
        <div className="min-w-0">
          <p className="truncate font-semibold">{item.title}</p>
          <p className="truncate text-xs text-soft">{t.items[item.id].type}</p>
        </div>

        <div className="flex items-center gap-2">
          {item.url && item.embed && (
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              {(["desktop", "mobile"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDevice(option)}
                  aria-pressed={device === option}
                  aria-label={option === "desktop" ? t.desktopView : t.mobileView}
                  className={`grid h-8 w-9 cursor-pointer place-items-center rounded-full transition ${device === option ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                >
                  {option === "desktop" ? <Monitor size={15} /> : <Smartphone size={15} />}
                </button>
              ))}
            </div>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener"
              className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium transition hover:bg-white/10"
            >
              <span className="hidden sm:inline">{t.openSite}</span>
              <ArrowUpRight size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closePreview}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        {item.url && item.embed ? (
          <BrowserFrame
            address={item.address}
            className={`h-full transition-[max-width] duration-500 ${device === "mobile" ? "w-full max-w-[400px]" : "w-full max-w-6xl"}`}
          >
            <iframe
              src={item.url}
              title={`${item.title} — ${t.liveTitle}`}
              loading="lazy"
              className="h-[calc(100dvh-140px)] w-full bg-white"
            />
          </BrowserFrame>
        ) : (
          <div style={{ width: "min(100%, calc((100dvh - 150px) * 1.6))" }}>
            <BrowserFrame address={item.address}>
              <ShowcaseMediaView item={item} t={t} />
            </BrowserFrame>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
