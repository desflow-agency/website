import { Quote, Star } from "lucide-react";

import type { Dictionary } from "@/lib/i18n";

import { Reveal, SectionHeader } from "./reveal";
import { Accent } from "./rich-text";
import { SpotlightCard } from "./spotlight-card";

// Kolejność jak w słownikach (testimonials.items). Pierwsze dwie opinie są wyróżnione (szersze karty).
const authors = ["Przemysław R.", "HypeCube", "Jakub B.", "Michał Sz.", "Daniel Pawlak"];
const FEATURED = 2;

export function TestimonialsSection({ t }: { t: Dictionary["testimonials"] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section">
      <div className="container-site">
        <SectionHeader id="reviews-title" kicker={t.kicker} title={<Accent text={t.title} />} description={t.description} />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {authors.map((name, index) => {
            const [role, text] = t.items[index] ?? ["", ""];

            return (
              <Reveal key={name} delay={index * 0.08} className={index < FEATURED ? "h-full md:col-span-3" : "h-full md:col-span-2"}>
                <SpotlightCard className="group flex h-full flex-col p-7 transition-colors duration-500 hover:border-line-strong">
                  <figure className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-amber" aria-label={t.ratingAria}>
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star key={starIndex} size={14} className="fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <Quote size={22} className="text-ink/10 transition-colors group-hover:text-brand/50" aria-hidden="true" />
                    </div>

                    <blockquote
                      className={`mt-8 flex-1 leading-7 tracking-[-0.01em] text-fg/90 ${index < FEATURED ? "text-lg md:text-[19px] md:leading-8" : "text-[17px]"}`}
                    >„{text}”</blockquote>

                    <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-6">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-strong to-mint/70 text-xs font-bold text-white">
                        {name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{name}</span>
                        <span className="mt-0.5 block truncate text-xs text-soft">{role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
