import { ArrowUpRight, Plus } from "lucide-react";

const questions = [
  ["Ile trwa realizacja projektu?", "Zależnie od zakresu: identyfikacja zwykle 3–5 tygodni, a strona 4–8 tygodni. Przed startem przedstawiamy konkretny harmonogram."],
  ["Czy można zacząć od jednej usługi?", "Tak. Możemy wejść w pojedynczy projekt lub zostać Twoim stałym zespołem kreatywnym."],
  ["Jak wygląda wycena?", "Po krótkiej rozmowie wysyłamy jasną propozycję zakresu, terminów i budżetu."],
];

export function FaqSection() {
  return (
    <section id="faq" className="shell py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-.055em] md:text-5xl">Kilka dobrych pytań.</h2>
          <p className="mt-5 max-w-sm leading-7 text-[#686b7d]">Wolimy, gdy wszystko jest jasne jeszcze przed pierwszym spotkaniem.</p>
          <a className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#5b5cf0]" href="#kontakt">Zadaj własne pytanie <ArrowUpRight size={16} /></a>
        </div>
        <div className="grid gap-3">
          {questions.map(([question, answer], index) => (
            <details className="faq-item group" key={question}>
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 font-bold md:p-6">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eeeeff] text-xs text-[#5b5cf0]">0{index + 1}</span>
                <span className="flex-1">{question}</span>
                <span className="faq-plus grid h-8 w-8 place-items-center rounded-full"><Plus size={18} /></span>
              </summary>
              <div className="px-5 pb-6 pl-18 pr-12 text-sm leading-7 text-[#686b7d] md:px-6 md:pb-7 md:pl-22">{answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
