import { ArrowUpRight, BriefcaseBusiness, Eye, Smile, Sparkles } from "lucide-react";

const stats = [
  { value: "250+", label: "zrealizowanych projektów", icon: BriefcaseBusiness },
  { value: "95%", label: "zadowolonych klientów", icon: Smile },
  { value: "10+", label: "obsługiwanych marek", icon: Sparkles },
  { value: "4M+", label: "wyświetleń treści", icon: Eye },
];

export function StatsSection() {
  return (
    <section className="shell py-16 md:py-24">
      <div className="stats-panel overflow-hidden rounded-4xl p-6 md:p-10">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aaa9ff]">W liczbach</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tighter text-white md:text-4xl">Kreatywność, która zostawia ślad.</h2>
          </div>
          <a className="stats-link" href="#kontakt">Zacznij projekt <ArrowUpRight size={17} /></a>
        </div>
        <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <article className="stats-card" key={label}>
              <Icon size={18} strokeWidth={1.7} className="text-[#aaa9ff]" />
              <p className="mt-10 text-5xl font-bold tracking-[-.065em] text-white">{value}</p>
              <p className="mt-2 text-sm text-[#b8b9c7]">{label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
