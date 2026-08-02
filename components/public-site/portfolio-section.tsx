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
      "https://cdn.discordapp.com/attachments/1530525803513647156/1532139681242681424/Frame_472.png?ex=6a6bc3c5&is=6a6a7245&hm=3abd13a9001bb8229f751bd44c209d8c87e9c194534c0079da5c31f1ccce505b&",
  },
  {
    title: "AdviceBot | TikTok #1",
    category: "wideo",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1532141673356722306/ssstik.io_advicebot0_1785361428652.mp4?ex=6a7062e0&is=6a6f1160&hm=6b776a87f5e4e26da1db04ed3e41dc26384d5f8b15e51b79712568a552d04453&",
  },
  {
    title: "AdviceBot | TikTok #2",
    category: "wideo",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533479473339568209/YTDown.com_Shorts_Idealnie-na-Twoj-serwer-Discord-advicebo_Media_v_VevWcAcgA_001_1080p.mp4?ex=6a70a38d&is=6a6f520d&hm=cb7363cec3d1513e123c97dca37fc7857f36e8ca42e9677c7da89067ba42492f&",
  },
  {
    title: "mcgramy.pl | TikTok #1",
    category: "wideo",
    media: "https://cdn.discordapp.com/attachments/1530525803513647156/1533482309859409980/ssstik.io_mcgramy.pl_1785681063761.mp4?ex=6a70a631&is=6a6f54b1&hm=bec8669fffc61d2f14b21821c6f352ea6b9cb98866f9ab808cbc18cbae180044&",
  },
    {
    title: "Wąsaty Jeżor",
    category: "social",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533476015169339412/wasaty_1.png?ex=6a70a054&is=6a6f4ed4&hm=e75d10ebaadd31d06a12dd1a0354766ee5a0c52b877037668bc45660c3e39579&",
  },
  {
    title: "mcgramy.pl",
    category: "social",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533475892704055326/mcgramy_1.png?ex=6a70a037&is=6a6f4eb7&hm=8d7f60f003b3136fac3694444c778c05a587db2053d99cf317666b0d44e172bd&",
  },
  {
    title: "AdviceBot | Social Media",
    category: "social",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533476994740785223/advice_1.png?ex=6a70a13e&is=6a6f4fbe&hm=bacca050cf420f99664c4952f23bfc24d754a194ce162b9780be4135d44e469c&",
  },



  {
    title: "zentrify",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533477946755649686/zentrify.png?ex=6a70a221&is=6a6f50a1&hm=1a459c6f99c9f11de432652ef2adfd6fd201c49bdddad478c06892556176428b&",
  },
  {
    title: "mcgramy.pl | Banner #1",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533477964073795644/mcg.png?ex=6a70a225&is=6a6f50a5&hm=e478ade4f113096c44a55de840de21f8a4eb66674769a7e991c0214b76f94471&",
  },
  {
    title: "detailing.detmer",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533477976484872293/detailing.png?ex=6a70a228&is=6a6f50a8&hm=519c161ebe709e6991bfa78545d1a26c60bd05fe0ffe2f5c9deaa1cef663d05a&",
  },
  {
    title: "hostero",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533477992511180891/Hostero.png?ex=6a70a22c&is=6a6f50ac&hm=57612fb5f118e041c72dd62e056c0c597f41d547a6c34027f5b74989bde253b5&",
  },
  {
    title: "e-liq",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533478005496746075/stormzone_x_eliq.png?ex=6a70a22f&is=6a6f50af&hm=6ac8053c537e69447cbcc1b89048633f8a45ccf2ce6d9f683394d2be80ec1df5&",
  },
  {
    title: "mcgramy.pl | Banner #2",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533478016536019044/lobby_banner_pvp.png?ex=6a70a231&is=6a6f50b1&hm=b06ab355abdcfb117726a050cfe2e4a08bdca81b767682c1d2bc16ef8d91af06&",
  },
  {
    title: "AdviceBot | Miniaturka #1",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533478026002694224/miniatura.png?ex=6a70a234&is=6a6f50b4&hm=ee19a8a60291e6a47dc3cd74dcf83c540d357dffa1c83fd3196e46521397f18f&",
  },
  {
    title: "AdviceBot | Miniaturka #2",
    category: "grafika",
    media:
      "https://cdn.discordapp.com/attachments/1530525803513647156/1533478026002694224/miniatura.png?ex=6a70a234&is=6a6f50b4&hm=ee19a8a60291e6a47dc3cd74dcf83c540d357dffa1c83fd3196e46521397f18f&",
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