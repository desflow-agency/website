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
  const [lightboxImage, setLightboxImage] = useState<string>();

  return (
    <>
      <Navigation />
      <main id="home">
        <HeroSection />
        <ValuesSection />
        <ServicesSection />
        <PortfolioSection onImageClick={setLightboxImage} />
        <StatsSection />
        <TestimonialsSection />
        <ProcessSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      {lightboxImage && (
        <button
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6"
          aria-label="Zamknij powiększony projekt"
          onClick={() => setLightboxImage(undefined)}
        >
          <img
            src={lightboxImage}
            className="max-h-full max-w-full rounded-xl"
            alt="Powiększony projekt"
          />
        </button>
      )}
    </>
  );
}
