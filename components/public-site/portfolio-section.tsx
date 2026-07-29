const projects = [
  "https://cdn.discordapp.com/attachments/1530525803513647156/1532139681242681424/Frame_472.png?ex=6a6bc3c5&is=6a6a7245&hm=3abd13a9001bb8229f751bd44c209d8c87e9c194534c0079da5c31f1ccce505b&",
  "https://cdn.discordapp.com/attachments/1530525803513647156/1532141673356722306/ssstik.io_advicebot0_1785361428652.mp4?ex=6a6bc5a0&is=6a6a7420&hm=2d472e5abc8cc2e52d620983a28805a310273b0b368e829ec41949dd2364364f&",
  "https://cdn.discordapp.com/attachments/1530525803513647156/1532142504114262178/Zrzut_ekranu_2026-07-29_234708.png?ex=6a6bc666&is=6a6a74e6&hm=912d3d6ad10d7fbc21beb506fba208ba36ceecfb99e2d87ef1051383408ec28c&",
] as const;

const titles = [
  "Surova",
  "AdviceBot",
  "Wąsaty Jeżor",
] as const;

export function PortfolioSection({
  onImageClick,
}: {
  onImageClick: (image: string) => void;
}) {
  return (
    <section id="portfolio" className="shell py-28">
      <p className="eyebrow">Wybrane projekty</p>

      <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
        Praca, która pracuje.
      </h2>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {projects.map((source, index) => {
          const isVideo =
            source.includes(".mp4") ||
            source.includes(".webm") ||
            source.includes(".mov");

          return (
            <button
              key={source}
              onClick={() => onImageClick(source)}
              className="group relative overflow-hidden rounded-3xl text-left"
            >
              {isVideo ? (
                <video
                  src={source}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <img
                  src={source}
                  alt={`Projekt demonstracyjny ${index + 1}`}
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}

              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 p-6 text-white">
                <b>{titles[index]}</b>

                <small className="ml-2 opacity-70">
                  Projekt wykonany przez desflow
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}