const testimonials = [
    [
      "Jakub B.",
      "CEO, mcgramy.pl",
      "Zespół wykonał dla mnie profesjonalnie cały branding mojej marki oraz zarządza moimi profilami social media.",
    ],
    [
      "Michał Sz.",
      "CEO, Taniej.",
      "Cała szata graficzna została wykonana dla mnie ekspresowo oraz dokładnie tak jak chciałem.",
    ],
    [
      "Daniel Pawlak (DeeJayPallaside)",
      "YouTuber",
      "Zespół zarządzał moją społecznością Discord przez dłuższy czas, sprawował się przy tym perfekcyjnie.",
    ],
  ] as const;
  
  export function TestimonialsSection() {
    return (
      <section
        id="reviews"
        className="shell py-28"
      >
        <p className="eyebrow">
          Opinie
        </p>
  
        <h2 className="mt-2 text-4xl font-bold tracking-[-.045em]">
          Partnerstwo, które czuć.
        </h2>
  
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map(([name, role, text]) => (
            <article
              key={name}
              className="card p-7"
            >
              <div className="flex gap-1 text-[#f2aa3b]">
                ★★★★★
              </div>
  
              <p className="my-6 leading-7">
                „{text}”
              </p>
  
              <b>{name}</b>
  
              <p className="text-sm text-[#686b7d]">
                {role}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }