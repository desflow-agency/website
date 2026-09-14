"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Dictionary } from "@/lib/i18n";
import { isVideo, portfolioFilters as filters, type Project, projects } from "@/lib/portfolio";

import { CompareSlider, CompareThumb } from "./before-after";
import { SectionHeader } from "./reveal";
import { Accent } from "./rich-text";
import { useInView } from "./use-in-view";

type PortfolioText = Dictionary["portfolio"];

const altText = (project: Project, t: PortfolioText) =>
  `${project.title} — ${t.categories[project.category].toLowerCase()}, ${t.altSuffix}`;

export function PortfolioSection({ t }: { t: PortfolioText }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter]
  );

  // Kursor "Zobacz" przesuwany bezpośrednio przez styl — bez re-renderu całej siatki.
  const moveCursor = (event: React.PointerEvent) => {
    const cursor = cursorRef.current;
    if (!cursor || event.pointerType !== "mouse") return;
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.style.opacity = "1";
  };

  const hideCursor = () => {
    if (cursorRef.current) cursorRef.current.style.opacity = "0";
  };

  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="section border-t border-line">
      <div className="container-site">
        <SectionHeader
          id="portfolio-title"
          kicker={t.kicker}
          title={<Accent text={t.title} />}
          description={t.description}
        />

        {/* FILTRY */}
        <div role="group" aria-label={t.filterAria} className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            const count = filter === "all" ? projects.length : projects.filter((project) => project.category === filter).length;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFilter(filter)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "border-fg bg-fg text-canvas"
                    : "border-line-strong bg-ink/[0.02] text-soft hover:border-ink/25 hover:text-fg"
                }`}
              >
                {filter === "all" ? t.all : t.categories[filter]}
                <span className={`font-mono text-[11px] ${active ? "text-canvas/60" : "text-faint"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* SIATKA (masonry) */}
        <ul key={activeFilter} className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filtered.map((project, index) => (
              <motion.li
                key={project.media}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
                className="mb-4 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  onPointerMove={moveCursor}
                  onPointerLeave={hideCursor}
                  aria-label={`${t.openAria} ${project.title}`}
                  className="group relative block w-full overflow-hidden rounded-3xl border border-line bg-raised text-left md:cursor-none"
                >
                  <PortfolioMedia project={project} t={t} />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-5 pt-16 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-brand">
                      {t.categories[project.category]}
                    </span>
                    <h3 className="mt-1.5 text-lg font-semibold text-white">{project.title}</h3>
                  </div>

                  {isVideo(project.media) && (
                    <span className="pointer-events-none absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md">
                      <Play size={12} className="fill-current" />
                    </span>
                  )}

                  {!project.compare && (
                    <span className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md md:hidden">
                      <ArrowUpRight size={16} />
                    </span>
                  )}
                </button>
              </motion.li>
            ))}
        </ul>
      </div>

      {/* KURSOR — DESKTOP */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden opacity-0 transition-opacity duration-150 md:block"
      >
        <span className="flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-white text-[10px] font-bold uppercase tracking-wider text-black shadow-[0_8px_30px_rgba(139,140,255,0.5)]">
          {t.cursor}
          <ArrowUpRight size={11} strokeWidth={2.5} />
        </span>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            projects={filtered}
            t={t}
            index={lightboxIndex}
            onChange={setLightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function PortfolioMedia({ project, t }: { project: Project; t: PortfolioText }) {
  const [ref, inView] = useInView<HTMLVideoElement>("150px");

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, ref]);

  if (project.compare) {
    return (
      <CompareThumb
        {...project.compare}
        width={project.width}
        height={project.height}
        labels={{ before: t.before, after: t.after }}
        alt={altText(project, t)}
      />
    );
  }

  if (isVideo(project.media)) {
    return (
      <video
        ref={ref}
        src={project.media}
        muted
        loop
        playsInline
        preload="none"
        aria-label={altText(project, t)}
        className="block aspect-[9/16] max-h-[640px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <Image
      src={project.media}
      alt={altText(project, t)}
      width={project.width}
      height={project.height}
      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
      className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}

function Lightbox({
  projects: items,
  t,
  index,
  onChange,
  onClose,
}: {
  projects: Project[];
  t: PortfolioText;
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const project = items[index];
  const total = items.length;

  const go = useCallback(
    (direction: 1 | -1) => onChange((index + direction + total) % total),
    [index, total, onChange]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // Strzałki w suwaku przed / po przesuwają suwak, a nie zmieniają projektu.
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [go, onClose]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.dialogAria}: ${project.title}`}
      onClick={onClose}
      className="fixed inset-0 z-[300] flex flex-col bg-black/90 p-3 backdrop-blur-xl sm:p-6"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 pb-3" onClick={(event) => event.stopPropagation()}>
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{project.title}</p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-soft">
            {t.categories[project.category]} · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t.closePreview}
          className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.media}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="flex h-full max-h-full w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {project.compare ? (
              <CompareSlider
                {...project.compare}
                width={project.width}
                height={project.height}
                labels={{ before: t.before, after: t.after }}
                alt={altText(project, t)}
                hint={t.compareHint}
                ariaLabel={t.compareAria}
              />
            ) : isVideo(project.media) ? (
              <video
                src={project.media}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <Image
                src={project.media}
                alt={altText(project, t)}
                width={project.width}
                height={project.height}
                sizes="100vw"
                className="h-auto max-h-full w-auto max-w-full rounded-2xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label={t.prev}
              onClick={(event) => {
                event.stopPropagation();
                go(-1);
              }}
              className="absolute left-0 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur transition hover:bg-white/15 sm:-left-2"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label={t.next}
              onClick={(event) => {
                event.stopPropagation();
                go(1);
              }}
              className="absolute right-0 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur transition hover:bg-white/15 sm:-right-2"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
