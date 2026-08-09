"use client";

import { useEffect, useState } from "react";
import { X, Maximize2, Play } from "lucide-react";

import { ContactSection } from "@/components/public-site/contact-section";
import { FaqSection } from "@/components/public-site/faq-section";
import { Footer } from "@/components/public-site/footer";
import { HeroSection } from "@/components/public-site/hero-section";
import { Navigation } from "@/components/public-site/navigation";
import {
  PortfolioProject,
  PortfolioSection,
} from "@/components/public-site/portfolio-section";
import { ProcessSection } from "@/components/public-site/process-section";
import { ServicesSection } from "@/components/public-site/services-section";
import { StatsSection } from "@/components/public-site/stats-section";
import { TestimonialsSection } from "@/components/public-site/testimonials-section";
import { ValuesSection } from "@/components/public-site/values-section";

export function PublicSite() {
  const [lightboxProject, setLightboxProject] =
    useState<PortfolioProject | null>(null);

  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [lightboxTotal, setLightboxTotal] = useState(0);

  const isVideo = (url: string) => {
    return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
  };

  /*
   * OTWIERANIE PODGLĄDU
   */

  const openLightbox = (
    project: PortfolioProject,
    index: number,
    total: number
  ) => {
    setLightboxProject(project);
    setLightboxIndex(index);
    setLightboxTotal(total);
  };

  /*
   * ZAMYKANIE PODGLĄDU
   */

  const closeLightbox = () => {
    setLightboxProject(null);
  };

  /*
   * ESC + BLOKADA SCROLLA
   */

  useEffect(() => {
    if (!lightboxProject) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxProject]);

  return (
    <>
      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <Navigation />

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <main id="home">
        <HeroSection />

        <ValuesSection />

        <ServicesSection />

        <PortfolioSection onImageClick={openLightbox} />

        <StatsSection />

        <TestimonialsSection />

        <ProcessSection />

        <FaqSection />

        <ContactSection />
      </main>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <Footer />

      {/* ================================================== */}
      {/* LIGHTBOX */}
      {/* ================================================== */}

      {lightboxProject && (
        <div
          className="
            fixed
            inset-0
            z-9999
            flex
            h-dvh
            w-full
            items-center
            justify-center
            overflow-hidden
            bg-black/90
            p-4
            backdrop-blur-xl
            sm:p-8
          "
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Podgląd projektu ${lightboxProject.title}`}
        >
          {/* ================================================== */}
          {/* BACKGROUND GLOW */}
          {/* ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[50vh]
              w-[70vw]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-purple-600/10
              blur-[120px]
            "
          />

          {/* ================================================== */}
          {/* GŁÓWNY PANEL */}
          {/* ================================================== */}

          <div
            className="
              relative
              flex
              max-h-[94dvh]
              w-full
              max-w-6xl
              flex-col
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#0b0b0d]/95
              shadow-[0_30px_100px_rgba(0,0,0,0.7)]
              animate-in
              fade-in
              zoom-in-95
              duration-300
              sm:rounded-[32px]
            "
            onClick={(event) => event.stopPropagation()}
          >
            {/* ================================================== */}
            {/* TOP BAR */}
            {/* ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-white/10
                px-4
                py-3
                sm:px-6
                sm:py-4
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                {/* NUMER */}

                <div
                  className="
                    hidden
                    h-9
                    min-w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white/5
                    px-2
                    text-xs
                    font-semibold
                    text-white/50
                    sm:flex
                  "
                >
                  {String(lightboxIndex + 1).padStart(2, "0")}
                </div>

                {/* NAZWA */}

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                    {lightboxProject.title}
                  </h3>

                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-400 sm:text-xs">
                      {lightboxProject.category}
                    </span>

                    <span className="text-white/20">•</span>

                    <span className="text-[10px] text-white/40 sm:text-xs">
                      {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                      {String(lightboxTotal).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              {/* X */}

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Zamknij podgląd"
                className="
                  ml-3
                  flex
                  h-10
                  w-10
                  shrink-0
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white/70
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:border-white/20
                  hover:bg-white/10
                  hover:text-white
                  active:scale-90
                  sm:h-11
                  sm:w-11
                "
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* ================================================== */}
            {/* MEDIA AREA */}
            {/* ================================================== */}

            <div
              className="
                relative
                flex
                min-h-0
                flex-1
                items-center
                justify-center
                overflow-hidden
                bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_55%)]
                p-3
                sm:p-6
                md:p-8
              "
            >
              {/* Dekoracyjna ramka */}

              <div className="pointer-events-none absolute inset-3 rounded-2xl border border-white/3 sm:inset-6 md:inset-8" />

              {/* VIDEO */}

              {isVideo(lightboxProject.media) ? (
                <div className="relative flex max-h-full max-w-full items-center justify-center">
                  <video
                    src={lightboxProject.media}
                    controls
                    autoPlay
                    playsInline
                    className="
                      max-h-[calc(94dvh-130px)]
                      max-w-full
                      rounded-xl
                      object-contain
                      shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                      sm:rounded-2xl
                    "
                    onClick={(event) => event.stopPropagation()}
                  />

                  {/* Ikona video */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-4
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-black/50
                      text-white/80
                      backdrop-blur-md
                    "
                  >
                    <Play size={15} fill="currentColor" />
                  </div>
                </div>
              ) : (
                /* IMAGE */

                <div className="relative flex max-h-full max-w-full items-center justify-center">
                  <img
                    src={lightboxProject.media}
                    alt={lightboxProject.title}
                    className="
                      max-h-[calc(94dvh-130px)]
                      max-w-full
                      rounded-xl
                      object-contain
                      shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                      sm:rounded-2xl
                    "
                    onClick={(event) => event.stopPropagation()}
                  />

                  {/* Ikona powiększenia */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-3
                      right-3
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-black/50
                      text-white/70
                      backdrop-blur-md
                    "
                  >
                    <Maximize2 size={15} />
                  </div>
                </div>
              )}
            </div>

            {/* ================================================== */}
            {/* BOTTOM BAR */}
            {/* ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-t
                border-white/10
                px-4
                py-3
                sm:px-6
                sm:py-4
              "
            >
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="hidden sm:inline">
                  Kliknij poza podglądem, aby zamknąć
                </span>

                <span className="sm:hidden">
                  Dotknij poza projektem, aby zamknąć
                </span>
              </div>

              <div className="hidden items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 sm:flex">
                ESC
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}