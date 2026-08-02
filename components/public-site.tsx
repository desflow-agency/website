"use client";

import { useState } from "react";
import { ContactSection } from "@/components/public-site/contact-section";
import { FaqSection } from "@/components/public-site/faq-section";
import { Footer } from "@/components/public-site/footer";
import { HeroSection } from "@/components/public-site/hero-section";
import { Navigation } from "@/components/public-site/navigation";
import { PortfolioSection } from "@/components/public-site/portfolio-section";
import { ProcessSection } from "@/components/public-site/process-section";
import { ServicesSection } from "@/components/public-site/services-section";
import { StatsSection } from "@/components/public-site/stats-section";
import { TestimonialsSection } from "@/components/public-site/testimonials-section";
import { ValuesSection } from "@/components/public-site/values-section";

export function PublicSite() {
  const [lightboxMedia, setLightboxMedia] = useState<string>();

  const isVideo = (url: string) =>
    /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);

  return (
    <>
      <Navigation />

      <main id="home">
        <HeroSection />
        <ValuesSection />
        <ServicesSection />
        <PortfolioSection onImageClick={setLightboxMedia} />
        <StatsSection />
        <TestimonialsSection />
        <ProcessSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />

      {lightboxMedia && (
        <button
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6"
          aria-label="Zamknij podgląd"
          onClick={() => setLightboxMedia(undefined)}
        >
          {isVideo(lightboxMedia) ? (
            <video
              src={lightboxMedia}
              controls
              autoPlay
              playsInline
              className="max-h-[90vh] w-auto max-w-md sm:max-w-lg md:max-w-xl rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={lightboxMedia}
              alt="Powiększony projekt"
              className="max-h-[90vh] max-w-[90vw] h-auto w-auto rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </button>
      )}
    </>
  );
}