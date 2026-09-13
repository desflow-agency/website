import { ArrowUpRight, BriefcaseBusiness, Eye, Smile, Sparkles } from "lucide-react";

import type { Dictionary } from "@/lib/i18n";

import { Reveal } from "./reveal";

const stats = [
  { value: "250+", icon: BriefcaseBusiness },
  { value: "95%", icon: Smile },
  { value: "10+", icon: Sparkles },
  { value: "4M+", icon: Eye },
];

export function StatsSection({ t }: { t: Dictionary["stats"] }) {
  return (
    <section aria-labelledby="stats-title" className="container-site py-8 md:py-12">
      <Reveal>
        <div className="noise relative overflow-hidden rounded-[32px] border border-line-strong bg-panel p-6 md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-40 h-96 w-96 rounded-full bg-brand-strong/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-mint/15 blur-[120px]" />
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />

          <div className="relative flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="kicker">{t.kicker}</p>
              <h2 id="stats-title" className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                {t.title}
              </h2>
            </div>
            <a href="#contact" className="btn-site btn-site-ghost h-11 text-sm">
              {t.cta} <ArrowUpRight size={16} />
            </a>
          </div>

          <dl className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, icon: Icon }, index) => (
              <div
                key={value}
                className="flex flex-col rounded-2xl border border-line bg-ink/[0.02] p-6 transition-colors hover:bg-ink/[0.04]"
              >
                <Icon size={18} strokeWidth={1.7} className="text-brand" aria-hidden="true" />
                <dt className="order-2 mt-2 text-sm text-soft">{t.items[index]}</dt>
                <dd className="order-1 mt-10 text-5xl font-semibold tracking-[-0.05em] text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
