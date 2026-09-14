import { ChevronRight } from "lucide-react";

import { SiteShell } from "@/components/public-site";
import { getDictionary, type Locale, localizePath } from "@/lib/i18n";
import { type SectionPage, sectionPages, siteConfig } from "@/lib/site";

import { ContactSection } from "./contact-section";
import { FaqSection } from "./faq-section";
import { LocationsSection } from "./locations-section";
import { PortfolioSection } from "./portfolio-section";
import { ProcessSection } from "./process-section";
import { Accent } from "./rich-text";
import { ServicesSection } from "./services-section";
import { StatsSection } from "./stats-section";
import { TestimonialsSection } from "./testimonials-section";
import { WebsitesSection } from "./websites-section";

/*
 * Podstrona sekcji (np. /oferta): nagłówek z H1 i okruszkami, sekcja ze strony głównej,
 * sekcje uzupełniające i formularz kontaktowy. Każda ma własny tytuł i opis dla Google.
 */
export function SectionPageView({ locale, section }: { locale: Locale; section: SectionPage }) {
  const dict = getDictionary(locale);
  const page = dict.pages.items[section];
  const home = localizePath(locale, "/");
  const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;
  const pageUrl = url(localizePath(locale, `/${section}`));

  const blocks: Record<SectionPage, React.ReactNode> = {
    offer: (
      <>
        <ServicesSection t={dict.services} locale={locale} />
        <ProcessSection t={dict.process} />
        <TestimonialsSection t={dict.testimonials} />
      </>
    ),
    websites: (
      <>
        <WebsitesSection t={dict.websites} />
        <StatsSection t={dict.stats} />
        <ProcessSection t={dict.process} />
      </>
    ),
    portfolio: (
      <>
        <PortfolioSection t={dict.portfolio} />
        <TestimonialsSection t={dict.testimonials} />
      </>
    ),
    reviews: (
      <>
        <TestimonialsSection t={dict.testimonials} />
        <StatsSection t={dict.stats} />
      </>
    ),
    faq: <FaqSection t={dict.faq} />,
    locations: <LocationsSection t={dict.locations} />,
    contact: (
      <>
        <ContactSection t={dict.contact} locale={locale} />
        <LocationsSection t={dict.locations} />
      </>
    ),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.metaTitle,
        description: page.metaDescription,
        inLanguage: locale,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#organization` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dict.pages.home, item: url(home) },
          { "@type": "ListItem", position: 2, name: page.label, item: pageUrl },
        ],
      },
    ],
  };

  const related = sectionPages.filter((other) => other !== section);

  return (
    <SiteShell locale={locale} dict={dict} internalPath={`/${section}`} sectionLinksToHome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="noise relative overflow-hidden pb-6 pt-36 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="grid-lines absolute inset-0 opacity-70" />
          <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-strong/20 blur-[140px]" />
        </div>

        <div className="container-site">
          <nav aria-label={dict.pages.breadcrumbAria}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-faint">
              <li>
                <a href={home} className="transition hover:text-fg">
                  {dict.pages.home}
                </a>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li aria-current="page" className="text-soft">
                {page.label}
              </li>
            </ol>
          </nav>

          <h1 className="title-xl mt-8 max-w-4xl text-balance">
            <Accent text={page.title} />
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-soft md:text-lg">{page.lead}</p>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">{dict.pages.related}</span>
            {related.map((other) => (
              <a
                key={other}
                href={localizePath(locale, `/${other}`)}
                className="rounded-full border border-line bg-ink/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-soft transition hover:border-line-strong hover:text-fg"
              >
                {dict.pages.items[other].label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="subpage-sections">
        {blocks[section]}
        {section !== "contact" && <ContactSection t={dict.contact} locale={locale} />}
      </div>
    </SiteShell>
  );
}
