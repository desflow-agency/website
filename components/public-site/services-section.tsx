import { ArrowUpRight, Code2, Play, Sparkles, Target, type LucideIcon } from "lucide-react";

import type { Dictionary, Locale } from "@/lib/i18n";
import { finalPrice, money, moneyRange, services } from "@/lib/utils";

import { Reveal, SectionHeader } from "./reveal";
import { Accent } from "./rich-text";
import { SpotlightCard } from "./spotlight-card";

const icons: Record<string, LucideIcon> = {
  Sparkles,
  Play,
  Target,
  Code2,
};

export function ServicesSection({ t, locale }: { t: Dictionary["services"]; locale: Locale }) {
  return (
    <section id="offer" aria-labelledby="offer-title" className="section border-t border-line">
      <div className="container-site">
        <SectionHeader id="offer-title" kicker={t.kicker} title={<Accent text={t.title} />} description={t.description} />

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map(([, , price, icon, discount, maxPrice], index) => {
            const Icon = icons[icon] || Sparkles;
            const [title, description] = t.items[index] ?? ["", ""];

            return (
              <Reveal key={icon} delay={index * 0.08} className="h-full">
                <SpotlightCard className="group flex h-full flex-col p-7 transition-colors duration-500 hover:border-line-strong">
                  <div className="relative flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-brand/25 to-mint/10 text-brand ring-1 ring-brand/20">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>

                    {discount > 0 && (
                      <span className="rounded-full bg-mint/10 px-3 py-1 font-mono text-xs font-medium text-mint ring-1 ring-mint/25">
                        −{discount}%
                      </span>
                    )}
                  </div>

                  <h3 className="relative mt-8 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="relative mt-3 flex-1 text-sm leading-6 text-soft">{description}</p>

                  <div className="relative mt-8 flex items-end justify-between border-t border-line pt-6">
                    <div>
                      <p className="text-xs text-faint">{price && !maxPrice ? t.from : t.price}</p>
                      {price && maxPrice ? (
                        <p className="mt-0.5 text-2xl font-semibold tracking-tight">{moneyRange(price, maxPrice, locale)}</p>
                      ) : price ? (
                        <p className="mt-0.5 flex items-baseline gap-2 text-2xl font-semibold tracking-tight">
                          {money(finalPrice(price, discount), locale)}
                          {discount > 0 && (
                            <span className="text-sm font-normal text-faint line-through">{money(price, locale)}</span>
                          )}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-lg font-semibold tracking-tight">{t.custom}</p>
                      )}
                    </div>

                    <a
                      href="#contact"
                      aria-label={`${t.askAria} ${title}`}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg transition-all duration-300 group-hover:border-fg group-hover:bg-fg group-hover:text-canvas"
                    >
                      <ArrowUpRight size={18} />
                    </a>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
