import type { Dictionary } from "@/lib/i18n";

import { Reveal, SectionHeader } from "./reveal";
import { Accent } from "./rich-text";

export function ProcessSection({ t }: { t: Dictionary["process"] }) {
  return (
    <section aria-labelledby="process-title" className="section border-t border-line">
      <div className="container-site">
        <SectionHeader id="process-title" kicker={t.kicker} title={<Accent text={t.title} />} />

        <div className="relative mt-14">
          <span className="pointer-events-none absolute left-0 right-0 top-[27px] hidden h-px bg-linear-to-r from-brand/60 via-line-strong to-transparent md:block" />

          <ol className="relative grid gap-6 md:grid-cols-5 md:gap-0">
            {t.steps.map(([title, description], index) => (
              <Reveal as="li" key={title} delay={index * 0.08} className="flex gap-5 md:block md:pr-6">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line-strong bg-canvas font-mono text-sm text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight md:mt-6">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-soft">{description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
