"use client";

import { useMemo, useState } from "react";

const filters = [
  {
    label: "Wszystkie",
    value: "all",
  },
  {
    label: "Grafika",
    value: "grafika",
  },
  {
    label: "Montaż Wideo",
    value: "wideo",
  },
  {
    label: "Social Media",
    value: "social",
  },
] as const;

const projects = [
  {
    title: "Surova",
    category: "grafika",
    media:
      "/surova.png",
  },
  {
    title: "AdviceBot | TikTok #1",
    category: "wideo",
    media:
      "/advice_tt_1.mp4",
  },
  {
    title: "AdviceBot | TikTok #2",
    category: "wideo",
    media:
      "advice_tt_2.mp4",
  },
  {
    title: "mcgramy.pl | TikTok #1",
    category: "wideo",
    media: "mcgramy_tt_1.mp4",
  },
    {
    title: "Wąsaty Jeżor",
    category: "social",
    media:
      "wasaty_1.png",
  },
  {
    title: "mcgramy.pl",
    category: "social",
    media:
      "mcgramy_1.png",
  },
  {
    title: "AdviceBot | Social Media",
    category: "social",
    media:
      "advice_1.png",
  },



  {
    title: "zentrify",
    category: "grafika",
    media:
      "zentrify.png",
  },
  {
    title: "mcgramy.pl | Banner #1",
    category: "grafika",
    media:
      "mcg.png",
  },
  {
    title: "detailing.detmer",
    category: "grafika",
    media:
      "detailing.png",
  },
  {
    title: "hostero",
    category: "grafika",
    media:
      "Hostero.png",
  },
  {
    title: "e-liq",
    category: "grafika",
    media:
      "stormzone_x_eliq.png",
  },
  {
    title: "mcgramy.pl | Banner #2",
    category: "grafika",
    media:
      "lobby_banner_pvp.png",
  },
  {
    title: "AdviceBot | Miniaturka #1",
    category: "grafika",
    media:
      "miniatura.png",
  },
  {
    title: "AdviceBot | Miniaturka #2",
    category: "grafika",
    media:
      "miniatura2.png",
  },
];

export function PortfolioSection({
  onImageClick,
}: {
  onImageClick: (image: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;

    return projects.filter(
      (project) => project.category === activeFilter
    );
  }, [activeFilter]);

  return (
    <section id="portfolio" className="shell py-28">
      <p className="eyebrow">Wybrane realizacje</p>

      <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
        Praca, która pracuje.
      </h2>

      <div className="mt-10 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
              activeFilter === filter.value
                ? "border-purple-500 bg-purple-500 text-black shadow-lg shadow-purple-500/20"
                : "border-white/10 bg-black/15 text-black/70 hover:border-white/20 hover:bg-black/10 hover:text-gray-600 cursor-pointer"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => {
          const iswideo =
            project.media.includes(".mp4") ||
            project.media.includes(".webm") ||
            project.media.includes(".mov");

          return (
            <button
              key={project.title}
              onClick={() => onImageClick(project.media)}
              className="group relative overflow-hidden rounded-3xl text-left"
            >
              {iswideo ? (
                <video
                  src={project.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <img
                  src={project.media}
                  alt={project.title}
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />

              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/70 to-transparent p-6">
                <span className="inline-flex rounded-full bg-purple-950 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-400">
                  {project.category}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-white">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  Kliknij, aby zobaczyć projekt
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}