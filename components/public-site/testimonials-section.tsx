const testimonials = [
    [
      "Julia Nowak",
      "CEO, Noma",
      "Zespół połączył świeże spojrzenie z bardzo konkretnym podejściem do biznesu.",
    ],
    [
      "Michał Krawiec",
      "CMO, Vetra",
      "Najsprawniejszy proces kreatywny, z jakim pracowaliśmy.",
    ],
    [
      "Anna Zielińska",
      "Founder, Mave",
      "Od strategii po launch — wszystko miało sens i charakter.",
    ],
  ] as const;
  
  export function TestimonialsSection() {
    return (
      <section
        id="opinie"
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