import { notFound } from "next/navigation";

import { PublicSite } from "@/components/public-site";
import { getDictionary, hasLocale, localeMeta, localizePath } from "@/lib/i18n";
import { locations, siteConfig } from "@/lib/site";
import { finalPrice, services } from "@/lib/utils";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const pageUrl = `${siteConfig.url}${localizePath(locale, "/") === "/" ? "" : localizePath(locale, "/")}`;

  // Dane strukturalne dla Google (firma, usługi, obszar działania, FAQ) — w języku strony.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: ["desflow.pl", "Desflow"],
        inLanguage: ["pl-PL", "en-GB", "de-DE"],
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: pageUrl,
        logo: `${siteConfig.url}/dfblack.png`,
        email: siteConfig.email,
        description: dict.meta.description,
        knowsLanguage: ["pl", "en", "de"],
        areaServed: [
          { "@type": "Country", name: dict.meta.country },
          ...locations.map((location) => ({ "@type": "City", name: location.name })),
        ],
        sameAs: Object.values(siteConfig.socials),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: dict.meta.offerCatalog,
          itemListElement: services.map(([, , price, , discount, maxPrice], index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: dict.services.items[index]?.[0],
              description: dict.services.items[index]?.[1],
            },
            ...(price
              ? {
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    minPrice: finalPrice(price, discount),
                    ...(maxPrice ? { maxPrice } : {}),
                    priceCurrency: "PLN",
                  },
                }
              : {}),
          })),
        },
      },
      {
        "@type": "FAQPage",
        inLanguage: localeMeta[locale].htmlLang,
        mainEntity: dict.faq.items.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PublicSite locale={locale} />
    </>
  );
}
