"use client";

import { motion } from "framer-motion";

const values = [
  [
    "Szybko, ale świadomie",
    "Krótka droga od decyzji do publikacji.",
  ],
  [
    "Design bez kompromisów",
    "Detale, które budują zaufanie do marki.",
  ],
  [
    "Wspólny kierunek",
    "Transparentny proces i jedno źródło prawdy.",
  ],
  [
    "Wyniki, nie hałas",
    "Kreatywność połączona z konkretnym celem.",
  ],
] as const;

export function ValuesSection() {
  return (
    <section className="shell py-28">
      <p className="eyebrow">
        Dlaczego desflow
      </p>

      <h2 className="mt-2 max-w-xl text-4xl font-bold tracking-[-.045em]">
        Dobre pomysły potrzebują świetnego wykonania.
      </h2>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {values.map(([title, description], index) => (
          <motion.article
            key={title}
            whileHover={{ y: -5 }}
            className="card p-6"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ecebff] font-bold text-[#5b5cf0]">
              0{index + 1}
            </span>

            <h3 className="mt-6 font-bold">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#686b7d]">
              {description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}