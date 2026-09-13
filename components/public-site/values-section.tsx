import { Palette, Target, Users, Zap } from "lucide-react";

import type { Dictionary } from "@/lib/i18n";

import { Reveal, SectionHeader } from "./reveal";
import { Accent } from "./rich-text";
import { SpotlightCard } from "./spotlight-card";

const icons = [Zap, Palette, Users, Target];

export function ValuesSection({ t }: { t: Dictionary["values"] }) {
  return (
    <section aria-labelledby="values-title" className="section">
      <div className="container-site">
        <SectionHeader id="values-title" kicker={t.kicker} title={<Accent text={t.title} />} description={t.description} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map(([title, description], index) => {
            const Icon = icons[index] ?? Zap;

            return (
              <Reveal key={title} delay={index * 0.08} className="h-full">
                <SpotlightCard className="group h-full overflow-hidden p-7 transition-colors duration-500 hover:border-line-strong">
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-xs text-faint transition-colors group-hover:text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-ink/[0.03] text-soft transition-all duration-300 group-hover:border-brand/40 group-hover:bg-brand/15 group-hover:text-brand">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                  </div>

                  <h3 className="relative mt-14 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-soft">{description}</p>

                  <div className="relative mt-8 h-px w-12 bg-line-strong transition-all duration-500 group-hover:w-24 group-hover:bg-brand" />
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
