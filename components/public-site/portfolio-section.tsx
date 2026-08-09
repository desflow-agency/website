"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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
    media: "/surova.png",
  },
  {
    title: "AdviceBot | TikTok #1",
    category: "wideo",
    media: "/advice_tt_1.mp4",
  },
  {
    title: "AdviceBot | TikTok #2",
    category: "wideo",
    media: "/advice_tt_2.mp4",
  },
  {
    title: "mcgramy.pl | TikTok #1",
    category: "wideo",
    media: "/mcgramy_tt_1.mp4",
  },
  {
    title: "Wąsaty Jeżor",
    category: "social",
    media: "/wasaty_1.png",
  },
  {
    title: "mcgramy.pl",
    category: "social",
    media: "/mcgramy_1.png",
  },
  {
    title: "AdviceBot | Social Media",
    category: "social",
    media: "/advice_1.png",
  },
  {
    title: "zentrify",
    category: "grafika",
    media: "/zentrify.png",
  },
  {
    title: "mcgramy.pl | Banner #1",
    category: "grafika",
    media: "/mcg.png",
  },
  {
    title: "detailing.detmer",
    category: "grafika",
    media: "/detailing.png",
  },
  {
    title: "hostero",
    category: "grafika",
    media: "/Hostero.png",
  },
  {
    title: "e-liq",
    category: "grafika",
    media: "/stormzone_x_eliq.png",
  },
  {
    title: "mcgramy.pl | Banner #2",
    category: "grafika",
    media: "/lobby_banner_pvp.png",
  },
  {
    title: "AdviceBot | Miniaturka #1",
    category: "grafika",
    media: "/miniatura.png",
  },
  {
    title: "AdviceBot | Miniaturka #2",
    category: "grafika",
    media: "/miniatura2.png",
  },
];

export type PortfolioProject = (typeof projects)[number];

export function PortfolioSection({
  onImageClick,
}: {
  onImageClick: (
    project: PortfolioProject,
    index: number,
    total: number
  ) => void;
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter(
      (project) => project.category === activeFilter
    );
  }, [activeFilter]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setCursor({
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  const hideCursor = () => {
    setCursor((previous) => ({
      ...previous,
      visible: false,
    }));
  };

  return (
    <section className="w-full pt-12" id="portfolio">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b5cf0]">
          Wybrane realizacje
        </p>

        <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
          Praca, która pracuje.
        </h2>

        {/* FILTRY */}

        <div className="mt-10 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.value
                  ? "border-[#5b5cf0] bg-[#5b5cf0] text-black shadow-lg shadow-purple-500/20"
                  : "cursor-pointer border-black/10 bg-black/15 text-black/70 hover:border-black/20 hover:bg-black/10 hover:text-gray-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* GRID */}

        <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => {
            const isVideo =
              project.media.endsWith(".mp4") ||
              project.media.endsWith(".webm") ||
              project.media.endsWith(".mov") ||
              project.media.endsWith(".ogg");

            return (
              <button
                key={project.title}
                type="button"
                onClick={() =>
                  onImageClick(
                    project,
                    index,
                    filteredProjects.length
                  )
                }
                onMouseEnter={() => {
                  setCursor((previous) => ({
                    ...previous,
                    visible: true,
                  }));
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={hideCursor}
                className="
                  group
                  relative
                  w-full
                  min-w-0
                  cursor-none
                  overflow-hidden
                  rounded-3xl
                  text-left
                "
              >
                {/* MEDIA */}

                {isVideo ? (
                  <video
                    src={project.media}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="
                      block
                      h-80
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.04]
                    "
                  />
                ) : (
                  <img
                    src={project.media}
                    alt={project.title}
                    loading="lazy"
                    className="
                      block
                      h-80
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.04]
                    "
                  />
                )}

                {/* SUBTELNY OVERLAY */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-black/0
                    transition-all
                    duration-500
                    group-hover:bg-black/20
                  "
                />

                {/* FIOLETOWY GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    [background:radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.12),transparent_65%)]
                  "
                />

                {/* CONTENT */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    bg-linear-to-t
                    from-black
                    via-black/70
                    to-transparent
                    p-6
                  "
                >
                  <span className="inline-flex rounded-full bg-purple-950 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-400">
                    {project.category}
                  </span>

                  <h3 className="mt-3 text-2xl font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/70 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                    Kliknij, aby zobaczyć projekt
                  </p>
                </div>

                {/* MOBILE */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-5
                    top-5
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/30
                    text-white
                    backdrop-blur-md
                    md:hidden
                  "
                >
                  <ArrowUpRight size={18} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================= */}
      {/* DESKTOP CURSOR */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-9998
          hidden
          md:block
        "
        style={{
          left: cursor.x,
          top: cursor.y,
          opacity: cursor.visible ? 1 : 0,
          transition: "opacity 150ms ease",
        }}
      >
        <div
          className="
            flex
            h-14
            w-14
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-[#8d8dff]
            text-black
            shadow-[0_8px_30px_rgba(168,85,247,0.35)]
            transition-transform
            duration-200
            ease-out
          "
        >
          <span className="flex items-center gap-0.5 text-[7px] font-bold uppercase tracking-[0.12em]">
            Zobacz
            <ArrowUpRight
              size={12}
              strokeWidth={2.5}
            />
          </span>
        </div>
      </div>
    </section>
  );
}