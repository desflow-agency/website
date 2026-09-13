import { Analytics } from "@/components/public-site/analytics";
import { ConsentBanner } from "@/components/public-site/consent-banner";
import { ContactSection } from "@/components/public-site/contact-section";
import { FaqSection } from "@/components/public-site/faq-section";
import { Footer } from "@/components/public-site/footer";
import { HeroSection } from "@/components/public-site/hero-section";
import { LanguagePrompt } from "@/components/public-site/language-prompt";
import { LocationsSection } from "@/components/public-site/locations-section";
import { MotionProvider } from "@/components/public-site/motion-provider";
import { Navigation } from "@/components/public-site/navigation";
import { PortfolioSection } from "@/components/public-site/portfolio-section";
import { ProcessSection } from "@/components/public-site/process-section";
import { ServicesSection } from "@/components/public-site/services-section";
import { StatsSection } from "@/components/public-site/stats-section";
import { TestimonialsSection } from "@/components/public-site/testimonials-section";
import { ValuesSection } from "@/components/public-site/values-section";
import { WebsitesSection } from "@/components/public-site/websites-section";
import { type Dictionary, getDictionary, type Locale, localizePath } from "@/lib/i18n";

// Wspólny szkielet stron publicznych: nawigacja, treść, stopka, podpowiedź języka.
export function SiteShell({
  locale,
  dict,
  internalPath,
  sectionLinksToHome = false,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  internalPath: string;
  sectionLinksToHome?: boolean;
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <div className="site">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          {dict.common.skipToContent}
        </a>

        <Navigation
          locale={locale}
          internalPath={internalPath}
          sectionLinksToHome={sectionLinksToHome}
          t={{ nav: dict.nav, common: dict.common, theme: dict.theme, language: dict.language }}
        />

        <main id="main">{children}</main>

        <Footer locale={locale} sectionLinksToHome={sectionLinksToHome} t={dict.footer} nav={dict.nav.links} />

        <ConsentBanner t={dict.consent} privacyHref={localizePath(locale, "/privacy")} />
        <LanguagePrompt locale={locale} internalPath={internalPath} />
        <Analytics />
      </div>
    </MotionProvider>
  );
}

export function PublicSite({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <SiteShell locale={locale} dict={dict} internalPath="/">
      <HeroSection t={dict.hero} common={dict.common} demo={dict.saasDemo} />
      <ValuesSection t={dict.values} />
      <ServicesSection t={dict.services} locale={locale} />
      <WebsitesSection t={dict.websites} />
      <PortfolioSection t={dict.portfolio} />
      <StatsSection t={dict.stats} />
      <TestimonialsSection t={dict.testimonials} />
      <ProcessSection t={dict.process} />
      <FaqSection t={dict.faq} />
      <LocationsSection t={dict.locations} />
      <ContactSection t={dict.contact} locale={locale} />
    </SiteShell>
  );
}
