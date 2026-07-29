const projects = [
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
  ] as const;
  
  const titles = [
    "Noma Coffee",
    "Vetra Studio",
    "Atlas Health",
  ] as const;
  
  export function PortfolioSection({
    onImageClick,
  }: {
    onImageClick: (image: string) => void;
  }) {
    return (
      <section
        id="portfolio"
        className="shell py-28"
      >
        <p className="eyebrow">
          Wybrane projekty
        </p>
  
        <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
          Praca, która pracuje.
        </h2>
  
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {projects.map((source, index) => (
            <button
              key={source}
              onClick={() => onImageClick(source)}
              className="group relative overflow-hidden rounded-3xl text-left"
            >
              <img
                src={source}
                alt={`Projekt demonstracyjny ${index + 1}`}
                className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
              />
  
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 p-6 text-white">
                <b>{titles[index]}</b>
  
                <small className="ml-2 opacity-70">
                  Branding / Digital
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }